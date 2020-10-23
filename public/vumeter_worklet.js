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
        this.pack = {
            volume:0, volumeDelta:0, hit:0, overage:0
        }
        this._updateIntervalInMS = options.processorOptions.updateIntervalInMS | 16.67;
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
            let sum = 0;
            // Calculated the squared-sum.
            for (let i = 0; i < input[0].length; ++i)
                sum += input[0][i] * input[0][i];
            // Calculate the RMS level and update the volume.
            this._volume = Math.max(Math.sqrt(sum / input[0].length), this._volume * parameters['smooth'][0]);
            // Update and sync the volume property with the main thread.
            this._nextUpdateFrame -= inputs[0][0].length;
            if (this._nextUpdateFrame < 0) {
                const delta = this._volume - this._lastVolume;
                this._nextUpdateFrame += this.intervalInFrames;
                this.pack.volume = this._volume;
                this.pack.volumeDelta = delta;
                this.pack.hit = delta > parameters['sensitivity'][0];
                this.port.postMessage(this.pack);
                this._lastVolume = this._volume;
            }
            
        }
        // Keep on processing if the volume is above a threshold, so that
        // disconnecting inputs does not immediately cause the meter to stop
        // computing its smoothed value.
        return true; //this._volume >= MINIMUM_VALUE;
    }
});