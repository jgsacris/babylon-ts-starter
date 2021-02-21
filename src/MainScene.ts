import "@babylonjs/inspector";
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui';
import { Scene, Engine, Vector3, HemisphericLight, Mesh, FreeCamera, WebXRHitTest, MeshBuilder, Quaternion, AbstractMesh, PointerInfo, PointerEventTypes } from '@babylonjs/core';
import { loadModel } from "./Model";
import { RefreshButton } from "./Refresh";

export class MainScene {
    private scene: Scene;
    private engine: Engine;
    private camera: FreeCamera;
    private actor: Mesh | undefined;
    private marker: Mesh | undefined;
    private xrTest: WebXRHitTest | undefined;
    private refreshBtn!: RefreshButton;


    constructor(canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });
        this.scene = new Scene(this.engine);
        //this.scene.debugLayer.show({ embedMode: true }); // shows inspector
        this.camera = new FreeCamera('camera1', new Vector3(0, 5, -10), this.scene);
        this.camera.setTarget(Vector3.Zero());
        this.camera.attachControl(canvas, false);

        window.addEventListener('resize', () => {
            this.engine.resize();
        })
    }

    private async iniScene() {

    }

    private createMarker(xrTest: WebXRHitTest) {

    }


    private addRefreshBtn() {

    }


    private onPointerDown(mesh: AbstractMesh) {

    }

    private setupInteraction() {

    }
}