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
  const [debug, setDebug] = useState(false);
  const menu = useRef();

  useEffect(() => {
    load("./config.json");
    console.log(config);
  }, [config.program]);

  useLayoutEffect(()=>{
    console.log(window.location.hash === "#debug")
    setDebug(window.location.hash === "#debug")

  },[window.location.hash])

  if (!context) {
    return <div>wait</div>;
  }

  return (
    <><Menu>
        <div className="menu panel">
          <div className="selector">
            <button onClick={() => setUseInput(true)}>Input</button>
            <button onClick={() => setUseInput(false)}>Audio File</button>
          </div>
        </div>
      </Menu>
      {useInput ? (
        <AudioInput config={config} menu={menu} context={context} debug={debug}>
          <Visualizer />
        </AudioInput>
      ) : (
          <AudioFile config={config} menu={menu} context={context} debug={debug}>
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
