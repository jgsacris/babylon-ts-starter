import "@babylonjs/inspector";
import "@babylonjs/loaders";
import {
    Scene, Engine, ArcRotateCamera, Vector3,
    HemisphericLight, SceneLoader, MeshBuilder, StandardMaterial, Color3, Texture, Vector4, Mesh
} from '@babylonjs/core';


import { buildCar, startAnimation as startCarAnimation } from './Car';

export class MainScene {
    private scene: Scene;
    private engine: Engine;
    private camera: ArcRotateCamera;

    constructor(canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });
        this.scene = new Scene(this.engine);
        //this.scene.debugLayer.show({ embedMode: true });
        this.camera = new ArcRotateCamera('camera1', -Math.PI / 2, Math.PI / 2.5, 8, Vector3.Zero(), this.scene);
        this.camera.attachControl(canvas, true);
        this.iniScene()
            .then((result) => {

                // console.log('result', result.meshes);
                // result.meshes[1].position.x = 20;
                // const myMesh_1 = this.scene.getMeshByName('detached_house');
                // myMesh_1!.rotation.y = Math.PI / 2;

                this.engine.runRenderLoop(() => {
                    this.scene.render();
                });

                window.addEventListener('resize', () => {
                    this.engine.resize();
                });


            });

    }

    private async iniScene() {
        const ligth = new HemisphericLight('light1', new Vector3(1, 1, 0), this.scene);
        this.buildVillage();
        const car = buildCar(this.scene);
        startCarAnimation();
        car.rotation.x = -Math.PI / 2;
        car.position.z = 0.8;
        car.position.y = 0.2;
        this.loadDude();

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
        const groundMat = new StandardMaterial("groundMat", this.scene);
        groundMat.diffuseColor = new Color3(0, 1, 0);
        ground.material = groundMat;
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
        SceneLoader.ImportMeshAsync("", "./assets/", "knight.glb", this.scene)
            .then((result) => {
                console.log('result', result);
                const dude = result.meshes[0];
                const scale = 0.0025;
                dude.scaling = new Vector3(scale, scale, scale);
                this.scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
            })
            .catch(error => {
                console.warn('error', error)
            })
    }

}