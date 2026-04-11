import DBSource from "../../data/db-source";
import Avatars from "../../globals/avatars";
import { findCorrectAnswer } from "../../utils/answerChecker";
import { array, number, string } from "../../utils/common";

import { extractDecimal, formatAnswerContent, getMainIndex, getvalueLabel, isPowerOfTen, parseFraction, renderFractionText } from "../../utils/quiz";
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
        <div class="coming-soon-text">COMING<br>SOON</div>
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
    <p>Halo <span>${username}</span>,  ayo kunjungi berbagai kota menarik dengan bermain game matematika!</p>
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
  <div class="gallery__card" >
    <img class="badge-card" src="gallery-card.png">
    <div class="gallery__card-content button">
      <div class="image-container">
        <svg class="sparkle s1"><use href="#sparkle" /></svg>
        <svg class="sparkle s2"><use href="#sparkle" /></svg>
        <svg class="sparkle s3"><use href="#sparkle" /></svg>
        <svg class="sparkle s4"><use href="#sparkle" /></svg>
        <svg class="sparkle s5"><use href="#sparkle" /></svg>
        <img src="./secret-spots/${spot['picture_url']}" >
      </div>
      <p class="spot-name">${spot['spot_name']}</p>
      <p class="spot-type hidden">${spot['type']}</p>
    </div>
  </div>
  <svg width="0" height="0" style="position:absolute">
  <symbol id="sparkle" viewBox="0 0 96 96">
    <path
      d="M93.781 51.578C95 50.969 96 49.359 96 48c0-1.375-1-2.969-2.219-3.578 0 0-22.868-1.514-31.781-10.422-8.915-8.91-10.438-31.781-10.438-31.781C50.969 1 49.375 0 48 0s-2.969 1-3.594 2.219c0 0-1.5 22.87-10.406 31.781-8.908 8.913-31.781 10.422-31.781 10.422C1 45.031 0 46.625 0 48c0 1.359 1 2.969 2.219 3.578 0 0 22.873 1.51 31.781 10.422 8.906 8.911 10.406 31.781 10.406 31.781C45.031 95 46.625 96 48 96s2.969-1 3.562-2.219c0 0 1.523-22.871 10.438-31.781 8.913-8.908 31.781-10.422 31.781-10.422Z"
    />
  </symbol>
</svg>

`;

const createSurpriseReward = (reward) => {
  let type = reward.type;
  type = type === 'Basic' ? 'Normal' : 'Langka';
  return `
  <div class="reward-overlay hidden">
    <div class="reward-container">
      <h2 class="reward-title">Kamu menemukan spot rahasia!</h2>
      <p class="reward-type">Tipe: ${type}</p>
      <div class="gallery__card" >
        <img class="badge-card" src="gallery-card.png">
        <div class="gallery__card-content">
          <img src="./secret-spots/${reward['picture_url']}" >
          <p class="reward-name spot-name">${reward['spot_name']}</p>
          <p class="spot-type hidden">${reward['type']}</p>
        </div>
      </div>
      <button class="reward-close">Lanjutkan</button>
    </div>
  </div>
`};

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
      <span class="close-button button" id="closeModalBtn">&times;</span>
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
  const colorTheme = JSON.parse(sessionStorage.getItem('colorTheme'));
  const adjustedQuestion = renderFractionText(question);
  return `
    <div class="main-quiz" style="background-color: ${colorTheme.accent_color};">
      <p>${adjustedQuestion}</p>
    </div>  `;
}

const createSubQuiz = (step, question, mainId) => {
  const colorTheme = JSON.parse(sessionStorage.getItem('colorTheme'))
  if (question.includes('|')) {
    const mainIndex = getMainIndex(mainId);
    question = renderFractionText(question.split('|')[mainIndex]);
  }
  return `
    <div class="sub-quiz" style="background-color:${colorTheme.secondary_color}">
      <h2 style="background-color:${colorTheme.primary_color}">Step ${step}</h2>
      <p>${question}</p>
    </div>
  `
};

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
  let baseRewards = [];

  const questionCount = levelData.question_count;
  const stepCount = levelData.step_count;

  if (reward[0].quiz_num !== 0) {
    for (let i = 0; i < questionCount; i++) {
      baseRewards.push(reward.find(item => item.degree === "milestone0" && item.quiz_num === i + 1));
    }
  } else {
    for (let i = 0; i < questionCount; i++) {
      baseRewards.push(reward.find(item => item.degree === "milestone0"));
    }
  }

  const minorProgressItem = `<span class="sub bullet"></span>`;

  let minorProgress = '';

  baseRewards.forEach(baseReward => {
    const rewardLevel = (baseReward.degree.split('milestone'))[1];
    minorProgress += `
      <div class="gl-minor-progress minor-progress">
        ${minorProgressItem.repeat(stepCount)}
        <img class="milestone milestone0 ${baseReward.img_url}" src="./rewards/${baseReward.img_url}.png">
        ${detailReward(baseReward.name, baseReward.img_url, baseReward.information, baseReward.candy_converted, rewardLevel, stepCount)}
      </div>`
  });
  
  const progressBarEl = `
    <div class="gl-progress-bar progress-bar">
      ${minorProgress}
    </div>
  `;

  return progressBarEl;
};

const detailReward = (reward_name, img_url, information, candy_value, degree, maxDegree) => `
  <div class="detail-progress-reward">
    <div class="detail-progress-reward__image">
      <img src="./rewards/${img_url}.png">
      <p class="progress-reward-level">Level ${degree}/${maxDegree}</p>
    </div>
    <div class="detail-progress-reward__text-container">
      <h3 class="detail-progress-title">${reward_name}</h3>
      <p class="detail-progress-reward-value">Nilai tukar: ${candy_value}<img src="candy.png"></p>
      <p class="detail-progress-reward__information">${information}</p>
    </div>
  </div>
`;

const fractionSetQuestion = (mainId, currentStep, operator) => {
  return {
    htmlElement: `<div class="calc-result">
      <div class="calc-input">
        <div class="first-number">
          <input id="firstNum" class="initial-focus number-input first-number show" autofocus maxlength="2" autocomplete="off" onfocus="blur();"></input>
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
        <div class="btn-fraction">
          <button class="btn-fraction" id="fractionMode">
            <img src="math.png">
          </button> 
        </div>
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

const fractionResult = (mainId, currentStep, operator) => {
  const stepQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).sub;
  const currentStepIndex = stepQuiz.findIndex(sub => sub.id === currentStep.id);
  const previousStepId = stepQuiz[currentStepIndex - 1].id;
  
  const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;

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
              <input class="first-fraction initial-focus number-input show first-fraction__numerator" id="numerator" max-length="2" autocomplete="off" onfocus="blur();">
            </div>
            <div class="fraction-line"></div>
            <div class="first-fraction__denominator">
              <input class="first-fraction number-input show first-fraction__denominator" id="denominator" autocomplete="off" onfocus="blur();">
            </div>
          </div>
        </div>
      </div>
      <div class="number-buttons fr-result">
        <button id="deleteNumber"><i class="fa-solid fa-delete-left"></i></button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button class="btn-fraction" id="fractionMode"></button>
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
      <button class="fpb-calc-btn">
        <img src="fpb-calc-icon.png" alt="fpb calc icon">
      </button>
      ${createFPBCalc()}
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
        <div class="option">
          <button class="btn-next-step">
            <span class="alphabet">A.</span>
            <p>${randomAnswer[0]}</p>
            <img class="pot-plant" src="pot-plant.png">
          </button>
        </div>
        <div class="option">
          <button class="btn-next-step">
            <span class="alphabet">B.</span>
            <p>${randomAnswer[1]}</p>
            <img class="pot-plant" src="pot-plant.png">
          </button>
        </div>
        <div class="option">
          <button class="btn-next-step">
            <span class="alphabet">C.</span>
            <p>${randomAnswer[2]}</p>
            <img class="pot-plant" src="pot-plant.png">
          </button>
        </div>
      </div>
      <button class="fpb-calc-btn">
        <img src="fpb-calc-icon.png" alt="fpb calc icon">
      </button>
      ${createFPBCalc()}
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
        <p class="fraction-unit">${currentMain.unit_name}</p>
      </div>
      <div class="answer-choices">
        <div class="option-a">
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
        </div>
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
  <svg class="curved-line arrow" width="40" height="50"> 
    <path d="M 3 15 Q 20 -5, 35 29" stroke="blue" stroke-width="2" fill="none" /> 
  </svg>
`;

const createArrowToTop = () => `
<svg class="arrow-line to-top" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 7" width="20" height="20">
  <defs>
    <marker id="arrowhead-up" viewBox="0 0 4 4" refX="2" refY="2"
            markerWidth="2" markerHeight="2" orient="auto"
            markerUnits="userSpaceOnUse">
      <path d="M0,0 L4,2 L0,4 Z" fill="black"/>
    </marker>
  </defs>

  <!-- Panah lurus ke atas -->
  <line x1="3.5" y1="6" x2="3.5" y2="1"
        stroke="black" stroke-width="0.5"
        marker-end="url(#arrowhead-up)"/>
</svg>

`


const createSwapArrowToTop = () => `
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
const createArrowToBottomRight = () => `
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

const createArrowLineToLeftRight = () => `
    <svg class="arrow-line to-top-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 7" width="20" height="20">
      <defs>
        <marker id="arrowhead" viewBox="0 0 4 4" refX="2" refY="2"
                markerWidth="2" markerHeight="2" orient="auto"
                markerUnits="userSpaceOnUse">
          <path d="M0,0 L4,2 L0,4 Z" fill="black"/>
        </marker>
      </defs>

      <!-- Panah serong ke kiri atas -->
      <line x1="6" y1="6" x2="2" y2="2"
            stroke="black" stroke-width="0.5"
            marker-end="url(#arrowhead)"/>
    </svg>





`;

const createFractionConversionMultiplicationLine = () => `
 <svg class="curved-line arrow fraction-conversion" width="40" height="30"> 
  <text x="1" y="20" font-size="15" fill="black">x</text>
  <path d="M 10 5 Q 15 25, 25 20" stroke="red" stroke-width="2" fill="none" /> 
</svg>
`;

const createFractionConversionAdditionLine = () => `
<svg class="curved-line arrow fraction-conversion addition" width="60" height="50" viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg">
  <!-- start (20,5), end (20,45), control (30,25) -->
  <path d="M 20 5 Q 30 25 20 45" stroke="blue" stroke-width="2" fill="none" />
  <text x="27" y="22" font-size="15" fill="black">+</text>
</svg>

`;

const createCurvedArrowToBottom = () => `
  <svg class="curved-arrow arrow to-bottom" width="30" height="50" viewBox="0 0 30 50"
     xmlns="http://www.w3.org/2000/svg">

  <defs>
    <marker id="arrowhead" markerWidth="5" markerHeight="5" 
            refX="2" refY="2" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L5,2.5 L0,5 Z" fill="black" />
    </marker>
  </defs>
  <text x="25" y="30" font-size="15" fill="black">:</text>

  <!-- Panah melengkung ke kanan, digeser naik 10px -->
  <path class="arrow-path" 
        d="M10,12 C24,18 24,32 10,38"
        stroke="black" fill="none" stroke-width="1.5"
        marker-end="url(#arrowhead)"/>
</svg>

`;

const createDoubleCurvedLine = () => `
  <svg class="double-curved" xmlns="http://www.w3.org/2000/svg" width="6px" height="3px" viewBox="-1 -1 6 3">
  <path d="M0 0 C0.67 1 1.33 1 2 0 C2.67 1 3.33 1 4 0"
        fill="none"
        stroke="black"
        stroke-width="0.5"/>
</svg>
`;

const createClueWrapper = (text) => `
  <div class="tutorial-clue__wrapper">
    <div class="tutorial-clue focused">
      <img src="light-bulb.png">
      <p>${text}</p>
      <ul class="clue-list"></ul>
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

const createPopupTutorialUnavailable = () => `
  <div class="popup-overlay">
    <div class="popup-tutorial unavailable">
      <img class="popup-img" src="tutorial-unavailable.png">
      <p>Tutorial belum tersedia. Langsung mulai kuis?</p>
      <div class="button-popup-wrapper">
        <button id="start-quiz" class="start-quiz">Mulai Kuis</button>
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
      <p class="title"></p>
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

const detailScoreTemplates = [
  {
    cityId: 'city01',
    level: 1,
    title: 'Hasil Panenmu:',
    htmlString: (data) => `<span class="plant-wrap"><img src="${data.plant}" class="plant"> <span class="item-count">x ${data.count}</span></span>
        <span class="arrow">→</span>
        <span class="candy-converted"></span>`
  },
  {
    cityId: 'city01',
    level: 2,
    title: 'Hasil Panenmu:',
    htmlString: (data) => `<span class="plant-wrap"><img src="${data.plant}" class="plant"> <span class="item-count">x ${data.count}</span></span>
        <span class="arrow">→</span>
        <span class="candy-converted"></span>`
  },
  {
    cityId: 'city01',
    level: 3,
    title: 'Hasil Panenmu:',
    htmlString: (data) => `<span class="plant-wrap"><img src="${data.plant}" class="plant"> <span class="item-count">x ${data.count}</span></span>
        <span class="arrow">→</span>
        <span class="candy-converted"></span>`
  },
  {
    cityId: 'city01',
    level: 4,
    title: 'Peralatan Panenmu:',
    htmlString: (data) => `<span class="plant-wrap"><img src="${data.plant}" class="plant"> <span class="item-count">Lv. ${data.level}</span></span>
        <span class="arrow">→</span>
        <span class="candy-converted"></span>`
  },
  {
    cityId: 'city01',
    level: 5,
    title: 'Koleksi kebunmu:',
    htmlString: (data) => `<span class="plant-wrap"><img src="${data.plant}" class="plant"> <span class="item-count">x ${data.count}</span></span>
        <span class="arrow">→</span>
        <span class="candy-converted"></span>`
  },
  {
    cityId: 'city02',
    level: 1,
    title: 'Hasil Tangkapanmu:',
    htmlString: (data) => `<span class="plant-wrap"><img src="${data.plant}" class="plant"> <span class="item-count">x ${data.count}</span></span>
        <span class="arrow">→</span>
        <span class="candy-converted"></span>`
  },
]

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
            <input id="firstNum" class="initial-focus number-input show first-number" autofocus maxlength="2" autocomplete="off" onfocus="blur();"></input>
          </div>
          <div class="fraction-container first">
            <input class="first-fraction number-input" id="numerator" max-length="2" autocomplete="off" onfocus="blur();">
            <div class="fraction-line"></div>
            <div class="first-fraction__denominator">
              <input class="first-fraction first-fraction__denominator number-input" id="denominator" autocomplete="off" onfocus="blur();">
            </div>
          </div>
          <p class="operator">${operator}</p>
          <div class="second-number">
            <input id="secondNum" class="show number-input second-number" maxlength="2" autocomplete="off" onfocus="blur();">
          </div>
          <div class="fraction-container second">
            <input class="second-fraction number-input" id="numerator" max-length="2" autocomplete="off" onfocus="blur();">
            <div class="fraction-line"></div>
            <div class="second-fraction__denominator">
              <input class="second-fraction number-input second-fraction__denominator" id="denominator" autocomplete="off" onfocus="blur();">
            </div>
          </div>
        </div>
      </div>
      <div class="number-buttons">
        <button id="deleteNumber"><i class="fa-solid fa-delete-left"></i></button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <div class="btn-fraction">
          <button class="btn-fraction" id="fractionMode">
            <img src="math.png">
          </button>
        </div>
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

const mixedFractionConvertion = (mainId) => {
  const subQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).sub;
  const stepIndex = sessionStorage.getItem('stepIndex');
  const subArr = subQuiz[stepIndex].question.split('|');

  const mainIndex = getMainIndex(mainId);
  let question = subArr[mainIndex];
  const { integer, numerator, denominator } = (parseFraction(question))[0];
  return {
    htmlElement: `
    <div class="calc-result no-calc">
      <div class="calc-input">
        <div class="fraction-question">
          <span class="fraction-wrapper mixed">
            <span class="integer">${integer}</span>
            <span id="fraction">
              <span class="numerator">${numerator}</span>
              <span class="denominator">${denominator}</span>
            </span>
          </span>
          =
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
      <div class="btn-submit-result__container">
        <button class="btn-submit-result btn-next-step" id="btnSubmitResult">Lanjut</button>
      </div>
    </div>
  `
  }
}

const fractionToMixedConvertion = (mainId) => {
  const subQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).sub;
  const stepIndex = sessionStorage.getItem('stepIndex');
  const subArr = subQuiz[stepIndex].question.split('|');

  const mainIndex = getMainIndex(mainId);
  let question = subArr[mainIndex];
  const { numerator, denominator } = (parseFraction(question))[0];
  return {
    htmlElement: `
    <div class="calc-result no-calc">
      <div class="calc-input">
        <div class="fraction-question">
          <span class="fraction-wrapper">
            <span id="fraction">
              <span class="numerator">${numerator}</span>
              <span class="denominator">${denominator}</span>
            </span>
          </span>
          =
          <div class="integer">
            <input id="integer" class="integer" autocomplete="off">
          </div>
          <div class="fraction-container mixed">
          
            
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
      <div class="btn-submit-result__container">
        <button class="btn-submit-result btn-next-step" id="btnSubmitResult">Lanjut</button>
      </div>
    </div>
    `
  }

  
}

const decimalToFractionConvertion = (mainId) => {
  const subQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).sub;
  const stepIndex = sessionStorage.getItem('stepIndex');
  const subArr = subQuiz[stepIndex].question.split('|');

  const mainIndex = getMainIndex(mainId);
  let question = subArr[mainIndex];
  const decimal = extractDecimal(question);

  return {
    htmlElement: `
    <div class="calc-result no-calc">
      <div class="calc-input">
        <div class="fraction-question">
          <p class="decimal">${decimal}</p>
          =
          <div class="fraction-container">
            <div class="first-fraction__numerator">
              <input class="first-fraction initial-focus number-input show first-fraction__numerator" max-length="2" autocomplete="off">
            </div>
            <div class="fraction-line"></div>
            <div class="first-fraction__denominator">
              <input class="first-fraction number-input show first-fraction__denominator"  autocomplete="off">
            </div>
          </div>
          <div class="btn-add-result">
            <button class="btn-add-result" id="btnAddResult">+</button>
          </div>
        </div>
      </div>
      <div class="btn-submit-result__container">
        <button class="btn-submit-result btn-next-step" id="btnSubmitResult">Lanjut</button>
      </div>
    </div>
  `
  }
}

const fractionToDecimalConvertion = (mainId) => {
  const subQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).sub;
  const stepIndex = sessionStorage.getItem('stepIndex');
  const subArr = subQuiz[stepIndex].question.split('|');

  const mainIndex = getMainIndex(mainId);
  let question = subArr[mainIndex];
  const { numerator, denominator } = (parseFraction(question))[0];
  const resultString = isPowerOfTen(denominator) ? `<div class="decimal-kit">
      <div class="switch-input-mode">
        <button class="switch-input-mode"><i class="fa-solid fa-repeat"></i></button>
      </div>
      <input class="decimal number-input show" id="decimal" autocomplete="off">
      <div class="decimal-helper">
        <button class="retreat-btn">
          <img src="green-left-arrow.png">
        </button>
        <button class="advance-btn">
          <img src="green-right-arrow.png">
        </button>
      </div>
    </div>` : `
    <div class="fraction-container multiplication">
      <div class="first-fraction__numerator">
        <span>${numerator}</span>
        x
        <div class="first-fraction__numerator number-input">
          <input class="first-fraction initial-focus number-input show first-fraction__numerator" id="numerator" max-length="2" autocomplete="off">
        </div>
      </div>
      <div class="fraction-line"></div>
      <div class="first-fraction__denominator">
        <span>${denominator}</span>
        x
        <div class="first-fraction__denominator number-input">
          <input class="first-fraction number-input show first-fraction__denominator" id="denominator" autocomplete="off">
        </div>
      </div>
    </div> 
  `;

  return {
    htmlElement: `
    <div class="calc-result no-calc">
      <div class="calc-input">
        <div class="fraction-question">
          <span class="fraction-wrapper">
            <span id="fraction">
              <span class="numerator">${numerator}</span>
              <span class="denominator">${denominator}</span>
            </span>
          </span>
          =
          ${resultString}
          <div class="btn-add-result">
            <button class="btn-add-result" id="btnAddResult">+</button>
          </div>
        </div>
      </div>
      <div class="btn-submit-result__container">
        <button class="btn-submit-result btn-next-step" id="btnSubmitResult">Lanjut</button>
      </div>
    </div>
    `
  }
}

const optionalFractionalResult = () => `
  <div class="optional-frac-result removable">
   <button class="remove-btn">x</button>
    <div class="decimal-kit">
      <div class="switch-input-mode">
        <button class="switch-input-mode"><i class="fa-solid fa-repeat"></i></button>
      </div>
      <div class="decimal">
        <input class="decimal number-input show" autocomplete="off">
      </div>
      <div class="decimal-helper">
        <div class="retreat-btn">
          <button class="retreat-btn">
            <img src="green-left-arrow.png">
          </button>
        </div>
        <button class="advance-btn">
          <img src="green-right-arrow.png">
        </button>
      </div>
    </div>
  </div>
`;

const createFractionInput = () => `
  <div class="fraction-container">
    <div class="switch-input-mode">
      <button class="switch-input-mode"><i class="fa-solid fa-repeat"></i></button>
    </div>
    <div class="first-fraction__numerator">
      <input class="first-fraction initial-focus number-input show first-fraction__numerator" id="numerator" max-length="2" autocomplete="off">
    </div>
    <div class="fraction-line"></div>
    <div class="first-fraction__denominator">
      <input class="first-fraction number-input show first-fraction__denominator" id="denominator" autocomplete="off">
    </div>
  </div>
`;

const createDecimalInput = () => `
  <div class="decimal-kit">
    <div class="switch-input-mode">
      <button class="switch-input-mode"><i class="fa-solid fa-repeat"></i></button>
    </div>
    <input class="decimal number-input show" id="decimal" autocomplete="off">
    <div class="decimal-helper">
      <button class="retreat-btn">
        <img src="green-left-arrow.png">
      </button>
      <button class="advance-btn">
        <img src="green-right-arrow.png">
      </button>
    </div>
  </div>
`;

const createHelpText = (text) => `
  <div class="help-text">
    <p>${text}</p>
  </div>
`;

const decimalComparison = (mainId, currentStep) => {
  const mainQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).main;

  const currentMain = mainQuiz.find(main => main.id === mainId);

  const itemName = currentMain.unit_name.split('|');

  const stepId = currentStep.id;

  let correctAnswer = findCorrectAnswer(mainId, stepId);

  const itemValue = correctAnswer.split(/[<>=]/);

  return {
    htmlElement: `
    <div class="comparison-container">
      <div class="comparison-choice first-choice">
        <img class="pot" src="pot.png">
        <img class="plant" src="flower-pot.png">
        <div class="comparison-content">
          <p class="item-name">${itemName[0]}</p>
          <p class="item-value">${itemValue[0].trim()}</p>
        </div>
      </div>
      <div class="comparison-operator">
        <p>Operator</p>
        <input class="number-input show" id="comparisonOperator" value="" readonly>
        <button class="btn-switch-operator-comparison"><i class="fa-solid fa-repeat"></i></button>
      </div>
      <div class="comparison-choice second-choice">
        <img class="pot" src="pot.png">
        <img class="plant" src="flower-pot.png">
        <div class="comparison-content">
          <p class="item-name">${itemName[1]}</p>
          <p class="item-value">${itemValue[1].trim()}</p>
        </div>
      </div>
      
      
    </div>
    <div class="btn-submit-result__container">
      <button class="btn-submit-result btn-next-step" id="btnSubmitResult">Oke</button>
    </div>
    `
  }
};

const fractionComparison = (mainId) => {
  const mainQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).main;
  const currentMain = mainQuiz.find(main => main.id === mainId);
  const firstFraction = parseFraction(currentMain.question)[0];
  const secondFraction = parseFraction(currentMain.question)[1];

  const optionalElement = firstFraction.denominator !== secondFraction.denominator ? `
    <div class="double-down-arrow"> 
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32" aria-hidden="true">      
        <line x1="32" y1="6" x2="32" y2="50" stroke="#adb5bd" stroke-width="3" stroke-linecap="round" />
        <polyline points="18,36 32,52 46,36" fill="none" stroke="#adb5bd" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32" aria-hidden="true">
        <line x1="32" y1="6" x2="32" y2="50" stroke="#adb5bd" stroke-width="3" stroke-linecap="round" />
        <polyline points="18,36 32,52 46,36" fill="none" stroke="#adb5bd" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <div class="comparison-container fraction">
      <div class="comparison-choice first-choice">
        <div class="fraction-container">
          <div class="first-fraction__numerator">
            <input class="first-fraction initial-focus number-input show first-fraction__numerator" id="firstNumerator" max-length="2" autocomplete="off">
          </div>
          <div class="fraction-line"></div>
          <div class="first-fraction__denominator">
            <input class="first-fraction number-input show first-fraction__denominator" id="firstDenominator" autocomplete="off">
          </div>
        </div>
      </div>
      <div class="comparison-choice second-choice">
        <div class="fraction-container">
          <div class="first-fraction__numerator">
            <input class="first-fraction initial-focus number-input show first-fraction__numerator" id="secondNumerator" max-length="2" autocomplete="off">
          </div>
          <div class="fraction-line"></div>
          <div class="first-fraction__denominator">
            <input class="first-fraction number-input show first-fraction__denominator" id="secondDenominator" autocomplete="off">
          </div>
        </div>
      </div>
    </div>
  ` : ``;

  return {
    htmlElement: `
      <div class="comparison-container">
        <div class="fraction-option">
          <span id="fraction">
            <span class="numerator">${firstFraction.numerator}</span>
            <span class="denominator">${firstFraction.denominator}</span>
          </span>
        </div>
        <div class="comparison-operator">
          <p>Operator</p>
          <input class="number-input show" id="comparisonOperator" value="" readonly>
          <button class="btn-switch-operator-comparison"><i class="fa-solid fa-repeat"></i></button>
        </div>
        <div class="fraction-option">
          <span id="fraction">
            <span class="numerator">${secondFraction.numerator}</span>
            <span class="denominator">${secondFraction.denominator}</span>
          </span>
        </div>
      </div>
      ${optionalElement}
      <div class="btn-submit-result__container">
        <button class="btn-submit-result btn-next-step" id="btnSubmitResult">Oke</button>
      </div>
    `
  }
}

const fractionTypeEquationChecker = () => {
  return {
    htmlElement: `
      <div class="choices">
        <button class="already btn-leaf btn-next-step">
          <img class="leaf" src="leaf.png">
          <p>Sudah</p>
        </button>
        <button class="not-yet btn-leaf btn-next-step">
          <img class="leaf" src="leaf.png">
          <p>Belum</p>
        </button>
      </div>
    `
  }
}

const fractionTypeOption = () => {
  return {
    htmlElement: `
      <div class="choices">
        <button class="choice flower btn-next-step">
          <p>Desimal</p>
          <img class="sakura" src="sakura.png">
        </button>
        <button class="choice flower btn-next-step">
          <p>Pecahan biasa</p>
          <img class="sakura" src="sakura.png">
        </button>
      </div>
    `
  }
}

const fractionTypeEqualization = (mainId) => {
  const typeChosen = sessionStorage.getItem('typeChosen');

  const mainQuiz = JSON.parse(sessionStorage.getItem('detailQuiz')).main;
  const currentMain = mainQuiz.find(main => main.id === mainId);

  let fractionSeries = currentMain.question.match(/\[FRAC:[^\]]+\]|\d+(?:\.\d+)?/g);

  let activeAdded = false;
  let activeType = "";
  // let activeValue = "";
  let valuesToConvert = [];

  const listItems = fractionSeries.map(item => {
    const match = item.match(/\[FRAC:(.+?)\]/);
    let liClass = "number-box";
    let content = "";

    if (match) {
      // item pecahan
      liClass + " fraction";
      content = renderFractionText(item);

      if (typeChosen === "Desimal") {
        valuesToConvert.push(item);
        if (!activeAdded) {
          liClass += " active";
          activeType = "fraction";
          activeAdded = true;
        }
      }
    } else {
      // item desimal
      liClass += " decimal";
      const formatted = item.replace('.', ',');
      content = formatted;

      if (typeChosen === "Pecahan biasa") {
        valuesToConvert.push(item);
        if (!activeAdded) {
          liClass += " active";
          activeType = "decimal";
          activeAdded = true;
        }
      }
    }

    return `<li class="${liClass}"><img class="floral" src="floral.png">${content}</li>`;
  });

  let conversionTemplate = "";
  const fpbPack = typeChosen !== 'Desimal' ? `<button class="fpb-calc-btn">
    <img src="fpb-calc-icon.png" alt="fpb calc icon">
  </button>  
  ${createFPBCalc()}` 
    : '';

  valuesToConvert.forEach(val => {
  
    if (activeType === "decimal") {
      conversionTemplate += `
          <div class="calc-input slide">
            <div class="fraction-question">
              <p class="decimal">${val}</p>
              =
              <div class="fraction-container">
                <div class="first-fraction__numerator">
                  <input class="first-fraction initial-focus number-input show first-fraction__numerator" max-length="2" autocomplete="off">
                </div>
                <div class="fraction-line"></div>
                <div class="first-fraction__denominator">
                  <input class="first-fraction number-input show first-fraction__denominator"  autocomplete="off">
                </div>
              </div>
              <div class="btn-add-result">
                <button class="btn-add-result" id="btnAddResult">+</button>
              </div>
            </div>
          </div>
      `;
    } else if (activeType === "fraction") {
      const { numerator, denominator } = (parseFraction(val))[0];
      const resultString = `
        <span class="fraction-wrapper">
          <span id="fraction">
            <span class="numerator">${numerator}</span>
            <span class="denominator">${denominator}</span>
          </span>
        </span>
        =${isPowerOfTen(denominator) ? `<div class="decimal-kit">
        <div class="switch-input-mode">
          <button class="switch-input-mode"><i class="fa-solid fa-repeat"></i></button>
        </div>
        <input class="decimal number-input show" id="decimal" autocomplete="off">
        <div class="decimal-helper">
          <button class="retreat-btn">
            <img src="green-left-arrow.png">
          </button>
          <button class="advance-btn">
            <img src="green-right-arrow.png">
          </button>
        </div>
      </div>` : `
      <div class="fraction-container multiplication">
        <div class="first-fraction__numerator">
          <span>${numerator}</span>
          x
          <div class="first-fraction__numerator number-input">
            <input class="first-fraction initial-focus number-input show first-fraction__numerator" id="numerator" max-length="2" autocomplete="off">
          </div>
        </div>
        <div class="fraction-line"></div>
        <div class="first-fraction__denominator">
          <span>${denominator}</span>
          x
          <div class="first-fraction__denominator number-input">
            <input class="first-fraction number-input show first-fraction__denominator" id="denominator" autocomplete="off">
          </div>
        </div>
      </div> 
    `}`;

    conversionTemplate += `
      <div class="calc-input slide">
        <div class="fraction-question">
          
          ${resultString}
          <div class="btn-add-result">
            <button class="btn-add-result" id="btnAddResult">+</button>
          </div>
        </div>
      </div>
      `;
    }
  });

  return {
    htmlElement: `
      <ul class="fraction-series">
        ${listItems.join('')}
      </ul>
      <hr class="divider">
      <div class="slider answer-input">
        <button class="arrow left">&#10094;</button>
        <div class="slides">
          ${conversionTemplate}
        </div>
        <button class="arrow right">&#10095;</button>
      </div>
      <hr class="divider">
      <div class="btn-submit-result__container">
        <button class="btn-submit-result btn-next-step" id="btnSubmitResult">Oke</button>
      </div>
      ${fpbPack}
    `
  }
}

const orderOfFraction = (mainId, currentStep) => {
  const typeChosen = sessionStorage.getItem('typeChosen');

  const mainQuiz = JSON.parse(sessionStorage.getItem('detailQuiz')).main;
  const currentMain = mainQuiz.find(main => main.id === mainId);

  let fractionSeries = currentMain.question.match(/\[FRAC:[^\]]+\]|\d+(?:\.\d+)?/g);

  let boxesHTML = '';

  const realNumbers = fractionSeries.map(item => {
    const match = item.match(/\[FRAC:(.+?)\]/);

    if (match) {
      return renderFractionText(item);
    } else {
      return item.replace('.', ',');
    }
  });

  let convertedNumbers = [];

  const stepQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).sub;
  const currentStepIndex = stepQuiz.findIndex(sub => sub.id === currentStep.id);
  const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;

  if (typeChosen === 'Desimal') {
    
    const conversionStepId = stepQuiz[currentStepIndex - 2].id;

    const correctAnswer = (options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id == conversionStepId)).answer.split('|');
    convertedNumbers = correctAnswer[0].split('&').map(answer => {
      const splittedAnswer = answer.split('=');
      return splittedAnswer[splittedAnswer.length - 1];
    });
  } else {
    const conversionStepId = stepQuiz[currentStepIndex - 1].id;
    const correctAnswer = (options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id == conversionStepId)).answer.split('/');
    let numerators = correctAnswer[0].split(',');
    const denominator = correctAnswer[1];
    convertedNumbers = numerators.map(num => `[FRAC:${num}/${denominator}]`);
  }

  let unrealNumbers = [];
  if (typeChosen === 'Desimal') {
    unrealNumbers = fractionSeries.map(item => {

      const match = item.match(/\[FRAC:(.+?)\]/);
      
      // if (typeChosen === 'Desimal') {
      if (match) {
        return convertedNumbers.shift();
      } else {
        return item.replace('.', ',');
      }
      // }  
    });
  } else {
    unrealNumbers = convertedNumbers.map(item => {
      const parsed = parseFraction(item);
      return `
        <span id="fraction">
          <span class="numerator">${parsed[0].numerator}</span>
          <span class="denominator">${parsed[0].denominator}</span>
        </span>
      `
    });
  }
  

  for (let i = 0; i < realNumbers.length; i++) {
    boxesHTML += `
      <div class="box" draggable="true" id="box${i + 1}">
        <p class="real-number">${realNumbers[i]}</p>
        <p class="unreal-number">${unrealNumbers[i]}</p>
        <img class="flower" src="flower-3.png">
        <img class="pot" src="pot-2.png">
      </div>
    `;
  }

 return {
  htmlElement: `
    <div class="kontainer">
      ${boxesHTML}
    </div>

    <div class="btn-submit-result__container">
      <button class="btn-submit-result btn-next-step active" id="btnSubmitResult">Kirim</button>
    </div>
  `
 }
}

const denominatorEqualization = (mainId, currentStep) => {
  const mainQuiz = JSON.parse(sessionStorage.getItem('detailQuiz')).main;
  const currentMain = mainQuiz.find(main => main.id === mainId);

  let fractionSeries = currentMain.question.match(/\[FRAC:[^\]]+\]|\d+(?:\.\d+)?/g);

  const stepQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).sub;
  const currentStepIndex = stepQuiz.findIndex(sub => sub.id === currentStep.id);
  const previousStepId = stepQuiz[currentStepIndex - 1].id;

  const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;

  const correctAnswer = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id == previousStepId).answer.split('|');
  let restFractions = correctAnswer[1];
  restFractions = restFractions.split('&').map(item => {
    const splittedAnswer = item.split("=");
    return splittedAnswer[splittedAnswer.length - 1];
  });

  let repIndex = 0;

  let result = fractionSeries.map(item => {
    if (item.includes("FRAC")) {
      return item; // biarkan tetap
    } else {
      return `[FRAC:${restFractions[repIndex++]}]`; // ambil dari array B sesuai urutan
    }
  });

  const packs = result.map(item => {
    const parsed = parseFraction(item);
    return `
      <div class="equalization-pack">
        <div class="initial-fraction">
          <span id="fraction">
            <span class="numerator">${parsed[0].numerator}</span>
            <span class="denominator">${parsed[0].denominator}</span>
          </span>
        </div>
        <div class="calc-input">
          <div class="fraction-container changed show">
            <div class="first-fraction__numerator">
              <input class="first-fraction initial-focus number-input show first-fraction__numerator" max-length="2" autocomplete="off">
            </div>
            <div class="fraction-line"></div>
            <div class="first-fraction__denominator">
              <input class="first-fraction number-input show first-fraction__denominator"  autocomplete="off">
            </div>
          </div>
        </div>
        <div class="flower-stalk">
          <img src="flower-stalk.png">
        </div>
      </div>
    `
  })

  return {
    htmlElement: `
      <div class="numerator-equalization__wrapper">
        ${packs.join("")}
      </div>
      <div class="btn-submit-result__container">
        <button class="btn-submit-result btn-next-step" id="btnSubmitResult">Kirim</button>
      </div>
    `
  }
}

const createAnswerReview = (reviewData) => {
  const colorTheme = JSON.parse(sessionStorage.getItem('colorTheme'));

  const sideBarItems = reviewData.map((item, index) => 
    `
      <button class="review-item ${index === 0 ? 'selected' : ''}" data-index="${index}">Kuis ${item.mainNum}</button>
    `
  ).join('');

  return `
    <div class="review-modal">
      <button class="btn-close">
        <i class="fa fa-times" aria-hidden="true"></i>
      </button>
      <h3>Review Jawaban</h3>
      <div class="review-container">
        <div class="review-sidebar">
          ${sideBarItems}
        </div>
        <div class="review-content">
          <div class="main-quiz" style="background-color:${colorTheme.accent_color}"></div>
          <ul class="review-steps"></ul>
        </div>
      </div>
    </div>

  `
}

const renderReviewContent = (data) => {
  const mainQuiz = document.querySelector('.main-quiz');
  const stepsEl = document.querySelector('.review-steps');
  const mainQuestion = renderFractionText(data.question);
  
  const mainIndex = data.mainIndex;
  
  // render soal utama
  mainQuiz.innerHTML = `<p>${mainQuestion}</p>`;

  // render steps
  stepsEl.innerHTML = data.answerDetail.map((step, index) => {
    let stepQuestion = renderFractionText(step.stepQuestion);
    if (stepQuestion.includes('|')) {
      if (/\d/.test(stepQuestion)) {
        stepQuestion = stepQuestion.split('|')[mainIndex];
      } else {
        const typeChosen = data.answerDetail[index - 1].userAnswer;
        stepQuestion = typeChosen === 'Desimal' ? stepQuestion.split('|')[0] : stepQuestion.split('|')[1];
      }
    }

    return `
    <li>
      <span class="step-num">${step.stepNum}</span>
      <div class="content">
        <p class="step-quiz">${stepQuestion}</p>

        <div class="answer answer--user ${step.isCorrect == 1 ? 'correct' : 'wrong'}">
          <p class="answer__title">Jawabanmu</p>
          <p class="answer__value">${formatAnswerContent(step.userAnswer)}</p>
        </div>

        <div class="answer answer--correct">
          <p class="answer__title">Jawaban benar</p>
          <p class="answer__value">${formatAnswerContent(step.correction)}</p>
        </div>
      </div>
    </li>
  `}).join('');
}

const actualValueRatio = (mainId) => {
  const colorTheme = JSON.parse(sessionStorage.getItem('colorTheme'));
  const mainQuiz = JSON.parse(sessionStorage.getItem('detailQuiz')).main;
  const currentMain = mainQuiz.find(m => m.id == mainId);
  const unitNames = currentMain.unit_name.split('|');
  const ratioItems = unitNames.map(u => {
    return `
    <div class="unit-ratio">
      <p class="ratio-name" style="background-color: ${colorTheme.primary_lighter}">${string.capitalizeWords(u)}</p>
      <input class="ratio-value number-input show" style="border: 1px solid ${colorTheme.primary_lighter}">
    </div>
    `;
  }).join('<span class="ratio-symbol">:</span>');
  return {
    htmlElement: `
      <div class="center-container">
        <div class="ratio-form">
          ${ratioItems}
        </div>

        <div class="btn-submit-result__container">
          <button class="btn-submit-result btn-next-step" id="btnSubmitResult">Submit</button>
        </div>
      </div>
    `
  }
}

const simplifyRatioValue = (mainId, currentStep) => {
  const colorTheme = JSON.parse(sessionStorage.getItem('colorTheme'));
  const mainQuiz = JSON.parse(sessionStorage.getItem('detailQuiz')).main;
  const currentMain = mainQuiz.find(m => m.id == mainId);

  const stepQuiz = (JSON.parse(sessionStorage.getItem('detailQuiz'))).sub;
  const currentStepIndex = stepQuiz.findIndex(sub => sub.id === currentStep.id);
  const previousStepId = stepQuiz[currentStepIndex - 1].id;
  
  const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;

  const correctAnswer = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id == previousStepId).answer.split(':');


  const unitNames = currentMain.unit_name.split('|');
  const ratioItems = unitNames.map((u, index) => {
    return `
    <div class="unit-ratio">
      <p class="ratio-name" style="background-color: ${colorTheme.primary_lighter}">${string.capitalizeWords(u)}</p>
      <div class="actual-ratio-wrapper">
        <span class="actual-ratio-value">${correctAnswer[index]}</span>
        /
        <input class="fpb-input number-input show">
      </div>
      <input class="simplest-ratio-input number-input show" style="border: 1px solid ${colorTheme.primary_lighter}">
    </div>
    `;
  }).join('<span class="ratio-symbol">:</span>');
  return {
    htmlElement: `
      <div class="center-container">
        <div class="ratio-form">
          ${ratioItems}
        </div>

        <div class="btn-submit-result__container">
          <button class="btn-submit-result btn-next-step" id="btnSubmitResult">Submit</button>
        </div>
      </div>
      <button class="fpb-calc-btn">
        <img src="fpb-calc-icon.png" alt="fpb calc icon">
      </button>
      ${createFPBCalc()}
    `
  }
}

const createFPBCalc = () => {
  return `
  <div id="fpbOverlay" class="fpb-overlay">
    <div id="modalFPB" class="modal-fpb">
      <button class="btn-close">&times;</button>
      <div class="modal-content">

        <h3>Kalkulator FPB</h3>

        <!-- Input angka -->
        <div class="input-area">
          <p>Masukkan 2-3 angka yang akan dicari FPB-nya</p>

          <div id="numberInputs">
            <input class="fpb-number" >
            <input class="fpb-number" >
            <button id="addNumber">+</button>
          </div>

          <button id="startCalc">Mulai</button>

        </div>

        <!-- Tabel -->
        <div class="table-container" id="tableContainer" style="display:none">
          <table id="fpbTable"></table>
        </div>

        <!-- Hasil -->
        <div class="bottom-content">
          <button class="reset-calc" id="resetCalc"><i class="fa-solid fa-arrow-rotate-right"></i> Reset</button>
          <div class="hasil-area">
            Hasil: <span id="hasilFpb">-</span><span id="equal">&nbsp;=&nbsp;</span><span id="multiplicationResult"></span>
          </div>
        </div>
        

      </div>
    </div>
  </div>
  `
}

const optionalInputNumber = () => `
  <div class="optional-input-number">
    <button class="remove-btn">x</button>
    <input class="fpb-number">
  </div>
  `;

const createPrimeSpinner = () => {

  const wrapper = document.createElement("div");
  wrapper.className = "prime-spinner";

  // input
  const input = document.createElement("input");
  input.type = "text";
  input.className = "prime-input";
  input.readOnly = true;

  // container tombol
  const buttons = document.createElement("div");
  buttons.className = "spinner-buttons";

  // tombol atas
  const btnUp = document.createElement("button");
  btnUp.className = "prime-up";
  btnUp.textContent = "▲";

  // tombol bawah
  const btnDown = document.createElement("button");
  btnDown.className = "prime-down";
  btnDown.textContent = "▼";

  btnUp.type = "button";
  btnDown.type = "button";

  // susun struktur
  buttons.appendChild(btnUp);
  buttons.appendChild(btnDown);

  wrapper.appendChild(input);
  wrapper.appendChild(buttons);

  // 🔥 expose biar gampang diakses dari luar
  wrapper.input = input;

  // 🔥 default start prime
  // wrapper.startPrime = 1;

  // ===== EVENT =====

  btnUp.addEventListener("click", () => {

    let current = parseInt(input.value);

    // 🔥 klik pertama (masih kosong)
    if (isNaN(current)) {
      input.value = wrapper.startPrime || 2;

    } else {
      // 🔥 klik berikutnya
      const next = number.getNextPrime(current);
      input.value = next;
    }

    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

  btnDown.addEventListener("click", () => {

    let current = parseInt(input.value);

    if (isNaN(current)) return;

    const prev = number.getPrevPrime(current);
    input.value = prev;

    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

  return wrapper;
};


export { createCitySliderTemplate, createGreetingBubble, createButtonBackToLobby, createCategoryCardsContainer, createEmptyCard, createGalleryCard, createRankingRow, createPurchaseConfirmationModal, createSettingsModal, createButtonLevel, createMainQuiz, createSubQuiz, fractionSetQuestion, createResultQuiz, fractionResult, fractionAbilityToSimplify, 
  simplestFractionAnswer,illustrationChoices, createFingerPointer, createPrecisWrapper, createPrecisTutorial,
  createPointerText, createMultiplicationLineTop, createRightArrow, createClueWrapper, createClue, createInstruction, createGuide, glProgressBar, createBtnNextTutorial, createIllustrationContainer, 
  createGlIllustrationOverlayA, createGlIllustrationOverlayB, createIllustrationSummary,
  createDialogTutorialTop,
  createDialogTutorialBottom,
  createPopupTutorialPassed,
  createPopupTutorialUnpassed, createPopupAfterTutorialPassed, createResultGameGL, createFinalStamp, createNextLevelButton, createTryAgainButton, multiplicationFractionForm, createSwapArrowToTop, createArrowToBottom, createSurpriseReward, mixedFractionConvertion, fractionToMixedConvertion, decimalToFractionConvertion,
  fractionToDecimalConvertion,
  optionalFractionalResult, createFractionInput, createDecimalInput, createArrowToBottomRight, createFractionConversionMultiplicationLine, createFractionConversionAdditionLine, createCurvedArrowToBottom, createDoubleCurvedLine, createHelpText, createArrowLineToLeftRight, createArrowToTop, detailReward, createPopupTutorialUnavailable, decimalComparison, fractionComparison, detailScoreTemplates, fractionTypeEquationChecker, fractionTypeOption, fractionTypeEqualization, orderOfFraction, denominatorEqualization, createAnswerReview, renderReviewContent, actualValueRatio, simplifyRatioValue, createFPBCalc, optionalInputNumber, createPrimeSpinner
 };

