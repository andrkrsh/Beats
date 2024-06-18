class DrumTrack {
  constructor (audioElement, uiElement) {
    this.ui = uiElement
    this.audio = audioElement
    this.setupListeners()
  }

  /**
   * setup listeners in the UI components bound to this track
   */
  setupListeners () {
    const pads = this.ui.querySelectorAll('.pad')
    for (const pad of pads) {
      pad.addEventListener('click', function() {
        this.classList.toggle('active')
      })
      pad.addEventListener('animationend', function () {
        this.style.animation = ''
      })
    }

    const select = this.ui.querySelector('select')
    // here we use bind() so that in the function "this" points to track
    // instance, and not to the event
    select.addEventListener('change', this.changeSound.bind(this))

    const muteBtn = this.ui.querySelector('.mute')
    muteBtn.addEventListener('click', this.mute.bind(this))
  }

  repeat(step) {
    const bar = this.ui.querySelector(`.b${step}`)
    bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`
    if (bar.classList.contains('active')) {
      this.audio.currentTime = 0
      this.audio.play()
    }
  }

  changeSound(e) {
    const selectionValue = e.target.value
    this.audio.src = selectionValue
  }

  mute(e) {
    e.target.classList.toggle('active')
    if (e.target.classList.contains('active')) {
      this.audio.volume = 0
    } else {
      this.audio.volume = 1
    }
  }
}

class DrumKit {
  constructor() {
    this.playBtn = document.querySelector('.play')
    this.index = 0
    this.bpm = 150
    this.isPlaying = null
    this.tempoSlider = document.querySelector('.tempo-slider')
    this.tracks = []
  }
  repeat() {
    let step = this.index % 8
    for (const track of this.tracks) {
      track.repeat(step)
    }
    this.index++
  }
  start() {
    const interval = (60 / this.bpm) * 1000
    if (!this.isPlaying) {
      this.isPlaying = setInterval(() => {
        this.repeat()
      }, interval)
    } else {
      clearInterval(this.isPlaying)
      this.isPlaying = null
    }
  }
  updateBtn() {
    if (!this.isPlaying) {
      this.playBtn.innerText = 'Play'
      this.playBtn.classList.remove('active')
    } else {
      this.playBtn.innerText = 'Stop'
      this.playBtn.classList.add('active')
    }
  }
  changeTempo(e) {
    const tempoText = document.querySelector('.tempo-nr')
    tempoText.innerText = e.target.value
  }
  updateTempo(e) {
    this.bpm = e.target.value
    const playBtn = document.querySelector('.play')
    clearInterval(this.isPlaying)
    this.isPlaying = null
    if (playBtn.classList.contains('active')) {
      this.start()
    }
  }
}

const drumKit = new DrumKit()
drumKit.tempoSlider.addEventListener('input', function (e) {
  drumKit.changeTempo(e)
})

drumKit.tempoSlider.addEventListener('change', function (e) {
  drumKit.updateTempo(e)
})

drumKit.playBtn.addEventListener('click', function () {
  drumKit.start()
  drumKit.updateBtn()
})

// Create instances of DrumTrack and register them in the DrumKit

const kick = new DrumTrack(
  document.querySelector('.kick-sound'),
  document.querySelector('.kick-track')
)
drumKit.tracks.push(kick)

const snare = new DrumTrack(
  document.querySelector('.snare-sound'),
  document.querySelector('.snare-track')
)
drumKit.tracks.push(snare)

const hihat = new DrumTrack(
  document.querySelector('.hihat-sound'),
  document.querySelector('.hihat-track')
)
drumKit.tracks.push(hihat)
