import { Canvas } from "@react-three/fiber";
import Continent from "./canvasses/Continent";

const cameraSettings = {
  fov: 45,
  near: 0.1,
  far: 200,
  position: [0, 6, 12] as [number, number, number],
};

const App = () => {
  return (
    <div id="app-root">
      <div id="canvas-wrap">
        <Canvas shadows camera={cameraSettings}>
          <Continent />
        </Canvas>
      </div>
    </div>
  );
};

export default App;


