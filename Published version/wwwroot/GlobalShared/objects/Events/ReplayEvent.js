export class ReplayEvent {
    constructor(type) {
        this.type = type; // "start", "end", "will_end"
        this.timestamp = Date.now();
    }
}
