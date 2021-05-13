import express from 'express';
import compression from 'compression';

import { indexRouter } from './routers/index.router.js';
import { connectMongoDB } from './util/database.js';
import errorHandler from './util/errorHandler.js';
import { dataUpdateRoutine } from './util/dataUpdateRoutine.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(compression());
app.use("/", indexRouter);


connectMongoDB();
dataUpdateRoutine()

app.use((err) => {
  if (err) {
    return errorHandler(err);
  }

  next()
})

app.use(() => {
  return res.status(404).json({ message: 'Not found exception' })
})

app.listen(port);
console.log(`server is running on port ${port}`);