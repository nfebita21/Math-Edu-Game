import DBSource from "../data/db-source";

const getRandomCard = (rewardArr) => {
  const shuffled = [...rewardArr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 1);
}

function getAvailableReward(rewards, rewardOwned) {
  const map1 = new Map(rewards.map(item => [item['spot_name'], item]));
  const map2 = new Map(rewardOwned.map(item => [item['spot_name'], item]));

  const unique = [
    ...rewards.filter(item => !map2.has(item['spot_name'])),
    ...rewardOwned.filter(item => !map1.has(item['spot_name']))
  ];

  return unique;
}

const generateCard = async (type) => {
  const cityId = sessionStorage.getItem('cityId');
  const student = JSON.parse(localStorage.getItem('user'));

  const rewards = await DBSource.gallery(cityId);
  const rewardList = rewards.data.filter(spot => spot.type === type);

  const rewardOwned = await DBSource.getStudentGallery(student.id);
  const rewardOwnedList = rewardOwned.result.filter(spot => spot.city_id === cityId && spot.type === type);

  const availableReward = getAvailableReward(rewardList, rewardOwnedList);

  if (availableReward.length === 1) {
    return availableReward[0];
  }

  const reward = getRandomCard(availableReward)[0];
  return reward;
}

export default generateCard;