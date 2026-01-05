import { Canvas } from "@react-three/fiber";
import { ContinentWithDagger, TableContinent } from "../canvasses/Continent";
import * as THREE from "three";
import { useRouteLoaderAutoStop } from "../components/Loader/RouteLoader";

const cameraSettings = {
  fov: 60,
  near: 0.1,
  far: 200,
  position: [0, 25, 0] as [number, number, number],
};

const App = () => {
  useRouteLoaderAutoStop();

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
          {/* <ContinentWithDagger /> */}
          <TableContinent />
        </Canvas>
      </div>
    </div>
  );
};

export default App;
