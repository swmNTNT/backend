import axios from 'axios';

export const getChargerInfo = async (idx) => {
	var info = [];	
	
	let kecoURL = `http://apis.data.go.kr/B552584/EvCharger/getChargerInfo?serviceKey=g1Orb9XNX8ZMrCVO0NdBaJF1vpBBfP3eLbVDvyiy%2BdJGPEjlzXgxGGMS9h6gq2VtA9Us9gPWHZPrrTf9SG2WWw%3D%3D&numOfRows=7000&pageNo=${idx+1}`;
	const kecoItems = await (await axios.get(kecoURL)).data.items[0].item
	
	if (Array.isArray(kecoItems)) {
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
	}

	return info;
}
