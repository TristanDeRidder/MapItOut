import { useGLTF, OrbitControls, Html } from "@react-three/drei";
import { useParams } from "react-router-dom";

const Locations = () => {
    const { modelId } = useParams<{ modelId: string }>();

    const models = {
        "Basgiath": useGLTF(
            new URL("../models/BasgiathNoMaterial.glb", import.meta.url).href
        ),
        // extra models can be added here
    };

    const POIModel = modelId ? models[modelId as keyof typeof models] : null;

    if (!POIModel) {
        return (
            <Html>
                <div className="h-screen w-screen flex justify-center items-center">
                    <div className="text-center">
                        <h1 className="">Model Not Found</h1>
                        <a href="/" className="">
                            ← Back to Map
                        </a>
                    </div>
                </div>
            </Html>
        );
    }

  return (
    <>
      {/* Controls */}
      <OrbitControls makeDefault />

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1} />

      {/* Models */}
      <primitive object={POIModel.scene} scale={0.02} position={[0, -1, 0]} />
    </>
  );
};

export default Locations;
