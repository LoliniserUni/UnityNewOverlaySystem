import { startTimer } from "/GlobalShared/scripts/timer.js";
import { loadPlayers, getScrollText } from "/GlobalShared/scripts/functions.js";

document.addEventListener("DOMContentLoaded", () => {
    const sceneSelect = document.getElementById("sceneSelect");
    const sceneDivs = document.querySelectorAll(".scene-controls");

    const startTimeInput = document.getElementById("startTimerVal");
    const startButton = document.getElementById("startStartTimer");
    const startTimerStatus = document.getElementById("startTimerStatus");

    const rosterSubmit = document.getElementById("submitRoster");

    const scrollTextSubmit = document.getElementById("submitScrollingText");

    loadPlayers("Player1", "Player2", "Player3", "Player4");
    updateSceneControls();
    getScrollText("ScrollingText");

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

    rosterSubmit.addEventListener("click", async () => {
        const status = document.getElementById("rosterStatus");

        const p1 = document.getElementById("Player1").value.trim();
        const p2 = document.getElementById("Player2").value.trim();
        const p3 = document.getElementById("Player3").value.trim();
        const p4 = document.getElementById("Player4").value.trim();

        if (p1 === "" || p2 === "" || p3 === "" || p4 === "") {
            status.textContent = "⛔ One or more players are empty.";
            return;
        }

        try {
            const response = await fetch(`/api/controller/config`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ players: [p1, p2, p3, p4] })
            });

            if (!response.ok) throw new Error("Server error");

            status.textContent = "✅ Roster updated successfully!";
        } catch (err) {
            console.error(err);
            status.textContent = "⚠️ Failed to update roster.";
        }
    });

    scrollTextSubmit.addEventListener("click", async () => {
        const status = document.getElementById("scrollingTextStatus");

        const scrollText = document.getElementById("ScrollingText").value.trim();

        if (scrollText === "") {
            status.textContent = "⛔ Text cant be empty"; 
            return;
        }

        try {
            const response = await fetch(`/api/controller/config`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scrollText: scrollText })
            });

            if (!response.ok) throw new Error("Server error");

            status.textContent = "✅ Text updated successfully!";

        } catch (err) {
            console.error(err);
            status.textContent = "⚠️ Failed to update text.";
        }
    });
});
