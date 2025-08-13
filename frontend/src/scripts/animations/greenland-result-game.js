import { gsap } from 'gsap';
import { getValueColor, hasPassedOverall } from '../utils/quiz';
import { createFinalStamp, createNextLevelButton, createTryAgainButton } from '../views/templates/template-creator';
import DBSource from '../data/db-source';
import UrlParser from '../routes/url-parser';

const timeline = gsap.timeline();
const greenLandResultAnimations = {
  animateHarvest: (harvestData) => {
    const harvestContainer = document.querySelector('.harvest-container');
    const harvestList = document.querySelector('.harvest-container ul');

    timeline.to(harvestContainer, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      visibility: 'visible',
      delay: 0.5
    });

    gsap.set(harvestList, { height: 0 });

    harvestData.forEach((item) => {
      const li = document.createElement('li');
      li.style.opacity = 0;
      li.innerHTML = `
        <span class="plant-wrap"><img src="${item.plant}" class="plant"> <span class="item-count">x ${item.count}</span></span>
        <span class="arrow">→</span>
        <span class="candy-converted"></span>
      `;
      harvestList.appendChild(li);

      timeline.to(harvestList, {
        height: 'auto',
        duration: 0.3,
        ease: 'power1.out'
      });

      timeline.fromTo(li, {
        opacity: 0,
        y: -20
      }, {
        opacity: 1,
        y: 0,
        duration: 0.3
      });

      timeline.from(li.querySelector('.plant'), {
        opacity: 0,
        y: -40,
        duration: 0.4
      });

      const candyConverted = li.querySelector('.candy-converted');

      timeline.from(li.querySelector(".plant-wrap"), {
        opacity: 1,
        duration: 0.4
      });

      timeline.from(li.querySelector('.item-count'), {
        opacity: 0,
        scale: 0.5,
        duration: 0.5
      }, '<');

      timeline.from(li.querySelector('.arrow'), {
        opacity: 0,
        x: -20,
        duration: 0.3
      });

      timeline.to(candyConverted, {
        innerText: item.candy,
        duration: 0.8,
        snap: { innerText: 1 },
        onUpdate: function() {
          candyConverted.innerHTML = `${Math.round(this.targets()[0].innerText)}<img src="candy.png" class="candy">`;
        }
      });
    });

    const totalCandy = harvestData.reduce((sum, item) => sum + item.candy, 0);

    const totalEl = document.createElement('p');
    totalEl.className = 'total-candy';
    totalEl.innerHTML = `Total Candy: <span>${totalCandy} <img src="candy.png" class="candy"></span>`;

    harvestList.parentElement.appendChild(totalEl);

    timeline.from(totalEl, {
      opacity: 0,
      scale: 0,
      duration: 0.5,
      delay: 0.4
    });
  },

  animateScores(scoreData) {
    const scoreContainer = document.querySelector('.score-container');

    const quizScore = scoreContainer.querySelector('.quiz-score span');
    const highScore = scoreContainer.querySelector('.high-score span');
    const totalScore = scoreContainer.querySelector('.total-game-score span');

    timeline.to(scoreContainer, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      visibility: 'visible',
      delay: 0.5
    });

    timeline.to(quizScore, {
      innerText: scoreData.score,
      duration: 0.6,
      snap: { innerText: 1},
      delay: 0.3
    });

    timeline.from(highScore, {
      opacity: 0,
      scale: 0,
      duration: 0.3,
      onStart: () => {
        highScore.innerText = scoreData.highScore;
      },
      delay: 0.3
    });

    timeline.from(totalScore, {
      opacity: 0,
      scale: 0,
      duration: 0.3,
      onStart: () => {
        totalScore.innerText = scoreData.totalScore;
      },
      delay: 0.3
    });
  },

  animateOverall: (value) => {
    const overall = document.querySelector('.overall-value');
    const overallValueEl = overall.querySelector('span')
    const valueColor = getValueColor(value);

    overallValueEl.innerText = value;
    overallValueEl.style.color = valueColor;

    timeline.to(overall, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
      delay: 0.7
    });
  },

  showFinalStamp(isPassed) {
    const overallEl = document.querySelector('.overall-value');
    overallEl.insertAdjacentHTML('beforeend', createFinalStamp(isPassed));

    timeline.fromTo("#finalStamp",
      {
        scale: 3,
        opacity: 0,
        rotation: -30
      },
      {
        scale: 1,
        opacity: 1,
        rotation: -30,
        duration: 0.4,
        ease: "back.out(2)",
        delay: 0.3
      }
    );
  },

  async showActionButtons(isPassed) {
    const action = document.querySelector('.action-options');

    if (isPassed) {
      const studentId = (JSON.parse(localStorage.getItem('user')).id);
      const cityId = sessionStorage.getItem('cityId');
      const level = Number(sessionStorage.getItem('level'));
      const getPassedQuizzes = await DBSource.passedQuizzes(studentId, cityId, level);
      const txtInfo = getPassedQuizzes.data.length === 1 ? `Level ${level+1} telah dibuka! <i class="fa-solid fa-unlock-keyhole"></i>` : ''; 
      action.insertAdjacentHTML('beforeend', createNextLevelButton());
      const btnNextLevel = document.querySelector('#btnNextLevel');
      btnNextLevel.addEventListener('click', () => {
        const url = UrlParser.parseActiveUrlWithoutCombiner();
        window.location.href = `#/game/${url.cityName}`;
      })

      const info = action.querySelector('.next-level .info');
      info.innerHTML = txtInfo;

      function shakeInfo() {
        gsap.timeline()
          .to(info, { rotation: -3, duration: 0.1 })
          .to(info, { rotation: 3, duration: 0.1 })
          .to(info, { rotation: -3, duration: 0.1 })
          .to(info, { rotation: 3, duration: 0.1 })
          .to(info, { rotation: 0, duration: 0.1 });
      }

      setTimeout(() => {
        shakeInfo();
        setInterval(shakeInfo, 7000);
      }, 1000);
    } else {
      action.insertAdjacentHTML('beforeend', createTryAgainButton());
    }

    timeline.to(action, { 
      opacity: 1,
      delay: 0.5
    });

  }
}

export const {
  animateHarvest,
  animateScores,
  animateOverall,
  showFinalStamp,
  showActionButtons
} = greenLandResultAnimations;