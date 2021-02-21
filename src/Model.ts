
import { SceneLoader, Mesh, Vector3, Scene, TransformNode } from '@babylonjs/core';


export async function loadModel(scene: Scene): Promise<Mesh> {

    return SceneLoader.ImportMeshAsync('',
        './assets/actor.glb')
        .then((result) => {
            const container = new TransformNode('container', scene);
            const mesh = result.meshes[0];
            mesh.rotate(new Vector3(0, 1, 0), Math.PI);
            const scale = 0.3;
            mesh.scaling.scaleInPlace(scale);
            mesh.parent = container;
            return container as Mesh;
        });


}