import { startPollingTimer } from "/GlobalShared/scripts/timer.js";
import { getPlayers } from "/GlobalShared/scripts/functions.js";

document.addEventListener("DOMContentLoaded", () => {
    const timerText = document.getElementById("timerText");

    const pathParts = window.location.pathname.split("/");
    const overlayIndex = pathParts.indexOf("overlay");
    const scene = overlayIndex > 0 ? pathParts[overlayIndex - 1] : "Starting";

    loadSceneConfig("controller").then(config => {
        document.getElementById("scrollText1").textContent = config.scrollText;
        document.getElementById("scrollText2").textContent = config.scrollText;
    });

    startPollingTimer(scene, (display, active) => {
        if (active) {
            timerText.textContent = display;
        } else {
            timerText.textContent = "Starting Soon.";
        }
    });
    updatePlayers();
});


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

function styleFirstLetter(element, color, fontFamily) {
    const text = element.textContent;
    if (!text) return;

    const first = text[0];
    const rest = text.slice(1);

    element.innerHTML =
        `<span class="first-letter">${first}</span>${rest}`;

    const span = element.querySelector('.first-letter');
    span.style.color = color;
    span.style.fontFamily = fontFamily;
    span.style.fontSize = "42px";
}

async function updatePlayers() {
    const players = await getPlayers();

    console.log("players loaded =", players);

    const p1 = document.getElementById("p1");
    const p2 = document.getElementById("p2");
    const p3 = document.getElementById("p3");
    const p4 = document.getElementById("p4");

    p1.textContent = players[0];
    p2.textContent = players[1];
    p3.textContent = players[2];
    p4.textContent = players[3];

    styleFirstLetter(p1, "#3CA7FF", "riverbank");
    styleFirstLetter(p2, "#3CA7FF", "riverbank");
    styleFirstLetter(p3, "#3CA7FF", "riverbank");
    styleFirstLetter(p4, "#3CA7FF", "riverbank");
}