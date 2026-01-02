import {
  Clouds,
  Cloud,
} from "@react-three/drei";
import * as THREE from "three";

export const SkyConfig = () => {
  return (
    <>
      <group>
        <Clouds material={THREE.MeshLambertMaterial} limit={400} range={100}>
          <Cloud
            seed={4}
            segments={20}
            volume={6}
            opacity={0.8}
            fade={10}
            growth={4}
            speed={0.1}
            bounds={[6, 1, 1]}
            color="#2b2929ff"
            position={[-4, 6, -5]}
          />
          <Cloud
            seed={3}
            segments={20}
            volume={6}
            opacity={0.8}
            fade={10}
            growth={5}
            speed={0.1}
            bounds={[6, 1, 1]}
            color="#2b2929ff"
            position={[6, 6, 5]}
          />
          <Cloud
            seed={3}
            segments={20}
            volume={6}
            opacity={0.8}
            fade={10}
            growth={4}
            speed={0.1}
            bounds={[6, 1, 1]}
            color="#2b2929ff"
            position={[0, 6, 12]}
          />
          <Cloud
            seed={3}
            segments={20}
            volume={6}
            opacity={0.8}
            fade={10}
            growth={4}
            speed={0.1}
            bounds={[6, 1, 1]}
            color="#2b2929ff"
            position={[0, 6, 2]}
          />
          <Cloud
            seed={3}
            segments={20}
            volume={6}
            opacity={0.8}
            fade={10}
            growth={4}
            speed={0.1}
            bounds={[6, 1, 1]}
            color="#2b2929ff"
            position={[0, 6, -6]}
          />
          <Cloud
            seed={3}
            segments={20}
            volume={6}
            opacity={0.8}
            fade={10}
            growth={4}
            speed={0.1}
            bounds={[6, 1, 1]}
            color="#3a3a3aff"
            position={[0, 6, 0]}
          />
        </Clouds>
      </group>
    </>
  );
};