const SMOOTHING_FACTOR = 0.99;
const MINIMUM_VALUE = 0.000001;
registerProcessor('vumeter', class extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: 'threshold',
            defaultValue: 0.2,
            minValue: 0,
            maxValue: 1,
            automationRate: 'k-rate'
        }, {
            name: 'sensitivity',
            defaultValue: 0.1,
            minValue: 0,
            maxValue: 1,
            automationRate: 'k-rate'
        }, {
            name: 'smooth',
            defaultValue: 0.99,
            minValue: 0,
            maxValue: 1,
            automationRate: 'k-rate'
        }];
    }


    constructor(options) {
        super();
        this._volume = 0;
        this._lastVolume = 0;
        this._updateIntervalInMS = options.processorOptions.updateIntervalInMS;
        this._nextUpdateFrame = this._updateIntervalInMS;
        this.port.onmessage = event => {
            if (event.data.updateIntervalInMS)
                this._updateIntervalInMS = event.data.updateIntervalInMS;
        }
    }
    get intervalInFrames() {
        return this._updateIntervalInMS / 1000 * sampleRate;
    }
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input.length > 0) {
            const samples = input[0];
            let sum = 0;
            let rms = 0;

            // Calculated the squared-sum.
            for (let i = 0; i < samples.length; ++i)
                sum += samples[i] * samples[i];
            // Calculate the RMS level and update the volume.
            rms = Math.sqrt(sum / samples.length);
            this._volume = Math.max(rms, this._volume * parameters['smooth'][0]);
            // Update and sync the volume property with the main thread.
            this._nextUpdateFrame -= samples.length;
            if (this._nextUpdateFrame < 0) {
                this._nextUpdateFrame += this.intervalInFrames;
                this.port.postMessage({
                    volume: this._volume,
                    volumeDelta: this._volume - this._lastVolume,
                    hit: this._volume > parameters['threshold'][0] && this._volume - this._lastVolume > parameters['sensitivity'][0],
                    overage: Math.max(0, this._volume - parameters['threshold'][0]),
                });
            }
            this._lastVolume = this._volume;
        }
        // Keep on processing if the volume is above a threshold, so that
        // disconnecting inputs does not immediately cause the meter to stop
        // computing its smoothed value.
        return true; //this._volume >= MINIMUM_VALUE;
    }
});