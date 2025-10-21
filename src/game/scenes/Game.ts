import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { generate } from "random-words";
import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext.js";

const SCORE_LIFE = 500;
const MAX_LIFE = 7;

export class Game extends Scene {
    life = 5;
    lifeObjects: GameObjects.Image[] = [];

    score = 0;
    scoreLife = SCORE_LIFE;
    scoreObject: GameObjects.Text;

    screenWidth: number;
    screenHeight: number;
    texts: { label: string; object: GameObjects.Text; active: number }[] = [];

    fallspeedMultiply = 1;

    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("life", "/star.png");

        this.load.audio("coin", "/audio/coin.mp3");
        this.load.audio("hurt", "/audio/hurt.mp3");
        this.load.audio("life", "/audio/life.mp3");
        this.load.audio("bg1", "/audio/bg1.mp3");
    }

    create() {
        this.screenWidth = Number(this.sys.game.config.width);
        this.screenHeight = Number(this.sys.game.config.height);

        this.sound.play("bg1", { loop: true, volume: 0.2 });

        // this.addText("helloworld");

        this.add.rectangle(0, 0, this.screenWidth * 2, 200, 0x000000, 0.8);

        this.setupLife();
        this.setupKeyboard();
        this.setupScore();

        this.time.addEvent({
            loop: true,
            delay: 1_500,
            callback: () => this.generateWord(),
        });

        this.time.addEvent({
            loop: true,
            delay: 30_000,
            callback: () => {
                if (this.fallspeedMultiply <= 0.3) return;

                this.fallspeedMultiply -= 0.1;
            },
        });

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.texts.forEach((_, i) => {
            this.deleteOutboundWord(i);
        });
    }

    setupLife() {
        this.lifeObjects.forEach((life) => life.destroy());
        this.lifeObjects = [];

        const ORIGIN = [40, 60];

        // console.log("this.life", this.life);

        for (let i = 0; i < this.life; i++) {
            const life = this.add
                .image(ORIGIN[0], ORIGIN[1], "life")
                .setDisplaySize(50, 50);

            life.x += i * life.width - i * 5;

            this.lifeObjects.push(life);
        }
    }

    getLife(object: GameObjects.Text) {
        if (this.life >= MAX_LIFE) return;

        this.life++;
        this.setupLife();
        this.sound.play("life");
        this.scoreLife += SCORE_LIFE;

        const life = this.add.text(object.x, object.y, "+1 HP", {
            fontSize: 32,
            color: "limegreen",
        });

        this.tweens.add({
            targets: life,
            duration: 1000,
            alpha: 0,
            y: object.y - 20,
        });
    }

    missType() {
        this.life -= 1;
        this.setupLife();

        this.sound.play("hurt");

        setTimeout(() => {
            if (this.life <= 0) this.gameover();
        }, 200);
    }

    setupScore() {
        this.scoreObject = this.add.text(
            this.screenWidth,
            70,
            this.score + "",
            {
                fontSize: 48,
            },
        );

        this.scoreObject.y -= this.scoreObject.y / 2;
        this.scoreObject.x -= this.scoreObject.width + 30;
    }

    generateWord() {
        const text = generate() as string;

        this.addText(text);
    }

    addText(text: string) {
        const object = new BBCodeText(this, 0, 110, text, {
            fontSize: 32,
        });

        this.add.existing(object);

        const x = Math.floor(
            Math.random() * (this.screenWidth - object.width - 20) + 20,
        );

        object.x = x;

        this.tweens.add({
            targets: object,
            y: this.screenHeight + object.height,
            duration: 40_000 * this.fallspeedMultiply,
        });

        this.texts.push({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            object,
            active: 0,
            label: text,
        });
    }

    updateText(key: string) {
        let isMiss = false;

        for (let i = 0; i < this.texts?.length; i++) {
            let { active } = this.texts[i];
            const { label } = this.texts[i];

            if (label[active] !== key) {
                isMiss = true;
                continue;
            }

            isMiss = false;
            active += 1;
            this.texts[i].active += 1;

            const start = label.slice(0, active);
            const end = label.slice(active, label.length);

            if (!start) continue;

            this.texts[i].object.text = `[color=red]${start}[/color]${end}`;

            if (active === label.length) {
                this.getScore(label, this.texts[i].object);
                this.destroyText(i);
            }

            break;
        }

        if (isMiss) this.missType();

        // console.log("text", this.texts);
    }

    deleteOutboundWord(index: number) {
        const camera = this.cameras.main;

        const object = this.texts?.[index]?.object;

        if (!object) return;

        const textBounds = object.getBounds();

        const isVisible = Phaser.Geom.Rectangle.Overlaps(
            textBounds,
            camera.worldView,
        );

        if (!isVisible) {
            this.missType();
            this.destroyText(index);
        }
    }

    destroyText(index: number) {
        this.texts?.[index]?.object.destroy();
        this.texts.splice(index, 1);
    }

    getScore(text: string, object: GameObjects.Text) {
        this.score += Math.floor(
            text.length * (1 + this.fallspeedMultiply * 2),
        );
        this.scoreObject.text = this.score + "";
        this.scoreObject.x = this.screenWidth - this.scoreObject.width - 30;

        this.sound.play("coin");

        if (this.score >= this.scoreLife) {
            this.getLife(object);
        }
    }

    setupKeyboard() {
        this.input?.keyboard?.on("keydown", (event: KeyboardEvent) => {
            const key = event.key;
            const keyCode = event.keyCode;

            // console.log("key", key);

            if (keyCode >= 65 && keyCode <= 90) {
                this.updateText(key);
            }

            if (key === "Escape") {
                if (this.game.loop.running) this.game.loop.sleep();
                else this.game.loop.wake();
            }
        });
    }

    gameover() {
        this.texts = [];
        this.sound.stopAll();

        this.add.rectangle(
            0,
            0,
            this.screenWidth * 2,
            this.screenHeight * 2,
            0x000000,
            0.4,
        );

        const gameover = this.add.text(
            this.screenWidth / 2,
            this.screenHeight / 2,
            "Game Over",
            {
                fontSize: 64,
            },
        );

        gameover.x -= gameover.width / 2;
        gameover.y -= gameover.height / 2;

        const score = this.add.text(
            this.screenWidth / 2,
            this.screenHeight / 2,
            this.score + "",
            {
                fontSize: 64,
            },
        );

        score.x -= score.width / 2;
        score.y -= score.height / 2 + 120;

        const highscore = localStorage.getItem("highscore") || 0;

        if (this.score > Number(highscore)) {
            localStorage.setItem("highscore", this.score + "");
        }

        const restart = this.add.text(
            this.screenWidth / 2,
            this.screenHeight / 2,
            "Restart",
            {
                fontSize: 32,
                padding: { x: 16, y: 4 },
                backgroundColor: "deepskyblue",
            },
        );

        restart.setInteractive({ cursor: "pointer" });
        restart.x -= restart.width / 2;
        restart.y -= restart.height / 2 - 120;
        restart.on("pointerdown", () => {
            this.restart();
        });

        setTimeout(() => {
            this.game.loop.sleep();
        }, 20);
    }

    restart() {
        this.life = 5;
        this.lifeObjects = [];

        this.score = 0;
        this.scoreLife = SCORE_LIFE;

        this.fallspeedMultiply = 1;

        this.texts = [];

        this.scene.restart();
        this.game.loop.wake();

        this.sound.stopAll();
        this.sound.play("bg1", { volume: 0.2, loop: true });
    }
}
