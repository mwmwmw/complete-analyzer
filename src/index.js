import ReactDOM from "react-dom";
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect
} from "react";

import "./styles.css";

import { AudioCTX, AudioContextProvider } from "./hooks/audioContext";
import { ConfigContext, ConfigProvider } from "./hooks/configContext";

import Visualizer from "./visualizer/visualizer";

import AudioInput from "./components/AudioInput";
import AudioFile from "./components/AudioFile";

import Menu from "./components/Menu"

const App = () => {
  const { load, config } = useContext(ConfigContext);
  const context = useContext(AudioCTX);
  const [useInput, setUseInput] = useState(false);

  useEffect(() => {
    load("./config.json");
    console.log(config);
  }, [config.program]);

  if (!context) {
    return <div>wait</div>;
  }

  return (
    <><Menu title="Input Type">
      <div className="selector">
        <button className={useInput ? "selected" : ""} onClick={() => setUseInput(true)}>Input</button>
        <button className={!useInput ? "selected" : ""} onClick={() => setUseInput(false)}>Audio File</button>
      </div>
    </Menu>
      {useInput ? (
        <AudioInput config={config} context={context}>
          <Visualizer />
        </AudioInput>
      ) : (
          <AudioFile config={config} context={context}>
            <Visualizer />
          </AudioFile>
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
