import { Router } from 'express';
import User from "../models/user.model.js"; //유저 테이블 가져오기!
import {auth} from '../util/auth.js';
import mongoose from 'mongoose';

const userRouter = Router();

userRouter.post('/register', (req, res, next) => {
    try {
    // 회원 가입할 때 필요한 정보들을 client로부터 가져와서 데이터베이스에 넣는다.
    const user = new User(req.body);
    
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({ success: true })
    })
    } catch (e) {
        next(e)
    }
})

userRouter.post('/login', (req, res) => {
    // 요청된 이메일을 데이터베이스에서 확인
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        
        // 있다면 비밀번호가 맞는 비밀번호인지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
            
            // 비밀번호까지 일치한다면 유저에게 토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                
                // 토큰을 쿠키에 저장
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})

userRouter.get('/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        email: req.user.email,
        name: req.user.name
    })
})

userRouter.get('/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id },
        { token: "" }
        , (err, user) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({ success: true })
        })
})
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