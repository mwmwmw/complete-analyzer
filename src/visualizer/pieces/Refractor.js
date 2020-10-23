import React from "react";

import { PlaneBufferGeometry } from "three";
import { WaterRefractionShader } from "three/examples/jsm/shaders/WaterRefractionShader.js";

import { Refractor } from "three/examples/jsm/objects/Refractor.js";

const Refract = (props) => {
    const group = useRef();

    useEffect(() => {
        if (group.current) {
            var refractorGeometry = new PlaneBufferGeometry(10, 1);

            const refractor = new Refractor(refractorGeometry, {
                color: 0x999999,
                textureWidth: 1024,
                textureHeight: 1024,
                shader: WaterRefractionShader
            });
            group.current.add(refractor);
        }
    }, [group]);

    return <group ref={group} {...props} />;
};

export default Refract