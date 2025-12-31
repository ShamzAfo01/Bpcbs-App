
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { GameState } from '../types';

interface ThreeSceneProps {
  gameState: GameState;
  onQuestTap: () => void;
  onQuestHover: (isHovering: boolean) => void;
  onSplitterHover: (partId: string | null) => void;
  updateTooltipPos: (id: string, x: number, y: number) => void;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ gameState, onQuestTap, onQuestHover, onSplitterHover, updateTooltipPos }) => {
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
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const lampLight = new THREE.PointLight(0xffaa77, 1.5, 5);
    lampLight.position.set(-0.6, 1.1, -0.1);
    scene.add(lampLight);

    const windowLight = new THREE.DirectionalLight(0xaaccff, 0.6);
    windowLight.position.set(5, 5, 2);
    scene.add(windowLight);

    // Assets
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

    // Quest Marker
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

    const table = new THREE.Mesh(new THREE.BoxGeometry(2, 0.05, 1.2), new THREE.MeshStandardMaterial({ color: 0x050505 }));
    table.position.y = 0.77;
    scene.add(table);

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
        const laptopScreenPos = new THREE.Vector3(0, 0.9, 0).project(cameraRef.current);
        const outletPos = new THREE.Vector3(-0.5, 0.9, -0.28).project(cameraRef.current);
        updateTooltipPos('Power_Status', (laptopScreenPos.x * widthHalf) + widthHalf, -(laptopScreenPos.y * heightHalf) + heightHalf);
        updateTooltipPos('Socket_Conflict', (outletPos.x * widthHalf) + widthHalf, -(outletPos.y * heightHalf) + heightHalf);
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (gameState === GameState.CHARGING && splitterRef.current && questMarkRef.current) {
      splitterRef.current.visible = true;
      questMarkRef.current.visible = false;
      // Detailed transition
      gsap.from(splitterRef.current.scale, { x: 0, y: 0, z: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
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
