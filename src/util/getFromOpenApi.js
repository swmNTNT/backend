import axios from 'axios';

const kecoURL = 'http://apis.data.go.kr/B552584/EvCharger/getChargerInfo?serviceKey=g1Orb9XNX8ZMrCVO0NdBaJF1vpBBfP3eLbVDvyiy%2BdJGPEjlzXgxGGMS9h6gq2VtA9Us9gPWHZPrrTf9SG2WWw%3D%3D&numOfRows=100000&pageNo=1';

let info = []

export const getKecoInfo = axios.get(kecoURL).then(function(response) {
	let kecoItems = response.data.items[0].item;
	
	for (const each of kecoItems) {
		info.push({
			addr: each.addr, // 충전소 주소
			stId: each.statId, // 충전소 id
			stNm: each.statNm, // 충전소명
			chgerId: each.chgerId, // 충전기 id
			chgerStat: each.stat, // 충전기 상태코드
			type: each.chgerType, // 충전방식
			lat: each.lat, // 위도
			lng: each.lng, // 경도 
			time: each.statUpdDt // 충전기 상태 갱신 시각
		});
	};
    console.log(info);
});
