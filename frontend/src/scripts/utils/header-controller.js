import DBSource from "../data/db-source";

class HeaderController {
  static async showHeader(headerElement) {
    const user = JSON.parse(localStorage.getItem('user'));
    const avatarImgValue = user['avatar_url'];
    const fullNameValue = user["full_name"];
    const nickNameValue = user['nick_name'];
    const candyValue = user['candy'];
    const studentId = user['id'];
    const totalScoreRequest = await DBSource.totalScoreStudent(studentId);
    const totalScore = totalScoreRequest['total_score'];

    let avatarImg = headerElement.querySelector('.avatar-img');
    let fullName = headerElement.querySelector('#fullName');
    let nickName = headerElement.querySelector('#nickName');
    let candy = headerElement.querySelector('#candy');
    let exp = headerElement.querySelector('.exp p')

    avatarImg.src = `./avatar/${avatarImgValue}`;
    fullName.innerText = fullNameValue;
    nickName.innerText = nickNameValue;
    candy.innerText = candyValue;
    exp.innerText = `Total Skor: ${totalScore}`;

    headerElement.classList.add('show');
  }

  static async hideHeader(headerElement) {
    headerElement.classList.remove('show');
  }
}

export default HeaderController;