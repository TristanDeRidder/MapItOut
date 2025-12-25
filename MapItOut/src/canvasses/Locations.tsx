import { useGLTF, OrbitControls, Sky } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import crowdUrl from '../assets/sounds/crowd.wav';
import FireUrl from '../assets/sounds/fire.wav';
import LightningUrl from '../assets/sounds/lightning.wav';
import Lightning from "../components/Lightning/Lightning";

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

  return (
    <>
      {/* Controls */}
      <OrbitControls
        makeDefault
        onStart={handleInteraction}
        onChange={handleInteraction}
      />

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
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
        position={[0, -1, 0]}
      />
    </>
  );
};

export default Locations;
