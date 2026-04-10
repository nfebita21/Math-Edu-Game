import { gsap } from 'gsap';

const showGameResultHeader = (timeline) => {
  const header = document.querySelector('.result-game h1');

  timeline.from(header, {
    opacity: 0,
    scale: 0.5,
    duration: 0.3
  });
}

const highlightDifferentPrime = () => {
  gsap.to(".prime-num", {
    backgroundColor: "#e6d4f5",
    duration: 0.3,
    ease: "power2.out", 
    stagger: 0.6
  });
}

export { showGameResultHeader, highlightDifferentPrime };