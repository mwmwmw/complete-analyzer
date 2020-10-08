export default class VUMeterNode extends AudioWorkletNode {
  constructor(context, updateIntervalInMS = 16.67) {
    super(context, 'vumeter', {
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 1,
      processorOptions: {
        updateIntervalInMS
      }
    });
    // States in AudioWorkletNode
    this._updateIntervalInMS = updateIntervalInMS;
    this._volume = 0;
    this._volumeDelta = 0;
    this._hit = 0;
    this._overage = 0;
    // Handles updated values from AudioWorkletProcessor
    this.port.onmessage = event => {
      if (event.data.volume) {
        this._volume = event.data.volume;
        this._volumeDelta = event.data.volumeDelta;
        this._hit = event.data.hit;
        this._overage = event.data.overage;
      }
    }
    this.port.start();
  }
  get updateInterval() {
    return this._updateIntervalInMS;
  }

  get volume() {
    return this._volume;
  }
  get volumeDelta() {
    return this._volumeDelta;
  }
  get hit() {
    return this._hit;
  }
  get overage() {
    return this._overage;
  }
  set updateInterval(updateIntervalInMS) {
    this._updateIntervalInMS = updateIntervalInMS;
    this.port.postMessage({ updateIntervalInMS: updateIntervalInMS });
  }

};