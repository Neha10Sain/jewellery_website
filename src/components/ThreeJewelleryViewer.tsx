import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { MetalType, GemstoneType } from '../types';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Eye, ShieldCheck, Gem, Compass } from 'lucide-react';

interface Props {
  selectedMetal: MetalType;
  selectedGemstone: GemstoneType;
  caratSize: number;
  onMetalChange?: (metal: MetalType) => void;
  onGemstoneChange?: (gem: GemstoneType) => void;
  onCaratChange?: (carat: number) => void;
  showControlsBar?: boolean;
}

export const METAL_CONFIG: Record<MetalType, { name: string; color: number; roughness: number; metalness: number; label: string; desc: string }> = {
  gold24k: {
    name: '24K Imperial Gold',
    color: 0xE6B800,
    roughness: 0.14,
    metalness: 0.95,
    label: '24K (999)',
    desc: 'Purest Royal Himalayan Gold',
  },
  gold22k: {
    name: '22K BIS Hallmarked',
    color: 0xD4AF37,
    roughness: 0.20,
    metalness: 0.92,
    label: '22K (916)',
    desc: 'Traditional Leh Bridal Standard',
  },
  rosegold: {
    name: '18K Rose Blush Gold',
    color: 0xE29B88,
    roughness: 0.18,
    metalness: 0.93,
    label: '18K Rose',
    desc: 'Contemporary Romance Alloy',
  },
  platinum: {
    name: 'Platinum 950 Pure',
    color: 0xDEE2E6,
    roughness: 0.12,
    metalness: 0.98,
    label: 'Pt 950',
    desc: 'Indestructible Celestial Sheen',
  },
  leh_antique: {
    name: 'Antique Leh Heritage Gold',
    color: 0xB8860B,
    roughness: 0.32,
    metalness: 0.88,
    label: 'Heritage',
    desc: 'Ancient Monastery Hand-Patina',
  },
};

export const GEM_CONFIG: Record<GemstoneType, { name: string; color: number; transmission: number; ior: number; label: string; cut: string }> = {
  diamond: {
    name: 'VVS1 Brilliant Diamond',
    color: 0xF5FAFF,
    transmission: 0.86,
    ior: 2.417,
    label: 'Solitaire Diamond',
    cut: '58-Facet Hearts & Arrows',
  },
  sapphire: {
    name: 'Royal Kashmir Blue Sapphire',
    color: 0x143472,
    transmission: 0.72,
    ior: 1.77,
    label: 'Kashmir Sapphire',
    cut: 'Cushion Brilliant Cut',
  },
  emerald: {
    name: 'Colombian Verdant Emerald',
    color: 0x0F7B4A,
    transmission: 0.76,
    ior: 1.58,
    label: 'Zanskar Emerald',
    cut: 'Octagonal Step Emerald Cut',
  },
  ruby: {
    name: 'Burmese Pigeon Blood Ruby',
    color: 0x9B111E,
    transmission: 0.74,
    ior: 1.76,
    label: 'Royal Ruby',
    cut: 'Oval Brilliant Heritage Cut',
  },
};

export const ThreeJewelleryViewer: React.FC<Props> = ({
  selectedMetal,
  selectedGemstone,
  caratSize,
  onMetalChange,
  onGemstoneChange,
  onCaratChange,
  showControlsBar = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isSparkling, setIsSparkling] = useState<boolean>(false);
  const [cameraView, setCameraView] = useState<'perspective' | 'crown' | 'side' | 'macro'>('perspective');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const ringGroupRef = useRef<THREE.Group | null>(null);
  const bandMeshRef = useRef<THREE.Mesh | null>(null);
  const prongsMeshRef = useRef<THREE.Group | null>(null);
  const gemMeshRef = useRef<THREE.Mesh | null>(null);
  const sparklesGroupRef = useRef<THREE.Points | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Mouse interaction variables for smooth orbit
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationVelocity = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 6.5);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and high pixel ratio
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting setup tailored for high jewelry reflection
    // Subtle ambient fill
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.85);
    scene.add(ambientLight);

    // Key Light (Warm sunlight highlight)
    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.8);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Rim/Fill Light (Cool contrast for diamond edges)
    const rimLight = new THREE.DirectionalLight(0xdde8ff, 2.2);
    rimLight.position.set(-4, -2, -4);
    scene.add(rimLight);

    // Top Sparkle Spot Light
    const topSpot = new THREE.SpotLight(0xffffff, 3.5, 15, Math.PI / 6, 0.4);
    topSpot.position.set(0, 8, 2);
    scene.add(topSpot);

    // Dynamic Point lights for diamond dispersion fire
    const dispersionRed = new THREE.PointLight(0xff7755, 1.2, 5);
    dispersionRed.position.set(1.5, 2, 1.5);
    scene.add(dispersionRed);

    const dispersionCyan = new THREE.PointLight(0x55ccff, 1.2, 5);
    dispersionCyan.position.set(-1.5, 2, -1.5);
    scene.add(dispersionCyan);

    // 5. Build Procedural Luxury Ring Model
    const ringGroup = new THREE.Group();
    ringGroupRef.current = ringGroup;
    scene.add(ringGroup);

    // A. Ring Band (Torus with comfortable luxury bevel)
    const bandRadius = 1.6;
    const tubeRadius = 0.22;
    const bandGeometry = new THREE.TorusGeometry(bandRadius, tubeRadius, 48, 120);
    // Rotate to sit gracefully
    bandGeometry.rotateX(Math.PI / 2);

    const metalCfg = METAL_CONFIG[selectedMetal];
    const bandMaterial = new THREE.MeshStandardMaterial({
      color: metalCfg.color,
      roughness: metalCfg.roughness,
      metalness: metalCfg.metalness,
      envMapIntensity: 2.0,
    });

    const bandMesh = new THREE.Mesh(bandGeometry, bandMaterial);
    bandMesh.castShadow = true;
    bandMesh.receiveShadow = true;
    bandMeshRef.current = bandMesh;
    ringGroup.add(bandMesh);

    // B. Prongs Crown Head (Six master prongs holding central stone)
    const prongsGroup = new THREE.Group();
    prongsMeshRef.current = prongsGroup;
    const prongCount = 6;
    const crownRadius = 0.65;
    const crownHeight = 0.85;

    for (let i = 0; i < prongCount; i++) {
      const angle = (i / prongCount) * Math.PI * 2;
      const px = Math.cos(angle) * crownRadius;
      const pz = Math.sin(angle) * crownRadius;

      // Curved tapered prong
      const prongGeo = new THREE.CylinderGeometry(0.045, 0.08, crownHeight, 16);
      const prong = new THREE.Mesh(prongGeo, bandMaterial);
      prong.position.set(px, bandRadius + crownHeight / 2 - 0.1, pz);
      prong.rotation.z = -Math.cos(angle) * 0.15;
      prong.rotation.x = Math.sin(angle) * 0.15;
      prong.castShadow = true;
      prongsGroup.add(prong);
    }

    // Prong base collar
    const collarGeo = new THREE.TorusGeometry(crownRadius * 0.9, 0.06, 16, 32);
    collarGeo.rotateX(Math.PI / 2);
    const collar = new THREE.Mesh(collarGeo, bandMaterial);
    collar.position.set(0, bandRadius + 0.15, 0);
    prongsGroup.add(collar);

    ringGroup.add(prongsGroup);

    // C. Accent Shoulder Diamonds (Micro pavé set along band)
    const accentGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.05,
      metalness: 0.1,
      emissive: 0x444444,
    });
    for (let side = -1; side <= 1; side += 2) {
      for (let s = 1; s <= 5; s++) {
        const theta = (s * 0.11) * side;
        const ax = Math.sin(theta) * (bandRadius + 0.12);
        const ay = Math.cos(theta) * (bandRadius + 0.12);
        const accent = new THREE.Mesh(accentGeo, accentMat);
        accent.position.set(ax, ay, 0);
        ringGroup.add(accent);
      }
    }

    // D. Central Brilliant Gemstone (Multi-faceted diamond geometry)
    const gemCfg = GEM_CONFIG[selectedGemstone];
    const gemGeo = new THREE.OctahedronGeometry(0.75 * caratSize, 2);
    // Custom stretch and bevel for brilliant solitaire cut
    gemGeo.scale(1, 1.25, 1);

    const gemMaterial = new THREE.MeshPhysicalMaterial({
      color: gemCfg.color,
      roughness: 0.04,
      metalness: 0.05,
      transmission: gemCfg.transmission,
      ior: gemCfg.ior,
      thickness: 1.8,
      specularIntensity: 2.5,
      specularColor: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 0.95,
      reflectivity: 0.9,
    });

    const gemMesh = new THREE.Mesh(gemGeo, gemMaterial);
    gemMesh.position.set(0, bandRadius + crownHeight - 0.2, 0);
    gemMesh.castShadow = true;
    gemMeshRef.current = gemMesh;
    ringGroup.add(gemMesh);

    // E. Sparkle Stardust Particle Field (Floating around gem)
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 4;
      particlePositions[i + 1] = (Math.random() - 0.5) * 4 + 1.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffe6aa,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const sparkles = new THREE.Points(particleGeo, particleMat);
    sparklesGroupRef.current = sparkles;
    scene.add(sparkles);

    // Initial delicate tilt
    ringGroup.rotation.x = 0.35;
    ringGroup.rotation.y = 0.45;

    // 6. Animation Render Loop
    let lastTime = performance.now();
    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (ringGroupRef.current) {
        // Auto-rotation when not dragging
        if (isAutoRotating && !isDragging.current) {
          ringGroupRef.current.rotation.y += delta * 0.45;
        }

        // Apply inertia dampening
        if (!isDragging.current) {
          ringGroupRef.current.rotation.y += rotationVelocity.current.x;
          ringGroupRef.current.rotation.x += rotationVelocity.current.y;
          rotationVelocity.current.x *= 0.92;
          rotationVelocity.current.y *= 0.92;
        }

        // Keep slight wobble for organic brilliance
        ringGroupRef.current.position.y = Math.sin(now * 0.0015) * 0.08;
      }

      // Sparkle particle rotation & shimmer
      if (sparklesGroupRef.current) {
        sparklesGroupRef.current.rotation.y += delta * 0.15;
      }

      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      renderer.dispose();
      bandGeometry.dispose();
      gemGeo.dispose();
    };
  }, []);

  // Update Metal Material Dynamically
  useEffect(() => {
    if (!bandMeshRef.current || !prongsMeshRef.current) return;
    const cfg = METAL_CONFIG[selectedMetal];

    const newMaterial = new THREE.MeshStandardMaterial({
      color: cfg.color,
      roughness: cfg.roughness,
      metalness: cfg.metalness,
      envMapIntensity: 2.2,
    });

    bandMeshRef.current.material = newMaterial;
    prongsMeshRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = newMaterial;
      }
    });
  }, [selectedMetal]);

  // Update Gemstone Material & Carat Scale Dynamically
  useEffect(() => {
    if (!gemMeshRef.current) return;
    const cfg = GEM_CONFIG[selectedGemstone];

    const gemMat = new THREE.MeshPhysicalMaterial({
      color: cfg.color,
      roughness: selectedGemstone === 'diamond' ? 0.02 : 0.05,
      metalness: 0.05,
      transmission: cfg.transmission,
      ior: cfg.ior,
      thickness: 1.8,
      specularIntensity: 2.8,
      specularColor: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 0.95,
      reflectivity: 0.92,
    });

    gemMeshRef.current.material = gemMat;

    // Smooth scale based on carat
    const baseScale = 0.75 * caratSize;
    gemMeshRef.current.scale.set(baseScale, baseScale * 1.25, baseScale);
  }, [selectedGemstone, caratSize]);

  // Camera presets
  const applyCameraPreset = (view: 'perspective' | 'crown' | 'side' | 'macro') => {
    setCameraView(view);
    if (!cameraRef.current || !ringGroupRef.current) return;

    const cam = cameraRef.current;
    const ring = ringGroupRef.current;

    switch (view) {
      case 'perspective':
        cam.position.set(0, 1.8, 6.5);
        ring.rotation.set(0.35, 0.45, 0);
        break;
      case 'crown':
        cam.position.set(0, 6.0, 1.2);
        ring.rotation.set(Math.PI / 2, 0, 0);
        break;
      case 'side':
        cam.position.set(5.5, 0.5, 0);
        ring.rotation.set(0, 0, 0);
        break;
      case 'macro':
        cam.position.set(0, 2.2, 3.8);
        ring.rotation.set(0.2, 0.8, 0);
        break;
    }
    cam.lookAt(0, 0.8, 0);
  };

  // Sparkle burst trigger
  const triggerSparkleBurst = () => {
    setIsSparkling(true);
    if (sparklesGroupRef.current) {
      const mat = sparklesGroupRef.current.material as THREE.PointsMaterial;
      mat.size = 0.12;
      mat.color = new THREE.Color(0xffffff);
      setTimeout(() => {
        mat.size = 0.06;
        mat.color = new THREE.Color(0xffe6aa);
        setIsSparkling(false);
      }, 700);
    }
  };

  // Mouse drag Orbit interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !ringGroupRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    ringGroupRef.current.rotation.y += deltaX * 0.008;
    ringGroupRef.current.rotation.x += deltaY * 0.008;

    rotationVelocity.current = {
      x: deltaX * 0.001,
      y: deltaY * 0.001,
    };

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Touch handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !ringGroupRef.current || e.touches.length !== 1) return;

    const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

    ringGroupRef.current.rotation.y += deltaX * 0.01;
    ringGroupRef.current.rotation.x += deltaY * 0.01;

    previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.min(Math.max(cameraRef.current.position.z + e.deltaY * 0.005, 3.2), 8.5);
  };

  return (
    <div
      className="relative w-full h-full min-h-[480px] select-none flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        id="three-jewellery-canvas"
        className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        title="Click & Drag to rotate 360° | Scroll to Zoom"
      />

      {/* 3D Overlay Badges */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-[#2B090F]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30 text-white shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span className="text-xs font-semibold tracking-wider font-cinzel text-[#F5E5B8]">
            REAL-TIME 3D GEMSTUDIO
          </span>
        </div>
        <div className="text-[11px] text-[#4A121A]/80 font-medium tracking-wide bg-white/75 backdrop-blur-sm px-3 py-1 rounded-md w-fit border border-[#D4AF37]/20">
          Drag to Orbit 360° • Pinch / Scroll to Zoom
        </div>
      </div>

      {/* Floating Sparkle / Hallmark Guarantee Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#FAF7F2]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D4AF37]/40 shadow-sm text-xs text-[#6B1724] font-semibold">
        <ShieldCheck className="w-3.5 h-3.5 text-[#B38F2C]" />
        <span>BIS 916 & IGI Certified</span>
      </div>

      {/* Interactive Camera Views & Sparkle Trigger Overlay */}
      <div className="absolute bottom-20 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-auto z-10">
        {/* Camera Angles */}
        <div className="flex items-center gap-1 bg-[#1F1615]/80 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-xl">
          <button
            type="button"
            onClick={() => applyCameraPreset('perspective')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              cameraView === 'perspective'
                ? 'bg-[#B38F2C] text-white shadow-sm font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            3D Studio
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset('crown')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              cameraView === 'crown'
                ? 'bg-[#B38F2C] text-white shadow-sm font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Crown
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset('side')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              cameraView === 'side'
                ? 'bg-[#B38F2C] text-white shadow-sm font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset('macro')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              cameraView === 'macro'
                ? 'bg-[#B38F2C] text-white shadow-sm font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Facet Macro
          </button>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl backdrop-blur-md border transition-all ${
              isAutoRotating
                ? 'bg-[#6B1724] text-white border-[#D4AF37]/50 shadow-md'
                : 'bg-white/80 text-stone-700 border-stone-200 hover:bg-white'
            }`}
            title="Toggle 360° Auto-Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
            <span>{isAutoRotating ? 'Spinning' : 'Paused'}</span>
          </button>

          <button
            type="button"
            onClick={triggerSparkleBurst}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3DE8A] text-[#3E1E05] border border-[#B38F2C]/40 shadow-md hover:brightness-105 active:scale-95 transition-all"
            title="Ignite diamond dispersion sparkle"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSparkling ? 'animate-bounce' : ''}`} />
            <span>Refract Light</span>
          </button>
        </div>
      </div>

      {/* Quick Customizer Bar at bottom */}
      {showControlsBar && (
        <div className="relative z-10 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#D4AF37]/20 p-3 rounded-b-2xl shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            {/* Metal Selector */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6B1724] font-bold block mb-1">
                Gold & Metal Alloy
              </span>
              <div className="flex items-center gap-1.5">
                {(Object.keys(METAL_CONFIG) as MetalType[]).map((metalKey) => {
                  const item = METAL_CONFIG[metalKey];
                  const isSelected = selectedMetal === metalKey;
                  return (
                    <button
                      key={metalKey}
                      type="button"
                      onClick={() => onMetalChange && onMetalChange(metalKey)}
                      className={`flex-1 py-1 px-1.5 text-[11px] rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'border-[#6B1724] bg-[#6B1724] text-white font-semibold shadow-sm'
                          : 'border-stone-300/80 bg-white/70 text-stone-700 hover:border-[#B38F2C]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gemstone Selector */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6B1724] font-bold block mb-1">
                Center Solitaire
              </span>
              <div className="flex items-center gap-1.5">
                {(Object.keys(GEM_CONFIG) as GemstoneType[]).map((gemKey) => {
                  const gem = GEM_CONFIG[gemKey];
                  const isSelected = selectedGemstone === gemKey;
                  return (
                    <button
                      key={gemKey}
                      type="button"
                      onClick={() => onGemstoneChange && onGemstoneChange(gemKey)}
                      className={`flex-1 py-1 px-1.5 text-[11px] rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'border-[#B38F2C] bg-[#B38F2C] text-white font-semibold shadow-sm'
                          : 'border-stone-300/80 bg-white/70 text-stone-700 hover:border-[#B38F2C]'
                      }`}
                    >
                      {gemKey === 'diamond' ? 'Diamond' : gemKey === 'sapphire' ? 'Sapphire' : gemKey === 'emerald' ? 'Emerald' : 'Ruby'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Carat Selector */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6B1724] font-bold block mb-1">
                Carat Scale: {caratSize} ct
              </span>
              <div className="flex items-center gap-1.5">
                {[1.0, 1.5, 2.0, 3.0].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onCaratChange && onCaratChange(size)}
                    className={`flex-1 py-1 px-1 text-[11px] rounded-lg border text-center transition-all ${
                      caratSize === size
                        ? 'border-[#3E1E05] bg-[#3E1E05] text-[#F3DE8A] font-semibold'
                        : 'border-stone-300/80 bg-white/70 text-stone-700 hover:border-[#B38F2C]'
                    }`}
                  >
                    {size} ct
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
