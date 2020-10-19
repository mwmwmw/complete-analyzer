const SMOOTHING_FACTOR = 0.99;
const MINIMUM_VALUE = 0.000001;
var index = 0;
let sumL = 0;
let sumR = 0;
registerProcessor('phasescope', class extends AudioWorkletProcessor {
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
        this._rawBalance = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
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
        if(inputs[0].length === 2) {     
        if (inputs[0][0].length > 0) {

            sumL = 0;
            sumR = 0;

            // Calculated the squared-sum.
            for (let i = 0; i < inputs[0][0].length; ++i) {
                sumL -= inputs[0][0][i] * inputs[0][0][i];
                sumR += inputs[0][1][i] * inputs[0][1][i];
            }

            this._rawBalance[index] = (sumL + sumR);
            index = (index + 1)%this._rawBalance.length;
            // Update and sync the volume property with the main thread.
            this._nextUpdateFrame -= inputs[0][0].length;
            if (this._nextUpdateFrame < 0) {
                this._nextUpdateFrame += this.intervalInFrames;
                this.port.postMessage({
                    balance: this._rawBalance
                });
            }
        }
    }
        // Keep on processing if the volume is above a threshold, so that
        // disconnecting inputs does not immediately cause the meter to stop
        // computing its smoothed value.
        return true; //this._volume >= MINIMUM_VALUE;
    }
});