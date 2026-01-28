export class Event_MatchEnded {
    constructor(data = {}) {
        this.winner_team_num = data.winner_team_num ?? null;
    }
}
