const MusicManager = {
  audio: null,
  isPlaying: false,

  init() {
    if (!this.audio) {
      this.audio = document.getElementById("bg-music");
      this.audio.src = "/music/bg-music.mp3";
      this.audio.loop = true;
      this.audio.volume = 0.4;
    }
  },

  play() {
    this.init();

    if (!this.isPlaying) {
      this.isPlaying = true;
      return this.audio.play(); // ⬅️ RETURN promise
    }
  },

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
    }
  }
};

export default MusicManager;