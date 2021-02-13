import * as GUI from '@babylonjs/gui';

export function createRefeshBtn(): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.style.position = 'absolute';
    btn.style.width = '100px';
    btn.style.right = '10px';
    btn.style.top = '10px';
    btn.style.background = '#000';
    btn.style.borderRadius = '5%';
    btn.style.border = 'none';
    btn.style.zIndex = '11';
    btn.style.fontSize = '100px';
    btn.style.padding = '0 10px';
    btn.style.textAlign = 'center';
    btn.style.color = '#fff';
    btn.innerText = '⤓';
    document.body.append(btn);

    return btn;
}



export class RefreshButton {
    private button1: GUI.Button;

    constructor() {
        var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        this.button1 = GUI.Button.CreateSimpleButton("but1", '⤓');
        this.button1.width = "100px"
        this.button1.height = "100px";
        this.button1.color = "white";
        this.button1.cornerRadius = 3;
        this.button1.fontSize = 100;
        this.button1.background = "#000";

        this.button1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.button1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        advancedTexture.addControl(this.button1);
    }

    onClick(callback: () => void) {
        this.button1.onPointerUpObservable.add(function () {
            callback();
        });
    }

    hide() {
        this.button1.isVisible = false;
    }

    show() {
        this.button1.isVisible = true;
    }

}

