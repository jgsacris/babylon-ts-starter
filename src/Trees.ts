import { Scene, Sprite, SpriteManager } from "@babylonjs/core";


function buildWoods(scene: Scene) {
    const spriteManagerTrees = new SpriteManager('treesManager', 'assets/textures/palm.png', 2000,
        { width: 512, height: 1024 }, scene);
    for (let i = 0; i < 500; i++) {
        const tree = new Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (-30);
        tree.position.z = Math.random() * 20 + 8;
        tree.position.y = 0.5;
    }
    for (let i = 0; i < 500; i++) {
        const tree = new Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (25) + 7;
        tree.position.z = Math.random() * -35 + 8;
        tree.position.y = 0.5;
    }
}

function buildUFO(scene: Scene) {
    const spriteManagerUFO = new SpriteManager('UFOManager', 'assets/textures/ufo.png', 1,
        { width: 128, height: 76 }, scene);
    const ufo = new Sprite('ufo', spriteManagerUFO);
    ufo.playAnimation(0, 16, true, 125);
    ufo.position.y = 5;
    ufo.position.z = 0;
    ufo.width = 2;
    ufo.height = 1;
}

export {
    buildWoods,
    buildUFO
}