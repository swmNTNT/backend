import { promisify } from 'util';
import { getChargerInfo } from './getFromOpenApi.js';
import Station from '../models/station.model.js'
import { logger } from './logger.js';
import redisClient from './redisClient.js';
import { sendMail } from './mailer.js';

export const sleepPromise = promisify(setTimeout);

export const dataUpdateRoutine = async (req, res, next) => {
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

    // Redis 비교부
    const redisStationsIds = await redisClient.keys('*')
    for (const stationId of redisStationsIds) {
      const chargers = await Station.find({ stId: stationId })
      for (const charger of chargers) {
        if (charger.chgerStat === "2") {
          const redisMailReceivers = await redisClient.lrange(stationId, 0, -1)
          const stationInfo = {
            name: charger.stNm,
            address: charger.addr
          }

          for (const receiver of redisMailReceivers) {
            sendMail({ type: "available", stationInfo: stationInfo, emailReceiver: receiver })
          }
        }
      }
    }
    
    break;
  }
}