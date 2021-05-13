import express from 'express';
import { indexRouter } from './routers/index.router.js';
import { connectMongoDB } from './util/database.js';
import errorHandler from './util/errorHandler.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use("/", indexRouter);

connectMongoDB();

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