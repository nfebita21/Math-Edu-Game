const yesOrNo = () => {
  const stepQuiz = JSON.parse(sessionStorage.getItem('detailQuiz')).sub;
  const mainIndex = sessionStorage.getItem('mainIndex');
   const mainId = JSON.parse(sessionStorage.getItem('detailQuiz')).main[mainIndex].id;
  const stepIndex = Number(sessionStorage.getItem('stepIndex'));
  const previousSubQuizId = stepQuiz[stepIndex - 1].id;
  const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;
  const correctAnswer = options.find(opt => opt.main_quiz_id === mainId && opt.sub_quiz_id === previousSubQuizId && opt.is_correct);
  let currentStep = stepQuiz[stepIndex];
  if (correctAnswer.answer === "Tidak") {
    currentStep = stepQuiz[stepIndex + 1];
  }

  return currentStep;
}

const yesOrNoStepController = (controllerType, correctAnswer, isCorrect) => {
  const correctStepPerQuiz = Number(sessionStorage.getItem('correctStepPerQuiz'));
  if (controllerType === 'correct-counter') {
    if (isCorrect) {
      if (correctAnswer.answer === 'Ya') {
        sessionStorage.setItem('correctStepPerQuiz', correctStepPerQuiz + 0);
        console.log('yaaa')
      } else {
        sessionStorage.setItem('correctStepPerQuiz', correctStepPerQuiz + 1);
      }
    } else {
      const wrongAnswer = Number(sessionStorage.getItem('wrongAnswer'));
      if (correctAnswer.answer === 'Ya') {
        sessionStorage.setItem('wrongAnswer', wrongAnswer + 0);
      } else {
        sessionStorage.setItem('wrongAnswer', wrongAnswer + 1);
      }
    }
  } else if (controllerType === 'progress-bar') {
    const options = (JSON.parse(sessionStorage.getItem('detailQuiz'))).answerChoices;
    const mainIndex = sessionStorage.getItem('mainIndex');
    const stepIndex = sessionStorage.getItem('stepIndex');
    const currentMain = (JSON.parse(sessionStorage.getItem('detailQuiz'))).main[mainIndex];
    const currentStep = (JSON.parse(sessionStorage.getItem('detailQuiz'))).sub[stepIndex];
    const correctAnswer = options.find(opt => opt.main_quiz_id === currentMain.id && opt.sub_quiz_id === currentStep.id && opt.is_correct);

    return correctAnswer.answer === 'Ya';
  }
}

const whichTypeIsChosen = (controllerType, correctAnswer, isCorrect) => {
  const typeChosen = sessionStorage.getItem('typeChosen');
  const stepQuiz = JSON.parse(sessionStorage.getItem('detailQuiz')).sub;
  const stepIndex = Number(sessionStorage.getItem('stepIndex'));
  let currentStep = stepQuiz[stepIndex];
  const stepSplitted = currentStep.question.split('|');

  if (controllerType === 'optional') {
    currentStep.question = typeChosen === 'Desimal' ? stepSplitted[0] : stepSplitted[1];

    return currentStep;
  } else if (controllerType === 'correct-counter') {
    const correctStepPerQuiz = Number(sessionStorage.getItem('correctStepPerQuiz'));
    if (isCorrect) {
      if (typeChosen === 'Pecahan biasa') {
        sessionStorage.setItem('correctStepPerQuiz', correctStepPerQuiz + 0);
      } else {
        sessionStorage.setItem('correctStepPerQuiz', correctStepPerQuiz + 1);
      }
    } else {
      const wrongAnswer = Number(sessionStorage.getItem('wrongAnswer'));
      if (typeChosen === 'Pecahan Biasa') {
        sessionStorage.setItem('wrongAnswer', wrongAnswer + 0);
      } else {
        sessionStorage.setItem('wrongAnswer', wrongAnswer + 1);
      }
    }
  } else if (controllerType === 'progress-bar') return typeChosen === 'Pecahan biasa';
  
  
}

// const fractionTypeOptionCorrectCounter = () => {
//   const correctStepPerQuiz = Number(sessionStorage.getItem('correctStepPerQuiz'));
//   sessionStorage.setItem('correctStepPerQuiz', correctStepPerQuiz + 0);
// }

const correctCounterFractionConverter = () => {

}

const isEqualizedDenominator = () => {
  const stepQuiz = JSON.parse(sessionStorage.getItem('detailQuiz')).sub;
  const stepIndex = Number(sessionStorage.getItem('stepIndex'));
  const typeChosen = sessionStorage.getItem('typeChosen');
  let currentStep = stepQuiz[stepIndex];
  if (typeChosen === "Desimal") {
    currentStep = stepQuiz[stepIndex + 1];
  }

  return currentStep;
}

export {
  yesOrNo,
  yesOrNoStepController, whichTypeIsChosen, isEqualizedDenominator
};