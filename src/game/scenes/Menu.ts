import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Menu extends Scene {
    screenWidth: number;
    screenHeight: number;

    constructor() {
        super("Menu");
    }

    preload() {
        this.load.setPath("assets");
    }

    create() {
        this.screenWidth = Number(this.sys.game.config.width);
        this.screenHeight = Number(this.sys.game.config.height);

        const gameLabel = this.add.text(
            this.screenWidth / 2,
            this.screenHeight / 2 - 250,
            "Typing Mania",
            {
                fontSize: 84,
            },
        );

        gameLabel.x -= gameLabel.width / 2;
        gameLabel.y -= gameLabel.height / 2;

        const start = this.add.text(
            this.screenWidth / 2,
            this.screenHeight / 2,
            "Start",
            {
                fontSize: 64,
            },
        );

        start.x -= start.width / 2;
        start.y -= start.height / 2;

        start.setInteractive({ cursor: "pointer" });
        start.on("pointerdown", () => {
            this.scene.start("Game");
        });

        const score = localStorage.getItem("highscore") || 0;

        const highscore = this.add.text(
            this.screenWidth / 2,
            this.screenHeight / 2 + 250,
            `Highscore : ${score}`,
            {
                fontSize: 64,
            },
        );

        highscore.x -= highscore.width / 2;
        highscore.y -= highscore.height / 2;

        EventBus.emit("current-scene-ready", this);
    }
}
