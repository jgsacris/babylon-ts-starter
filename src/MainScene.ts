import { Scene, Engine, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, SceneLoader } from 'babylonjs';
import { circleOfConfusionPixelShader } from 'babylonjs/Shaders/circleOfConfusion.fragment';

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
        this.camera = new ArcRotateCamera('camera1', -Math.PI / 2, Math.PI / 2.5, 3, Vector3.Zero(), this.scene);
        this.camera.attachControl(canvas, true);
        this.iniScene()
            .then((result) => {

                console.log('result', result.meshes);
                result.meshes[1].position.x = 20;
                const myMesh_1 = this.scene.getMeshByName('detached_house');
                myMesh_1!.rotation.y = Math.PI / 2;

                this.engine.runRenderLoop(() => {
                    this.scene.render();
                });

                window.addEventListener('resize', () => {
                    this.engine.resize();
                });
            });

    }

    private iniScene() {
        const ligth = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
        //const box = MeshBuilder.CreateBox("box", {}, this.scene);
        return SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon");
    }
}