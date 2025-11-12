// GlobalShared/scripts/timer.js

/**
 * Starts polling the backend for a scene's timer.
 * @param {string} scene - Scene name (e.g. "Starting", "Ending")
 * @param {function(string):void} updateCallback - Called with formatted time string (e.g. "1:23")
 * @param {number} interval - Polling interval in milliseconds (default 200ms)
 */
export function startPollingTimer(scene, updateCallback, interval = 200) {
    async function poll() {
        try {
            const res = await fetch(`/api/${scene}/timer`);
            if (!res.ok) throw new Error("Timer fetch failed");
            const data = await res.json();

            if (data.active) {
                const total = Math.floor(data.remaining);
                const mins = Math.floor(total / 60);
                const secs = total % 60;
                updateCallback(`${mins}:${secs.toString().padStart(2, "0")}`, true);
            } else {
                updateCallback("00:00", false);
            }
        } catch (err) {
            console.error("Timer poll error:", err);
            updateCallback("--:--");
        }
    }

    poll();
    setInterval(poll, interval);
}

/**
 * Starts a new timer for the specified scene.
 * @param {string} scene
 * @param {number} durationSeconds
 */
export async function startTimer(scene, durationSeconds) {
    const res = await fetch(`/api/${scene}/startTimer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration: durationSeconds }),
    });

    if (!res.ok) throw new Error("Failed to start timer");
    return await res.json();
}
