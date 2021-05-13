import express from 'express';
import compression from 'compression';
import cors from 'cors';

import indexRouter from './routers/index.router.js';
import { connectMongoDB } from './util/database.js';
import errorHandler from './util/errorHandler.js';
import { dataUpdateRoutine } from './util/dataUpdateRoutine.js';
import { apiResponser } from './util/apiResponser.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(compression());
app.use(cors({ origin: '*' }));

connectMongoDB();
dataUpdateRoutine();

app.use((err, req, res, next) => {
  if (err) {  
    return errorHandler(err, req, res, next);
app.use("/", indexRouter);

app.use((err, req, res) => {
  if (err) {
    return errorHandler(err, req, res);
  }

  next()
})

app.use((req, res) => {
  apiResponser({ req, res, statusCode: 404, message: 'Not Found Exception' })
})

app.listen(port);

console.log(`server is running on port ${port}`);
