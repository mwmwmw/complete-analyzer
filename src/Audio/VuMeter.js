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
    this._updateIntervalInMS = updateIntervalInMS;
    this._volume = 0;
    this._volumeDelta = 0;
    this._hit = 0;
    this._overage = 0;
    this.port.onmessage = event => {
        const {volume, volumeDelta, hit, overage} = event.data;
        this._volume = volume;
        this._volumeDelta = volumeDelta;
        this._hit = hit;
        this._overage = overage;
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
  set sensitivity(value) {
    const sense = this.parameters.get('sensitivity');
    sense.setValueAtTime(value, this.context.currentTime)
  }

  set smooth(value) {
    const sense = this.parameters.get('smooth');
    sense.setValueAtTime(value, this.context.currentTime)
  }



};