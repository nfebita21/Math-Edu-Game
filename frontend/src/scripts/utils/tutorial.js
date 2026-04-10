class Tutorial {
  constructor(data) {
    this.data = data;
    this.currentSteps = [];
    this.currentStepsIndex = 0;
  }

  // 🔹 Method baru untuk mengecek apakah data tutorial tersedia
  hasData(cityId, level) {
    return (
      this.data &&
      this.data[cityId] &&
      this.data[cityId][level]
    );
  }

  start(cityId, level, stepId) {
    if (this.hasData(cityId, level)) {
      this.currentSteps = this.data[cityId][level][stepId];
      this.currentStepsIndex = 0;
      this.runStep();
    } else {
      console.error(`Tutorial "${stepId}" tidak ditemukan pada city dengan id "${cityId}" level "${level}".`);
    }
  }

  runStep() {
    if (this.currentStepsIndex < this.currentSteps.length) {
      const step = this.currentSteps[this.currentStepsIndex];
      step.action(() => this.nextStep());
    }
  }

  nextStep() {
    this.currentStepsIndex++;
    this.runStep();
  }
}

export default Tutorial;
