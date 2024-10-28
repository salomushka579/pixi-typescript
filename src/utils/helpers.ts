/**
 * Rounds a number to two decimal places.
 *
 * @param num - The value to be rounded.
 * @returns The rounded value to two decimal places.
 */
export function roundFloat(num: number): number {
    return parseFloat(num.toFixed(2));
}
