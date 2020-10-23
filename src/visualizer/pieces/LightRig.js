import React from "react";

import { Color } from "three";

const sceneColor = new Color("#070308");

export default function Lighting({ analysis }) {
    const { values, time, volume, phase } = analysis;
    const [low, mid, high] = values;
    return <group>
        <ambientLight color={sceneColor} intensity={Math.floor(Math.pow((1 + high), 25))} />
        <pointLight
            color={sceneColor}
            position={[0, 2, 5]}
            intensity={Math.floor(Math.pow((1 + high), 25))}
        />
    </group>
}

