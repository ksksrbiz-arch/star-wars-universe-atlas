import { Bloom, EffectComposer } from '@react-three/postprocessing'

/** Optional desktop enhancement; loaded only by the eligible cinematic scene. */
export default function CinematicBloom() {
  return <EffectComposer multisampling={0} enableNormalPass={false}>
    <Bloom intensity={.3} luminanceThreshold={1} luminanceSmoothing={.15} mipmapBlur levels={4} />
  </EffectComposer>
}
