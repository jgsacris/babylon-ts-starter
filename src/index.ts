import { MainScene } from './MainScene';

const version = '0.0.2';

function init() {
    console.log(`init v: ${version}`);
    const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement;
    const mainScene = new MainScene(canvas);
}

window.addEventListener('DOMContentLoaded', (event) => {
    init();
})