
import React from "react"

const Cube = ({}) => (
  <mesh>
    <boxBufferGeometry args={[2, 2, 2]} attach="geometry" />
    <meshPhysicalMaterial color="#070507" roughness={0.5} attach="material" />
  </mesh>
);

export default Cube;