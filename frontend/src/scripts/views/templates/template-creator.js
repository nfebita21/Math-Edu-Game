import DBSource from "../../data/db-source";
import Avatars from "../../globals/avatars";
import mainQuiz from "../../globals/main-quiz";
import quizOption from "../../globals/quiz-option";
import { array } from "../../utils/common";
import { getvalueLabel, renderFractionText } from "../../utils/quiz";
// import { fractionMultiplicationHandler } from "../../utils/play-handler";

const createCitySliderTemplate = (city, studentExp, rank) => `
  <div class="slide-wrapper">
    <div class="side-container">
      <img src="information.png" >
      <div class="city-info">
        <ul>
          <li>Nama kota: <span>${city['city_name']}</span></li>
          <li class="num-of-visitor">Jumlah pengunjung: <span>${city['num_of_visitor']}</span></li>
          <li>Peringkatmu: <span>${rank}</span></li>
          <li>Skor tertinggimu: <span>${studentExp}</span></li>
        </ul>
        <button id="leaderboard" onclick="window.location.href='#/leaderboard'">
          <img src="podium.png" />
        </button>
      </div>
    </div>
    <div class="cities">
      <h2 class="title">${city['city_name']}</h2>
      <div class="image-city-slider">
        <button class="btn-city-info">
          <img src="info.png">
        </button>
        <div class="city-info">
          <ul>
            <li>Nama kota: <span>${city['city_name']}</span></li>
            <li class="num-of-visitor">Jumlah pengunjung: <span>${city['num_of_visitor']}</span></li>
            <li class="rank-info">Peringkatmu: <span>${rank}</span></li>
            <li>Skor tertinggimu: <span>${studentExp}</span></li>
          </ul>
        </div>
        <button class="arrow prev" >&#10094</button>
        <img class="city-picture" src="./cities/${city['image_url']}">
        <img class="padlock" src="padlock.png">
        <button class="btn-buy-city">
          Buka Kota: <span>${city.price}</span>
          <img src="candy.png">
        </button>
        <button class="arrow next">&#10095</button>      
        <div class="modal">
          <img src="question.png">
          <p>Kamu yakin ingin membuka kota <span id="cityName">Marinalia</span> dengan harga <span id="price">${city.price}</span> permen? </p>
          <div class="modal-option">
            <button class="yes">Ya</button>
            <button class="cancel">Batal</button>
          </div>
        </div>
      </div>
      <div class="options">
        <button id="leaderboard" onclick="window.location.href='#/leaderboard'">
          <img src="podium.png" />
        </button>
        <button role="button" id="visit">
        Pergi
          <img src="plane.png" />
        </button>
      </div>
    </div>
  </div>
`;

const createGreetingBubble = (username) => `
  <div class="bubble-chat">
    <img src="bubble.png" >
    <p>Halo <span>${username}</span>,  rasakan nuansa berbagai macam kota dengan bermain game matematika!</p>
  </div>
`;

const createButtonBackToLobby = () => `
  <button class="btn-back-to-lobby">
    <i class="fa-solid fa-house"></i>
    <p>Kembali ke Lobby</p>
  </button>
`;

const createCategoryCardsContainer = (cityName) => `
  <div class="category-cards-container">
    <div class="label">
      <span></span>
      <p class="gallery__category-title">
        ${cityName}
      </p>
    </div>
    <div class="wrapper"></div>
  </div>
`;

const createEmptyCard = () => `
  <div class="gallery__empty-card">
    <img class="question-mark" src="question-mark.png" >
  </div>
`;

const createGalleryCard = (spot) => `
  <div class="gallery__card">
    <img class="badge-card" src="gallery-card.png">
    <div class="gallery__card-content">
      <img src="./secret-spots/${spot['picture_url']}" >
      <p>${spot['spot_name']}</p>
    </div>
  </div>
`;

const createRankingRow = (numRank, player) => `
  <li class="row">
    <div class="data-wrapper">
      <p>${numRank}</p>
      <div class="avatar-field">
        <div class="avatar-frame">
          <img src="./avatar/${player['avatar_url']}">
        </div>
      </div>
      <p>${player['nick_name']}</p>
      <p>${player['total_score']}</p>
    </div>
  </li>
`;

const createPurchaseConfirmationModal = () => `
  <div class="modal">
    <img src="question.png">
    <p>Kamu yakin ingin membuka kota Marinalia dengan membayar sebanyak 100 permen? </p>
    <div class="modal-option">
      <button class="yes">Ya</button>
      <button class="cancel">Batal</button>
    </div>
  </div>
`;

const createSettingsModal = (name, gender, imgUrl) => `
  <div class="modal__settings">
    <div class="settings-modal-overlay"></div>
    <div class="settings-modal">
      <div class="settings-modal__title-container">
        <p>Pengaturan Profil</p>
      </div>
      <span class="close-button" id="closeModalBtn">&times;</span>
      <ul>
        <li>
          <label for="name">Nama Panggilan:</label>
          <input id="name" value="${name}" autocomplete='off' disabled>
          <button id="editName">
            <img src="edit.png">
          </button>
        </li>
        <li>
          <label for="edit-avatar">Avatar:</label>
          <div class="avatar-view">
            <img src="./avatar/${imgUrl}">
          </div>
          <button id="editAvatar">
            <img src="edit.png">
          </button>
        </li>
        <li class="hidden">
          <div class="choose-avatar">
            <div class="choose-avatar__title-container">Ganti Avatar</div>
            <button class="option">
              <img id="option1" src="./avatar/${Avatars[gender][0]}">
            </button>
            <button class="option">
              <img src="./avatar/${Avatars[gender][1]}">
            </button>
            <button class="option">
              <img src="./avatar/${Avatars[gender][2]}">
            </button>
          </div>
        </li>
        <li>
          <button class="btn-save-changes" id="btnSaveChanges">
            <i class="fa-solid fa-floppy-disk"></i>
            Simpan
          </button>
        </li>
      </ul>
    </div>
    <div class="modal-confirmation">
      <p>Perubahan belum disimpan, yakin ingin menutup jendela ini?</p>
      <p>Kamu akan kehilangan semua perubahan data yang sudah kamu buat.</p>
      <div class="modal-confirmation__options">
        <button id="cancel">Tidak</button>
        <button id="continue">Ya</button>
      </div>
    </div>
  </div>
`;  

const createButtonLevel = (numLevel) => `
  <button class="button-lv-pushable" role="button">
    <span class="button-lv-shadow"></span>
    <span class="button-lv-edge"></span>
    <span class="button-lv-front text">
      Level ${numLevel}
    </span>
  </button>
`;

const createMainQuiz = (question) => {
  const adjustedQuestion = renderFractionText(question);
  return `
    <div class="main-quiz">
      <p>${adjustedQuestion}</p>
    </div>  `;
}

const createSubQuiz = (step, question) => `
  <div class="sub-quiz">
    <h2>Step ${step}</h2>
    <p>${question}</p>
  </div>
`;

const createResultQuiz = (templateResult) => {
  // templateResult.setup();

  return {
    htmlElement: `<div class="result"> 
      ${templateResult.htmlElement}
      
    </div>`,
    // setup: () => templateResult.setup()
  }
}

const glProgressBar = async (cityId, level) => {
  const getReward = await DBSource.getCityReward(cityId, level);
  const reward = getReward.data;
  const levelData = await DBSource.level(cityId, level);
  const baseReward = (reward.find(item => item.name === "milestone0")).img_url;
  console.log(baseReward);

  const questionCount = levelData.question_count;
  const stepCount = levelData.step_count;

  const minorProgressItem = `<span class="sub bullet"></span>`;

  const minorProgress = `
    <div class="gl-minor-progress minor-progress">
      ${minorProgressItem.repeat(stepCount)}
      <img class="milestone milestone0" src="./rewards/${baseReward}.png">
    </div>`;
  
  const progressBarEl = `
  <div class="gl-progress-bar progress-bar">
    ${minorProgress.repeat(questionCount)}
  </div>
  `;
  // <div class="gl-minor-progress minor-progress">
  //     <span class="sub bullet"></span>
  //     <span class="sub bullet dua"></span>
  //     <span class="sub bullet"></span>
  //     <span class="sub bullet"></span>
  //     <img class="milestone milestone0" src="./rewards/sprout.png">
  //   </div>
  //   <div class="gl-minor-progress minor-progress">
  //     <span class="sub bullet"></span>
  //     <span class="sub bullet"></span>
  //     <span class="sub bullet"></span>
  //     <span class="sub bullet"></span>
  //     <img class="milestone milestone0" src="./rewards/sprout.png">
  //   </div>
  //   <div class="gl-minor-progress minor-progress">
  //     <span class="sub bullet"></span>
  //     <span class="sub bullet"></span>
  //     <span class="sub bullet"></span>
  //     <span class="sub bullet"></span>
  //     <img class="milestone milestone0" src="./rewards/sprout.png">
  //   </div>
  //   <div class="gl-minor-progress minor-progress">
  //     <span class="sub bullet"></span>
  //     <span class="sub bullet"></span>
  //     <span class="sub bullet"></span>
  //     <span class="sub bullet"></span>
  //     <img class="milestone milestone0" src="./rewards/sprout.png">
  //   </div>
  //   <div class="gl-minor-progress minor-progress">
  //     <span class="sub bullet"></span>
  //     <span class="sub bullet"></span>
  //     <span class="sub bullet"></span>
  //     <span class="sub bullet"></span>
  //     <img class="milestone milestone0" src="./rewards/sprout.png">
  //   </div>
  // </div>
  return progressBarEl;
};

const fractionSetQuestion = (mainId, currentStep, operator) => {
  return {
    htmlElement: `<div class="calc-result">
      <div class="calc-input">
        <div class="first-number">
          <input id="firstNum" class="initial-focus number-input first-number show" autofocus maxlength="2" autocomplete="off"></input>
        </div>
        <div class="fraction-container first">
          <input class="first-fraction number-input" id="numerator" max-length="2" autocomplete="off">
          <div class="fraction-line"></div>
          <div class="first-fraction__denominator">
            <input class="first-fraction first-fraction__denominator number-input" id="denominator" autocomplete="off">
          </div>
        </div>
        <p class="operator">${operator}</p>
        <div class="second-number">
          <input id="secondNum" class="show number-input second-number" maxlength="2" autocomplete="off">
        </div>
        <div class="fraction-container second">
          <input class="second-fraction number-input" id="numerator" max-length="2" autocomplete="off">
          <div class="fraction-line"></div>
          <div class="second-fraction__denominator">
            <input class="second-fraction number-input second-fraction__denominator" id="denominator" autocomplete="off">
          </div>
        </div>
      </div>
      <div class="number-buttons">
        <button id="deleteNumber"><i class="fa-solid fa-delete-left"></i></button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button class="btn-fraction" id="fractionMode">
          <img src="math.png">
        </button>
        <button>4
        <button>5</button>
        <button>6</button>
        <button>0</button>
        <button>1</button>
        <button>2</button>
        <button>3</button>
      </div>
      <div class="btn-submit-result__container">
        <button class="btn-submit-result btn-next-step" id="btnSubmitResult">Lanjut</button>
      </div>
    </div>`,
    // setup: () => fractionMultiplicationHandler.init()
  }
}

const fractionResult = (mainId, currentStep, operator) => {
  const stepQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).sub;
  const currentStepIndex = stepQuiz.findIndex(sub => sub.id === currentStep.id);
  const previousStepId = stepQuiz[currentStepIndex - 1].id;
  
  const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;
  // const find = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id == previousStepId);

  const correctAnswer = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id == previousStepId).answer.split('*');
  
  
  const firstNum = correctAnswer[0].split('/');
  const firstNumEl = firstNum.length === 1 ? `<span>${firstNum[0]}</span>` : `<span class="fraction" id="fraction">
    <span class="numerator">${firstNum[0]}</span>
    <span class="denominator">${firstNum[1]}</span>
  </span>`
  const secondNum = correctAnswer[1].split('/');
  const secondNumEl = secondNum.length === 1 ? `<span>${secondNum[0]}</span>` : `<span class="fraction" id="fraction">
    <span class="numerator">${secondNum[0]}</span>
    <span class="denominator">${secondNum[1]}</span>
  </span>`;
  return {
    htmlElement: `<div class="calc-result">
      <div class="calc-input">
        <div class="fraction-question">
          <p class="multiplication-pair">
            ${firstNumEl}
            <span class="operator">${operator}</span>
            ${secondNumEl}
            =
          </p>
          <div class="fraction-container">
            <div class="first-fraction__numerator">
              <input class="first-fraction initial-focus number-input show first-fraction__numerator" id="numerator" max-length="2" autocomplete="off">
            </div>
            <div class="fraction-line"></div>
            <div class="first-fraction__denominator">
              <input class="first-fraction number-input show first-fraction__denominator" id="denominator" autocomplete="off">
            </div>
          </div>
        </div>
      </div>
      <div class="number-buttons fr-result">
        <button id="deleteNumber"><i class="fa-solid fa-delete-left"></i></button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button class="btn-fraction" id="fractionMode">
        </button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>0</button>
        <button>1</button>
        <button>2</button>
        <button>3</button>
      </div>
      <div class="btn-submit-result__container">
        <button class="btn-submit-result btn-next-step" id="btnSubmitResult">Lanjut</button>
      </div>
    </div>`,
    // setup: () => fractionMultiplicationHandler.init()
  }
}
  
const fractionAbilityToSimplify = (mainId, currentStep) => {
  const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;
  const stepQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).sub;
  const currentStepIndex = stepQuiz.findIndex(sub => sub.id === currentStep.id);
  const correctMultiplicationId = stepQuiz[currentStepIndex - 2].id;
  
  const correctMultiplication = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === correctMultiplicationId).answer.split('*');
  const firstNum = correctMultiplication[0].split('/');
  const firstNumEl = firstNum.length === 1 ? `<span id="first">${firstNum[0]}</span>` : `<span class="first fraction" id="fraction">
    <span class="numerator">${firstNum[0]}</span>
    <span class="denominator">${firstNum[1]}</span>
  </span>
  `;
  // const numerator = correctMultiplication[0].split('/')[0];
  // const denominator = correctMultiplication[0].split('/')[1];
  const secondNum = correctMultiplication[1].split('/');
  const secondNumEl = secondNum.length === 1 ? `<span id="second">${secondNum[0]}</span>` : `<span class="first fraction" id="fraction">
    <span class="numerator">${secondNum[0]}</span>
    <span class="denominator">${secondNum[1]}</span>
  </span>
  `;
  const previousStepId = stepQuiz[currentStepIndex - 1].id;
  const multiplicationResult = options.find(opt => opt.main_quiz_id === mainId & opt.sub_quiz_id === previousStepId & opt.is_correct).answer.split('/');
  // const correctMultiplicationResult = multiplicationResult.choices.find(result => result.isCorrect === true).answer.split('/');
  const resultNumerator = multiplicationResult[0];
  const resultDenominator = multiplicationResult[1];
  
  // butuh main id
  const choicesAnswer = options.filter(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === currentStep.id);
  return {
    htmlElement: `  
      <div class="fraction-question">
        ${firstNumEl}
        <span class="operator">x</span>
        ${secondNumEl}
        =
        <span class="fraction result" id="fraction">
          <span class="numerator">${resultNumerator}</span>
          <span class="denominator">${resultDenominator}</span>
        </span>
      </div>
      <div class="answer-choices simplified-ability">
        <button class="yes btn-next-step">
          <img class="flower" src="flower.png">
          <span class="alphabet">A.</span>
          <p>${choicesAnswer[0].answer}</p>
        </button>
        <button class="no btn-next-step">
          <img class="flower" src="flower.png">
          <span class="alphabet">B.</span>
          <p>${choicesAnswer[1].answer}</p>
        </button>
      </div>
    `
  }
}

const simplestFractionAnswer = (mainId, currentStep) => {
  const subQuizId = currentStep.id;
  const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;
  const stepQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).sub;
  const currentStepIndex = stepQuiz.findIndex(sub => sub.id === currentStep.id);
  const correctMultiplicationId = stepQuiz[currentStepIndex - 2].id;
  const correctMultiplication = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === correctMultiplicationId && opt.is_correct).answer.split('/');
  // const stepAnswer = stepAnswerOptionDetail.choices.find(choice => choice.isCorrect == true);
  const numerator = correctMultiplication[0];
  const denominator = correctMultiplication[1];
  const choicesAnswer = options.filter(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === subQuizId);

  const firstOption = choicesAnswer[0].answer;
  const firstOptionStr = firstOption.includes('/') ? `
    <span class="fraction result" id="fraction">
      <span class="numerator">${firstOption.split('/')[0]}</span>
      <span class="denominator">${firstOption.split('/')[1]}</span>
    </span>` : firstOption;

  const secondOption = choicesAnswer[1].answer;
  const secondOptionStr = secondOption.includes('/') ? `
    <span class="fraction result" id="fraction">
      <span class="numerator">${secondOption.split('/')[0]}</span>
      <span class="denominator">${secondOption.split('/')[1]}</span>
    </span>` : secondOption;

  const thirdOption = choicesAnswer[2].answer;
  const thirdOptionStr = thirdOption.includes('/') ? `
    <span class="fraction result" id="fraction">
      <span class="numerator">${thirdOption.split('/')[0]}</span>
      <span class="denominator">${thirdOption.split('/')[1]}</span>
    </span>` : thirdOption;

  const optionsStr = [firstOptionStr, secondOptionStr, thirdOptionStr];
  const mainIndex = sessionStorage.getItem('mainIndex');
  const randomAnswer = mainIndex == 0 ? optionsStr : array.shuffle(optionsStr);


  return {
    htmlElement: `
      <div class="fraction-question">
        <span class="fraction result" id="fraction">
          <span class="numerator">${numerator}</span>
          <span class="denominator">${denominator}</span>
        </span>
        =
        ?
      </div>
      <div class="answer-choices simplified-answer">
        <button class="btn-next-step">
          <span class="alphabet">A.</span>
          <p>${randomAnswer[0]}</p>
          <img class="pot-plant" src="pot-plant.png">
        </button>
        <button class="btn-next-step">
          <span class="alphabet">B.</span>
          <p>${randomAnswer[1]}</p>
          <img class="pot-plant" src="pot-plant.png">
        </button>
        <button class="btn-next-step">
          <span class="alphabet">C.</span>
          <p>${randomAnswer[2]}</p>
          <img class="pot-plant" src="pot-plant.png">
        </button>
      </div>
    `
  }
}

const illustrationChoices = (mainId, currentStep) => {
  // const subQuizId = currentStep.id;
  const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;
  const stepQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).sub;
  const currentStepIndex = stepQuiz.findIndex(sub => sub.id === currentStep.id);
  const correctMultiplicationId = stepQuiz[currentStepIndex - 4].id;
  const correctMultiplication = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === correctMultiplicationId && opt.is_correct).answer.split('*');
  // const correctMultiplication = quizOption.find(opt => opt.mainQuizId === mainId && opt.subQuizId === currentStep.id - 4).choices[0].answer.split('*');
  const firstNum = correctMultiplication[0].split('/');
  const firstNumEl = firstNum.length === 1 ? `<span id="first">${firstNum[0]}</span>` : `<span class="first fraction" id="fraction">
    <span class="numerator">${firstNum[0]}</span>
    <span class="denominator">${firstNum[1]}</span>
  </span>
  `;
  const secondNum = correctMultiplication[1].split('/');
  const secondNumEl = secondNum.length === 1 ? `<span id="second">${secondNum[0]}</span>` : `<span class="first fraction" id="fraction">
    <span class="numerator">${secondNum[0]}</span>
    <span class="denominator">${secondNum[1]}</span>
  </span>
  `;

  const abilityToSimplifyId = stepQuiz[currentStepIndex - 2].id;
  const isCanBeSimplified = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === abilityToSimplifyId && opt.is_correct).answer;

  let multiplicationResult;

  let correctFractionStr;

  if (isCanBeSimplified === 'Tidak') {
    const correctMultiplicationResultId = stepQuiz[currentStepIndex - 3].id;
    multiplicationResult = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === correctMultiplicationResultId && opt.is_correct).answer.split('/');
    // const correctMultiplicationResult = multiplicationResult.choices.find(result => result.isCorrect === true).answer.split('/');
    const resultNumerator = multiplicationResult[0];
    const resultDenominator = multiplicationResult[1];

    correctFractionStr = `
      <span class="fraction result" id="fraction">
          <span class="numerator">${resultNumerator}</span>
          <span class="denominator">${resultDenominator}</span>
        </span>
    `;
  } else {
    const correctSimpliestResultId = stepQuiz[currentStepIndex - 1].id;
    multiplicationResult = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === correctSimpliestResultId && opt.is_correct).answer;
    // const correctMultiplicationResult = multiplicationResult.choices.find(result => result.isCorrect === true);

    if (multiplicationResult.includes('/')) {
      const splittedCorrectMultiplicationResult = multiplicationResult.split('/');
      const resultNumerator = splittedCorrectMultiplicationResult[0];
      const resultDenominator = splittedCorrectMultiplicationResult[1];
      correctFractionStr = `
      <span class="fraction result" id="fraction">
          <span class="numerator">${resultNumerator}</span>
          <span class="denominator">${resultDenominator}</span>
        </span>
    `;
    } else {
      correctFractionStr =  `
        <span class="fraction result">${multiplicationResult}</span>
      `;
    }
  }
 
  const choicesAnswer = options.filter(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === currentStep.id);
  const mainIndex = sessionStorage.getItem('mainIndex');
  const randomAnswer = mainIndex == 0 ? choicesAnswer : array.shuffle(choicesAnswer);

  const mainQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).main;
  const currentMain = mainQuiz.find(main => main.id === mainId);

  return {
    htmlElement: `
      <div class="fraction-question">
        ${firstNumEl}
        <span class="operator">x</span>
        ${secondNumEl}
        =
        ${correctFractionStr}
        <p class="fraction-unit">${currentMain.fraction_unit}</p>
      </div>
      <div class="answer-choices">
        <button class="option-a btn-next-step">
          <span class="alphabet">
            A.
            <img class="grass" src="grass.png">
          </span>
          <img class="illustration" src="./illustrations-quiz/${randomAnswer[0].answer}">
          <span class="open-image-btn first">
            <i class="fa-solid fa-magnifying-glass-plus"></i>
          </span>
        </button>
        <button class="option-b btn-next-step">
          <span class="alphabet">
            B.
            <img class="grass" src="grass.png">
          </span>
          <img class="illustration" src="./illustrations-quiz/${randomAnswer[1].answer}">
          <span class="open-image-btn second">
            <i class="fa-solid fa-magnifying-glass-plus"></i>
          </span>
        </button>
      </div>
    `
  }
}

const createFingerPointer = () => `
  <div class="finger-container">
    <img src="point.png">
  </div>
`;

const createPrecisWrapper = () => `
  <div class="precis-wrapper">
    <p>Diketahui:</p>
  </div>
`;

const createPrecisTutorial = (text) => `
  <p><i class="fa-solid fa-leaf"></i> ${text}</p>
`;

const createPointerText = (text) => `
  <div class="pointer-text">
    <p>${text}</p>
  </div>
`;

const createMultiplicationLineTop = () => `
  <svg class="curved-line" width="40" height="50"> 
    <path d="M 3 15 Q 20 -5, 35 29" stroke="blue" stroke-width="2" fill="none" /> 
  </svg>
`;

const createArrowToTop = () => `
<svg class="swap-arrow" viewBox="0 0 30 30"
     xmlns="http://www.w3.org/2000/svg">

  <defs>
    <marker id="arrowhead" markerWidth="5" markerHeight="5" 
            refX="2" refY="2" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L5,2.5 L0,5 Z" fill="black" />
    </marker>
  </defs>

  <!-- Panah melengkung ke kanan -->
  <path d="M10,28 C24,22 24,8 10,2"
        stroke="black" fill="none" stroke-width="1.5"
        marker-end="url(#arrowhead)"/>
</svg>

`;

const createArrowToBottom = () => `
  <svg class="swap-arrow" viewBox="0 0 30 30"
     xmlns="http://www.w3.org/2000/svg">

  <defs>
    <marker id="arrowhead" markerWidth="5" markerHeight="5" 
            refX="2" refY="2" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L5,2.5 L0,5 Z" fill="black" />
    </marker>
  </defs>

  <!-- Panah melengkung ke kanan, kepala di bawah -->
  <path class="arrow-path" 
        d="M10,2 C24,8 24,22 10,28"
        stroke="black" fill="none" stroke-width="1.5"
        marker-end="url(#arrowhead)"/>
</svg>

`;

const createClueWrapper = (text) => `
  <div class="tutorial-clue__wrapper">
    <div class="tutorial-clue focused">
      <img src="light-bulb.png">
      <p>${text}</p>
    </div>
  </div>
`;

const createClue = (text) => `
  <div class="tutorial-clue focused">
    <img src="light-bulb.png">
    <p>${text}</p>
  </div>
`;

const createInstruction = (text) => `
  <div class="tutorial-instruction">
    <p>${text}</p>
    <img src="instruction.png">
  </div>
`;

const createGuide = (text) => `
  <div class="tutorial-guide">
    <p>${text}</p>
    <button>Oke, mengerti.</button>
  </div>
`;

const createRightArrow = () => `
  <img class="right-arrow_multiplication" src="right-arrow.png">
`;

const createBtnNextTutorial = () => `
  <button class="btn-next__tutorial">Oke, mengerti</button>
`;

const createIllustrationContainer = () => `
  <div class="illustration-container"></div>
`;

const createGlIllustrationOverlayA = () => `
  <div class="illustration-overlay first gl">
    <div class="item">
      <div class="number-counter">
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </div>
    </div>
    <div class="item">
      <div class="number-counter">
        <span>4</span>
        <span>5</span>
        <span>6</span>
      </div>
    </div>
    <div class="item">
      <div class="number-counter">
        <span>7</span>
        <span>8</span>
        <span>9</span>
      </div>
    </div>
    <div class="item">
      <div class="number-counter">
        <span>10</span>
        <span class="empty"></span>
        <span>11</span>
      </div>
    </div>
  </div>
`;

const createGlIllustrationOverlayB = () => `
  <div class="illustration-overlay first gl">
    <div class="item">
      <div class="number-counter">
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </div>
    </div>
    <div class="item">
      <div class="number-counter">
        <span>4</span>
        <span>5</span>
        <span>6</span>
      </div>
    </div>
    <div class="item">
      <div class="number-counter">
        <span>7</span>
        <span>8</span>
        <span>9</span>
      </div>
    </div>
    <div class="item">
      <div class="number-counter">
        <span>10</span>
        <span class="empty"></span>
        <span class="empty"></span>
      </div>
    </div>
  </div>
`;

const createIllustrationSummary = (text) => `
  <div class="illustration-summary">
    <p>${text}</p>
  </div>
`;

const createDialogTutorialTop = (text) => `
  <div class="dialog-tutorial top">
    <p>${text}</p>
  </div>
`;

const createDialogTutorialBottom = (text) => `
  <div class="dialog-tutorial bottom">
    <p>${text}</p>
  </div>
`;

const createPopupTutorialPassed = () => `
<div class="popup-overlay">
  <div class="popup-tutorial">
    <img class="popup-img" src="plant-tutorial-passed.png">
    <p>Tutorial diselesaikan! Langsung mulai kuisnya?</p>
    <div class="button-popup-wrapper">
      <button id="repeat-tutorial" class="repeat-tutorial">Ulangi Tutorial <i class="fa-solid fa-rotate-right"></i> </br> <span>(Tanpa reward)</span></button>
      <button id="start-quiz" class="start-quiz">Mulai Kuis</button>
    </div>
  </div>
</div>
`;

const createPopupTutorialUnpassed = () => `
  <div class="popup-overlay">
    <div class="popup-tutorial unpassed">
      <img class="popup-img" src="plant-tutorial-unpassed.png">
      <p>Sebelum mulai kuis, ayo ikuti tutorial dulu! </br> <span>Reward: 12<img class="candy" src="candy.png"></span></p>
      <div class="button-popup-wrapper">
        <button id="start-tutorial" class="start-tutorial">Mulai Tutorial</button>
      </div>
    </div>
  </div>
`;

const createPopupAfterTutorialPassed = (isRepeatTutorial) => isRepeatTutorial ? `
  <div class="popup-overlay">
    <div class="popup-tutorial after-passed">
      <img class="popup-img" src="check.png">
      <p>Kamu sudah menyelesaikan tutorial. Langsung mulai kuisnya?</p>
      <div class="button-popup-wrapper">
        <button id="start-quiz" class="start-quiz">Mulai Kuis</button>
      </div>
    </div>
  </div>
` : `
  <div class="popup-overlay">
    <div class="popup-tutorial after-passed">
      <img class="popup-img" src="confetty.png">
      <p>Tutorial diselesaikan! Yay, kamu mendapat <span>12 <img class="candy" src="candy.png"></span></p>
      <div class="button-popup-wrapper">
        <button id="start-quiz" class="start-quiz">Mulai Kuis</button>
      </div>
    </div>
  </div>
`;

const createResultGameGL = () => `
  <div class="result-game result-game__GL">
    <h1>Kuis Selesai!</h1>
    <div class="harvest-container">
      <p class="title">Hasil Panenmu:</p>
      <ul></ul>
    </div>
    <div class="score-container">
      <h2>Skor Kuis</h2>
      <p class="quiz-score">Skor: <span></span></p>
      <p class="high-score">Skor Tertinggi: <span></span></p>
      <p class="total-game-score">Total Skor Saat Ini: <span></span></p>
      <a class="btn-leaderboard" href="#/leaderboard">
        <span>Cek Peringkat</span>
        <img src="podium.png">
      </a>
    </div>
    <div class="overall-value">
      <p>Nilai Keseluruhan: <span></span></p>
      <img src="label.png" class="label">
    </div>
    <div class="action-options">
      <button class="btn-quiz-review">
        Periksa Jawaban 
        <span class="icon"><img src="notes.png"></span>
      </button>
    </div>
  </div>
`;

const createNextLevelButton = () => `
  <div class="next-level">
    <p class="info"></p>
    <button id="btnNextLevel">
      Lanjutkan 
      <span class="icon"><i class="fa-solid fa-arrow-right"></i></span>
    </button>
  </div>
`;

const createTryAgainButton = () => `
  <button id="btnTryAgain" class="btn-try-again">
    Coba Lagi 
    <span class="icon"><i class="fa-solid fa-rotate-right"></i></span>
  </button>
`;

const createFinalStamp = (isPassed) => {
  const srcImg = getvalueLabel(isPassed);
  return `
    <div class="final-stamp" id="finalStamp">
      <img src="${srcImg}" alt="Cap Final" />
    </div>
  `
}

const multiplicationFractionForm = (mainId, currentStep, operator) => {
  const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;
  const stepQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).sub;
  const currentStepIndex = stepQuiz.findIndex(sub => sub.id === currentStep.id);
  const stepDivisionId = stepQuiz[currentStepIndex - 1].id;

  const correctDivision = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === stepDivisionId).answer.split(':');

  const splittedFirstNum = correctDivision[0].split('/');
  const firstNumEl = splittedFirstNum.length > 1 ? `<span class="fraction" id="fraction">
    <span class="numerator">${splittedFirstNum[0]}</span>
    <span class="denominator">${splittedFirstNum[1]}</span>
  </span>
  `: `<span id="first">${splittedFirstNum[0]}</span>`;

  const splittedSecondNum = correctDivision[1].split('/');
  const secondNumEl = splittedSecondNum.length > 1 ? `<span class="fraction" id="fraction">
    <span class="numerator">${splittedSecondNum[0]}</span>
    <span class="denominator">${splittedSecondNum[1]}</span>
  </span>
  `: `<span id="second">${splittedSecondNum[0]}</span>`;
  
  return {
    htmlElement: `
    <div class="calc-result">
      <div class="fraction-question">
        <p class="division-pair">
          ${firstNumEl}
          <span class="operator">:</span>
          ${secondNumEl}
          =
        </p>
        <div class="calc-input">
          <div class="first-number">
            <input id="firstNum" class="initial-focus number-input show first-number" autofocus maxlength="2" autocomplete="off"></input>
          </div>
          <div class="fraction-container first">
            <input class="first-fraction number-input" id="numerator" max-length="2" autocomplete="off">
            <div class="fraction-line"></div>
            <div class="first-fraction__denominator">
              <input class="first-fraction first-fraction__denominator number-input" id="denominator" autocomplete="off">
            </div>
          </div>
          <p class="operator">${operator}</p>
          <div class="second-number">
            <input id="secondNum" class="show number-input second-number" maxlength="2" autocomplete="off">
          </div>
          <div class="fraction-container second">
            <input class="second-fraction number-input" id="numerator" max-length="2" autocomplete="off">
            <div class="fraction-line"></div>
            <div class="second-fraction__denominator">
              <input class="second-fraction number-input show second-fraction__denominator" id="denominator" autocomplete="off">
            </div>
          </div>
        </div>
      </div>
      <div class="number-buttons">
        <button id="deleteNumber"><i class="fa-solid fa-delete-left"></i></button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button class="btn-fraction" id="fractionMode">
          <img src="math.png">
        </button>
        <button>4
        <button>5</button>
        <button>6</button>
        <button>0</button>
        <button>1</button>
        <button>2</button>
        <button>3</button>
      </div>
      <div class="btn-submit-result__container">
        <button class="btn-submit-result btn-next-step" id="btnSubmitResult">Lanjut</button>
      </div>
    </div>`,
    // setup: () => fractionMultiplicationHandler.init()
  }
}

export { createCitySliderTemplate, createGreetingBubble, createButtonBackToLobby, createCategoryCardsContainer, createEmptyCard, createGalleryCard, createRankingRow, createPurchaseConfirmationModal, createSettingsModal, createButtonLevel, createMainQuiz, createSubQuiz, fractionSetQuestion, createResultQuiz, fractionResult, fractionAbilityToSimplify, 
  simplestFractionAnswer,illustrationChoices, createFingerPointer, createPrecisWrapper, createPrecisTutorial,
  createPointerText, createMultiplicationLineTop, createRightArrow, createClueWrapper, createClue, createInstruction, createGuide, glProgressBar, createBtnNextTutorial, createIllustrationContainer, 
  createGlIllustrationOverlayA, createGlIllustrationOverlayB, createIllustrationSummary,
  createDialogTutorialTop,
  createDialogTutorialBottom,
  createPopupTutorialPassed,
  createPopupTutorialUnpassed, createPopupAfterTutorialPassed, createResultGameGL, createFinalStamp, createNextLevelButton, createTryAgainButton, multiplicationFractionForm, createArrowToTop, createArrowToBottom
 };

