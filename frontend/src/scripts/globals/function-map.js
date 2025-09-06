import { fractionAbilityToSimplifyChecking, fractionResultChecking, fractionSetQuestionChecking, fractionToDecimalChecking, illustrationChoicesChecking, mixedFractionChecking, multiFractionChecking, simplestFractionChecking } from "../utils/answerChecker";
import { calcHandler, fractionDecomposition, fractionToggler, multiChoicesHandler, numberInputValidation, openImageDetail,submitStepHandler } from "../utils/play-handler";
import { createResultGameGL, fractionAbilityToSimplify, glProgressBar, illustrationChoices, fractionSetQuestion, simplestFractionAnswer, fractionResult, multiplicationFractionForm, mixedFractionConvertion, fractionToMixedConvertion, decimalToFractionConvertion, fractionToDecimalConvertion } from "../views/templates/template-creator";

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
  multiplicationFractionForm,
  mixedFractionConvertion, 
  fractionToMixedConvertion,
  mixedFractionChecking,
  decimalToFractionConvertion,
  multiFractionChecking,
  fractionToDecimalConvertion,
  fractionDecomposition,
  fractionToDecimalChecking
}

export default functionMap;