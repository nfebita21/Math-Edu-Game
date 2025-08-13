import DBSource from "../data/db-source";
import routes from "../routes/routes";
import UrlParser from "../routes/url-parser";
import AuthService from "../utils/auth-service";
import DrawerInitiator from "../utils/drawer-initiator";
import HeaderController from "../utils/header-controller";
import { createSettingsModal } from "./templates/template-creator";

class App {
  constructor({ button, drawer, content, body, header, menuItem }) {
    this._button = button;
    this._drawer = drawer;
    this._content = content;
    this._body = body;
    this._header = header;
    this._menuItem = menuItem;

    this._initialAppShell();
  };

  _initialAppShell() {
    DrawerInitiator.init({
      button: this._button[0],
      drawer: this._drawer[0],
      content: this._content,
      menuItem: this._menuItem,
    });

    DrawerInitiator.init({
      button: this._button[1],
      drawer: this._drawer[1],
      content: this._content,
      menuItem: this._menuItem,
    });

    this._button[2].addEventListener('click', (event) => {
      event.preventDefault();

      AuthService.logout();
      window.location.href = '#/login';
    })
  };

  _hasChanged(previousPlayerName, currentPlayerName, previousImgUrl, currentImgUrl) {
    const btnSaveChanges = document.querySelector('#btnSaveChanges');
    previousImgUrl = './avatar/' + previousImgUrl;
    if (previousPlayerName !== currentPlayerName || previousImgUrl !== currentImgUrl) {
      btnSaveChanges.style.visibility = 'visible';
    } else {
      btnSaveChanges.style.visibility = 'hidden';
    }
  }

  _showModalConfirmation({ confirmationType, currentPlayerName, newPlayerName, currentImgUrl, newImgUrl }) {
    const modalConfirmation = document.querySelector('.modal-confirmation');
    const modalContainer = document.querySelector('.modal__settings');
    const textConfirmation = modalConfirmation.querySelector('p:nth-child(1)');
    const subTextConfirmation = modalConfirmation.querySelector('p:nth-child(2)');
    const btnCancel = modalConfirmation.querySelector('#cancel');
    const btnContinue = modalConfirmation.querySelector('#continue');
    modalConfirmation.style.display = 'block';


    if (confirmationType === 'close') {
      textConfirmation.innerText = 'Perubahan belum disimpan, yakin ingin menutup jendela ini?';
      subTextConfirmation.style.innerText = 'Kamu akan kehilangan semua perubahan data yang sudah kamu buat.';
      btnContinue.addEventListener('click', () => {
        this._resetModal(currentPlayerName, currentImgUrl);
      });
    } 
    if (confirmationType === 'save') {
      textConfirmation.innerText = 'Kamu yakin ingin menyimpan perubahan ini?';
      subTextConfirmation.style.display = 'none';
      
      btnContinue.addEventListener('click', async () => {
        const playerProfileName = document.querySelector('.user-identity__name');
        const playerProfileAvatar = document.querySelector('.user-identity__photo img');
        playerProfileName.innerText = newPlayerName;
        playerProfileAvatar.src = newImgUrl;

        // Update student in database
        const student = JSON.parse(localStorage.getItem('user'));
        const identityNumber = student['identity_number'];
        const avatarUrl = newImgUrl.split(`./avatar/`)[1];
        const result = await DBSource.updateStudent(identityNumber, newPlayerName, avatarUrl);
        if (result.statusCode === 200) {
          await this._updateStudentOnReload(identityNumber);
        }
      });

      const rowEditAvatar = document.querySelector('.settings-modal ul li:nth-child(3)');
      const btnSaveChanges = document.querySelector('#btnSaveChanges');
      
      if (!rowEditAvatar.classList.contains('hidden')) {
        rowEditAvatar.classList.add('hidden');
      }

      btnSaveChanges.style.visibility = 'hidden';
    }

    btnCancel.addEventListener('click', () => {
      modalConfirmation.style.display = 'none';
    });
    
    btnContinue.addEventListener('click', () => {
      modalContainer.style.display = 'none';
      modalConfirmation.style.display = 'none';
    });
    
  }

  _resetModal(currentPlayerName, currentImgUrl) {
    const inputName = document.querySelector('.settings-modal #name');
    const avatarViewImg = document.querySelector('.avatar-view img');
    const avatarOptions = document.querySelectorAll('.choose-avatar .option');
    const btnSaveChanges = document.querySelector('#btnSaveChanges');
    const rowEditAvatar = document.querySelector('.settings-modal ul li:nth-child(3)');

    inputName.disabled = true;
    inputName.value = currentPlayerName;
    avatarViewImg.src = currentImgUrl;
    btnSaveChanges.style.visibility = 'hidden';
    // After the window is closed, also remove the change avatar container if it is still open
    if (!rowEditAvatar.classList.contains('hidden')) {
      rowEditAvatar.classList.add('hidden');
    }

    avatarOptions.forEach((option) => {
      let avatarOptionImgUrl = option.querySelector('img').getAttribute('src');
      if (currentImgUrl === avatarOptionImgUrl) {
        option.classList.add('chosen');
      } else {
        option.classList.remove('chosen');
      }
    });
  }

  _dataChangesChecker(currentPlayerName, newPlayerName, currentImgUrl, newImgUrl) {
    const btnSaveChanges = document.querySelector('#btnSaveChanges');
    if (currentPlayerName !== newPlayerName || currentImgUrl !== newImgUrl) {
      btnSaveChanges.style.visibility = 'visible';
    } else {
      btnSaveChanges.style.visibility = 'hidden';
    }
  }

  _settingsModalOperation() {
    const modalContainer = document.querySelector('.modal__settings');
    const btnOpenModal = document.querySelector('#btnEdit');
    const btnCloseModal = document.querySelector('#closeModalBtn');
    const btnEditName = document.querySelector('#editName');
    const inputName = document.querySelector('.settings-modal #name');
    const avatarViewImg = document.querySelector('.avatar-view img');
    const btnEditAvatar = document.querySelector('#editAvatar');
    const rowEditAvatar = document.querySelector('.settings-modal ul li:nth-child(3)');
    const avatarOptions = modalContainer.querySelectorAll('.choose-avatar .option');
    const btnSaveChanges = modalContainer.querySelector('#btnSaveChanges');
    let currentPlayerName = document.querySelector('.user-identity__name').innerText;
    let currentImgUrl = document.querySelector('.user-identity__photo img').getAttribute('src');
    const student = JSON.parse(localStorage.getItem('user'));
    currentPlayerName = student['nick_name'];
    currentImgUrl = `./avatar/${student['avatar_url']}`;
    

    btnOpenModal.addEventListener('click', () => {
      modalContainer.style.display = 'block';

      const student = JSON.parse(localStorage.getItem('user'));
      currentPlayerName = student['nick_name'];
      currentImgUrl = `./avatar/${student['avatar_url']}`;
      
      inputName.value = currentPlayerName;
      avatarViewImg.src = currentImgUrl;

      avatarOptions.forEach((option) => {
        let avatarOptionImgUrl = option.querySelector('img').getAttribute('src');
        if (currentImgUrl === avatarOptionImgUrl) {
          option.classList.add('chosen');
        } else {
          option.classList.remove('chosen');
        }
      });
    });


    btnCloseModal.addEventListener('click', () => {
      // check if there are any data changes via the save button visibility
      const visibilityBtnSave = window.getComputedStyle(btnSaveChanges).visibility;
      if (visibilityBtnSave === 'hidden') {
        // no data changes, just close the modal window
        modalContainer.style.display = 'none';
      } else {
        // there are data changes, show question confirmation
        this._showModalConfirmation({
          confirmationType: 'close',
          currentPlayerName,
          currentImgUrl,
        });
      }
    });

    
    btnEditName.addEventListener('click', () => {
      inputName.disabled = false;
      inputName.focus();
      const length = inputName.value.length;
      inputName.setSelectionRange(length, length);
    });

    btnEditAvatar.addEventListener('click', () => {
      rowEditAvatar.classList.toggle('hidden');
    });

    // before updating data, assign the variable value with the old data;
    let newPlayerName = currentPlayerName;
    let newImgUrl = currentImgUrl;

    inputName.addEventListener('input', (event) => {
      newPlayerName = event.target.value;

      this._dataChangesChecker(currentPlayerName, currentImgUrl, currentImgUrl, newImgUrl )
    });

    avatarOptions.forEach((option, index) => {
      // style for button whose avatar is chosen
      let avatarOptionImgUrl = option.querySelector('img').getAttribute('src');
      if (currentImgUrl === avatarOptionImgUrl) {
        option.classList.add('chosen');
      }

      option.addEventListener('click', () => {
        newImgUrl = option.querySelector('img').getAttribute('src');

        // reset style all button 
        for(let i = 0; i < 3; i++) {
          if (i !== index) {
            avatarOptions[i].classList.remove('chosen');
          };
        }

        option.classList.add('chosen');
        avatarViewImg.src = newImgUrl;
        console.log(newPlayerName, newImgUrl);

        this._dataChangesChecker(currentPlayerName, newPlayerName, currentImgUrl, newImgUrl)
        
      });
    });

    btnSaveChanges.addEventListener('click', () => {
      this._showModalConfirmation({
        confirmationType: 'save',
        newPlayerName,
        newImgUrl,
      });

    });

    let exceptionToNotToCloseDrawer = document.querySelector('.modal__settings');
    exceptionToNotToCloseDrawer.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  async _updateStudentOnReload(identityNumber) {
    const student = await DBSource.getStudentByIdentityNumber(identityNumber);
    localStorage.setItem('user', JSON.stringify(student.data));
  }

  async renderPage() {
    let page;
    const url = UrlParser.parseActiveUrlWithCombiner();
    const isLoggedIn = await AuthService.isLoggedIn();
    if (isLoggedIn) {
      if (url === '/login' || url === '/sign-up' || url === '/' || url === '/lobby') {
        window.location.href = '#/lobby?id=1';
        window.location.reload();
      } else {
        page = routes[url];
      }
      const identityNumber = JSON.parse(localStorage.getItem('user'))['identity_number'];
      await this._updateStudentOnReload(identityNumber);
      await HeaderController.showHeader(this._header);

    } else {
      HeaderController.hideHeader(this._header);
      AuthService.logout();
      if (url === '/login' || url === '/sign-up') {
        page = routes[url];
      } else {
        page = routes['/login'];
        window.location.href = '#/login';
      }
    }

    this._content.innerHTML = await page.render();
    await page.afterRender();

    if (isLoggedIn) {
      const student = JSON.parse(localStorage.getItem('user'));
      const nickName = student['nick_name'];
      const avatarUrl = student['avatar_url'];
      const gender = student['gender'];
      this._content.insertAdjacentHTML('beforeend', createSettingsModal(nickName, gender, avatarUrl));
      this._settingsModalOperation();
    }

  };
};

export default App;