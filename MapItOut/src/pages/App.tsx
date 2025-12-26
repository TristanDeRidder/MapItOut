import { Canvas } from "@react-three/fiber";
import { Continent, WoodContinent } from "../canvasses/Continent";
import * as THREE from "three";

const cameraSettings = {
  fov: 60,
  near: 0.1,
  far: 200,
  position: [0, 6, 12] as [number, number, number],
};

const App = () => {
  return (
    <div className="w-full h-screen">
      <div id="canvas-wrap" className="w-screen h-screen">
        <Canvas
          shadows
          camera={cameraSettings}
          gl={{
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.4;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <WoodContinent />
        </Canvas>
      </div>
    </div>
  );
};

export default App;
