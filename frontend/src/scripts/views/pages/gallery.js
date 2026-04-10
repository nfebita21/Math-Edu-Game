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
        <p class="break--mobile">Koleksi<br>Spot Rahasia</p>
        <p class="break--desktop">Koleksi Spot Rahasia</p>
        <div class="title-decor cities-right">
          <img src="./title-decor/city.png">
          <img src="./title-decor/city4-backwards.png">
          <img src="./title-decor/city2-backwards.png">
        </div>
      </div>
      <div class="container gallery-container"></div>
      <div id="galleryModal" class="gallery-modal">
        <span class="close-gallery-modal button">&times;</span>
        <div class="gallery-modal__content">
          <img id="galleryModalImage" src="./secret-spots/kanal-serenity.jpg" alt="Preview">
          <div id="galleryModalCaption" class="gallery-modal__caption">
            <p class="spot-name">Kanal Serenity</p>
            <p class="spot-type">Tipe: Basic</p>
          </div>
        </div>
      </div>
    </div>
    `;
  },

  async afterRender() {
    
    this._addButtonBackToLobby();
    await this._addContainerCardsForEachCity();
    this._addEmptyCards();
    await this._putGalleryStudentIntoCard();

    const galleryCards = document.querySelectorAll('.gallery__card');

    galleryCards.forEach(card => {
      const imageUrl = card.querySelector('.gallery__card-content img').src;
      const name = card.querySelector('.spot-name').textContent;
      const type = card.querySelector('.spot-type').textContent
      card.addEventListener('click', () => {
        this.openModal(imageUrl, name, type);
      });
    });

    this.addCheckMarkForCompletedCards();
  },

  openModal(src, spotName, spotType) {
    document.querySelector("#galleryModalImage").src = src;
    document.querySelector("#galleryModalCaption .spot-name").innerText = spotName;
    document.querySelector("#galleryModalCaption .spot-type").innerText = `Tipe: ${spotType}`;

    const galleryModal = document.querySelector("#galleryModal")
    galleryModal.style.display = "flex";

    document.querySelector('.close-gallery-modal').addEventListener('click', () => {
      galleryModal.style.display = "none";
    });

    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) {
      galleryModal.style.display = "none";
      }
    })
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

      if (spot.type === 'Advanced') {
        let badgeCards = cardsWrapper[cityIndex].querySelectorAll('.badge-card');
        let badgeCard = badgeCards[0];
        badgeCard.src = 'red-badge.png';
        badgeCard.classList.add('advanced');
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