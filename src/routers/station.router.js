import { Router } from 'express';
import pkg from 'geolib';
import Station from '../models/station.model.js'
import redisClient from '../util/redisClient.js'
import { apiResponser } from '../util/apiResponser.js';

const stationRouter = Router();
const { getDistance } = pkg;

stationRouter.post('/nearby', async (req, res, next) => {
  const { minLat, maxLat, minLng, maxLng, userLat, userLng } = req.body;

  try {
    const targetStations = await Station.find({
      lat: { $gte: minLat, $lte: maxLat },
      lng: { $gte: minLng, $lte: maxLng }
    }).lean()

    const resultValues = []

    for (const station of targetStations) {
      const stationStatus = { ...station }
      const distance = getDistance(
        {
          lat: userLat, lng: userLng
        },
        {
          lat: station.lat, lng: station.lng
        }
      )
      
      if (distance <= 2000) {
        stationStatus.distanceFrom = distance
        resultValues.push(stationStatus);
      }
    }

    apiResponser({ req, res, data: resultValues, message: "Adjacent stations" })
  } catch (e) {
    next(e);
  }
})

stationRouter.get('/reserve/:stId', async (req, res, next) => {
  const { stId: stationId } = req.params;

  try {
    const reserveEmailList = await redisClient.lrange(stationId, 0, -1);

    apiResponser({ req, res, data: reserveEmailList, message: 'Many Many Queue here' })
  } catch (e) {
    next(e);
  }
})

stationRouter.post('/reserve', async (req, res, next) => {
  const { email, stId: stationId } = req.body;

  try {
    const stationData = await Station.find({ stId: stationId });

    const stationStatus = {
      availableCharger: 0,
      maxCharger: stationData.length,
      stationId: stationData[0].stId,
      address: stationData[0].addr,
      name: stationData[0].stNm,
    }

    for (const data of stationData) {
      if (data.chgerStat === "2") {
        stationStatus.availableCharger++
      }
    }

    // console.log(stationStatus)

    if (stationStatus.availableCharger === 0) {
      redisClient.lpush(stationId, email);
      // email 리스트를 참고하여 이메일 보내기
      apiResponser({ req, res, data: stationStatus, message: 'Now you are in queue' })
    } else {
      apiResponser({ req, res, data: stationStatus, message: 'You cannot reserve charger' })
    }
  } catch (e) {
    next(e);
  }
})


stationRouter.get('/:stId', async (req, res, next) => {
  const { stId: stationId } = req.params;

  try {
    const targetChargers = await Station.find({ stId: stationId })
    const stationInfo = {
      address: targetChargers[0].addr,
      name: targetChargers[0].stNm,
      numOfChargers: targetChargers.length,
      availableChargers: 0,
      chargers: []
    }

    for (const charger of targetChargers) {
      if (charger.chgerStat === "2") {
        stationInfo.availableChargers++
      }

      stationInfo.chargers.push(charger)
    }

    apiResponser({ req, res, data: stationInfo, message: 'Many Many Queue here' })
  } catch (e) {
    next(e);
  }
})


export default stationRouter;
