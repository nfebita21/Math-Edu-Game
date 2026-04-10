import { actualRatioChecking, decimalComparisonChecking, denominatorEqualizationChecking, fractionAbilityToSimplifyChecking, fractionComparisonChecking, fractionEqualizationChecking, fractionResultChecking, fractionSetQuestionChecking, fractionToDecimalChecking, fractionTypeEquationChecking, fractionTypeOptionPass, illustrationChoicesChecking, mixedFractionChecking, multiFractionChecking, orderOfFractionChecking, simplestFractionChecking, simplestRatioChecking } from "../utils/answerChecker";
import { calcHandler, comparisonSwitch, denominatorEquationInputCheck, denominatorSynchronization, divisorSynchronization, dragAndDropFraction, fractionComparisonSwitch, fractionDecomposition, fractionToggler, initFPBCalculator, inputAnswerSlider, multiChoicesHandler, numberInputValidation, openImageDetail,submitStepHandler } from "../utils/play-handler";
import { isEqualizedDenominator, whichTypeIsChosen, yesOrNo,  yesOrNoStepController } from "../utils/step-controllers";
import { createResultGameGL, fractionAbilityToSimplify, glProgressBar, illustrationChoices, fractionSetQuestion, simplestFractionAnswer, fractionResult, multiplicationFractionForm, mixedFractionConvertion, fractionToMixedConvertion, decimalToFractionConvertion, fractionToDecimalConvertion, decimalComparison, fractionComparison, fractionTypeEquationChecker, fractionTypeOption, fractionTypeEqualization, orderOfFraction, denominatorEqualization, actualValueRatio, simplifyRatioValue } from "../views/templates/template-creator";

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
  fractionToDecimalChecking,
  decimalComparison, comparisonSwitch, decimalComparisonChecking, fractionComparison, fractionComparisonSwitch, fractionComparisonChecking, yesOrNo, yesOrNoStepController, fractionTypeEquationChecker, fractionTypeEquationChecking, fractionTypeOption, fractionTypeOptionPass, fractionTypeEqualization, whichTypeIsChosen, fractionEqualizationChecking, isEqualizedDenominator, orderOfFraction, dragAndDropFraction, orderOfFractionChecking, inputAnswerSlider, denominatorEquationInputCheck, denominatorSynchronization, denominatorEqualization, denominatorEqualizationChecking, actualValueRatio, actualRatioChecking, simplifyRatioValue, divisorSynchronization, simplestRatioChecking, initFPBCalculator }

export default functionMap;