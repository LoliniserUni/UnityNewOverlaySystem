import { Ball } from "./inGameObjects/Ball.js";
import { Team } from "./inGameObjects/Team.js";

export class GameState {
    constructor(data = {}) {
        this.arena = data.arena || "";
        this.time = Number.isFinite(data.time) ? data.time : 0;

        this.hasWinner = !!data.hasWinner;
        this.hasTarget = !!data.hasTarget;
        this.isOT = !!data.isOT;
        this.isReplay = !!data.isReplay;

        this.target = data.target || null;
        this.winner = data.winner || null;

        this.ball = new Ball(data.ball || {});

        this.teams = {
            0: new Team(0, data.teams?.["0"]),
            1: new Team(1, data.teams?.["1"])
        };
    }

    update(data = {}) {
        this.time = Number.isFinite(data.time) ? data.time : this.time;
        this.hasWinner = data.hasWinner ?? this.hasWinner;
        this.hasTarget = data.hasTarget ?? this.hasTarget;
        this.isOT = data.isOT ?? this.isOT;
        this.isReplay = data.isReplay ?? this.isReplay;

        this.winner = data.winner ?? this.winner;
        this.target = data.target ?? this.target;

        if (data.ball) this.ball.update(data.ball);

        if (data.teams) {
            this.teams[0].score = data.teams["0"]?.score ?? this.teams[0].score;
            this.teams[1].score = data.teams["1"]?.score ?? this.teams[1].score;
        }
    }
}
