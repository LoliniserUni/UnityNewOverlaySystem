import { startTimer } from "/GlobalShared/scripts/timer.js";
import { loadPlayers, getScrollText, getCasters} from "/GlobalShared/scripts/functions.js";

document.addEventListener("DOMContentLoaded", () => {
    const sceneSelect = document.getElementById("sceneSelect");
    const sceneDivs = document.querySelectorAll(".scene-controls");

    const startTimeInput = document.getElementById("startTimerVal");
    const startButton = document.getElementById("startStartTimer");
    const startTimerStatus = document.getElementById("startTimerStatus");

    const rosterSubmit = document.getElementById("submitRoster");

    const scrollTextSubmit = document.getElementById("submitScrollingText");

    const casterSubmit = document.getElementById("submitCasters");

    console.log("Caster submit button =", casterSubmit);

    loadPlayers("Player1", "Player2", "Player3", "Player4");
    updateSceneControls();
    getScrollText("ScrollingText");
    getCasters("caster1", "caster2");

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

    casterSubmit.addEventListener("click", async () => {
        console.log("hi");
        const statusEl = document.getElementById("casterStatus");
        const c1 = document.getElementById("caster1").value.trim();
        const c2 = document.getElementById("caster2").value.trim();

        if (!c1 || !c2) {
            statusEl.textContent = "⛔ One or more casters are empty.";
            return;
        }

        // disable UI while submitting
        casterSubmit.disabled = true;
        statusEl.textContent = "Saving...";

        try {
            const response = await fetch(`/api/controller/config`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ caster1: c1, caster2: c2 })
            });

            // log for debugging
            console.log("POST /api/controller/config status:", response.status);

            if (!response.ok) {
                // try to read response body for error info
                let text;
                try { text = await response.text(); } catch { text = "(no body)"; }
                throw new Error(`Server returned ${response.status}: ${text}`);
            }

            // if your server returns JSON, parse it (optional)
            let json;
            try { json = await response.json(); } catch (e) { json = null; }

            statusEl.textContent = "✅ Casters updated successfully!";
            console.log("Server response:", json);
        } catch (err) {
            console.error("Failed to update casters:", err);
            statusEl.textContent = "⚠️ Failed to update casters. See console/network tab.";
        } finally {
            casterSubmit.disabled = false;
        }
    });


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
