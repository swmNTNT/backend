import { Router } from 'express';
import { getDistance } from 'geolib';
import Station from '../models/station.model.js'
import redisClient from '../util/redisClient.js'
import { apiResponser } from '../util/apiResponser.js';
import { sendMail } from '../util/mailer.js';

const stationRouter = Router();

function compare(a, b) {
  if (a.distanceFrom > b.distanceFrom) return 1;
  if (b.distanceFrom > a.distanceFrom) return -1;

  return 0;
}

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

    resultValues.sort(compare)

    apiResponser({ req, res, data: resultValues, message: "Adjacent stations in 2km." })
  } catch (e) {
    next(e);
  }
})

stationRouter.get('/reserve/:stId', async (req, res, next) => {
  const { stId: stationId } = req.params;

  try {
    const reserveEmailList = await redisClient.lrange(stationId, 0, -1);

    apiResponser({ req, res, data: reserveEmailList, message: `There're ${reserveEmailList.length} people in waiting queue` })
  } catch (e) {
    next(e);
  }
})

stationRouter.post('/reserve', async (req, res, next) => {
  const { email, stId: stationId } = req.body;

  try {
    const stationData = await Station.find({ stId: stationId });

    if (stationData.length === 0) {
      return apiResponser({ req, res, statusCode: 400, message: "Not a station" })
    }

    const stationStatus = {
      availableChargers: 0,
      maxCharger: stationData.length,
      stationId: stationData[0].stId,
      address: stationData[0].addr,
      name: stationData[0].stNm,
    }

    for (const data of stationData) {
      if (data.chgerStat === "2") {
        stationStatus.availableChargers++
      }
    }

    // console.log(stationStatus)

    if (stationStatus.availableChargers === 0) {
      await redisClient.lpush(stationId, email);
      const emailReceivers = await redisClient.lrange(stationId, 0, -1)

      console.log(emailReceivers)

      sendMail({ type: "reserve", stationInfo: stationStatus, mailReceiver: email })
      apiResponser({ req, res, data: stationStatus, message: 'Now you are in queue' })
    } else {
      apiResponser({ req, res, statusCode: 400, data: stationStatus, message: 'You cannot reserve charger' })
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

    apiResponser({ req, res, data: stationInfo, message: 'Show station\'s status' })
  } catch (e) {
    next(e);
  }
})


export default stationRouter;
