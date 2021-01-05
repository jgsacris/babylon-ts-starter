import "@babylonjs/inspector";
import "@babylonjs/loaders";
import * as GUI from "@babylonjs/gui";
import {
    Scene, Engine, ArcRotateCamera, Vector3,
    HemisphericLight, SceneLoader, MeshBuilder, StandardMaterial, Color3, Texture, Vector4, Mesh, CubeTexture, DirectionalLight, ShadowGenerator, Camera, FollowCamera
} from '@babylonjs/core';


import { buildCar, startAnimation as startCarAnimation } from './Car';
import { buildGround as buildTextureGround } from './Ground';
import * as dude from './Dude';
import { buildWoods, buildUFO } from './Trees';
import { buildFountain } from './Fountain';
import { createLamp } from './Lamps';

export class MainScene {
    private scene: Scene;
    private engine: Engine;
    private camera: Camera;
    private shadowGenerator: ShadowGenerator | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });
        this.scene = new Scene(this.engine);
        //this.scene.debugLayer.show({ embedMode: true });
        this.camera = this.createArcRotateCamera();
        //this.camera = this.createFollowCamera();
        this.camera.attachControl(canvas, true);
        this.iniScene()
            .then((result) => {

                this.engine.runRenderLoop(() => {
                    this.scene.render();
                });

                window.addEventListener('resize', () => {
                    this.engine.resize();
                });


            });

    }

    private createArcRotateCamera(): Camera {
        const camera = new ArcRotateCamera('camera1', -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), this.scene);
        camera.upperBetaLimit = Math.PI / 2.2;
        camera.wheelPrecision = 100; // higher = more precision

        return camera;
    }

    private createFollowCamera() {
        const camera = new FollowCamera('followCamera', new Vector3(-10, 0, -10), this.scene);
        camera.heightOffset = 4;
        camera.radius = 0.8;
        camera.rotationOffset = 0;
        camera.cameraAcceleration = 0.005;
        camera.maxCameraSpeed = 10;
        return camera;
    }

    private async iniScene() {
        const light = new DirectionalLight('light1', new Vector3(0, -1, 1), this.scene);
        light.position = new Vector3(0, 50, -100);
        light.intensity = 0.1;
        // Shadow generator
        this.shadowGenerator = new ShadowGenerator(1024, light);
        this.buildSkybox();
        buildWoods(this.scene);
        this.buildVillage();
        const fountain = buildFountain(this.scene);
        fountain.position.x = -4;
        fountain.position.z = -6;
        const car = await buildCar(this.scene);
        startCarAnimation();
        car.rotation.x = -Math.PI / 2;
        car.rotation.y = -Math.PI / 2;
        car.position.x = 2;
        car.position.z = 0.8;
        car.position.y = 0.2;
        const dude = await this.loadDude();
        this.shadowGenerator.addShadowCaster(dude, true);
        //this.camera.parent = dude; in case we want the ArcRotateCamera to follow the dude;
        if (this.camera instanceof FollowCamera) {
            (this.camera as FollowCamera).lockedTarget = dude;
        }
        buildUFO(this.scene);
        this.buildLights();
        this.createGUI(light);
    }

    private createGUI(light: DirectionalLight) {
        // GUI
        const adt = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const panel = new GUI.StackPanel();
        panel.width = "220px";
        panel.top = "-25px";
        panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        adt.addControl(panel);

        const header = new GUI.TextBlock();
        header.text = "Night to Day";
        header.height = "30px";
        header.color = "white";
        panel.addControl(header);

        const slider = new GUI.Slider();
        slider.minimum = 0;
        slider.maximum = 1;
        slider.borderColor = "black";
        slider.color = "gray";
        slider.background = "white";
        slider.value = 1;
        slider.height = "20px";
        slider.width = "200px";
        slider.onValueChangedObservable.add((value: any) => {
            if (light) {
                light.intensity = value;
            }
        });
        panel.addControl(slider);
    }

    private buildLights() {
        const lamp = createLamp(this.scene);
        lamp.position = new Vector3(1.5, 0, 3);
        lamp.rotation = Vector3.Zero();
        lamp.rotation.y = Math.PI / 8;

        const lamp3 = lamp.clone("lamp3");
        lamp3.position.z = -8;

        const lamp1 = lamp.clone("lamp1");
        lamp1.position.x = -8;
        lamp1.position.z = 1.2;
        lamp1.rotation.y = Math.PI / 2;

        const lamp2 = lamp1.clone("lamp2");
        lamp2.position.x = -2.7;
        lamp2.position.z = 0.2;
        lamp2.rotation.y = -Math.PI / 2;

    }

    private buildSkybox() {
        const skybox = MeshBuilder.CreateBox("skyBox", { size: 150 }, this.scene);
        const skyboxMaterial = new StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("assets/textures/skybox", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    }

    private buildVillage() {
        this.buildGround();

        const detached_house = this.buildHouse(1)!;
        detached_house.rotation.y = -Math.PI / 16;
        detached_house.position.x = -6.8;
        detached_house.position.z = 2.5;

        const semi_house = this.buildHouse(2)!;
        semi_house.rotation.y = -Math.PI / 16;
        semi_house.position.x = -4.5;
        semi_house.position.z = 3;

        const places = []; //each entry is an array [house type, rotation, x, z]
        places.push([1, -Math.PI / 16, -6.8, 2.5]);
        places.push([2, -Math.PI / 16, -4.5, 3]);
        places.push([2, -Math.PI / 16, -1.5, 4]);
        places.push([2, -Math.PI / 3, 1.5, 6]);
        places.push([2, 15 * Math.PI / 16, -6.4, -1.5]);
        places.push([1, 15 * Math.PI / 16, -4.1, -1]);
        places.push([2, 15 * Math.PI / 16, -2.1, -0.5]);
        places.push([1, 5 * Math.PI / 4, 0, -1]);
        places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
        places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
        places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
        places.push([2, Math.PI / 1.9, 4.75, -1]);
        places.push([1, Math.PI / 1.95, 4.5, -3]);
        places.push([2, Math.PI / 1.9, 4.75, -5]);
        places.push([1, Math.PI / 1.9, 4.75, -7]);
        places.push([2, -Math.PI / 3, 5.25, 2]);
        places.push([1, -Math.PI / 3, 6, 4]);

        const houses = [];
        for (let i = 0; i < places.length; i++) {
            if (places[i][0] === 1) {
                houses[i] = detached_house.createInstance("house" + i);
            }
            else {
                houses[i] = semi_house.createInstance("house" + i);
            }
            houses[i].rotation.y = places[i][1];
            houses[i].position.x = places[i][2];
            houses[i].position.z = places[i][3];
        }
    }

    private buildGround() {
        const ground = MeshBuilder.CreateGround('ground', { width: 18, height: 18 });
        // const groundMat = new StandardMaterial("groundMat", this.scene);
        // groundMat.diffuseColor = new Color3(0, 1, 0);
        const groundMat = new StandardMaterial("groundMat", this.scene);
        groundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/villagegreen.png", this.scene);
        groundMat.diffuseTexture.hasAlpha = true;
        ground.material = groundMat;
        ground.receiveShadows = true;

        const txtGround = buildTextureGround(this.scene);
        txtGround.position.y = -0.01;

    }

    private buildHouse = (width: number) => {
        const box = this.buildBox(width);
        const roof = this.buildRoof(width);

        return Mesh.MergeMeshes([box, roof], true, false, undefined, false, true);
    }

    private buildBox = (width: number) => {
        //texture
        const boxMat = new StandardMaterial("boxMat", this.scene);
        if (width == 2) {
            boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/semihouse.png", this.scene)
        }
        else {
            boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png", this.scene);
        }

        //options parameter to set different images on each side
        const faceUV = [];
        if (width == 2) {
            faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
            faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
            faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
            faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
        }
        else {
            faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
            faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
            faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
            faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
        }
        // top 4 and bottom 5 not seen so not set

        /**** World Objects *****/
        const box = MeshBuilder.CreateBox("box", { width: width, faceUV: faceUV, wrap: true });
        box.material = boxMat;
        box.position.y = 0.5;

        return box;
    }

    private buildRoof = (width: number) => {
        //texture
        const roofMat = new StandardMaterial("roofMat", this.scene);
        roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg", this.scene);

        const roof = MeshBuilder.CreateCylinder("roof", { diameter: 1.3, height: 1.2, tessellation: 3 });
        roof.material = roofMat;
        roof.scaling.x = 0.75;
        roof.scaling.y = width;
        roof.rotation.z = Math.PI / 2;
        roof.position.y = 1.22;

        return roof;
    }

    private loadDude = () => {

        return dude.loadDude(this.scene);

    }

}