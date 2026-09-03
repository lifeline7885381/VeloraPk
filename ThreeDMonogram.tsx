import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeDMonogramProps {
  size?: 'hero' | 'nav' | 'compact';
  interactive?: boolean;
  className?: string;
  showShimmerTrigger?: boolean;
}

export const ThreeDMonogram: React.FC<ThreeDMonogramProps> = ({
  size = 'hero',
  interactive = true,
  className = '',
  showShimmerTrigger = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const logoGroupRef = useRef<THREE.Group | null>(null);
  const shimmerLightRef = useRef<THREE.PointLight | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isRotating360, setIsRotating360] = useState(false);
  const [shimmerActive, setShimmerActive] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Mouse tilt tracking
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const mousePosition = useRef({ x: 0, y: 0 });

  const isNav = size === 'nav';
  const isCompact = size === 'compact';

  // Trigger light shimmer sweep
  const triggerShimmer = () => {
    setShimmerActive(true);
    setTimeout(() => setShimmerActive(false), 2200);
  };

  const toggle360 = () => {
    setIsRotating360(prev => !prev);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // WebGL support check
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || (isNav ? 44 : isCompact ? 120 : 380);
    const height = container.clientHeight || (isNav ? 44 : isCompact ? 120 : 380);

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.z = isNav ? 7.2 : isCompact ? 6.5 : 5.8;

    // Renderer with complete safe initialization
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      rendererRef.current = renderer;
    } catch (e) {
      console.warn('WebGL initialization error, falling back to 2D emblem:', e);
      setWebglSupported(false);
      return;
    }

    if (!renderer.domElement) {
      setWebglSupported(false);
      return;
    }

    // Clear existing children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Lighting Setup for Metallic Gold Luxury Finish
    // 1. Ambient warm fill
    const ambientLight = new THREE.AmbientLight(0x221a08, 1.8);
    scene.add(ambientLight);

    // 2. Primary directional key light (Metallic Gold: #D4AF37)
    const keyLight = new THREE.DirectionalLight(0xFFD700, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    // 3. Rim light for bevel definition (Bright Gold: #FFD700)
    const rimLight = new THREE.DirectionalLight(0xFFFFFF, 2.2);
    rimLight.position.set(-5, -4, 4);
    scene.add(rimLight);

    // 4. Back rim light for edge silhouettes
    const backLight = new THREE.DirectionalLight(0xF5D76E, 1.6);
    backLight.position.set(0, 4, -4);
    scene.add(backLight);

    // 5. Dynamic Shimmer Point Light (sweeps across the 3D logo)
    const shimmerLight = new THREE.PointLight(0xFFF2A8, 3.5, 12);
    shimmerLight.position.set(-5, 1.5, 3.5);
    scene.add(shimmerLight);
    shimmerLightRef.current = shimmerLight;

    // Materials: Realistic Gold Metallic with High Polish Bevels
    // Palette: Metallic Gold (#D4AF37), Bright Gold (#FFD700), Soft Gold (#F5D76E)
    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xD4AF37),
      emissive: new THREE.Color(0x382A05),
      metalness: 0.94,
      roughness: 0.16,
      clearcoat: 0.88,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
      envMapIntensity: 1.4
    });

    // Secondary Accent Material for Chamfered Inlays
    const darkGoldMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xB58E2A),
      emissive: new THREE.Color(0x1a1303),
      metalness: 0.98,
      roughness: 0.28,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2
    });

    const logoGroup = new THREE.Group();
    logoGroupRef.current = logoGroup;
    scene.add(logoGroup);

    // Extrude Options for Deep Luxury Bevel
    const extrudeSettingsV = {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.09,
      bevelOffset: 0,
      bevelSegments: 4
    };

    const extrudeSettingsP = {
      depth: 0.44,
      bevelEnabled: true,
      bevelThickness: 0.14,
      bevelSize: 0.09,
      bevelOffset: 0,
      bevelSegments: 4
    };

    // --- Build 3D Architectural "V" Monogram ---
    // A majestic, chiseled serif "V"
    const shapeV = new THREE.Shape();
    // Left Wing Top
    shapeV.moveTo(-1.6, 1.25);
    shapeV.lineTo(-1.05, 1.25);
    shapeV.lineTo(-0.25, -1.05); // apex bottom
    shapeV.lineTo(-0.05, -1.05);
    // Right Wing Top
    shapeV.lineTo(0.75, 1.25);
    shapeV.lineTo(1.3, 1.25);
    shapeV.lineTo(0.2, -1.25); // Outer Bottom Apex
    shapeV.lineTo(-0.45, -1.25);
    shapeV.closePath();

    const geoV = new THREE.ExtrudeGeometry(shapeV, extrudeSettingsV);
    geoV.center();
    const meshV = new THREE.Mesh(geoV, goldMaterial);
    meshV.position.set(-0.45, 0, -0.06);
    logoGroup.add(meshV);

    // --- Build 3D Architectural "P" Monogram ---
    // Interlocking and stepped through the right wing of V
    const shapeP = new THREE.Shape();
    // Stem of P
    shapeP.moveTo(0.0, -1.25);
    shapeP.lineTo(0.44, -1.25);
    shapeP.lineTo(0.44, 1.25);
    // Outer loop of P
    shapeP.bezierCurveTo(1.25, 1.25, 1.7, 0.95, 1.7, 0.2);
    shapeP.bezierCurveTo(1.7, -0.55, 1.15, -0.75, 0.44, -0.75);
    shapeP.lineTo(0.44, -0.4);
    shapeP.lineTo(0.0, -0.4);
    shapeP.closePath();

    // Inner Hole of P loop
    const holeP = new THREE.Path();
    holeP.moveTo(0.44, 0.88);
    holeP.lineTo(0.44, -0.38);
    holeP.bezierCurveTo(0.92, -0.38, 1.26, -0.22, 1.26, 0.2);
    holeP.bezierCurveTo(1.26, 0.65, 0.95, 0.88, 0.44, 0.88);
    holeP.closePath();
    shapeP.holes.push(holeP);

    const geoP = new THREE.ExtrudeGeometry(shapeP, extrudeSettingsP);
    geoP.center();
    const meshP = new THREE.Mesh(geoP, goldMaterial);
    // Position P to weave seamlessly with V, stepped slightly forward for depth
    meshP.position.set(0.45, 0.05, 0.12);
    logoGroup.add(meshP);

    // Center jewel core / architectural anchor ring (Mughal Star / Diamond Cut Accent)
    const starShape = new THREE.Shape();
    const outerR = 0.32;
    const innerR = 0.14;
    const points = 8;
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / points;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    const starGeo = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 3
    });
    starGeo.center();
    const starMesh = new THREE.Mesh(starGeo, darkGoldMaterial);
    starMesh.position.set(-0.02, -0.45, 0.28);
    logoGroup.add(starMesh);

    // Add subtle ambient gold floating particles around the logo in hero mode
    let particlesMesh: THREE.Points | null = null;
    if (!isNav) {
      const particleCount = 45;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const scales = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 6;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
        scales[i] = Math.random() * 0.8 + 0.3;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xFFD700,
        size: 0.035,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending
      });

      particlesMesh = new THREE.Points(particleGeo, particleMat);
      scene.add(particlesMesh);
    }

    // Interactive mouse movement handling
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      mousePosition.current = { x, y };
      targetRotation.current.y = x * 0.75;
      targetRotation.current.x = -y * 0.65;
    };

    const handleMouseLeave = () => {
      if (prefersReducedMotion) return;
      targetRotation.current = { x: 0, y: 0 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    let clock = new THREE.Clock();
    let shimmerProgress = 0;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (logoGroup) {
        if (!prefersReducedMotion) {
          // Smooth Damping Lerp for Tilt
          currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
          currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

          // Natural slow idle floating & soft rhythmic tilt
          const idleTiltY = Math.sin(elapsedTime * 0.8) * 0.12;
          const idleTiltX = Math.cos(elapsedTime * 0.6) * 0.08;
          const idleFloatingY = Math.sin(elapsedTime * 1.2) * 0.06;

          logoGroup.position.y = idleFloatingY;

          if (isRotating360) {
            logoGroup.rotation.y += 0.025;
            logoGroup.rotation.x = currentRotation.current.x + idleTiltX;
          } else {
            logoGroup.rotation.y = currentRotation.current.y + idleTiltY;
            logoGroup.rotation.x = currentRotation.current.x + idleTiltX;
          }

          // Subtle floating particles rotation
          if (particlesMesh) {
            particlesMesh.rotation.y = elapsedTime * 0.04;
            particlesMesh.rotation.x = elapsedTime * 0.02;
          }
        }
      }

      // Shimmer Light Sweep Logic (subtle gold light/shimmer passing across the logo)
      if (shimmerLight) {
        if (shimmerActive) {
          shimmerProgress += 0.04;
          const sweepX = -4 + shimmerProgress * 8;
          shimmerLight.position.x = sweepX;
          shimmerLight.position.y = 1.2 + Math.sin(shimmerProgress * Math.PI) * 0.8;
          shimmerLight.intensity = Math.sin((shimmerProgress / 2) * Math.PI) * 5.0 + 1.0;
        } else {
          // Subtle idle shimmer oscillation
          const idleSweep = Math.sin(elapsedTime * 0.75) * 3.5;
          shimmerLight.position.x = idleSweep;
          shimmerLight.position.y = 1.0 + Math.cos(elapsedTime * 0.5) * 0.5;
          shimmerLight.intensity = 2.4 + Math.sin(elapsedTime * 1.5) * 0.8;
        }
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
      geoV.dispose();
      geoP.dispose();
      starGeo.dispose();
      goldMaterial.dispose();
      darkGoldMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size, interactive, isRotating360, shimmerActive, isNav, isCompact]);

  // Fallback if WebGL isn't supported
  if (!webglSupported) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <div className="relative font-decorative font-black text-6xl tracking-tighter text-gold-gradient drop-shadow-[0_10px_20px_rgba(212,175,55,0.4)]">
          VP
        </div>
      </div>
    );
  }

  const containerDimensions = isNav
    ? 'w-10 h-10'
    : isCompact
    ? 'w-28 h-28'
    : 'w-72 h-72 sm:w-96 sm:h-96';

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Soft Gold Backlight Glow */}
      <div 
        className={`absolute rounded-full pointer-events-none transition-all duration-700 ${
          isNav 
            ? 'w-12 h-12 bg-[#D4AF37]/15 blur-md' 
            : 'w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tr from-[#D4AF37]/20 via-[#FFD700]/15 to-transparent blur-3xl'
        }`}
      />

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className={`relative z-10 cursor-grab active:cursor-grabbing ${containerDimensions}`}
        style={{ touchAction: 'none' }}
        title="VELORA PK 3D Gold Monogram (Interactive)"
      />

      {/* Interactive Controls for Hero Mode */}
      {showShimmerTrigger && (
        <div className="flex items-center gap-2 mt-2 z-20">
          <button
            id="shimmer-sweep-btn"
            onClick={triggerShimmer}
            type="button"
            className="px-3 py-1.5 text-xs font-medium text-[#F5D76E] bg-[#0B0B0B]/90 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 hover:border-[#FFD700] rounded-full backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-95 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-ping inline-block" />
            <span>Light Shimmer</span>
          </button>
          <button
            id="rotate-360-btn"
            onClick={toggle360}
            type="button"
            className={`px-3 py-1.5 text-xs font-medium border rounded-full backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-95 cursor-pointer ${
              isRotating360
                ? 'text-[#050505] bg-[#D4AF37] border-[#FFD700]'
                : 'text-[#F5D76E] bg-[#0B0B0B]/90 hover:bg-[#D4AF37]/20 border-[#D4AF37]/40'
            }`}
          >
            <svg className={`w-3 h-3 ${isRotating360 ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{isRotating360 ? 'Orbiting' : '360° Orbit'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
