import { Scene, Engine, ArcRotateCamera, Vector3, HemisphericLight, Mesh } from '@babylonjs/core';

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
        this.camera = new ArcRotateCamera('camera1', 0, Math.PI / 4, 10, Vector3.Zero(), this.scene);
        this.camera.attachControl(canvas, false);
        this.iniScene();
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        })
    }

    private iniScene() {
        const ligth = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
        const sphere = Mesh.CreateSphere('sphere1', 16, 2, this.scene, false, Mesh.FRONTSIDE);
        sphere.position.y = 1;

        const ground = Mesh.CreateGround('ground1', 6, 6, 2, this.scene, false);
    }
}