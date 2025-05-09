import quizOption from "../globals/quiz-option";

const findCorrectAnswer = (mainId, step) => {
  const quizOpt = quizOption.find(item => item.mainQuizId === mainId && item.subQuizId === step);
  const correctAnswer = quizOpt.choices.find(opt => opt.isCorrect === true).answer;
  return correctAnswer;
}

const fractionMultiplicationChecking = (detail) => {
  const {mainId, step} = detail;
  let answer = '';
  let firstNum = '';
  let secondNum = '';

  const correctAnswer = findCorrectAnswer(mainId, step);
  
  const firstNumInput = document.querySelector('#firstNum.show');
  firstNum = firstNumInput ? firstNumInput.value : '';

  const firstFractionContainer = document.querySelector('.fraction-container.first.show');
  firstNum = firstFractionContainer ? firstFractionContainer.querySelector('#numerator').value + '/' + firstFractionContainer.querySelector('#denominator').value : firstNum;

  const secondNumInput = document.querySelector('#secondNum.show');
  secondNum = secondNumInput ? secondNumInput.value : '';

  const secondFractionContainer = document.querySelector('.fraction-container.second.show');
  secondNum = secondFractionContainer ? secondFractionContainer.querySelector('#numerator').value + '/' + secondFractionContainer.querySelector('#denominator').value : secondNum;
  
  answer = `${firstNum}*${secondNum}`;
  return answer === correctAnswer;
}

const resultFractionMultiplicationChecking = (detail) => {
  const {mainId, step} = detail;
  const correctAnswer = findCorrectAnswer(mainId, step);
  let numerator = '';
  let denominator = '';

  numerator = document.querySelector('#numerator').value;
  denominator = document.querySelector('#denominator').value;
  const answer = `${numerator}/${denominator}`;
  return correctAnswer === answer;
}

const fractionAbilityToSimplifyChecking = (detail) => {
  const { mainId, step, btnEl } = detail;
  const correctAnswer = findCorrectAnswer(mainId, step);
  const answer = btnEl.querySelector('p').textContent;

  console.log(mainId, step);
  console.log(answer, correctAnswer);
  return answer === correctAnswer;
}

const illustrationChoicesChecking = (detail) => {
  const { mainId, step } = detail;
  const correctAnswer = findCorrectAnswer(mainId, step);
}

export { fractionMultiplicationChecking, resultFractionMultiplicationChecking, fractionAbilityToSimplifyChecking, illustrationChoicesChecking };