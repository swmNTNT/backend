import { Router } from 'express';
import Station from '../models/station.model.js'
import { apiResponser } from '../util/apiResponser.js';

const stationRouter = Router();

stationRouter.get('/all', async (req, res, next) => {
  const stations = await Station.find();

  res.json({ length: stations.length, data: stations })
});

stationRouter.get('/:stationId', async (req, res, next) => {
  const { stationId } = req.params;

  try {
    const targetStations = await Station.find({ stId: stationId })

    apiResponser({ req, res, data: targetStations, message: "A station infomation" })
  } catch (e) {
    next(e)
  }
})

stationRouter.post('/nearby', async (req, res, next) => {
  const { minLat, maxLat, minLng, maxLng } = req.body;

  try {
    const targetStations = await Station.find({
      lat: { $gte: minLat, $lte: maxLat },
      lng: { $gte: minLng, $lte: maxLng }
    })

    apiResponser({ req, res, data: targetStations, message: "Adjacent stations" })
  } catch (e) {
    next(e);
  }
})

export default stationRouter;
