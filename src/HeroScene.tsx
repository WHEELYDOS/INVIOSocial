import { Suspense, useRef, useState, useEffect, Component, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  Lightformer,
  Float,
  ContactShadows,
  Center,
  MeshTransmissionMaterial,
  Html,
} from '@react-three/drei'
import { ACESFilmicToneMapping } from 'three'
import type { Group } from 'three'
import glyphMark from '@/imports/final00.jpg'

/* ------------------------------------------------------------------ */
/* Device capability detection                                         */
/* ------------------------------------------------------------------ */

type DeviceTier = 'high' | 'mid' | 'low'

function detectDeviceTier(): DeviceTier {
  // Check for low device memory (Chrome-only API)
  const nav = navigator as Navigator & { deviceMemory?: number }
  if (nav.deviceMemory && nav.deviceMemory <= 4) return 'mid'

  // Check hardware concurrency
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return 'mid'

  // Mobile and tablet devices get mid-tier instead of skipping 3D completely
  const isTouch = window.matchMedia('(pointer: coarse)').matches
  if (isTouch) return 'mid'

  return 'high'
}

/* ------------------------------------------------------------------ */
/* WebGL Error Boundary — prevents Safari/iOS crashes from              */
/* killing the whole page                                              */
/* ------------------------------------------------------------------ */

class WebGLErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

/* ------------------------------------------------------------------ */
/* 3D Knot — with tier-aware complexity                                */
/* ------------------------------------------------------------------ */

function Knot({ tier }: { tier: DeviceTier }) {
  const group = useRef<Group>(null)

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    // slow, elegant continuous rotation
    g.rotation.y += delta * 0.22
    g.rotation.z += delta * 0.05
  })

  // Reduced geometry for lighter rendering
  const segments = tier === 'mid' ? 64 : 150
  const radialSegments = tier === 'mid' ? 16 : 32

  return (
    <group ref={group}>
      <mesh castShadow={tier !== 'mid'}>
        <torusKnotGeometry args={[1, 0.32, segments, radialSegments, 2, 3]} />
        <MeshTransmissionMaterial
          samples={tier === 'mid' ? 3 : 5}
          resolution={tier === 'mid' ? 128 : 256}
          thickness={0.9}
          roughness={0.06}
          ior={1.42}
          chromaticAberration={tier === 'mid' ? 0.04 : 0.12}
          anisotropy={0.2}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={tier === 'mid' ? 0 : 0.1}
          clearcoat={tier === 'mid' ? 0 : 1}
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

/* ------------------------------------------------------------------ */
/* Video Exporter Component                                            */
/* ------------------------------------------------------------------ */

function VideoExporter() {
  const { gl } = useThree()
  const [recording, setRecording] = useState(false)

  const startRecording = () => {
    if (recording) return
    setRecording(true)
    
    // Capture at 60fps
    const stream = gl.domElement.captureStream(60)
    
    // Attempt to use MP4 if supported, else fallback to WebM
    let mimeType = 'video/webm'
    if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4'
    }

    const mediaRecorder = new MediaRecorder(stream, { mimeType })
    const chunks: Blob[] = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = mimeType === 'video/mp4' ? '3d_model.mp4' : '3d_model.webm'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setRecording(false)
    }

    mediaRecorder.start()
    
    // Record for 6 seconds
    setTimeout(() => {
      mediaRecorder.stop()
    }, 6000)
  }

  return (
    <Html position={[-3.5, 1.5, 0]} center>
      <button
        onClick={startRecording}
        className="rounded bg-strawberry px-4 py-2 text-xs font-bold text-honeydew shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ pointerEvents: 'auto', minWidth: '140px' }}
      >
        {recording ? 'Recording (6s)...' : 'Export Video'}
      </button>
    </Html>
  )
}

/* ------------------------------------------------------------------ */
/* Static Fallback — used on mobile / low-power / WebGL crash          */
/* ------------------------------------------------------------------ */

function StaticFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <img
        src={glyphMark}
        alt="Invio Social infinity mark representing continuous automated workflows"
        className="h-52 w-52 rounded-2xl bg-honeydew object-contain p-4"
        style={{ filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.4))' }}
        width={208}
        height={208}
        loading="eager"
        decoding="async"
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Exported component — tier-aware rendering                           */
/* ------------------------------------------------------------------ */

export default function HeroScene() {
  const [tier, setTier] = useState<DeviceTier>('high')

  useEffect(() => {
    setTier(detectDeviceTier())
  }, [])

  // Low-power devices: skip 3D entirely
  if (tier === 'low') {
    return (
      <div className="h-[420px] w-full xl:h-[560px]">
        <StaticFallback />
      </div>
    )
  }

  const fallbackEl = (
    <div className="flex h-[440px] w-full items-center justify-center xl:h-[580px]">
      <StaticFallback />
    </div>
  )

  return (
    <WebGLErrorBoundary fallback={fallbackEl}>
      <div className="h-[440px] w-full xl:h-[580px]">
        <Canvas
          dpr={tier === 'mid' ? 1 : [1, 1.5]}
          shadows={tier !== 'mid'}
          gl={{
            antialias: tier !== 'mid',
            alpha: true,
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
            powerPreference: 'low-power',
          }}
          // pulled back + narrower fov so the knot never crops
          camera={{ position: [0, 0.3, 7], fov: 30 }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[4, 6, 5]}
            intensity={1.6}
            castShadow={tier !== 'mid'}
            shadow-mapSize={tier === 'mid' ? [512, 512] : [1024, 1024]}
          />
          <directionalLight position={[-6, -2, 2]} intensity={0.6} color="#457b9d" />
          
          <VideoExporter />
          
          <Suspense fallback={null}>
            <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
              {/* Center guarantees the object is framed, never clipped */}
              <Center>
                <Knot tier={tier} />
              </Center>
            </Float>

            {/* soft grounding shadow — skip on mid-tier (requires secondary render pass) */}
            {tier === 'high' && (
              <ContactShadows
                position={[0, -2.1, 0]}
                opacity={0.45}
                scale={11}
                blur={2.8}
                far={4}
                color="#04101f"
              />
            )}

            {/* studio lighting rig → streaked speculars across the glass */}
            {tier !== 'mid' && (
              <Environment resolution={256}>
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
            )}
          </Suspense>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  )
}
