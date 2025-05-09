const subQuiz = [
  {
    id: 1,
    modulId: 'PD',
    level: 1,
    step: 1,
    question: 'Tuliskan bentuk perkalian yang sesuai untuk menjawab soal di atas!',
    answerTemplateName: 'fractionMultiplication',
    functionHandler: ['numberInputValidation', 'calcHandler', 'fractionToggler',  'submitStepHandler'],
    answerChecker: 'fractionMultiplicationChecking'
  },
  {
    id: 2,
    modulId: 'PD',
    level: 1,
    step: 2,
    question: 'Isilah hasil dari perkalian pecahan tersebut!',
    answerTemplateName: 'resultFractionMultiplication',
    functionHandler: ['numberInputValidation', 'calcHandler', 'submitStepHandler'],
    answerChecker: 'resultFractionMultiplicationChecking'
  },
  {
    id: 3,
    modulId: 'PD',
    level: 1,
    step: 3,
    question: 'Menurutmu apakah hasil pecahan itu bisa disederhanakan?',
    answerTemplateName: 'fractionAbilityToSimplify',
    functionHandler: ['submitStepHandler'],
    answerChecker: ['fractionAbilityToSimplifyChecking']
  },
  {
    id: 4,
    modulId: 'PD',
    level: 1,
    step: 4,
    question: 'Sederhanakanlah pecahan tersebut!'
  },
  {
    id: 5,
    modulId: 'PD',
    level: 1,
    step: 5,
    question: 'Manakah ilustrasi di bawah ini yang sesuai untuk hasil pecahan itu?',
    answerTemplateName: 'illustrationChoices',
    functionHandler: ['multiChoicesHandler', 'openImageDetail', 'submitStepHandler'],
    answerChecker: ['illustrationChoicesChecking']
  },
];

export default subQuiz;