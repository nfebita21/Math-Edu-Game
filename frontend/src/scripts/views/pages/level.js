import DBSource from "../../data/db-source";
import UrlParser from "../../routes/url-parser";
import HeaderController from "../../utils/header-controller";
import { createButtonLevel } from "../templates/template-creator";

/*  */

const Level = {
  async render() {
    return `
      <div class="level-container">
        <div class="overlay"></div>
        <div class="title-label">
          <div class="bg-label">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <img src="./title-decor/diamond.png" class="diamond">
          <img src="./title-decor/label-level.png" class="label-level">
          <p class="title-text">
            Tema: </br>
            <span></span>
          </p>
        </div>
        <div class="game-details">
          <button class="btn-mission no-click-sound" id="btnMission" tooltip="Misi">
            <i class="fa-solid fa-flag"></i>
          </button>
          <p>Skor Tertinggi: 
            <span class="high-score"></span>
          </p>
        </div>
        <div class="button-wrapper">
          
        </div>
        <button id="btnBack"><i class="fa-solid fa-house-chimney"></i></button>
        <div class="modal-mission hide">
          <div class="modal-mission__header">
            <p class="modal-mission__title">
              Misi <i class="fa-solid fa-flag"></i>
            </p>
            <button class="btn-close trigger no-click-sound" href="#">
              <i class="fa fa-times" aria-hidden="true"></i>
            </button>
          </div>
          <div class="modal-mission__content">
          </div>
          <button class="btn-ok no-click-sound">Oke, mengerti!</button>
        </div>
      </div>
    `;
  }, 
  
  async afterRender() {
    const header = document.getElementById('app-bar')
    HeaderController.hideHeader(header);
    const levelContainer = document.querySelector('.level-container');
    const content = document.querySelector('#content');
    const highScoreEl = document.querySelector('.high-score');
    const btnCloseMission = document.querySelector('.modal-mission .btn-close');
    const missionModal = document.querySelector('.modal-mission');
    const missionContent = document.querySelector('.modal-mission__content');
    const btnMission = document.querySelector('.btn-mission');
    const btnOkMission = document.querySelector('.modal-mission .btn-ok');

    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const cityName = url.cityName;
    const getCity = await DBSource.getCityByName(cityName);
    const city = getCity.data[0];
    missionContent.innerHTML = city.mission;
    const colorTheme = await DBSource.getColorTheme(city.id);
    sessionStorage.setItem('colorTheme', JSON.stringify(colorTheme[0]));

    const from = sessionStorage.getItem('from');

    if (from === 'lobby') {
      missionModal.style.display = 'block';
      
      sessionStorage.removeItem('from');
      setTimeout(() => {
        missionModal.classList.remove('hide'); 
        
        this._unableButton();     
      }, 500);
    }

    const backgroundURL = `url(./wallpapers/${cityName.replace('%20', '-')}/1.png)`;
    levelContainer.style.backgroundImage = backgroundURL;
    content.style.padding = 0;

    const getModul = await DBSource.getModul(city.id);
    const modul = getModul.data[0];
    const levelTitle = document.querySelector('.title-text span');
    levelTitle.innerText = modul['modul_name'];

    
    const student = JSON.parse(localStorage.getItem('user'));
    const getScore = await DBSource.highScoreCity(student.id, city.id);
    highScoreEl.innerText = getScore['high_score'];

    const getLevelProgress = await DBSource.levelProgress(city.id, student.id);
    const levels = getLevelProgress.data;

    const buttonWrapper = document.querySelector('.button-wrapper');

    levels.forEach((lv, index) => {
      buttonWrapper.insertAdjacentHTML('beforeend', createButtonLevel(lv.level));
      const currentBtn = buttonWrapper.lastElementChild;
      console.log(currentBtn);
      const buttonText = currentBtn.querySelector('.button-lv-front');
      if (lv['is_locked'] === 1) {
        currentBtn.classList.add('locked');
        buttonText.innerHTML += '<i class="fa-solid fa-lock"></i>';
      }

      currentBtn.addEventListener('click', () => {
        sessionStorage.setItem('level', lv.level);
        window.location.href = `#/game/${url.cityName}/${lv.level}/play`;
      });
    })

    const btnBack = document.querySelector('#btnBack');
    btnBack.addEventListener('click', () => {
      window.location.href = `#/lobby?id=${localStorage.getItem('id')}`;
    });

    const missionSfx = document.querySelector('#missionSfx');

    btnCloseMission.addEventListener('click', () => {
      missionModal.classList.add('hide');
      btnMission.style.visibility = 'visible';
      this._activateButton();
      missionSfx.currentTime = 0;
      missionSfx.play();
    });

    btnMission.addEventListener('click', () => {
        // show modal
      const missionModal = document.querySelector('.modal-mission');
      
      missionModal.style.display = 'block';
      setTimeout(() => {
        missionModal.classList.remove('hide');
        missionSfx.currentTime = 0;
        missionSfx.play();
      }, 100);
      
      btnMission.style.visibility = 'hidden';
      this._unableButton();
    });

    btnOkMission.addEventListener('click', () => {
      missionModal.classList.add('hide');
      btnMission.style.visibility = 'visible';
      this._activateButton();
      missionSfx.currentTime = 0;
      missionSfx.play();
    });

    
  },


  _unableButton() {
    const btnLevel = document.querySelectorAll('.button-lv-pushable');

    const btnMission = document.querySelector('.btn-mission');

    btnMission.style.visibility = 'hidden';

    btnLevel.forEach(el => {
      el.style.pointerEvents = 'none';
    });

  },

  _activateButton() {
    const btnLevel = document.querySelectorAll('.button-lv-pushable');
    const btnMission = document.querySelector('.btn-mission');

    btnMission.style.visibility = 'visible';

    btnLevel.forEach(el => {
      el.style.pointerEvents = 'all';
    });

    // remove modal
    const missionModal = document.querySelector('.modal-mission');
    setTimeout(() => {
      missionModal.style.display = 'none';
    }, 1000);
  },

  _toTitleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }
}

export default Level;