class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#dbeafe");

    this.add.text(200, 200, "Memory Match Game", {
      fontSize: "40px",
      fill: "#000"
    });

    this.add.text(220, 300, "Press SPACE to Start", {
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

    const values = ["A","A","B","B","C","C","D","D","E","E","F","F"];
    const shuffled = Phaser.Utils.Array.Shuffle(values.slice());

    this.scoreText = this.add.text(20, 20, "Score: 0", {
      fontSize: "24px",
      fill: "#000"
    });

    this.timerText = this.add.text(650, 20, "Time: 60", {
      fontSize: "24px",
      fill: "#000"
    });

    let startX = 170;
    let startY = 120;
    let spacingX = 110;
    let spacingY = 110;

    for (let i = 0; i < shuffled.length; i++) {
      let row = Math.floor(i / 4);
      let col = i % 4;

      let x = startX + col * spacingX;
      let y = startY + row * spacingY;

      let card = this.add.rectangle(x, y, 90, 100, 0x2563eb)
        .setStrokeStyle(3, 0x000000)
        .setInteractive();

      card.value = shuffled[i];
      card.flipped = false;
      card.matched = false;

      card.text = this.add.text(x - 10, y - 20, "?", {
        fontSize: "40px",
        fill: "#fff"
      });

      card.on("pointerdown", () => this.flipCard(card));

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
    if (!this.canClick || card.flipped || card.matched) return;

    card.flipped = true;
    card.fillColor = 0xffffff;
    card.text.setText(card.value);
    card.text.setFill("#000");

    if (!this.firstCard) {
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

      this.firstCard = null;
      this.secondCard = null;
      this.canClick = true;

      if (this.matches === 6) {
        this.scene.start("WinScene", { score: this.score });
      }
    } else {
      this.time.delayedCall(800, () => {
        this.firstCard.flipped = false;
        this.secondCard.flipped = false;

        this.firstCard.fillColor = 0x2563eb;
        this.secondCard.fillColor = 0x2563eb;

        this.firstCard.text.setText("?");
        this.secondCard.text.setText("?");

        this.firstCard.text.setFill("#fff");
        this.secondCard.text.setFill("#fff");

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

    this.add.text(280, 200, "You Win!", {
      fontSize: "48px",
      fill: "#000"
    });

    this.add.text(300, 280, "Score: " + data.score, {
      fontSize: "30px",
      fill: "#000"
    });

    this.add.text(220, 380, "Press R to Restart", {
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

    this.add.text(260, 200, "Game Over", {
      fontSize: "48px",
      fill: "#000"
    });

    this.add.text(300, 280, "Score: " + data.score, {
      fontSize: "30px",
      fill: "#000"
    });

    this.add.text(220, 380, "Press R to Restart", {
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