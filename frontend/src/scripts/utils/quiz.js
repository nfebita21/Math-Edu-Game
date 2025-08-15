import DBSource from "../data/db-source";

const renderFractionText = (text) => {
  return text.replace(/\[FRAC:(\d+)\/(\d+)\]/g, (_, numerator, denominator) => {
    return `
      <span class="fraction-wrapper">
        <span id="fraction">
          <span class="numerator">${numerator}</span>
          <span class="denominator">${denominator}</span>
        </span>
      </span>
    `;
  });
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

const saveAnswerDetail = async (mainId, correctStepPerQuiz) => {
  const answerDetail = JSON.parse(sessionStorage.getItem('answerDetail'));
  const historyId = sessionStorage.getItem('historyId');

  const detailQuiz = JSON.parse(sessionStorage.getItem('detailQuiz'));
  const totalStep = detailQuiz.sub.at(-1).step;
  const valuePerQuestion = correctStepPerQuiz / totalStep * 100;
  const isPassed = valuePerQuestion >= 70;

  const save = await DBSource.quizCompleteHandler(mainId, historyId, isPassed, answerDetail);

  console.log(save);
}

const addCandyToWallet = async (amount) => {
  const student = JSON.parse(localStorage.getItem('user'));
  const studentId = student.id;
  await DBSource.candyIncrease(studentId, amount);
}


export { renderFractionText, startQuiz, scoringHandler, getLetterGrade, calculateOverallValue, getValueColor, getvalueLabel, hasPassedOverall, saveQuiz };