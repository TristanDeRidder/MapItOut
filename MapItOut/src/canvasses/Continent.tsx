import { useGLTF, Html, OrbitControls } from "@react-three/drei";
import Dagger from "../components/Dagger/Dagger";

// Define your pin locations here (adjust coordinates to match your model)
const pinLocations = [
  { position: [2, 0, 1] as [number, number, number], label: "Location 1", link: "/location1" },
  { position: [-1, 0, 0] as [number, number, number], label: "Location 2", link: "/Basgiath" },
  { position: [0, 0, -2] as [number, number, number], label: "Location 3", link: "/location3" },
];

const Continent = () => {
  const ContinentModel = useGLTF(
    new URL("../models/AmaralysNoMaterial.glb", import.meta.url).href
  );
  return (
    <>
      {/* Controls */}
      <OrbitControls makeDefault />

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1} />

      {/* Models */}
      <primitive object={ContinentModel.scene} scale={0.02} position={[0, -1, 0]} />

      {/* Pinned Daggers */}
      {pinLocations.map((pin, index) => (
        <Html key={index} position={pin.position} center distanceFactor={10}>
          <div className="flex flex-col items-center pointer-events-auto cursor-pointer hover:scale-110 transition-transform">
            <a href={pin.link || "#"} className="mb-2 text-white font-bold px-2 py-1 rounded">
              <Dagger />
            </a>
          </div>
        </Html>
      ))}
    </>
  );
};

export default Continent;
