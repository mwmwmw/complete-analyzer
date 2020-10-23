import React, { useContext, useState } from "react";
import useAnalyser from "./useAnalyser";

import DebugOverlay from "../components/DebugOverlay";
import Menu from "../components/Menu";

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
}) {
  const [debug, setDebug] = useState(false);
  const { setGain, setGlobalGain, setSensitivity, sensitivity, gain, globalGain } = useAnalyser(
    context,
    source,
    (v) => {
      setAnalysis(v);
    },
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
      <Menu title="Signal Debugger" toggle={true}>
        <button onClick={() => setDebug(!debug)}>{debug ? "Deactivate" : "Activate"} Debug</button>
        <DebugOverlay active={debug} />
      </Menu>
      <Menu title="Boost" toggle={true}>
        <div className="signalbox">
          <h3>Smooth: {sensitivity}</h3>
          <input type="range" value={sensitivity} default={0.996} step={0.001} min={0.98} max={0.999999} onChange={({ currentTarget }) => setSensitivity(parseFloat(currentTarget.value, 10))} />
          {config.buckets.map((v, i) => {
            return <div key={i.toString()}>
              <h3>Enhance Range {v.filter.type} - {v.filter.frequency}</h3>
              <h3>{gain[i]}x</h3>
              <input type="range" value={gain[i]} default={1} step={0.01} min={-10} max={10} onChange={({ currentTarget }) => setGain(i, parseFloat(currentTarget.value, 10))} />
              <button onClick={() => setGain(i, 1)}>Reset</button>
              <br /><br />
            </div>
          })}
          <h3>Enhance Volume</h3>
          <input type="range" value={globalGain} default={1} step={0.01} min={-10} max={10} onChange={({ currentTarget }) => setGlobalGain(parseFloat(currentTarget.value, 10))} />
          <button onClick={() => setGlobalGain(1)}>Reset</button>
        </div>
      </Menu>
      {children}
    </AnalyserContext.Provider>
  );
}

function useAnalyserContext() {
  const analysis = useContext(AnalyserContext);
  return { ...analysis };
}


export { AnalyserContext, AnalyserProvider, useAnalyserContext };
