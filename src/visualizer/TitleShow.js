import React, { Suspense } from "react";

import Effects from "../post/effects";
import Camera from "./pieces/CameraRig";
import Lighting from "./pieces/LightRig";
import Particles from "./pieces/particles";
import Sculpture from "./pieces/Sculpture";

import Title from "../assets/LightShowTitle";
import City from "../assets/City_Small"

export default function Idea1({ analysis }) {
    const { values } = analysis;
    const [low, mid, high] = values;
    return <>
        <Suspense fallback={() => <></>}>
            <City position={[0, -10, -12]} />
        </Suspense>
        <Camera position={[0,8,50]}>
        <Suspense fallback={() => <></>}>
            <Title position={[0, 0, 5]} />
        </Suspense>
        </Camera>
        <Lighting analysis={analysis} />
        <Sculpture scale={[Math.pow(3, mid), Math.pow(3, mid), Math.pow(3, mid)]} intensity={low} />
        {/* <Particles count={2000} /> */}
        <Effects />
    </>
}