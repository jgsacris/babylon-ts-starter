import { AbstractMesh, Color4, PointerEventTypes } from "@babylonjs/core";
import { Mesh, MeshBuilder, Scene, Vector3, ParticleSystem, Texture } from "@babylonjs/core";

let fountain: Mesh;
let switched: boolean = false;
let particleSystem: ParticleSystem;

function buildFountain(scene: Scene): Mesh {
    const fountainProfile = [
        new Vector3(0, 0, 0),
        new Vector3(0.5, 0, 0),
        new Vector3(0.5, 0.2, 0),
        new Vector3(0.4, 0.2, 0),
        new Vector3(0.4, 0.05, 0),
        new Vector3(0.05, 0.1, 0),
        new Vector3(0.05, 0.8, 0),
        new Vector3(0.15, 0.9, 0)
    ];

    fountain = MeshBuilder.CreateLathe("fountain",
        { shape: fountainProfile, sideOrientation: Mesh.DOUBLESIDE }, scene);
    createParticleSystem(scene);
    setupIneractions(scene);
    return fountain;
}


function createParticleSystem(scene: Scene) {
    particleSystem = new ParticleSystem('particles', 5000, scene);
    particleSystem.particleTexture = new Texture('assets/textures/flare.png', scene);
    particleSystem.emitter = new Vector3(-4, 0.8, -6); // the point at the top of the fountain
    particleSystem.minEmitBox = new Vector3(-0.01, 0, -0.01); // minimum box dimensions
    particleSystem.maxEmitBox = new Vector3(0.01, 0, 0.01); // maximum box dimensions
    // Colors of all particles
    particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.01;
    particleSystem.maxSize = 0.05;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 3.5;

    // Emission rate
    particleSystem.emitRate = 1500;
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

    particleSystem.direction1 = new Vector3(-1, 8, 1);
    particleSystem.direction2 = new Vector3(1, 8, -1);
    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 0.3;
    particleSystem.maxEmitPower = 0.5;
    particleSystem.updateSpeed = 0.025;
    particleSystem.gravity = new Vector3(0, -9.81, 0);
    particleSystem.start();
}

function setupIneractions(scene: Scene) {
    switched = false;
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case PointerEventTypes.POINTERDOWN:
                if (pointerInfo?.pickInfo?.hit) {
                    pointerDown(pointerInfo.pickInfo.pickedMesh!);
                }
                break;
        }

    })
}

function pointerDown(mesh: AbstractMesh) {
    if (mesh === fountain) {
        switched = !switched;
        if (switched) {
            particleSystem.start();
        }
        else {
            particleSystem.stop();
        }
    }
}

export {
    buildFountain
}