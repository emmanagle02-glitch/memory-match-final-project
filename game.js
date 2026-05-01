class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#dbeafe");

    this.add.text(210, 180, "Memory Match Game", {
      fontSize: "42px",
      fill: "#000"
    });

    this.add.text(165, 270, "Find all matching pairs before time runs out!", {
      fontSize: "22px",
      fill: "#000"
    });

    this.add.text(250, 350, "Press SPACE to Start", {
      fontSize: "28px",
      fill: "#1d4ed8"
    });

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("GameScene");
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#dbeafe");

    this.cards = [];
    this.firstCard = null;
    this.secondCard = null;
    this.canClick = true;
    this.score = 0;
    this.matches = 0;
    this.timeLeft = 60;

    const cardValues = ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F"];
    const shuffledValues = Phaser.Utils.Array.Shuffle(cardValues.slice());

    this.add.text(235, 20, "Memory Match Game", {
      fontSize: "34px",
      fill: "#000"
    });

    this.scoreText = this.add.text(30, 30, "Score: 0", {
      fontSize: "24px",
      fill: "#000"
    });

    this.timerText = this.add.text(650, 30, "Time: 60", {
      fontSize: "24px",
      fill: "#000"
    });

    this.messageText = this.add.text(210, 545, "Click two cards to find a match!", {
      fontSize: "22px",
      fill: "#000"
    });

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

      card.text = this.add.text(x - 12, y - 20, "?", {
        fontSize: "40px",
        fill: "#ffffff"
      });

      card.on("pointerdown", () => {
        this.flipCard(card);
      });

      this.cards.push(card);
    }

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft--;
        this.timerText.setText("Time: " + this.timeLeft);

        if (this.timeLeft <= 0) {
          this.scene.start("LoseScene", { score: this.score });
        }
      },
      loop: true
    });
  }

  flipCard(card) {
    if (!this.canClick || card.flipped || card.matched) {
      return;
    }

    card.flipped = true;
    card.fillColor = 0xffffff;
    card.text.setText(card.value);
    card.text.setFill("#000000");

    if (this.firstCard === null) {
      this.firstCard = card;
    } else {
      this.secondCard = card;
      this.canClick = false;
      this.checkMatch();
    }
  }

  checkMatch() {
    if (this.firstCard.value === this.secondCard.value) {
      this.firstCard.matched = true;
      this.secondCard.matched = true;

      this.score += 10;
      this.matches++;

      this.scoreText.setText("Score: " + this.score);
      this.messageText.setText("Match found!");

      this.firstCard = null;
      this.secondCard = null;
      this.canClick = true;

      if (this.matches === 6) {
        this.scene.start("WinScene", { score: this.score, timeLeft: this.timeLeft });
      }
    } else {
      this.messageText.setText("Not a match. Try again!");

      this.time.delayedCall(1000, () => {
        this.firstCard.flipped = false;
        this.secondCard.flipped = false;

        this.firstCard.fillColor = 0x2563eb;
        this.secondCard.fillColor = 0x2563eb;

        this.firstCard.text.setText("?");
        this.secondCard.text.setText("?");

        this.firstCard.text.setFill("#ffffff");
        this.secondCard.text.setFill("#ffffff");

        this.firstCard = null;
        this.secondCard = null;
        this.canClick = true;
      });
    }
  }
}

class WinScene extends Phaser.Scene {
  constructor() {
    super("WinScene");
  }

  create(data) {
    this.cameras.main.setBackgroundColor("#bbf7d0");

    this.add.text(300, 190, "You Win!", {
      fontSize: "48px",
      fill: "#000"
    });

    this.add.text(285, 280, "Score: " + data.score, {
      fontSize: "30px",
      fill: "#000"
    });

    this.add.text(255, 330, "Time Left: " + data.timeLeft, {
      fontSize: "30px",
      fill: "#000"
    });

    this.add.text(220, 420, "Press R to Restart", {
      fontSize: "28px",
      fill: "#166534"
    });

    this.input.keyboard.once("keydown-R", () => {
      this.scene.start("StartScene");
    });
  }
}

class LoseScene extends Phaser.Scene {
  constructor() {
    super("LoseScene");
  }

  create(data) {
    this.cameras.main.setBackgroundColor("#fecaca");

    this.add.text(280, 200, "Game Over", {
      fontSize: "48px",
      fill: "#000"
    });

    this.add.text(300, 290, "Score: " + data.score, {
      fontSize: "30px",
      fill: "#000"
    });

    this.add.text(220, 390, "Press R to Try Again", {
      fontSize: "28px",
      fill: "#991b1b"
    });

    this.input.keyboard.once("keydown-R", () => {
      this.scene.start("StartScene");
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [StartScene, GameScene, WinScene, LoseScene]
};

const game = new Phaser.Game(config);
