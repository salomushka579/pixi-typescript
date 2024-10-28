import * as PIXI from "pixi.js";

/**
 * Class Slot represents a slot on the board.
 */
class Slot {
    x: number;
    y: number;
    anchor: number;
    width: number;
    height: number;
    cost: number;
    _color: string;
    radius: number;
    slot: { y: number } | PIXI.Sprite;

    /**
     * Creates an instance of Slot.
     *
     * @param x The x position
     * @param y The y position
     * @param anchor The anchor position
     * @param width The width of the slot
     * @param height The height of the slot
     * @param cost The slot cost
     * @param color The color of the slot
     */
    constructor(x: number, y: number, anchor: number, width: number, height: number, cost: number, color: string) {
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.width = width;
        this.height = height;
        this.cost = cost;
        this._color = color;
        this.radius = 0;
        this.slot = { y: this.y };
    }

    /**
     * Creates a new slot.
     *
     * @returns A new PIXI.Sprite representing the slot.
     */
    create(): PIXI.Sprite {
        const slot = PIXI.Sprite.from(`./images/${this._color}-${this.cost}.png`);
        slot.anchor.set(this.anchor);
        slot.x = this.x;
        slot.y = this.y;
        slot.width = this.width;
        slot.height = this.height;
        this.slot = slot;

        return slot;
    }
}

export default Slot;
