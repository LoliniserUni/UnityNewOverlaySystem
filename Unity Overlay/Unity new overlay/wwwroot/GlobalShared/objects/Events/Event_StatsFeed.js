export class Event_StatsFeed {
    constructor(data) {
        this.eventName = data.event_name ?? "";
        this.type = data.type ?? "";

        this.mainTarget = data.main_target ? {
            id: data.main_target.id ?? "",
            name: data.main_target.name ?? "",
            teamNum: data.main_target.team_num ?? 0
        } : null;

        this.secondaryTarget = data.secondary_target ? {
            id: data.secondary_target.id ?? "",
            name: data.secondary_target.name ?? "",
            teamNum: data.secondary_target.team_num ?? 0
        } : null;
    }
}