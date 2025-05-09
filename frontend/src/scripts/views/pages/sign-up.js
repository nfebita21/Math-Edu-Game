import AuthService from "../../utils/auth-service";

const SignUp = {
  async render() {
    return `
      <div class="auth-container">
        <div class="header">
          <img class="app-title" src="app-title.png">
        </div>
        <form class="form-wrapper sign-up">
          <h2>Buat Akun Baru</h2>
          <div class="input-user">
          <input type="text" id="identityNumber" placeholder="Nomor Identitas" autocomplete="off" required/>
          <input id="password" type="password" placeholder="Kata Sandi" required/>
          <input id="passwordConfirm" type="password" placeholder="Konfirmasi Kata Sandi" required/>
          </div>
          <button role="button" id="btn-sign-up">DAFTAR</button>
        </form>
        <div class="login-offer side-content">
          <div class="text-content"
            <p>Sudah memiliki akun?</p>
            <button id="go-to-login">MASUK</button>
          </div>
          <img class="illustration" src="adventure-illustration2.png">
        </div>
        
      </div>
    `;
  },

  async afterRender() {
    const signUpForm = document.querySelector('.form-wrapper.sign-up');
    const btnSignUp = document.querySelector('#btn-sign-up');
    btnSignUp.addEventListener('click', async (e) => {
      e.preventDefault();

      const identityNumberValue = signUpForm.querySelector('#identityNumber').value;
      const passwordValue = signUpForm.querySelector('#password').value;
      const passwordConfirmValue = signUpForm.querySelector('#passwordConfirm').value;
      if (!signUpForm.checkValidity()) {
        return alert('Semua kolom harus terisi');
      }
      await AuthService.signUp(identityNumberValue, passwordValue, passwordConfirmValue);      
    });

    const goToLogInBtn = document.querySelector('#go-to-login');
    goToLogInBtn.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = '#/login';
    });
  },
};

export default SignUp;