import {
  useGLTF,
  OrbitControls,
  Clone,
  Sky,
  Environment,
} from "@react-three/drei";
import pinsData from "../data/pins.json";
import CameraArcAnimation from "../components/Camera/ArcCamera";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Water } from "three-stdlib";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useNavigate } from "react-router-dom";
import { useRouteLoader } from "../components/Loader/RouteLoader";
import { SkyConfig } from "../components/Sky/Sky";

extend({ Water });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: any;
    }
  }
}

const WaterPlane = () => {
  const ref = useRef<any>(null);
  const { gl } = useThree();

  const waterNormals = new THREE.TextureLoader().load(
    "https://threejs.org/examples/textures/waternormals.jpg",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  );

  useEffect(() => {
    if (!ref.current) return;

    ref.current.material.uniforms.size.value = 10;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.material.uniforms.time.value += delta * 0.15;
    }
  });

  return (
    <water
      ref={ref}
      args={[
        new THREE.PlaneGeometry(1000, 1000),
        {
          textureWidth: 1024,
          textureHeight: 1024,
          waterNormals,
          sunDirection: new THREE.Vector3(),
          sunColor: 0xffffff,
          waterColor: 0x001e0f,
          distortionScale: 3.7,
          fog: false,
          format: gl.outputColorSpace,
        },
      ]}
      rotation-x={-Math.PI / 2}
      position={[0, -0.96, 0]}
    />
  );
};



export const ContinentWithDagger = () => {
  const [startArc, setStartArc] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const [targetLocation, setTargetLocation] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [daggerSceneVersion, setDaggerSceneVersion] = useState(0);
  const daggerRefs = useRef<{ [key: number]: THREE.Group }>({});

  const { camera, controls } = useThree();

  const navigate = useNavigate();
  const { startRouteLoading } = useRouteLoader();

  const ContinentModel = useGLTF(
    new URL("../models/AmaralysBaked2.glb", import.meta.url).href
  );
  const TableModel = useGLTF(
    new URL("../models/WoodenAmaralys.glb", import.meta.url).href
  );
  const DaggerModel = useGLTF(
    new URL("../models/DaggerOrigin.glb", import.meta.url).href
  );
  const HouseModel = useGLTF(
    new URL("../models/House.glb", import.meta.url).href
  );

  useEffect(() => {
    if (!controls) return;
    const typedControls = controls as any;
    typedControls.enabled = false;

    const tween = gsap.to(camera.position, {
      x: 0,
      y: 6,
      z: 15,
      duration: 1.75,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(0, 0, 0);
        typedControls.update?.();
      },
      onComplete: () => {
        typedControls.enabled = true;
        typedControls.update?.();
      },
    });

    return () => {
      tween.kill();
    };
  }, [camera, controls]);

  const animateDagger = async (index: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const daggerGroup = daggerRefs.current[index];
    if (!daggerGroup) return;

    // Animate dagger moving up
    gsap.to(daggerGroup.position, {
      y: daggerGroup.position.y + 2, // Move up
      duration: 1.5,
      ease: "power2.out",
    });
  };

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
    setDaggerSceneVersion((v) => v + 1);
  }, [DaggerModel]);

  useEffect(() => {
    ContinentModel.scene.traverse((obj) => {
      if ((obj as any).isMesh) {
        obj.castShadow = false;
        obj.receiveShadow = true;

        const mat = (obj as any).material;
        if (mat && mat.isMeshStandardMaterial) {
          mat.metalness = 0;
          mat.roughness = 1;
          mat.envMapIntensity = 1;
          mat.needsUpdate = true;
        }
      }
    });
  }, [ContinentModel]);

  useEffect(() => {
    TableModel.scene.traverse((obj) => {
      if ((obj as any).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [TableModel]);

  useEffect(() => {
    HouseModel.scene.traverse((obj) => {
      if ((obj as any).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [HouseModel]);

  return (
    <>
      {/* Post-Processing Effects */}
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={1.1}
          luminanceSmoothing={0.6}
        />
      </EffectComposer>

      {/* Controls */}
      <OrbitControls
        makeDefault
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={8}
        maxDistance={40}
      />

      <CameraArcAnimation
        endPos={targetLocation}
        arcHeight={8}
        play={startArc}
        onComplete={() => {
          setStartArc(false);
          if (pendingLink) {
            startRouteLoading();
            navigate(pendingLink);
          }
        }}
      />

      {/* World */}
      <directionalLight
        castShadow
        position={[10, 15, 10]}
        intensity={2.5}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-near={1}
        shadow-camera-far={120}
      />

      <ambientLight intensity={0.2} />
      <Environment preset="city" />
      {SkyConfig(false)}
      <group scale={1000}>
        <Sky sunPosition={[500, 150, -1000]} turbidity={0.1} />
      </group>

      {/* Shadow Plane */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.97, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial opacity={0.35} />
      </mesh>

      {/* Water */}
      <WaterPlane />

      {/* Models */}
      <primitive
        object={ContinentModel.scene}
        scale={0.02}
        position={[0, -0.95, 0]}
      />
      {/* <primitive object={TableModel.scene} scale={0.02} position={[0, -1, 0]} /> */}

      {/* Pinned Daggers */}
      {pinsData.pins.map((pin, index) => {
        const minYRotation = 0; // Minimum rotation angle in radians
        const maxYRotation = Math.PI * 0.25; // Maximum rotation angle in radians
        const range = maxYRotation - minYRotation;
        const randomRotation = minYRotation + ((index * 0.5) % range); // Different angle for each

        const minXRotation = 0;
        const maxXRotation = Math.PI * 4;
        const xRange = maxXRotation - minXRotation;
        const randomXRotation = minXRotation + ((index * 0.5) % xRange);

        return (
          <>
            {/* Dagger with rotation */}
            <group
              key={`dagger-${index}`}
              ref={(el) => {
                if (el) daggerRefs.current[index] = el;
              }}
              position={pin.position as [number, number, number]}
              rotation={[Math.PI / 2, randomRotation, randomXRotation]} // Point downwards + unique Y rotation
              onClick={(e) => {
                e.stopPropagation();
                if (pin.link) {
                  setTargetLocation(pin.position as [number, number, number]);
                  setPendingLink(pin.link);
                  setStartArc(true);
                  animateDagger(index);
                }
              }}
              onPointerEnter={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerLeave={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "default";
              }}
            >
              <Clone
                key={daggerSceneVersion}
                object={DaggerModel.scene}
                scale={0.3}
              />
            </group>
            {/* House without rotation */}
            <group
              key={`house-${index}`}
              position={pin.position as [number, number, number]}
            >
              <Clone
                key={daggerSceneVersion}
                object={HouseModel.scene}
                scale={0.5}
              />
            </group>
          </>
        );
      })}
    </>
  );
};


export const TableContinent = () => {
  const [startArc, setStartArc] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const [targetLocation, setTargetLocation] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [daggerSceneVersion, setDaggerSceneVersion] = useState(0);
  const daggerRefs = useRef<{ [key: number]: THREE.Group }>({});

  const { camera, controls } = useThree();

  const navigate = useNavigate();
  const { startRouteLoading } = useRouteLoader();

  const ContinentModel = useGLTF(
    new URL("../models/AmaralysBaked2.glb", import.meta.url).href
  );
  const TableModel = useGLTF(
    new URL("../models/TableTent.glb", import.meta.url).href
  );
  const DaggerModel = useGLTF(
    new URL("../models/DaggerOrigin.glb", import.meta.url).href
  );
  const HouseModel = useGLTF(
    new URL("../models/House.glb", import.meta.url).href
  );

  useEffect(() => {
    if (!controls) return;
    const typedControls = controls as any;
    typedControls.enabled = false;

    const tween = gsap.to(camera.position, {
      x: 0,
      y: 6,
      z: 15,
      duration: 1.75,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(0, 0, 0);
        typedControls.update?.();
      },
      onComplete: () => {
        typedControls.enabled = true;
        typedControls.update?.();
      },
    });

    return () => {
      tween.kill();
    };
  }, [camera, controls]);

  const animateDagger = async (index: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const daggerGroup = daggerRefs.current[index];
    if (!daggerGroup) return;

    // Animate dagger moving up
    gsap.to(daggerGroup.position, {
      y: daggerGroup.position.y + 2, // Move up
      duration: 1.5,
      ease: "power2.out",
    });
  };

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
    setDaggerSceneVersion((v) => v + 1);
  }, [DaggerModel]);

  useEffect(() => {
    ContinentModel.scene.traverse((obj) => {
      if ((obj as any).isMesh) {
        obj.castShadow = false;
        obj.receiveShadow = true;

        const mat = (obj as any).material;
        if (mat && mat.isMeshStandardMaterial) {
          mat.metalness = 0;
          mat.roughness = 1;
          mat.envMapIntensity = 1;
          mat.needsUpdate = true;
        }
      }
    });
  }, [ContinentModel]);

  useEffect(() => {
    TableModel.scene.traverse((obj) => {
      if ((obj as any).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [TableModel]);

  useEffect(() => {
    HouseModel.scene.traverse((obj) => {
      if ((obj as any).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [HouseModel]);

  return (
    <>
      {/* Post-Processing Effects */}
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={1.1}
          luminanceSmoothing={0.6}
        />
      </EffectComposer>

      {/* Controls */}
      <OrbitControls
        makeDefault
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={8}
        maxDistance={40}
      />

      <CameraArcAnimation
        endPos={targetLocation}
        arcHeight={8}
        play={startArc}
        onComplete={() => {
          setStartArc(false);
          if (pendingLink) {
            startRouteLoading();
            navigate(pendingLink);
          }
        }}
      />

      {/* World */}
      <directionalLight
        castShadow
        position={[10, 15, 10]}
        intensity={2.5}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-near={1}
        shadow-camera-far={120}
      />

      <ambientLight intensity={0.2} />
      <Environment preset="city" />
      <group scale={1000}>
        <Sky
          sunPosition={[300, 200, 0]}
          turbidity={10}
        />
      </group>

      {/* Models */}
      <primitive
        object={ContinentModel.scene}
        scale={0.02}
        position={[0, -0.95, 0]}
      />
      <primitive object={TableModel.scene} scale={0.01} position={[0, -1, 0]} />

      {/* Pinned Daggers */}
      {pinsData.pins.map((pin, index) => {
        const minYRotation = 0
        const maxYRotation = Math.PI * 0.25;
        const range = maxYRotation - minYRotation;
        const randomRotation = minYRotation + ((index * 0.5) % range);
        const minXRotation = 0;
        const maxXRotation = Math.PI * 4;
        const xRange = maxXRotation - minXRotation;
        const randomXRotation = minXRotation + ((index * 0.5) % xRange);

        return (
          <>
            <group
              key={`dagger-${index}`}
              ref={(el) => {
                if (el) daggerRefs.current[index] = el;
              }}
              position={pin.position as [number, number, number]}
              rotation={[Math.PI / 2, randomRotation, randomXRotation]}
              onClick={(e) => {
                e.stopPropagation();
                if (pin.link) {
                  setTargetLocation(pin.position as [number, number, number]);
                  setPendingLink(pin.link);
                  setStartArc(true);
                  animateDagger(index);
                }
              }}
              onPointerEnter={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerLeave={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "default";
              }}
            >
              <Clone
                key={daggerSceneVersion}
                object={DaggerModel.scene}
                scale={0.3}
              />
            </group>
            <group
              key={`house-${index}`}
              position={[pin.position[0], pin.position[1] + 0.3, pin.position[2]]}
            >
              <Clone
                key={daggerSceneVersion}
                object={HouseModel.scene}
                scale={0.01}
              />
            </group>
          </>
        );
      })}
    </>
  );
};