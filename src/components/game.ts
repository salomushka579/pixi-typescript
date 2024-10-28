import * as PIXI from "pixi.js";
import { roundFloat } from "../utils/helpers";

// Extend PIXI.Sprite to include additional properties
interface FallingBallSprite extends PIXI.Sprite {
    vx: number;
    vy: number;
}

/**
 * Class Game for playing
 */
class Game {
    beginning: { x: number, y: number };
    app: PIXI.Application;
    fraction: number;
    pins: { x: number, y: number, radius: number }[];
    slots: { x: number, y: number, width: number, cost: number, slot: { y: number } }[];
    colorCurrent: any;
    fallingBall: FallingBallSprite;
    cost_scored: number;
    bet: number;
    slotCost: number;
    top_bounce: number;
    side_bounce: number;
    points: number;

    constructor(
        beginning: { x: number, y: number },
        app: PIXI.Application,
        fraction: number,
        pins: { x: number, y: number, radius: number }[],
        slots: { x: number, y: number, width: number, cost: number, slot: { y: number } }[],
        bet: number,
        top_bounce: number,
        side_bounce: number,
        colorCurrent: string,
        points: number
    ) {
        this.beginning = beginning;
        this.app = app;
        this.fraction = fraction;
        this.pins = pins;
        this.slots = slots;
        this.colorCurrent = colorCurrent;
        this.fallingBall = PIXI.Sprite.from(`./images/${this.colorCurrent}-ball.png`) as FallingBallSprite;
        this.cost_scored = 0;
        this.bet = bet;
        this.slotCost = 0;
        this.top_bounce = top_bounce;
        this.side_bounce = side_bounce;
        this.points = points;

        // Initialize custom properties
        this.fallingBall.vx = 0;
        this.fallingBall.vy = 0;
    }

    start(): void {
        this.fallingBall.x = this.beginning.x + (5 * this.fraction);
        this.fallingBall.y = this.beginning.y;
        this.fallingBall.width = 47 * this.fraction;
        this.fallingBall.height = 47 * this.fraction;
        this.app.stage.addChild(this.fallingBall);

        let last_pin: { x: number, y: number, radius: number } | undefined = undefined;
        let randomTurn = Math.floor(Math.random() * 2);

        this.app.ticker.add(() => {
            this.fallingBall.y += this.fallingBall.vy;
            this.fallingBall.vy += 0.8;

            for (let pinIndex = 0; pinIndex < this.pins.length; pinIndex++) {
                if (this.hasImpingement(
                    this.pins[pinIndex].x - this.fraction,
                    this.pins[pinIndex].y,
                    this.pins[pinIndex].radius,
                    this.fallingBall.x,
                    this.fallingBall.y,
                    this.fallingBall.width / 2
                )) {
                    const current_pin = this.pins[pinIndex];
                    this.fallingBall.vy *= -this.top_bounce;
                    this.fallingBall.y += this.fallingBall.vy;
                    this.fallingBall.vx += this.side_bounce;
                    this.fallingBall.vx *= this.fraction;

                    if (current_pin !== last_pin) {
                        randomTurn = Math.floor(Math.random() * 2);
                        last_pin = current_pin;
                    }

                    if (randomTurn === 0) {
                        this.fallingBall.x -= this.fallingBall.vx;
                    } else if (randomTurn === 1) {
                        this.fallingBall.x += this.fallingBall.vx;
                    }

                    break;
                }
            }

            for (let slotIndex = 0; slotIndex < this.slots.length; slotIndex++) {
                if (this.hasImpingement(
                    this.slots[slotIndex].x,
                    this.slots[slotIndex].y + 40,
                    this.slots[slotIndex].width / 2,
                    this.fallingBall.x,
                    this.fallingBall.y,
                    this.fallingBall.width / 2
                )) {
                    this.app.stage.removeChild(this.fallingBall);
                    const scoredSoundEffect = new Audio("./sound/coin-drop.mp3");
                    scoredSoundEffect.volume = 0.2;
                    scoredSoundEffect.play();

                    if (this.cost_scored === 0) {
                        this.slotCost = this.slots[slotIndex].cost;
                        this.cost_scored = roundFloat(this.getCostScored(this.bet, this.slotCost));
                        this.points = parseFloat(document.getElementById("sum-section-amount")!.innerHTML);
                        this.points += this.cost_scored;
                        this.points = roundFloat(this.points);
                        document.getElementById("sum-section-amount")!.innerHTML = this.points.toString();

                        const tableGameHistory = document.getElementById("slot-cost-add")!;
                        tableGameHistory.innerHTML =
                            `<span class="slot-cost-span slot-cost-span-${this.colorCurrent}">${this.slotCost}</span>` + tableGameHistory.innerHTML;

                        this.slots[slotIndex].slot.y += 10;
                        setTimeout(() => {
                            this.slots[slotIndex].slot.y -= 10;
                        }, 50);
                    }
                }
            }
        });
    }

    hasImpingement(pin_x: number, pin_y: number, pin_r: number, ball_x: number, ball_y: number, ball_r: number): boolean {
        const circleDistance = (pin_x - ball_x) ** 2 + (pin_y - ball_y) ** 2;
        return circleDistance <= (pin_r + ball_r) ** 2;
    }

    getCostScored(bet: number, slot_cost: number): number {
        return bet * slot_cost;
    }
}

export default Game;
