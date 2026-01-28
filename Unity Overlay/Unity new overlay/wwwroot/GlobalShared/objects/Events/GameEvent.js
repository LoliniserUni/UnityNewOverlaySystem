import { GameState } from "./GameState.js";
import { Event_BallHit } from "./Event_BallHit.js";
import { Event_StatFeed } from "./Event_StatFeed.js";
import { Event_GoalScored } from "./Event_GoalScored.js";
import { Event_MatchEnded } from "./Event_MatchEnded.js";
import { ReplayEvent } from "./ReplayEvent.js";

export class GameEvents {
    constructor() {
        this.version = "";
        this.matchCreated = null;
        this.initialized = null;
        this.preCountdown = null;
        this.postCountdown = null;

        this.gameState = null;

        this.lastBallHit = null;
        this.lastStatFeed = null;
        this.lastGoalScored = null;
        this.lastReplayEvent = null;
        this.matchEnded = null;
    }

    handle(fullJson) {
        this.version = fullJson["sos:version"] ?? this.version;

        if (fullJson["game:match_created"])
            this.matchCreated = Date.now();

        if (fullJson["game:initialized"])
            this.initialized = Date.now();

        if (fullJson["game:pre_countdown_begin"])
            this.preCountdown = Date.now();

        if (fullJson["game:post_countdown_begin"])
            this.postCountdown = Date.now();

        if (fullJson["game:update_state"]) {
            if (!this.gameState)
                this.gameState = new GameState(fullJson["game:update_state"].game);
            else
                this.gameState.update(fullJson["game:update_state"].game);
        }

        if (fullJson["game:ball_hit"])
            this.lastBallHit = new Event_BallHit(fullJson["game:ball_hit"]);

        if (fullJson["game:statfeed_event"])
            this.lastStatFeed = new Event_StatFeed(fullJson["game:statfeed_event"]);

        if (fullJson["game:goal_scored"])
            this.lastGoalScored = new Event_GoalScored(fullJson["game:goal_scored"]);

        if (fullJson["game:replay_start"])
            this.lastReplayEvent = new ReplayEvent("start");

        if (fullJson["game:replay_end"])
            this.lastReplayEvent = new ReplayEvent("end");

        if (fullJson["game:replay_will_end"])
            this.lastReplayEvent = new ReplayEvent("will_end");

        if (fullJson["game:match_ended"])
            this.matchEnded = new Event_MatchEnded(fullJson["game:match_ended"]);
    }
}
