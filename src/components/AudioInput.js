import React, { useState, useCallback } from "react";

import useAudioInput from "../hooks/useAudioInput";

import DeviceSelector from "./DeviceSelector";
import {AnalyserProvider} from "../hooks/analyserContext";
import Menu from "./Menu";


export default function AudioInput(props) {
    const [device, setDevice] = useState();
    const { source, devices, getDevice } = useAudioInput(props.context);
  
    const selectDevice = useCallback((d) => {
      setDevice(d);
      getDevice(d);
    });
  
    return (
      <>
        <Menu title="Device Select" toggle={true}>
          <DeviceSelector
            device={device}
            devices={devices}
            onClick={selectDevice}
          />
        </Menu>
        <AnalyserProvider {...props} source={source}>
          {props.children}
        </AnalyserProvider>
      </>
    );
  }