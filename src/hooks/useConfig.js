import React, { useMemo, useState } from "react";

const INPUT_TYPES = {
  FILE: "FILE",
  AUDIO_DEVICE: "INPUT"
};

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

const CONFIG = {
  program: "My Program",
  buckets: DEFAULT_CONFIG,
  input: INPUT_TYPES.FILE,
  deviceId: null
};

function verify(obj) {
  if (obj && Array.isArray(obj) && obj.length > 0) {
    return obj.reduce((a, b) => {
      return (
        a &&
        Array.isArray(b.buckets) &&
        verifyBuckets(b.buckets) &&
        Object.keys(INPUT_TYPES).includes(b.input)
      );
    }, true);
  }
  return false;
}

function verifyBuckets(buckets) {
  const verified = buckets.reduce((a, b) => {
    return a && b["filter"] && b["compressor"];
  }, true);
  if (!verified) {
    throw new Error("Buckets Invalid");
  }
  return verified;
}

export default function useConfig(index = 0) {
  const [configs, setConfigs] = useState([CONFIG]);

  function load(url, options) {
    fetch(url, options)
      .then((result) => result.json())
      .then((result) => {
        if (verify(result)) {
          setConfigs(result);
        } else {
          throw new Error("Invalid Config");
        }
      });
  }

  function toJSON(index) {
    if (index) {
      return JSON.stringify(configs[index]);
    }
    return JSON.stringify(configs);
  }

  const config = useMemo(() => configs[index], [index, configs]);

  return {
    config,
    setConfigs,
    load,
    toJSON
  };
}
