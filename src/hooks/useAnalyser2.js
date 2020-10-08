import React, { useEffect, useState, useRef, useMemo } from "react";


import VuMeter from "../Audio/VuMeter";

const DEFAULT_CONFIG = [
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

const FFT_SIZE = 32;

const DEFAULT_FFT = {
  fftSize: FFT_SIZE,
  smoothingTimeConstant: 0.4,
  maxDecibels: -10,
  minDecibels: -20
};

export default function useAnalyser(
  context,
  source,
  analysisCallback = () => { },
  startTime = 0,
  config = DEFAULT_CONFIG
) {
  const analyzer = useMemo(() => multibandAnalyzer(context, config), []);
  const fft = useMemo(() => createFFT(context, DEFAULT_FFT), []);

  useEffect(() => {
    analyzer.output.connect(fft);
    fft.connect(context.destination);
  }, []);

  useEffect(() => {
    var interval;

    if (source) {
      source.connect(analyzer.input);
      interval = setInterval(() => {
        analysisCallback(
          collectData(analyzer, fft, context, source.duration)
        );
      }, 16.67);
    }

    return () => {
      if (source) {
        source.disconnect(analyzer.input);
      }
      clearInterval(interval);
    };
  }, [context, source, analysisCallback, analyzer, fft]);
}

function createFFT(context, options = DEFAULT_FFT) {
  return new AnalyserNode(context, options);
}

function multibandAnalyzer(context, bands = DEFAULT_CONFIG) {
  const input = context.createGain();
  const dry = context.createGain();
  const output = context.createGain();
  const bypass = context.createGain();
  input.connect(dry);
  dry.connect(output);
  dry.gain.setValueAtTime(1.0, context.currentTime);
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

function createCompressor(
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

function createFilter(
  context,
  options = {
    frequency: 250,
    Q: 3,
    type: "allpass"
  }
) {
  return new BiquadFilterNode(context, options);
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
  console.log(frequencies)
  return procFFT(frequencies, new Array(FFT_SIZE / 2));
};

function collectData(analyzer, fft, context, duration) {

  const values = analyzer.buckets.map(({ volume }) => volume.volume);
  const time = context.currentTime;
  const extras = analyzer.buckets.map(({ volume }) => {
    const {hit, overage, volumeDelta } = volume;
    return {hit, overage, volumeDelta};
  })


  return { values, time, fft: [mapFFT(fft)] };
}
