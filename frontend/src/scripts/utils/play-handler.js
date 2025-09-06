import resultAnimations from "../animations/result-animations";
import DBSource from "../data/db-source";
import FeedbackText from "../globals/feedback-text";
import functionMap from "../globals/function-map";
import quizOption from "../globals/quiz-option";
import subQuiz from "../globals/sub-quiz";
import UrlParser from "../routes/url-parser";
import Play from "../views/pages/play";
import { createDecimalInput, createFractionInput, createPopupAfterTutorialPassed, createResultGameGL, optionalFractionalResult } from "../views/templates/template-creator";
import { calculateOverallValue, hasPassedOverall, saveAnswerDetail, saveQuiz, scoringHandler, startQuiz } from "./quiz";
import TutorialHandler from "./tutorial-handler";

const numberInputValidation = () => {

  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('number-input')) {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
      areAllInputsFilledIn();
    }
  });
};

const calcHandler = () => {
  const numberButtons = document.querySelectorAll('.number-buttons button');
  
  numberButtons.forEach(btn => {
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (!btn.hasAttribute('id')) {
        const number = btn.textContent.trim();
        insertTextAtCursor(number);
      } else {
        switch (btn.id) {
          case 'deleteNumber':
            deleteNumberInput();
            break;
          case 'fractionMode':
            toggleFractionMode();
            break;
          default:
            break;
        }
      }
      areAllInputsFilledIn();
    });
  });
}

const fractionToggler = () => {
  const btnFraction = document.querySelector('.btn-fraction');
  const numberInput = document.querySelectorAll('.number-input');
  
  numberInput.forEach(input => {
    input.addEventListener('focus', () => {
      if (input.id === 'firstNum' || input.id === 'secondNum') {
        btnFraction.classList.remove('active');
      } else {
        btnFraction.classList.add('active');
      }
    });

    input.addEventListener('blur', () => {
      btnFraction.classList.remove('active');
    });
  });
}

const areAllInputsFilledIn = () => {
  const numberInputs = document.querySelectorAll('.number-input.show');
  const btnSubmitResult = document.querySelector('#btnSubmitResult');
  const numberOfInputs = numberInputs.length;
  let filledInput = 0

  numberInputs.forEach(input => {
    if (input.value.length >= 1) {
      filledInput++;
    }
  });

  console.log(numberOfInputs, filledInput)

  if (numberOfInputs === filledInput) {
    btnSubmitResult.classList.add('active');
  } else {
    btnSubmitResult.classList.remove('active');
  }
};

const toggleFractionMode = () => {
  const activeInput = document.activeElement;
  const firstFractionContainer = document.querySelector('.fraction-container.first');
  const secondFractionContainer = document.querySelector('.fraction-container.second');
  const firstRealNum = document.querySelector('#firstNum');
  const secondRealNum = document.querySelector('#secondNum');
  const firstNumerator = document.querySelector('.fraction-container.first #numerator');
  const secondNumerator = document.querySelector('.fraction-container.second #numerator');
  const firstDenominator = document.querySelector('.fraction-container.first #denominator');
  const secondDenominator = document.querySelector('.fraction-container.second #denominator');
  const fractionInput = document.querySelectorAll('.fraction-container input');
  

  if (activeInput.classList.contains('first-fraction')) {
    fractionInput.forEach(el => {
      el.classList.remove('show');
    });
    firstFractionContainer.classList.remove('show');
    firstRealNum.classList.add('show');
    firstRealNum.focus();
  } else if (activeInput.classList.contains('second-fraction')) {
    fractionInput.forEach(el => {
      el.classList.remove('show');
    });
    secondFractionContainer.classList.remove('show');
    secondRealNum.classList.add('show');
    secondRealNum.focus();
  } else if (activeInput.id === 'firstNum') {
    firstFractionContainer.classList.add('show');
    firstDenominator.classList.add('show');
    firstNumerator.classList.add('show');
    firstRealNum.classList.remove('show');
    firstNumerator.focus();
  } else if (activeInput.id === 'secondNum') {
    secondDenominator.classList.add('show');
    secondNumerator.classList.add('show');
    secondFractionContainer.classList.add('show');
    secondRealNum.classList.remove('show');
    secondNumerator.focus();
  }
}

const submitStepHandler = async (mainId, stepQuiz, stepId) => {
  const btnSubmitResult = document.querySelectorAll('.btn-next-step');
  const currentStep = stepQuiz.find(sub => sub.id === stepId)
  const checkerName = currentStep.answer_checker;
  const stepNumber = currentStep.step;
  let stepIndex = Number(sessionStorage.getItem('stepIndex'));
  const cityId = sessionStorage.getItem('cityId');
  const level = sessionStorage.getItem('level');
  const levelData = await DBSource.level(cityId, level);
  const stepCount = levelData.step_count;
  
  btnSubmitResult.forEach(btn => {
    btn.addEventListener('click', async () => {
      let quizCounter = Number(sessionStorage.getItem('quizCounter'));
      sessionStorage.setItem('quizCounter', quizCounter + 1);
      const isQuizPassed = functionMap[checkerName]({mainId, stepId, btnEl: btn, operator: currentStep.operator ?? undefined});

      const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;
      const correctAnswer = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === stepId && opt.is_correct);
      const isGroupedStep = currentStep.group_with_next;
      
      if (isQuizPassed) { // If the answer is correct
        const correctStepPerQuiz = Number(sessionStorage.getItem('correctStepPerQuiz'));
        if (isGroupedStep) { // For optional step
          if (correctAnswer.answer === 'Ya') {
            sessionStorage.setItem('correctStepPerQuiz', correctStepPerQuiz + 0);
          } else {
            sessionStorage.setItem('correctStepPerQuiz', correctStepPerQuiz + 1);
          }
        } else {
          sessionStorage.setItem('correctStepPerQuiz', correctStepPerQuiz + 1);
        }
      } else { // If the answer is wrong
        const wrongAnswer = Number(sessionStorage.getItem('wrongAnswer'));
        if (isGroupedStep) { // For optional step
          if (correctAnswer.answer === 'Ya') {
            sessionStorage.setItem('wrongAnswer', wrongAnswer + 0);
          } else {
            sessionStorage.setItem('wrongAnswer', wrongAnswer + 1);
          }
        } else {
          sessionStorage.setItem('wrongAnswer', wrongAnswer + 1);
        }
        await showStepFeedback(isQuizPassed);
      }

      await progressBarHandler(stepNumber, isQuizPassed, mainId, stepId, isGroupedStep);
      stepIndex = stepIndex + 1;
      const correctStepPerQuiz = Number(sessionStorage.getItem('correctStepPerQuiz'));
      scoringHandler(isQuizPassed, currentStep.score);

      if (stepNumber < stepCount) { 
        const stepWrapper = document.querySelector('.sub-quiz');
        const resultWrapper = document.querySelector('.result');
        stepWrapper.remove(); // remove sub quiz
        resultWrapper.remove(); // remove result quiz
        
        await Play.displayStep(mainId, stepQuiz, stepIndex);
      } else { // If quiz finish
        const quizWrapper = document.querySelector('.quiz-content');
        quizWrapper.innerHTML = ''; // reset quiz

        const detailQuiz = JSON.parse(sessionStorage.getItem('detailQuiz'));
        let mainIndex = Number(sessionStorage.getItem('mainIndex')) + 1; // go to next quiz
        let quizIndex = Number(sessionStorage.getItem('quizIndex')) + 1;

        const labelQuiz = document.querySelector('.quiz-title');
        labelQuiz.classList.remove('show');

        const isThisWithTutorial = Number(sessionStorage.getItem('isThisWithTutorial'));

        if (quizIndex === 5) {
          await saveAnswerDetail(cityId, mainId, correctStepPerQuiz);
          processQuizResult();
        } else if (isThisWithTutorial && quizIndex === 1) {
          const quizProgressId = sessionStorage.getItem('quizProgressId');

          const getQuizProgress = await DBSource.getQuizProgress(quizProgressId);

          if (getQuizProgress.result['is_tutorial_passed']) {
            document.querySelector('.play').insertAdjacentHTML('beforeend', createPopupAfterTutorialPassed(1));
          } else {
            await DBSource.updateTutorialPassed(quizProgressId);

            document.querySelector('.play').insertAdjacentHTML('beforeend', createPopupAfterTutorialPassed(0));
          }

          const btnStartQuiz = document.querySelector('#start-quiz');
          btnStartQuiz.addEventListener('click', async () => {
            await startQuiz()
            const popupOverlay = document.querySelector(".popup-overlay");
            popupOverlay.remove();
            document.querySelector('.minor-progress').classList.add('not-counted');
            Play.displayQuiz(detailQuiz, mainIndex, quizIndex);
            return;
          });
        } else if (quizIndex >= 0 && quizIndex < 5){
          await showCharFeedback(correctStepPerQuiz);
          await saveAnswerDetail(cityId, mainId, correctStepPerQuiz);
        
          Play.displayQuiz(detailQuiz, mainIndex, quizIndex);        
        }   
      }
    }, { once: true});
  })
};

const progressBarHandler = async (stepNumber, isQuizPassed, mainId, stepId, isGroupedStep) => {
  const quizIndex = sessionStorage.getItem('quizIndex');
  const progressBar = document.querySelector('.progress-bar');
  const minorProgressBar = progressBar.querySelectorAll('.minor-progress');
  const activeBullet = minorProgressBar[quizIndex].querySelector('.sub.active');
  const milestone = minorProgressBar[quizIndex].querySelector('.milestone');
  const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;
  
  const cityId = sessionStorage.getItem('cityId');
  const level = sessionStorage.getItem('level');
  const rewards = await DBSource.getCityReward(cityId, level);
  let reward = {
    minor: '',
    milestone: '',
  };
  reward.minor = await rewards.data.find(reward => reward.name === 'minor');
  const correctStepPerQuiz = sessionStorage.getItem('correctStepPerQuiz');
  reward.milestone = await rewards.data.find(reward => reward.name === `milestone${correctStepPerQuiz}`);

  if (isGroupedStep) {
    const correctAnswer = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === stepId && opt.is_correct);

    if (correctAnswer.answer === 'Ya') {
      return;
    }
  }

  if (isQuizPassed) {
    activeBullet.outerHTML = `
      <img class="minor ${reward.minor['img_url']}" src="./rewards/${reward.minor['img_url']}.png">
    `;

    milestone.outerHTML = `
      <img class="milestone ${reward.milestone['name']} ${reward.milestone['img_url']} grow" src="./rewards/${reward.milestone['img_url']}.png">
    `;

    const milestones = document.querySelectorAll(`.${reward.milestone['img_url']}`);

    milestones[milestones.length - 1].style.height = `calc(75% + ${stepNumber}px + 2px)`;
  } else {
    activeBullet.classList.add('wrong');
    activeBullet.classList.remove('active');
  }
}

const showQuizResult = async (dataResult) => {
  const cityId = sessionStorage.getItem('cityId');
  const templateName = await DBSource.getGameResultTemplate(cityId);
  const templateHTMLString = functionMap[templateName['game_result_template']]();

  const quizContent = document.querySelector('.quiz-content');
  quizContent.innerHTML = templateHTMLString;

  const animation = resultAnimations.find(anm => anm.cityId === cityId);
  await animation.playAnimations(dataResult);
  initQuizResultButtons();
}

const initQuizResultButtons = () => {
  document.querySelector('#btnTryAgain')?.addEventListener('click', async () => {
    const quizWrapper = document.querySelector('.quiz-content');
    quizWrapper.innerHTML = "";

    const progressBar = document.querySelector('.progress-bar');
    progressBar.remove();

    const detailQuiz = JSON.parse(sessionStorage.getItem('detailQuiz'));

    await showProgressBar();
    setTimeout(() => Play.displayQuiz(detailQuiz, 1), 3000);
  });
}

const processQuizResult = async () => {
  const isTutorialPassed = Number(sessionStorage.getItem('isTutorialPassed'));
  if (!isTutorialPassed) {
    await DBSource.updateTutorialPassed();
  } 
  
  const score = sessionStorage.getItem('totalScore');
  const milestonesEl = document.querySelectorAll('.minor-progress:not(.not-counted) .milestone');
  const cityId = sessionStorage.getItem('cityId');
  const student = JSON.parse(localStorage.getItem('user'));
  const studentId = student.id;
  const level = sessionStorage.getItem('level');
  // const isThisWithTutorial = Number(sessionStorage.getItem('isThisWithTutorial'));
  // let milestoneIndex = 0;

  let dataResult = {
    harvest: [],
    scores: {},
    overall: '',
    isPassed: false
  };

  for (const el of milestonesEl) {
    // if (isThisWithTutorial === 0 || (isThisWithTutorial === 1 && milestoneIndex > 1)) {
      const rewardName = el.classList[1];
      const rewardLevel = Number(rewardName.charAt(rewardName.length - 1));
      const candyValueRequest = await DBSource.convertReward(cityId, rewardName);
      const candyValue = candyValueRequest['candy_converted'];
      const imgSrc = el.getAttribute('src');
      const plant = dataResult.harvest.find(harvest => harvest.plant === imgSrc);

      if (plant) { 
        plant.count += 1;
        plant.candy += candyValue;
      } else { 
        dataResult.harvest.push({
          level: rewardLevel,
          plant: imgSrc,
          count: 1,
          candy: candyValue
        });
      }
    } 
  
  dataResult.harvest.sort((a, b) => a.level - b.level);

  dataResult.scores.score = score;

  let overall = calculateOverallValue();
  dataResult.overall = overall;

  const totalCandy = dataResult.harvest.reduce((sum, item) => sum + item.candy, 0);
  dataResult.isPassed = hasPassedOverall(overall);
  const dataToUpdated = {score, totalCandy, overall, isPassed: dataResult.isPassed};

  await saveQuiz(dataToUpdated);
  

  const highScoreRequest = await DBSource.highScore(studentId, cityId, level);
  let highScore = highScoreRequest['high_score'];
  dataResult.scores.highScore = highScore;

  const totalScoreRequest = await DBSource.totalScoreStudent(studentId);
  let totalScore = totalScoreRequest['total_score'];
  dataResult.scores.totalScore = totalScore;
  
  
  await showQuizResult(dataResult);
}

const showStepFeedback = async (isCorrect) => {
  return new Promise ((resolve) => {
    const playContainer = document.querySelector('.play-container');

    if(!isCorrect) {
      playContainer.classList.add('wrong');
    }

    setTimeout(() => {
      playContainer.classList.remove('wrong');
      resolve();
    }, 500);
  })
}

const showCharFeedback = async (correctStepPerQuiz) => {
  return new Promise((resolve) => {
    const feedback = document.querySelector('#feedback-char');
    const charImg = feedback.querySelector('img');
    const textEl = feedback.querySelector('p');
    const detailQuiz = JSON.parse(sessionStorage.getItem('detailQuiz'));
    const totalStep = detailQuiz.sub.at(-1).step;
    const valuePerQuestion = correctStepPerQuiz / totalStep * 100;
    
    const user = JSON.parse(localStorage.getItem('user'));

    let charNum;
    

    if (valuePerQuestion >= 0 && valuePerQuestion <= 25) {
      charNum = 1;
    } else if (valuePerQuestion > 25 && valuePerQuestion <= 50) {
      charNum = 2;
    } else if (valuePerQuestion > 50 && valuePerQuestion <= 75) {
      charNum = 3;
    } else {
      charNum = 4;
    }

    charImg.src = `./char-feedback/${user.gender}-char-${charNum}.png`;

    const feedbackTextArr = FeedbackText.find(item => item.charLevel === charNum).textArr;
    const randomText = feedbackTextArr[Math.floor(Math.random() * feedbackTextArr.length)];
    textEl.textContent = randomText;

    feedback.classList.remove('hidden');

    requestAnimationFrame(() => {
      feedback.classList.add('show');
    });

    setTimeout(() => {
      feedback.classList.remove('show');
      setTimeout(() => {
        feedback.classList.add('hidden');
        resolve();
      }, 300); // Sesuai durasi transition
    }, 1500);
  }) 
}

const deleteNumberInput = () => {
    const activeInput = document.activeElement;
  
    const start = activeInput.selectionStart;
    const end = activeInput.selectionEnd;
  
    if (start === end) {
      if (start > 0) {
        const beforeCursor = activeInput.value.slice(0, start - 1);
        const afterCursor = activeInput.value.slice(start);

        activeInput.value = beforeCursor + afterCursor;

        activeInput.setSelectionRange(start - 1, start - 1);
      }
    } else {
        const beforeCursor = activeInput.value.slice(0, start);
        const afterCursor = activeInput.value.slice(end);
  
        activeInput.value = beforeCursor + afterCursor;
 
        activeInput.setSelectionRange(start, start);
    }
  }

const insertTextAtCursor = (text) => {
  const activeInput = document.activeElement;
  const secondInput = document.querySelector('#secondNum');

  if (activeInput.tagName === 'INPUT' && activeInput.value.length < 2) {
    const cursorPosition = activeInput.selectionStart; 
    const currentText = activeInput.value;

    
    const beforeCursor = currentText.substring(0, cursorPosition);
    const afterCursor = currentText.substring(cursorPosition);

    
    activeInput.value = beforeCursor + text.split('\n')[0] + afterCursor;

    activeInput.setSelectionRange(cursorPosition + text.length, cursorPosition + text.length);

    if (activeInput.value.length === 2) {
      if (activeInput.id === 'firstNum') {
        secondInput.focus();
      } else {
        activeInput.blur();
      }
      return;
    } 
    activeInput.focus(); // Fokus tetap pada input
  } 
  return;
}

const multiChoicesHandler = (mainId, stepQuiz) => {
  const btnAnswerChoices = document.querySelectorAll('.answer-choices button');

  let stepIndex = sessionStorage.getItem('stepIndex');
  btnAnswerChoices.forEach(btn => {
    btn.addEventListener('click', () => {
      stepIndex = stepIndex + 1;
      Play.displayStep(mainId, stepQuiz, stepIndex);
    });
  });
}

const openImageDetail = () => {
  const openImageBtn = document.querySelectorAll('.open-image-btn');
  const imageModal = document.getElementById('imageModal');
  const closeModalBtn = document.querySelector('.close-btn');
  const modalImage = document.querySelector('.modal-image');
  const imageOptions = document.querySelectorAll('.answer-choices .illustration');

  openImageBtn.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const srcImage = imageOptions[index].getAttribute('src');
      modalImage.src = srcImage;
      imageModal.style.display = 'flex';
    });
  });

  closeModalBtn.addEventListener('click', () => {
    console.log('clicked')
    imageModal.style.display = 'none'; 
  });

  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
        imageModal.style.display = 'none';
    }
  });
}

const showPointer = (mainId, step, templateName) => {
  const stepQuiz = quizOption.find(sub => sub.mainQuizId === mainId && sub.subQuizId === step);

  const correctAnswer = stepQuiz.choices.find(opt => opt.isCorrect === true);

  const tutorHandler = TutorialHandler.find(handler => handler.name === templateName);

  tutorHandler.show(correctAnswer.answer);

}

const showProgressBar = async () => {
  const playContainer = document.querySelector('.play-container');
  const url = UrlParser.parseActiveUrlWithoutCombiner();
  const cityName = url.cityName;
  const getCity = await DBSource.getCityByName(cityName);
  const city = getCity.data[0];
  const level = sessionStorage.getItem('level');
  sessionStorage.setItem('cityId', city.id);
  const progressBarName = city['progress_bar_name'];
  const progressBar = await functionMap[progressBarName](city.id, level);
  playContainer.insertAdjacentHTML('afterbegin', progressBar);

  const milestoneProgress = document.querySelectorAll('.progress-bar .milestone');

  milestoneProgress.forEach((milestone, index) => {
    setTimeout(() => {
      milestone.classList.add('show');
    }, index * 500); 
  });

  const totalDelay = (milestoneProgress.length - 1) * 500 + 600;

  const bulletProgress = document.querySelectorAll('.progress-bar .bullet');

  setTimeout(() => {
    bulletProgress.forEach(bullet => {
      bullet.classList.add('show');
    })
  }, totalDelay);
}

const fractionDecomposition = () => {
  const fractionQuestionEl = document.querySelector('.fraction-question');

  fractionQuestionEl.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-add-result')) {
      e.target.remove();
      let optionalFracResult = document.querySelector('.optional-frac-result:last-child');

      if (optionalFracResult) {
        optionalFracResult.classList.remove('removable');
      }

      fractionQuestionEl.insertAdjacentHTML('beforeend', `<span class="equivalent">=</span> ${optionalFractionalResult()}`);

      const optionalFracResults = document.querySelectorAll('.optional-frac-result');
      if (optionalFracResults.length <= 1) {
        fractionQuestionEl.insertAdjacentHTML('beforeend', '<button class="btn-add-result" id="btnAddResult">+</button>');
      }

      areAllInputsFilledIn();
    }

    else if (e.target.classList.contains('remove-btn')) {
      document.querySelector('.optional-frac-result.removable').remove();

      document.querySelector('.equivalent:last-of-type').remove();

      const btnAddResult = document.querySelector('#btnAddResult');
      if (!btnAddResult) {
        fractionQuestionEl.insertAdjacentHTML(
          'beforeend',
          `<button class="btn-add-result" id="btnAddResult">+</button>`
        );
      }

      const lastFrac = document.querySelector('.optional-frac-result:last-of-type');
      if (lastFrac) {
        lastFrac.classList.add('removable');
      }

      areAllInputsFilledIn();
    }

    if (e.target.closest('.switch-input-mode')) {
      const parent = e.target.closest('.decimal-kit, .fraction-container');
      if (parent.classList.contains('decimal-kit')) {
        parent.insertAdjacentHTML('afterend', createFractionInput());
      } else {
        parent.insertAdjacentHTML('afterend', createDecimalInput());
      }
      parent.remove();

      areAllInputsFilledIn();
    }

    if (e.target.closest('.retreat-btn') || e.target.closest('.advance-btn')) {
      const btn = e.target.closest('.retreat-btn, .advance-btn');
      if (!btn) return;

      const kit = btn.closest('.decimal-kit');
      const input = kit.querySelector('.decimal');
      let val = input.value.trim();

      if (!val) return; // kosong, ga ngapa-ngapain

      // ubah koma jadi titik biar bisa di-parse
      let num = parseFloat(val.replace(',', '.'));
      if (isNaN(num)) return;

      if (btn.classList.contains('retreat-btn')) {
        num = num / 10; // mundur koma
      } else if (btn.classList.contains('advance-btn')) {
        // maju koma → kali 10
        if (Number.isInteger(num)) return; // kalau sudah bulat, stop
        num = num * 10;
      }

      num = parseFloat(num.toFixed(10));
      // ubah titik jadi koma lagi untuk ditampilkan
      input.value = num.toString().replace('.', ',');
    }
  });
}

export { numberInputValidation, insertTextAtCursor, areAllInputsFilledIn, deleteNumberInput, toggleFractionMode, calcHandler, fractionToggler, submitStepHandler, multiChoicesHandler, openImageDetail, showPointer, showProgressBar, fractionDecomposition };