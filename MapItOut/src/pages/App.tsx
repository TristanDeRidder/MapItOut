import { Canvas } from "@react-three/fiber";
import { Continent } from "../canvasses/Continent";

const cameraSettings = {
  fov: 60,
  near: 0.1,
  far: 200,
  position: [0, 6, 12] as [number, number, number],
};

const App = () => {
  return (
    <div className="w-full h-screen">
      {/* <div>
        <div className="absolute top-0 left-0 bg-red-500 h-20 w-20"></div>img
        <div className="absolute top-0 right-0 bg-red-500 h-20 w-20"></div>
        <div className="absolute bottom-0 left-0 bg-red-500 h-20 w-20"></div>
        <div className="absolute bottom-0 right-0 bg-red-500 h-20 w-20"></div>
      </div> */}
      <div id="canvas-wrap" className="w-screen h-screen">
        <Canvas shadows camera={cameraSettings}>
          <Continent />
        </Canvas>
      </div>
    </div>
  );
};

export default App;
