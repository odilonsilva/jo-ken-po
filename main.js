// Obtenha o elemento canvas pelo ID
const canvas = document.getElementById('main-canvas');
const canvasContext = canvas.getContext("2d");
const background = document.getElementById("background");
const bgWall = document.getElementById("bg-wall");
const paper = document.getElementById("paper");
const rock = document.getElementById("rock");
const scissor = document.getElementById("scissor");
const question = document.getElementById("question");
const info = document.getElementById("info");
const crown = document.getElementById("crown");
const clown = document.getElementById("clown");

const fps = 120;
let CANVAS_WIDTH = 600;
let CANVAS_HEIGHT = 600;
let CHAR_POS_Y = 471;
let SCISSOR_POS_X = 260;
let SCISSOR_POS_Y = CHAR_POS_Y;
let ROCK_POS_X = 400;
let ROCK_POS_Y = CHAR_POS_Y;
let PAPER_POS_X = 110;
let PAPER_POS_Y = CHAR_POS_Y;
const CHAR_SIZE = 80;
const GAME_STATUS_STOPPED = 0;
const GAME_STATUS_RUNNING = 1;
const GAME_FONT_COLOR = '#fff';

let images = [];
let mouseX = 0;
let mouseY = 0;
let gameStatus = GAME_STATUS_RUNNING;
let gameInterval = setInterval(gameLoop, 1000 / fps);
let win = 0;
let lost = 0;
let animationSpeed = 0;
let textInfo = null;
let animationReverse = false;
let gameOver = false;
let isMobile = false;
let buttonPosX = 0;
let buttonPosY = 0;
let buttonFullScreenPosX = (CANVAS_WIDTH / 2) - 25;
let buttonFullScreenPosY = 5;
let fullscreen = false;

let computer = {
  images: [
    paper,
    scissor,
    rock,
    question
  ],
  posX: 260,
  posY: 0,
  finalPosY: 125,
  choice: 0,
  showChoice: false
};

let charSelected = {
  img: null,
  index: 0,
  posX: 0,
  posY: CHAR_POS_Y,
  initialPosX: 0,
  initialPosY: 0,
  finalPosX: 260,
  finalPosY: 308
};

initConfig();

document.addEventListener('resize', initConfig);

document.addEventListener('mousemove', function (event) {
  mouseX = event.clientX - (CANVAS_WIDTH + 60);
  mouseY = event.clientY - 10;
});

document.addEventListener('keypress', function (event) {
  // console.log('key', event.key)

  if (event.key == 'p' || event.key == 'P') {
    if (gameStatus == GAME_STATUS_RUNNING) {
      console.log('pause')
      canvasContext.fillStyle = GAME_FONT_COLOR;
      canvasContext.font = "60px arial"
      canvasContext.fillText("Pause", (CANVAS_WIDTH / 2) - 82, (CANVAS_HEIGHT / 2))
      clearInterval(gameInterval)
      gameStatus = GAME_STATUS_STOPPED;
      return;
    }
    gameInterval = setInterval(gameLoop, 1000 / fps);
    gameStatus = GAME_STATUS_RUNNING;
  }
});

document.addEventListener('click', clickHandler);

function gameLoop() {
  canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawBackground();
  if (gameOver) {
    drawEnding();
    // document.getElementById("info").innerHTML = `mouseX: <b>${mouseX}<b> mouseY: <b>${mouseY}<b>`;
    return;
  }

  drawChars();
  drawHUD();
  mouseMoveHandler();

  if (charSelected.img != null)
    drawSelected(animationReverse);

  if (textInfo != null)
    drawResult(textInfo);

  // document.getElementById("info").innerHTML = `mouseX: <b>${mouseX}<b> mouseY: <b>${mouseY}<b>`;
  // console.log('animationSpeed', animationSpeed)
}

function drawHUD() {
  drawText(`You: ${win}`, 15, 30, 30, GAME_FONT_COLOR);
  drawText(`Comp: ${lost}`, CANVAS_WIDTH - 120, 30, 30, GAME_FONT_COLOR);
}

function drawResult(text) {
  drawText(text, (CANVAS_WIDTH / 2) - 82, (CANVAS_HEIGHT / 2) - 20, 60, GAME_FONT_COLOR, 500);
}

function drawSelector(x = 300, y = 169) {
  canvasContext.beginPath();
  canvasContext.arc(x, y, 35, 0, 2 * Math.PI);
  canvasContext.strokeStyle = GAME_FONT_COLOR
  canvasContext.lineWidth = 2;
  canvasContext.stroke();
}

function drawChars() {
  for (i = 0; i < images.length; i++) {
    canvasContext.drawImage(images[i].img, images[i].posX, images[i].posY, CHAR_SIZE, CHAR_SIZE);
  }
  if (charSelected.img != null)
    drawComputerChoice(animationReverse);
}

function drawSelected(reverse = false) {

  if (!reverse && charSelected.posX < charSelected.finalPosX)
    charSelected.posX += animationSpeed;

  if (!reverse && charSelected.posX > charSelected.finalPosX)
    charSelected.posX -= animationSpeed;

  if (!reverse && charSelected.posY > charSelected.finalPosY)
    charSelected.posY -= animationSpeed;

  //reverse
  if (reverse && charSelected.posX >= charSelected.initialPosX)
    charSelected.posX -= animationSpeed;

  if (reverse && charSelected.posX <= charSelected.initialPosX)
    charSelected.posX += animationSpeed;

  if (reverse && charSelected.posY < charSelected.initialPosY)
    charSelected.posY += animationSpeed;

  canvasContext.drawImage(charSelected.img, charSelected.posX, charSelected.posY, CHAR_SIZE, CHAR_SIZE);

  drawText("You", charSelected.posX + 15, charSelected.posY + 100, 20, GAME_FONT_COLOR, 500);
  animationSpeed += 0.1;
}

function drawBackground() {
  canvasContext.drawImage(bgWall, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  canvasContext.drawImage(background, 0, CANVAS_HEIGHT - 225, CANVAS_WIDTH, 222);
}

function loadOptions() {
  images = [
    {
      img: paper,
      name: "paper",
      posX: PAPER_POS_X,
      posY: PAPER_POS_Y
    },
    {
      img: scissor,
      name: "scissor",
      posX: SCISSOR_POS_X,
      posY: SCISSOR_POS_Y
    },
    {
      img: rock,
      name: "rock",
      posX: ROCK_POS_X,
      posY: ROCK_POS_Y
    }
  ];
}

function clickHandler(event) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  console.log(`clicked at: x=${x}; y=${y}`);

  if (charSelected.img == null) {
    if ((x >= PAPER_POS_X && x <= (PAPER_POS_X + CHAR_SIZE)) && (y >= PAPER_POS_Y && y <= (CHAR_POS_Y + CHAR_SIZE))) {
      SetCharSelected(paper, 0, PAPER_POS_X, PAPER_POS_Y)
    }
    else if ((x >= SCISSOR_POS_X && x <= (SCISSOR_POS_X + CHAR_SIZE)) && (y >= SCISSOR_POS_Y && y <= (CHAR_POS_Y + CHAR_SIZE))) {
      SetCharSelected(scissor, 1, SCISSOR_POS_X, SCISSOR_POS_Y)
    }
    else if ((x >= ROCK_POS_X && x <= (ROCK_POS_X + CHAR_SIZE)) && (y >= ROCK_POS_Y && y <= (CHAR_POS_Y + CHAR_SIZE))) {
      SetCharSelected(rock, 2, ROCK_POS_X, ROCK_POS_Y)
    }
  }
  if (((x >= buttonPosX && x <= buttonPosX + 202) && (y >= buttonPosY && y <= buttonPosY + 102)) && gameOver) {
    gameOver = false;
    win = lost = 0;
    reset();
  }

  //fullscreen area whole width at 1 to 50 top pixel
  if (((x >= 1 && x <= CANVAS_WIDTH) && (y >= 1 && y <= 50))) {
    const element = document.documentElement;
    if (!fullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { // Chrome, Safari e Opera
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { // Internet Explorer / Edge
        element.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    fullscreen = !fullscreen;
    setTimeout(() => initConfig(), 50);
  }
}

function mouseMoveHandler() {

  if ((mouseX >= PAPER_POS_X && mouseX <= (PAPER_POS_X + CHAR_SIZE)) && (mouseY >= PAPER_POS_Y && mouseY <= (CHAR_POS_Y + CHAR_SIZE))) {
    drawSelector(PAPER_POS_X + 40, CHAR_POS_Y + 40);
  }
  else if ((mouseX >= SCISSOR_POS_X && mouseX <= (SCISSOR_POS_X + CHAR_SIZE)) && (mouseY >= SCISSOR_POS_Y && mouseY <= (CHAR_POS_Y + CHAR_SIZE))) {
    drawSelector(SCISSOR_POS_X + 40, CHAR_POS_Y + 40);
  }
  else if ((mouseX >= ROCK_POS_X && mouseX <= (ROCK_POS_X + CHAR_SIZE)) && (mouseY >= ROCK_POS_Y && mouseY <= (CHAR_POS_Y + CHAR_SIZE))) {
    drawSelector(ROCK_POS_X + 40, CHAR_POS_Y + 40);
  }

}

function SetCharSelected(img, index, posX, posY) {
  computerTurn();
  animationReverse = false;
  animationSpeed = 0;
  charSelected.img = img;
  charSelected.posX = posX;
  charSelected.posY = posY;
  charSelected.initialPosX = posX;
  charSelected.initialPosY = posY;
  charSelected.index = index;
  images = images.filter((el, idx) => idx != index)
  setTimeout(() => calculateResult(), 1700);
}

function computerTurn() {
  computer.choice = Math.floor(Math.random() * 3);
}

function drawComputerChoice(reverse = false) {
  let imgSelected = computer.showChoice ? computer.images[computer.choice] : computer.images[3];

  if (!reverse && computer.posY < computer.finalPosY) {
    computer.posY += animationSpeed;
    animationSpeed += 1;
  }

  if (reverse && computer.posY >= -80) {
    computer.posY -= animationSpeed;
    animationSpeed += 1;
  }

  canvasContext.drawImage(imgSelected, computer.posX, computer.posY, CHAR_SIZE, CHAR_SIZE);

  drawText("Computer", computer.posX - 5, computer.posY - 10, 20, GAME_FONT_COLOR, 500);
}

function drawEnding() {
  // canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  canvasContext.fillStyle = GAME_FONT_COLOR;
  const midScreen = CANVAS_WIDTH / 2;
  const midScreenY = CANVAS_HEIGHT / 2;
  buttonPosX = midScreen - 100;

  if (win > lost) {
    buttonPosY = isMobile ? midScreenY + 50 : midScreenY + 30;
    drawEndingButton(buttonPosX, buttonPosY, midScreen);

    let crownPosY = isMobile ? midScreenY - 170 : midScreenY - 170;
    canvasContext.drawImage(crown, midScreen - 50, crownPosY, 100, 100);

    let textPosX = isMobile ? 30 : midScreen - (midScreen / 2) + 10;
    let textPosY = midScreenY - 40;
    drawText("Congratulations!", textPosX, textPosY, 40, GAME_FONT_COLOR, 500);

    textPosX = isMobile ? 60 : midScreen - (midScreen / 3) - 10;
    textPosY = midScreenY;
    drawText("You won the hardest battle!", textPosX, textPosY, 20, GAME_FONT_COLOR, 500);
    return;
  }

  let clownPosY = isMobile ? midScreenY - 280 : midScreenY - 200;
  canvasContext.drawImage(clown, midScreen - 70, clownPosY, 146, 200);

  textPosX = isMobile ? midScreen - (midScreen / 2) : midScreen - (midScreen / 3);
  let textPosY = isMobile ? midScreenY - 30 : midScreenY + 60;
  drawText("So sad!", textPosX, textPosY, 60, GAME_FONT_COLOR, 500);

  textPosX = isMobile ? 35 : midScreen - (midScreen / 2);
  textPosY = isMobile ? midScreenY + 10 : midScreen + CHAR_SIZE + 22;
  drawText("I Wish you better lucky next time!", textPosX, textPosY, 20, GAME_FONT_COLOR, 500);

  buttonPosY = isMobile ? midScreenY + 50 : midScreenY + 130;
  drawEndingButton(buttonPosX, buttonPosY, midScreen);
}

function drawEndingButton(buttonPosX, buttonPosY, midScreen) {
  drawRect(buttonPosX, buttonPosY, 202, 102, 3, '#222061', false);
  drawRect(buttonPosX, buttonPosY, 200, 100, 2, '#4B5498');

  let textPosX = isMobile ? midScreen - (midScreen / 2) - 2 : midScreen - (midScreen / 3);
  drawText("Play Again", textPosX, buttonPosY + 64, 40, GAME_FONT_COLOR, 200);

  if ((mouseX >= buttonPosX && mouseX <= buttonPosX + 202) && (mouseY >= buttonPosY && mouseY <= buttonPosY + 102))
    drawRect(buttonPosX, buttonPosY, 202, 102, 2, GAME_FONT_COLOR, false);
}

function drawRect(x, y, width, height, lineWidth, color, filled = true) {
  canvasContext.beginPath();
  canvasContext.lineWidth = lineWidth;
  canvasContext.rect(x, y, width, height);

  if (filled) {
    canvasContext.fillStyle = color;
    canvasContext.fill();
  }
  else {
    canvasContext.strokeStyle = color;
    canvasContext.stroke();
  }
}

function drawText(text, x, y, fontSize, color, maxwidth) {
  canvasContext.fillStyle = color;
  canvasContext.font = `${fontSize}px arial`;
  canvasContext.fillText(text, x, y);
}

function reset() {
  textInfo = null;
  animationSpeed = 0;
  computer.showChoice = false;
  animationReverse = true;

  setTimeout(() => {
    charSelected.img = null
    loadOptions();
  }, 400);
}

function calculateResult() {
  computer.showChoice = true
  if (charSelected.index == computer.choice) {
    textInfo = "Draw";
    lost++;
    win++;
  }
  else if ((charSelected.index == 0 && computer.choice == 1) ||
    (charSelected.index == 1 && computer.choice == 2) ||
    (charSelected.index == 2 && computer.choice == 0)) {
    textInfo = "Defeat";
    lost++;
  }
  else {
    win++;
    textInfo = "Victory";
  }

  if (win >= 10 || lost >= 10) {
    gameOver = true;
    return;
  }
  setTimeout(() => reset(false), 3000);
}

function initConfig() {
  const width = window.outerWidth;
  const height = window.outerHeight;
  const initialSize = 600;
  isMobile = width < 800;

  CANVAS_WIDTH = isMobile ? width : initialSize;
  CANVAS_HEIGHT = isMobile ? height : initialSize;
  canvas.width = isMobile ? width : initialSize;
  canvas.height = isMobile ? height : initialSize;

  const charMidScreen = isMobile ? (width / 2) - (CHAR_SIZE / 2) : 260;
  computer.posX = charMidScreen;
  computer.finalPosY = isMobile ? (height / 3) - (CHAR_SIZE - 20) : 125;
  buttonFullScreenPosX = (CANVAS_WIDTH / 2) - 25;

  charSelected.finalPosX = charMidScreen;
  charSelected.finalPosY = isMobile ? ((height / 2) + (CHAR_SIZE - 20)) : 308;

  CHAR_POS_Y = isMobile ? (height - (CHAR_SIZE * 1.5)) : 471;
  PAPER_POS_Y = SCISSOR_POS_Y = ROCK_POS_Y = CHAR_POS_Y;

  PAPER_POS_X = isMobile ? charMidScreen - (CHAR_SIZE * 1.5) : 110;
  SCISSOR_POS_X = charMidScreen;
  ROCK_POS_X = isMobile ? charMidScreen + (CHAR_SIZE * 1.5) : 400;

  loadOptions();
}