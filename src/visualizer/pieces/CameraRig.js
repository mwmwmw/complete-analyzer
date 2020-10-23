import React, {useRef, useEffect, Children} from "react";
import { useThree, useFrame } from "react-three-fiber";
import { Vector3 } from "three";

export default function Camera(props) {
    const camera = useRef();
    const { setDefaultCamera } = useThree();

    useEffect(() => void setDefaultCamera(camera.current), []);

    const group = useRef();

    useFrame(({ mouse }) => {
        
        if (group.current) {
           group.current.position.y += 0.15 * Math.sin(performance.now() * 0.001);
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