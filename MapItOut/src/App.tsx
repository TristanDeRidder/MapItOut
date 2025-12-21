import { Canvas } from "@react-three/fiber";
import Continent from "./canvasses/Continent";
import Paper from "./components/Paper/Paper";
import Dagger from "./components/Dagger/Dagger";

const cameraSettings = {
  fov: 45,
  near: 0.1,
  far: 200,
  position: [0, 6, 12] as [number, number, number],
};

const App = () => {
  return (
    <div id="app-root">
      <div>
        <Paper />
        <Dagger />
      </div>
      <div>
        <div className="absolute top-0 left-0 bg-red-500 h-20 w-20"></div>
        <div className="absolute top-0 right-0 bg-red-500 h-20 w-20"></div>
        <div className="absolute bottom-0 left-0 bg-red-500 h-20 w-20"></div>
        <div className="absolute bottom-0 right-0 bg-red-500 h-20 w-20"></div>
      </div>
      <div id="canvas-wrap">
        <Canvas shadows camera={cameraSettings}>
          <Continent />
        </Canvas>
      </div>
    </div>
  );
};

export default App;


