import DBSource from "../../data/db-source";
import functionMap from "../../globals/function-map";
import quizOption from "../../globals/quiz-option";
import tutorialData from "../../globals/tutorial-data";
import UrlParser from "../../routes/url-parser";
import generateQuiz from "../../utils/generate-quiz";
import HeaderController from "../../utils/header-controller";
import { showPointer } from "../../utils/play-handler";
import Tutorial from "../../utils/tutorial";
import { createMainQuiz, createResultQuiz, createSubQuiz, glProgressBar } from "../templates/template-creator";

const Play = {
  async render() {
    return `
      <div class="play">
        <div class="top-section">
          <button id="btnBack">
            <i class="fa-solid fa-arrow-left-long"></i>
          </button>
          <p class="quiz-info"><span class="modul-name"></span> - Level <span class="level">0</span></p>
        </div>
        <div class="play-container">
          
          <div class="quiz-title">
            <p>Tutorial</p>
          </div>
          <div class="quiz-content">
          </div>
        </div>
        <div id="imageModal">
          <div class="modal-content">
            <img src="./illustrations-quiz/gl-1-1a.png" class="modal-image">
            <button id="closeModalBtn" class="close-btn">×</button>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const header = document.getElementById('app-bar');
    HeaderController.hideHeader(header);
    const content = document.querySelector('#content');
    const playSection = document.querySelector('.play');
    const playContainer = playSection.querySelector('.play-container');
    const btnBack = document.querySelector('.play #btnBack');
    const levelQuiz = document.querySelector('.quiz-info .level');
    const modulName = document.querySelector('.quiz-info .modul-name')

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
    const progressBarName = city['progress_bar_name'];
    playContainer.insertAdjacentHTML('afterbegin', functionMap[progressBarName]());

    const getModul = await DBSource.getModul(city.id);
    const modul = await getModul.data[0];
    modulName.innerText = modul['modul_name'];

    const detailQuiz = generateQuiz(modul.id, level);
    
    this.displayQuiz(detailQuiz, 0);
    
  },

  async displayQuiz(detailQuiz, mainIndex) {
    
    const step = 1;
    sessionStorage.setItem('mainIndex', mainIndex);

    const quizWrapper = document.querySelector('.quiz-content');
    quizWrapper.innerHTML += createMainQuiz(detailQuiz.main[mainIndex].question);
    const currentMainId = detailQuiz.main[mainIndex].id;

    await this.displayStep(currentMainId, detailQuiz.sub, step);
  },

  async displayStep(mainId, stepQuiz, step) {
    const mainIndex = sessionStorage.getItem('mainIndex');
    const progressBar = document.querySelector('.progress-bar');
    const minorProgressBar = progressBar.querySelectorAll('.minor-progress');
    const currentSub = minorProgressBar[mainIndex].querySelector(".sub:not(.wrong)");
    currentSub.classList.add('active'); 

    const stepIndex = step;

    const quizWrapper = document.querySelector('.quiz-content');

    step = this.stepChecker(mainId, step);

    const currentStep = stepQuiz.find(quiz => quiz.step === step);

    const question = currentStep.question;
    const templateName = currentStep.answerTemplateName;
    const answerTemplate = createResultQuiz(functionMap[templateName](mainId, currentStep));
    

    if (step === 1) {
      quizWrapper.innerHTML += createSubQuiz(step, question) + answerTemplate.htmlElement;
      
    } else {
      const stepLabel = document.querySelector('.sub-quiz h2')
      const questionWrapper = document.querySelector('.sub-quiz p');
      const resultContainer = document.querySelector('.result');
      stepLabel.innerText = `Step ${stepIndex}`;
      questionWrapper.innerText = question;
      resultContainer.innerHTML = functionMap[templateName](mainId, currentStep).htmlElement;
    }

    const modul = (await DBSource.getModulById(currentStep.modulId)).data[0];


    this.gameHandler(mainId, stepQuiz, step);

    if (mainId === 1) {
      // showPointer(mainId, step, templateName);
      const tutorial = new Tutorial(tutorialData);
      tutorial.start(modul['city_id'], currentStep.level, step);
      console.log('start tutorial step');
    }

  },

  gameHandler(mainId, stepQuiz, step) {
    const currentStep = stepQuiz.find(quiz => quiz.step === step);
    const stepHandler = currentStep.functionHandler;
    const templateName = currentStep.answerTemplateName;

    stepHandler.forEach(handler => {
      functionMap[handler](mainId, stepQuiz, step)
    });

    

  },

  // Untuk mengecek step ke 4
  stepChecker(mainId, step) {
    if (mainId === 1 && step !== 4) {
      return step;
    }

    const choicesAnswer = quizOption.find(opt => opt.mainQuizId === mainId && opt.subQuizId === step - 1);

    const correctAnswer = choicesAnswer.choices.find(opt => opt.isCorrect === true);

    if (correctAnswer.answer === "Tidak") {
      return step + 1;
    }
  }
}

export default Play;