import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MetalType, GemstoneType, OrnamentType } from '../types';
import { RotateCw, Sparkles, ShieldCheck } from 'lucide-react';

interface Props {
  selectedMetal: MetalType;
  selectedGemstone: GemstoneType;
  caratSize: number;
  initialOrnament?: OrnamentType;
  onMetalChange?: (metal: MetalType) => void;
  onGemstoneChange?: (gem: GemstoneType) => void;
  onCaratChange?: (carat: number) => void;
  onOrnamentChange?: (ornament: OrnamentType) => void;
  showControlsBar?: boolean;
}

export const METAL_CONFIG: Record<
  MetalType,
  { name: string; color: number; roughness: number; metalness: number; label: string }
> = {
  gold24k: {
    name: '24K Pure Gold',
    color: 0xE8B923,
    roughness: 0.12,
    metalness: 0.95,
    label: '24K (999)',
  },
  gold22k: {
    name: '22K BIS Hallmarked',
    color: 0xD4AF37,
    roughness: 0.16,
    metalness: 0.92,
    label: '22K (916)',
  },
  rosegold: {
    name: '18K Rose Gold',
    color: 0xE59E8E,
    roughness: 0.15,
    metalness: 0.94,
    label: '18K Rose',
  },
  platinum: {
    name: 'Platinum 950',
    color: 0xE8ECEF,
    roughness: 0.10,
    metalness: 0.98,
    label: 'Pt 950',
  },
  leh_antique: {
    name: 'Heritage Gold',
    color: 0xB8860B,
    roughness: 0.28,
    metalness: 0.88,
    label: 'Heritage',
  },
};

export const GEM_CONFIG: Record<
  GemstoneType,
  { name: string; color: number; transmission: number; ior: number; label: string }
> = {
  diamond: {
    name: 'Solitaire Diamond',
    color: 0xF8FBFF,
    transmission: 0.88,
    ior: 2.417,
    label: 'Diamond',
  },
  sapphire: {
    name: 'Kashmir Sapphire',
    color: 0x123675,
    transmission: 0.72,
    ior: 1.77,
    label: 'Sapphire',
  },
  emerald: {
    name: 'Verdant Emerald',
    color: 0x0F7B4A,
    transmission: 0.76,
    ior: 1.58,
    label: 'Emerald',
  },
  ruby: {
    name: 'Pigeon Blood Ruby',
    color: 0x9E1020,
    transmission: 0.74,
    ior: 1.76,
    label: 'Ruby',
  },
};

// Helper: Programmatic High-Gloss Studio Reflection Environment Map
function createStudioEnvMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Studio background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0, '#1c1b18');
    bgGrad.addColorStop(0.35, '#3a342a');
    bgGrad.addColorStop(0.5, '#685d4b');
    bgGrad.addColorStop(0.65, '#2e2820');
    bgGrad.addColorStop(1, '#0e0d0b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Warm overhead key softbox
    ctx.fillStyle = '#fff8e8';
    ctx.beginPath();
    ctx.ellipse(512, 120, 240, 60, 0, 0, Math.PI * 2);
    ctx.fill();

    // Crisp side reflection strips for gold edge gleam
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(80, 80, 60, 300);
    ctx.fillRect(880, 80, 60, 300);

    // Warm accent softbox
    ctx.fillStyle = '#e8c878';
    ctx.beginPath();
    ctx.ellipse(320, 260, 100, 40, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Cool rim strip
    ctx.fillStyle = '#b8d4f8';
    ctx.beginPath();
    ctx.ellipse(720, 240, 80, 30, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return texture;
}

export const ThreeJewelleryViewer: React.FC<Props> = ({
  selectedMetal,
  selectedGemstone,
  caratSize,
  initialOrnament = 'ring',
  onMetalChange,
  onGemstoneChange,
  onCaratChange,
  onOrnamentChange,
  showControlsBar = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeOrnament, setActiveOrnament] = useState<OrnamentType>(initialOrnament);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [cameraView, setCameraView] = useState<'perspective' | 'top' | 'side' | 'macro'>('perspective');

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentOrnamentGroupRef = useRef<THREE.Group | null>(null);
  const sparklesRef = useRef<THREE.Points | null>(null);
  const envMapRef = useRef<THREE.Texture | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Smooth Orbit Dragging
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationVelocity = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update internal ornament state if prop changes
  useEffect(() => {
    if (initialOrnament && initialOrnament !== activeOrnament) {
      setActiveOrnament(initialOrnament);
    }
  }, [initialOrnament]);

  // Handler for ornament change
  const handleSelectOrnament = (ornament: OrnamentType) => {
    setActiveOrnament(ornament);
    if (onOrnamentChange) onOrnamentChange(ornament);
  };

  // 1. Initialize Canvas & Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 1.6, 6.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    const envMap = createStudioEnvMap(renderer);
    envMapRef.current = envMap;
    scene.environment = envMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambient = new THREE.AmbientLight(0xfff7ed, 1.2);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfffaea, 3.2);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xdce9ff, 2.5);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    const topSpot = new THREE.SpotLight(0xffffff, 4.0, 16, Math.PI / 5, 0.4);
    topSpot.position.set(0, 9, 2);
    scene.add(topSpot);

    // Sparkle Point Lights
    const fireWarm = new THREE.PointLight(0xffaa44, 1.5, 6);
    fireWarm.position.set(2, 2, 2);
    scene.add(fireWarm);

    const fireCool = new THREE.PointLight(0x44aaff, 1.5, 6);
    fireCool.position.set(-2, 2, -2);
    scene.add(fireCool);

    // Display Pedestal Floor
    const pedestalGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.12, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1f1a18,
      roughness: 0.6,
      metalness: 0.2,
      envMap,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(0, -1.25, 0);
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Soft Radial Shadow Ring
    const shadowGeo = new THREE.RingGeometry(0.1, 2.4, 32);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -1.18, 0);
    scene.add(shadowMesh);

    // Sparkles Field
    const pCount = 35;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 3.5;
      pPos[i + 1] = (Math.random() - 0.5) * 3 + 0.5;
      pPos[i + 2] = (Math.random() - 0.5) * 3.5;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xfff0c4,
      size: 0.07,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const sparkles = new THREE.Points(pGeo, pMat);
    sparklesRef.current = sparkles;
    scene.add(sparkles);

    // Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (currentOrnamentGroupRef.current) {
        if (isAutoRotating && !isDragging.current) {
          currentOrnamentGroupRef.current.rotation.y += delta * 0.45;
        }

        if (!isDragging.current) {
          currentOrnamentGroupRef.current.rotation.y += rotationVelocity.current.x;
          currentOrnamentGroupRef.current.rotation.x += rotationVelocity.current.y;
          rotationVelocity.current.x *= 0.92;
          rotationVelocity.current.y *= 0.92;
        }

        // Gentle floating breath
        currentOrnamentGroupRef.current.position.y = Math.sin(now * 0.0018) * 0.05;
      }

      if (sparklesRef.current) {
        sparklesRef.current.rotation.y += delta * 0.12;
      }

      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      renderer.dispose();
      pedestalGeo.dispose();
      pedestalMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
    };
  }, []);

  // 2. Rebuild the 3D Ornament Mesh when ornament, metal, or gemstone changes
  useEffect(() => {
    const scene = sceneRef.current;
    const envMap = envMapRef.current;
    if (!scene) return;

    // Remove previous ornament group
    if (currentOrnamentGroupRef.current) {
      scene.remove(currentOrnamentGroupRef.current);
      currentOrnamentGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    const ornamentGroup = new THREE.Group();
    currentOrnamentGroupRef.current = ornamentGroup;
    scene.add(ornamentGroup);

    // Material definitions
    const metalCfg = METAL_CONFIG[selectedMetal];
    const gemCfg = GEM_CONFIG[selectedGemstone];

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: metalCfg.color,
      roughness: metalCfg.roughness,
      metalness: metalCfg.metalness,
      envMap,
      envMapIntensity: 2.8,
    });

    const gemMaterial = new THREE.MeshPhysicalMaterial({
      color: gemCfg.color,
      roughness: selectedGemstone === 'diamond' ? 0.02 : 0.06,
      metalness: 0.05,
      transmission: gemCfg.transmission,
      ior: gemCfg.ior,
      thickness: 2.0,
      specularIntensity: 3.0,
      specularColor: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 0.95,
      reflectivity: 0.95,
      envMap,
    });

    const accentDiamondMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.02,
      metalness: 0.1,
      emissive: 0x333333,
      envMap,
      envMapIntensity: 3.0,
    });

    // BUILD ORNAMENT ACCORDING TO TYPE
    if (activeOrnament === 'ring') {
      // ----------------------------------------------------
      // A. SOLITAIRE DIAMOND RING
      // ----------------------------------------------------
      const bandRadius = 1.45;
      const bandTube = 0.20;
      const bandGeo = new THREE.TorusGeometry(bandRadius, bandTube, 36, 100);
      bandGeo.rotateX(Math.PI / 2);
      const band = new THREE.Mesh(bandGeo, goldMaterial);
      band.castShadow = true;
      ornamentGroup.add(band);

      // 6 Prongs Crown
      const crownRadius = 0.58;
      const crownH = 0.8;
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        const px = Math.cos(ang) * crownRadius;
        const pz = Math.sin(ang) * crownRadius;
        const pGeo = new THREE.CylinderGeometry(0.045, 0.075, crownH, 16);
        const prong = new THREE.Mesh(pGeo, goldMaterial);
        prong.position.set(px, bandRadius + crownH / 2 - 0.1, pz);
        prong.rotation.z = -Math.cos(ang) * 0.14;
        prong.rotation.x = Math.sin(ang) * 0.14;
        prong.castShadow = true;
        ornamentGroup.add(prong);
      }

      // Base collar
      const colGeo = new THREE.TorusGeometry(crownRadius * 0.9, 0.055, 16, 32);
      colGeo.rotateX(Math.PI / 2);
      const col = new THREE.Mesh(colGeo, goldMaterial);
      col.position.set(0, bandRadius + 0.12, 0);
      ornamentGroup.add(col);

      // Shoulder Pavé Diamonds
      const microGeo = new THREE.SphereGeometry(0.055, 12, 12);
      for (let side = -1; side <= 1; side += 2) {
        for (let s = 1; s <= 5; s++) {
          const theta = s * 0.11 * side;
          const ax = Math.sin(theta) * (bandRadius + 0.11);
          const ay = Math.cos(theta) * (bandRadius + 0.11);
          const micro = new THREE.Mesh(microGeo, accentDiamondMaterial);
          micro.position.set(ax, ay, 0);
          ornamentGroup.add(micro);
        }
      }

      // Central Solitaire Gemstone
      const gemScale = 0.72 * caratSize;
      const gemGeo = new THREE.OctahedronGeometry(gemScale, 2);
      gemGeo.scale(1, 1.25, 1);
      const gem = new THREE.Mesh(gemGeo, gemMaterial);
      gem.position.set(0, bandRadius + crownH - 0.18, 0);
      gem.castShadow = true;
      ornamentGroup.add(gem);

      ornamentGroup.rotation.set(0.32, 0.4, 0);
      ornamentGroup.position.set(0, -0.2, 0);
    } else if (activeOrnament === 'necklace') {
      // ----------------------------------------------------
      // B. MODERN ROYAL BRIDAL CHOKER / NECKLACE
      // ----------------------------------------------------
      // Outer collar curve
      const collarCurve = new THREE.EllipseCurve(0, 0, 1.7, 1.35, 0, Math.PI, false, 0);
      const points = collarCurve.getPoints(50);
      const collarPoints3D = points.map((p) => new THREE.Vector3(p.x, p.y, 0));
      const path = new THREE.CatmullRomCurve3(collarPoints3D);
      const collarTubeGeo = new THREE.TubeGeometry(path, 64, 0.10, 16, false);
      const collar = new THREE.Mesh(collarTubeGeo, goldMaterial);
      collar.rotation.x = Math.PI / 2.4;
      ornamentGroup.add(collar);

      // Graduated Articulated Gold Filigree Bars & Stones
      const segCount = 15;
      for (let i = 0; i <= segCount; i++) {
        const t = i / segCount;
        const angle = Math.PI * (0.15 + t * 0.7);
        const x = Math.cos(angle) * 1.55;
        const y = Math.sin(angle) * 1.25;
        const z = -Math.sin(angle * 0.5) * 0.3;

        // Gold link segment
        const linkH = 0.35 + Math.sin(t * Math.PI) * 0.35;
        const linkGeo = new THREE.CylinderGeometry(0.04, 0.06, linkH, 12);
        const link = new THREE.Mesh(linkGeo, goldMaterial);
        link.position.set(x, y - linkH / 2 + 0.1, z);
        ornamentGroup.add(link);

        // Hanging briolette gems along the bottom curve
        if (i % 2 === 1) {
          const dropGeo = new THREE.ConeGeometry(0.12, 0.38, 16);
          dropGeo.rotateX(Math.PI);
          const drop = new THREE.Mesh(dropGeo, gemMaterial);
          drop.position.set(x, y - linkH - 0.18, z);
          ornamentGroup.add(drop);

          // Connecting gold cap
          const capGeo = new THREE.SphereGeometry(0.07, 12, 12);
          const cap = new THREE.Mesh(capGeo, goldMaterial);
          cap.position.set(x, y - linkH, z);
          ornamentGroup.add(cap);
        } else {
          // Micro diamond stud on link
          const studGeo = new THREE.SphereGeometry(0.05, 10, 10);
          const stud = new THREE.Mesh(studGeo, accentDiamondMaterial);
          stud.position.set(x, y - 0.1, z + 0.06);
          ornamentGroup.add(stud);
        }
      }

      // Centerpiece Royal Medallion
      const centerDiscGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.08, 32);
      centerDiscGeo.rotateX(Math.PI / 2);
      const centerDisc = new THREE.Mesh(centerDiscGeo, goldMaterial);
      centerDisc.position.set(0, 0.25, 0);
      ornamentGroup.add(centerDisc);

      // Central Royal Solitaire on medallion
      const centerGemGeo = new THREE.OctahedronGeometry(0.32, 2);
      const centerGem = new THREE.Mesh(centerGemGeo, gemMaterial);
      centerGem.position.set(0, 0.25, 0.1);
      ornamentGroup.add(centerGem);

      // Grand Center Teardrop Briolette
      const grandDropGeo = new THREE.ConeGeometry(0.22, 0.65, 20);
      grandDropGeo.rotateX(Math.PI);
      const grandDrop = new THREE.Mesh(grandDropGeo, gemMaterial);
      grandDrop.position.set(0, -0.42, 0);
      ornamentGroup.add(grandDrop);

      ornamentGroup.rotation.set(0.2, 0, 0);
      ornamentGroup.position.set(0, 0.3, 0);
    } else if (activeOrnament === 'bangle') {
      // ----------------------------------------------------
      // C. MODERN BRIDAL DIAMOND KADA / BANGLE
      // ----------------------------------------------------
      const bangleRadius = 1.65;
      const bangleWidth = 0.55;
      const bangleGeo = new THREE.CylinderGeometry(
        bangleRadius,
        bangleRadius,
        bangleWidth,
        64,
        1,
        true
      );
      const bangle = new THREE.Mesh(bangleGeo, goldMaterial);
      ornamentGroup.add(bangle);

      // Top and bottom bevel rim borders
      for (const dy of [-bangleWidth / 2, bangleWidth / 2]) {
        const rimGeo = new THREE.TorusGeometry(bangleRadius, 0.055, 16, 64);
        rimGeo.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, goldMaterial);
        rim.position.y = dy;
        ornamentGroup.add(rim);
      }

      // Inner smooth comfort sleeve
      const innerGeo = new THREE.CylinderGeometry(
        bangleRadius - 0.08,
        bangleRadius - 0.08,
        bangleWidth * 0.95,
        48,
        1,
        true
      );
      const inner = new THREE.Mesh(innerGeo, goldMaterial);
      ornamentGroup.add(inner);

      // 12 Bezel-set Gemstones circling the bangle perimeter
      const stoneCount = 12;
      for (let i = 0; i < stoneCount; i++) {
        const angle = (i / stoneCount) * Math.PI * 2;
        const bx = Math.cos(angle) * (bangleRadius + 0.02);
        const bz = Math.sin(angle) * (bangleRadius + 0.02);

        // Bezel gold collar
        const bzGeo = new THREE.TorusGeometry(0.16, 0.04, 12, 24);
        const bzCollar = new THREE.Mesh(bzGeo, goldMaterial);
        bzCollar.position.set(bx, 0, bz);
        bzCollar.lookAt(0, 0, 0);
        ornamentGroup.add(bzCollar);

        // Alternating Diamond & Colored Gemstones
        const isCenterStone = i % 3 === 0;
        const sGeo = new THREE.OctahedronGeometry(0.14, 2);
        const stone = new THREE.Mesh(sGeo, isCenterStone ? gemMaterial : accentDiamondMaterial);
        stone.position.set(bx, 0, bz);
        ornamentGroup.add(stone);

        // Micro gold filigree beads between stones
        const dotGeo = new THREE.SphereGeometry(0.04, 10, 10);
        const halfAngle = angle + (Math.PI / stoneCount);
        const mx = Math.cos(halfAngle) * (bangleRadius + 0.02);
        const mz = Math.sin(halfAngle) * (bangleRadius + 0.02);
        const dot1 = new THREE.Mesh(dotGeo, goldMaterial);
        dot1.position.set(mx, 0.12, mz);
        const dot2 = new THREE.Mesh(dotGeo, goldMaterial);
        dot2.position.set(mx, -0.12, mz);
        ornamentGroup.add(dot1);
        ornamentGroup.add(dot2);
      }

      ornamentGroup.rotation.set(0.65, 0.35, 0);
      ornamentGroup.position.set(0, -0.1, 0);
    } else if (activeOrnament === 'earrings') {
      // ----------------------------------------------------
      // D. ROYAL CHANDELIER BRIDAL EARRINGS (PAIR)
      // ----------------------------------------------------
      const buildSingleEarring = (xOffset: number) => {
        const earring = new THREE.Group();

        // 1. Top Stud Cluster (Flower medallion)
        const studCenterGeo = new THREE.OctahedronGeometry(0.18, 2);
        const studCenter = new THREE.Mesh(studCenterGeo, gemMaterial);
        studCenter.position.set(0, 1.4, 0);
        earring.add(studCenter);

        // 6 Petal diamonds surrounding stud
        for (let p = 0; p < 6; p++) {
          const pang = (p / 6) * Math.PI * 2;
          const px = Math.cos(pang) * 0.24;
          const py = 1.4 + Math.sin(pang) * 0.24;
          const petalGeo = new THREE.SphereGeometry(0.06, 12, 12);
          const petal = new THREE.Mesh(petalGeo, accentDiamondMaterial);
          petal.position.set(px, py, 0);
          earring.add(petal);
        }

        // 2. Connecting gold link chains
        const link1 = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, 0.35, 12),
          goldMaterial
        );
        link1.position.set(0, 1.05, 0);
        earring.add(link1);

        // 3. Middle Tier Articulated Arch
        const archGeo = new THREE.TorusGeometry(0.42, 0.045, 16, 32, Math.PI);
        archGeo.rotateZ(Math.PI);
        const arch = new THREE.Mesh(archGeo, goldMaterial);
        arch.position.set(0, 0.85, 0);
        earring.add(arch);

        // Gemstone suspended in center of arch
        const midGemGeo = new THREE.OctahedronGeometry(0.16, 2);
        const midGem = new THREE.Mesh(midGemGeo, gemMaterial);
        midGem.position.set(0, 0.72, 0);
        earring.add(midGem);

        // 4. Main Royal Filigree Bell / Dome (Jhumka)
        const domeGeo = new THREE.SphereGeometry(0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeo, goldMaterial);
        dome.position.set(0, 0.15, 0);
        earring.add(dome);

        // Dome bottom rim
        const domeRimGeo = new THREE.TorusGeometry(0.55, 0.05, 16, 32);
        domeRimGeo.rotateX(Math.PI / 2);
        const domeRim = new THREE.Mesh(domeRimGeo, goldMaterial);
        domeRim.position.set(0, 0.15, 0);
        earring.add(domeRim);

        // 5. Dangling Pearl & Gem Drops around the bell rim
        const dropCount = 9;
        for (let d = 0; d < dropCount; d++) {
          const dang = (d / dropCount) * Math.PI * 2;
          const dx = Math.cos(dang) * 0.52;
          const dz = Math.sin(dang) * 0.52;

          const beadGeo = new THREE.SphereGeometry(0.065, 12, 12);
          const bead = new THREE.Mesh(beadGeo, accentDiamondMaterial);
          bead.position.set(dx, 0.0, dz);
          earring.add(bead);

          const tipGeo = new THREE.ConeGeometry(0.06, 0.18, 12);
          tipGeo.rotateX(Math.PI);
          const tip = new THREE.Mesh(tipGeo, gemMaterial);
          tip.position.set(dx, -0.16, dz);
          earring.add(tip);
        }

        // Center drop within dome
        const innerDrop = new THREE.Mesh(
          new THREE.ConeGeometry(0.12, 0.35, 16),
          gemMaterial
        );
        innerDrop.rotation.x = Math.PI;
        innerDrop.position.set(0, -0.12, 0);
        earring.add(innerDrop);

        earring.position.x = xOffset;
        return earring;
      };

      // Create Left and Right Pair
      const leftEarring = buildSingleEarring(-1.15);
      const rightEarring = buildSingleEarring(1.15);
      ornamentGroup.add(leftEarring);
      ornamentGroup.add(rightEarring);

      ornamentGroup.rotation.set(0.1, 0, 0);
      ornamentGroup.position.set(0, -0.2, 0);
    }
  }, [activeOrnament, selectedMetal, selectedGemstone, caratSize]);

  // 3. Camera Presets
  const applyCameraPreset = (view: 'perspective' | 'top' | 'side' | 'macro') => {
    setCameraView(view);
    if (!cameraRef.current || !currentOrnamentGroupRef.current) return;

    const cam = cameraRef.current;
    const orn = currentOrnamentGroupRef.current;

    switch (view) {
      case 'perspective':
        cam.position.set(0, 1.6, 6.2);
        orn.rotation.set(0.28, 0.38, 0);
        break;
      case 'top':
        cam.position.set(0, 5.8, 1.2);
        orn.rotation.set(Math.PI / 2.2, 0, 0);
        break;
      case 'side':
        cam.position.set(5.2, 0.6, 0);
        orn.rotation.set(0, 0, 0);
        break;
      case 'macro':
        cam.position.set(0, 1.8, 3.8);
        orn.rotation.set(0.15, 0.6, 0);
        break;
    }
    cam.lookAt(0, 0.2, 0);
  };

  // Sparkle burst
  const triggerSparkleBurst = () => {
    if (sparklesRef.current) {
      const mat = sparklesRef.current.material as THREE.PointsMaterial;
      mat.size = 0.14;
      mat.color = new THREE.Color(0xffffff);
      setTimeout(() => {
        mat.size = 0.07;
        mat.color = new THREE.Color(0xfff0c4);
      }, 700);
    }
  };

  // Mouse Orbit Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !currentOrnamentGroupRef.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    currentOrnamentGroupRef.current.rotation.y += deltaX * 0.008;
    currentOrnamentGroupRef.current.rotation.x += deltaY * 0.008;

    rotationVelocity.current = { x: deltaX * 0.001, y: deltaY * 0.001 };
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !currentOrnamentGroupRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

    currentOrnamentGroupRef.current.rotation.y += deltaX * 0.01;
    currentOrnamentGroupRef.current.rotation.x += deltaY * 0.01;

    previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.min(Math.max(cameraRef.current.position.z + e.deltaY * 0.005, 3.2), 8.5);
  };

  const ornamentTabs: { id: OrnamentType; label: string; icon: string }[] = [
    { id: 'ring', label: 'Solitaire Ring', icon: '💍' },
    { id: 'necklace', label: 'Bridal Choker', icon: '👑' },
    { id: 'bangle', label: 'Diamond Bangle', icon: '✨' },
    { id: 'earrings', label: 'Chandelier Earrings', icon: '💎' },
  ];

  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[380px] select-none flex flex-col justify-between bg-gradient-to-b from-[#241A18]/5 via-transparent to-[#241A18]/5 overflow-hidden">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        title="Click & Drag to rotate 360°"
      />

      {/* Top Floating Bar: Modern Ornament Switcher */}
      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 z-10 pointer-events-auto">
        {/* Ornament Category Pills */}
        <div className="flex items-center gap-1 bg-[#1F1615]/85 backdrop-blur-md p-1 rounded-xl sm:rounded-2xl border border-white/10 shadow-xl max-w-full overflow-x-auto no-scrollbar">
          {ornamentTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleSelectOrnament(t.id)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all shrink-0 ${
                activeOrnament === t.id
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F2C] text-[#2B090F] shadow-sm font-bold'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Hallmark & 360° Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-[#6B1724] border border-[#D4AF37]/40 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B38F2C]" />
            <span>BIS 916 & IGI 3D Studio</span>
          </div>
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold backdrop-blur-md transition-all ${
              isAutoRotating
                ? 'bg-[#6B1724] text-white border border-[#D4AF37]/40'
                : 'bg-white/90 text-stone-700 border border-stone-300'
            }`}
            title="Toggle 360° Rotation"
          >
            <RotateCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
            <span>360°</span>
          </button>
        </div>
      </div>

      {/* Floating Bottom Toolbar: Angles & Flare */}
      <div className="absolute bottom-20 sm:bottom-22 left-2.5 sm:left-4 right-2.5 sm:right-4 flex items-center justify-between pointer-events-auto z-10">
        {/* Camera Angles */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-stone-200 shadow-lg">
          <button
            type="button"
            onClick={() => applyCameraPreset('perspective')}
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-lg transition-all ${
              cameraView === 'perspective'
                ? 'bg-[#4A1017] text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset('top')}
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-lg transition-all ${
              cameraView === 'top'
                ? 'bg-[#4A1017] text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Top
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset('side')}
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-lg transition-all ${
              cameraView === 'side'
                ? 'bg-[#4A1017] text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Side
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset('macro')}
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-lg transition-all ${
              cameraView === 'macro'
                ? 'bg-[#4A1017] text-white'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Macro
          </button>
        </div>

        {/* Sparkle Burst */}
        <button
          type="button"
          onClick={triggerSparkleBurst}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F3DE8A] text-[#2B090F] font-bold text-[11px] sm:text-xs rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all"
        >
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Glint</span>
        </button>
      </div>

      {/* Clean Bottom Controls Bar (Metals & Gemstones) */}
      {showControlsBar && (
        <div className="relative z-10 bg-white/95 backdrop-blur-md border-t border-[#D4AF37]/25 p-2 sm:p-3 rounded-b-2xl shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 items-center">
            {/* Precious Metal Selector */}
            <div>
              <div className="text-[10px] sm:text-[11px] font-bold text-[#4A1017] uppercase tracking-wider mb-1">
                Gold & Metal
              </div>
              <div className="flex gap-1 sm:gap-1.5">
                {(['gold24k', 'gold22k', 'rosegold', 'platinum'] as MetalType[]).map((m) => {
                  const cfg = METAL_CONFIG[m];
                  const isSel = selectedMetal === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onMetalChange && onMetalChange(m)}
                      className={`flex-1 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded-lg border text-center font-medium transition-all ${
                        isSel
                          ? 'bg-[#4A1017] text-white border-[#4A1017] font-semibold shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-[#D4AF37]'
                      }`}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Center Gemstone Selector */}
            <div>
              <div className="text-[10px] sm:text-[11px] font-bold text-[#4A1017] uppercase tracking-wider mb-1">
                Gemstone
              </div>
              <div className="flex gap-1 sm:gap-1.5">
                {(['diamond', 'sapphire', 'emerald', 'ruby'] as GemstoneType[]).map((g) => {
                  const gem = GEM_CONFIG[g];
                  const isSel = selectedGemstone === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => onGemstoneChange && onGemstoneChange(g)}
                      className={`flex-1 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded-lg border text-center font-medium transition-all ${
                        isSel
                          ? 'bg-[#B38F2C] text-white border-[#B38F2C] font-semibold shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-[#D4AF37]'
                      }`}
                    >
                      {gem.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
