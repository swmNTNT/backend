import nodemailer from 'nodemailer'
import dayjs from 'dayjs'

const myEmail = 'cactuskatusa1@gmail.com'
const myPassword = 'katusacactus1!'

export const sendMail = async ({ type, stationInfo, mailReceiver }) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        //user: process.env.NODEMAILER_USER,
        user: myEmail,
        //pass: process.env.NODEMAILER_PASS,
        pass: myPassword,
      },
    });

    const { address, name } = stationInfo;

    let subjectData = "";
    let htmlData = "";
    if (type === "reserve") {
      subjectData = `예약완료메일`;
      htmlData = `<h1>예약되었습니다.</h1><h3>충전소 이름: ${name}</h3><h3>충전소 위치: ${address}</h3><h3>예약 시각 : ${dayjs(new Date().now).format('YYYY-MM-DD HH:mm:ss')}</h3>`
    }
    else if (type === "available") {
      subjectData = `빨리충전하러가세요`;
      htmlData = `<h1>자리가 비었습니다.</h1><h3>충전소 이름: ${name}</h3><h3>충전소 위치: ${address}</h3>`
    }

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"피CAR츄" <${myEmail}>`,
      to: `${mailReceiver}`, //사용자 이메일 받아와야됨
      // to: `${friendEmail}`,
      subject: `${subjectData}`, //메시지유형1, 메시지유형2
      html: `${htmlData}`, //메세지유형1 데이터, 메세지유형2 데이터
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  } catch (e) {
    throw e;
  }

};
