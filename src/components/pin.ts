import * as PIXI from "pixi.js";

/**
 * Class Pin represents a pin on the board.
 */
class Pin {
    x: number;
    y: number;
    anchor: number;
    width: number;
    height: number;
    radius: number;
    pinBall: PIXI.Sprite | null;

    /**
     * Creates an instance of Pin.
     *
     * @param x The x position
     * @param y The y position
     * @param anchor The anchor position
     * @param width The width of the pin
     * @param height The height of the pin
     * @param radius The radius of the pin
     */
    constructor(x: number, y: number, anchor: number, width: number, height: number, radius: number) {
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.pinBall = null;
    }

    /**
     * Creates a new pin.
     *
     * @returns A new PIXI.Sprite representing the pin.
     */
    create(): PIXI.Sprite {
        const pin = PIXI.Sprite.from("./images/circle.png");
        pin.anchor.set(this.anchor);
        pin.x = this.x;
        pin.y = this.y;
        pin.width = this.width;
        pin.height = this.height;

        this.pinBall = pin;

        return pin;
    }
}

export default Pin;
