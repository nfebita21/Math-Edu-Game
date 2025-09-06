import resultAnimations from "../../animations/result-animations";
import DBSource from "../../data/db-source";
import functionMap from "../../globals/function-map";
import quizOption from "../../globals/quiz-option";
import tutorialData from "../../globals/tutorial-data";
import UrlParser from "../../routes/url-parser";
import generateQuiz from "../../utils/generate-quiz";
import HeaderController from "../../utils/header-controller";
import { showProgressBar } from "../../utils/play-handler";
import { startQuiz } from "../../utils/quiz";
import Tutorial from "../../utils/tutorial";
import { createMainQuiz, createPopupTutorialPassed, createPopupTutorialUnpassed, createResultGameGL, createResultQuiz, createSubQuiz } from "../templates/template-creator";

const Play = {
  async render() {
    return `
      <div class="play">
        <div class="top-section">
          <button id="btnBack">
            <i class="fa-solid fa-arrow-left-long"></i>
          </button>
          <p class="quiz-info">Level <span class="level"></span> - <span class="level-name"></span> </p>
        </div>
        <div class="play-container">
          
          <div class="quiz-title">
            <p></p>
          </div>
          <div class="quiz-content">
          </div>
        </div>
        
        <div id="imageModal">
          <div class="modal-content">
            <img src="./illustrations-quiz/gl-1-1a.png" class="modal-image">
            <button class="close-btn">×</button>
          </div>
        </div>
        <div id="feedback-char" class="character hidden">
          <div class="background-box"></div>
          <img src="./char-feedback/boy-char-1.png">
          <p></p>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const header = document.getElementById('app-bar');
    HeaderController.hideHeader(header);
    const content = document.querySelector('#content');
    const playSection = document.querySelector('.play');
    const btnBack = document.querySelector('.play #btnBack');
    const levelQuiz = document.querySelector('.quiz-info .level');
    const levelName = document.querySelector('.quiz-info .level-name');

    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const cityName = url.cityName;
    const level = url.level;
    const backgroundURL = `url(./wallpapers/${cityName.replace('%20', '-')}/${Number(level) + 1}.png)`;
    playSection.style.backgroundImage = backgroundURL;
    content.style.padding = 0;

    btnBack.addEventListener('click', () => {
      window.location.href = `#/game/${cityName}`;
    });

    levelQuiz.innerText = level;

    const getCity = await DBSource.getCityByName(cityName);
    const city = getCity.data[0];
    sessionStorage.setItem('cityId', city.id);

    const getLevel = await DBSource.level(city.id, level);
    console.log(getLevel);
    levelName.innerText = getLevel['level_name'];

    const getModul = await DBSource.getModul(city.id);
    const modul = getModul.data[0];

    const detailQuiz = await generateQuiz(modul.id, level);
    console.log(detailQuiz)
    sessionStorage.setItem('detailQuiz', JSON.stringify(detailQuiz));

    const userData = JSON.parse(localStorage.getItem('user'));
    const studentId = userData.id;
    const findStudentQuizProgress = await DBSource.getStudentQuizProgress(studentId, modul.id, level);

    const labelQuiz = document.querySelector('.quiz-title');

    sessionStorage.setItem('quizCounter', 0);
    sessionStorage.setItem('wrongAnswer', 0);

    if (findStudentQuizProgress.statusCode === 404) {
      await DBSource.addProgressQuiz(studentId, modul.id, level);
      document.querySelector('.play').insertAdjacentHTML('beforeend', createPopupTutorialUnpassed());
      const popupOverlay = document.querySelector(".popup-overlay")
      const btnStartTutorial= document.querySelector('#start-tutorial');
      btnStartTutorial.addEventListener('click', () => {
        sessionStorage.setItem('isThisWithTutorial', 1);
        popupOverlay.remove();
        labelQuiz.classList.add('show');
        showProgressBar();
        setTimeout(() => this.displayQuiz(detailQuiz, 0), 3000);
      })
    } else {
      const quizProgress = findStudentQuizProgress.result;
      sessionStorage.setItem('quizProgressId', quizProgress.id);
      sessionStorage.setItem("isTutorialPassed", quizProgress["is_tutorial_passed"]);
      if (quizProgress["is_tutorial_passed"]) {
        // document.querySelector('.quiz-content').insertAdjacentHTML('beforeend', createResultGameGL());
        // resultAnimations[0].playAnimations({
        //   harvest: [
        //     { plant: './rewards/mini-tree.png', count: 2, candy: 26 },
        //     { plant: './rewards/health-park.png', count: 3, candy: 37 },
        //   ],
        //   scores: {
        //     score: 223,
        //     highScore: 244,
        //     totalScore: 207774,
        //   },
        //   overall: 'D',
        //   isPassed: false,
        // });
        // return;
        document.querySelector('.play').insertAdjacentHTML('beforeend', createPopupTutorialPassed());
        sessionStorage.setItem('isThisWithTutorial', 0);
        const btnRepeatTutorial = document.querySelector('#repeat-tutorial');
        const popupOverlay = document.querySelector(".popup-overlay")
        btnRepeatTutorial.addEventListener('click', async () => {
          sessionStorage.setItem('isThisWithTutorial', 1);
          popupOverlay.remove();
          labelQuiz.classList.add('show');
          await showProgressBar();
          setTimeout(() => this.displayQuiz(detailQuiz, 0), 3000);
        });
        const btnStartQuiz= document.querySelector('#start-quiz');
        btnStartQuiz.addEventListener('click', async() => {
          await startQuiz();
          
          popupOverlay.remove();
          labelQuiz.classList.add('show');
          await showProgressBar();
          setTimeout(() => this.displayQuiz(detailQuiz, 1), 3000);
        })
      } else {
        document.querySelector('.play').insertAdjacentHTML('beforeend', createPopupTutorialUnpassed());
        const popupOverlay = document.querySelector(".popup-overlay")
        const btnStartTutorial= document.querySelector('#start-tutorial');
        btnStartTutorial.addEventListener('click', async () => {
          sessionStorage.setItem('isThisWithTutorial', 1);
          popupOverlay.remove();
          await showProgressBar();
          setTimeout(() => this.displayQuiz(detailQuiz, 0), 3000);
        });
      }
    }    
  },

  async displayQuiz(detailQuiz, mainIndex, quizIndex = 0) {
    const stepIndex = 0;
    sessionStorage.setItem('mainIndex', mainIndex);
    sessionStorage.setItem('quizIndex', quizIndex);
    sessionStorage.setItem('correctStepPerQuiz', 0);
    sessionStorage.setItem('answerDetail', '[]')
    

    if (mainIndex === 1) {
      sessionStorage.setItem('totalScore', 0);
    }

    const labelQuiz = document.querySelector('.quiz-title');
    const isThisWithTutorial = sessionStorage.getItem('isThisWithTutorial');

    if (mainIndex === 0) {
      labelQuiz.querySelector('p').innerHTML = `Tutorial`;
    } else {
      labelQuiz.querySelector('p').innerHTML = `Kuis ${Number(quizIndex) + (isThisWithTutorial == 1 ? 0 : 1)}`;
    }

    if (!labelQuiz.classList.contains('show')) {
      labelQuiz.classList.add('show');
    } 

    const quizWrapper = document.querySelector('.quiz-content');
    quizWrapper.innerHTML += createMainQuiz(detailQuiz.main[mainIndex].question);
    const currentMainId = detailQuiz.main[mainIndex].id;

    setTimeout(() => {
      this.displayStep(currentMainId, detailQuiz.sub, stepIndex);
    }, 1000); 
  },

  async displayStep(mainId, stepQuiz, stepIndex) {
    const mainIndex = sessionStorage.getItem('mainIndex');
    const quizIndex = sessionStorage.getItem('quizIndex');
    sessionStorage.setItem('stepIndex', stepIndex);

    const progressBar = document.querySelector('.progress-bar');
    const minorProgressBar = progressBar.querySelectorAll('.minor-progress');
    const currentSub = minorProgressBar[quizIndex].querySelector(".sub:not(.wrong)");

    currentSub.classList.add('active'); 

    const quizWrapper = document.querySelector('.quiz-content');

    let currentStep = stepQuiz[stepIndex];
    
    // const currentLevel = Number(sessionStorage.getItem('level'));
    // const modulId = stepQuiz[0].modul_id;
    if (currentStep.is_condition_step) {
      const previousSubQuizId = stepQuiz[stepIndex - 1].id;
      const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;
      const correctAnswer = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === previousSubQuizId && opt.is_correct);
      // const correctAnswer = choicesAnswer.choices.find(opt => opt.isCorrect === true);
      if (correctAnswer.answer === "Tidak") {
        currentStep = stepQuiz[stepIndex + 1]
      }
    } 
    
    const question = currentStep.question;
    const templateName = currentStep['answer_template_name'];
    const answerTemplate = createResultQuiz(functionMap[templateName](mainId, currentStep, currentStep.operator ?? undefined));
    
    const stepNumber = currentStep.step;

    quizWrapper.insertAdjacentHTML('beforeend', createSubQuiz(stepNumber, question, mainId) + answerTemplate.htmlElement);

    const modul = (await DBSource.getModulById(currentStep.modul_id)).data[0];

    const stepId = currentStep.id;

    this.gameHandler(mainId, stepQuiz, stepId);

    if (mainIndex == 0) {
      const tutorial = new Tutorial(tutorialData);
      tutorial.start(modul['city_id'], currentStep.level, stepId);
    }

  },

  gameHandler(mainId, stepQuiz, stepId) {
    const currentStep = stepQuiz.find(step => step.id === stepId);
    const stepHandler = currentStep['function_handler'];
    
    stepHandler.split('|').forEach(handler => {
      functionMap[handler](mainId, stepQuiz, stepId)
    });

  },

  // Untuk mengecek step ke 4 pada level 1
  stepChecker(mainId, step) {
    const detailQuiz = JSON.parse(sessionStorage.getItem('detailQuiz'));
    const {level} = detailQuiz.main[0];
    if (level === 1 && step !== 4) {
      return step;
    }

    const choicesAnswer = quizOption.find(opt => opt.mainQuizId === mainId && opt.subQuizId === step - 1);

    const correctAnswer = choicesAnswer.choices.find(opt => opt.isCorrect === true);

    if (correctAnswer.answer === "Tidak") {
      return step + 1;
    }

    return step;
  }
}

export default Play;