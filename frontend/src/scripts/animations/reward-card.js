import { gsap } from 'gsap';
import { createSurpriseReward } from '../views/templates/template-creator';

const showRewardCard = (reward) => {
  return new Promise((resolve) => {
    const playWrapper = document.querySelector('.play');
    playWrapper.insertAdjacentHTML('beforeend', createSurpriseReward(reward));
    if (reward.type === 'Advanced') {
      let badgeCards = document.querySelector('.badge-card');
      let badgeCard = badgeCards;
      badgeCard.src = 'red-badge.png';
    }

    const overlay = document.querySelector(".reward-overlay");
    const container = overlay.querySelector(".reward-container");
    const card = overlay.querySelector(".gallery__card");
    const typeEl = overlay.querySelector(".gallery__card .spot-type");
    const closeBtn = overlay.querySelector(".reward-close");

    let type = reward.type === 'Basic' ? 'Normal' : 'Langka';
    typeEl.textContent = `Tipe: ${type}`;

    overlay.classList.remove("hidden");

    // container muncul statis (bisa fade in biar halus)
    gsap.set(container, { opacity: 0 });
    gsap.to(container, { opacity: 1, duration: 0.3 });

    // animasi masuknya kartu dari kanan bawah
    gsap.fromTo(card,
      { x: 200, y: 200, opacity: 0, scale: 0.5 },
      { x: 0, y: 0, opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)",
        onComplete: () => {
          // efek glow sesuai tipe
          if (reward.type === "Basic") { 
            gsap.to('.badge-card', { 
              filter: "drop-shadow(0 0 8px rgba(0, 200, 255, 0.6))", 
              duration: 0.5, 
              yoyo: true, 
              repeat: -1,
              onRepeat: () => {
                console.log("Denyut lagi...");
              }
            }); 
          } else if (reward.type === "Advanced") {   
            gsap.to('.badge-card', { 
              filter: "drop-shadow(0 0 30px rgba(255, 215, 0, .4)) drop-shadow(0 0 80px rgba(255, 255, 0, 0.1))", 
              duration: 0.8, 
              yoyo: true, 
              repeat: -1 
            }); 
          }
        }
      }
    );

    // tombol close
    closeBtn.onclick = () => {
      gsap.to(card, {
        x: 200,
        y: 200,
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          overlay.classList.add("hidden");
          resolve();
        }
      });
    };
  });
}


export default showRewardCard;