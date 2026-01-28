// -------------------------
// Event: Goal Scored
// -------------------------
export class Event_GoalScored {
    constructor(data) {
        this.goalSpeed = data.goalspeed ?? 0;

        this.scorer = data.scorer ? {
            id: data.scorer.id ?? "",
            name: data.scorer.name ?? "",
            teamNum: data.scorer.teamnum ?? 0
        } : null;

        this.ballLastTouch = data.ball_last_touch ? {
            player: data.ball_last_touch.player ?? "",
            speed: data.ball_last_touch.speed ?? 0
        } : null;

        this.impactLocation = data.impact_location ? {
            X: data.impact_location.X ?? 0,
            Y: data.impact_location.Y ?? 0
        } : null;
    }
}