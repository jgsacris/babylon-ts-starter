import { GroundMesh, Mesh, MeshBuilder, Scene, StandardMaterial, Texture } from "@babylonjs/core";

let largeGround: GroundMesh
function buildGround(scene: Scene): GroundMesh {
    const largeGroundMat = new StandardMaterial("largeGroundMat", scene);
    largeGroundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/valleygrass.png", scene);

    largeGround = MeshBuilder.CreateGroundFromHeightMap('largeGround', './assets/villageheightmap.webp',
        { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 },
        scene
    );
    largeGround.material = largeGroundMat;

    return largeGround;

}

export {
    buildGround
}