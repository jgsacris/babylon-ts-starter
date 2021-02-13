export function createRefeshBtn(): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.style.position = 'absolute';
    btn.style.right = '10px';
    btn.style.top = '10px';
    btn.style.background = 'rgba(0,0,0, 0.5';
    btn.style.borderRadius = '5%';
    btn.style.border = 'none';
    btn.style.zIndex = '11';
    btn.style.fontSize = '100px';
    btn.style.padding = '10px';
    btn.style.textAlign = 'center';
    btn.style.color = '#fff';
    btn.innerText = '⤓';
    document.body.append(btn);

    return btn;
}