import DBSource from "../data/db-source";
import functionMap from "../globals/function-map";
import quizOption from "../globals/quiz-option";
import subQuiz from "../globals/sub-quiz";
import Play from "../views/pages/play";
import TutorialHandler from "./tutorial-handler";

const numberInputValidation = () => {
  const numberInput = document.querySelectorAll('.number-input.show');

  numberInput.forEach(input => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, '');
      areAllInputsFilledIn();
    });
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
    console.log(firstRealNum)
  } else if (activeInput.classList.contains('second-fraction')) {
    fractionInput.forEach(el => {
      el.classList.remove('show');
    });
    secondFractionContainer.classList.remove('show');
    secondRealNum.classList.add('show');
    secondRealNum.focus();
    console.log(secondRealNum)
  } else if (activeInput.id === 'firstNum') {
    firstFractionContainer.classList.add('show');
    firstDenominator.classList.add('show');
    firstNumerator.classList.add('show');
    firstRealNum.classList.remove('show');
    firstNumerator.focus();
    console.log(firstNumerator)
  } else if (activeInput.id === 'secondNum') {
    secondDenominator.classList.add('show');
    secondNumerator.classList.add('show');
    secondFractionContainer.classList.add('show');
    secondRealNum.classList.remove('show');
    secondNumerator.focus();
  }
}

const submitStepHandler = (mainId, stepQuiz, step) => {
  const btnSubmitResult = document.querySelectorAll('.btn-next-step');
  const checkerName = stepQuiz.find(sub => sub.step === step).answerChecker;
  
  btnSubmitResult.forEach(btn => {
    btn.addEventListener('click', async () => {
      const isQuizPassed = functionMap[checkerName]({mainId, step, btnEl: btn});
      await progressBarHandler(step, isQuizPassed);
      if (isQuizPassed) {
        console.log('Passed!')
        step++;
        await Play.displayStep(mainId, stepQuiz, step);
      }
    }, { once: true});
  })
  
}

const progressBarHandler = async (step, isQuizPassed) => {
  const mainIndex = sessionStorage.getItem('mainIndex');
  const progressBar = document.querySelector('.progress-bar');
  const minorProgressBar = progressBar.querySelectorAll('.minor-progress');
  const activeBullet = minorProgressBar[mainIndex].querySelector('.sub.active');
  const milestone = minorProgressBar[mainIndex].querySelector('.milestone');
  
  const cityId = sessionStorage.getItem('cityId');
  const rewards = await DBSource.getCityReward(cityId);
  let reward = {
    minor: '',
    milestone: '',
  };
  reward.minor = await rewards.data.find(reward => reward.name === 'minor');
  reward.milestone = await rewards.data.find(reward => reward.name === `milestone${step}`);

  if (isQuizPassed) {
    activeBullet.outerHTML = `
      <img class="${reward.minor['img_url']}" src="./rewards/${reward.minor['img_url']}.png">
    `;

    milestone.outerHTML = `
      <img class="milestone ${reward.milestone['img_url']}" src="./rewards/${reward.milestone['img_url']}.png">
    `
  }
  activeBullet.classList.remove('active'); 
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

const multiChoicesHandler = (mainId, stepQuiz, step) => {
  const btnAnswerChoices = document.querySelectorAll('.answer-choices button');

  btnAnswerChoices.forEach(btn => {
    btn.addEventListener('click', () => {
      step++;
      Play.displayStep(mainId, stepQuiz, step);
    });
  });
}

const openImageDetail = () => {
  const openImageBtn = document.querySelectorAll('.open-image-btn');
  const imageModal = document.getElementById('imageModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalImage = document.querySelector('.modal-image');
  const imageOptions = document.querySelectorAll('.answer-choices .illustration');

  openImageBtn.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const srcImage = imageOptions[index].getAttribute('src');
      modalImage.src = srcImage;
      imageModal.style.display = 'flex';
    });
  })

  closeModalBtn.addEventListener('click', () => {
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

export { numberInputValidation, insertTextAtCursor, areAllInputsFilledIn, deleteNumberInput, toggleFractionMode, calcHandler, fractionToggler, submitStepHandler, multiChoicesHandler, openImageDetail, showPointer };