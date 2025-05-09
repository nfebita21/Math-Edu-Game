const BASE_URL = 'http://localhost:3000';

const API_ENDPOINT = {
  students: `${BASE_URL}/students`,
  getStudentByIdentityNumber: (number) => `${BASE_URL}/students/search/${number}`,
  login: `${BASE_URL}/login`,
  signUp: `${BASE_URL}/sign-up`,
  updateStudent: (number) => `${BASE_URL}/students/${number}`,
  protected: `${BASE_URL}/protected`,
  totalExp: (id) => `${BASE_URL}/students/${id}/total-exp`,
  city: `${BASE_URL}/city`,
  getCityByName: (cityName) => `${BASE_URL}/city/${cityName}`,
  studentCityProgress: (studentId, cityId) => `${BASE_URL}/students/${studentId}/${cityId}`,
  leaderboard: `${BASE_URL}/students/leaderboard`,
  cityProgress: (cityId) => `${BASE_URL}/city/progress/${cityId}`,
  studentGallery: (studentId) => `${BASE_URL}/students/gallery/${studentId}`,
  buyCity: (studentId) => `${BASE_URL}/students/${studentId}/buy-city`,
  modul: (cityId) => `${BASE_URL}/city/modul/${cityId}`,
  modulById: (id) => `${BASE_URL}/modul/${id}`,
  cityReward: (cityId) => `${BASE_URL}/city/reward/${cityId}`
}

export default API_ENDPOINT;