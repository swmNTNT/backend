import dayjs from 'dayjs';
import { apiResponser } from './apiResponser.js';
import { logger } from './logger.js';

const errorHandler = (err, req, res, next) => {
  const errorObject = {
    timestamp: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss Z'),
    message: err?.message,
    statusCode: err?.status,
    stack: err?.stack
  }

  logger.error(JSON.stringify(errorObject));

  apiResponser({ req, res, statusCode: err?.status || 500, data: errorObject, message: err?.message })
}

export default errorHandler;
