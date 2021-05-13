import { Router } from 'express';
import User from "../models/user.model.js"; //유저 테이블 가져오기!

const userRouter = Router();

//GET : 모든 유저 리스트 response
userRouter.get('/', async (req, res, next) => {
    const users = await User.find(); //모든 유저를 가져온다.
    
    res.status(200).json(users); //모든 유저 response
});

//GET : 특정 유저만 response
userRouter.get('/:name', async (req, res, next) => {
    const { name } = req.params;
    const findUser = await User.findOne({ name }); //유저테이블에서 name을 가진사람을 찾는다.

    res.json(findUser); //찾아온 유저를 response
});

//POST : 유저 삽입
userRouter.post('/', async (req, res, next) => {
    console.log(req.body);
    const createResult = await User.create({ name, email }); //user를 테이블에 넣는다.

    res.json(createResult); 
});

//PUT : 유저 이메일 업데이트
userRouter.put('/:name', async (req, res, next) => {
    const { name } = req.params;
    const { email } = req.body;

    const updateUser = await User.findOneAndUpdate(
        { name },
        { email },
        { returnNewDocument: true }
    );
    res.json(updateUser);
});



export default userRouter;