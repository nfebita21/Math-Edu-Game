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
  console.log(answer, correctAnswer)
  return answer === correctAnswer || answer === reversedAnswer;
}

const fractionResultChecking = (detail) => {
  const {mainId, stepId} = detail;
  const correctAnswer = findCorrectAnswer(mainId, stepId);
  let numerator = '';
  let denominator = '';

  numerator = document.querySelector('#numerator').value;
  denominator = document.querySelector('#denominator').value;
  const answer = `${numerator}/${denominator}`;
  return correctAnswer === answer;
}

const fractionAbilityToSimplifyChecking = (detail) => {
  const { mainId, stepId, btnEl } = detail;
  const correctAnswer = findCorrectAnswer(mainId, stepId);
  const answer = btnEl.querySelector('p').textContent;

  return answer === correctAnswer;
}

const simplestFractionChecking = (detail) => {
  const { mainId, stepId, btnEl } = detail;
  const correctAnswer = findCorrectAnswer(mainId, stepId);
  console.log(correctAnswer)

  if (correctAnswer.includes('/')) {
    const fractionSplitted = correctAnswer.split('/');
    const correctNumerator = fractionSplitted[0];
    const correctDenominator = fractionSplitted[1];

    const numerator = btnEl.querySelector('.answer-choices .numerator').textContent;
    const denominator = btnEl.querySelector('.answer-choices .denominator').textContent;

    console.log(numerator, denominator)

    return correctNumerator === numerator && correctDenominator === denominator;
  } else {
    const answer = btnEl.querySelector('p').textContent;
    return answer === correctAnswer;
  }
  
}

const illustrationChoicesChecking = (detail) => {
  const { mainId, stepId, btnEl } = detail;
  let correctAnswer = findCorrectAnswer(mainId, stepId);

  const answerImg = btnEl.querySelector('.illustration');
  const answer = answerImg.getAttribute('src').split('./illustrations-quiz/')[1];
  console.log(correctAnswer, answer);

  return answer === correctAnswer;
}

export { fractionSetQuestionChecking, fractionResultChecking, fractionAbilityToSimplifyChecking, simplestFractionChecking, illustrationChoicesChecking };