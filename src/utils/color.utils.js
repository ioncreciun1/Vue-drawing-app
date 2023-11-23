const MAX_HEX_COLOR_NUMBER = 16777215

export function getRandomHexColor() {
    const color = Math.floor(Math.random() * MAX_HEX_COLOR_NUMBER).toString(16);
    return `#${color}`;
}
