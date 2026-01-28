export class Ball {
    constructor(data = {}) {
        this.location = {
            X: Number.isFinite(data.location?.X) ? data.location.X : 0,
            Y: Number.isFinite(data.location?.Y) ? data.location.Y : 0,
            Z: Number.isFinite(data.location?.Z) ? data.location.Z : 0
        };

        this.speed = Number.isFinite(data.speed) ? data.speed : 0;
        this.team = Number.isFinite(data.team) ? data.team : null;
    }

    update(data = {}) {
        if (data.location) {
            this.location.X = data.location.X;
            this.location.Y = data.location.Y;
            this.location.Z = data.location.Z;
        }
        this.speed = data.speed ?? this.speed;
        this.team = data.team ?? this.team;
    }
}
