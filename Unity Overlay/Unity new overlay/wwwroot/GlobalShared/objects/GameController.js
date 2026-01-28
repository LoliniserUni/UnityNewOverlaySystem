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

        this.winnerDecided = false;

        this.initialized = false;
        this.matchCreatedTime = null;

        this.lastTime = 0;

        this.lastMatchGuid = 0; 
        this.gameNumber = 0;

        this.currentPlayerID = 0;
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

            //console.log(rawJson);
            const gameData = rawJson.data.game;

            //console.log(rawJson.data);
            const playerData = rawJson.data.players;

            this.currentPlayerID = gameData.target;

            if (!this.state) this.state = new GameState(gameData);
            else this.state.update(gameData);
            
            this.updateTeams(gameData.teams);
            this.calcWinner(gameData);
            this.updateBall(gameData.ball);
            this.updatePlayers(playerData);

            // --- New: detect a new match by match_guid ---
            if (rawJson.data.match_guid && rawJson.data.match_guid !== this.lastMatchGuid) {
                this.lastMatchGuid = rawJson.data.match_guid;
                this.gameNumber++;

                this.lastMatchEnded = null;

                this.state.winnerDecided = false;
                //console.log("New match detected! Game number:", this.gameNumber);
            }

            this.lastTime = gameData.time_seconds;
        }

        // -------------------
        // EVENTS
        // -------------------

        if (rawJson.event == "game:statfeed_event") this.lastStatFeed = new Event_StatsFeed(rawJson.data);
        if (rawJson.event == "game:goal_scored") this.lastGoal = new Event_GoalScored(rawJson.data);
        if (rawJson.event == "game:replay_start") this.lastReplayEvent = new ReplayEvent(rawJson.data);
        if (rawJson.event == "game:replay_end") this.lastReplayEvent = new ReplayEvent(rawJson.data);
        if (rawJson.event == "game:replay_will_end") this.lastReplayEvent = new ReplayEvent(rawJson.data);
        if (rawJson.event == "game:match_ended") this.lastMatchEnded = new Event_MatchEnded(rawJson.data);

    }

    calcWinner(gameData) {
        if (gameData.hasWinner && this.state.winnerDecided == false) {
            this.state.winnerDecided = true;

            const blueTeam = this.teams.get("0");
            const orangeTeam = this.teams.get("1");

            if (blueTeam.score >> orangeTeam.score) blueTeam.gameWins++;
            else orangeTeam.gameWins++;
        }
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
    updatePlayers(playersJson, maxPlayersPerTeam = 3) {
        if (!playersJson) return;

        const currentPlayerNames = new Set();

        // Temporary map of teamId → array of players to assign this update
        const teamAssignments = {};

        // Initialize team assignments
        for (const [teamId] of this.teams.entries()) {
            teamAssignments[teamId] = new Array(maxPlayersPerTeam).fill(null);
        }

        // 1️⃣ Add/update players based on name
        for (const id of Object.keys(playersJson)) {
            const data = playersJson[id];
            const name = data.name;
            currentPlayerNames.add(name);

            // Find existing player by name
            let player = [...this.players.values()].find(p => p.name === name);

            if (!player) {
                player = new Player(data);
                this.players.set(name, player);
            } else {
                player.updatePlayer(data);
            }

            // Assign player to team array at the first empty slot
            const teamId = "" + data.team;
            const teamArray = teamAssignments[teamId];

            for (let i = 0; i < teamArray.length; i++) {
                if (!teamArray[i]) {
                    teamArray[i] = player;
                    break;
                }
            }
        }

        // 2️⃣ Update actual team objects
        for (const [teamId, team] of this.teams.entries()) {
            const newPlayers = teamAssignments[teamId];

            // Remove players who are no longer in this team
            team.players = [];

            for (let i = 0; i < newPlayers.length; i++) {
                const player = newPlayers[i];
                if (player) team.addPlayer(player);
            }
        }

        // 3️⃣ Remove players who are no longer present
        for (const [name, player] of this.players.entries()) {
            if (!currentPlayerNames.has(name)) {
                // Remove from all teams
                for (const [teamId, team] of this.teams.entries()) {
                    const index = team.players.indexOf(player);
                    if (index !== -1) team.players.splice(index, 1);
                }
                this.players.delete(name);
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

