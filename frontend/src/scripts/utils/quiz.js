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
  const regex = /\[FRAC:[^\]]+\]/g;
  const results = [];
  let match;

  // cari semua pecahan di dalam string
  while ((match = regex.exec(str)) !== null) {
    const fractionStr = extractFraction(match[0]);
    if (!fractionStr) continue;

    const inner = fractionStr.match(/\[FRAC:(.*?)\]/);
    if (!inner) continue;

    const fracPart = inner[1];
    let integer = null;
    let numerator = null;
    let denominator = null;

    if (fracPart.includes("-")) {
      const [intPart, frac] = fracPart.split("-");
      integer = parseInt(intPart, 10);

      const [num, den] = frac.split("/");
      numerator = parseInt(num, 10);
      denominator = parseInt(den, 10);
    } else {
      const [num, den] = fracPart.split("/");
      numerator = parseInt(num, 10);
      denominator = parseInt(den, 10);
    }

    results.push({ integer, numerator, denominator });
  }

  return results;
};

const extractFraction = (str) => {
  let match = str.match(/\[.*?\]/);
  return match[0];
}

const renderRawFraction = (str) => {
  // 1️⃣ PECAHAN CAMPURAN: a-b/c
  const mixed = str.match(/^(\d+)-(.+)\/(.+)$/);
  if (mixed) {
    const [, integer, num, den] = mixed;
    return `
      <span class="fraction-wrapper">
        <span class="integer">${integer}</span>
        <span class="fraction">
          <span class="numerator">${renderSingleExpression(num)}</span>
          <span class="denominator">${renderSingleExpression(den)}</span>
        </span>
      </span>
    `;
  }

  // 3️⃣ FRACTION BIASA: a/b
  if (str.includes('/')) {
    const [num, den] = str.split('/');
    if (num.includes(',')) {
      const nums = num.split(',');
      return nums.map(num => `
        <span class="fraction-wrapper">
          <span class="integer"></span>
          <span class="fraction">
            <span class="numerator">${renderSingleExpression(num)}</span>
            <span class="denominator">${renderSingleExpression(den)}</span>
          </span>
        </span>
      `).join(', ');
    }

    return `
      <span class="fraction-wrapper">
        <span class="integer"></span>
        <span class="fraction">
          <span class="numerator">${renderSingleExpression(num)}</span>
          <span class="denominator">${renderSingleExpression(den)}</span>
        </span>
      </span>
    `;
  }

  // 4️⃣ ANGKA BIASA
  return str;
}

const isImageFile = (str) => {
  return /\.(png|jpg|jpeg|gif|webp)$/i.test(str);
}

const renderSingleExpression = (str) => {
  return str.replace(/[*:]/g, (op) => {
    if (op === '*') return ' <span class="operator">x</span> ';
    if (op === ':') return ' <span class="operator">:</span> ';
  });
}

const isFullFraction = (str) => {
  const slashIndex = str.indexOf('/');
  if (slashIndex === -1) return false;

  const left = str.slice(0, slashIndex);
  const right = str.slice(slashIndex + 1);

  return left.includes('*') && right.includes('*');
};


const formatAnswerContent = (str) => {
  if (!str) return '';

  // IMAGE
  if (isImageFile(str)) {
    return `<img src="./illustrations-quiz/${str}" alt="answer-image">`;
  }

  // STRING ONLY
  if (!/[0-9]/.test(str)) return str;

  // 1️⃣ COMPARISON (TOP LEVEL)
  const comparisonMatch = str.match(/[><]/);
  
  if (comparisonMatch) {
    let commonDenom = '';
    if (str.includes('|')) {
      const parts = str.split('|');

      str = parts[0];

      if (parts[1]) {
        commonDenom = parts[1].split(',');
      }
    }
    const op = comparisonMatch[0];
    const index = str.indexOf(op);

    const left = str.slice(0, index);
    const right = str.slice(index + 1);

    return `
      ${formatAnswerContent(left)}
      <span class="operator">${op}</span>
      ${formatAnswerContent(right)}
      ${
        commonDenom 
        ? `
            <i class="fa-solid fa-arrow-right arrow-separator"></i> 
          ${formatAnswerContent(commonDenom[0])} 
          <span class="operator">${op}</span>
          ${formatAnswerContent(commonDenom[1])}
        ` 
        : ''}
    `;
  }

  // FPB and Ratio
  if (/^\d+\|/.test(str)) {
    const splitted = str.split("|");
    return `
      FPB: ${splitted[0]}<br>
      → ${splitted[1]}
    `;
  }

  // Multiple answers
  if (str.includes('&')) {
    return str
      .split('&')
      .map(s => formatAnswerContent(s))
      .join('<span class="line-break"></span>');
  }

  // PERSAMAAN (LEVEL TERLUAR)
  if (str.includes('=')) {
    return str
      .split('=')
      .map(s => formatAnswerContent(s))
      .join(' <span class="operator">=</span> ');
  }

  // Cek apakah pecahan perkalian
  if (isFullFraction(str)) {
    return renderRawFraction(str);
  }

  // OPERATOR LUAR (* atau :)
  const opMatch = str.match(/[*:]/);
  if (opMatch) {
    const op = opMatch[0];
    const index = str.indexOf(op);

    const left = str.slice(0, index);
    const right = str.slice(index + 1);

    return `
      ${formatAnswerContent(left)}
      <span class="operator">${op === '*' ? 'x' : ':'}</span>
      ${formatAnswerContent(right)}
    `;
  }

  // SISANYA → PECAHAN / ANGKA
  return renderRawFraction(str);
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

const addQuizDetail = (stepId, answer, correctAnswer, isCorrect) => {
  const answerDetail = JSON.parse(sessionStorage.getItem('answerDetail'));
  answerDetail.push({stepId, answer, correctAnswer, isCorrect});

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
      const rewardCardSfx = document.querySelector('#rewardCardSfx');
      rewardCardSfx.currentTime = 0;
      rewardCardSfx.play();
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

export { renderFractionText, parseFraction , startQuiz, scoringHandler, getLetterGrade, calculateOverallValue, getValueColor, getvalueLabel, hasPassedOverall, saveQuiz, addQuizDetail, saveAnswerDetail, extractDecimal, isPowerOfTen, getMainIndex, formatAnswerContent };