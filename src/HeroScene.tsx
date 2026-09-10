import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  Lightformer,
  Float,
  ContactShadows,
  Center,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { ACESFilmicToneMapping } from 'three'
import type { Group } from 'three'
import glyphMark from '@/imports/final00.jpg'

/* An abstract glassy infinity-knot — echoes the brand "8", reads as flow. */
function Knot({ pointer }: { pointer: { x: number; y: number } }) {
  const group = useRef<Group>(null)

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    // slow, elegant continuous rotation
    g.rotation.y += delta * 0.22
    g.rotation.z += delta * 0.05
    // very gentle parallax — barely reacts to the cursor
    g.rotation.x += (pointer.y * 0.06 - g.rotation.x) * 0.02
    g.position.x += (pointer.x * 0.08 - g.position.x) * 0.02
  })

  return (
    <group ref={group}>
      <mesh castShadow>
        {/* smooth, high-resolution tube → refined glass, not low-poly */}
        <torusKnotGeometry args={[1, 0.32, 320, 48, 2, 3]} />
        <MeshTransmissionMaterial
          samples={10}
          resolution={512}
          thickness={0.9}
          roughness={0.06}
          ior={1.42}
          chromaticAberration={0.12}
          anisotropy={0.4}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          attenuationColor="#a8dadc"
          attenuationDistance={1.6}
          color="#dff1f2"
          background={undefined}
        />
      </mesh>
    </group>
  )
}

function StaticFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <img
        src={glyphMark}
        alt="Invio Social infinity mark"
        className="h-52 w-52 rounded-2xl bg-honeydew object-contain p-4"
        style={{ filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.4))' }}
      />
    </div>
  )
}

export default function HeroScene() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [lowPower, setLowPower] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 640px)').matches
    setLowPower(reduced || small)
  }, [])

  if (lowPower) {
    return (
      <div className="h-[420px] w-full xl:h-[560px]">
        <StaticFallback />
      </div>
    )
  }

  return (
    <div
      className="h-[440px] w-full xl:h-[580px]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setPointer({
          x: ((e.clientX - r.left) / r.width - 0.5) * 2,
          y: ((e.clientY - r.top) / r.height - 0.5) * 2,
        })
      }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        // pulled back + narrower fov so the knot never crops
        camera={{ position: [0, 0.3, 7], fov: 30 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[4, 6, 5]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-6, -2, 2]} intensity={0.6} color="#457b9d" />
        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
            {/* Center guarantees the object is framed, never clipped */}
            <Center>
              <Knot pointer={pointer} />
            </Center>
          </Float>

          {/* soft grounding shadow → premium, grounded feel */}
          <ContactShadows
            position={[0, -2.1, 0]}
            opacity={0.45}
            scale={11}
            blur={2.8}
            far={4}
            color="#04101f"
          />

          {/* studio lighting rig → streaked speculars across the glass */}
          <Environment resolution={512}>
            <group rotation={[0, 0, 0]}>
              <Lightformer
                form="rect"
                intensity={3}
                position={[3, 3, 4]}
                scale={[7, 7, 1]}
                color="#f1faee"
              />
              <Lightformer
                form="rect"
                intensity={2}
                position={[-5, 2, -3]}
                scale={[6, 6, 1]}
                color="#a8dadc"
              />
              <Lightformer
                form="ring"
                intensity={1.4}
                position={[0, -4, 3]}
                scale={[8, 3, 1]}
                color="#457b9d"
              />
              <Lightformer
                form="rect"
                intensity={1.2}
                position={[0, 4, -5]}
                scale={[10, 2, 1]}
                color="#e63946"
              />
            </group>
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  )
}
