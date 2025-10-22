import { Game as MainGame } from "./scenes/Game";
import { AUTO, Game, Types } from "phaser";
import { Menu } from "./scenes/Menu";

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    scale: {
        mode: Phaser.Scale.EXPAND,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: "game-container",
    backgroundColor: "#028af8",
    scene: [Menu, MainGame],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
