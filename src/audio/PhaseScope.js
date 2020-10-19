export default class PhaseScope extends AudioWorkletNode {
  constructor(context, updateIntervalInMS = 16.67) {
    super(context, 'phasescope', {
      numberOfInputs: 2,
      numberOfOutputs: 0,
      channelCount: 1,
      processorOptions: {
        updateIntervalInMS
      }
    });
    this._updateIntervalInMS = updateIntervalInMS;
    this._balance = [];
    this.port.onmessage = event => {
      if (event.data.balance) {
        this._balance = event.data.balance;
      }
    }
    this.port.start();
  }
  get updateInterval() {
    return this._updateIntervalInMS;
  }

  get balance() {
    return this._balance;
  }
  set updateInterval(updateIntervalInMS) {
    this._updateIntervalInMS = updateIntervalInMS;
    this.port.postMessage({ updateIntervalInMS: updateIntervalInMS });
  }
};