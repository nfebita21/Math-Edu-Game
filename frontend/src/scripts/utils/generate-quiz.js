import { random } from "gsap";
import DBSource from "../data/db-source";
import mainQuiz from "../globals/main-quiz";
import quizOption from "../globals/quiz-option";
import subQuiz from "../globals/sub-quiz";

const getRandomQuiz = (arrQuiz, count) => {
  const shuffled = [...arrQuiz].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

const generateQuiz = async (modulId, level) => {
  const detailQuiz = {
    main: [],
    sub: null,
    answerChoices: null,
  };

  const getQuiz = await DBSource.quiz(modulId, level);
  const mainQuiz = getQuiz.data;
  const criteriaQuiz = getQuiz.criteria;

  //Tutorial Main Quiz
  const tutorial = mainQuiz.splice(0, 1)[0];
  detailQuiz.main.push(tutorial);

  criteriaQuiz.difficulties.split('|').forEach(lv => {
    const filteredQuiz = mainQuiz.filter(quiz => quiz.difficulty == lv);
    const randomQuiz = getRandomQuiz(filteredQuiz, 1)[0];
    const index = mainQuiz.findIndex(main => main.id === randomQuiz.id);
    if (index !== -1) {
      const [quiz] = mainQuiz.splice(index, 1);
      detailQuiz.main.push(quiz);
    }
  });

  detailQuiz.sub = getQuiz.subQuiz;
  detailQuiz.answerChoices = getQuiz.options;

  // console.log(detailQuiz);

  // getRandomQuiz(
  //   mainQuiz.filter(quiz => quiz.modulId === modulId && quiz.level == level && quiz.difficulty === 1)
  //   .slice(1),
  //   2
  // )
  // .forEach(quiz => detailQuiz.main.push(quiz));

  // getRandomQuiz(
  //   mainQuiz.filter(quiz => quiz.modulId === modulId && quiz.level == level && quiz.difficulty === 2),
  //   2
  // )
  // .forEach(quiz => detailQuiz.main.push(quiz));

  // getRandomQuiz(
  //   mainQuiz.filter(quiz => quiz.modulId === modulId && quiz.level == level && quiz.difficulty === 3),
  //   1
  // )
  // .forEach(quiz => detailQuiz.main.push(quiz));

  // subQuiz.filter(step => step.modulId === modulId && step.level == level).forEach(step => detailQuiz.sub.push(step));

  // quizOption.filter(option => option.modulId === modulId && option.level == level).forEach(opt => detailQuiz.answerChoices.push(opt));

  return detailQuiz;

}

export default generateQuiz;