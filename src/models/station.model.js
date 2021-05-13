import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
    addr: {type: String, required: true},
    stId: {type: String, required: true},
    stNm: {type: String, required: true},
    chgerId: {type: String, required: true},
    chgerStat: {type: String, required: true},
    type: {type: String, required: true},
    lat: {type: String, required: true},
    lng: {type: String, required: true},
    time: {type: String, required: true}
});

export default mongoose.model("Station", stationSchema);