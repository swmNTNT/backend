import { promisify } from 'util';
import { getChargerInfo } from './getFromOpenApi.js';
import Station from '../models/station.model.js'
import { logger } from './logger.js';

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


    break;
  }
}