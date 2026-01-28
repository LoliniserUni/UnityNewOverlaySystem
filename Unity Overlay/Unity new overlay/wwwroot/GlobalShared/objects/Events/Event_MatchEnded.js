
// -------------------------
// Event: Match Ended
// -------------------------
export class Event_MatchEnded {
    constructor(data) {
        this.winnerTeamNum = data.winner_team_num ?? null;
    }
}
