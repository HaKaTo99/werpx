import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

const ProjectNode = ({ position, color, title, value }: any) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);

    useFrame((_state, delta) => {
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.2;
    });

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                scale={hovered ? 1.2 : 1}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                    color={hovered ? '#ffffff' : color}
                    transmission={0.5}
                    opacity={0.8}
                    transparent
                    roughness={0.1}
                    metalness={0.4}
                />
            </mesh>
            <Text
                position={[0, -1.2, 0]}
                fontSize={0.3}
                color="#2c3e50"
                anchorX="center"
                anchorY="middle"
            >
                {title}
            </Text>
            {hovered && (
                <Html position={[0, 1.2, 0]} center>
                    <div style={{ background: 'rgba(44, 62, 80, 0.9)', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                        Rp {value} M
                    </div>
                </Html>
            )}
        </group>
    );
};

export const Profit3DMap = () => {
    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '15px', overflow: 'hidden', background: 'rgba(255, 255, 255, 0.05)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}>
            <Canvas camera={{ position: [0, 2, 7], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#4338ca" />

                <ProjectNode position={[-2.5, 0, 0]} color="#10b981" title="BDC Warehouse" value="3100" />
                <ProjectNode position={[0, 0, 0]} color="#3b82f6" title="Marina Bay" value="1500" />
                <ProjectNode position={[2.5, 0, 0]} color="#ef4444" title="Sky Tower" value="-500" />

                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};
