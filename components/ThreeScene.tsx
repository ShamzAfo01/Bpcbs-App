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
    setGameState: (state: GameState) => void;
    setQuestStates: React.Dispatch<React.SetStateAction<{ solved: boolean }[]>>;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ gameState, activeQuestId, onQuestTap, onQuestHover, onSplitterHover, updateTooltipPos, setGameState, setQuestStates }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const solutionObjRef = useRef<THREE.Group | null>(null);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    useEffect(() => {
        if (!mountRef.current) return;

        // cleanup
        while (mountRef.current.firstChild) {
            mountRef.current.removeChild(mountRef.current.firstChild);
        }

        // Scene Setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Background based on quest
        if (activeQuestId === 2) {
            scene.background = new THREE.Color('#1a0b00'); // Retro Dark
            scene.fog = new THREE.FogExp2(0x1a0b00, 0.05);
        } else if (activeQuestId === 3) {
            scene.background = new THREE.Color('#050510'); // Midnight Blue
            scene.fog = new THREE.FogExp2(0x050510, 0.02);
        } else {
            scene.background = new THREE.Color('#f0f0f0');
        }

        // Camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        // --- Quest Assets ---
        // Placeholder Geometries for Quest Contexts
        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        if (activeQuestId === 0) {
            // Cafe / Splitter
            const socket = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.1), new THREE.MeshStandardMaterial({ color: '#333' }));
            mainGroup.add(socket);
        } else if (activeQuestId === 1) {
            // Monstera
            const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 1, 32), new THREE.MeshStandardMaterial({ color: '#8B4513' }));
            pot.position.y = -1;
            mainGroup.add(pot);
            // Simple Plant Stem
            const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2, 8), new THREE.MeshStandardMaterial({ color: '#228B22' }));
            stem.position.y = 0.5;
            mainGroup.add(stem);
        }

        // --- Solution Object (Hidden by default) ---
        const solutionGroup = new THREE.Group();
        solutionGroup.visible = false;

        // Create specific solution object based on Quest
        const solGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const solMat = new THREE.MeshStandardMaterial({ color: '#00EEEE', emissive: '#00AAAA', emissiveIntensity: 0.5 });
        const solutionMesh = new THREE.Mesh(solGeo, solMat);
        solutionGroup.add(solutionMesh);

        scene.add(solutionGroup);
        solutionObjRef.current = solutionGroup;


        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            if (mainGroup) mainGroup.rotation.y += 0.002;
            renderer.render(scene, camera);

            // Tooltip Projections
            if (activeQuestId === 0) {
                updateTooltip(new THREE.Vector3(1, 1, 0), "Power_Status");
                updateTooltip(new THREE.Vector3(-1, 0, 0), "Socket_Conflict");
            }
            // Add other tooltip logic here per quest
        };
        animate();

        // Helper: Project 3D to 2D
        function updateTooltip(pos3D: THREE.Vector3, id: string) {
            const p = pos3D.clone();
            p.project(camera);
            const x = (p.x * .5 + .5) * window.innerWidth;
            const y = (-(p.y * .5) + .5) * window.innerHeight;
            updateTooltipPos(id, x, y);
        }

        // Handle Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
        };
    }, [activeQuestId]); // Re-init on quest change

    // --- REVEAL ANIMATION ---
    useEffect(() => {
        if (gameState === GameState.REVEALING && solutionObjRef.current) {
            const obj = solutionObjRef.current;
            obj.visible = true;
            obj.position.set(0, 0, 2); // Center screen
            obj.scale.set(0, 0, 0);
            obj.rotation.set(0, 0, 0);

            const tl = gsap.timeline({
                onComplete: () => {
                    // Mark Solved
                    setQuestStates(prev => {
                        const next = [...prev];
                        next[activeQuestId] = { solved: true };
                        return next;
                    });
                    setGameState(GameState.CHARGING);
                }
            });

            // Stage 1: Pop In & Spin
            tl.to(obj.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: "back.out(1.7)" })
                .to(obj.rotation, { y: Math.PI * 2, duration: 1, ease: "power2.inOut" }, "-=0.4");

            // Stage 2: Move to Install Position (simplified to socket position)
            tl.to(obj.position, { x: 0, y: 0, z: 0, duration: 1, ease: "power2.inOut", delay: 0.5 })
                .to(obj.scale, { x: 0.5, y: 0.5, z: 0.5, duration: 1 }, "<");
        }
    }, [gameState, activeQuestId]);

    return <div ref={mountRef} className="width-full height-full" />;
};

export default ThreeScene;
