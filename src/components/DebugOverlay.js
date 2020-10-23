import React, { useContext } from "react";

import { AnalyserContext, useAnalyserContext } from "../hooks/analyserContext";

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
  const values = useAnalyserContext();

  if(!active) {
    return <div>Not Active</div>
  }

  return (
    active && (
      <div className="overlay">
        <div>
          <h3>Volume</h3>
          <div
            style={{
              height: `10px`,
              width: `${values.volume * 200}px`,
              backgroundColor: "rgba(255,255,255, 0.5)"
            }}
          ></div>
          <h3>Volume Delta</h3>
          <div
            style={{
              height: `10px`,
              width: `${values.volumeDelta * 200}px`,
              backgroundColor: "rgba(255,255,255, 0.5)"
            }}
          ></div>
          <h3>HIT</h3>
          <div
            style={{
              height: `10px`,
              backgroundColor: values.hit ? "rgba(244,0,0,1)" : "rgba(255,255,255, 0.5)"
            }}
          ></div>
        </div>
        <div style={
          { position: "relative" }
        }>
          <h3>Phase</h3>
          <div>
            {values.phase &&
              values.phase.map((v, i) => (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: `translate(${i * 4}px) translateY(${v * 4}px)`,
                    height: `4px`,
                    width: `4px`,
                    marginLeft: "-2px",
                    marginTop: "-2px",
                    backgroundColor: "rgba(255,255,255, 0.5)"
                  }}
                ></div>
              ))}
          </div>
        </div>
        <div>
          <h3>Buckets</h3>
          {values &&
            values.values.map((v, i) => (<>
              <div
                style={{
                  height: `10px`,
                  width: `${v.volume * 200}px`,
                  backgroundColor: "rgba(255,255,255, 0.5)"
                }}
              ></div>
              <h3>Volume Delta</h3>
              <div
                style={{
                  height: `10px`,
                  width: `${values.extras[i].volumeDelta * 200}px`,
                  backgroundColor: "rgba(255,255,255, 0.5)"
                }}
              ></div>
              <h3>Volume Delta</h3>
              <div
                style={{
                  height: `10px`,
                  backgroundColor: values.extras[i].hit ? "rgba(244,0,0,1)" : "rgba(255,255,255, 0.5)"
                }}
              ></div>
              <hr /></>
            ))
          }
        </div>
        <div>
          <h3>FFT</h3>
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
