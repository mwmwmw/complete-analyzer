import React, { useState } from "react";
import useAnalyser from "./useAnalyser2";

const AnalyserContext = React.createContext([{}, () => {}]);

function AnalyserProvider({
  context,
  source,
  config,
  startTime = 0,
  children
}) {
  const [analysis, setAnalysis] = useState({
    values: [0.2, 0.2, 0.2],
    ffts: [],
    startTime: 0,
    level: 0
  });

  useAnalyser(
    context,
    source,
    (v) => {
      setAnalysis(v);
    },
    startTime,
    config.buckets
  );
  return (
    <AnalyserContext.Provider value={analysis}>
      {children}
    </AnalyserContext.Provider>
  );
}

export { AnalyserContext, AnalyserProvider };
