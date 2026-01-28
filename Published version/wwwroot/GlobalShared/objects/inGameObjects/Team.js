import { Player } from "./Player.js";

export class Team {
    constructor(teamId, teamData = {}) {
        this.teamId = teamId;
        this.name = teamData.name ?? "";
        this.color_primary = teamData.color_primary ?? "";
        this.color_secondary = teamData.color_secondary ?? "";
        this.score = Number.isFinite(teamData.score) ? teamData.score : 0;
        this.gameWins = 0;

        // Array of Player instances
        this.players = [];
    }

    addPlayer(player) {
        // Accepts a Player instance
        if (player instanceof Player && !this.players.includes(player)) {
            this.players.push(player);
        }
        return player;
    }

    updatePlayer(playerData) {
        // Update existing or add new
        let existing = this.players.find(p => p.id === playerData.id);
        if (existing) {
            existing.updatePlayer(playerData);
            return existing;
        }
        const newPlayer = new Player(playerData);
        this.players.push(newPlayer);
        return newPlayer;
    }

    updateScore(newScore) {
        this.score = Number.isFinite(newScore) ? newScore : this.score;
    }

    get activePlayers() {
        return this.players.filter(p => p.hasCar && !p.isDead);
    }

    toJSON() {
        return {
            teamId: this.teamId,
            name: this.name,
            score: this.score,
            players: this.players.map(p => p.toJSON())
        };
    }
}
