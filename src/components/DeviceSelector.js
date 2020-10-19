import React from "react"

import { Scrollbars } from "react-custom-scrollbars";

export default function DeviceSelector({ onClick, device, devices }) {
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