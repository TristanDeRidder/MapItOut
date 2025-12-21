import { Canvas } from "@react-three/fiber";
import Continent from "../canvasses/Continent";

const cameraSettings = {
    fov: 60,
    near: 0.1,
    far: 200,
    position: [0, 6, 12] as [number, number, number],
};

const POI = () => {
    return (
        <div id="canvas-wrap" className="w-screen h-screen">
            <Canvas shadows camera={cameraSettings}>
                <Continent />
            </Canvas>
        </div>
    );
}

export default POI;