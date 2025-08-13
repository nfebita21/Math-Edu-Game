

const showGameResultHeader = (timeline) => {
  const header = document.querySelector('.result-game h1');

  timeline.from(header, {
    opacity: 0,
    scale: 0.5,
    duration: 0.3
  });
}

export { showGameResultHeader };