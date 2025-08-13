import HolderInitiator from "../../utils/holder-initiator";
import { createCitySliderTemplate, createGreetingBubble } from "../templates/template-creator";
import Swiper from "../../utils/swiper";
import DBSource from "../../data/db-source";
import SetupProfile from "./setup-profile";
import UrlParser from "../../routes/url-parser";

const Lobby = {
  async render() {
    return `
      <div class="lobby">
        
        <div class="greetings">
          <img src="girl.png" class="char-greeter">
        </div>
      </div>
    `;
  },

  async afterRender() {
    const identityNumber = JSON.parse(localStorage.getItem('user'))['identity_number'];
    const student = await DBSource.getStudentByIdentityNumber(identityNumber);
    const content = document.querySelector('#content');
    let isSetup = student.data['is_setup'];

    const setupProfil = SetupProfile;
    if (!isSetup) {
      content.innerHTML = await setupProfil.render();
      await setupProfil.afterRender();
      return;
    }

    const getAllCity = await DBSource.getAllCity();
    let cities = getAllCity.city;
    const studentId = student.data.id;
    const greetings = document.querySelector('.greetings');
    let currentSlide;
    let btnPrev;
    let btnNext;
    let cityPic;
    let padLock;
    let btnBuyCity;
    let btnVisit;
    
    for (const [index, city] of cities.entries()) {
      const cityId = `city0${index+1}`;
      const rank = await this._getStudentCityRank(cityId, studentId);

      const getStudentProgress = await DBSource.getStudentCityProgress(studentId, cityId);
      const studentProgress = getStudentProgress.data;
      const studentHighScore = await DBSource.highScoreCity(studentId, cityId);

      greetings.insertAdjacentHTML('beforebegin', createCitySliderTemplate(city, studentHighScore['high_score'], rank));

      currentSlide = document.querySelectorAll('.slide-wrapper')[index];
      cityPic = currentSlide.querySelector('.city-picture');
      padLock = currentSlide.querySelector('.padlock');
      btnBuyCity = currentSlide.querySelector('.btn-buy-city');
      btnVisit = currentSlide.querySelector('button#visit');

      // Style when city locked
      if (studentProgress['is_locked']) {
        cityPic.classList.add('lock');
        btnVisit.classList.add('disabled');
        padLock.style.display = 'block';
        btnBuyCity.style.display = 'flex';
      }

       // Arrow visibility controller
      btnPrev = currentSlide.querySelector('.prev');
      btnNext = currentSlide.querySelector('.next');
      if (index === 0) {
        btnPrev.style.visibility = 'hidden';
      } else if (index === cities.length - 1) {
        btnNext.style.visibility = 'hidden';
      };

      HolderInitiator.init(
        currentSlide.querySelector('.image-city-slider .btn-city-info'),
        currentSlide.querySelector('.image-city-slider .city-info'),
      );

      // City Purchase
      btnBuyCity.addEventListener('click', () => {
        let candyEl = document.querySelector('.candy-container p');
        let numOfCandy = parseInt(candyEl.textContent);
        let arrowsSlider = document.querySelectorAll('.arrow');

        arrowsSlider.forEach(arrow => {
          arrow.style.pointerEvents = 'none';
        });

        if (numOfCandy >= city.price) {
          this.showPurchaseConfirmationModal(index, city['city_name'], cityId, city.price);
        } else {
          this.showPurchaseWarningModal(index, city['city_name']);
        }
      });

      btnVisit.addEventListener('click', () => {
        localStorage.setItem('id', index + 1);
        sessionStorage.setItem('from', 'lobby');
        window.location.href = `#/game/${city['city_name'].toLowerCase()}`;
        
      });
    }

    // City Swiper 
    const slideWrapper = document.querySelectorAll('.slide-wrapper');
    for (let i = 0; i < cities.length; i++) {
      currentSlide = slideWrapper[i];
      
      btnPrev = currentSlide.querySelector('.prev');
      btnNext = currentSlide.querySelector('.next');

      this.swiperInitiator(i + 1, btnPrev, btnNext);
    }

    btnPrev = document.querySelector('.prev');
    btnNext = document.querySelector('.next');

    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const slideIndex = Number(url.params);
    Swiper.showSlide(slideWrapper, slideIndex);
    
    // Show greeting character
    const nickName = JSON.parse(localStorage.getItem('user'))['nick_name'];
    const charGreeter = greetings.querySelector('.char-greeter');
    charGreeter.insertAdjacentHTML('beforebegin', createGreetingBubble(nickName));
    
  },

  showPurchaseConfirmationModal(index, cityName, cityId, price) {
    let modals = document.querySelectorAll('.modal');
    let cityNameEl = modals[index].querySelector('#cityName');
    let cityPriceEl = modals[index].querySelector('#price');
    cityNameEl.innerText = cityName;
    cityPriceEl.innerText = price;
    modals[index].style.display = 'flex';
    const slideWrapper = document.querySelectorAll('.slide-wrapper');
    const currentSlide = slideWrapper[index];

    let btnYes = modals[index].querySelector('.yes');
    let btnCancel = modals[index].querySelector('.cancel');

    if (!btnYes.hasEventListener) {
      btnYes.addEventListener('click', async () => {
        const studentId = JSON.parse(localStorage.getItem('user')).id;
        const identityNumber = JSON.parse(localStorage.getItem('user'))['identity_number'];
        const buyCity = await DBSource.buyCity(studentId, cityId);
        if (buyCity.result.affectedRows > 0) {
          let candyEl = document.querySelector('.candy-container p');
          let numOfCandy = parseInt(candyEl.textContent);

          await this._updateStudentOnReload(identityNumber);
    
          let currentCandy = numOfCandy - parseInt(price);
          candyEl.innerHTML = currentCandy;
          modals[index].style.display = 'none';
    
          let btnBuyCity = modals[index].previousElementSibling.previousElementSibling;
          let padLock = btnBuyCity.previousElementSibling;
          let cityPic = padLock.previousElementSibling;
          let parentBtnBuyCity = btnBuyCity.parentElement;
          let parentBtnVisit = parentBtnBuyCity.nextElementSibling;
          let btnVisit = parentBtnVisit.querySelector('button#visit');
    
          cityPic.classList.remove('lock');
          btnVisit.classList.remove('disabled');
          padLock.style.display = 'none';
          btnBuyCity.style.display = 'none';
    
          this.reactivateArrowsSlider();

          // Update num of visitor city in city info
          const numOfVisitor = await this._getNumOfVisitor(index);
          const numOfVisitorEl = currentSlide.querySelectorAll('.num-of-visitor span');
          numOfVisitorEl.forEach(el => {
            el.innerText = numOfVisitor;
          });
        }
      });
      btnYes.hasEventListener = true;
    }


    btnCancel.addEventListener('click', () => {
      modals[index].style.display = 'none';

      this.reactivateArrowsSlider();
    });
  },

  showPurchaseWarningModal(index, cityName) {
    let modals = document.querySelectorAll('.modal');
    let modalIcon = modals[index].querySelector('img');
    let modalText = modals[index].querySelector('p');
    let modalOption = modals[index].querySelector('.modal-option');

    modalIcon.src = 'sad.png';
    modalText.innerHTML = `Yah, permen kamu tidak mencukupi untuk membuka kota <span id="cityName">${cityName}</span>.`;
    modalOption.innerHTML =  `<button class="ok">Ok</button>`;

    let btnOk = modals[index].querySelector('.ok');
    btnOk.addEventListener('click', () => {
      modals[index].style.display = 'none';
      this.reactivateArrowsSlider();
    });

    modals[index].style.display = 'flex';
  },

  reactivateArrowsSlider() {
    let arrowsSlider = document.querySelectorAll('.arrow');
    arrowsSlider.forEach(arrow => {
      arrow.style.pointerEvents = 'auto';
    });
  },

  swiperInitiator(slideIndex, btnPrev, btnNext) {
    const slideWrapper = document.querySelectorAll('.slide-wrapper');

    Swiper.init({
      slides: slideWrapper,
      nextEl: btnNext,
      prevEl: btnPrev,
      slideIndex,
    });
  },

  async _getStudentCityRank(cityId, studentId) {
    const rankList = await DBSource.cityLeaderboard(cityId);
    // const filteredCityProgress = cityProgress.filter(visitor => visitor.exp > 0);
    let rank;

    if (rankList.length === 1) {
      if (rankList[0]['student_id'] === studentId){
        rank = 1;
      } else {
        rank = '-';
      }
    } else if (rankList.length > 1){
      const isStudentAvailable = rankList.filter(player => player['student_id'] === studentId);
      if (isStudentAvailable.length !== 0) {
        // filteredCityProgress.sort((a, b) => b.exp - a.exp);
        const index = rankList.findIndex(player => player['student_id'] === studentId);
        rank = index + 1;
      } else {
        rank = '-'
      }
    } else {
      rank = '-'
    }
    return rank;
  },

  async _getNumOfVisitor(index) {
    const getAllCity = await DBSource.getAllCity();
    let cities = getAllCity.city;
    return cities[index]['num_of_visitor'];
  },

  async _updateStudentOnReload(identityNumber) {
    const student = await DBSource.getStudentByIdentityNumber(identityNumber);
    localStorage.setItem('user', JSON.stringify(student.data));
  }
};

export default Lobby;