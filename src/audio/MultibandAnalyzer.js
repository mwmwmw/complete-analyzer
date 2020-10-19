import VuMeter from "./VuMeter";

export const DEFAULT_CONFIG = [
    {
        filter: {
            frequency: 250,
            Q: 3,
            type: "lowpass"
        },
        compressor: {
            threshold: -60,
            knee: 1,
            ratio: 10,
            attack: 0.005,
            release: 0.005
        }
    },
    {
        filter: { frequency: 1000, Q: 2, type: "bandpass" },
        compressor: {
            threshold: -60,
            knee: 1,
            ratio: 10,
            attack: 0.01,
            release: 0.01
        }
    },
    {
        filter: { frequency: 8000, Q: 4, type: "highpass" },
        compressor: {
            threshold: -60,
            knee: 1,
            ratio: 10,
            attack: 0.01,
            release: 0.01
        }
    }
];

export const FFT_SIZE = 32;

export const DEFAULT_FFT = {
    fftSize: FFT_SIZE,
    smoothingTimeConstant: 0.4,
    maxDecibels: -10,
    minDecibels: -20
};

export function createFFT(context, options = DEFAULT_FFT) {
    return new AnalyserNode(context, options);
}

export function MultibandAnalyzer(context, bands = DEFAULT_CONFIG) {
    const input = context.createGain();
    const dry = context.createGain();
    const output = context.createGain();
    const bypass = context.createGain();
    input.connect(dry);
    dry.connect(output);
    dry.gain.setValueAtTime(0.0, context.currentTime);
    bypass.gain.setValueAtTime(0.0, context.currentTime);
    bypass.connect(output);
    const buckets = bands.map((options) => {
        const filter = createFilter(context, options.filter);
        const comp = createCompressor(context, options.compressor);
        const volume = new VuMeter(context, 16.67);

        input.connect(filter);
        filter.connect(volume);
        filter.connect(comp);
        comp.connect(bypass);

        return { filter, comp, volume };

    });

    return {
        input,
        output,
        buckets
    };
}

export function createCompressor(
    context,
    options = {
        threshold: -60,
        knee: 1,
        ratio: 10,
        attack: 0.01,
        release: 0.01
    }
) {
    return new DynamicsCompressorNode(context, options);
}

export function createFilter(
    context,
    options = {
        frequency: 250,
        Q: 3,
        type: "allpass"
    }
) {
    return new BiquadFilterNode(context, options);
}