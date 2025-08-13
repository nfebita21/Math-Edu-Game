import { gsap } from 'gsap';
import { animateHarvest, animateOverall, animateScores, showActionButtons, showFinalStamp } from './greenland-result-game';
import { showGameResultHeader } from './common';

const timeline = gsap.timeline({ delay: 3 });

const resultAnimations = [
  {
    cityId: 'city01',
    level: 1,
    playAnimations: (resultData) => {
      return new Promise((resolve) => {
        showGameResultHeader(timeline);
        timeline.add(() => animateHarvest(resultData.harvest));
        timeline.add(() => animateScores(resultData.scores));
        timeline.add(() => animateOverall(resultData.overall));
        timeline.add(() => showFinalStamp(resultData.isPassed));
        timeline.add(() => showActionButtons(resultData.isPassed));

        timeline.eventCallback("onComplete", () => {
          resolve(); 
        });
      });  
    }
  }
]

export default resultAnimations;