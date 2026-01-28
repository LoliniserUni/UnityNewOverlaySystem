export class Event_BallHit {
    constructor(data = {}) {
        this.ball = {
            location: {
                X: data.ball?.location?.X ?? 0,
                Y: data.ball?.location?.Y ?? 0,
                Z: data.ball?.location?.Z ?? 0
            },
            pre_hit_speed: data.ball?.pre_hit_speed ?? 0,
            post_hit_speed: data.ball?.post_hit_speed ?? 0
        };

        this.player = {
            id: data.player?.id || null,
            name: data.player?.name || ""
        };
    }
}
