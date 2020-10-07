import React from "react";
import useConfig from "./useConfig";

const ConfigContext = React.createContext([{}, () => {}]);

const ConfigProvider = (props) => {
  const config = useConfig();
  return (
    <ConfigContext.Provider value={config}>
      {props.children}
    </ConfigContext.Provider>
  );
};

export { ConfigContext, ConfigProvider };
