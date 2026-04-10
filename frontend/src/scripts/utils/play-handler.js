import { highlightDifferentPrime } from "../animations/common";
import resultAnimations from "../animations/result-animations";
import DBSource from "../data/db-source";
import FeedbackText from "../globals/feedback-text";
import functionMap from "../globals/function-map";
import quizOption from "../globals/quiz-option";
import tutorialData from "../globals/tutorial-data";
import UrlParser from "../routes/url-parser";
import Play from "../views/pages/play";
import { createAnswerReview, createDecimalInput, createFractionInput, createPopupAfterTutorialPassed, createPopupTutorialPassed, createPopupTutorialUnavailable, createPopupTutorialUnpassed, createPrimeSpinner, detailReward, optionalFractionalResult, optionalInputNumber, renderReviewContent } from "../views/templates/template-creator";
import { number, string } from "./common";
import { calculateOverallValue, hasPassedOverall, saveAnswerDetail, saveQuiz, scoringHandler, startQuiz } from "./quiz";
import buildReviewData from "./review-handler";
import Tutorial from "./tutorial";
import TutorialHandler from "./tutorial-handler";

const numberInputValidation = () => {

  const firstInput = document.querySelector('.result input');
  if (firstInput) {
    firstInput.focus();
  }

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

  const colorTheme = JSON.parse(sessionStorage.getItem('colorTheme'));

  numberInputs.forEach(input => {
    if (input.value.length >= 1) {
      filledInput++;
    }
  });

  if (numberOfInputs === filledInput) {
    btnSubmitResult.classList.add('active');
    btnSubmitResult.style.backgroundColor = colorTheme.primary_color;
  } else {
    btnSubmitResult.classList.remove('active');
    btnSubmitResult.style.backgroundColor = '#adb5bd';
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
  const questionCount = levelData.question_count;
  
  btnSubmitResult.forEach(btn => {
    btn.addEventListener('click', async () => {
      let quizCounter = Number(sessionStorage.getItem('quizCounter'));
      sessionStorage.setItem('quizCounter', quizCounter + 1);
      const isQuizPassed = functionMap[checkerName]({mainId, stepId, btnEl: btn, operator: currentStep.operator ?? undefined});

      const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;
      const correctAnswer = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === stepId && opt.is_correct);
      const isGroupedStep = currentStep.group_with_next;
      
      if (isQuizPassed) { // If the answer is correct
        const correctAnswerSfx = document.querySelector('#correctAnswerSfx');
        correctAnswerSfx.currentTime = 0;
        correctAnswerSfx.play();
        const correctStepPerQuiz = Number(sessionStorage.getItem('correctStepPerQuiz'));
        if (isGroupedStep) { // For optional step
          functionMap[currentStep.step_controller]('correct-counter', correctAnswer, 1);
        } else {
          sessionStorage.setItem('correctStepPerQuiz', correctStepPerQuiz + 1);
        }
      } else { // If the answer is wrong
        const wrongAnswerSfx = document.querySelector('#wrongAnswerSfx');
        wrongAnswerSfx.currentTime = 0;
        wrongAnswerSfx.play();
        const wrongAnswer = Number(sessionStorage.getItem('wrongAnswer'));
        if (isGroupedStep) { // For optional step
          functionMap[currentStep.step_controller]('correct-counter', correctAnswer, 0);
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

        if (quizIndex === questionCount) {
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
            await startQuiz();
            const popupOverlay = document.querySelector(".popup-overlay");
            popupOverlay.remove();
            document.querySelector('.minor-progress').classList.add('not-counted');
            Play.displayQuiz(detailQuiz, mainIndex, quizIndex);
            return;
          });
        } else if (quizIndex >= 0 && quizIndex < questionCount){
          const feedbackSfx = document.querySelector('#feedbackSfx');
          feedbackSfx.currentTime = 0;
          feedbackSfx.play();
          await showCharFeedback(correctStepPerQuiz);
          await saveAnswerDetail(cityId, mainId, correctStepPerQuiz);
        
          Play.displayQuiz(detailQuiz, mainIndex, quizIndex);        
        }   
      }
    }, { once: true});
  })
};

const progressBarHandler = async (stepNumber, isQuizPassed, mainId, stepId, isGroupedStep) => {
  const quizIndex = Number(sessionStorage.getItem('quizIndex'));
  const progressBar = document.querySelector('.progress-bar');
  const minorProgressBar = progressBar.querySelectorAll('.minor-progress');
  const activeBullet = minorProgressBar[quizIndex].querySelector('.sub.active');
  const milestone = minorProgressBar[quizIndex].querySelector('.milestone');
  const detailProgressReward = minorProgressBar[quizIndex].querySelector('.detail-progress-reward');
  const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;
  
  const cityId = sessionStorage.getItem('cityId');
  const level = sessionStorage.getItem('level');
  const rewards = await DBSource.getCityReward(cityId, level);
  const levelData = await DBSource.level(cityId, level);
  const stepCount = levelData.step_count;
  let reward = {
    minor: '',
    milestone: '',
  };
  reward.minor = await rewards.data.find(reward => reward.degree === 'minor');
  const correctStepPerQuiz = sessionStorage.getItem('correctStepPerQuiz');
  reward.milestone = await rewards.data.filter(reward => reward.degree === `milestone${correctStepPerQuiz}`);

  if (reward.milestone.length > 1) {
    reward.milestone = reward.milestone.find(re => re.quiz_num === quizIndex + 1);
  } else {
    reward.milestone = reward.milestone[0];
  }

  if (isGroupedStep) {
    const stepQuiz = JSON.parse(sessionStorage.getItem('detailQuiz')).sub;
    let currentStep = stepQuiz.find(sub => sub.id === stepId);

    const stepController = currentStep.step_controller;
    const isSkipped = functionMap[stepController]('progress-bar');

    // if (!correctAnswer) return;
    if (isSkipped) return;
    // if (correctAnswer.answer === 'Ya') {
    //   return;
    // }
    
  }

  if (isQuizPassed) {
    if (reward.minor) {
      activeBullet.outerHTML = `
      <img class="minor ${reward.minor['img_url']}" src="./rewards/${reward.minor['img_url']}.png">
    `;
    } else {
      activeBullet.classList.add('right');
      activeBullet.classList.remove('active');
    }
    

    milestone.outerHTML = `
      <img class="milestone ${reward.milestone['degree']} ${reward.milestone['img_url']} grow" src="./rewards/${reward.milestone['img_url']}.png">
    `;

    const rewardLevel = (reward.milestone.degree.split('milestone'))[1];
    detailProgressReward.outerHTML = `
      ${detailReward(reward.milestone.name, reward.milestone.img_url, reward.milestone.information, reward.milestone.candy_converted, rewardLevel, stepCount)}
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
  const level = Number(sessionStorage.getItem('level'));
  const templateName = await DBSource.getGameResultTemplate(cityId);
  const templateHTMLString = functionMap[templateName['game_result_template']]();

  const quizContent = document.querySelector('.quiz-content');
  quizContent.innerHTML = templateHTMLString;
  

  const animation = resultAnimations.find(anm => anm.cityId === cityId && anm.level === level);
  await animation.playAnimations(dataResult);
  

  // Review Quiz Build
  const reviewData = await buildReviewData();
  console.log(reviewData)
  quizContent.insertAdjacentHTML('beforeend', createAnswerReview(reviewData));
  renderReviewContent(reviewData[0]);

  initQuizResultButtons();
  initReviewEvents(reviewData);
}

const initQuizResultButtons = () => {
  document.querySelector('#btnTryAgain')?.addEventListener('click', async () => {
    const quizWrapper = document.querySelector('.quiz-content');
    quizWrapper.innerHTML = "";

    const progressBar = document.querySelector('.progress-bar');
    progressBar.remove();

    const detailQuiz = JSON.parse(sessionStorage.getItem('detailQuiz'));

    await showProgressBar();
    await startQuiz();
    setTimeout(() => Play.displayQuiz(detailQuiz, 1), 3000);
  });

  const reviewModal = document.querySelector('.review-modal');
  document.querySelector('.btn-quiz-review')?.addEventListener('click', () => {
    reviewModal.style.display = 'flex';
  });

  document.querySelector('.reviewModal .btn-close')?.addEventListener('click', () => {
    reviewModal.style.display = 'none';
  })
}

const initReviewEvents = (reviewData) => {
  const btnCloseReview = document.querySelector('.review-modal button.btn-close');
  const reviewModal = document.querySelector('.review-modal');

  btnCloseReview.addEventListener('click', () => {
    reviewModal.style.display = 'none';
  });

  // sidebar kuis (event delegation)
  reviewModal.querySelector('.review-sidebar')?.addEventListener('click', e => {
    const btn = e.target.closest('.review-item');
    if (!btn) return;

    reviewModal.querySelector('.review-item.selected')?.classList.remove('selected');
    btn.classList.add('selected');

    const index = Number(btn.dataset.index);
    renderReviewContent(reviewData[index]);
  });
}

const processQuizResult = async () => {
  const isTutorialPassed = Number(sessionStorage.getItem('isTutorialPassed'));
  const tutorial = new Tutorial(tutorialData);
  const cityId = sessionStorage.getItem('cityId');
  const level = sessionStorage.getItem('level');
  if (!isTutorialPassed && tutorial.hasData(cityId, level)) {
    await DBSource.updateTutorialPassed();
  } 
  
  const score = sessionStorage.getItem('totalScore');
  const milestonesEl = document.querySelectorAll('.minor-progress:not(.not-counted) .milestone');
  const student = JSON.parse(localStorage.getItem('user'));
  const studentId = student.id;

  let dataResult = {
    harvest: [],
    scores: {},
    overall: '',
    isPassed: false
  };

  for (const el of milestonesEl) {
      const rewardName = el.classList[2];
      console.log(cityId, rewardName);
      const rewardDegree = Number(rewardName.charAt(rewardName.length - 1));
      const candyValueRequest = await DBSource.convertReward(cityId, rewardName);
      const candyValue = candyValueRequest['candy_converted'];
      const imgSrc = el.getAttribute('src');
      const plant = dataResult.harvest.find(harvest => harvest.plant === imgSrc);
      const match = el.getAttribute('src').match(/\d+/); 
      const level = match ? parseInt(match[0], 10) : 0;

      if (plant) { 
        plant.count += 1;
        plant.candy += candyValue;
      } else { 
        dataResult.harvest.push({
          degree: rewardDegree,
          plant: imgSrc,
          count: 1,
          candy: candyValue,
          level
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
  
  const quizEndSfx = document.querySelector('#quizEndSfx');
  quizEndSfx.currentTime = 0;
  quizEndSfx.play();
  
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
  const progressBarItemSfx = document.querySelector('#progressBarItemSfx');

  milestoneProgress.forEach((milestone, index) => {
    setTimeout(() => {
      milestone.classList.add('show');
      progressBarItemSfx.currentTime = 0;
      progressBarItemSfx.play();
    }, index * 500); 
  });

  const totalDelay = (milestoneProgress.length - 1) * 500 + 600;

  const bulletProgress = document.querySelectorAll('.progress-bar .bullet');
  const bulletSfx = document.querySelector('#bulletSfx')
  
  setTimeout(() => {
    bulletProgress.forEach(bullet => {
      bulletSfx.currentTime = 0;
      bulletSfx.play();
      bullet.classList.add('show');
    })
  }, totalDelay);
}

const fractionDecomposition = () => {
  const fractionQuestionEl = document.querySelectorAll('.fraction-question');

  fractionQuestionEl.forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('btn-add-result')) {
        e.target.parentElement.remove();
        let optionalFracResult = document.querySelector('.optional-frac-result:last-child');

        if (optionalFracResult) {
          optionalFracResult.classList.remove('removable');
        }

        el.insertAdjacentHTML('beforeend', `<span class="equivalent">=</span> ${optionalFractionalResult()}`);

        const optionalFracResults = el.querySelectorAll('.optional-frac-result');
        if (optionalFracResults.length <= 1) {
          el.insertAdjacentHTML('beforeend', '<div class="btn-add-result"><button class="btn-add-result" id="btnAddResult">+</button></div>');
        }

        areAllInputsFilledIn();
      }

      else if (e.target.classList.contains('remove-btn')) {
        el.querySelector('.optional-frac-result.removable').remove();

        el.querySelector('.equivalent:last-of-type').remove();

        const btnAddResult = el.querySelector('#btnAddResult');
        if (!btnAddResult) {
          el.insertAdjacentHTML(
            'beforeend',
            `<div class="btn-add-result"><button class="btn-add-result" id="btnAddResult">+</button></div>`
          );
        }

        const lastFrac = el.querySelector('.optional-frac-result:last-of-type');
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
        const input = kit.querySelector('.decimal.number-input');
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
  })
  
}

const comparisonSwitch = () => {
  const operators = ['<', '>', '='];
  let index = -1;

  const input = document.querySelector('#comparisonOperator');
  const button = document.querySelector('.btn-switch-operator-comparison');

  const plantLeft = document.querySelector('.comparison-choice.first-choice .plant');
  const plantRight = document.querySelector('.comparison-choice.second-choice .plant');

  const btnSubmit = document.querySelector('.btn-submit-result');


  button.addEventListener("click", () => {
    index = (index + 1) % (operators.length + 1);
    input.value = index === operators.length ? "" : operators[index];
    areAllInputsFilledIn();

    plantLeft.classList.remove("chosen");
    plantRight.classList.remove("chosen");

    if (input.value === "<") {
      plantRight.classList.add("chosen");
    } else if (input.value === ">") {
      plantLeft.classList.add("chosen");
    } else if (input.value === "=") {
      plantLeft.classList.add("chosen");
      plantRight.classList.add("chosen");
    } 

  });
}

const fractionComparisonSwitch = () => {
  const operators = ['<', '>', '='];
  let index = -1;

  const input = document.querySelector('#comparisonOperator');
  const button = document.querySelector('.btn-switch-operator-comparison');

  const leftFraction = document.querySelectorAll('.comparison-container .fraction-option')[0];
  const rightFraction = document.querySelectorAll('.comparison-container .fraction-option')[1];

  button.addEventListener("click", () => {
    index = (index + 1) % (operators.length + 1);
    input.value = index === operators.length ? "" : operators[index];
    areAllInputsFilledIn();

    leftFraction.classList.remove("chosen");
    rightFraction.classList.remove("chosen");

    if (input.value === "<") {
      rightFraction.classList.add("chosen");
    } else if (input.value === ">") {
      leftFraction.classList.add("chosen");
    } else if (input.value === "=") {
      leftFraction.classList.add("chosen");
      rightFraction.classList.add("chosen");
    } 

  });

  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('number-input')) {
      areAllInputsFilledIn();
    }
  });

}

const dragAndDropFraction = () => {
  const boxes = document.querySelectorAll('.box');
  let kotakAsal = null;

  boxes.forEach(kotak => {
    kotak.addEventListener('dragstart', e => {
      kotakAsal = kotak;
      kotak.classList.add('dragging');

      boxes.forEach(box => {
        box.classList.add('pot-form');
        kotak.classList.remove('pot-form');
      });

      e.dataTransfer.setData('text/plain', kotak.id);
    });

    kotak.addEventListener('dragover', e => {
      e.preventDefault();
      kotak.classList.add('dragover');
    });

    kotak.addEventListener('dragleave', () => {
      kotak.classList.remove('dragover');
    });

    kotak.addEventListener('drop', e => {
      e.preventDefault();
      kotak.classList.remove('dragover');

      boxes.forEach(box => {
        box.classList.remove('pot-form');
      });

      const idAsal = e.dataTransfer.getData('text/plain');
      const elemenAsal = document.getElementById(idAsal);
      const kotakTujuan = kotak;

      if (elemenAsal === kotakTujuan) return;

      // --- Tukar posisi dengan animasi halus ---
      const parent = kotakTujuan.parentNode;
      const rectAsal = elemenAsal.getBoundingClientRect();
      const rectTujuan = kotakTujuan.getBoundingClientRect();

      const nextAsal = elemenAsal.nextSibling;
      const nextTujuan = kotakTujuan.nextSibling;

      parent.insertBefore(elemenAsal, nextTujuan);
      parent.insertBefore(kotakTujuan, nextAsal);

      const rectAsalBaru = elemenAsal.getBoundingClientRect();
      const rectTujuanBaru = kotakTujuan.getBoundingClientRect();

      const deltaAsalX = rectAsal.left - rectAsalBaru.left;
      const deltaAsalY = rectAsal.top - rectAsalBaru.top;
      const deltaTujuanX = rectTujuan.left - rectTujuanBaru.left;
      const deltaTujuanY = rectTujuan.top - rectTujuanBaru.top;

      elemenAsal.animate([
        { transform: `translate(${deltaAsalX}px, ${deltaAsalY}px)` },
        { transform: 'translate(0, 0)' }
      ], { duration: 300, easing: 'ease' });

      kotakTujuan.animate([
        { transform: `translate(${deltaTujuanX}px, ${deltaTujuanY}px)` },
        { transform: 'translate(0, 0)' }
      ], { duration: 300, easing: 'ease' });
    });

    kotak.addEventListener('dragend', () => {
      kotak.classList.remove('dragging');

      boxes.forEach(box => {
        box.classList.remove('pot-form');
      });
    });
  });
}

const inputAnswerSlider = () => {
  const slidesContainer = document.querySelector('.slides');
  const slides = document.querySelectorAll('.slide');
  const leftArrow = document.querySelector('.arrow.left');
  const rightArrow = document.querySelector('.arrow.right');
  let currentIndex = 0;
  const typeChosen = sessionStorage.getItem('typeChosen');
  const indicators = typeChosen === 'Desimal' ? document.querySelectorAll('.number-box:not(.decimal)') : document.querySelectorAll('.number-box.decimal');

  function updateSlider() {
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateArrows();
    updateIndicators();
  }

  function updateIndicators() {
    indicators.forEach((el, i) => {
      el.classList.toggle('active', i === currentIndex);
    });
  }

  function updateArrows() {
    // kalau cuma 1 slide → sembunyikan semua panah
    if (slides.length <= 1) {
      leftArrow.style.display = 'none';
      rightArrow.style.display = 'none';
      return;
    }

    // kalau di slide pertama → sembunyikan panah kiri
    if (currentIndex === 0) {
      leftArrow.style.visibility = 'hidden';
      rightArrow.style.visibility = 'visible';
    }
    // kalau di slide terakhir → sembunyikan panah kanan
    else if (currentIndex === slides.length - 1) {
      leftArrow.style.visibility = 'visible';
      rightArrow.style.visibility = 'hidden';
    }
    // kalau di tengah-tengah → tampilkan dua-duanya
    else {
      leftArrow.style.visibility = 'visible';
      rightArrow.style.visibility = 'visible';
    }
  }

  leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  rightArrow.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  // inisialisasi posisi awal
  updateSlider();
}

const denominatorEquationInputCheck = () => {
  const packs = document.querySelectorAll('.equalization-pack');

  packs.forEach(pack => {
    const inputs = pack.querySelectorAll('.number-input');
    const flower = pack.querySelector('.flower-stalk');

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const allFilled = Array.from(inputs).every(i => i.value.trim() !== '');

        if (allFilled) {
          flower.classList.add('grow');
        } else {
          flower.classList.remove('grow');
        }
      });
    });

  });
}

const denominatorSynchronization = () => {
  const inputs = document.querySelectorAll('input.first-fraction__denominator');

    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            // Update semua input
            inputs.forEach(i => i.value = value);
        });
    });
}

const setColorTheme = () => {
  const calcInputs = document.querySelectorAll('.calc-input input');
  
  if (!calcInputs.length) return;
  const colorTheme = JSON.parse(sessionStorage.getItem('colorTheme'));

  calcInputs.forEach(input => {
    input.style.border = `2px solid ${colorTheme.primary_color}`;
  });
}

const divisorSynchronization = () => {
  const inputs = document.querySelectorAll('input.fpb-input');

    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            // Update semua input
            inputs.forEach(i => i.value = value);
        });
    });
}

// Tampilan pertama saat membuka kalkulator
const initFPBCalculator = () => {
  const btnCalc = document.querySelector('.fpb-calc-btn');
  const btnAddInput = document.querySelector('#addNumber');
  const numberInputsWrapper = document.querySelector('#numberInputs');
  const btnStart = document.querySelector('#startCalc');
  const fpbInputs = document.querySelector('.input-area');
  const tableContainer = document.querySelector('.table-container');
  const btnClose = document.querySelector('.modal-fpb .btn-close');

  // OPEN MODAL
  btnCalc?.addEventListener('click', () => {
    document.querySelector('#fpbOverlay')?.style.setProperty('display', 'flex');
  });

  // INPUT VALIDATION
  fpbInputs?.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      input.style.border = '1.5px solid #264653';

      const num = input.value;
      if (isNaN(num)) {
        input.value = "";
      }
    });
  });

  // ADD INPUT
  btnAddInput?.addEventListener('click', () => {
    numberInputsWrapper?.insertAdjacentHTML('beforeend', optionalInputNumber());
    btnAddInput.style.display = 'none';
  });

  // REMOVE INPUT (EVENT DELEGATION - AMAN GLOBAL)
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("remove-btn")) {
      document.querySelector('.optional-input-number')?.remove();
    }
  });

  // START CALCULATION
  btnStart?.addEventListener('click', () => {

    const inputs = document.querySelectorAll(".fpb-number");
    const numbers = [];
    let adaKosong = false;

    inputs.forEach(input => {
      if (input.value.trim() === "") {
        input.style.border = "1.5px solid red";
        adaKosong = true;
        return;
      }

      numbers.push(parseInt(input.value));
    });

    if (adaKosong) return;

    fpbInputs?.style.setProperty('display', 'none');
    tableContainer?.style.setProperty('display', 'flex');
    document.querySelector('.bottom-content')?.style.setProperty('display', 'flex');

    createFPBTable(numbers);
  });

  // CLOSE MODAL
  btnClose?.addEventListener('click', () => {
    document.querySelector('#fpbOverlay')?.style.setProperty('display', 'none');
  });
};

// Membuat tabel berdasarkan angka yg dimasukkan
const createFPBTable = (numbers) => {

  const table = document.querySelector("#fpbTable");
  table.innerHTML = "";

  // ===== BARIS PERTAMA (angka awal) =====
  const row1 = document.createElement("tr");

  // kolom kosong kiri
  const emptyCell = document.createElement("td");
  row1.appendChild(emptyCell);

  numbers.forEach(num => {

    const td = document.createElement("td");
    td.textContent = num;

    row1.appendChild(td);

  });

  table.appendChild(row1);


  // ===== BARIS KEDUA (input bilangan prima) =====
  const row2 = document.createElement("tr");

  // kolom input prima
  const primeCell = document.createElement("td");
  primeCell.appendChild(createPrimeSpinner());

  row2.appendChild(primeCell);

  // kolom hasil pembagian
  numbers.forEach((num) => {

    const td = document.createElement("td");

    const resultInput = document.createElement("input");
    resultInput.className = 'calc-cell';
    resultInput.type = "text";
    resultInput.disabled = true;
    resultInput.dataset.value = num;

    td.appendChild(resultInput);
    row2.appendChild(td);

  });

  table.appendChild(row2);

  runFPBTable();

};


// Logika saat user mulai melakukan perhitungan
const runFPBTable = () => {
  const table = document.querySelector("#fpbTable");
  const tableContainer = document.querySelector('.table-container');
  const btnReset = document.querySelector('.reset-calc');

  // ⛔ cek di elemen, bukan di luar
  if (!table._hasInputListener) {
    table.addEventListener("input", (e) => {
      if (!e.target.classList.contains("prime-input")) return;

      const currentRow = e.target.closest("tr");
      handlePrimeChange(currentRow);
    });

    table._hasInputListener = true; // tandai sudah dipasang
  }

  if (!btnReset._hasClickListener) {
    btnReset.addEventListener('click', () => {
      tableContainer.style.display = "none";

      const fpbInputs = document.querySelector('.input-area');
      fpbInputs.style.display = 'flex';

      const fpbNumber = document.querySelectorAll('.fpb-number');
      fpbNumber.forEach(input => input.value = '');

      const fpbResult = document.querySelector('#hasilFpb');
      fpbResult.textContent = '-';

      const fpbResultArea = document.querySelector('.modal-fpb .hasil-area');
      fpbResultArea.classList.remove('finished');

      document.querySelector('.bottom-content').style.display = 'none';

      document.querySelector('#equal').style.display = 'none';

      document.querySelector('#multiplicationResult').textContent = '';
    });

    btnReset._hasClickListener = true;
  }
};

const handlePrimeChange = (row) => {

  const result = processRow(row);

  if(result.foundOne || result.allDifferentPrime){
    disablePrimeInput(row);

    if(result.allDifferentPrime){
      highlightDifferentPrime();
    }

    finishCalculation();
    return;
  }

  if(result.hasNext){
    addNextRow(row);
  }

}

const processRow = (tr) => {

  const primeInput = tr.querySelector(".prime-input");
  const prime = parseInt(primeInput.value);
  const fpbResult = document.querySelector('#hasilFpb');
  const multiplicationResult = document.querySelector('#multiplicationResult');
  const equalSymbol = document.querySelector('#equal');

  const numberCells = tr.querySelectorAll(".calc-cell");

  let hasNext = false;
  let foundOne = false;
  let allCellsFilled = true;
  const lastValues = [];

  numberCells.forEach(cell => {

    const original = parseInt(cell.dataset.value);
    const result = original / prime;

    if(!Number.isInteger(result) || result < 1){

      cell.value = "-";
      allCellsFilled = false;
      lastValues.push(original);

    }else{
      if(number.isPrime(result)) cell.classList.add('prime-num');

      cell.value = result;

      if(result >= 2){
        hasNext = true;
      }

      if(result === 1){
        foundOne = true;
        cell.style.backgroundColor = '#d1ecf1';
      }

      lastValues.push(result);

    }

  });

  if (allCellsFilled) {
    primeInput.style.backgroundColor = '#d4edda';
    if (fpbResult.textContent === "-") {
      fpbResult.textContent = prime;
    } else {
      fpbResult.textContent += ` x ${prime}`;
      equalSymbol.style.display = 'inline-block';
      multiplicationResult.textContent = `${string.countMultiplicationFromString(fpbResult.textContent)}`;
    }
  }

  const allDifferentPrime = number.isAllPrimeAndUnique(lastValues);

  return {hasNext, foundOne, allDifferentPrime};

}

const addNextRow = (prevRow) => {

  const table = document.querySelector("#fpbTable");
  const tableContainer = document.querySelector('.table-container');

  const newRow = document.createElement("tr");

  // ===== PRIME CELL =====
  const primeCell = document.createElement("td");
  const spinner = createPrimeSpinner();

  const prevPrime = parseInt(
    prevRow.querySelector(".prime-input").value
  );

  spinner.startPrime = prevPrime || 1;
  spinner.input.value = "";

  primeCell.appendChild(spinner);
  newRow.appendChild(primeCell);

  // ===== HASIL PEMBAGIAN =====
  const prevCells = prevRow.querySelectorAll(".calc-cell");

  prevCells.forEach(prevCell => {

    const td = document.createElement("td");

    const input = document.createElement("input");
    input.className = "calc-cell";
    input.type = "text";
    input.disabled = true;

    // 🔥 ambil nilai dari row sebelumnya
    input.dataset.value = prevCell.value !== "-" 
    ? prevCell.value 
    : prevCell.dataset.value;

    // kosongkan tampilan
    input.value = "";

    td.appendChild(input);
    newRow.appendChild(td);

  });

  table.appendChild(newRow);
  tableContainer.scrollTop = tableContainer.scrollHeight;

  // 🔥 disable row sebelumnya
  disablePrimeInput(prevRow);
};

const disablePrimeInput = (row) => {

  const input = row.querySelector(".prime-input");
  const buttons = row.querySelectorAll("button");

  input.disabled = true;

  buttons.forEach(btn => btn.remove());

}

const finishCalculation = () => {

  const inputs = document.querySelectorAll(".prime-input");
  const fpbResult = document.querySelector('.hasil-area');

  inputs.forEach(input => input.disabled = true);

  fpbResult.classList.add('finished');
  
}

const handleQuizFlow = async ({
  findStudentQuizProgress,
  studentId,
  modul,
  level,
  detailQuiz,
}) => {
  const tutorial = new Tutorial(tutorialData);
  const cityId = sessionStorage.getItem('cityId');

  if (findStudentQuizProgress.statusCode === 404) {
    await DBSource.addProgressQuiz(studentId, modul.id, level);
    return handleNewProgress(tutorial, cityId, level, detailQuiz);
  }

  const quizProgress = findStudentQuizProgress.result;
  saveQuizProgressToSession(quizProgress);

  if (quizProgress.is_tutorial_passed) {
    return handlePassedTutorial(detailQuiz);
  }

  return handleUnpassedTutorial(tutorial, cityId, level, detailQuiz);
}

function handleNewProgress(tutorial, cityId, level, detailQuiz) {
  if (tutorial.hasData(cityId, level)) {
    renderPopup(createPopupTutorialUnpassed(), [
      {
        selector: '#start-tutorial',
        handler: () => startFlow({ withTutorial: true, detailQuiz, instance: this }),
      },
    ]);
  } else {
    renderPopup(createPopupTutorialUnavailable(), [
      {
        selector: '#start-quiz',
        handler: async () => {
          await startQuiz();
          startFlow({ withTutorial: false, detailQuiz, instance: this });
        },
      },
    ]);
  }
}

function saveQuizProgressToSession(progress) {
  sessionStorage.setItem('quizProgressId', progress.id);
  sessionStorage.setItem('isTutorialPassed', progress.is_tutorial_passed);
}

function handlePassedTutorial(detailQuiz) {
  renderPopup(createPopupTutorialPassed(), [
    {
      selector: '#repeat-tutorial',
      handler: () => startFlow({ withTutorial: true, detailQuiz, instance: this }),
    },
    {
      selector: '#start-quiz',
      handler: async () => {
        await startQuiz();
        startFlow({ withTutorial: false, detailQuiz, instance: this });
      },
    },
  ]);
}

function handleUnpassedTutorial(tutorial, cityId, level, detailQuiz) {
  if (tutorial.hasData(cityId, level)) {
    renderPopup(createPopupTutorialUnpassed(), [
      {
        selector: '#start-tutorial',
        handler: () => startFlow({ withTutorial: true, detailQuiz, instance: this }),
      },
    ]);
  } else {
    renderPopup(createPopupTutorialUnavailable(), [
      {
        selector: '#start-quiz',
        handler: async () => {
          await startQuiz();
          startFlow({ withTutorial: false, detailQuiz, instance: this });
        },
      },
    ]);
  }
}

async function startFlow({ withTutorial, detailQuiz }) {
  sessionStorage.setItem('isThisWithTutorial', withTutorial ? 1 : 0);

  const popupOverlay = document.querySelector(".popup-overlay");
  popupOverlay?.remove();

  const labelQuiz = document.querySelector('.quiz-title');
  labelQuiz.classList.add('show');
  await showProgressBar();

  setTimeout(async () => {
    await Play.displayQuiz(detailQuiz, withTutorial ? 0 : 1);
  }, 3000);
}

function renderPopup(html, bindings = []) {
  document.querySelector('.play').insertAdjacentHTML('beforeend', html);

  bindings.forEach(({ selector, handler }) => {
    const el = document.querySelector(selector);
    el?.addEventListener('click', handler);
  });
}

export { numberInputValidation, insertTextAtCursor, areAllInputsFilledIn, deleteNumberInput, toggleFractionMode, calcHandler, fractionToggler, submitStepHandler, multiChoicesHandler, openImageDetail, showPointer, showProgressBar, fractionDecomposition, comparisonSwitch, fractionComparisonSwitch, dragAndDropFraction, inputAnswerSlider, denominatorEquationInputCheck, denominatorSynchronization, setColorTheme, divisorSynchronization, initFPBCalculator, handleQuizFlow };