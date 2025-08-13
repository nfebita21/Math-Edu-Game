import { createFingerPointer } from "../views/templates/template-creator";

const TutorialHandler = [
    {
      name: 'fractionMultiplication',
      show: (result) => {
        const numerator = result.split('/')[0];
        const denominator = result.split('/')[1].split('*')[0];
        const secondNum = result.split('*')[1];

        let currentStep = 0;
        
        const tutorSteps = [
          '.number-buttons button.btn-fraction',
          ...numerator.split('').map(num => num),
          '.first-fraction__denominator',
          ...denominator.split('').map(num => num),
          '.second-number',
          ...secondNum.split('').map(num => num),
          '.btn-submit-result'
        ];

        const handleClick = (e) => {
          if (tutorSteps[currentStep].startsWith('.')) {
            console.log(tutorSteps[currentStep], e.target)
            if (e.target.matches(tutorSteps[currentStep])) {
              currentStep++;

              if (currentStep < tutorSteps.length) {
                pointElement(tutorSteps[currentStep]);
              } else {
                document.removeEventListener('mousedown', handleClick);
              }
            } else {
              console.log("Tombol ini belum bisa diklik!");
              // e.stopPropagation();
              return;
            }
          } else {
            const clickedButton = e.target.textContent.trim();
            if (clickedButton === tutorSteps[currentStep]) {
              console.log('good')
              currentStep++;

              if (currentStep < tutorSteps.length) {
                console.log('bisa')
                pointElement(tutorSteps[currentStep]);
              } else {
                document.removeEventListener('click', handleClick);
              }
            }
          }
        }

        pointElement(tutorSteps[currentStep]);

        document.addEventListener('mousedown', handleClick);
           
      }
  },
  {
    name: 'resultFractionMultiplication',
    show: (result) => {
      const numerator = result.split('/')[0];
      const denominator = result.split('/')[1];

      let currentStep = 0;
        
      const tutorSteps = [
        ...numerator.split('').map(num => num),
        '.first-fraction__denominator',
        ...denominator.split('').map(num => num),
        '.btn-submit-result'
      ];
      console.log(tutorSteps[currentStep])

      const handleClick = (e) => {
        if (tutorSteps[currentStep].startsWith('.')) {
          if (e.target.matches(tutorSteps[currentStep])) {
            currentStep++;

            if (currentStep < tutorSteps.length) {
              pointElement(tutorSteps[currentStep]);
            } else {
              document.removeEventListener('mousedown', handleClick);
            }
          } else {
            console.log("Tombol ini belum bisa diklik!");
            return;
          }
        } else {
          const clickedButton = e.target.textContent.trim();
          if (clickedButton === tutorSteps[currentStep]) {
            currentStep++;

            if (currentStep < tutorSteps.length) {
              pointElement(tutorSteps[currentStep]);
            } else {
              document.removeEventListener('click', handleClick);
            }
          }
        }
      }

      pointElement(tutorSteps[currentStep]);

      document.addEventListener('mousedown', handleClick);
    }
  },
  {
    name: 'fractionAbilityToSimplify',
    show: (result) => {
      const btnChoices = document.querySelectorAll('.answer-choices button');
      console.log(btnChoices);
      let correctButton;
      Array.from(btnChoices).forEach(btn => {
        const text = btn.querySelector('p');
        if (text.textContent === result) {
          correctButton = `.answer-choices button.${btn.classList}`;
        }
      });
      pointElement(correctButton);
    }
  }
];

const pointElement = (marker) => {
  const pointer = document.querySelector('.finger-container');
  if(pointer) {
    pointer.remove();
  }

  let hintButton;

  if (marker.startsWith('.')) {
    hintButton = document.querySelector(marker);

    hintButton.innerHTML += createFingerPointer();

    return;
  }

  const buttons = document.querySelectorAll('.number-buttons button');
  

  hintButton = Array.from(buttons).find(btn => btn.textContent === marker)

  hintButton.innerHTML += createFingerPointer();
}

export default TutorialHandler;