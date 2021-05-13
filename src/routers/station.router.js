import { Router } from 'express';
import Station from '../models/station.model.js'

const stationRouter = Router();

stationRouter.get('/', async (req, res, next) => {
  const stations = await Station.find();

  res.json({ length: stations.length, data: stations})
});

stationRouter.get('/sp', async (req, res, next) => {
  const station = await Station.find({ stId: "EV002259" })

  res.json(station)
})

stationRouter.get('/ds', async (req, res, next) => {
  const station = await Station.find({ 
    lat: { $gte: "37.624066871535", $lte: "37.800000000000" },
    lng: { $gte: "126.1121671726", $lte: "128.000000000000" }
  })

  res.json(station)
})

export default stationRouter;
