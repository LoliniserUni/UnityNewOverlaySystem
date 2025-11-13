import { startPollingTimer } from "/GlobalShared/scripts/timer.js";

document.addEventListener("DOMContentLoaded", () => {
    const timerText = document.getElementById("timerText");

    const pathParts = window.location.pathname.split("/");
    const overlayIndex = pathParts.indexOf("overlay");
    const scene = overlayIndex > 0 ? pathParts[overlayIndex - 1] : "Ending";


    timerText.textContent = scene;

    console.log("Detected scene:", scene); // Debug

    startPollingTimer(scene, (display, active) => {
        if (active) {
            timerText.textContent = display;
        } else {
            timerText.textContent = "Stream Ended";
        }
        
    });
});
