
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
      camera.position.set(0.8, 1.4, 1.2);
      camera.lookAt(0, 0, 0);
    }
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const lampLight = new THREE.PointLight(0xffaa77, 1.5, 5);
    lampLight.position.set(-0.6, 1.1, -0.1);
    scene.add(lampLight);

    const windowLight = new THREE.DirectionalLight(0xaaccff, 0.6);
    windowLight.position.set(5, 5, 2);
    scene.add(windowLight);

    // --- SCENE GENERATION BASED ON ACTIVE QUEST ---

    if (activeQuestId === 0) {
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
      // === QUEST 2: THE THIRSTY MONSTERA ===

      // Environment
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0x222222 }));
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = 0;
      scene.add(floor);

      // Asset_Pot: Terracotta material
      const potGeometry = new THREE.CylinderGeometry(0.15, 0.1, 0.25, 32);
      const potMaterial = new THREE.MeshStandardMaterial({ color: 0xcc6633, roughness: 0.8 });
      const pot = new THREE.Mesh(potGeometry, potMaterial);
      pot.position.set(0, 0.125, 0);
      scene.add(pot);

      // Asset_Soil: Cracked Dry Earth
      const soilGeometry = new THREE.CylinderGeometry(0.14, 0.14, 0.02, 32);
      const soilMaterial = new THREE.MeshStandardMaterial({
        color: 0x5d4037,
        roughness: 1,
        bumpScale: 0.05
      });
      const soil = new THREE.Mesh(soilGeometry, soilMaterial);
      soil.position.set(0, 0.24, 0);
      soil.name = "soil_surface";
      scene.add(soil);

      // Asset_Monstera: SkinnedMesh simulation with simple meshes for now
      const monsteraGroup = new THREE.Group();
      monsteraGroup.name = "monstera_group";

      // Stem
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0x228B22 }));
      stem.position.y = 0.25;
      monsteraGroup.add(stem);

      // Leaves
      const leafGeo = new THREE.PlaneGeometry(0.15, 0.2);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, side: THREE.DoubleSide, transparent: true, opacity: 0.95 }); // Yellowish tint for wilt

      for (let i = 0; i < 3; i++) {
        const leaf = new THREE.Mesh(leafGeo, leafMat.clone());
        leaf.position.y = 0.3 + (i * 0.1);
        leaf.position.x = (Math.random() - 0.5) * 0.2;
        leaf.position.z = (Math.random() - 0.5) * 0.2;

        // Initial Wilt Rotation (Angled down)
        leaf.rotation.x = Math.PI / 1.5;
        leaf.rotation.y = Math.random() * Math.PI;
        leaf.userData = { type: 'leaf' };

        monsteraGroup.add(leaf);
      }

      monsteraGroup.position.set(0, 0.25, 0);
      scene.add(monsteraGroup);

      // Quest_Marker_Object: High-poly 3D Question Mark
      const qGroup = new THREE.Group();
      // Simple Question Mark Shape using Torus and Cylinder
      const qTop = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.015, 16, 32, Math.PI * 1.5), new THREE.MeshStandardMaterial({ color: 0x39FF14, emissive: 0x39FF14, emissiveIntensity: 2 }));
      qTop.rotation.z = Math.PI / 4;
      qTop.rotation.y = Math.PI;
      qTop.position.y = 0.05;
      qGroup.add(qTop);

      const qDot = new THREE.Mesh(new THREE.SphereGeometry(0.02), new THREE.MeshStandardMaterial({ color: 0x39FF14, emissive: 0x39FF14, emissiveIntensity: 2 }));
      qDot.position.y = -0.06;
      qGroup.add(qDot);

      qGroup.position.set(0, 0.55, 0); // Approx 2 inches above soil (which is at ~0.25)
      scene.add(qGroup);
      questMarkRef.current = qGroup;

      // Moisture Alarm PCB (Hidden initially)
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
    }

    const animate = () => {
      requestAnimationFrame(animate);
      if (questMarkRef.current && questMarkRef.current.visible) {
        questMarkRef.current.rotation.y += 0.02;
        questMarkRef.current.position.y = 1.05 + Math.sin(Date.now() * 0.002) * 0.04;
      }
      if (splitterRef.current && splitterRef.current.visible) {
        splitterRef.current.rotation.y += 0.005;
      }
      lampLight.intensity = 1.5 + (Math.random() - 0.5) * 0.15;
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
          updateTooltipPos('Light_Lvl', (soilPos.x * widthHalf) + widthHalf + 200, -(soilPos.y * heightHalf) + heightHalf - 100); // Offset for now
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
      splitterRef.current.visible = true;
      questMarkRef.current.visible = false;
      // Detailed transition
      gsap.from(splitterRef.current.scale, { x: 0, y: 0, z: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
    } else if (gameState === GameState.CHARGING && activeQuestId === 1 && questMarkRef.current) {
      // Quest 2 Specific Success Animation
      questMarkRef.current.visible = false;

      // Find Monstera Leaves and animate them up
      if (sceneRef.current) {
        const monsteraGroup = sceneRef.current.getObjectByName('monstera_group');
        if (monsteraGroup) {
          monsteraGroup.children.forEach((child) => {
            // Check if it's a leaf (based on simple logic or naming)
            if (child.userData.type === 'leaf') {
              gsap.to(child.rotation, { x: -Math.PI / 4, duration: 2.0, ease: "power2.out" }); // Straighten up
              gsap.to((child as THREE.Mesh).material, {
                // @ts-ignore - simulating color change/texture update if possible or just tint
                color: new THREE.Color(0x228B22),
                duration: 2.0
              });
            }
          });
        }

        // Show PCB in Soil
        const pcb = sceneRef.current.getObjectByName('moisture_pcb');
        if (pcb) {
          pcb.visible = true;
          gsap.from(pcb.scale, { x: 0, y: 0, z: 0, duration: 1, ease: 'back.out(1.7)' });
        }
      }

    } else if (gameState === GameState.DASHBOARD && splitterRef.current && questMarkRef.current) {
      splitterRef.current.visible = false;
      questMarkRef.current.visible = true;
    }
  }, [gameState]);

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
