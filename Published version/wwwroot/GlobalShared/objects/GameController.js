// --- GAME OBJECTS ---
import { GameState } from "./GameState.js";

// --- EVENTS ---
import { Event_BallHit } from "./Events/Event_BallHit.js";
import { Event_StatsFeed } from "./Events/Event_StatsFeed.js";
import { Event_GoalScored } from "./Events/Event_GoalScored.js";
import { Event_MatchEnded } from "./Events/Event_MatchEnded.js";
import { ReplayEvent } from "./Events/ReplayEvent.js";

// --- IN-GAME OBJECTS ---
import { Player } from "./inGameObjects/Player.js";
import { Team } from "./inGameObjects/Team.js";
import { Ball } from "./inGameObjects/Ball.js";

export class GameController {

    constructor() {
        this.version = "";
        this.state = null;        // GameState instance
        this.players = new Map(); // id → Player
        this.teams = new Map();   // 0 → Team Blue, 1 → Team Orange
        this.ball = new Ball();

        // last events
        this.lastBallHit = null;
        this.lastStatFeed = null;
        this.lastGoal = null;
        this.lastReplayEvent = null;
        this.lastMatchEnded = null;

        this.initialized = false;
        this.matchCreatedTime = null;

        this.lastTime = 0;

        this.gameNumber = 0;
    }

    // ------------------------------------------------------------
    // MAIN ENTRY POINT — call this with every SOS WebSocket message
    // ------------------------------------------------------------
    handle(rawJson) {
        

        if (!rawJson) return;

        // Version
        if (rawJson["sos:version"]) this.version = rawJson["sos:version"];

        // Match lifecycle
        if (rawJson["game:match_created"]) this.matchCreatedTime = Date.now();
        if (rawJson["game:initialized"]) this.initialized = true;

        // ---------------------
        // GAME UPDATE STATE
        // ---------------------
        if (rawJson.event == "game:update_state") {
            const gameData = rawJson.data.game;
            const playerData = rawJson.data.players;

            if (!this.state) this.state = new GameState(gameData);
            else this.state.update(gameData);
            
            this.updateTeams(gameData.teams);
            
            this.updateBall(gameData.ball);
            this.updatePlayers(playerData);

            // detect new game
            if (gameData.time_seconds == 300 && gameData.time_seconds > this.lastTime) {
                this.gameNumber++;
            }

            this.lastTime = gameData.time_seconds;
        }

        // -------------------
        // EVENTS
        // -------------------

        if (rawJson.event == "game:ball_hit") this.lastBallHit = new Event_BallHit(rawJson.data);
        if (rawJson.event == "game:statfeed_event") this.lastStatFeed = new Event_StatsFeed(rawJson.data);
        if (rawJson.event == "game:goal_scored") this.lastGoal = new Event_GoalScored(rawJson.data);
        if (rawJson.event == "game:replay_start") this.lastReplayEvent = new ReplayEvent(rawJson.data);
        if (rawJson.event == "game:replay_end") this.lastReplayEvent = new ReplayEvent(rawJson.data);
        if (rawJson.event == "game:replay_will_end") this.lastReplayEvent = new ReplayEvent(rawJson.data);
        if (rawJson.event == "game:match_ended") this.lastMatchEnded = new Event_MatchEnded(rawJson.data);

    }

    setPlayerTotals() {
        for (const [teamId, team] of this.teams.entries()) {
            for (const player of team.players) {
                player.addToTotals();
                player.resetVals();
            }
        }
    }

    // ------------------------------------------------------------
    // TEAM MANAGEMENT
    // ------------------------------------------------------------
    updateTeams(teamJson) {
        if (!teamJson) return;

        for (const id of Object.keys(teamJson)) {
            const data = teamJson[id];

            if (!this.teams.has(id)) this.teams.set(id, new Team(id, data));
            else {
                const existing = this.teams.get(id);
                const teamScore = data.score;
                existing.updateScore(teamScore);
                

            }
            /*else this.teams.get(id).update(data);*/
        }
    }

    // ------------------------------------------------------------
    // PLAYER MANAGEMENT
    // ------------------------------------------------------------
    updatePlayers(playersJson) {
        if (!playersJson) return;

        for (const id of Object.keys(playersJson)) {
            const data = playersJson[id];

            let player = this.players.get(id);

            if (!player) {
                player = new Player(data);
                this.players.set(id, player);
            } else {
                player.updatePlayer(data);
            }

            // 🔥 ALWAYS ensure team assignment is correct
            const teamId = "" + data.team;
            const team = this.teams.get(teamId);

            if (team && !team.players.includes(player)) {
                // Player is new to this team OR re-added after match
                team.addPlayer(player);
            }
        }
    }


    // ------------------------------------------------------------
    // BALL
    // ------------------------------------------------------------
    updateBall(ballJson) {
        if (!ballJson) return;
        this.ball.update(ballJson);
    }
}
