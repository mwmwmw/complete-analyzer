import React, { useEffect, useState, useRef, useMemo } from "react";

import FullAnalyser from "../audio/FullAnalyser";

export default function useAnalyser(
  context,
  source,
  analysisCallback = () => { },
  startTime = 0,
  config
) {
  const analyser = useMemo(()=>new FullAnalyser(context, config), [])
  const interval = useRef();

  useEffect(() => {
    const call = () => {
      analysisCallback(
        analyser.analyse()
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
}