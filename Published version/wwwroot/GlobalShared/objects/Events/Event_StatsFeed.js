export class Event_StatsFeed {
    constructor(data = {}) {
        this.event_name = data.event_name || "";
        this.type = data.type || "";

        this.main_target = data.main_target || null;
        this.secondary_target = data.secondary_target || null;
    }
}
