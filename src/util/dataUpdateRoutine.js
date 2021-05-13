import { getChargerInfo } from './getFromOpenApi';

export const dataUpdateRoutine = () => {
    let idx = 0

    while (true) {
        setInterval(getChargerInfo, 0, idx);

        
        if (idx === 10) {
            idx = 0
        } else {
            idx++
        }

    }
}