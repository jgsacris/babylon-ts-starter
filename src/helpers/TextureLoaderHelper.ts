import { Scene, Texture } from "@babylonjs/core";

function whenAllReady(textures: Texture[], resolve: () => void) {
    let numRemaining = textures.length;
    if (numRemaining === 0) {
        resolve();
        return;
    }

    for (var i = 0; i < textures.length; i++) {
        var texture = textures[i];

        if (texture.isReady()) {
            if (--numRemaining === 0) {
                resolve();
                return;
            }
        }
        else {
            var onLoadObservable = texture.onLoadObservable;

            if (onLoadObservable) {
                onLoadObservable.addOnce(() => {
                    if (--numRemaining === 0) {
                        resolve();
                    }
                });
            }
        }
    }
}

function loadTexturesAsync(textureUrls: string[], scene: Scene): Promise<Texture[]> {
    return new Promise((resolve, reject) => {
        var textures: Texture[] = [];

        for (var url of textureUrls) {
            textures.push(new Texture(url, scene));
        }

        whenAllReady(textures, () => resolve(textures));
    });
}

export {
    loadTexturesAsync
}