import React, { useContext } from "react";

import { AnalyserContext } from "../hooks/analyserContext";

const colors = [
  "rgba(255,0,0,0.5)",
  "rgba(255,255,0,0.5)",
  "rgba(255,0,255,0.5)",
  "rgba(255,255,255,0.5)",
  "rgba(255,0,0,0.5)"
];

const FFT = ({ values, color, name }) => (
  <div className="fft">
    {values.map((v, i) => (
      <div
        key={name + i.toString()}
        style={{
          width: `${250 / values.length}%`,
          height: `${v * 200}px`,
          backgroundColor: color || "rgba(255,255,255, 0.5)"
        }}
      ></div>
    ))}
  </div>
);

export default function DebugOverlay({ active }) {
  const values = useContext(AnalyserContext);

  return (
    active && (
      <div className="overlay">
        <div>
          <h2>Buckets</h2>
          {values &&
            values.values.map((v) => (
              <div
                style={{
                  height: `10px`,
                  width: `${v * 200}px`,
                  backgroundColor: "rgba(255,255,255, 0.5)"
                }}
              ></div>
            ))}
        </div>
        <div>
          <h2>FFT</h2>
          <div className="ffts">
            {values &&
              values.fft.map((arr, i) => (
                <FFT
                  key={"fft" + i.toString()}
                  name={"fft" + i.toString()}
                  values={arr}
                  color={colors[i % colors.length]}
                />
              ))}
          </div>
        </div>
      </div>
    )
  );
}
