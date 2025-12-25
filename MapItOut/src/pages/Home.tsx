import { Canvas } from "@react-three/fiber";
import { Home } from "../canvasses/Home";

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
        <Canvas shadows camera={cameraSettings}>
          <Home />
        </Canvas>
      </div>
      <div>
        <div className="absolute top-0 left-0 bg-white opacity-50 backdrop-blur-3xl h-full w-full"></div>
      </div>
    </div>
  );
};

export default App;
