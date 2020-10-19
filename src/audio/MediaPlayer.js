

export default class MediaPlayer extends AudioBufferSourceNode {

    constructor () {
        super(...arguments);
        this._startTime = 0;
    }

    start () {
        super.start(arguments);
        this._startTime(time)
    }


}