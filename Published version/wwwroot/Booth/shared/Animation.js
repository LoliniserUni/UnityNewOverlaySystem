export class Animation {
    constructor(anim, animFolder,appearStart) {
        this.anim = document.getElementById(anim); 
        const root = "../shared/Assets/";
        this.animFolder = root + animFolder + "/";
        this.frames = [];
        this.index = appearStart;
        this.appearStart = appearStart;
        this.hasAppeared = false;
        this.playedLoop = true;
    }

    async loadFrames() {
        let frameNumber = 1;

        while (true) {
            const cFile = `${this.animFolder}${frameNumber}.png`;
            const exists = await this.checkFileExists(cFile);
            if (!exists) break;

            this.frames.push(cFile);
            frameNumber++;
        }

        this.totalFrames = this.frames.length;
        console.log(`Loaded ${this.totalFrames} frames`);
    }

    async checkFileExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    resetLoop() {
        this.playedLoop = false;
    }

    playAnimation() {
        if (!this.hasAppeared) {
            this.loadAppear();
        } else if(!this.playedLoop) {
            this.loadNextFrame();
            if (this.index == 0) {
                this.playedLoop = true;
            }
        }
    }

    loadNextFrame() {
        if (!this.frames.length) return;

        this.anim.src = this.frames[this.index];
        this.index = (this.index + 1) % this.frames.length;
    }

    loadAppear() {
        if (this.index == this.frames.length) index = 0;
        if (this.hasAppeared) {
            //do nothing
            return;
        } else {
            if (!this.frames.length) return;

            this.anim.src = this.frames[this.index];
            this.index = (this.index + 1) % this.frames.length;

            if (this.index == 0) {
                this.hasAppeared = true;
            }
        }
    }

    startRandomReset(minDelay = 2000, maxDelay = 5000) {
        const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;

        setTimeout(() => {
            this.resetLoop();
            console.log('Loop reset for animation!', this);

            // Schedule next random reset
            this.startRandomReset(minDelay, maxDelay);
        }, randomDelay);
    }
}
