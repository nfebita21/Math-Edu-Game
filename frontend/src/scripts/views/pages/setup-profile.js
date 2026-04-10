import DBSource from "../../data/db-source";
import Avatars from "../../globals/avatars";

const SetupProfile = {
  async render() {
    return `
      <div class="setup-profile">
        <div class="setup-modal">
          <div class="setup-modal__title-container">
            <p>Lengkapi Profil Kamu</p>
          </div>
          <ul>
            <li>
              <label for="name">Nama Panggilan:</label>
              <input id="name" autocomplete='off' required>
            </li>
            <li>
              <label for="edit-avatar">Avatar:</label>
              <div class="choose-avatar">
                <div class="choose-avatar__title-container">Pilih Avatar</div>
                <button class="option">
                  <img id="option1" src="">
                </button>
                <button class="option">
                  <img src="">
                </button>
                <button class="option">
                  <img src="">
                </button>
              </div>
            </li>
            <li class="setup-modal__submit">
              <button class="btn-save-changes" id="btnSaveInitialSetup">
                Simpan
              </button>
            </li>
          </ul>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const appBar = document.querySelector('.app-bar');
    const content = document.querySelector('#content');
    const inputName = document.querySelector('#name');
    const btnChooseAvatar = document.querySelectorAll('.choose-avatar .option');
    const btnSave = document.querySelector('#btnSaveInitialSetup');
    const identityNumber = JSON.parse(localStorage.getItem('user'))['identity_number'];
    const gender = JSON.parse(localStorage.getItem('user'))['gender'];

    let chosenAvatar;

    appBar.style.display = 'none';
    content.style.padding = 0;
    inputName.focus();

    btnChooseAvatar.forEach((option, index) => {
      const img = option.querySelector('img');
      img.src = `./avatar/${Avatars[gender][index]}`;
      option.addEventListener('click', () => {
        for(let i = 0; i < 3; i++) {
          if (i !== index) {
            btnChooseAvatar[i].classList.remove('chosen');
          };
        }
        option.classList.add('chosen');
        const imgUrl = option.querySelector('img').getAttribute('src');
        const avatarImg = imgUrl.split(`./avatar/`)[1];
        chosenAvatar = avatarImg;
      })
    })

    btnSave.addEventListener('click', async (e) => {
      e.preventDefault();
      const inputNameValue = inputName.value;

      if (inputNameValue === '') {
        return alert('Harap isi kolom nama');
      }
      if (chosenAvatar.length < 1) {
        return alert('Pilih avatar dahulu');
      }
      const updateStudent = await DBSource.updateStudent(identityNumber, inputNameValue, chosenAvatar);
      if (updateStudent.statusCode === 200) {
        location.reload();
      }
    })
  }
}

export default SetupProfile;