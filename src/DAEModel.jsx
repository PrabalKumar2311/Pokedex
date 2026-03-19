import { useLoader } from '@react-three/fiber'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'
import { Suspense } from 'react'
import { Html } from '@react-three/drei'

function Loading() {
  return (
    <Html center>
      <div style={{ color: 'white' }}>Loading 3D model...</div>
    </Html>
  )
}

export default function DAEModel() {
  const collada = useLoader(ColladaLoader, '/models/Bulbasaur_ColladaMax.DAE')
  
  return (
    <Suspense fallback={<Loading />}>
      <primitive 
        object={collada.scene} 
        scale={[0.1, 0.1, 0.1]} 
        position={[0, -1, 0]} 
      />
    </Suspense>
  )
}