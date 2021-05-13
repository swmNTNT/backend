import { Router } from 'express';
import userRouter from './user.router.js';
import stationRouter from './station.router.js'
import { getChargerInfo } from '../util/getFromOpenApi.js'

const indexRouter = Router();

indexRouter.get('/', (req, res, next) => {
  res.status(200).json({ message: "hello world!" });
});

indexRouter.get('/test', async (req, res, next) => {
  try {
    const openApiData = await getChargerInfo(1);
    res.json(openApiData)
  } catch (e) {
    next(e)
  }
})

indexRouter.use("/user", userRouter);
indexRouter.use("/station", stationRouter);

export default indexRouter;
