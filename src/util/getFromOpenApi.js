import axios from 'axios';

export const getKecoInfo = async () => {
	var info = []
	
	for (var i = 1; i < 9; i ++) {
		let kecoURL = `http://apis.data.go.kr/B552584/EvCharger/getChargerInfo?serviceKey=g1Orb9XNX8ZMrCVO0NdBaJF1vpBBfP3eLbVDvyiy%2BdJGPEjlzXgxGGMS9h6gq2VtA9Us9gPWHZPrrTf9SG2WWw%3D%3D&numOfRows=10000&pageNo=${i}`;
		// axios.get(kecoURL).then(function(response) {
		// 	console.log(response);
		// 	let kecoItems = response.data.items[0].item;
	

		// 	// console.log(info.length);
		// });
		const kecoItems = await (await axios.get(kecoURL)).data.items[0].item
		// console.log(kecoItems)
		
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
	}
	
	console.log(info)
	console.log(info.length);
	return info;
}
