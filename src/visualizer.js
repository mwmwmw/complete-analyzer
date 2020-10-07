import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext
} from "react";

import * as THREE from "three";

import {
  MathUtils,
  BoxBufferGeometry,
  Uncharted2ToneMapping,
  Color,
  Vector3
} from "three";

import { Canvas, useThree, useFrame } from "react-three-fiber";

import { useSpring, animated } from "react-spring/three";

import { PlaneBufferGeometry } from "three";
import { Refractor } from "three/examples/jsm/objects/Refractor.js";
import { WaterRefractionShader } from "three/examples/jsm/shaders/WaterRefractionShader.js";

import Effects from "./effects";

import Particles from "./particles";

import { AnalyserContext, AnalyserProvider } from "./hooks/analyserContext";

// import { context } from "use-cannon";

// const Refract = (props) => {
//   const group = useRef();

//   useEffect(() => {
//     if (group.current) {
//       var refractorGeometry = new PlaneBufferGeometry(10, 1);

//       const refractor = new Refractor(refractorGeometry, {
//         color: 0x999999,
//         textureWidth: 1024,
//         textureHeight: 1024,
//         shader: WaterRefractionShader
//       });
//       group.current.add(refractor);
//     }
//   }, [group]);

//   return <group ref={group} {...props} />;
// };

// const Cube = ({}) => (
//   <mesh>
//     <boxBufferGeometry args={[2, 2, 2]} attach="geometry" />
//     <meshPhysicalMaterial color="#070507" roughness={0.5} attach="material" />
//   </mesh>
// );

const polarRandom = (scale = 1, offset = 0.25) => {
  const random = (0.5 - Math.random()) * 2 * scale;
  return Math.sign(random) * offset + random;
};
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
      <pointLight position={[0, 0, 0]} intensity={5} color="#e08e23" />
      {/* <pointLight position={[-5, 0, -5]} /> */}
      {cubes}
      <mesh>
        <boxBufferGeometry args={[2, 2, 2]} attach="geometry" />
        <meshBasicMaterial
          color="#e08e23"
          roughness={0.2}
          attach="material"
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

function Camera(props) {
  const camera = useRef();
  const { setDefaultCamera } = useThree();
  // Make the camera known to the system
  useEffect(() => void setDefaultCamera(camera.current), []);
  // Update it every frame

  const group = useRef();

  useFrame(({ mouse }) => {
    if (group.current) {
      //group.current.rotation.z = -mouse.x * 0.09;
      group.current.rotation.y += 0.001 * Math.sin(performance.now() * 0.001);
    }
    if (camera.current) {
      camera.current.position.z = 15 + Math.sin(performance.now() * 0.001);
    }
  });

  useFrame(() => camera.current.updateMatrixWorld());
  return (
    <group ref={group} {...props}>
      <perspectiveCamera
        name="CustomCamera"
        ref={camera}
        // position={[0, 0, 10]}
      />
    </group>
  );
}

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const sceneColor = new Color("#030310");

const Visualizer = () => {
  const { values } = useContext(AnalyserContext);
  const [low, mid, high] = values;
  const mouse = useRef([0, 0]);
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  );

  return (
    <>
      <Canvas
        pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
        onMouseMove={onMouseMove}
        onCreated={({ gl }) => {
          //  gl.toneMapping = THREE.Uncharted2ToneMapping;
          gl.setClearColor(new Color("#020208"));
        }}
      >
        <Camera />
        <ambientLight color={sceneColor} intensity={Math.floor(Math.pow(Math.exp(high),550))} />
        <pointLight
          color={sceneColor}
          position={[0, 2, 5]}
          intensity={high * low * 1000}
        />
        <Sculpture scale={[Math.pow(2, low), Math.pow(2, low), Math.pow(2, low)]} />
        <Particles count={2000} mouse={mouse} />
        <Effects />
      </Canvas>
    </>
  );
};

export default Visualizer;
