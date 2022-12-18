class PianoKeyboard extends HTMLElement {
  constructor(){
    super()
    this.fetch('piano.json')
    this.fetchSVG('piano.svg')
    this.listen()
  }

  play(id){
    if(!this.audioContext){
      this.audioContext = new AudioContext()
    }
    let note = this.notes.find(note => note.note == id)
    let oscillator = this.audioContext.createOscillator()
    oscillator.frequency.setValueAtTime(note.frequency, this.audioContext.currentTime); // value in hertz
    oscillator.connect(this.audioContext.destination)
    oscillator.start()
    return oscillator
  }

  async fetchSVG(){
    let response = await fetch('piano.svg')
    let svg = await response.text()    
    this.innerHTML = svg
  }

  async fetch(url){
    let response = await fetch(url)
    let data = await response.json()
    this.data = data
  }

  connectedCallback(){

  }

  static get observedAttributes(){
    return ["src"]
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == "src"){
      this.fetch(newValue)
    }
  }

  set data(piano){
    this.notes = piano.notes
    this.render()
  }

  get data(){
    return this.notes
  }

  render(){

  }

  get keyMap(){
    return {
      'z': 'C',
      's': 'Db',
      'x': 'D',
      'd': 'Eb',
      'c': 'E',
      'c': 'F',
      'g': 'Gb',
      'b': 'G',
      'h': 'Ab',
      'n': 'A',
      'j': 'Bb',
      'm': 'B',
    }
  }
  listen(){
    this.addEventListener('mousedown', mousedownEvent => {
      if(mousedownEvent.target.matches('.key')){
        let key = mousedownEvent.target
        let id = mousedownEvent.target.id + '4'
        let oscillator = this.play(id)

        key.addEventListener("mouseup", mouseupEvent => {
          oscillator.stop()
        }, {once: true})
      }
    })

    addEventListener('keydown', keydownEvent => {
      let key = keydownEvent.key
      key = this.keyMap[key]

      let id = key + '4'
      let oscillator = this.play(id)
      addEventListener("keyup", keyupEvent => {
        oscillator.stop()
      }, {once: true})
    })

  }
}

export {PianoKeyboard}
customElements.define('piano-keyboard', PianoKeyboard)
