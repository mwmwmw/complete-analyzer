import { createFFT, MultibandAnalyzer, DEFAULT_CONFIG, DEFAULT_FFT, FFT_SIZE } from "./MultibandAnalyzer"

import VuMeter from "./VuMeter";
import PhaseScope from "./PhaseScope";

export default class FullAnalyser {

    constructor(context, config = DEFAULT_CONFIG) {
        this.context = context;
        this.input = new GainNode(context);
        this.analyser = MultibandAnalyzer(context, config);
        this.fft = createFFT(context, DEFAULT_FFT);
        this.phase = new PhaseScope(context);
        this.vu = new VuMeter(context);
        this.connected = [];

        this.input.connect(this.analyser.input);
        this.input.connect(this.fft);
        this.input.connect(this.phase);
        this.input.connect(this.vu);
        this.gain = 0;
    }

    watch(source) {
        this.connected.push(source);
        source.connect(this.input);
    }

    unwatch (source) {
        
        var index = this.connected.findIndex((e)=>e===source);
        if(index > -1) {     
            this.connected.splice(index, 1);
            source.disconnect(this.input);
        }
    }

    analyse(gain = 1, bucketGain = []) {
        return collectData(this.analyser, this, this.context, gain, bucketGain)
    }

}

const minmax = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const fftArray = new Array(FFT_SIZE / 2);
const procFFT = (data, array = fftArray) => {
    for (var i = 0; i < array.length; i++) {
        array[i] = minmax(1 - Math.log10(Math.abs(data[i]) / 16));
    }
    return array;
};

const mapCompressor = (b) => {
    return minmax(Math.log(Math.abs(b.comp.reduction) / 20));
};

const mapFFT = (fft) => {
    const frequencies = new Float32Array(fft.frequencyBinCount);
    fft.getFloatFrequencyData(frequencies);
    return procFFT(frequencies, new Array(FFT_SIZE / 2));
};

function collectData(analyzer, analyzerElements, context, gain, bucketGain = []) {

    const { fft, vu, phase, connected } = analyzerElements;
    let time = context.currentTime;
    if(connected && connected[0].time) {
        time = connected[0].time;
    }
    let position = connected[0].position || 0.5;

    console.log(bucketGain)

    const values = analyzer.buckets.map(({ volume }, i) => volume.volume * bucketGain[i]);

      const extras = analyzer.buckets.map(({ volume }) => {
        const {hit, overage, volumeDelta } = volume;
        return {hit, overage, volumeDelta};
      })

    return { values, time, fft: [mapFFT(fft)], volume: vu.volume, phase: phase.balance, extras, time, position };
}
