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

    const fps = 60;
    const CANVAS_WIDTH = 600;
    const CANVAS_HEIGHT = 600;
    const CHAR_POS_Y = 471;
    const SCISSOR_POS_X = 260;
    const SCISSOR_POS_Y = CHAR_POS_Y;
    const ROCK_POS_X = 400;
    const ROCK_POS_Y = CHAR_POS_Y;
    const PAPER_POS_X = 110;
    const PAPER_POS_Y = CHAR_POS_Y;
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
    animationReverse = false;

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

    loadOptions();
    computerTurn();

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
      drawChars();
      drawHUD();
      mouseMoveHandler();

      if (charSelected.img != null)
        drawSelected(animationReverse);

      if (textInfo != null)
        drawResult(textInfo);

      if ((mouseX >= 274 && mouseX <= 327) && (mouseY >= 131 && mouseY <= 200))
        drawSelector();

      document.getElementById("info").innerHTML = `mouseX: <b>${mouseX}<b> mouseY: <b>${mouseY}<b>`;
      // console.log('animationSpeed', animationSpeed)
    }

    function drawHUD() {
      let lostMarginLeft = lost >= 1000 ? 145 : 120;
      canvasContext.fillStyle = GAME_FONT_COLOR;
      canvasContext.font = "30px arial";
      canvasContext.fillText(`Win: ${win}`, 15, 30);
      canvasContext.fillText(`Lost: ${lost}`, CANVAS_WIDTH - lostMarginLeft, 30);
    }

    function drawResult(text) {
      canvasContext.fillStyle = GAME_FONT_COLOR;
      canvasContext.font = "60px arial"
      canvasContext.fillText(text, (CANVAS_WIDTH / 2) - 82, (CANVAS_HEIGHT / 2) - 20)
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

      canvasContext.fillStyle = GAME_FONT_COLOR;
      canvasContext.font = "20px arial";
      canvasContext.fillText(`You`, charSelected.posX + 15, charSelected.posY + 100);
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
          name: "papper",
          src: "images/papper-1.png",
          posX: PAPER_POS_X,
          posY: PAPER_POS_Y
        },
        {
          img: scissor,
          name: "scissor",
          src: "images/scissor-1.png",
          posX: SCISSOR_POS_X,
          posY: SCISSOR_POS_Y
        },
        {
          img: rock,
          name: "rock",
          src: "images/rock-1.png",
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

    function mouseMoveHandler() {

      if ((mouseX >= PAPER_POS_X && mouseX <= (PAPER_POS_X + CHAR_SIZE)) && (mouseY >= PAPER_POS_Y && mouseY <= (CHAR_POS_Y + CHAR_SIZE))) {
        drawSelector(PAPER_POS_X + 40, CHAR_POS_Y + 40);
        canvasContext.fillStyle = GAME_FONT_COLOR;
        canvasContext.font = "14px arial";
        canvasContext.fillText('Paper', PAPER_POS_X, PAPER_POS_Y + CHAR_SIZE + 15);
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

      canvasContext.fillStyle = GAME_FONT_COLOR;
      canvasContext.font = "20px arial";
      canvasContext.fillText(`Computer`, 255, computer.posY - 10);
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

      setTimeout(() => reset(false), 5000);
    }
