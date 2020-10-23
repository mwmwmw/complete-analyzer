import React, { Suspense } from "react";

import {
  Color
} from "three";

import { Canvas } from "react-three-fiber";

import { useAnalyserContext } from "../hooks/analyserContext";

import Idea1 from "./Idea1";
import TitleShow from "./TitleShow";


const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);


export default function Visualizer() {
  const analysis = useAnalyserContext();
  return (
    <>
      <Canvas
        pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
        colorManagement={true}
        onCreated={({ gl }) => {
          gl.setClearColor(new Color("#020206"));
        }}
      >
        <TitleShow analysis={analysis} />
      </Canvas>
    </>
  );
};
