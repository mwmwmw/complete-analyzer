import React, { useMemo, useState, useEffect } from "react";

function getDevices() {
  return navigator.mediaDevices.enumerateDevices().then((devices) => {
    return devices.filter((d) => d.kind === "audioinput");
  });
}

export default function useAudioInput(
  context = useMemo(() => new AudioContext(), [])
) {
  const [source, setCurrentSource] = useState();
  const [devices, setDevices] = useState([]);
  const dry = useMemo(() => context.createGain(), []);

  function getDevice(device) {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          deviceId: device.deviceId
        }
      })
      .then(handleSuccess);
  }

  function getMediaAccess() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(handleSuccess);
  }

  function handleSuccess(e) {
    const source = context.createMediaStreamSource(e);
    setCurrentSource(source);
  }

  useEffect(() => {
    getDevices().then((d) => setDevices(d));

    if (source) {
      source.connect(dry);
      dry.connect(context.destination);
      dry.gain.setValueAtTime(0.0, context.currentTime);
    }
    return () => {
      if (source) {
        source.disconnect(dry);
        dry.disconnect(context.destination);
      }
    };
  }, [source, context]);

  return {
    context,
    dry,
    source,
    getMediaAccess,
    devices,
    getDevice
  };
}
