import React, {useRef, useEffect, Suspense } from "react";
import { useThree, useFrame } from "react-three-fiber";

import Effects from "../post/effects";

import Title from "../assets/LightShowTitle";
import City from "../assets/City_Small"

export default function Idea1({ analysis }) {
    const { values, hit } = analysis;
    const [low, mid, high] = values;
    return <>
        <Suspense fallback={() => <></>}>
            <City analysis={analysis} position={[0, -10, -12]} />
        </Suspense>
        <Camera position={[0,10-low,50]}>
        <Suspense fallback={() => <></>}>
            <Title analysis={analysis} position={[0, 0 , 5]} />
        </Suspense>
        </Camera>
        {/* <Lighting analysis={analysis} /> */}
        <Effects down={hit} />
    </>
}


export function Camera(props) {
    const camera = useRef();
    const { setDefaultCamera } = useThree();

    useEffect(() => void setDefaultCamera(camera.current), []);

    const group = useRef();

    useFrame(({ mouse }) => {
        
        if (group.current) {
           group.current.position.y += 0.015 * Math.sin(performance.now() * 0.001);
           group.current.rotation.y += 0.001 ;
        //    group.current.position.x += 0.01 + Math.sin(performance.now() * 0.001);
        //    group.current.position.z += 0.1 + Math.sin(performance.now() * 0.001);
        }
        if (camera.current) {
            camera.current.position.z = 15 + Math.sin(performance.now() * 0.001);
            //camera.current.rotation.y = 15 + Math.sin(performance.now() * 0.001);
        }
        // group.current.lookAt(0,10,0)
    });

    useFrame(() => camera.current.updateMatrixWorld());
    return (
        <group ref={group} {...props}>
            <perspectiveCamera
                name="CustomCamera"
                ref={camera}
            />
            {props.children}
        </group>
    );
}