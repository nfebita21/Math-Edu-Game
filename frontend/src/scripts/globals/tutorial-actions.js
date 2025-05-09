import { createBtnNextTutorial, createClue, createClueWrapper, createDialogTutorial, createDialogTutorialBottom, createDialogTutorialTop, createFingerPointer, createGlIllustrationOverlayA, createGuide, createIllustrationContainer, createIllustrationSummary, createInstruction, createMultiplicationLineTop, createPointerText, createPrecisTutorial, createPrecisWrapper,  createRightArrow } from "../views/templates/template-creator";

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
    console.log(`${createPrecisWrapper} 
      ditampilkan`);
    const resultContainer = document.querySelector('.result');
    resultContainer.insertAdjacentHTML('beforeend', createPrecisWrapper())
    next();
  },

  highlight: (next, elAttribute, index) => {
    const element = document.querySelectorAll(elAttribute)[index];
    element.classList.toggle('showed');
    next();

  },

  showPrecis: (next, text) => {
    const precisWrapper = document.querySelector('.precis-wrapper');
    precisWrapper.innerHTML += createPrecisTutorial(text);
    next()

  },

  showPointerText: (next, clue) => {
    const fingerContainer = document.querySelector('.finger-container');
    fingerContainer.insertAdjacentHTML('beforeend', createPointerText(clue));
    next();
  },

  showPointer: (next, target, instruction = 'Masukkan angka', isInitial = false) => {
    
    if (target.startsWith('.')) {
    const btnTarget = document.querySelector(target);
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

    if (isInitial) {
      const firstInput = document.querySelector('.initial-focus');
      firstInput.focus();
    }

    setTimeout(() => actions.showInstruction(instruction), 500);
    
  },

  removeElement: (next, elements) => {
    elements.forEach(target => {
      document.querySelector(target).remove();  
    });

    next();
  },

  showArrowMultiplication: (next, position) => {
    const multiplicationWrapper = document.querySelector('.multiplication-pair');

    switch (position) {
      case 'top':
        multiplicationWrapper.insertAdjacentHTML('beforeend', createMultiplicationLineTop());
        break;
      case 'bottom':
        multiplicationWrapper.insertAdjacentHTML('beforeend', createRightArrow());
        break;
      default:
        break;
    } 

    next();
  },

  showInstruction: (text) => {
    const container = document.querySelector('.result');

    if (!document.querySelector('.tutorial-instruction')) {
      container.insertAdjacentHTML('beforeend', createInstruction(text));
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
    targetEl.style.display = 'none';
    next();
  },

  addOverlay: (next, target) => {
    const targetEl = document.querySelector(target);
    targetEl.insertAdjacentHTML('beforeend', createGlIllustrationOverlayA());
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
    targetEl.insertAdjacentHTML('beforeend', '<button class="btn-right-arrow"></button>');

    const btnNext = document.querySelector('.btn-right-arrow');
    btnNext.addEventListener('click', () => next(), {once: true});
  }

  
}
export default actions;