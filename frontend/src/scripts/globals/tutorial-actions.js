import { createArrowLineToLeftRight, createArrowToBottom, createSwapArrowToTop, createBtnNextTutorial, createClue, createClueWrapper, createCurvedArrowToBottom, createDialogTutorialBottom, createDialogTutorialTop, createDoubleCurvedLine, createFingerPointer, createFractionConversionAdditionLine, createFractionConversionMultiplicationLine, createGuide, createHelpText, createIllustrationContainer, createIllustrationSummary, createInstruction, createMultiplicationLineTop, createPointerText, createPrecisTutorial, createPrecisWrapper,  createRightArrow, createSwapArrow, createArrowToTop } from "../views/templates/template-creator";

const actions = {
  toggleOverlay: (next) => {
    document.querySelector('.play-container').classList.toggle('overlay');
    next();
  },

  focus: (next, target) => {
  
    target.forEach(el => {
      const targetEl = document.querySelector(el);
      targetEl.classList.toggle('focused');
    });
    next();
  },

  focusInput: (next, target) => {
    const input = document.querySelector(target);
    input.focus();
    next();
  },

  showGuide: (next, target, text, position) => {
    const targetEl = document.querySelector(target);
    targetEl.insertAdjacentHTML('beforeend', createGuide(text));
    targetEl.querySelector('.tutorial-guide').style.right = position[0];

    targetEl.querySelector('.tutorial-guide').style.left = position[1];
 
    
    const btnDone = document.querySelector('.tutorial-guide button');
    btnDone.addEventListener('click', () => {
      document.querySelector('.tutorial-guide').remove();
      next();
    });
  },

  unfocus: (next) => {
    const targetEl = document.querySelectorAll('.focused');
    targetEl.forEach(el => {
      el.classList.toggle('focused');
    });
    next();
  },

  showPrecisWrapper: (next) => {
    const resultContainer = document.querySelector('.result');
    resultContainer.insertAdjacentHTML('beforeend', createPrecisWrapper())
    next();
  },

  highlight: (next, elAttribute, index) => {
    const element = document.querySelectorAll(elAttribute)[index];
    element.classList.toggle('showed');
    next();

  },

  showPrecis: (next, precis, index) => {
    const precisArr = precis.split('|');
    const precisWrapper = document.querySelector('.precis-wrapper');
    precisWrapper.innerHTML += createPrecisTutorial(precisArr[index]);
    next()

  },

  showPointerText: (next, clue) => {
    const fingerContainer = document.querySelector('.finger-container');
    fingerContainer.insertAdjacentHTML('beforeend', createPointerText(clue));
    next();
  },

  showPointer: (next, target, instruction = 'Masukkan angka', textContainer = '.result', topPosition ='40px', rightPosition = 'unset', isInitial = false) => {

    if (target === null) {
      actions.showInstruction(instruction, textContainer);
      next();
      return;
    }
    
    if (target.startsWith('.')) {
      let btnTarget = document.querySelectorAll(`div${target}, span${target}`);
      console.log(btnTarget)
      btnTarget = btnTarget[btnTarget.length - 1];
      
      btnTarget.insertAdjacentHTML('beforeend', createFingerPointer());
      btnTarget.addEventListener('click', () => {
        btnTarget.querySelector('.finger-container').remove();
        next();
      }, { once: true });
    } else { // if the target is number
      const buttons = document.querySelectorAll('.number-buttons button');

      const button = Array.from(buttons).find(btn => btn.textContent.trim() === target);

      button.insertAdjacentHTML('beforeend', createFingerPointer());

      button.addEventListener('click', () => {
        button.querySelector('.finger-container').remove();
        next()
      }, { once: true });
    }

    const fingerEl = document.querySelector('.finger-container');
    fingerEl.style.top = topPosition;
    fingerEl.style.right = rightPosition;

    if (isInitial) {
      const firstInput = document.querySelector('.initial-focus');
      firstInput.focus();
    }

    setTimeout(() => actions.showInstruction(instruction, textContainer), 500);
    
  },

  removeElement: (next, elements) => {
    elements.forEach(target => {
      document.querySelectorAll(target).forEach(el => {
        el.remove();
      })
    });

    next();
  },

  showArrowMultiplication: (next, target, position, isFlipped = 0, type = 'operation', coords) => {
    const targetArrow = document.querySelector(target);

    if (type === 'operation') {
      switch (position) {
        case 'top':
          targetArrow.insertAdjacentHTML('beforeend', createMultiplicationLineTop());
          break;
        case 'bottom':
          targetArrow.insertAdjacentHTML('beforeend', createRightArrow());
          break;
        default:
          break;
      } 
    } else if (type === 'conversion') {
      switch (position) {
        case 'bottom':
          targetArrow.insertAdjacentHTML('beforeend', createFractionConversionMultiplicationLine());
          break;
        case 'top':
          targetArrow.insertAdjacentHTML('beforeend', createFractionConversionAdditionLine());
          break;
        case 'top-to-bottom':
          targetArrow.insertAdjacentHTML('beforeend', 
          createCurvedArrowToBottom());
          break;
        default:
          break;
      }
    } else if (type === 'common') {
      switch (position) {
        case 'to-top': {
          targetArrow.insertAdjacentHTML('beforeend', createArrowToTop());
          const arrow = document.querySelector('.arrow-line.to-top');
          arrow.style.top = coords[0];
          arrow.style.left = coords[1];
          break; 
        }
        case 'to-top-left': {
          targetArrow.insertAdjacentHTML('beforeend', createArrowLineToLeftRight());
          const arrow = document.querySelector('.arrow-line.to-top-left');
          arrow.style.top = coords[0];
          arrow.style.left = coords[1];
          break;
        }
        default:
          break;
      }
    }

    if (isFlipped) {
      const arrowEl = document.querySelector('.arrow:last-of-type');
      arrowEl.classList.add(`flip-horizontal`);
      
    }
    

    next();
  },

  showInstruction: (text, container) => {
    const containerEl = document.querySelector(container);

    if (!document.querySelector('.tutorial-instruction')) {
      containerEl.insertAdjacentHTML('beforeend', createInstruction(text));
    }

    if (container !== '.result') {
      const instructionEl = document.querySelector('.tutorial-instruction');
      instructionEl.style.left = '110%';
      // instructionEl.querySelector('.tutorial-instruction img').style.right = '-30px';
      // instructionEl.querySelector('.tutorial-instruction img').style.top = '-35px';
    }
  },

  showClue: (next , text, target, positions) => {
    const targetEl = document.querySelector(target);
    const cluesWrapper = document.querySelector('.tutorial-clue__wrapper');

    if (cluesWrapper) {
      cluesWrapper.insertAdjacentHTML('beforeend', createClue(text));
    } else {
      targetEl.insertAdjacentHTML('beforeend', createClueWrapper(text));
    }
    
    document.querySelector('.tutorial-clue:last-child').style.top = positions[0];

    document.querySelector('.tutorial-clue:last-child').style.right = positions[1];
    next();
  },

  addClueList: (next, text) => {
    const clueList = document.querySelector('.clue-list');
    clueList.classList.add('show');

    const li = document.createElement('li');
    li.innerHTML = `${text}`;

    clueList.insertAdjacentElement('beforeend', li);

    next();
  },
  
  removeHighlight: (next) => {
    const highlightElements = document.querySelectorAll('.known');

    highlightElements.forEach(el => {
      el.classList.toggle('showed');
    });
    
    next();
  },

  addBtnNext: (next, target, btnText = 'Oke, mengerti') => {
    const targetEl = document.querySelector(target);
    targetEl.insertAdjacentHTML('beforeend', createBtnNextTutorial());

    const btn = document.querySelector('.btn-next__tutorial:last-child');
    btn.textContent = btnText;

    btn.addEventListener('click', () => {
      btn.remove();
      next(); 
    }, { once: true });
  },

  showIllustrationContainer: (next) => {
    const resultContainer = document.querySelector('.result');
    resultContainer.insertAdjacentHTML('beforeend', createIllustrationContainer());
    next();
  },

  addItemToContainer: (next, target, itemHtmlString) => {
    const container = document.querySelector(target);

    container.insertAdjacentHTML('beforeend', itemHtmlString);

    next()
  },

  showIllustrationSummary: (next, text) => {
    const container = document.querySelector('.result');
    container.insertAdjacentHTML('beforeend', createIllustrationSummary(text));
    next();
  },

  showDialog: (next, target, text, position) => {
    const targetEl = document.querySelector(target);
    if (position === 'top') {
      
      targetEl.insertAdjacentHTML('afterbegin', createDialogTutorialTop(text));
    } else if (position === 'bottom') {
      document.querySelector('.dialog-tutorial.bottom')?.remove();
      targetEl.insertAdjacentHTML('afterbegin', createDialogTutorialBottom(text));
    }
    next();
  },

  hideElement: (next, target) => {
    const targetEl = document.querySelector(target);
    targetEl.classList.contains("show") ? targetEl.classList.remove("show") : targetEl.style.display = "none";

    next();
  },

  showElement: (next, target) => {
    const targetEl = document.querySelector(target);
    targetEl.style.display = 'block';
    next();
  },

  addOverlay: (next, target, overlayEl) => {
    const targetEl = document.querySelector(target);
    targetEl.insertAdjacentHTML('beforeend', overlayEl);
    next();
  },

  showAllElementsGradually: async(next, target) => {
    const allTarget = document.querySelectorAll(target);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < allTarget.length; i++) {
      allTarget[i].style.visibility = 'visible';

      await delay(600);
    }

     next();
  },

  showArrowNextBtn: (next, target) => {
    const targetEl = document.querySelector(target);
    targetEl.insertAdjacentHTML('beforeend', '<button class="btn-right-arrow"><img src="dialog-next.png"></button>');
// 
    const btnNext = document.querySelector('.btn-right-arrow');
    btnNext.addEventListener('click', () => next(), {once: true});
  },

  showSwapArrow: (next, target, direction) => {
    const targetEl = document.querySelector(target);

    if (direction === 'toTop') {
      targetEl.insertAdjacentHTML('beforeend', createSwapArrowToTop());
    }

    if (direction === 'toBottom') {
      targetEl.insertAdjacentHTML('beforeend', createArrowToBottom());
    }
    

    next();
  },

  checkInput: (next, target, text, onSubmit = false) => {
    let inputEl = document.querySelectorAll(target);
    inputEl = inputEl[inputEl.length - 1];
    const btnSubmit = document.querySelector('#btnSubmitResult');

    function handler(e) {
      const value = inputEl.value.trim();

      if (value === text) {
        e.target.removeEventListener("input", handler);
        next();
        if (onSubmit) { btnSubmit.classList.add('active') }
      } else {
        if (onSubmit) { btnSubmit.classList.remove('active') }
      }
    }

    inputEl.addEventListener('input', handler);
  },

  showDoubleCurvedLine: (next, target) => {
    const targetEl = document.querySelector(target);
    targetEl.insertAdjacentHTML('beforeend', createDoubleCurvedLine());

    next();
  },
  
  addHelperText: (next, targetContainer, text, positions) => {
    const comtainer = document.querySelector(targetContainer);
    comtainer.insertAdjacentHTML('beforeend', createHelpText(text));
    
    const helpText = document.querySelector('.help-text:last-of-type');
    helpText.style.top = positions[0];
    helpText.style.left = positions[1];
    next();
  },

  typingLoop: (next, steps) => {
    let i = 0;
    let typingEl = document.getElementById("typing");

    function loop() {
      typingEl.textContent = steps[i];

      if (i === steps.length - 1) {
        typingEl.style.color = "green";
      } else {
        typingEl.style.color = "black";
      }

      i = (i + 1) % steps.length; // looping
      setTimeout(loop, 1000); // ganti tiap 1 detik
    }

    loop();
    next();
  }
}
export default actions;