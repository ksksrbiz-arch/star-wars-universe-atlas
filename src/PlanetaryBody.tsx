import { useMemo } from 'react';
import { AdditiveBlending, BackSide, Color, Vector3 } from 'three';
import type { World } from './data';

type Props = { world: World; preview?: boolean };
type SurfaceFamily = 'desert' | 'ice' | 'ocean' | 'city' | 'lava' | 'gas' | 'forest' | 'rock';

// Art direction only: these families do not add terrain facts, coordinates or scale.
const families: Record<string, SurfaceFamily> = {
  tatooine: 'desert', jakku: 'desert', geonosis: 'desert', jedha: 'desert',
  pasaana: 'desert', seelos: 'desert', mandalore: 'desert', savareen: 'desert',
  hoth: 'ice', ilum: 'ice', mygeeto: 'ice', 'stygeon-prime': 'ice', krownest: 'ice', vandor: 'ice',
  kamino: 'ocean', scarif: 'ocean', 'ahch-to': 'ocean', pabu: 'ocean', 'kef-bir': 'ocean',
  coruscant: 'city', corellia: 'city', daiyu: 'city', hosnian: 'city', 'hosnian-prime': 'city',
  mustafar: 'lava', bespin: 'gas', yavin: 'forest', endor: 'forest',
  naboo: 'forest', kashyyyk: 'forest', dagobah: 'forest', lothal: 'forest',
  dathomir: 'forest', lahmu: 'forest', serenno: 'forest', pantora: 'forest',
  wayland: 'forest', 'ajan-kloss': 'forest', takodana: 'forest',
};
const familyIndex: Record<SurfaceFamily, number> = { desert: 0, ice: 1, ocean: 2, city: 3, lava: 4, gas: 5, forest: 6, rock: 7 };
const palettes: Record<SurfaceFamily, [string, string, string]> = {
  desert: ['#6c3b20', '#edc083', '#d9a766'],
  ice: ['#235168', '#eef7f6', '#82d1ec'],
  ocean: ['#082944', '#238ea6', '#67c5e5'],
  city: ['#15232e', '#678591', '#71b3d5'],
  lava: ['#160d15', '#51433f', '#f26f30'],
  gas: ['#87533b', '#f1d6ae', '#d5b184'],
  forest: ['#092c35', '#56824d', '#67a9bf'],
  rock: ['#313640', '#b7a797', '#8eaccb'],
};

function seedFromId(id: string) {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i++) hash = Math.imul(hash ^ id.charCodeAt(i), 16777619);
  return (hash >>> 0) / 4294967295;
}

const vertexShader = /* glsl */`
  varying vec3 vSurface;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vSurface = normalize(position);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const surfaceShader = /* glsl */`
  uniform float uFamily;
  uniform vec3 uOffset;
  uniform vec3 uDark;
  uniform vec3 uLight;
  uniform vec3 uAir;
  varying vec3 vSurface;
  varying vec3 vNormal;
  varying vec3 vView;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.11,0.17,0.13));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }
  float fbm(vec3 p) {
    float n=0.0, amplitude=0.5;
    for(int i=0;i<5;i++) {
      n += amplitude * noise(p);
      p = p*2.07 + vec3(3.1,7.4,1.8);
      amplitude *= 0.5;
    }
    return n;
  }
  void main() {
    vec3 p = normalize(vSurface);
    vec3 q = p*3.6 + uOffset;
    float terrain = fbm(q);
    float detail = noise(q*19.0);
    float water = 0.0;
    float clouds = 0.0;
    vec3 emission = vec3(0.0);
    vec3 albedo = mix(uDark,uLight,smoothstep(0.18,0.78,terrain));

    if(uFamily < 0.5) {
      float ridges = sin(p.y*43.0 + terrain*22.0 + p.x*8.0)*0.5+0.5;
      albedo = mix(uDark,uLight,clamp(terrain*1.1+ridges*0.22,0.0,1.0));
      albedo *= 0.83 + detail*0.22;
      clouds = smoothstep(0.71,0.88,fbm(q*0.8+vec3(14.0)))*0.17;
    } else if(uFamily < 1.5) {
      float fissures = smoothstep(0.03,0.10,abs(terrain-0.48));
      albedo = mix(uDark,uLight,0.38+fissures*0.56);
      albedo *= 0.87 + detail*0.18;
      clouds = smoothstep(0.51,0.77,fbm(q+vec3(11.0)))*0.34;
    } else if(uFamily < 2.5 || (uFamily > 5.5 && uFamily < 6.5)) {
      float shore = uFamily < 2.5 ? 0.66 : 0.49;
      float land = smoothstep(shore-0.018,shore+0.025,terrain);
      water = 1.0-land;
      vec3 sea = mix(vec3(0.012,0.055,0.10),vec3(0.025,0.25,0.30),smoothstep(shore-0.12,shore,terrain));
      vec3 earth = mix(vec3(0.055,0.12,0.045),vec3(0.34,0.42,0.21),smoothstep(shore,0.84,terrain));
      earth = mix(earth,vec3(0.55,0.49,0.31),smoothstep(0.72,0.9,terrain));
      albedo = mix(sea,earth,land);
      float ice = smoothstep(0.83,0.97,abs(p.y)+terrain*0.08);
      albedo = mix(albedo,vec3(0.73,0.82,0.83),ice);
      float sweep = fbm(p*5.5+vec3(terrain*1.8)+uOffset+vec3(17.0));
      clouds = smoothstep(0.52,0.73,sweep)*0.72;
    } else if(uFamily < 3.5) {
      vec3 cell = abs(fract((p+uOffset)*105.0)-0.5);
      float roads = 1.0-smoothstep(0.015,0.05,min(cell.x,min(cell.y,cell.z)));
      float populated = smoothstep(0.36,0.62,terrain);
      albedo *= 0.6 + roads*0.48;
      float windows = step(0.78,hash(floor((p+uOffset)*230.0)));
      emission = vec3(1.0,0.55,0.19)*(roads*0.72+windows*0.44)*populated;
      clouds = smoothstep(0.63,0.84,fbm(q+vec3(17.0)))*0.3;
    } else if(uFamily < 4.5) {
      float crack = 1.0-smoothstep(0.012,0.045,abs(terrain-0.5));
      albedo = mix(uDark,uLight,terrain*0.6)* (0.75+detail*0.35);
      emission = mix(vec3(0.95,0.07,0.002),vec3(1.0,0.65,0.08),crack)*crack*1.5;
    } else if(uFamily < 5.5) {
      float latitude = p.y*30.0+fbm(q*1.8)*5.0;
      float bands = sin(latitude)*0.5+0.5;
      float storm = fbm(vec3(p.x*12.0,p.y*22.0,p.z*12.0)+uOffset);
      albedo = mix(uDark,uLight,0.22+bands*0.52+storm*0.23);
    } else if(uFamily > 6.5) {
      albedo *= 0.68+detail*0.5;
    }

    vec3 n = normalize(vNormal);
    vec3 view = normalize(vView);
    vec3 light = normalize(vec3(-0.62,0.7,0.85));
    float ndl = dot(n,light);
    float day = max(ndl,0.0);
    float twilight = smoothstep(-0.18,0.22,ndl);
    float rim = pow(1.0-max(dot(n,view),0.0),3.2);
    vec3 lit = albedo*(0.035+day*1.26);
    float spec = pow(max(dot(n,normalize(light+view)),0.0),65.0)*water*day;
    lit += vec3(0.57,0.71,0.8)*spec*0.65;
    lit = mix(lit,vec3(0.89,0.93,0.94)*(0.07+day),clouds);
    float night = 1.0-smoothstep(-0.1,0.35,ndl);
    lit += emission * (uFamily > 3.5 && uFamily < 4.5 ? 1.0 : 0.2+night*0.9);
    lit += uAir*rim*twilight*0.3;
    gl_FragColor = vec4(lit,1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const atmosphereShader = /* glsl */`
  uniform vec3 uAir;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec3 n=normalize(vNormal), view=normalize(vView);
    float edge=pow(1.0-abs(dot(n,view)),3.6);
    float sun=smoothstep(-0.55,0.75,dot(n,normalize(vec3(-0.62,0.7,0.85))));
    gl_FragColor=vec4(uAir,edge*(0.14+sun*0.55)*uStrength);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/** A self-lit, static 3D study. Parent owns placement/visibility; radius is decorative, not physical. */
export default function PlanetaryBody({ world, preview = false }: Props) {
  const seed = seedFromId(world.id);
  const family = families[world.id] ?? 'rock';
  const uniforms = useMemo(() => {
    const [dark, light, air] = palettes[family];
    return {
      uFamily: { value: familyIndex[family] },
      uOffset: { value: new Vector3(seed*31.7,seed*11.3,seed*47.1) },
      uDark: { value: new Color(dark) },
      uLight: { value: new Color(light) },
      uAir: { value: new Color(air) },
    };
  }, [family, seed]);
  const atmosphere = useMemo(() => ({ uAir: uniforms.uAir, uStrength: { value: preview ? 0.72 : 1.0 } }), [uniforms, preview]);

  return <group name={`illustrative-planet-${world.id}`} rotation={[0,0,seed*0.6-0.3]}>
    <mesh raycast={() => {}} renderOrder={8}>
      <sphereGeometry args={[0.45,64,40]}/>
      <shaderMaterial vertexShader={vertexShader} fragmentShader={surfaceShader} uniforms={uniforms}/>
    </mesh>
    <mesh raycast={() => {}} renderOrder={9}>
      <sphereGeometry args={[0.478,48,32]}/>
      <shaderMaterial vertexShader={vertexShader} fragmentShader={atmosphereShader} uniforms={atmosphere}
        side={BackSide} transparent blending={AdditiveBlending} depthWrite={false}/>
    </mesh>
  </group>;
}
