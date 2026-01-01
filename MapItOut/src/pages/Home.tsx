import { Canvas } from "@react-three/fiber";
import { Home } from "../canvasses/Home";
import { useNavigate } from "react-router-dom";
import { useRouteLoader } from "../components/Loader/RouteLoader";

const cameraSettings = {
  fov: 60,
  near: 0.1,
  far: 200,
  position: [0, 6, 12] as [number, number, number],
};

const App = () => {
  const navigate = useNavigate();
  const { startRouteLoading } = useRouteLoader();

  return (
    <div className="w-full h-screen">
      <div id="canvas-wrap" className="w-screen h-screen relative">
        <Canvas shadows camera={cameraSettings}>
          <Home />
        </Canvas>
      </div>
      <div>
        <div className="flex flex-col justify-center items-center absolute top-0 left-0 bg-white opacity-50 backdrop-blur-3xl h-full w-full">
          <button
            type="button"
            className="text-black visited:text-black hover:text-black active:text-black focus:text-black text-5xl w-fit"
            onClick={() => {
              startRouteLoading();
              navigate("/Amaralys");
            }}
          >
            Amaralys
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
