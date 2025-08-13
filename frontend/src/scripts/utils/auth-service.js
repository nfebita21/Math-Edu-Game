import DBSource from "../data/db-source";

class AuthService {
  constructor() {
    this._loggedIn = false;
  }

  static async isLoggedIn() {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    const verifyToken = await DBSource.protected(token);
    return verifyToken.user;
  }

  static async signUp(identityNumber, password, passwordConfirm) {
    const foundStudent = await DBSource.getStudentByIdentityNumber(identityNumber);
    if (foundStudent.statusCode === 404) {
      return alert('Siswa tidak ditemukan');
    }

    if (!this.#isPasswordEqual(password, passwordConfirm)) {
      return alert('Password tidak sama');
    } 

    const result = await DBSource.signUp(identityNumber, password);
    if (result.statusCode === 409) {
      return alert('Siswa sudah terdaftar, silahkan Log In');
    } else {    
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      alert('Siswa berhasil terdaftar');
      window.location.href = '#/lobby?id=1';
    }
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static #isPasswordEqual(pw1, pw2) {
    return pw1 === pw2;
  }


  
}

export default AuthService;