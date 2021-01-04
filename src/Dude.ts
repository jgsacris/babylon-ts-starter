import { Axis, Mesh, Scene, SceneLoader, Vector3, Tools, Space, Quaternion } from "@babylonjs/core";

let _scene: Scene;
let _dude: Mesh;
let distance = 0;
let step = 0.012;
let p = 0;
let startRotation: Quaternion;

async function loadDude(scene: Scene): Promise<Mesh> {
    _scene = scene;
    try {
        const result = await SceneLoader.ImportMeshAsync("", "./assets/", "knight.glb", scene);
        console.log('result', result);
        _dude = (result.meshes[0] as Mesh);
        const scale = 0.0025;
        _dude.scaling = new Vector3(scale, scale, scale);
        scene.beginAnimation(result.skeletons[0], 0, 100, true, 1);
        _dude.position = new Vector3(-6.1, 0, 0.7);
        _dude.rotate(Axis.Y, Tools.ToRadians(-93), Space.LOCAL);
        //_dude.getChildTransformNodes()[0].addRotation(0, Math.PI, 0);
        startRotation = (_dude.rotationQuaternion?.clone()!);
        console.log('startRotation', startRotation);
        setAnimation();
        return _dude;
    } catch (error) {
        throw (error);
    }
}


class walk {
    constructor(public turn: number, public dist: number) { }
}

function setAnimation() {

    const track: walk[] = [];
    track.push(new walk(86, 7));
    track.push(new walk(-85, 14.8));
    track.push(new walk(-93, 16.5));
    track.push(new walk(48, 25.5));
    track.push(new walk(-112, 30.5));
    track.push(new walk(-72, 33.2));
    track.push(new walk(42, 37.5));
    track.push(new walk(-98, 45.2));
    track.push(new walk(0, 47));

    _scene.onBeforeRenderObservable.add(() => {
        _dude.movePOV(0, 0, -step);
        distance += step;
        if (distance > track[p].dist) {
            _dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
            p += 1;
            p %= track.length;
            if (p === 0) {
                distance = 0;
                _dude.position = new Vector3(-6, 0, 0);
                _dude.rotationQuaternion = startRotation.clone();
            }
        }
    })
}

export {
    loadDude
}