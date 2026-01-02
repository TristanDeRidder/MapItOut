import { useGLTF, OrbitControls, Sky, Html, Environment } from "@react-three/drei";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import crowdUrl from "../assets/sounds/crowd.wav";
import FireUrl from "../assets/sounds/fire.wav";
import LightningUrl from "../assets/sounds/lightning.wav";
import Lightning from "../components/Lightning/Lightning";
import LocationCard from "../components/LocationCard/LocationCard";
import locationsData from "../data/locations.json";
import { CameraPinnedCard } from "../components/Camera/CameraPinned";
import { Physics, RigidBody } from "@react-three/rapier";

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
  physics?: {
    enabled: boolean;
  };
  environment?: {
    preset: ComponentProps<typeof Environment>["preset"];
  };
  light?: {
    intensity: number;
    position: [number, number, number];
    shadowBias?: number;
  };
};

const LOCATION_CONFIG: Record<string, LocationConfig> = {
  Basgiath: {
    sound: {
      url: crowdUrl,
      volume: 0.5,
      loop: true,
    },
    sky: {
      sunPosition: [300, 200, -300],
      turbidity: 2,          // clear day
    },
    environment: {
      preset: "city",
    },
    physics: {
      enabled: true,
    },
    light: {
      intensity: 2.5,
      position: [10, 15, 10],
      shadowBias: -0.0001,
    },
  },

  Resson: {
    sound: {
      url: FireUrl,
      volume: 0.2,
      loop: true,
    },
    sky: {
      sunPosition: [0, -10, 0],
      turbidity: 15,
    },
    environment: {
      preset: "night",
    },
    light: {
      intensity: 0.1,
      position: [10, 15, 10],
      shadowBias: -0.0001,
    },
  },

  Draithus: {
    sound: {
      url: LightningUrl,
      volume: 0.3,
    },
    lightning: {
      intensity: 8,
      interval: [3, 8],
      flashDuration: 0.15,
    },
    sky: {
      sunPosition: [0, -20, 0],
      turbidity: 15,
    },
    environment: {
      preset: "night",
    },
    light: {
      intensity: 1.5,
      position: [10, 15, 10],
      shadowBias: -0.0001,
    },
  },
};


const Locations = ({ modelId }: { modelId?: string }) => {
  if (!modelId) return null;

  const modelName = `${modelId}`;
  const config = LOCATION_CONFIG[modelName];

  const POIModel = useGLTF(
    new URL(`../models/${modelName}.glb`, import.meta.url).href
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

  const ragdollRef = useRef<any>(null);
  const push = () => {
    const minZ = -0.005;
    const maxZ = 0.005;
    const z = Math.random() * (maxZ - minZ) + minZ;

    ragdollRef.current.applyImpulse({ x: 0, y: 0, z }, true);
  };

  const [pushCount, setPushCount] = useState(0);

  const handlePush = () => {
    push();
    setPushCount((c) => {
      const next = c + 1;
      return next;
    });
  };

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
      {/* Controls */}
      <OrbitControls
        makeDefault
        onStart={handleInteraction}
        onChange={handleInteraction}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={2}
        maxDistance={20}
      />

      <ambientLight intensity={1} />

      {/* Lights */}
      {config?.light ? (
        <directionalLight
          intensity={config.light.intensity}
          position={config.light.position}
          shadow-bias={config.light.intensity }
        />
      ) : (
        <directionalLight intensity={2} position={[10, 15, 10]} shadow-bias={-0.0001} />
      )}

      {/* Optional Sky */}
      {config?.sky && (
        <group scale={1000}>
          <Sky
            sunPosition={config.sky.sunPosition}
            turbidity={config.sky.turbidity ?? 10}
          />
        </group>
      )}

      {/* Environment */}
      {config?.environment && <Environment preset={config.environment.preset} />}

      {/* Lightning */}
      {config?.lightning && <Lightning config={config.lightning} />}

      {/* Physics */}
      {config?.physics?.enabled ? (
        <Physics>
          <RigidBody ref={ragdollRef} friction={1}>
            <mesh
              position={[-4.58, 0, -2.5]}
              rotation={[-Math.PI / 2, 0, 0]}
              onClick={handlePush}
            >
              <boxGeometry args={[0.05, 0.05, 0.2]} />
              <meshStandardMaterial color="red" />
            </mesh>
          </RigidBody>

          <RigidBody type="fixed" restitution={0}>
            <mesh position={[0, -1.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[100, 100]} />
            </mesh>
          </RigidBody>
          {pushCount >= 5 && (
            <Html position={[-4.58, 0.25, -2.5]} center>
              <div
                style={{
                  padding: "8px 12px",
                  background: "rgba(0,0,0,0.7)",
                  color: "white",
                  borderRadius: 8,
                  fontSize: 14,
                  whiteSpace: "nowrap",
                }}
              >
                He is already dead!!
              </div>
            </Html>
          )}

          {/* Model */}
          <RigidBody type="fixed" colliders="trimesh">
            <primitive
              object={POIModel.scene}
              scale={0.02}
              position={[-3, -1, 0]}
            />
          </RigidBody>
        </Physics>
      ) : (
        <primitive
          object={POIModel.scene}
          scale={0.02}
          position={[-3, -1, 0]}
        />
      )}

      <CameraPinnedCard>
        <LocationCard {...locationData} />
      </CameraPinnedCard>
    </>
  );
};

export default Locations;
