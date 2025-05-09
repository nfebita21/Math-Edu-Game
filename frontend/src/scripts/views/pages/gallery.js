import { createButtonBackToLobby, createCategoryCardsContainer, createEmptyCard, createGalleryCard } from "../templates/template-creator";
import DBSource from "../../data/db-source";

const Gallery = {
  async render() {
    return `
    <div class="gallery">
      <div class="title-container">
        <div class="title-decor cities-left">
          <img src="./title-decor/city2.png">
          <img src="./title-decor/city4.png">
          <img src="./title-decor/city3.png">
        </div>
        <p class="break--mobile">Galeri<br>Spot Rahasia</p>
        <p class="break--desktop">Galeri Spot Rahasia</p>
        <div class="title-decor cities-right">
          <img src="./title-decor/city.png">
          <img src="./title-decor/city4-backwards.png">
          <img src="./title-decor/city2-backwards.png">
        </div>
      </div>
      <div class="container gallery-container"></div>
    </div>
    `;
  },

  async afterRender() {
    this._addButtonBackToLobby();
    await this._addContainerCardsForEachCity();
    this._addEmptyCards();
    await this._putGalleryStudentIntoCard();
    this.addCheckMarkForCompletedCards();
  },

  _addButtonBackToLobby() {
    const contentContainer = document.querySelector('#content');
    contentContainer.innerHTML += createButtonBackToLobby();
    const btnBackToLobby = document.querySelector('.btn-back-to-lobby');
    btnBackToLobby.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '#/lobby?id=1';
    });
  },

  async _addContainerCardsForEachCity() {
    const galleryCardsContainer = document.querySelector('.container');
    const getAllCity = await DBSource.getAllCity();
    const cities = getAllCity.city;
    cities.forEach(city => {
      galleryCardsContainer.innerHTML += createCategoryCardsContainer(city['city_name']);
    });
  },

  _addEmptyCards() {
    const cardsWrapper = document.querySelectorAll('.category-cards-container .wrapper');
    cardsWrapper.forEach(el => {
      for (let i = 0; i < 5; i++) {
        el.innerHTML += createEmptyCard();
      }
    });
    
  },

  async _putGalleryStudentIntoCard() {
    const cardsWrapper = document.querySelectorAll('.category-cards-container .wrapper');
    const student = JSON.parse(localStorage.getItem('user'));
    const studentId = student.id;
    const getStudentGallery = await DBSource.getStudentGallery(studentId);
    const studentGallery = getStudentGallery.result;
    if (getStudentGallery.statusCode === 404) {
      return;
    }
    
    studentGallery.forEach(spot => {
      const sortNum = spot['city_id'].split('city0')[1];
      const cityIndex = sortNum - 1;
      const emptyCard = cardsWrapper[cityIndex].querySelectorAll('.gallery__empty-card');
      cardsWrapper[cityIndex].removeChild(emptyCard[0]);

      cardsWrapper[cityIndex].insertAdjacentHTML("afterbegin", createGalleryCard(spot));

      if (spot.type === 'advanced') {
        let badgeCards = cardsWrapper[cityIndex].querySelectorAll('.badge-card');
        let badgeCard = badgeCards[0];
        badgeCard.src = 'red-badge.png';
      }
    })
  },

  addCheckMarkForCompletedCards() {
    const categoryCardsContainer = document.querySelectorAll('.category-cards-container');
    categoryCardsContainer.forEach(container => {
      let galleryCards = container.querySelectorAll('.gallery__card');
      let checkMark = document.createElement('img');
      checkMark.src = 'check-mark.png';
      checkMark.classList.add('check-mark');
      if (galleryCards.length === 5) {
        container.appendChild(checkMark);
      }
    });
  },
};

export default Gallery;