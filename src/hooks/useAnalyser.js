import React, { useEffect, useState, useRef, useMemo } from "react";

import FullAnalyser from "../audio/FullAnalyser";

export default function useAnalyser(
  context,
  source,
  analysisCallback = () => { },
  config
) {
  const analyser = useMemo(()=>new FullAnalyser(context, config), [])
  const interval = useRef();
  const gain = useRef(config.map(v=>1));
  const globalGain = useRef(1);
  const sensitivity = useRef(0.996);

  function setGain (i,  value) {
    gain.current[i] = value;
  }

  function setGlobalGain (value) {
    globalGain.current = value;
  }

  function setSensitivity(value) {
    sensitivity.current = value;
  }

  useEffect(() => {
    const call = () => {
      analysisCallback(
        analyser.analyse(globalGain.current, gain.current, sensitivity.current)
      );
      interval.current = requestAnimationFrame(call)
    }
    
    if (source) {
      analyser.watch(source)
      interval.current = requestAnimationFrame(call)
    }

    return () => {
      if (source) {
        analyser.unwatch(source)
      }
      cancelAnimationFrame(interval.current)
    };
  }, [context, source]);

  return {analyser, setGain, setGlobalGain, setSensitivity, sensitivity: sensitivity.current, gain: gain.current, globalGain: globalGain.current}

}