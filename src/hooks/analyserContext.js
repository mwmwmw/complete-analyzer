import React, { useCallback, useContext, useEffect, useState } from "react";
import useAnalyser from "./useAnalyser";

import DebugOverlay from "../components/DebugOverlay";

const AnalyserContext = React.createContext({
  values: [0.2, 0.2, 0.2],
  fft: [],
  startTime: 0,
  level: 0
});

function AnalyserProvider({
  context,
  source,
  config,
  startTime = 0,
  children,
  debug
}) {

  useAnalyser(
    context,
    source,
    (v) => {
      setAnalysis(v);
    },
    startTime,
    config.buckets
  );

  const [analysis, setAnalysis] = useState({
    values: [0.2, 0.2, 0.2],
    fft: [],
    startTime: 0,
    level: 0
  });




  return (
    <AnalyserContext.Provider value={analysis}>
      <DebugOverlay active={debug} />
      {children}
    </AnalyserContext.Provider>
  );
}

function useAnalyserContext() {
  const analysis = useContext(AnalyserContext);
  return {...analysis};
}


export { AnalyserContext, AnalyserProvider, useAnalyserContext };
