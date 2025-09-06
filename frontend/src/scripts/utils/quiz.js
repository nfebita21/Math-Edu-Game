import showRewardCard from "../animations/reward-card";
import DBSource from "../data/db-source";
import generateCard from "./generate-card";

const renderFractionText = (text) => {
  return text.replace(/\[FRAC:(?:(\d+)-)?(\d+)\/(\d+)\]/g, (_, integer, numerator, denominator) => {
    if (integer) {
      // Pecahan campuran
      return `
        <span class="fraction-wrapper mixed">
          <span class="integer">${integer}</span>
          <span id="fraction">
            <span class="numerator">${numerator}</span>
            <span class="denominator">${denominator}</span>
          </span>
        </span>
      `;
    } else {
      // Pecahan biasa
      return `
        <span class="fraction-wrapper">
        <span class="integer"></span>
          <span id="fraction">
            <span class="numerator">${numerator}</span>
            <span class="denominator">${denominator}</span>
          </span>
        </span>
      `;
    }
  });
};

const extractDecimal = (str) => {
  let matches = str.match(/\d+[.,]\d+/g) || [];
  return matches;
}


const parseFraction = (str) => {
  console.log(str)
  const fractionStr = extractFraction(str);
  
  let match = fractionStr.match(/\[FRAC:(.*?)\]/);
  if (!match) return null;

  let fracPart = match[1]; 
  
  let integer = null;
  let numerator = null;
  let denominator = null;

  if (fracPart.includes("-")) {
    let [intPart, frac] = fracPart.split("-");
    integer = parseInt(intPart, 10);

    let [num, den] = frac.split("/");
    numerator = parseInt(num, 10);
    denominator = parseInt(den, 10);
  } else {
    let [num, den] = fracPart.split("/");
    numerator = parseInt(num, 10);
    denominator = parseInt(den, 10);
  }

  return { integer, numerator, denominator };
}

const extractFraction = (str) => {
  let match = str.match(/\[.*?\]/);
  return match[0];
}

const startQuiz = async () => {
  const studentData = JSON.parse(localStorage.getItem('user'));
  const studentId = studentData.id;
  const cityId = sessionStorage.getItem('cityId');
  const level = sessionStorage.getItem('level');

  const response = await DBSource.startQuiz(studentId, cityId, level);
  if (response.historyId) {
    sessionStorage.setItem('historyId', response.historyId);
  }
}

const scoringHandler = (isCorrect, score) => {
  let currentTotalScore = Number(sessionStorage.getItem('totalScore'));
  isCorrect ? currentTotalScore += score : currentTotalScore += 5;

  sessionStorage.setItem('totalScore', currentTotalScore);
}

const getLetterGrade = (value) => {
  if (value >= 95) return "A+";
  if (value >= 90) return "A";
  if (value >= 85) return "A-";
  if (value >= 80) return "B+";
  if (value >= 75) return "B";
  if (value >= 70) return "B-";
  if (value >= 65) return "C+";
  if (value >= 60) return "C";
  if (value >= 50) return "D";
  return "E";
}

const calculateOverallValue = () => {
  const totalQuiz = Number(sessionStorage.getItem('quizCounter'));
  const wrongAnswer = Number(sessionStorage.getItem('wrongAnswer'));

  const value = ((totalQuiz - wrongAnswer) / totalQuiz) * 100;
  const gradeLetter = getLetterGrade(Math.round(value));
  return gradeLetter;
}

const getValueColor = (value) => {
  if (["A+", "A", "A-", "B+", "B", "B-"].includes(value)) {
    return 'green';
  } else if (["C+", "C"].includes(value)) {
    return 'orange';
  } else if (["D", "E"].includes(value)) {
    return 'red';
  }
  return undefined;
}

const getvalueLabel = (isPassed) => {
  let labelImg;
  if (isPassed) {
    labelImg = './in-game/passed.png';
  } else {
    labelImg = './in-game/unpassed.png';
  }
  return labelImg;
}

const hasPassedOverall = (value) => {
  if (value === 'C' || value === 'D' || value === 'E') {
    return false;
  }
  return true;
}

const saveQuiz = async (dataToUpdated) => {
  
  const historyId = Number(sessionStorage.getItem('historyId'));
  const { score, totalCandy, overall, isPassed } = dataToUpdated;
  
  const totalQuestions = Number(sessionStorage.getItem('quizCounter'));
  const correctAnswers = totalQuestions - Number(sessionStorage.getItem('wrongAnswer'));

  const data = { historyId, score, totalCandy, overallValue: overall, totalQuestions, correctAnswers, isPassed };
  await DBSource.historySaving(data);
  await addCandyToWallet(totalCandy);
}

const addQuizDetail = (stepId, answer, isCorrect) => {
  const answerDetail = JSON.parse(sessionStorage.getItem('answerDetail'));
  answerDetail.push({stepId, answer, isCorrect});

  sessionStorage.setItem('answerDetail', JSON.stringify(answerDetail));
}

const saveAnswerDetail = async (cityId, mainId, correctStepPerQuiz) => {
  const answerDetail = JSON.parse(sessionStorage.getItem('answerDetail'));
  const historyId = sessionStorage.getItem('historyId');

  const detailQuiz = JSON.parse(sessionStorage.getItem('detailQuiz'));
  const totalStep = detailQuiz.sub.at(-1).step;
  const valuePerQuestion = correctStepPerQuiz / totalStep * 100;
  const isPassed = valuePerQuestion >= 70;
  const student = JSON.parse(localStorage.getItem('user'));

  const data = await DBSource.quizCompleteHandler(student.id, cityId, mainId, historyId, isPassed, answerDetail);

  if (data.rewardGranted) {
    const reward = await generateCard(data.rewardType);

    if (reward) {
      await DBSource.studentGalleryAddiction(student.id, reward.id);
      await showRewardCard(reward);
    }
  }
}

const addCandyToWallet = async (amount) => {
  const student = JSON.parse(localStorage.getItem('user'));
  const studentId = student.id;
  await DBSource.candyIncrease(studentId, amount);
}

function isPowerOfTen(n) {
  if (n < 10) return false; // minimal 10
  let log10 = Math.log10(n);
  return Number.isInteger(log10);
}

const getMainIndex = (mainId) => {
  const mainQuizArr = (JSON.parse(sessionStorage.getItem('detailQuiz'))).main;
  const currentMain = mainQuizArr.find(main => main.id === mainId);
  const mainIndex = currentMain.main_index;

  return mainIndex;
}

export { renderFractionText, parseFraction , startQuiz, scoringHandler, getLetterGrade, calculateOverallValue, getValueColor, getvalueLabel, hasPassedOverall, saveQuiz, addQuizDetail, saveAnswerDetail, extractDecimal, isPowerOfTen, getMainIndex };