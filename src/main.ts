import * as PIXI from 'pixi.js';
import Pin from './components/pin';
import Slot from "./components/slot";
import Game from "./components/game";
import {roundFloat} from "./utils/helpers";
import './style.css';

// Define types for better clarity and control
type SlotCosts = {
    [key: string]: {
        green: number[],
        yellow: number[],
        red: number[]
    }
};

type Color = 'green' | 'yellow' | 'red';

// Game configuration variables with strong types
let fraction: number = 0;
let slots: Slot[] = [];
let initial_level: number = 14;
let initial_color: Color = 'green';
let bet_array: number[] = [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 1.20, 2.00, 4.00, 10.00, 20.00, 50.00, 100.00];
let pins: Pin[] = [];
let beginning: PIXI.Sprite;
let bet: number = bet_array[2];
let points: number = 3000.00;
let top_bounce: number = 0.45;
let side_bounce: number = 3.3;

// Slot costs based on the number of slots and color chosen
const slot_costs_list: SlotCosts = {
    "12": {
        green: [11, 3.2, 1.6, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.6, 3.2, 11],
        yellow: [25, 8, 3.1, 1.7, 1.2, 0.7, 0.3, 0.7, 1.2, 1.7, 3.1, 8, 25],
        red: [141, 25, 8.1, 2.3, 0.7, 0.2, 0, 0.2, 0.7, 2.3, 8.1, 25, 141]
    },
    "14": {
        green: [18, 3.2, 1.6, 1.3, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.3, 1.6, 3.2, 18],
        yellow: [55, 12, 5.6, 3.2, 1.6, 1, 0.7, 0.2, 0.7, 1, 1.6, 3.2, 5.6, 12, 55],
        red: [353, 49, 14, 5.3, 2.1, 0.5, 0.2, 0, 0.2, 0.5, 2.1, 5.3, 14, 49, 353]
    },
    "16": {
        green: [35, 7.7, 2.5, 1.6, 1.3, 1.2, 1.1, 1, 0.4, 1, 1.1, 1.2, 1.3, 1.6, 2.5, 7.7, 35],
        yellow: [118, 61, 12, 4.5, 2.3, 1.2, 1, 0.7, 0.2, 0.7, 1, 1.2, 2.3, 4.5, 12, 61, 118],
        red: [555, 122, 26, 8.5, 3.5, 2, 0.5, 0.2, 0, 0.2, 0.5, 2, 3.5, 8.5, 26, 122, 555]
    }
};

// Main function to set up the application
window.onload = function (): void {

    let app: PIXI.Application = new PIXI.Application({
        height: window.screen.availHeight,
        backgroundAlpha: 0,
    });

    app.stage.interactive = true;

    // Function to set up the pins and slots based on level and color
    function setup(levels: number, color: Color): void {
        const lines: number = 2 + levels;
        const slot_costs: number[] = slot_costs_list[levels][color];
        pins = [];
        slots = [];
        fraction = 7 / lines;
        let space_bottom: number = 150 * fraction;

        for (let i = 3; i <= lines; i++) {
            let space_left: number = 50;

            for (let space = 1; space <= lines - i; space++) {
                space_left += 50 * fraction;
            }

            for (let point = 1; point <= i; point++) {
                let beg_obj: Pin = new Pin(space_left, space_bottom, 0, 30 * fraction, 30 * fraction, 30 * fraction / 2);
                let new_beg: PIXI.Sprite = beg_obj.create();

                app.stage.addChild(new_beg);
                pins.push(beg_obj);
                space_left += 100 * fraction;
            }

            space_bottom += 90 * fraction;
        }

        for (let s = 0; s < slot_costs.length; s++) {
            let temp_bottom_peg: Pin = pins[pins.length - 1 - slot_costs.length + s];
            let slot_obj: Slot = new Slot(temp_bottom_peg.x + temp_bottom_peg.width * fraction, space_bottom, 0, (55 - lines), (50 - lines), slot_costs[s], color);
            let new_slot: PIXI.Sprite = slot_obj.create();

            app.stage.addChild(new_slot);
            slots.push(slot_obj);
        }

        beginning = PIXI.Sprite.from(`./images/hole.png`);
        beginning.anchor.set(0);
        beginning.x = pins[1].x - (8 * fraction);
        beginning.y = 50 * fraction;
        beginning.width = 50 * fraction;
        beginning.height = 50 * fraction;
        app.stage.addChild(beginning);
    }

    // Function to clear the application and reset it
    function destroyApp(): void {
        document.getElementById("canvas")?.removeChild(app.view as HTMLCanvasElement);
        app = new PIXI.Application({
            height: window.screen.availHeight,
            backgroundAlpha: 0,
        });
        document.getElementById("canvas")?.appendChild(app.view as HTMLCanvasElement);
    }

    // Set up the initial configuration
    setup(initial_level, initial_color);
    document.getElementById("canvas")?.appendChild(app.view as HTMLCanvasElement);
    type Color = 'green' | 'yellow' | 'red';

    const canvasOptionDivs: NodeListOf<Element> = document.querySelectorAll(".canvas-option_div");
    const canvasOptionColors: NodeListOf<Element> = document.querySelectorAll(".slot-cost-span-big");
    const playButton = document.getElementById("play-button");
    const pinDisplay = document.getElementById("pin");

    //set up the app with selected level and color
    function setupApp(level: number, color: Color): void {
        destroyApp();
        setup(level, color);
        playButton?.setAttribute('data-attribute-color', color);
        playButton?.setAttribute('data-attribute-pin', level.toString());
    }

    // Handle level selection
    canvasOptionDivs.forEach((op) => {
        op.addEventListener("click", (e: Event) => {
            const target = e.target as HTMLElement;
            const newLevel = parseInt(target.innerHTML);
            const color = playButton?.getAttribute('data-attribute-color') as Color | null;

            if (color && ['green', 'yellow', 'red'].includes(color)) {
                setupApp(newLevel, color as Color);
            }

            // Update selected level
            canvasOptionDivs.forEach((lineNumber) => {
                lineNumber.classList.toggle("selected-line", lineNumber.innerHTML === newLevel.toString());
            });

            if (pinDisplay) {
                pinDisplay.innerHTML = `Pins: ${newLevel}`;
            }
        });
    });

    // Handle color selection
    canvasOptionColors.forEach((colorOption) => {
        colorOption.addEventListener("click", (e: Event) => {
            const target = e.target as HTMLElement;
            const newColor = target.innerHTML as Color;
            const level = parseInt(playButton?.getAttribute('data-attribute-pin') || '0');

            if (['green', 'yellow', 'red'].includes(newColor)) {
                setupApp(level, newColor);
            }

            // Update selected color
            canvasOptionColors.forEach((colorElement) => {
                colorElement.classList.toggle("selected-color", colorElement.innerHTML === newColor);
            });
        });
    });

    document.getElementById("pin")?.addEventListener("click", () => {
        document.getElementById("pin-options")?.classList.toggle('pin-options')

    });

    document.getElementById("slot-cost-change-button")?.addEventListener("click", () => {
        document.getElementById("slot-cost")?.classList.toggle('slot-cost-options')

    });

    // Define bet points display and buttons
    const pointsAmount = document.getElementById("bet-tools-points-amount");
    const increaseButton = document.getElementById("bet-tools-points-increase");
    const decreaseButton = document.getElementById("bet-tools-points-decrease");

    // update points and data attributes
    function updateBetPoints(direction: 'increase' | 'decrease'): void {
        const button = direction === 'increase' ? increaseButton : decreaseButton;
        const currentIndex = parseInt(button?.getAttribute('data-attribute') || '0');
        const newIndex = direction === 'increase' ? currentIndex + 1 : currentIndex - 1;

        if (newIndex >= 0 && newIndex < bet_array.length) {
            const newBet = bet_array[newIndex];
            if (direction === 'increase' && points <= newBet) return;  // Check for sufficient points only when increasing

            // Update bet and UI
            bet = newBet;
            pointsAmount!.innerHTML = `${bet}`;

            // Update data attributes for both buttons
            increaseButton?.setAttribute('data-attribute', newIndex.toString());
            decreaseButton?.setAttribute('data-attribute', newIndex.toString());
        }
    }

    // Attach event listeners to buttons
    increaseButton?.addEventListener("click", () => updateBetPoints('increase'));
    decreaseButton?.addEventListener("click", () => updateBetPoints('decrease'));

    // Initial points setup
    const sumSection: HTMLElement | null = document.getElementById("sum-section-amount");
    if (sumSection) {
        sumSection.innerHTML = String(points);
    }

    // Event listener for the play button
    document.getElementById("play-button")?.addEventListener("click", () => {
        if (points > 0 && bet <= points) {
            points -= bet;
            points = roundFloat(points);

            // Update the displayed points
            if (sumSection) {
                sumSection.innerHTML = String(points);
            }

            // Retrieve color attribute and start the game
            const currentColor = document.getElementById("play-button")?.getAttribute('data-attribute-color') as Color | null;
            new Game(beginning, app, fraction, pins, slots, bet, top_bounce, side_bounce, currentColor, points).start();
        }
    });

};
