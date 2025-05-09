import Avatars from "../../globals/avatars";
import quizOption from "../../globals/quiz-option";
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
          <li>Exp tertinggimu: <span>${studentExp}</span></li>
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
            <li>Exp tertinggimu: <span>${studentExp}</span></li>
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
      <p>${player['total_exp']}</p>
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
            <img src="./avatar/${gender}/${imgUrl}">
          </div>
          <button id="editAvatar">
            <img src="edit.png">
          </button>
        </li>
        <li class="hidden">
          <div class="choose-avatar">
            <div class="choose-avatar__title-container">Ganti Avatar</div>
            <button class="option">
              <img id="option1" src="./avatar/${gender}/${Avatars[gender][0]}">
            </button>
            <button class="option">
              <img src="./avatar/${gender}/${Avatars[gender][1]}">
            </button>
            <button class="option">
              <img src="./avatar/${gender}/${Avatars[gender][2]}">
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

const createMainQuiz = (question) => `
  <div class="main-quiz">
    <p>${question}</p>
  </div>
`;

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

const glProgressBar = () => `
  <div class="gl-progress-bar progress-bar">
    <div class="gl-minor-progress minor-progress">
      <span class="sub bullet"></span>
      <span class="sub bullet dua"></span>
      <span class="sub bullet"></span>
      <span class="sub bullet"></span>
      <img class="milestone plant" src="./rewards/sprout.png">
    </div>
    <div class="gl-minor-progress minor-progress">
      <span class="sub bullet"></span>
      <span class="sub bullet"></span>
      <span class="sub bullet"></span>
      <span class="sub bullet"></span>
      <img class="milestone plant" src="./rewards/sprout.png">
    </div>
    <div class="gl-minor-progress minor-progress">
      <span class="sub bullet"></span>
      <span class="sub bullet"></span>
      <span class="sub bullet"></span>
      <span class="sub bullet"></span>
      <img class="milestone plant" src="./rewards/sprout.png">
    </div>
    <div class="gl-minor-progress minor-progress">
      <span class="sub bullet"></span>
      <span class="sub bullet"></span>
      <span class="sub bullet"></span>
      <span class="sub bullet"></span>
      <img class="milestone plant" src="./rewards/sprout.png">
    </div>
    <div class="gl-minor-progress minor-progress">
      <span class="sub bullet"></span>
      <span class="sub bullet"></span>
      <span class="sub bullet"></span>
      <span class="sub bullet"></span>
      <img class="milestone plant" src="./rewards/sprout.png">
    </div>
  </div>
  `;

const fractionMultiplication = () => {
  return {
    htmlElement: `<div class="calc-result">
      <div class="calc-input">
        <input id="firstNum" class="initial-focus number-input show" autofocus maxlength="2" autocomplete="off"></input>
        <div class="fraction-container first">
          <input class="first-fraction number-input" id="numerator" max-length="2" autocomplete="off">
          <div class="fraction-line"></div>
          <div class="first-fraction__denominator">
            <input class="first-fraction first-fraction__denominator number-input" id="denominator" autocomplete="off">
          </div>
        </div>
        <p class="operator">x</p>
        <div class="second-number">
          <input id="secondNum" class="show number-input second-number" maxlength="2" autocomplete="off">
        </div>
        <div class="fraction-container second">
          <input class="second-fraction number-input" id="numerator" max-length="2" autocomplete="off">
          <div class="fraction-line"></div>
          <input class="second-fraction number-input" id="denominator" autocomplete="off">
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
      <p id="quiz-answer">../..*..</p>
      <div class="btn-submit-result__container">
        <button class="btn-submit-result btn-next-step" id="btnSubmitResult">Lanjut</button>
      </div>
    </div>`,
    // setup: () => fractionMultiplicationHandler.init()
  }
}

const resultFractionMultiplication = (mainId, currentStep) => {
  const previousStepId = currentStep.id - 1;
  const correctAnswer = quizOption.find(opt => opt.subQuizId == previousStepId).choices[0].answer.split('*');
  
  const firstNum = correctAnswer[0].split('/');
  const secondNum = correctAnswer[1];
  return {
    htmlElement: `<div class="calc-result">
      <div class="calc-input">
        <div class="fraction-question">
          <p class="multiplication-pair">
            <span class="fraction" id="fraction">
              <span class="numerator">${firstNum[0]}</span>
              <span class="denominator">${firstNum[1]}</span>
            </span>
            x
            <span>${secondNum}</span>
            =
          </p>
          <div class="fraction-container">
            <input class="first-fraction initial-focus number-input show" id="numerator" max-length="2" autocomplete="off">
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
  const correctMultiplication = quizOption.find(opt => opt.mainQuizId === mainId && opt.subQuizId === currentStep.id - 2).choices[0].answer.split('*');
  const numerator = correctMultiplication[0].split('/')[0];
  const denominator = correctMultiplication[0].split('/')[1];

  const multiplicationResult = quizOption.find(opt => opt.mainQuizId === mainId & opt.subQuizId === currentStep.id - 1);
  const correctMultiplicationResult = multiplicationResult.choices.find(result => result.isCorrect === true).answer.split('/');
  const resultNumerator = correctMultiplicationResult[0];
  const resultDenominator = correctMultiplicationResult[1];
  
  // butuh main id
  const choicesAnswer = quizOption.filter(opt => opt.mainQuizId === mainId && opt.subQuizId === currentStep.id)[0].choices;
  return {
    htmlElement: `  
      <div class="fraction-question">
        <span class="first fraction" id="fraction">
          <span class="numerator">${numerator}</span>
          <span class="denominator">${denominator}</span>
        </span>
        x
        <span id="second">${correctMultiplication[1]}</span>
        =
        <span class="fraction result" id="fraction">
          <span class="numerator">${resultNumerator}</span>
          <span class="denominator">${resultDenominator}</span>
        </span>
      </div>
      <div class="answer-choices">
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

const illustrationChoices = (mainId, currentStep) => {
  const correctMultiplication = quizOption.find(opt => opt.mainQuizId === mainId && opt.subQuizId === currentStep.id - 4).choices[0].answer.split('*');
  const numerator = correctMultiplication[0].split('/')[0];
  const denominator = correctMultiplication[0].split('/')[1];

  const multiplicationResult = quizOption.find(opt => opt.mainQuizId === mainId && opt.subQuizId === currentStep.id - 3);
  const correctMultiplicationResult = multiplicationResult.choices.find(result => result.isCorrect === true).answer.split('/');
  const resultNumerator = correctMultiplicationResult[0];
  const resultDenominator = correctMultiplicationResult[1];

  const choicesAnswer = quizOption.find(opt => opt.mainQuizId === mainId && opt.subQuizId === currentStep.id).choices;

  return {
    htmlElement: `
      <div class="fraction-question">
        <span class="first fraction" id="fraction">
          <span class="numerator">${numerator}</span>
          <span class="denominator">${denominator}</span>
        </span>
        x
        <span id="second">${correctMultiplication[1]}</span>
        =
        <span class="fraction result" id="fraction">
          <span class="numerator">${resultNumerator}</span>
          <span class="denominator">${resultDenominator}</span>
        </span>
        <p class="item-name">keranjang buah</p>
      </div>
      <div class="answer-choices">
        <button>
          <span class="alphabet">
            A.
            <img class="grass" src="grass.png">
          </span>
          <img class="illustration" src="./illustrations-quiz/${choicesAnswer[0].answer}">
          <span class="open-image-btn">
            <i class="fa-solid fa-magnifying-glass-plus"></i>
          </span>
        </button>
        <button>
          <span class="alphabet">
            B.
            <img class="grass" src="grass.png">
          </span>
          <img class="illustration" src="./illustrations-quiz/${choicesAnswer[1].answer}">
          <span class="open-image-btn">
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


/* <img class="water" src="./rewards/plants/water-drop.png"></img> 
<span class="bullet wrong"></span>
*/
export { createCitySliderTemplate, createGreetingBubble, createButtonBackToLobby, createCategoryCardsContainer, createEmptyCard, createGalleryCard, createRankingRow, createPurchaseConfirmationModal, createSettingsModal, createButtonLevel, createMainQuiz, createSubQuiz, fractionMultiplication, createResultQuiz, resultFractionMultiplication, fractionAbilityToSimplify, illustrationChoices, createFingerPointer, createPrecisWrapper, createPrecisTutorial,
  createPointerText, createMultiplicationLineTop, createRightArrow, createClueWrapper, createClue, createInstruction, createGuide, glProgressBar, createBtnNextTutorial, createIllustrationContainer, 
  createGlIllustrationOverlayA, createIllustrationSummary,
  createDialogTutorialTop,
  createDialogTutorialBottom
 };

