import { useLayoutEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface CameraArcAnimationProps {
  endPos: [number, number, number];
  arcHeight?: number;
  duration?: number;
  play?: boolean;
  onComplete?: () => void;
}

const CameraArcAnimation = ({ 
  endPos, 
  arcHeight = 5, 
  duration = 2, 
  play = false,
  onComplete
}: CameraArcAnimationProps) => {
  const { camera, controls } = useThree(); 
  
  // Store animation state
  const animationRef = useRef({
    curve: null as THREE.Curve<THREE.Vector3> | null,
    startLookAt: new THREE.Vector3(),
    progress: 0
  });

  useLayoutEffect(() => {
    if (play) {
      const typedControls = controls as unknown as OrbitControlsImpl;
      
      // 1. FREEZE CONTROLS
      if (typedControls) typedControls.enabled = false;

      // 2. CAPTURE CURRENT START POINT
      const start = camera.position.clone();
      const end = new THREE.Vector3(...endPos);

      // 3. CAPTURE CURRENT ROTATION TARGET
      const currentLookAt = typedControls 
        ? typedControls.target.clone() 
        : new THREE.Vector3(0, 0, 0);
        
      animationRef.current.startLookAt = currentLookAt;

      // 4. CALCULATE CURVE (Cubic Bezier for "Table Top" shape)
      // Control Point A
      const controlA = start.clone().add(new THREE.Vector3(0, arcHeight, 0));
      // Control Point B
      const controlB = end.clone().add(new THREE.Vector3(0, arcHeight, 0));
      
      animationRef.current.curve = new THREE.CubicBezierCurve3(start, controlA, controlB, end);
      animationRef.current.progress = 0;

      // 5. RUN GSAP
      gsap.to(animationRef.current, {
        progress: 1,
        duration: duration,
        ease: "power2.inOut",
        onComplete: () => {
          // Animation finished:
          // A. Update controls to look at the new location
          if (typedControls) {
            typedControls.target.copy(end);
            typedControls.enabled = true;
            typedControls.update();
          }
          // B. Trigger external callback
          if (onComplete) onComplete();
        }
      });
    }
  }, [play, endPos, arcHeight, camera, controls, duration, onComplete]);

  useFrame(() => {
    if (play && animationRef.current.curve) {
      const { curve, progress, startLookAt } = animationRef.current;
      
      // Safety check: stop moving if we are done (progress >= 1)
      if (progress < 1) {
        // A. Move Position
        const nextPos = curve.getPointAt(progress);
        camera.position.copy(nextPos);

        // B. Rotate Smoothly (LookAt)
        // Interpolate the "target" from where we were looking -> the dagger location
        const targetLookAt = new THREE.Vector3(...endPos);
        const currentLookAt = new THREE.Vector3().lerpVectors(
            startLookAt, 
            targetLookAt, 
            progress
        );
        
        camera.lookAt(currentLookAt);
        
        // Keep OrbitControls synced invisibly so it's ready on completion
        if (controls) {
            (controls as unknown as OrbitControlsImpl).target.copy(currentLookAt);
        }
      }
    }
  });

  return null;
};

export default CameraArcAnimation;