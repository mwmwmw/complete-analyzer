import React, { useEffect, useState } from "react";

const AudioCTX = React.createContext([{}, () => {}]);
function AudioContextProvider({ children }) {
  const [context, setContext] = useState(null);

  useEffect(() => {
    async function setupVolume() {
      const context = new AudioContext();
      //await context.audioWorklet.addModule("dbfs.js");
      await context.audioWorklet.addModule("vumeter_worklet.js");
      setContext(context);
    }
    setupVolume();
  }, []);
  return <AudioCTX.Provider value={context}>{children}</AudioCTX.Provider>;
}

export { AudioCTX, AudioContextProvider };
