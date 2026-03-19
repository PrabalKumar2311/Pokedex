import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import DAEModel from './DAEModel'

export default function Bulbasaur() {
  return (
    <Canvas 
      camera={{ position: [3, 3, 3], fov: 50 }}
      style={{ 
        width: '100%', 
        height: '100%', 
        background: '#1a1a1a',
        borderRadius: '8px'
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />
      
      <DAEModel />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  )
}