import React, {useRef, useEffect, useMemo} from "react";
import { useFrame } from "react-three-fiber";
import { MathUtils, Vector3 } from "three";
import { polarRandom } from "../../helpers/random";


const scaleMax = 5;
const Sculpture = (props) => {

  const group = useRef();
  const cubes = useMemo(() => {
    return new Array(150).fill(0).map((v) => {
      const pos = new Vector3(
        polarRandom(scaleMax),
        polarRandom(scaleMax),
        polarRandom(scaleMax)
      );
      const scale = (1 / (4 + pos.lengthSq())) * 10;
      return (
        <mesh position={pos} scale={[scale, scale, scale]}>
          <boxBufferGeometry args={[1, 1, 1]} attach="geometry" />
          <meshPhysicalMaterial
            color="#010101"
            roughness={0.6}
            metalness={1}
            attach="material"
          />
        </mesh>
      );
    });
  }, []);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.0113551;
      group.current.rotation.z = MathUtils.degToRad(45);
      group.current.rotation.x = MathUtils.degToRad(45);
    }
  });

  return (
    <group ref={group} {...props}>
      {/* <Refract position={[0, 0, 3]} />
      <Refract position={[0, 0.5, 4]} />
      <Refract position={[0, -0.5, 6]} rotation={[0, 1, 0]} /> */}
      <pointLight position={[0, 0, 0]} intensity={props.intensity} color="#e08e23" />
      {/* <pointLight position={[-5, 0, -5]} /> */}
      {cubes}
      <mesh>
        <boxBufferGeometry args={[2, 2, 2]} attach="geometry" />
        <meshBasicMaterial
          color={"#e08e23"}
          roughness={0.2}
          attach="material"
          opacity={props.intensity/4}
          transparent={true}
        />
      </mesh>
    </group>
  );
};

export default Sculpture;