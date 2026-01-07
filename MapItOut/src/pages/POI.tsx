import { Canvas } from "@react-three/fiber";
import Locations from "../canvasses/Locations";
import locationsData from "../data/locations.json";
import { useParams } from "react-router-dom";
import { useRouteLoaderAutoStop } from "../components/Loader/RouteLoader";

const cameraSettings = {
  fov: 60,
  near: 0.1,
  far: 200,
  position: [0, 15, 0] as [number, number, number],
};

const POI = () => {
  useRouteLoaderAutoStop();

  const { modelId } = useParams<{ modelId: string }>();

  // Find the location that matches the modelId from the URL params
  const locationData = Object.values(locationsData.locations).find(
    (loc) => loc.id === modelId
  );

  if (!locationData) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="">Model Not Found</h1>
          <a href="/" className="">
            ← Back to Map
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="canvas-wrap" className="w-screen h-screen">
        <Canvas shadows camera={cameraSettings}>
          <Locations modelId={locationData.name} />
        </Canvas>
        <div className="absolute top-4 left-4 bg-yellow-50 bg-opacity-75 p-2 rounded">
          <a href="/" className="!text-black">
            ← Back to Map
          </a>
        </div>
      </div>
    </>
  );
};

export default POI;
