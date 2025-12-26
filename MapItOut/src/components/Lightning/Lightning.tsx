import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

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

const Lightning = ({ config }: { config: NonNullable<LocationConfig['lightning']> }) => {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const timer = useRef(0);
  const Flash = useRef(
    THREE.MathUtils.randFloat(...config.interval)
  );
  const [flashing, setFlashing] = useState(false);

  useFrame((_, delta) => {
    timer.current += delta;

    if (timer.current >= Flash.current) {
      timer.current = 0;
      Flash.current = THREE.MathUtils.randFloat(...config.interval);
      setFlashing(true);

      setTimeout(() => setFlashing(false), config.flashDuration * 1000);
    }

    if (lightRef.current) {
      lightRef.current.intensity = flashing ? config.intensity : 0;
    }
  });

  return (
    <directionalLight
      ref={lightRef}
      position={[5, 10, 2]}
      color="#bcdcff"
      intensity={0}
    />
  );
};


export default Lightning;