import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { generate } from "random-words";
import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext.js";

export class Game extends Scene {
    life = 5;
    lifeObjects: GameObjects.Image[] = [];

    score = 0;
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
    }

    create() {
        this.screenWidth = Number(this.sys.game.config.width);
        this.screenHeight = Number(this.sys.game.config.height);

        // this.addText("helloworld");

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

        const ORIGIN = [50, 70];

        // console.log("this.life", this.life);

        for (let i = 0; i < this.life; i++) {
            const life = this.add.image(ORIGIN[0], ORIGIN[1], "life");

            life.x += i * life.width + i * 20;

            this.lifeObjects.push(life);
        }
    }

    missType() {
        this.life -= 1;
        this.setupLife();

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
                fontSize: 64,
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
        const object = new BBCodeText(this, 0, 0, text, {
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
                this.getScore(label);
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

    getScore(text: string) {
        this.score += Math.floor(
            text.length * (1 + this.fallspeedMultiply * 2),
        );
        this.scoreObject.text = this.score + "";
        this.scoreObject.x = this.screenWidth - this.scoreObject.width - 30;
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
        this.add.rectangle(
            0,
            0,
            this.screenWidth * 2,
            this.screenHeight * 2,
            0x000000,
            0.2,
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
        this.texts = [];
        this.scene.restart();
        this.game.loop.wake();
    }
}
