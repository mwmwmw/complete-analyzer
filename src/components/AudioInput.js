import React, { useState, useCallback } from "react";

import useAudioInput from "../hooks/useAudioInput";

import DeviceSelector from "./DeviceSelector";
import {AnalyserProvider} from "../hooks/analyserContext";


export default function AudioInput(props) {
    const [device, setDevice] = useState();
    const { source, devices, getDevice } = useAudioInput(props.context);
  
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
        <AnalyserProvider {...props} source={source}>
          {props.children}
        </AnalyserProvider>
      </>
    );
  }