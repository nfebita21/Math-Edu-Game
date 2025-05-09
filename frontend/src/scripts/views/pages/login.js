// import AuthService from "../../utils/auth-service";
import DBSource from "../../data/db-source";

const Login = {
  async render() {
    return `
      <div class="auth-container">
        <div class="header">
          <img class="app-title" src="app-title.png">
        </div>
        <form class="form-wrapper login">
            <h2>Selamat Datang!</h2>
            <div class="input-user">
            <input type="text" id="username" placeholder="Nomor Identitas" autocomplete="off" required/>
            <input id="password" type="password" placeholder="Kata Sandi" required/>
            </div>
            <button role="button" id="btn-login">Masuk</button>
          </form>
        <div class="signup-offer side-content">
          <div class="text-content">
            <p>Belum memiliki akun?</p>
            <button id="go-to-sign-up">DAFTAR</button>
          </div>
          <img class="illustration"src="adventure-illustration2.png">
        </div>
        
      </div>
    `;
  },

  async afterRender() {
    const loginForm = document.querySelector('.form-wrapper.login');

    const btnLogin = document.getElementById('btn-login');
    btnLogin.addEventListener('click', async (event) => {
      event.preventDefault();
      if (!loginForm.checkValidity()) {
        return alert('Semua kolom harus terisi');
      }
      const identityNumber = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const foundStudent = await DBSource.getStudentByIdentityNumber(identityNumber);
      if (foundStudent.statusCode === 404) {
        alert('Siswa tidak tersedia');
      } else if (foundStudent.statusCode === 200) {
        if (!foundStudent.data['is_registered']) {
          return alert('Siswa belum terdaftar, silahkan mendaftar terlebih dahulu.');
        }
        const result = await DBSource.loginUser(identityNumber, password);
        if (result.statusCode === 401) {
          return alert('Kata sandi salah');
        } else if (result.statusCode === 200) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          window.location.href = '#/lobby?id=1';
        }
      }
    });

    const goToSignUpBtn = document.querySelector('#go-to-sign-up');
    goToSignUpBtn.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = '#/sign-up';
    });
  },
};

export default Login;