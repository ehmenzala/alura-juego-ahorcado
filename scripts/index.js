/* ******* Variables ******* */
const d = document;

/* Sections */
const $mainMenu = d.querySelector('.main-menu')
const $insertWordMenu = d.querySelector('.insert-word-menu')
const $hangmanGame = d.querySelector('.hangman-game')

/* Buttons */
const $initGameButton = d.getElementById('init-game-btn')
const $openWordMenu = d.getElementById('add-word-btn')
const $saveWordButton = d.getElementById('save-start-btn')
const $cancelWordButton = d.getElementById('cancel-btn')
const $giveUpButton = d.getElementById('give-up-btn')
const $newGameButton = d.getElementById('new-game-btn')

/* Misc. elements */
const $newWordTextarea = d.getElementById('insert-word-textarea')
const $wordDiscoveringBox = d.querySelector('.word-discovering')
const $usedLetterDiv = d.querySelector('.used-letters')
let $letterDivs
let randomWord

/* Logic */
let isStarted = false
let isGameFinished = false
let foundLetters = []

const WORDS = [
  'notion',
  'frequent',
  'world',
  'html',
  'css',
  'golang',
  'java',
]

/* Canvas */
const canvas = d.getElementById('hang-man-drawing')
const context = canvas.getContext('2d')
let step = 0

const DRAWS = [
  'gallows', 
  'head', 
  'body', 
  'rightHarm', 
  'leftHarm',
  'rightLeg',
  'leftLeg',
  'rightFoot',
  'leftFoot',
]

/* ******* Event Listeners ******* */

d.addEventListener('click', (e) => {
  if (e.target === $openWordMenu) {
    $mainMenu.classList.toggle('hidden')
    $insertWordMenu.classList.toggle('hidden')
  }
  
  if (e.target === $cancelWordButton) {
    $newWordTextarea.value = ''
    $insertWordMenu.classList.toggle('hidden')
    $mainMenu.classList.toggle('hidden')
  }
  
  if (e.target === $saveWordButton) {
    WORDS.push($newWordTextarea.value.toLowerCase())
    $newWordTextarea.value = ''
    $insertWordMenu.classList.toggle('hidden')
    $hangmanGame.classList.toggle('hidden')
    initGame()
  }
  
  if (e.target === $initGameButton) {
    $mainMenu.classList.toggle('hidden')
    $hangmanGame.classList.toggle('hidden')
    initGame()
  }
  
  if (e.target === $giveUpButton) {
    $hangmanGame.classList.toggle('hidden')
    $mainMenu.classList.toggle('hidden')
    resetGame()
  }
  
  if (e.target === $newGameButton) {
    initGame()
  }
})

d.addEventListener('keydown', (e) => {

  let pressedKey = e.key.toLowerCase()
  let letterCounter = 0
  
  if (!(isStarted && pressedKey.match(/^[a-zA-Z]$/g))) {
    return
  }
  
  if (foundLetters.includes(pressedKey)) {
    return
  }

  if ($usedLetterDiv.textContent.includes(pressedKey)) {
    return
  }

  if (isGameFinished) {
    return
  }

  $usedLetterDiv.innerHTML += pressedKey
  
  $letterDivs = d.querySelectorAll('.letter-box>.letter')

  if (randomWord.includes(pressedKey)) {

    foundLetters.push(pressedKey)
    
    const letterIndexes = [...randomWord.matchAll(new RegExp(pressedKey, 'gi'))].map(a => a.index);

    letterIndexes.forEach(letterIndex => {
      $letterDivs[letterIndex].textContent = pressedKey
    })
    
    console.log('Encontraste la letra ' + pressedKey);

    [...randomWord].forEach(letter => {
      if (foundLetters.includes(letter)) {
       letterCounter++ 
      }
    })

    if (letterCounter === randomWord.length) {
      isGameFinished = true
      console.log('Ganaste')
    }

  } else {

    if (isGameFinished) return

    draw(DRAWS[step++])

    if (undefined === DRAWS[step]) {
      isGameFinished = true
      console.log('Perdiste ):')
    }
  }
})

/* ******* Functions ******* */

function clearCanvas() {
  context.clearRect(0, 0, canvas.clientWidth, canvas.height)
}

function draw(part) {
  switch(part) {
    case 'gallows' :
      context.strokeStyle = '#444';
      context.lineWidth = 10; 
      context.beginPath();
      context.moveTo(175, 225);
      context.lineTo(5, 225);
      context.moveTo(40, 225);
      context.lineTo(25, 5);
      context.lineTo(100, 5);
      context.lineTo(100, 25);
      context.stroke();
      break;

    case 'head' :
      context.lineWidth = 5;
      context.beginPath();
      context.arc(100, 50, 25, 0, Math.PI*2, true);
      context.closePath();
      context.stroke();
      break;

    case 'body' :
      context.beginPath();
      context.moveTo(100, 75);
      context.lineTo(100, 140);
      context.stroke();
      break;

    case 'rightHarm' :
      context.beginPath();
      context.moveTo(100, 85);
      context.lineTo(60, 100);
      context.stroke();
      break;

    case 'leftHarm' :
      context.beginPath();
      context.moveTo(100, 85);
      context.lineTo(140, 100);
      context.stroke();
      break;

    case 'rightLeg' :
      context.beginPath();
      context.moveTo(100, 140);
      context.lineTo(80, 190);
      context.stroke();
      break;

    case 'rightFoot' :
      context.beginPath();
        context.moveTo(82, 190);
        context.lineTo(70, 185);
        context.stroke();
      break;

    case 'leftLeg' :
      context.beginPath();
      context.moveTo(100, 140);
      context.lineTo(125, 190);
      context.stroke();
      break;

    case 'leftFoot' :
      context.beginPath();
      context.moveTo(122, 190);
      context.lineTo(135, 185);
      context.stroke();
      break;
  }
}

function initGame() {
  resetGame()
  isStarted = true
  randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
  generateLetterLines(randomWord.length)
  console.log(randomWord)
}

function resetGame() {
  clearCanvas()
  step = 0
  isStarted = false
  isGameFinished = false
  $usedLetterDiv.textContent = ''
  foundLetters = []
}

function generateLetterLines(n) {

  if ($wordDiscoveringBox.hasChildNodes()) {
    $wordDiscoveringBox.innerHTML = ''
  }

  const $fragment = d.createDocumentFragment()

  for (let i = 0; i < n; i++) {
    const $letterBox = d.createElement('div')
    const $line = d.createElement('div')
    const $letter = d.createElement('div')

    $letterBox.classList.add('letter-box')
    $letter.classList.add('letter')
    $line.classList.add('line')

    $letterBox.appendChild($letter)
    $letterBox.appendChild($line)
    $fragment.appendChild($letterBox)
  }

  $wordDiscoveringBox.appendChild($fragment)
}
