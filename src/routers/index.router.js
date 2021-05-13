import {Router} from 'express';
import userRouter from './user.router.js';

export const indexRouter = Router();

indexRouter.get('/', (req,res,next) => {
    res.status(200).json({message: "hello world!"});
});

indexRouter.use("/user", userRouter);

// indexRouter.get('/:name', (req,res,next) => {
//     const {name} = req.params;
//     const {age} = req.query;

//     res.status(200).json({message: `my name is : ${name} and your age is ${age}`});
// });

// indexRouter.post('/:id', (req,res,next) => {
//     const {id} = req.params;
//     const {email, hello} = req.body;

//     res.status(200).json({message: `userId = ${id}, email = ${email} ${hello}`});
// });