
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { GameState } from '../types';

interface ThreeSceneProps {
  gameState: GameState;
  activeQuestId: number;
  onQuestTap: () => void;
  onQuestHover: (isHovering: boolean) => void;
  onSplitterHover: (partId: string | null) => void;
  updateTooltipPos: (id: string, x: number, y: number) => void;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ gameState, activeQuestId, onQuestTap, onQuestHover, onSplitterHover, updateTooltipPos }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const questMarkRef = useRef<THREE.Group | null>(null);
  const splitterRef = useRef<THREE.Group | null>(null);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  useEffect(() => {
    if (!mountRef.current) return;

    // Force clear any existing canvases
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.2, 0.8);
    camera.lookAt(0, 0.8, 0);

    // Specific Camera override for Quest 2
    if (activeQuestId === 1) {
      // Camera_Config: Fixed Wide-Angle POV, FOV: 70
      camera.fov = 70;
      camera.updateProjectionMatrix();
      camera.position.set(0.8, 1.4, 1.2);
      camera.lookAt(0, 0, 0);
    } else if (activeQuestId === 2) {
      // Quest 3: Macro Close-up
      camera.fov = 45;
      camera.updateProjectionMatrix();
      camera.position.set(0, 0.5, 0.4); // Close up top-down-ish
      camera.lookAt(0, 0, 0);
    } else if (activeQuestId === 3) {
      // Quest 4: Kitchen Wide Angle
      camera.fov = 60;
      camera.updateProjectionMatrix();
      camera.position.set(0, 1.5, 2.5);
      camera.lookAt(0, 1.0, 0);
    }
    cameraRef.current = camera;

    // Lighting Setup
    if (activeQuestId === 2) {
      // Environment: Total Darkness with Desktop Lamp
      scene.add(new THREE.AmbientLight(0xffffff, 0.1)); // 0.1 Ambient

      const spotLight = new THREE.SpotLight(0xffffff, 10); // Spotlight_DesktopLamp
      spotLight.position.set(2, 2, 0.5); // Side angle
      spotLight.angle = Math.PI / 8; // Narrow beam
      spotLight.castShadow = true;
      scene.add(spotLight);
    } else if (activeQuestId === 3) {
      // Environment: Midnight Blue Moonlight
      const ambient = new THREE.AmbientLight(0x000044, 0.1);
      scene.add(ambient);

      // Deep Blue Moonlight
      const moonLight = new THREE.DirectionalLight(0x000088, 5.0);
      moonLight.position.set(-5, 5, 2); // Window source
      moonLight.castShadow = true;
      moonLight.shadow.mapSize.width = 4096;
      moonLight.shadow.mapSize.height = 4096;
      scene.add(moonLight);

    } else {
      // Default Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));

      // Lighting: Directional_Light (Sunlight) from Window_Side
      const sunLight = new THREE.DirectionalLight(0xFFF4E0, 2.5); // Warm Sunlight
      sunLight.position.set(5, 5, 2);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      scene.add(sunLight);
    }

    // --- SCENE GENERATION BASED ON ACTIVE QUEST ---
    console.log("ThreeScene useEffect running. activeQuestId:", activeQuestId);

    if (activeQuestId === 0) {
      console.log("Generating Quest 1 Assets");
      // === QUEST 1: CAFE CHRONICLES ===
      const laptopGroup = new THREE.Group();
      const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.3), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
      laptopGroup.add(laptopBase);
      const laptopScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.26), new THREE.MeshBasicMaterial({ color: 0x050505 }));
      laptopScreen.rotation.x = -Math.PI / 4;
      laptopScreen.position.set(0, 0.1, -0.1);
      laptopGroup.add(laptopScreen);
      laptopGroup.position.set(0, 0.8, 0);
      scene.add(laptopGroup);

      const wall = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshStandardMaterial({ color: 0x0a0a0a }));
      wall.position.z = -0.3;
      scene.add(wall);

      const outlet = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.15), new THREE.MeshStandardMaterial({ color: 0x111111 }));
      outlet.position.set(-0.5, 0.9, -0.28);
      scene.add(outlet);

      const lampGroup = new THREE.Group();
      const lBase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.02, 16), new THREE.MeshStandardMaterial({ color: 0x050505 }));
      lampGroup.add(lBase);
      const lPole = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.3, 8), new THREE.MeshStandardMaterial({ color: 0x050505 }));
      lPole.position.y = 0.15;
      lampGroup.add(lPole);
      const lShade = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.08, 0.1, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.DoubleSide }));
      lShade.position.y = 0.3;
      lampGroup.add(lShade);
      lampGroup.position.set(-0.6, 0.8, -0.1);
      scene.add(lampGroup);

      // Detailed Splitter Manifestation
      const splitter = new THREE.Group();
      // PCB Substrate (FR4 Green)
      const pcb = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.08, 0.015),
        new THREE.MeshStandardMaterial({ color: 0x004d00, roughness: 0.3, metalness: 0.2 })
      );
      splitter.add(pcb);

      // Gold Traces (Simulation)
      const trace1 = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.002), new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.1 }));
      trace1.position.z = 0.008;
      trace1.rotation.z = Math.PI / 4;
      splitter.add(trace1);

      // Core PD Chip
      const chip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.01), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 }));
      chip.position.z = 0.012;
      chip.userData = { id: 'pd-chip' };
      splitter.add(chip);

      // USB Ports
      const inPort = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.01, 0.02), new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 }));
      inPort.position.set(0, -0.035, 0.01);
      inPort.userData = { id: 'usbc-in' };
      splitter.add(inPort);

      const outPort = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.01, 0.02), new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 }));
      outPort.position.set(0, 0.035, 0.01);
      outPort.userData = { id: 'usbc-out' };
      splitter.add(outPort);

      splitter.position.set(-0.5, 0.9, -0.22);
      splitter.visible = false;
      scene.add(splitter);
      splitterRef.current = splitter;

      const table = new THREE.Mesh(new THREE.BoxGeometry(2, 0.05, 1.2), new THREE.MeshStandardMaterial({ color: 0x050505 }));
      table.position.y = 0.77;
      scene.add(table);

      // Quest marker for Q1
      const questMarkGroup = new THREE.Group();
      const qShape = new THREE.Shape();
      qShape.moveTo(0, 0);
      qShape.absarc(0, 0.05, 0.035, 0, Math.PI * 2, false);
      const qGeom = new THREE.ExtrudeGeometry(qShape, { depth: 0.01, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01 });
      const qMesh = new THREE.Mesh(qGeom, new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2 }));
      questMarkGroup.add(qMesh);
      questMarkGroup.position.set(-0.5, 1.05, -0.2);
      scene.add(questMarkGroup);
      questMarkRef.current = questMarkGroup;

    } else if (activeQuestId === 1) {
      console.log("Generating Quest 2 Assets");
      // === QUEST 2: THE THIRSTY MONSTERA (High-Fidelity) ===

      // Environment
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0x222222 }));
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = 0;
      floor.receiveShadow = true;
      scene.add(floor);

      // Asset_Pot: Terracotta material
      const potGeometry = new THREE.CylinderGeometry(0.15, 0.1, 0.25, 32);
      const potMaterial = new THREE.MeshStandardMaterial({ color: 0xcc6633, roughness: 0.8 });
      const pot = new THREE.Mesh(potGeometry, potMaterial);
      pot.position.set(0, 0.125, 0);
      pot.castShadow = true;
      pot.receiveShadow = true;
      scene.add(pot);

      // Asset_Soil: Cracked Dry Earth (Procedural approximation)
      const soilGeometry = new THREE.CylinderGeometry(0.14, 0.14, 0.02, 32);
      const soilMaterial = new THREE.MeshStandardMaterial({
        color: 0x5d4037, // Dry Earth
        roughness: 1,
        bumpScale: 0.1
      });
      const soil = new THREE.Mesh(soilGeometry, soilMaterial);
      soil.position.set(0, 0.24, 0); // Asset_Soil (0, 0.45, 0) in directive seems high relative to pot, adjusting to fit pot
      soil.name = "soil_surface";
      soil.receiveShadow = true;
      scene.add(soil);

      // Asset_Monstera: SkinnedMesh simulation
      const monsteraGroup = new THREE.Group();
      monsteraGroup.name = "monstera_group";

      // Stem
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0x228B22 }));
      stem.position.y = 0.25;
      monsteraGroup.add(stem);

      // Leaves (Wilted State)
      // Logic: Saturation -30%, Yellow tint #D4AF37
      const leafGeo = new THREE.PlaneGeometry(0.2, 0.25);
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0xD4AF37, // Yellow tint
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
        roughness: 0.6
      });

      for (let i = 0; i < 4; i++) {
        const leaf = new THREE.Mesh(leafGeo, leafMat.clone());
        leaf.position.y = 0.35 + (i * 0.08);
        leaf.position.x = (Math.random() - 0.5) * 0.3;
        leaf.position.z = (Math.random() - 0.5) * 0.3;

        // Wilt: Leaves angled downward at 45 degrees
        leaf.rotation.x = Math.PI / 1.2;
        leaf.rotation.y = Math.random() * Math.PI;
        leaf.userData = { type: 'leaf' };
        leaf.castShadow = true;

        monsteraGroup.add(leaf);
      }

      monsteraGroup.position.set(0, 0.25, 0);
      scene.add(monsteraGroup);

      // Quest_Marker_Object: High-poly 3D Question Mark
      // Anchor_Point: Surface (0.24) + 2 inches (approx 0.05m -> 0.3)
      const qGroup = new THREE.Group();

      // Neon Green with Flicker
      const qMat = new THREE.MeshStandardMaterial({
        color: 0x39FF14,
        emissive: 0x39FF14,
        emissiveIntensity: 2,
        roughness: 0
      });

      const qTop = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.015, 16, 32, Math.PI * 1.5), qMat);
      qTop.rotation.z = Math.PI / 4;
      qTop.rotation.y = Math.PI;
      qTop.position.y = 0.05;
      qTop.castShadow = false; // Holographic typically doesn't cast shadow
      qGroup.add(qTop);

      const qDot = new THREE.Mesh(new THREE.SphereGeometry(0.02), qMat);
      qDot.position.y = -0.06;
      qGroup.add(qDot);

      qGroup.position.set(0, 0.45, 0);
      scene.add(qGroup);
      questMarkRef.current = qGroup;

      // Moisture Alarm PCB (Hidden)
      const pcb = new THREE.Group();
      pcb.name = "moisture_pcb";
      const pcbBoard = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.01, 0.04), new THREE.MeshStandardMaterial({ color: 0x004400 }));
      pcb.add(pcbBoard);
      const sensorSpike = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.002, 0.1), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
      sensorSpike.rotation.x = Math.PI / 2;
      sensorSpike.position.z = 0.04;
      pcb.add(sensorSpike);

      pcb.position.set(0, 0.26, 0.05);
      pcb.visible = false;
      scene.add(pcb);

    } else if (activeQuestId === 2) {
      console.log("Generating Quest 3 Assets");
      // === QUEST 3: RETRO REVIVAL ===

      // Environment: Dark Surface
      const tableMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
      const table = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), tableMat);
      table.rotation.x = -Math.PI / 2;
      table.receiveShadow = true;
      scene.add(table);

      // Asset: Handheld Console
      const consoleGroup = new THREE.Group();

      // Body: Grey Plastic
      const bodyGeo = new THREE.BoxGeometry(0.3, 0.05, 0.5);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow = true;
      body.receiveShadow = true;
      consoleGroup.add(body);

      // Screen: Olive-Drab LCD (Unlit)
      const screenGeo = new THREE.PlaneGeometry(0.2, 0.2);
      const screenMat = new THREE.MeshStandardMaterial({
        color: 0x2A321B, // Olive-Drab
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.rotation.x = -Math.PI / 2;
      screen.position.y = 0.026; // Slightly above body
      screen.position.z = -0.05;
      screen.name = "retro_screen";
      consoleGroup.add(screen);

      // Screen Bezel (optional detail)
      const bezelGeo = new THREE.BoxGeometry(0.22, 0.01, 0.22);
      const bezelMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
      const bezel = new THREE.Mesh(bezelGeo, bezelMat);
      bezel.position.y = 0.026;
      bezel.position.z = -0.05;
      bezel.scale.set(1.1, 1, 1.1);
      // We'd ideally cut a hole, but for now just place screen on top of body and bezel around it or just imply it. 
      // Simplified: Just the screen on the body is fine for now.

      consoleGroup.position.set(0, 0.025, 0);
      scene.add(consoleGroup);

      // Quest Marker: Cyan Glowing Question Mark
      const qGroup = new THREE.Group();
      const qMat = new THREE.MeshStandardMaterial({
        color: 0x00FFFF,
        emissive: 0x00FFFF,
        emissiveIntensity: 3,
        toneMapped: false // helps glow
      });

      const qTop = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.01, 16, 32, Math.PI * 1.5), qMat);
      qTop.rotation.z = Math.PI / 4;
      qTop.rotation.y = Math.PI;
      qTop.position.y = 0.05;
      qGroup.add(qTop);
      const qDot = new THREE.Mesh(new THREE.SphereGeometry(0.015), qMat);
      qDot.position.y = -0.04;
      qGroup.add(qDot);

      qGroup.position.set(0, 0.1, -0.05); // Centered on screen approx
      scene.add(qGroup);
      questMarkRef.current = qGroup;

      // Backlight LED Strip (Hidden)
      const ledStrip = new THREE.Group();
      ledStrip.name = "led_strip";
      const pcbStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.01), new THREE.MeshStandardMaterial({ color: 0x004400, side: THREE.DoubleSide }));
      pcbStrip.rotation.x = -Math.PI / 2;
      ledStrip.add(pcbStrip);

      // Emulated LEDs
      for (let i = 0; i < 5; i++) {
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.005, 0.01), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2 }));
        led.position.set((i - 2) * 0.04, 0.005, 0);
        ledStrip.add(led);
      }

      ledStrip.position.set(0, 0.02, 0.2); // Start outside
      ledStrip.visible = false;
      scene.add(ledStrip);

    } else if (activeQuestId === 3) {
      console.log("Generating Quest 4 Assets");
      // === QUEST 4: THE MIDNIGHT SNACK ===

      // Floor
      const floorGeo = new THREE.PlaneGeometry(10, 10);
      const floorMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      // Wall
      const wallGeo = new THREE.PlaneGeometry(10, 5);
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.z = -1;
      wall.position.y = 2.5;
      wall.receiveShadow = true;
      scene.add(wall);

      // Kitchen Cabinet (Upper)
      const cabinetGeo = new THREE.BoxGeometry(2, 0.8, 0.6);
      const cabinetMat = new THREE.MeshStandardMaterial({ color: 0xEEEEEE, roughness: 0.2 });
      const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
      cabinet.position.set(0, 1.8, -0.7); // High up
      cabinet.castShadow = true;
      cabinet.receiveShadow = true;
      scene.add(cabinet);

      // Countertop
      const counterGeo = new THREE.BoxGeometry(2, 0.9, 0.8);
      const counterMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
      const counter = new THREE.Mesh(counterGeo, counterMat);
      counter.position.set(0, 0.45, -0.7);
      counter.receiveShadow = true;
      counter.castShadow = true;
      scene.add(counter);

      // Under-Cabinet Lights (Initially OFF)
      const lightGroup = new THREE.Group();
      lightGroup.name = "cabinet_lights";
      const spot1 = new THREE.SpotLight(0xFFDDAA, 0); // Warm White, Int: 0
      spot1.position.set(-0.5, 1.35, -0.5);
      spot1.target.position.set(-0.5, 0, -0.5);
      spot1.angle = Math.PI / 4;
      spot1.penumbra = 0.5;
      lightGroup.add(spot1);
      lightGroup.add(spot1.target);

      const spot2 = new THREE.SpotLight(0xFFDDAA, 0);
      spot2.position.set(0.5, 1.35, -0.5);
      spot2.target.position.set(0.5, 0, -0.5);
      spot2.angle = Math.PI / 4;
      spot2.penumbra = 0.5;
      lightGroup.add(spot2);
      lightGroup.add(spot2.target);
      scene.add(lightGroup);

      // Holographic Marker (Yellow)
      const qGroup = new THREE.Group();
      const qMat = new THREE.MeshBasicMaterial({
        color: 0xFFFF00,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
      // Simple ? shape
      const qTop = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 16, 32, Math.PI * 1.5), qMat);
      qTop.rotation.z = Math.PI / 4;
      qTop.rotation.y = Math.PI;
      qTop.position.y = 0.2;
      qGroup.add(qTop);
      const qDot = new THREE.Mesh(new THREE.SphereGeometry(0.04), qMat);
      qDot.position.y = -0.1;
      qGroup.add(qDot);

      qGroup.position.set(0, 1.3, -0.5); // Under cabinet center
      scene.add(qGroup);
      questMarkRef.current = qGroup;

      // Motion Radius Ring on Floor
      const ringGeo = new THREE.RingGeometry(1.4, 1.5, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x4444FF, transparent: true, opacity: 0.3, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0, 0.01, 1.2); // 1.2m from origin
      ring.name = "motion_ring";
      scene.add(ring);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      if (questMarkRef.current && questMarkRef.current.visible) {
        // Quest 2: Y-Axis_Rotation(speed: 3.0), Ping-Pong_Vertical_Float(range: 0.1, freq: 1.5)
        questMarkRef.current.rotation.y += 0.05;
        questMarkRef.current.position.y = 0.45 + Math.sin(Date.now() * 0.003) * 0.05;

        // Neon Flicker Effect
        const qMesh = questMarkRef.current.children[0] as THREE.Mesh;
        if (qMesh && qMesh.material) {
          (qMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5 + Math.random() * 1.5;
        }
      }
      if (splitterRef.current && splitterRef.current.visible) {
        splitterRef.current.rotation.y += 0.005;
      }
      if (cameraRef.current && rendererRef.current) {
        const widthHalf = window.innerWidth / 2;
        const heightHalf = window.innerHeight / 2;

        if (activeQuestId === 0) {
          const laptopScreenPos = new THREE.Vector3(0, 0.9, 0).project(cameraRef.current);
          const outletPos = new THREE.Vector3(-0.5, 0.9, -0.28).project(cameraRef.current);
          updateTooltipPos('Power_Status', (laptopScreenPos.x * widthHalf) + widthHalf, -(laptopScreenPos.y * heightHalf) + heightHalf);
          updateTooltipPos('Socket_Conflict', (outletPos.x * widthHalf) + widthHalf, -(outletPos.y * heightHalf) + heightHalf);
        } else if (activeQuestId === 1) {
          // Quest 2 Tooltips
          const soilPos = new THREE.Vector3(0, 0.25, 0).project(cameraRef.current);
          updateTooltipPos('Moisture_Lvl', (soilPos.x * widthHalf) + widthHalf, -(soilPos.y * heightHalf) + heightHalf);
          updateTooltipPos('Light_Lvl', (soilPos.x * widthHalf) + widthHalf + 200, -(soilPos.y * heightHalf) + heightHalf - 100);
        } else if (activeQuestId === 2) {
          // Quest 3 Tooltips (Retro)
          const screenPos = new THREE.Vector3(0, 0.026, -0.05).project(cameraRef.current);
          updateTooltipPos('LCD_Info', (screenPos.x * widthHalf) + widthHalf - 100, -(screenPos.y * heightHalf) + heightHalf - 50);
          updateTooltipPos('Power_Input', (screenPos.x * widthHalf) + widthHalf + 100, -(screenPos.y * heightHalf) + heightHalf + 100);
        } else if (activeQuestId === 3) {
          // Quest 4 Tooltips (Kitchen)
          // Illuminance: Under cabinet
          const cabinetUnderPos = new THREE.Vector3(0, 1.4, -0.7).project(cameraRef.current);
          updateTooltipPos('Illuminance', (cabinetUnderPos.x * widthHalf) + widthHalf - 150, -(cabinetUnderPos.y * heightHalf) + heightHalf);

          // Motion Radius: Floor center
          const floorPos = new THREE.Vector3(0, 0, 1.2).project(cameraRef.current);
          updateTooltipPos('Motion_Radius', (floorPos.x * widthHalf) + widthHalf + 100, -(floorPos.y * heightHalf) + heightHalf);
        }
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      if (cameraRef.current) {
        raycaster.setFromCamera(mouse, cameraRef.current);
        if (questMarkRef.current && questMarkRef.current.visible) {
          const intersects = raycaster.intersectObject(questMarkRef.current, true);
          onQuestHover(intersects.length > 0);
        }
        if (splitterRef.current && splitterRef.current.visible) {
          const intersects = raycaster.intersectObjects(splitterRef.current.children, true);
          if (intersects.length > 0) {
            onSplitterHover(intersects[0].object.userData.id || 'pcb');
          } else {
            onSplitterHover(null);
          }
        }
      }
    };

    const handleClick = () => {
      if (cameraRef.current && questMarkRef.current && questMarkRef.current.visible) {
        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObject(questMarkRef.current, true);
        if (intersects.length > 0) onQuestTap();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    });

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [activeQuestId]);

  useEffect(() => {
    if (gameState === GameState.CHARGING && splitterRef.current && questMarkRef.current) {
      if (activeQuestId === 0) {
        splitterRef.current.visible = true;
        questMarkRef.current.visible = false;
        gsap.from(splitterRef.current.scale, { x: 0, y: 0, z: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
      } else if (activeQuestId === 1) {
        // Quest 2 Specific Success Animation
        questMarkRef.current.visible = false;

        if (sceneRef.current) {
          const monsteraGroup = sceneRef.current.getObjectByName('monstera_group');
          if (monsteraGroup) {
            monsteraGroup.children.forEach((child) => {
              if (child.userData.type === 'leaf') {
                gsap.to(child.rotation, { x: -Math.PI / 4, duration: 2.0, ease: "power2.out" });
                gsap.to((child as THREE.Mesh).material, {
                  color: new THREE.Color(0x228B22),
                  duration: 2.0
                });
              }
            });
          }

          // Restore Soil
          const soil = sceneRef.current.getObjectByName('soil_surface') as THREE.Mesh;
          if (soil) {
            gsap.to((soil.material as THREE.MeshStandardMaterial).color, { r: 0.2, g: 0.1, b: 0.05, duration: 2.0 });
          }

          // Show PCB
          const pcb = sceneRef.current.getObjectByName('moisture_pcb');
          if (pcb) {
            pcb.visible = true;
            gsap.from(pcb.scale, { x: 0, y: 0, z: 0, duration: 1, ease: 'back.out(1.7)' });
          }
        }
      } else if (activeQuestId === 2) {
        // Quest 3 Specific Success Animation
        questMarkRef.current.visible = false;

        // Slide in LED Strip
        const ledStrip = sceneRef.current?.getObjectByName('led_strip');
        if (ledStrip) {
          ledStrip.visible = true;
          // Animate sliding under the screen (z: 0.2 -> -0.05)
          gsap.to(ledStrip.position, { z: -0.05, duration: 1.5, ease: "power2.inOut" });
        }

        // Light up the Screen
        const screen = sceneRef.current?.getObjectByName('retro_screen') as THREE.Mesh;
        if (screen) {
          gsap.to((screen.material as THREE.MeshStandardMaterial), {
            emissive: 0x2A321B,
            emissiveIntensity: 2,
            duration: 0.5,
            delay: 1.2 // Wait for strip to slide in
          });
          // Optional: Change color to clearer green
          gsap.to((screen.material as THREE.MeshStandardMaterial).color, {
            r: 0.5, g: 0.7, b: 0.1,
            duration: 0.5,
            delay: 1.2
          });
        });
}
      } else if (activeQuestId === 3) {
  // Quest 4 Success: Turn on Lights
  const lights = sceneRef.current?.getObjectByName('cabinet_lights');
  if (lights) {
    lights.children.forEach(child => {
      if (child instanceof THREE.SpotLight) {
        gsap.to(child, { intensity: 10, duration: 1.5, ease: "power2.out" });
      }
    });
  }
  // Pulse the ring
  const ring = sceneRef.current?.getObjectByName('motion_ring');
  if (ring) {
    gsap.to((ring as THREE.Mesh).material, { opacity: 0.8, duration: 0.5, yoyo: true, repeat: 3 });
  }
  if (questMarkRef.current) questMarkRef.current.visible = false;
}

    } else if (gameState === GameState.DASHBOARD && splitterRef.current && questMarkRef.current) {
  splitterRef.current.visible = false;
  questMarkRef.current.visible = true;
}
  }, [gameState, activeQuestId]);

useEffect(() => {
  if (gameState === GameState.ZOOMING && cameraRef.current) {
    gsap.to(cameraRef.current.position, {
      x: -0.3, y: 0.9, z: 0.2,
      duration: 0.8,
      ease: "power2.inOut"
    });
  } else if (gameState === GameState.DASHBOARD && cameraRef.current) {
    gsap.to(cameraRef.current.position, { x: 0, y: 1.2, z: 0.8, duration: 1 });
  }
}, [gameState]);

return <div ref={mountRef} className="absolute inset-0 z-0 bg-[#020205]" />;
};

export default ThreeScene;
