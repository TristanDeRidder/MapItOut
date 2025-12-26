import { useGLTF, OrbitControls, Sky, Html } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import crowdUrl from '../assets/sounds/crowd.wav';
import FireUrl from '../assets/sounds/fire.wav';
import LightningUrl from '../assets/sounds/lightning.wav';
import Lightning from "../components/Lightning/Lightning";
import LocationCard from "../components/LocationCard/LocationCard";
import locationsData from "../data/locations.json";
import { CameraPinnedCard } from "../components/Camera/CameraPinned";

type LocationConfig = {
  sound?: {
    url: string;
    volume: number;
    loop?: boolean;
  };
  sky?: {
    sunPosition: [number, number, number];
    turbidity?: number;
  };
  lightning?: {
    intensity: number;
    interval: [number, number];
    flashDuration: number;
  };
};


const LOCATION_CONFIG: Record<string, LocationConfig> = {
  BasgiathBaked2: {
    sound: {
      url: crowdUrl,
      volume: 0.5,
      loop: true,
    },
    sky: {
      sunPosition: [500, 150, -1000],
      turbidity: 0.1,
    },
  },
  RessonBaked2: {
    sound: {
      url: FireUrl,
      volume: 0.2,
      loop: true,
    },
  },
   DraithusBaked2: {
    sound: {
      url: LightningUrl,
      volume: 0.3,
    },
    lightning: {
      intensity: 8,
      interval: [3, 8],
      flashDuration: 0.15,
    },
  },
};


const Locations = ({ modelId }: { modelId?: string }) => {
  if (!modelId) return null;

  const modelName = `${modelId}Baked2`;
  const config = LOCATION_CONFIG[modelName];

  const POIModel = useGLTF(
    new URL(`../models/${modelName}.glb`, import.meta.url).href
  );

  const DaggerModel = useGLTF(
    new URL("../models/DaggerOrigin.glb", import.meta.url).href
  );

  useEffect(() => {
    POIModel.scene.traverse((obj) => {
      if ((obj as any).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }

      const mat = (obj as any).material;
      if (mat && mat.isMeshStandardMaterial) {
        mat.metalness = 0;
        mat.roughness = 1;
        mat.envMapIntensity = 1;
        mat.needsUpdate = true;
      }
    });
  }, [POIModel]);

  useEffect(() => {
    DaggerModel.scene.traverse((obj) => {
      if ((obj as any).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = false;

        const mat = (obj as any).material;
        if (mat?.isMeshStandardMaterial) {
          mat.envMapIntensity = 4;
          mat.roughness = 0.25;
          mat.metalness = 1;
          mat.needsUpdate = true;
        }
      }
    });
  }, [DaggerModel]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  useEffect(() => {
    if (!config?.sound) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(config.sound.url);
    audio.volume = config.sound.volume;
    audio.loop = !!config.sound.loop;

    audioRef.current = audio;
  }, [modelName]);

  const handleInteraction = () => {
    if (!audioRef.current || audioUnlocked) return;

    audioRef.current
      .play()
      .then(() => setAudioUnlocked(true))
      .catch(console.error);
  };

  const locationData = Object.values(locationsData.locations).find(
        loc => loc.id === modelId
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
      {/* Controls */}
      <OrbitControls
        makeDefault
        onStart={handleInteraction}
        onChange={handleInteraction}
      />

      {/* Lights */}
      <directionalLight
        castShadow
        position={[10, 15, 10]}
        intensity={2.5}
        shadow-bias={-0.0005}
      />
 
      <ambientLight intensity={1} />

      {/* Optional Sky */}
      {config?.sky && (
        <group scale={1000}>
          <Sky
            sunPosition={config.sky.sunPosition}
            turbidity={config.sky.turbidity ?? 10}
          />
        </group>
      )}

      {/* Lightning */}
      {config?.lightning && <Lightning config={config.lightning} />}



      {/* Model */}
      <primitive
        object={POIModel.scene}
        scale={0.02}
        position={[-3, -1, 0]}
      />

      
      <CameraPinnedCard>
        <LocationCard {...locationData} />
      </CameraPinnedCard>

    </>
  );
};

export default Locations;
