import { startTimer } from "/GlobalShared/scripts/timer.js";

document.addEventListener("DOMContentLoaded", () => {
    const sceneSelect = document.getElementById("sceneSelect");
    const sceneDivs = document.querySelectorAll(".scene-controls");

    const startTimeInput = document.getElementById("startTimerVal");
    const startButton = document.getElementById("startStartTimer");
    const startTimerStatus = document.getElementById("startTimerStatus");

    updateSceneControls();
    sceneSelect.addEventListener("change", updateSceneControls);
    function updateSceneControls() {
        const selected = sceneSelect.value;

        sceneDivs.forEach(div => {
            const scenes = div.dataset.scene.split(",").map(s => s.trim()); // split & trim
            if (scenes.includes(selected)) {
                div.classList.add("active");
            } else {
                div.classList.remove("active");
            }
        });
    }

    startButton.addEventListener("click", async () => {
        const scene = sceneSelect.value;
        const val = parseInt(startTimeInput.value.trim(), 10);

        if (isNaN(val) || val <= 0) {
            startTimerStatus.textContent = "⛔ Please enter a valid time in seconds.";
            return;
        }

        try {
            await startTimer(scene, val);
            startTimerStatus.textContent = `✅ Timer started for ${val} seconds in scene "${scene}".`;
        } catch (err) {
            console.error(err);
            startTimerStatus.textContent = `⚠️ Failed to start timer for scene "${scene}".`;
        }
    });
});
