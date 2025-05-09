class Tutorial {
  constructor(data) {
    this.data = data;
    this.currentSteps = [];
    this.currentStepsIndex = 0;
  }

  start(modul, level, stepId) {
    if (this.data[modul] && this.data[modul][level] && this.data[modul][level][stepId]) {
      // this.currentModul = modul;
      // this.currentLevel = level;
      // this.currentstepId = stepId;

      this.currentSteps = this.data[modul][level][stepId];
      this.currentStepsIndex = 0;
      this.runStep();
    } else {
      console.error(`tutorial ${stepId}tidak ditemukan`);
    }
  }

  runStep() {
    if (this.currentStepsIndex < this.currentSteps.length) {
      let step = this.currentSteps[this.currentStepsIndex];
      step.action(() => this.nextStep());
    }
  }

  nextStep() {
      this.currentStepsIndex++;

      // if (this.currentStepsIndex < this.currentSteps.length) {
        this.runStep();
      // } else {
        // let nextstepId = parseInt(Object.keys(this.data[this.currentModul][this.currentLevel]).find(id => id > this.currentstepId));

        // if (nextstepId) {
          // this.start(this.currentModul, this.currentLevel, nextstepId);
        // } else {
        //   console.log('Tutorial selesai.');
        // }
      // }

  }
}

export default Tutorial;