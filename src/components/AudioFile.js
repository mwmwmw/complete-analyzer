import React, {Children, useState} from "react";

import DragAndDrop from "./DragAndDrop";

import useAudioPlayback from "../hooks/useAudioPlayback";
import {AnalyserProvider} from "../hooks/analyserContext";

export default function AudioFile(props) {
    const [file, setFile] = useState(null);
  
    const { playing, source, startTime } = useAudioPlayback(props.context, file);
  
    return (
      <DragAndDrop change={(e) => setFile(e[0])}>
        <AnalyserProvider
          {...props}
          source={source}>
          {props.children}
        </AnalyserProvider>
      </DragAndDrop>
    );
  }