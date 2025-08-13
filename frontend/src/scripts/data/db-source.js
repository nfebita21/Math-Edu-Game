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

  static async totalScoreStudent(id) {
    const response = await fetch(API_ENDPOINT.getTotalScore(id));

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

  static async getCityReward(cityId, level) {
    const response = await fetch(API_ENDPOINT.cityReward(cityId, level));
    const responseJson = await response.json();
    return responseJson;
  }

  static async getQuizProgress(id) {
    const response = await fetch(API_ENDPOINT.quizProgress(id));
    const responseJson = await response.json();
    return responseJson;
  }

  static async getStudentQuizProgress(studentId, modulId, level) {
    const response = await fetch(API_ENDPOINT.studentQuizProgress(studentId, modulId, level));
    const responseJson = await response.json();
    return responseJson;
  }

  static async addProgressQuiz(studentId, modulId, level) {
    const response = await fetch(API_ENDPOINT.newQuizProgress(studentId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ modulId, level }),
    });
    const responseJson = await response.json();
    return responseJson;
  }
  
  static async updateTutorialPassed(quizProgressId) {
    const response = await fetch(API_ENDPOINT.tutorialPassed(quizProgressId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const responseJson = await response.json();
    return responseJson;
  }

  static async convertReward(cityId, rewardName) {
    const response = await fetch(API_ENDPOINT.rewardConversion(cityId, rewardName));
    const responseJson = await response.json();
    return responseJson;
  }

  static async getGameResultTemplate(cityId) {
    const response = await fetch(API_ENDPOINT.gameResultTemplate(cityId));
    const responseJson = await response.json();
    return responseJson;
  }

  static async highScore(studentId, cityId, level) {
    const response = await fetch(API_ENDPOINT.getHighScore(studentId, cityId, level));
    const responseJson = await response.json();
    return responseJson;
  }

  static async startQuiz(studentId, cityId, level) {
    const response = await fetch(API_ENDPOINT.postNewQuiz(studentId, cityId, level), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const responseJson = await response.json();
    return responseJson;
  }

  static async historySaving(data) {
    const { historyId, score, totalCandy, overallValue, totalQuestions, correctAnswers, isPassed } = data;
    const response = await fetch(API_ENDPOINT.saveHistory(historyId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        score, totalCandy, overallValue, totalQuestions, correctAnswers, isPassed
      })
    });
    const responseJson = await response.json();
    return responseJson;
  }

  static async candyIncrease(studentId, candy) {
    const response = await fetch(API_ENDPOINT.addCandy(studentId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: candy
      })
    });
    const responseJson = await response.json();
    return responseJson;
  }

  static async highScoreCity(studentId, cityId) {
    const response = await fetch(API_ENDPOINT.getCityHighScore(studentId, cityId));
    const responseJson = await response.json();
    return responseJson;
  }

  static async cityLeaderboard(cityId) {
    const response = await fetch(API_ENDPOINT.getCityLeaderboard(cityId));
    const responseJson = await response.json();
    return responseJson;
  }

  static async passedQuizzes(studentId, cityId, level) {
    const response = await fetch(API_ENDPOINT.searchPassedQuizzes(studentId, cityId, level));
    const responseJson = await response.json();
    return responseJson;
  }

  static async levelProgress(cityId, studentId) {
    const response = await fetch(API_ENDPOINT.getLevelProgress(cityId, studentId));
    const responseJson = await response.json();
    return responseJson;
  }
  
  static async level(cityId, levelNum) {
    const response = await fetch(API_ENDPOINT.getLevel(cityId, levelNum));
    const responseJson = await response.json();
    return responseJson;
  }

  static async quiz(modulId, level) {
    const response = await fetch(API_ENDPOINT.getQuiz(modulId, level));
    const responseJson = await response.json();
    return responseJson;
  }

  
}




export default DBSource;