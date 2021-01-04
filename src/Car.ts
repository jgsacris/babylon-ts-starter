import { Vector3, Vector4, StandardMaterial, Texture, MeshBuilder, Mesh, Scene, Animation, CubicEase, EasingFunction } from "@babylonjs/core";
import earcut from 'earcut';
import { loadTexturesAsync } from './TextureLoaderHelper';

let car: Mesh;
let wheelRB: Mesh;
let wheelRF: Mesh;
let wheelLB: Mesh;
let wheelLF: Mesh;
let _scene: Scene;




function buildCar(scene: Scene): Promise<Mesh> {

    return new Promise(async (resolve, reject) => {
        _scene = scene;
        //base
        const outline = [
            new Vector3(-0.3, 0, -0.1),
            new Vector3(0.2, 0, -0.1),
        ]

        //curved front
        for (let i = 0; i < 20; i++) {
            outline.push(new Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
        }
        const textures = await loadTexturesAsync(['https://assets.babylonjs.com/environments/car.png',
            'https://assets.babylonjs.com/environments/wheel.png'], scene);

        //top
        outline.push(new Vector3(0, 0, 0.1));
        outline.push(new Vector3(-0.3, 0, 0.1));

        //face UVs
        const faceUV = [];
        faceUV[0] = new Vector4(0, 0.5, 0.38, 1);
        faceUV[1] = new Vector4(0, 0, 1, 0.5);
        faceUV[2] = new Vector4(0.38, 1, 0, 0.5);

        //material
        const carMat = new StandardMaterial("carMat", scene);
        carMat.diffuseTexture = textures[0];

        car = MeshBuilder.ExtrudePolygon("car", { shape: outline, depth: 0.2, faceUV: faceUV, wrap: true }, scene, earcut);
        car.material = carMat;

        const wheelUV = [];
        wheelUV[0] = new Vector4(0, 0, 1, 1);
        wheelUV[1] = new Vector4(0, 0.5, 0, 0.5);
        wheelUV[2] = new Vector4(0, 0, 1, 1);

        //car material
        const wheelMat = new StandardMaterial("wheelMat", scene);
        wheelMat.diffuseTexture = textures[1];

        wheelRB = MeshBuilder.CreateCylinder("wheelRB", { diameter: 0.125, height: 0.05, faceUV: wheelUV });
        wheelRB.material = wheelMat;
        wheelRB.parent = car;
        wheelRB.position.z = -0.1;
        wheelRB.position.x = -0.2;
        wheelRB.position.y = 0.035;
        wheelRF = wheelRB.clone("wheelRF");
        wheelRF.position.x = 0.1;
        wheelLB = wheelRB.clone("wheelLB");
        wheelLB.position.y = -0.2 - 0.035;
        wheelLF = wheelRF.clone("wheelLF");
        wheelLF.position.y = -0.2 - 0.035;

        setAnimations();

        resolve(car);
    })

}

function setAnimations() {
    const animWheel = new Animation('wheelAnimation', 'rotation.y', 30,
        Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const wheelKeys: Array<{ frame: number, value: number }> = [];
    wheelKeys.push({ frame: 0, value: 0 });
    wheelKeys.push({ frame: 30, value: 2 * Math.PI });
    animWheel.setKeys(wheelKeys);
    wheelRB.animations = [];
    wheelRB.animations.push(animWheel);
    wheelRF.animations = [];
    wheelRF.animations.push(animWheel);
    wheelLB.animations = [];
    wheelLB.animations.push(animWheel);
    wheelLF.animations = [];
    wheelLF.animations.push(animWheel);

    const ease = new CubicEase();
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

    const animCar = new Animation("carAnimation", "position.x", 30,
        Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const carKeys = [];
    carKeys.push({
        frame: 0,
        value: -4
    });
    carKeys.push({
        frame: 150,
        value: 4
    });
    carKeys.push({
        frame: 210,
        value: 4
    });
    animCar.setKeys(carKeys);
    animCar.setEasingFunction(ease);
    car.animations = [];
    car.animations.push(animCar);
}

function startAnimation() {
    _scene.beginAnimation(wheelRB, 0, 30, true);
    _scene.beginAnimation(wheelRF, 0, 30, true);
    _scene.beginAnimation(wheelLB, 0, 30, true);
    _scene.beginAnimation(wheelLF, 0, 30, true);
    _scene.beginAnimation(car, 0, 210, true);
}

export {
    buildCar,
    startAnimation
}