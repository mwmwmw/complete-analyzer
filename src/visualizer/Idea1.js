import React from "react"

import Effects from "../post/effects";
import Camera from "./pieces/CameraRig";
import Lighting from "./pieces/LightRig";
import Particles from "./pieces/particles";
import Sculpture from "./pieces/Sculpture";

export default function Idea1({ analysis }) {
    const { values } = analysis;
    const [low, mid, high] = values;
    return <>
        <Camera />
        <Lighting analysis={analysis} />
        <Sculpture scale={[Math.pow(3, mid), Math.pow(3, mid), Math.pow(3, mid)]} intensity={low * 100} />
        <Particles count={2000} />
        <Effects />
    </>
}