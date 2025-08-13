const subQuiz = [
  {
    id: 1,
    modulId: 'PD',
    level: 1,
    step: 1,
    question: 'Tuliskan bentuk perkalian yang sesuai untuk menjawab soal di atas!',
    answerTemplateName: 'fractionMultiplication',
    functionHandler: ['numberInputValidation', 'calcHandler', 'fractionToggler',  'submitStepHandler'],
    answerChecker: 'fractionMultiplicationChecking',
    score: 20
  },
  {
    id: 2,
    modulId: 'PD',
    level: 1,
    step: 2,
    question: 'Isilah hasil dari perkalian pecahan tersebut!',
    answerTemplateName: 'resultFractionMultiplication',
    functionHandler: ['numberInputValidation', 'calcHandler', 'submitStepHandler'],
    answerChecker: 'resultFractionMultiplicationChecking',
    score: 20
  },
  {
    id: 3,
    modulId: 'PD',
    level: 1,
    step: 3,
    question: 'Apakah hasil pecahan ini bisa disederhanakan?',
    answerTemplateName: 'fractionAbilityToSimplify',
    functionHandler: ['submitStepHandler'],
    answerChecker: ['fractionAbilityToSimplifyChecking'],
    score: 10
  },
  {
    id: 4,
    modulId: 'PD',
    level: 1,
    step: 3,
    question: 'Manakah bentuk paling sederhana dari pecahan ini?',
    answerTemplateName: 'simplestFractionAnswer',
    functionHandler: ['submitStepHandler'],
    answerChecker: ['simplestFractionChecking'],
    score: 20
  },
  {
    id: 5,
    modulId: 'PD',
    level: 1,
    step: 4,
    question: 'Manakah ilustrasi yang sesuai untuk kasus ini?',
    answerTemplateName: 'illustrationChoices',
    functionHandler: ['openImageDetail', 'submitStepHandler'],
    answerChecker: ['illustrationChoicesChecking'],
    score: 20
  },
];

export default subQuiz;