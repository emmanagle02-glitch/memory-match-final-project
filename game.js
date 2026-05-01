const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#dbeafe',
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

let cards = [];
let firstCard = null;
let secondCard = null;
let canClick = true;
let score = 0;
let matches = 0;
let scoreText;
let messageText;

const cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F'];

function preload() {
}

function create() {
  this.add.text(250, 30, 'Memory Match Game', {
    fontSize: '36px',
    fill: '#000'
  });

  scoreText = this.add.text(30, 30, 'Score: 0', {
    fontSize: '24px',
    fill: '#000'
  });

  messageText = this.add.text(230, 540, 'Click two cards to find a match!', {
    fontSize: '22px',
    fill: '#000'
  });

  let shuffledValues = Phaser.Utils.Array.Shuffle(cardValues.slice());

  let startX = 170;
  let startY = 130;
  let spacingX = 115;
  let spacingY = 120;

  for (let i = 0; i < shuffledValues.length; i++) {
    let row = Math.floor(i / 4);
    let col = i % 4;

    let x = startX + col * spacingX;
    let y = startY + row * spacingY;

    let card = this.add.rectangle(x, y, 90, 100, 0x2563eb);
    card.setStrokeStyle(4, 0x000000);
    card.setInteractive();

    card.value = shuffledValues[i];
    card.flipped = false;
    card.matched = false;

    card.text = this.add.text(x - 10, y - 18, '?', {
      fontSize: '40px',
      fill: '#ffffff'
    });

    card.on('pointerdown', () => {
      flipCard(card);
    });

    cards.push(card);
  }
}

function flipCard(card) {
  if (!canClick || card.flipped || card.matched) {
    return;
  }

  card.flipped = true;
  card.fillColor = 0xffffff;
  card.text.setText(card.value);
  card.text.setFill('#000000');

  if (firstCard === null) {
    firstCard = card;
  } else {
    secondCard = card;
    canClick = false;
    checkMatch();
  }
}

function checkMatch() {
  if (firstCard.value === secondCard.value) {
    firstCard.matched = true;
    secondCard.matched = true;

    score += 10;
    matches++;

    scoreText.setText('Score: ' + score);
    messageText.setText('Match found!');

    firstCard = null;
    secondCard = null;
    canClick = true;

    if (matches === 6) {
      messageText.setText('You won! All matches found!');
    }
  } else {
    messageText.setText('Not a match. Try again!');

    setTimeout(() => {
      firstCard.flipped = false;
      secondCard.flipped = false;

      firstCard.fillColor = 0x2563eb;
      secondCard.fillColor = 0x2563eb;

      firstCard.text.setText('?');
      secondCard.text.setText('?');

      firstCard.text.setFill('#ffffff');
      secondCard.text.setFill('#ffffff');

      firstCard = null;
      secondCard = null;
      canClick = true;
    }, 1000);
  }
}