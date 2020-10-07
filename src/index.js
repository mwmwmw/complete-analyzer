import ReactDOM, { createPortal } from "react-dom";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef
} from "react";

import DragAndDrop from "./components/DragAndDrop";

import "./styles.css";
import useAudioPlayback from "./hooks/useAudioPlayback";
import useAudioInput from "./hooks/useAudioInput";
import { AnalyserProvider } from "./hooks/analyserContext";
import { AudioCTX, AudioContextProvider } from "./hooks/audioContext";

import DebugOverlay from "./components/DebugOverlay";

import { ConfigContext, ConfigProvider } from "./hooks/configContext";

import { Scrollbars } from "react-custom-scrollbars";

import Visualizer from "./visualizer";

function AudioFile({ context, config }) {
  const [file, setFile] = useState(null);

  const { playing, source, startTime } = useAudioPlayback(context, file);

  return (
    <DragAndDrop change={(e) => setFile(e[0])}>
      <AnalyserProvider
        context={context}
        source={source}
        config={config}
        startTime={startTime}
      >
        <DebugOverlay active={false} />
        <Visualizer />
      </AnalyserProvider>
    </DragAndDrop>
  );
}

function DeviceSelector({ onClick, device, devices }) {
  return (
    <div className="device-selector panel">
      <h3>{(device && device.label) || "No Input Device Selected"}</h3>
      <Scrollbars style={{ height: "400px", width: "400px" }}>
        <ul>
          {devices
            .sort((a, b) => (a.label < b.label ? -1 : 1))
            .map((d) => (
              <li
                key={d.label}
                className={
                  device && d.label === device.label ? "selected" : null
                }
                onClick={() => onClick(d)}
              >
                <div>{d.label}</div>
              </li>
            ))}
        </ul>
      </Scrollbars>
    </div>
  );
}

function AudioInput({ context, config, menu }) {
  const [device, setDevice] = useState();
  const { source, devices, getDevice } = useAudioInput(context);

  const selectDevice = useCallback((d) => {
    setDevice(d);
    getDevice(d);
  });

  return (
    <>
      <DeviceSelector
        device={device}
        devices={devices}
        onClick={selectDevice}
      />
      <AnalyserProvider context={context} source={source} config={config}>
        <DebugOverlay active={false} />
        <Visualizer />
      </AnalyserProvider>
    </>
  );
}

const INPUT_TYPE = {
  FILE: "FILE",
  INPUT: "INPUT"
};

const Audio = {
  FILE: AudioFile,
  INPUT: AudioInput
};

const App = () => {
  const { load, config } = useContext(ConfigContext);
  const context = useContext(AudioCTX);
  const [useInput, setUseInput] = useState(false);
  const menu = useRef();

  useEffect(() => {
    load("./config.json");
    console.log(config);
  }, [config.program]);

  console.log(context);

  if (!context) {
    return <div>wait</div>;
  }

  return (
    <>
      <div id="menu" className="menu panel">
        <div className="selector">
          <button onClick={() => setUseInput(true)}>Input</button>
          <button onClick={() => setUseInput(false)}>Audio File</button>
        </div>
      </div>
      {useInput ? (
        <AudioInput config={config} menu={menu} context={context} />
      ) : (
        <AudioFile config={config} menu={menu} context={context} />
      )}
    </>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider>
      <AudioContextProvider>
        <App />
      </AudioContextProvider>
    </ConfigProvider>
  </React.StrictMode>,
  rootElement
);
