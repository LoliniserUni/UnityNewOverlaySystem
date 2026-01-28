

// -------------------------
// Event: Replay
// -------------------------
export class ReplayEvent {
    constructor(data) {
        // Depending on the structure you get, sometimes it is just a string
        if (typeof data === "string") {
            this.timestamp = data;
        } else {
            // Could expand with more replay info if needed
            Object.assign(this, data);
        }
    }
}
