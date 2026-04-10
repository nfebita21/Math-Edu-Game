import DBSource from "../data/db-source";

const buildReviewData = async () => {
  const historyId = sessionStorage.getItem('historyId');
  const getData = await DBSource.getQuizReview(historyId);
  const reviewData = getData.result;
  const rawDetailQuiz = sessionStorage.getItem('detailQuiz');
  const detailQuiz = rawDetailQuiz ? JSON.parse(rawDetailQuiz) : [];
  const grouped = {};
  const result = [];

  reviewData.forEach(item => {
    const {
      main_id: mainId,
      step_id: stepId,
      answer,
      is_correct: isCorrect,
      correction
    } = item;

    if (!grouped[mainId]) {
      grouped[mainId] = {
        mainNum: result.length + 1,
        mainIndex: detailQuiz.main.find(m => m.id === mainId).main_index,
        question: detailQuiz.main.find(m => m.id === mainId)?.question || '',
        answerDetail: [],
      }

      result.push(grouped[mainId]);
    }

    grouped[mainId].answerDetail.push({
      stepNum: grouped[mainId].answerDetail.length + 1,
      stepQuestion: detailQuiz.sub.find(s => s.id === stepId)?.question || '',
      userAnswer: answer,
      isCorrect,
      correction
    });

    
  });
  return result;
}

export default buildReviewData;