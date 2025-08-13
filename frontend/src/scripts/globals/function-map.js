import { fractionAbilityToSimplifyChecking, fractionResultChecking, fractionSetQuestionChecking, illustrationChoicesChecking, simplestFractionChecking } from "../utils/answerChecker";
import { calcHandler, fractionToggler, multiChoicesHandler, numberInputValidation, openImageDetail, submitStepHandler } from "../utils/play-handler";
import { createResultGameGL, fractionAbilityToSimplify, glProgressBar, illustrationChoices, fractionSetQuestion, simplestFractionAnswer, fractionResult, multiplicationFractionForm } from "../views/templates/template-creator";

const functionMap = {
  fractionSetQuestion,
  fractionSetQuestionChecking,
  fractionResult,
  fractionResultChecking,
  fractionAbilityToSimplify,
  fractionAbilityToSimplifyChecking,
  numberInputValidation,
  calcHandler,
  fractionToggler,
  submitStepHandler,
  multiChoicesHandler,
  simplestFractionAnswer,
  illustrationChoices,
  openImageDetail,
  glProgressBar, 
  illustrationChoicesChecking,
  simplestFractionChecking,
  createResultGameGL,
  multiplicationFractionForm
}

export default functionMap;