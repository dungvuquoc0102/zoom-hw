const player = {
  NEXT: 1,
  PREV: -1,
  _playlistElement: document.querySelector(".playlist"),
  _togglePlayElement: document.querySelector(".btn-toggle-play"),
  _playingTitleElement: document.querySelector(".playing-title"),
  _audioElement: document.querySelector("#audio"),
  _playIconElement: document.querySelector(".play-icon"),
  _prevElement: document.querySelector(".btn-prev"),
  _nextElement: document.querySelector(".btn-next"),
  _loopElement: document.querySelector(".btn-repeat"),
  _randomElement: document.querySelector(".btn-random"),
  _progressElement: document.querySelector("#progress"),
  _songs: [
    {
      id: 1,
      name: "Mất kết nối",
      singer: "Dương Domic",
      path: "./songs/MatKetNoi-DuongDomic-16783113.mp3",
    },
    {
      id: 2,
      name: "Tràn bộ nhớ",
      singer: "Dương Domic",
      path: "./songs/TranBoNho-DuongDomic-16783111.mp3",
    },
  ],
  _currentIndex: 0,
  _isPlaying: false,
  _isLoop: localStorage.getItem("loop") === "true",
  _isRandom: localStorage.getItem("random") === "true",
  start() {
    this._render();
    this._handlePlayback();

    //DOM events
    this._togglePlayElement.onclick = this._handleControl.bind(this);
    this._audioElement.onplay = () => {
      this._isPlaying = true;
      this._playIconElement.classList.remove("fa-play");
      this._playIconElement.classList.add("fa-pause");
    };
    this._audioElement.onpause = () => {
      this._isPlaying = false;
      this._playIconElement.classList.add("fa-play");
      this._playIconElement.classList.remove("fa-pause");
    };
    this._nextElement.onclick = this._handlePrevOrNext.bind(this, 1);
    this._prevElement.onclick = this._handlePrevOrNext.bind(this, -1);
    this._loopElement.onclick = () => {
      this._isLoop = !this._isLoop;
      this._setLoopState();
      localStorage.setItem("loop", this._isLoop);
    };
    this._randomElement.onclick = () => {
      this._isRandom = !this._isRandom;
      this._setRandomState();
      localStorage.setItem("random", this._isRandom);
    };
    this._audioElement.ontimeupdate = () => {
      if (this._progressElement.seeking) return;
      const progress =
        (this._audioElement.currentTime / this._audioElement.duration) * 100;
      this._progressElement.value = progress || 0;
    };
    this._progressElement.onmousedown = () => {
      this._progressElement.seeking = true;
    };
    this._progressElement.onmouseup = () => {
      const nextStep =
        (+this._progressElement.value / 100) * this._audioElement.duration;
      this._audioElement.currentTime = nextStep;
      this._progressElement.seeking = false;
    };
    this._audioElement.onended = () => {
      //audio default pause when end
      this._isPlaying = true;
      this._handlePrevOrNext(this.NEXT);
    };
  },
  _handlePrevOrNext(step) {
    this._isPlaying = true; //force
    const shouldPrev = this._audioElement.currentTime <= 2;
    if (step === this.PREV && shouldPrev) {
      this._audioElement.currentTime = 0;
    }

    if (this._isRandom) {
      this._currentIndex = this._getRandomIndex();
    } else {
      this._currentIndex += step;
    }
    this._handleForNewIndex();
  },
  _getRandomIndex() {
    if (this._songs.length === 1) return this._currentIndex;
    let randIndex = null;
    do {
      randIndex = Math.floor(Math.random() * this._songs.length);
    } while (randIndex === this._currentIndex);
    return randIndex;
  },
  _handleForNewIndex() {
    this._currentIndex =
      (this._currentIndex + this._songs.length) % this._songs.length;
    this._handlePlayback();
    this._render();
  },
  _setLoopState() {
    this._audioElement.loop = this._isLoop;
    this._loopElement.classList.toggle("active", this._isLoop);
  },
  _setRandomState() {
    this._randomElement.classList.toggle("active", this._isRandom);
  },
  _handlePlayback() {
    const currentSong = this._getCurrentSong();
    this._playingTitleElement.innerText = currentSong.name;
    this._audioElement.src = currentSong.path;
    this._setLoopState();
    this._setRandomState();
    this._audioElement.oncanplay = () => {
      if (this._isPlaying) {
        this._audioElement.play();
      }
    };
  },
  _getCurrentSong() {
    return this._songs[this._currentIndex];
  },
  _handleControl() {
    if (this._audioElement.paused) {
      this._audioElement.play();
    } else {
      this._audioElement.pause();
    }
  },
  _render() {
    const html = this._songs
      .map((song, index) => {
        return `
      <div class="song ${index === this._currentIndex ? "active" : ""}">
          <div
            class="thumb"
            style="
              background-image: url('https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg');
            "
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `;
      })
      .join("");
    this._playlistElement.innerHTML = html;
  },
};

player.start();

j = 20;
