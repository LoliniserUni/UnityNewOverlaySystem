import { Animation } from "../shared/Animation.js";

const animations = [
    new Animation('arrowAnim', 'arrow', 12),
    new Animation('smily1Anim', 'smilyFace1', 19),
    new Animation('upArrowAnim', 'upArrow', 11),
    new Animation('scopeAnim', 'sight', 18),
    new Animation('cross1Anim', 'cross1', 13),
    new Animation('heartAnim', 'heart', 18),
    new Animation('RIPanim', 'RIP', 24),
    new Animation('textBubbleAnim', 'textBubble', 13),
    new Animation('smily2Anim', 'smilyFace2', 15),
    new Animation('cross2Anim', 'cross2', 13),
    new Animation('upArrow2Anim', 'upArrow2', 15),
    new Animation('crownAnim', 'crown', 23),
    new Animation('arrow2Anim', 'arrow2', 12)

];
const caster1 = document.getElementById('caster1Text');
fitText(caster1);
const caster2 = document.getElementById('caster2Text');
fitText(caster2);

document.addEventListener("DOMContentLoaded", () => {
    loadSceneConfig("controller").then(config => {
        document.getElementById("scrollText1").textContent = config.scrollText;
        document.getElementById("scrollText2").textContent = config.scrollText;

        if (config.caster1 === "" || config.caster1 == null || config.caster1 === caster1.textContent) {
            // do nothing
        } else {
            caster1.textContent = config.caster1;
            fitText(caster1);
        }

        if (config.caster2 === "" || config.caster2 == null || config.caster2 === caster2.textContent) {
            // do nothing
        } else {
            caster2.textContent = config.caster2;
            fitText(caster2);
        }

    });
});

for (const anim of animations) {
    anim.loadFrames().then(() => {
        setInterval(() => {
            anim.playAnimation();
        }, 75);

        anim.startRandomReset(3000, 15000);
    });
}

const gloablScene = 'controller';
async function loadSceneConfig(gloablScene) {
    try {
        const response = await fetch(`/api/${gloablScene}/config`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Scene config:", data);
        return data;
    } catch (err) {
        console.error("Failed to load scene config:", err);
    }
}

function fitText(element, maxFont = 80, minFont = 5) {
    const parent = element.parentElement;

    const parentWidth = parent.offsetWidth;
    const parentHeight = parent.offsetHeight;

    const buffer = 4; // prevents right-side clipping

    let fontSize = minFont;
    element.style.fontSize = fontSize + 'px';

    while (fontSize < maxFont) {
        element.style.fontSize = fontSize + 'px';

        if (element.scrollWidth + buffer > parentWidth ||
            element.scrollHeight + buffer > parentHeight) {
            fontSize--;
            element.style.fontSize = fontSize + 'px';
            break;
        }

        fontSize++;
    }
}





