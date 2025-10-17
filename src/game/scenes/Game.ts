import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { generate } from "random-words";
import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext.js";

export class Game extends Scene {
    screenWidth: number;
    screenHeight: number;
    texts: { label: string; object: GameObjects.Text; active: number }[] = [];

    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");
    }

    create() {
        this.screenWidth = Number(this.sys.game.config.width);
        this.screenHeight = Number(this.sys.game.config.height);

        this.addText("helloworld");

        this.setupKeyboard();

        this.time.addEvent({
            loop: true,
            delay: 1_500,
            callback: () => this.generateWord(),
        });

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.texts.forEach((_, i) => {
            this.deleteOutboundWord(i);
        });
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

        // label.x = 1024 - label.width - 20;
        object.x = x;

        this.tweens.add({
            targets: object,
            y: this.screenHeight + object.height,
            duration: 40_000,
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
        this.texts.forEach(({ active, label }, i) => {
            if (label[active] === key) {
                active += 1;
                this.texts[i].active += 1;

                const start = label.slice(0, active);
                const end = label.slice(active, label.length);

                if (!start) return;

                this.texts[i].object.text = `[color=red]${start}[/color]${end}`;

                if (active === label.length) {
                    this.destroyText(i);
                }
            }
        });

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

        if (!isVisible) this.destroyText(index);
    }

    destroyText(index: number) {
        this.texts?.[index]?.object.destroy();
        this.texts.splice(index, 1);
    }

    setupKeyboard() {
        this.input?.keyboard?.on("keydown", (event: KeyboardEvent) => {
            const key = event.key;
            const keyCode = event.keyCode;

            if (keyCode >= 65 && keyCode <= 90) {
                console.log("key", key);

                this.updateText(key);
            }
        });
    }
}
