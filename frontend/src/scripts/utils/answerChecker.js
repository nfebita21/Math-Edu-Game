
import { addQuizDetail } from "./quiz";

const findCorrectAnswer = (mainId, stepId) => {
  const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;
  const correctAnswer = options.find(item => item.main_quiz_id === mainId && item.sub_quiz_id === stepId && item.is_correct).answer;
  return correctAnswer;
}

const fractionSetQuestionChecking = (detail) => {
  const {mainId, stepId} = detail;
  let {operator} = detail;
  let answer = '';
  let firstNum = '';
  let secondNum = '';
  operator = operator === 'x' ? '*' : operator;

  const correctAnswer = findCorrectAnswer(mainId, stepId);
  const correctAnswerSplitted = correctAnswer.split(operator);
  const reversedAnswer = `${correctAnswerSplitted[1]}${operator}${correctAnswerSplitted[0]}`;
  
  const firstNumInput = document.querySelector('#firstNum.show');
  firstNum = firstNumInput ? firstNumInput.value : '';

  const firstFractionContainer = document.querySelector('.fraction-container.first.show');
  firstNum = firstFractionContainer ? firstFractionContainer.querySelector('#numerator').value + '/' + firstFractionContainer.querySelector('#denominator').value : firstNum;

  const secondNumInput = document.querySelector('#secondNum.show');
  secondNum = secondNumInput ? secondNumInput.value : '';

  const secondFractionContainer = document.querySelector('.fraction-container.second.show');
  secondNum = secondFractionContainer ? secondFractionContainer.querySelector('#numerator').value + '/' + secondFractionContainer.querySelector('#denominator').value : secondNum;
  
  answer = `${firstNum}${operator}${secondNum}`;
  const isCorrect = operator === "*" ? answer === correctAnswer || answer === reversedAnswer : answer === correctAnswer;

  addQuizDetail(stepId, answer, correctAnswer, isCorrect);

  return isCorrect;
}

const fractionResultChecking = (detail) => {
  const {mainId, stepId} = detail;
  const correctAnswer = findCorrectAnswer(mainId, stepId);
  let numerator = '';
  let denominator = '';

  numerator = document.querySelector('#numerator').value;
  denominator = document.querySelector('#denominator').value;
  const answer = `${numerator}/${denominator}`;
  const isCorrect = correctAnswer === answer;

  addQuizDetail(stepId, answer, correctAnswer, isCorrect);
  
  return isCorrect;
}

const fractionAbilityToSimplifyChecking = (detail) => {
  const { mainId, stepId, btnEl } = detail;
  const correctAnswer = findCorrectAnswer(mainId, stepId);
  const answer = btnEl.querySelector('p').textContent;
  const isCorrect = answer === correctAnswer;
  addQuizDetail(stepId, answer, correctAnswer, isCorrect);
  return isCorrect;
}

const simplestFractionChecking = (detail) => {
  const { mainId, stepId, btnEl } = detail;
  const correctAnswer = findCorrectAnswer(mainId, stepId);
  let isCorrect;
  let answer;

  if (correctAnswer.includes('/')) {

    const numerator = btnEl.querySelector('.answer-choices .numerator').textContent;
    const denominator = btnEl.querySelector('.answer-choices .denominator').textContent;

    answer = `${numerator}/${denominator}`;

    isCorrect = answer === correctAnswer;
  } else {
    answer = btnEl.querySelector('p').textContent;
    isCorrect = answer === correctAnswer;
  }

  addQuizDetail(stepId, answer, correctAnswer, isCorrect);
  
  return isCorrect;
}

const illustrationChoicesChecking = (detail) => {
  const { mainId, stepId, btnEl } = detail;
  let correctAnswer = findCorrectAnswer(mainId, stepId);

  const answerImg = btnEl.querySelector('.illustration');
  const answer = answerImg.getAttribute('src').split('./illustrations-quiz/')[1];
  const isCorrect = answer === correctAnswer;

  addQuizDetail(stepId, answer, correctAnswer, isCorrect);
  return isCorrect;
}

const mixedFractionChecking = (detail) => {
  const { mainId, stepId } = detail;
  let correctAnswer = findCorrectAnswer(mainId, stepId);

  const integer = document.querySelector('#integer').value;
  const numerator = document.querySelector('#numerator').value;
  const denominator = document.querySelector('#denominator').value;

  const answer = `${integer}-${numerator}/${denominator}`;

  const isCorrect = answer === correctAnswer;

  addQuizDetail(stepId, answer, correctAnswer, isCorrect);

  return isCorrect;
}

const multiFractionChecking = (detail) => {
  const { mainId, stepId } = detail;
  let correctAnswer = findCorrectAnswer(mainId, stepId);

  let answer = "";

  // Ambil semua fraction-container & decimal-kit sesuai urutan DOM
  const elements = document.querySelectorAll('.fraction-container, .decimal-kit');

  elements.forEach(el => {
    // Ambil nilai fraction
    if (el.classList.contains("fraction-container")) {
      const nums = el.querySelectorAll(".number-input");
      if (nums.length === 2) {
        const numerator = nums[0].value.trim() || "";
        const denominator = nums[1].value.trim() || "";
        answer += `${numerator}/${denominator}`;
      }
    }

    // Ambil nilai decimal
    if (el.classList.contains("decimal-kit")) {
      const input = el.querySelector(".number-input.decimal");
      if (input) {
        let val = input.value.trim().replace(".", ",") || "";
        answer += val;
      }
    }

    // === Cek apakah setelah elemen ATAU parent-nya ada <span class="equivalent"> ===
    let parent = el.closest(".optional-frac-result");
    let sibling = parent ? parent.nextElementSibling : el.nextElementSibling;

    if (sibling?.classList.contains("equivalent")) {
      answer += "=";
    }
  });

  const isCorrect = correctAnswer === answer;

  addQuizDetail(stepId, answer, correctAnswer, isCorrect);

  return isCorrect;
}

const fractionToDecimalChecking = (detail) => {
  const { mainId, stepId } = detail;

  let correctAnswer = findCorrectAnswer(mainId, stepId);

  let answer = "";

  const elements = document.querySelectorAll('.fraction-container.multiplication, .fraction-container, .decimal-kit');

  elements.forEach(el => {

    if (el.classList.contains("fraction-container") && el.classList.contains("multiplication")) {
      const parts = correctAnswer.split("/");

      // ambil bagian sebelum "*" di sisi atas
      const firstNumerator = parts[0].split("*")[0];

      // ambil bagian sebelum "*" di sisi bawah
      const firstDenominator = parts[1].split("*")[0];
      const nums = el.querySelectorAll("input.number-input");
      if (nums.length === 2) {
        const secondNumerator = nums[0].value.trim() || "";
        const secondDenominator = nums[1].value.trim() || "";
        answer += `${firstNumerator}*${secondNumerator}/${firstDenominator}*${secondDenominator}`;
      }
    }

    // Ambil nilai fraction
    if (el.classList.contains("fraction-container") && !el.classList.contains("multiplication")) {
      const nums = el.querySelectorAll(".number-input");
      if (nums.length === 2) {
        const numerator = nums[0].value.trim() || "";
        const denominator = nums[1].value.trim() || "";
        answer += `${numerator}/${denominator}`;
      }
    }

    // Ambil nilai decimal
    if (el.classList.contains("decimal-kit")) {
      const input = el.querySelector(".number-input.decimal");
      if (input) {
        let val = input.value.trim().replace(".", ",") || "";
        answer += val;
      }
    }

    // === Cek apakah setelah elemen ATAU parent-nya ada <span class="equivalent"> ===
    let parent = el.closest(".optional-frac-result");
    let sibling = parent ? parent.nextElementSibling : el.nextElementSibling;

    if (sibling?.classList.contains("equivalent")) {
      answer += "=";
    }
  });

  const isCorrect = correctAnswer === answer;

  addQuizDetail(stepId, answer, correctAnswer, isCorrect);

  return isCorrect;
  
}

const decimalComparisonChecking = (detail) => {
  const { mainId, stepId } = detail;

  let correctAnswer = findCorrectAnswer(mainId, stepId);

  const correctSymbol = correctAnswer.match(/[<>=]/);

  const answer = document.querySelector('#comparisonOperator').value;

  const isCorrect = correctSymbol[0] === answer;

  addQuizDetail(stepId, correctAnswer.split(correctSymbol[0]).join(answer), correctAnswer, isCorrect);

  return isCorrect;

}

const fractionComparisonChecking = (detail) => {
  const { mainId, stepId } = detail;

  let correctAnswer = findCorrectAnswer(mainId, stepId);

  const correctSymbol = correctAnswer.match(/[<>=]/);
  const left = correctAnswer.split(correctSymbol)[0];
  const right = correctAnswer.split(correctSymbol)[1];

  let isCorrect = false;
  const userSymbol = document.querySelector('#comparisonOperator').value;

  if (correctAnswer.includes('|')) {
    const splitted = correctAnswer.split('|');
    const correctNormalizedFractions = splitted[1].split('=');
    const unnormalizedLeft = splitted[0].split(correctSymbol)[0];
    const unnormalizedRight = splitted[0].split(correctSymbol)[1];
    const firstNormalizedFractions = `${document.querySelector('#firstNumerator').value}/${document.querySelector('#firstDenominator').value}`;

    const secondNormalizedFractions = `${document.querySelector('#secondNumerator').value}/${document.querySelector('#secondDenominator').value}`;

    const userNormalizedFractions = `${firstNormalizedFractions},${secondNormalizedFractions}`;

    isCorrect =
    correctSymbol[0] === userSymbol &&
    correctNormalizedFractions.includes(userNormalizedFractions);

    addQuizDetail(
      stepId, 
      `${unnormalizedLeft}${userSymbol}${unnormalizedRight}|${userNormalizedFractions}`, 
      `${unnormalizedLeft}${correctSymbol[0]}${unnormalizedRight}|
      ${correctNormalizedFractions}`,
      isCorrect
    );
  } else {
    isCorrect = correctSymbol[0] === userSymbol;

    addQuizDetail(stepId, `${left}${userSymbol}${right}`, correctAnswer, isCorrect);
  }

  return isCorrect;
}

const fractionTypeEquationChecking = (detail) => {
  const { mainId, stepId, btnEl } = detail;

  const correctAnswer = findCorrectAnswer(mainId, stepId);

  const answer = btnEl.querySelector('p').textContent;

  const isCorrect = correctAnswer === answer;
  addQuizDetail(stepId, answer, correctAnswer, isCorrect);

  return isCorrect;

}

const fractionTypeOptionPass = (detail) => {
  const { stepId, btnEl } = detail;
  const typeChosen = btnEl.querySelector('.choice.flower p').textContent;
  sessionStorage.setItem('typeChosen', typeChosen);
  addQuizDetail(stepId, typeChosen, typeChosen, true);
  return true;
}

const fractionEqualizationChecking = (detail) => {
  const fractionType = sessionStorage.getItem('typeChosen');

  const { mainId, stepId } = detail;
  let correctAnswer = findCorrectAnswer(mainId, stepId).split('|');
  correctAnswer = fractionType === 'Desimal' ? correctAnswer[0] : correctAnswer[1];

  let answer = "";

  const parents = document.querySelectorAll('.fraction-question');

  parents.forEach((par, i) => {
    const elements = par.querySelectorAll('.fraction-container.multiplication, .fraction-container, .decimal-kit');
    
    if (answer) {
      answer += '&';
    }

    elements.forEach((el) => {

      if (el.classList.contains("fraction-container") && el.classList.contains("multiplication")) {
        const parts = correctAnswer.split('&')[i].split("/");

        // ambil bagian sebelum "*" di sisi atas
        const firstNumerator = parts[0].split("*")[0];

        // ambil bagian sebelum "*" di sisi bawah
        const firstDenominator = parts[1].split("*")[0];
        const nums = el.querySelectorAll("input.number-input");
        if (nums.length === 2) {
          const secondNumerator = nums[0].value.trim() || "";
          const secondDenominator = nums[1].value.trim() || "";
          answer += `${firstNumerator}*${secondNumerator}/${firstDenominator}*${secondDenominator}`;
        }
      }

      // Ambil nilai fraction
      if (el.classList.contains("fraction-container") && !el.classList.contains("multiplication")) {
        const nums = el.querySelectorAll(".number-input");
        if (nums.length === 2) {
          const numerator = nums[0].value.trim() || "";
          const denominator = nums[1].value.trim() || "";
          answer += `${numerator}/${denominator}`;
        }
      }

      // Ambil nilai decimal
      if (el.classList.contains("decimal-kit")) {
        const input = el.querySelector(".number-input.decimal");
        if (input) {
          let val = input.value.trim().replace(".", ",") || "";
          answer += val;
        }
      }

      // === Cek apakah setelah elemen ATAU parent-nya ada <span class="equivalent"> ===
      let parent = el.closest(".optional-frac-result");
      let sibling = parent ? parent.nextElementSibling : el.nextElementSibling;

      if (sibling?.classList.contains("equivalent")) {
        answer += "=";
      }
    });
  });

  const isCorrect = correctAnswer === answer;

  addQuizDetail(stepId, answer, correctAnswer, isCorrect);

  return isCorrect;
}

const orderOfFractionChecking = (detail) => {
  const { mainId, stepId } = detail;

  let correctAnswer = findCorrectAnswer(mainId, stepId);

  const typeChosen = sessionStorage.getItem('typeChosen');

  correctAnswer = (typeChosen === 'Desimal' ? correctAnswer.split('|')[0] : correctAnswer.split('|')[1]).split('=');

  let unrealNumbers = [];
  if (typeChosen === 'Desimal') {
    unrealNumbers = [...document.querySelectorAll('.unreal-number')];
  } else {
    const denominator = document.querySelector('.unreal-number .denominator').textContent;
    const numerators = document.querySelectorAll('.unreal-number .numerator');
    unrealNumbers = `${Array.from(numerators).map(num => num.textContent)}/${denominator}`
  }
 
  const answer = typeChosen === 'Desimal' ? (unrealNumbers.map(el => el.textContent.replace(',', '.'))).join(', ') : unrealNumbers;


  const isCorrect = correctAnswer.includes(answer);

  addQuizDetail(stepId, answer, correctAnswer.join(' = '), isCorrect);
  
  return isCorrect;
}

const denominatorEqualizationChecking = (detail) => {
  const { mainId, stepId } = detail;

  let correctAnswer = findCorrectAnswer(mainId, stepId).split('=');

  const denominator = document.querySelector('input.first-fraction__denominator').value;

  let numerators = document.querySelectorAll('input.first-fraction__numerator');
  numerators = Array.from(numerators).map(node => node.value);

  const answer = `${numerators}/${denominator}`;
  const isCorrect = correctAnswer.includes(answer);

  addQuizDetail(stepId, answer, correctAnswer.join(' = '), isCorrect);

  return isCorrect;
}

const actualRatioChecking = (detail) => {
  const { mainId, stepId } = detail;
  let correctAnswer = findCorrectAnswer(mainId, stepId);

  const inputUser = document.querySelectorAll('.ratio-value');
  const answer = Array.from(inputUser)
    .map(answer => answer.value)
    .join(':');

  const isCorrect = correctAnswer === answer;
  addQuizDetail(stepId, answer, correctAnswer, isCorrect);

  return isCorrect;
}

const simplestRatioChecking = (detail) => {
  const { mainId, stepId } = detail;
  let correctAnswer = findCorrectAnswer(mainId, stepId);

  const fpbInput = document.querySelector('.fpb-input').value;
  const simplestValInput = document.querySelectorAll('.simplest-ratio-input');
  const answer = `${fpbInput}|` +  Array.from(simplestValInput)
    .map(answer => answer.value)
    .join(':');

  const isCorrect = correctAnswer === answer;
  addQuizDetail(stepId, answer, correctAnswer, isCorrect);

  return isCorrect;
}

export { fractionSetQuestionChecking, fractionResultChecking, fractionAbilityToSimplifyChecking, simplestFractionChecking, illustrationChoicesChecking,
mixedFractionChecking, 
multiFractionChecking, fractionToDecimalChecking, decimalComparisonChecking, findCorrectAnswer, fractionComparisonChecking, fractionTypeEquationChecking, fractionTypeOptionPass, fractionEqualizationChecking, orderOfFractionChecking, denominatorEqualizationChecking, actualRatioChecking, simplestRatioChecking
};