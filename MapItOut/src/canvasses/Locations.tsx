import { useGLTF, OrbitControls, Sky } from "@react-three/drei";

const Locations = ({ modelId }: { modelId?: string }) => {

    if (!modelId) {
        return null;
    }

    const modelName = `${modelId}Baked2`;

    
    const POIModel = useGLTF(
        new URL(`../models/${modelName}.glb`, import.meta.url).href
    );

  return (
    <>
      {/* Controls */}
      <OrbitControls makeDefault />

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1} />
      {/* <group scale={1000}>
        <Sky sunPosition={[500, 150, -1000]} turbidity={0.1} />
      </group> */}

      {/* Models */}
      <primitive object={POIModel.scene} scale={0.02} position={[0, -1, 0]} />
    </>
  );
};

export default Locations;
