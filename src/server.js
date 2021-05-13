import express from 'express';
import {indexRouter} from './routers/index.router.js';
import { connectMongoDB } from './util/database.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use("/", indexRouter);

connectMongoDB();
app.listen(port);

console.log(`server is running on port ${port}`);