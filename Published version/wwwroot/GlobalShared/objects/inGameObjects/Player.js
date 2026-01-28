
export class Player {
    constructor(playerData = {}) {
        this.loadFromData(playerData);

        this.totAssists = 0;
        this.totGoals = 0;
        this.totSaves = 0;
        this.totShots = 0;
        this.totDemos = 0;
        this.totCarTouches = 0;
        this.totTouches = 0;
        this.totScore = 0;
    }

    addToTotals() {
        this.totAssists += this.assists;
        this.totGoals += this.goals;
        this.totSaves += this.saves;
        this.totShots += this.shots;
        this.totDemos += this.demos;
        this.totCarTouches += this.cartouches;
        this.totTouches += this.touches
        this.totScore += this.score;
    }

    loadFromData(playerData = {}) {
        this.id = playerData.id || null;
        this.primaryID = playerData.primaryID || null;

        this.name = playerData.name || "";
        this.team = Number.isFinite(playerData.team) ? playerData.team : null;

        //update stats
        this.updatePlayer(playerData.stats || {});
    }

    updatePlayer(stats = {}) {
        // player options
        this.isDead = typeof stats.isDead === "boolean" ? stats.isDead : false;

        // Last attacker
        this.attacker = stats.attacker || null;

        // Boost & physics
        this.boost = Number.isFinite(stats.boost) ? stats.boost : 0;
        this.speed = Number.isFinite(stats.speed) ? stats.speed : 0;

        // Player stats
        this.goals = Number.isFinite(stats.goals) ? stats.goals : 0;
        this.assists = Number.isFinite(stats.assists) ? stats.assists : 0;
        this.saves = Number.isFinite(stats.saves) ? stats.saves : 0;
        this.shots = Number.isFinite(stats.shots) ? stats.shots : 0;
        this.demos = Number.isFinite(stats.demos) ? stats.demos : 0;
        this.cartouches = Number.isFinite(stats.cartouches) ? stats.cartouches : 0;
        this.touches = Number.isFinite(stats.touches) ? stats.touches : 0;
        this.score = Number.isFinite(stats.score) ? stats.score : 0;

        this.location = {
            X: Number.isFinite(stats.location?.X) ? stats.location.X : 0,
            Y: Number.isFinite(stats.location?.Y) ? stats.location.Y : 0,
            Z: Number.isFinite(stats.location?.Z) ? stats.location.Z : 0,
            pitch: Number.isFinite(stats.location?.pitch) ? stats.location.pitch : 0,
            roll: Number.isFinite(stats.location?.roll) ? stats.location.roll : 0,
            yaw: Number.isFinite(stats.location?.yaw) ? stats.location.yaw : 0
        };

        this.hasCar = typeof stats.hasCar === "boolean" ? stats.hasCar : false;

        this.onGround = typeof stats.onGround === "boolean" ? stats.onGround : false;
        this.onWall = typeof stats.onWall === "boolean" ? stats.onWall : false;

        this.isPowersliding = typeof stats.isPowersliding === "boolean" ? stats.isPowersliding : false;
        this.isSonic = typeof stats.isSonic === "boolean" ? stats.isSonic : false;

        this.shortcut = Number.isFinite(stats.shortcut) ? stats.shortcut : null;

    }

    toJSON = function () {
        return {
            id: this.id,
            name: this.name,
            team: this.team,
            score: this.score,
            goals: this.goals,
            assists: this.assists,
            boosts: this.boost,
            speed: this.speed
            // add other fields you want
        };
    };
}
