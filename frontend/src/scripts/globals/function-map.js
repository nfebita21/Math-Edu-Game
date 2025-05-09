import { fractionAbilityToSimplifyChecking, fractionMultiplicationChecking, illustrationChoicesChecking, resultFractionMultiplicationChecking } from "../utils/answerChecker";
import { calcHandler, fractionToggler, multiChoicesHandler, numberInputValidation, openImageDetail, submitStepHandler } from "../utils/play-handler";
import { fractionAbilityToSimplify, fractionMultiplication, glProgressBar, illustrationChoices, resultFractionMultiplication } from "../views/templates/template-creator";

const functionMap = {
  fractionMultiplication,
  fractionMultiplicationChecking,
  resultFractionMultiplication,
  resultFractionMultiplicationChecking,
  fractionAbilityToSimplify,
  fractionAbilityToSimplifyChecking,
  numberInputValidation,
  calcHandler,
  fractionToggler,
  submitStepHandler,
  multiChoicesHandler,
  illustrationChoices,
  openImageDetail,
  glProgressBar, 
  illustrationChoicesChecking
}

export default functionMap;