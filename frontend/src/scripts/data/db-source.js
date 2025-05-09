import API_ENDPOINT from "../globals/api-endpoint";

class DBSource {
  static async getAllStudents() {
    const response = await fetch(API_ENDPOINT.students);
    const responseJson = await response.json();
    return responseJson;
  }

  static async getStudentByIdentityNumber(number) {
    const response = await fetch(API_ENDPOINT.getStudentByIdentityNumber(number));
    const responseJson = await response.json();
    return responseJson;
  }

  static async loginUser(identityNumber, password) {
    const response = await fetch(API_ENDPOINT.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identityNumber, password }),
    });

    const responseJson = await response.json();
    return responseJson;
  }

  static async signUp(identityNumber, password) {
    const response = await fetch(API_ENDPOINT.signUp, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identityNumber, password }),
    });
    const responseJson = await response.json();
    return responseJson;
  }

  static async updateStudent(identityNumber, nickName, avatarUrl) {
    const response = await fetch(API_ENDPOINT.updateStudent(identityNumber), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickName, avatarUrl }),
    });
    const responseJson = await response.json();
    return responseJson;
  }

  static async protected(token) {
    const response = await fetch(API_ENDPOINT.protected, {
      headers: {
        'authorization': token,
      }
    });

    const responseJson = await response.json();
    return responseJson;
  }

  static async getTotalExpStudent(id) {
    const response = await fetch(API_ENDPOINT.totalExp(id));

    const responseJson = await response.json();
    return responseJson;
  }

  static async getAllCity() {
    const response = await fetch(API_ENDPOINT.city);
    const responseJson = await response.json();
    return responseJson;
  }

  static async getStudentCityProgress(studentId, cityId) {
    const response = await fetch(API_ENDPOINT.studentCityProgress(studentId, cityId));
    const responseJson = await response.json();
    return responseJson;
  }

  static async getStudentsLeaderboard() {
    const response = await fetch(API_ENDPOINT.leaderboard);
    const responseJson = await response.json();
    return responseJson;
  }

  static async getCityProgress(cityId) {
    const response = await fetch(API_ENDPOINT.cityProgress(cityId));
    const responseJson = await response.json();
    return responseJson;
  }

  static async getStudentGallery(studentId) {
    const response = await fetch(API_ENDPOINT.studentGallery(studentId));
    const responseJson = await response.json();
    return responseJson;
  }

  static async buyCity(studentId, cityId) {
    const response = await fetch(API_ENDPOINT.buyCity(studentId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cityId }),
    });
    const responseJson = await response.json();
    return responseJson;
  }

  static async getModul(cityId) {
    const response = await fetch(API_ENDPOINT.modul(cityId));
    const responseJson = await response.json();
    return responseJson;
  }

  static async getCityByName(cityName) {
    const response = await fetch(API_ENDPOINT.getCityByName(cityName));
    const responseJson = await response.json();
    return responseJson;
  }

  static async getModulById(modulId) {
    const response = await fetch(API_ENDPOINT.modulById(modulId));
    const responseJson = await response.json();
    return responseJson;
  }

  static async getCityReward(cityId) {
    const response = await fetch(API_ENDPOINT.cityReward(cityId));
    const responseJson = await response.json();
    return responseJson;
  }
}

export default DBSource;