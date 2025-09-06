function isRewardGranted(denominator) {
  return Math.random() < (1 / denominator);
}

export { isRewardGranted }