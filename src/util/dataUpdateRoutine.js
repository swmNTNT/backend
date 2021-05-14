import { promisify } from 'util';
import { getChargerInfo } from './getFromOpenApi.js';
import Station from '../models/station.model.js'
import { logger } from './logger.js';
import redisClient from './redisClient.js';
import { sendMail } from './mailer.js';

export const sleepPromise = promisify(setTimeout);

export const dataUpdateRoutine = async (req, res, next) => {
  try {
    while (true) {
      logger.info(`*** Started data update routine`)
      let bulkData = []
      for (let i = 0; i < 10; i++) {
        let dataWithPage = await getChargerInfo(i);
        bulkData = [...bulkData, ...dataWithPage]
      }

      await Station.remove()
      await Station.insertMany(bulkData)
      logger.info(`*** Ended data update routine`)

      // 레디스 비교부
      const redisStationsIds = await redisClient.keys('*')
      // 레디스에 존재하는 충전소들에 대해(예약)
      for (const stationId of redisStationsIds) {
        // 업데이트된 충전기들(OpenAPI 데이터)를 데이터베이스에서 가져와서
        const chargers = await Station.find({ stId: stationId })
        // 각 충전기들에 대해
        for (const charger of chargers) {
          // 충전이 가능한 상태이면
          if (charger.chgerStat === "2") {
            // 해당 충전소를 예약한 이메일을 레디스로부터 가져오고
            const redisMailReceivers = await redisClient.lrange(stationId, 0, -1)
            const stationInfo = {
              name: charger.stNm,
              address: charger.addr
            }

            // 각 이메일로 충전소가 사용 가능하다고 발송
            for (const receiver of redisMailReceivers) {
              sendMail({ type: "available", stationInfo: stationInfo, emailReceiver: receiver })
            }

            // 메일을 발송했으므로 레디스의 값 삭제
            redisClient.del(stationId)
            break;
          }
        }
      }
      // 최초 1회만 받아오기 위해 break 사용
      break;
    }
  } catch (e) {
    next(e)
  }
}