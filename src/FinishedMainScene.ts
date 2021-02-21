import "@babylonjs/inspector";
import "@babylonjs/loaders";
import * as GUI from "@babylonjs/gui";
import { Scene, Engine, ArcRotateCamera, Vector3, HemisphericLight, Mesh, FreeCamera, WebXRHitTest, MeshBuilder, Quaternion, AbstractMesh, PointerInfo, PointerEventTypes } from '@babylonjs/core';
import { loadModel } from "./Model";
import { createRefeshBtn, RefreshButton } from "./Refresh";

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
        this.iniScene()
            .then(() => {
                this.engine.runRenderLoop(() => {
                    this.scene.render();
                });
                this.setupInteraction();
            });
        this.addRefreshBtn();
        window.addEventListener('resize', () => {
            this.engine.resize();
        })
    }

    private async iniScene() {
        const light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;

        //this.actor = this.createSphere();
        this.actor = await loadModel(this.scene);
        this.actor.setEnabled(false);

        const xr = await this.scene.createDefaultXRExperienceAsync({
            disableDefaultUI: false,
            disableTeleportation: true,
            uiOptions: {
                sessionMode: 'immersive-ar',
                referenceSpaceType: 'unbounded'
            },
            optionalFeatures: true
        });
        if (!xr.baseExperience) {
            alert('no AR support');
        }
        const fm = xr.baseExperience.featuresManager;
        this.xrTest = fm.enableFeature(WebXRHitTest, 'latest') as WebXRHitTest;
        this.createMarker(this.xrTest);

    }

    private createMarker(xrTest: WebXRHitTest) {
        this.marker = MeshBuilder.CreateGround('marker', { width: 0.5, height: 0.5 });
        this.marker.isVisible = false;
        this.marker.rotationQuaternion = new Quaternion();
        xrTest.onHitTestResultObservable.add((results) => {
            if (results.length) {
                this.marker!.isVisible = true;
                const hitTest = results[0];
                hitTest.transformationMatrix.decompose(this.marker!.scaling, this.marker!.rotationQuaternion!, this.marker!.position);

            } else {
                this.marker!.isVisible = false;
            }
        });
    }

    private createSphere(): Mesh {
        const sphere = Mesh.CreateSphere('sphere1', 16, 0.5, this.scene, false, Mesh.FRONTSIDE);
        sphere.position.y = 0.5;
        sphere.position.z = 5;
        sphere.rotationQuaternion = new Quaternion();
        sphere.isVisible = false;
        return sphere;
    }

    private addRefreshBtn() {
        this.refreshBtn = new RefreshButton();
        this.refreshBtn.onClick(() => {
            console.log('gui pressed');
            this.marker!.isVisible = true;
            this.actor!.setEnabled(false);
            this.xrTest!.paused = false;
            this.refreshBtn.hide();
        });
        this.refreshBtn.hide();
    }


    private onPointerDown(mesh: AbstractMesh) {
        console.log('mesh hit', this.marker);
        this.actor!.position = this.marker!.position.clone();
        this.actor!.rotationQuaternion = this.marker!.rotationQuaternion!.clone();
        this.marker!.isVisible = false;
        this.actor!.setEnabled(true);
        this.xrTest!.paused = true;
        this.refreshBtn.show();
    }

    private setupInteraction() {
        this.scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERDOWN:
                    if (pointerInfo?.pickInfo?.hit) {
                        this.onPointerDown(pointerInfo.pickInfo.pickedMesh!)
                    }
                    break;
            }
        })
    }
}