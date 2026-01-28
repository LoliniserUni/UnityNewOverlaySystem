export class Event_GoalScored {
    constructor(data = {}) {
        this.goalspeed = data.goalspeed ?? 0;

        this.ball_last_touch = {
            player: data.ball_last_touch?.player || null,
            speed: data.ball_last_touch?.speed ?? 0
        };

        this.impact_location = {
            X: data.impact_location?.X ?? 0,
            Y: data.impact_location?.Y ?? 0
        };

        this.scorer = {
            id: data.scorer?.id || null,
            name: data.scorer?.name || "",
            teamnum: data.scorer?.teamnum ?? null
        };
    }
}
