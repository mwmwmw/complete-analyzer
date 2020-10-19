import React, { useEffect, useMemo, useState } from "react";

import MediaPlayer from "../audio/MediaPlayer";

export default function (audioContext, file) {
  const context = useMemo(() => audioContext || new AudioContext(), [
    audioContext
  ]);

  const [playing, setPlaying] = useState(false);
  const source = useMemo(() => new MediaPlayer(context), [context, file]);
  const [startTime, setStartTime] = useState(0);
  const reader = useMemo(() => new FileReader(), []);

  function stop() {
    source.stop();
    setPlaying(false);
  }

  function playSound(buffer, context) {
    source.buffer = buffer;
    source.addEventListener("ended", stop);
    setPlaying(true);
    setStartTime(context.currentTime);
    source.start(context.currentTime);
  }

  function setBuffer(e) {
    var data = e.target.result;
    context.decodeAudioData(data, function (buffer) {
      playSound(buffer, context);
    });
  }

  useEffect(() => {
    source.connect(context.destination);

    if (file) {
      reader.addEventListener("load", setBuffer);
      reader.readAsArrayBuffer(file);
    }
    return () => {
      reader.removeEventListener("load", setBuffer);
      if (source) {
        setPlaying(false);
        source.disconnect(context.destination);
      }
    };
  }, [file, context]);

  return {
    context,
    source,
    playing,
    startTime
  };
}
