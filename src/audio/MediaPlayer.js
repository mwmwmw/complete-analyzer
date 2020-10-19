

export default class MediaPlayer extends AudioBufferSourceNode {

    constructor () {
        super(...arguments);
        this._startTime = 0;
        console.log(this.buffer)
    }

    start () {
        super.start(...arguments);
        this._startTime = arguments[0];
    }

    set buffer (value) {
        super.buffer = value;
        this.duration = (value.length/value.sampleRate);
    }

    get time () {
        return this.context.currentTime - this._startTime;
    }

    get position () {
        return this.time / this.duration;
    }

}