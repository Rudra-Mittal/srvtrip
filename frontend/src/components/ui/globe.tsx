import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {countries} from "@/data/globe.ts";
declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElements["mesh"] & {
      new (): ThreeGlobe;
      // Right-side positioning offset (0 is center, 1 is far right)
    };
  }
}

function hexToRgb(hex: string) {
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  const bigint = parseInt(hex, 16);
  
  // Extract the RGB components
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  // Return as an object
  return { r, g, b };
}

extend({ ThreeGlobe: ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  globeScale?: number; // Scale factor for the globe
  positionOffset?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

let numbersOfRings = [0];

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const layersGroupRef = useRef<THREE.Group | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Add refs for custom layers
  const oceanSphereRef = useRef<THREE.Mesh | null>(null);
  const starsLayerRef = useRef<THREE.Points | null>(null);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    globeScale: 2.0,             // Scale factor for the globe
    globeTransparency: 1,      // Transparency for the globe
    oceanOpacity: 0.6,           // Opacity for ocean layer
    starsCount: 5000,            // Number of star particles
    starsSize: 0.05,             // Size of star particles
    // positionOffset: 0.5,         // Right-side positioning offset (0 is center, 1 is far right)
    ...globeConfig,
  };

  // Initialize globe and custom layers
  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      // Create a group for all layers to maintain synchronization
      layersGroupRef.current = new THREE.Group();
      (groupRef.current as any).add(layersGroupRef.current);
      
      // Position the layersGroup based on offset
      if (defaultProps.positionOffset) {
        groupRef.current.position.x = defaultProps.positionOffset * 100;
      }
      
      // Base ThreeGlobe component setup
      globeRef.current = new ThreeGlobe();
      
      // Set scale for globe
      globeRef.current.scale.set(
        defaultProps.globeScale, 
        defaultProps.globeScale, 
        defaultProps.globeScale
      );
      
      (layersGroupRef.current as any).add(globeRef.current);
      
      // Add ocean layer (semi-transparent sphere)
      const oceanGeometry = new THREE.SphereGeometry(
        1.02 * defaultProps.globeScale, 
        50, 
        50
      );
      const oceanMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color('#006994'),
        transparent: true,
        opacity: defaultProps.oceanOpacity,
        shininess: 100,
        side: THREE.DoubleSide,
      });
      oceanSphereRef.current = new THREE.Mesh(oceanGeometry, oceanMaterial);
      
      // Add the ocean to the same group that contains the globe
      (layersGroupRef.current as any).add(oceanSphereRef.current);
      
      // Add twinkling stars layer
      const starsGeometry = new THREE.BufferGeometry();
      const starsVertices = [];
      const starsSizes = [];
      const starsColors = [];
      
      // Generate random stars around the globe
      for (let i = 0; i < defaultProps.starsCount; i++) {
        const radius = (1.04 + Math.random() * 0.05) * defaultProps.globeScale;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);
        
        starsVertices.push(x, y, z);
        
        // Random sizes for stars
        starsSizes.push(0.01 + Math.random() * defaultProps.starsSize);
        
        // Colors with slight variations of white/blue
        const r = 0.8 + Math.random() * 0.2;
        const g = 0.8 + Math.random() * 0.2;
        const b = 0.9 + Math.random() * 0.1;
        starsColors.push(r, g, b);
      }
      
      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      starsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starsSizes, 1));
      starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
      
      const starsMaterial = new THREE.PointsMaterial({
        size: defaultProps.starsSize,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
      });
      
      starsLayerRef.current = new THREE.Points(starsGeometry, starsMaterial);
      
      // Add stars to the layersGroup instead of directly to the globe
      (layersGroupRef.current as any).add(starsLayerRef.current);
      
      setIsInitialized(true);
    }
  }, []);
  
  // Sync rotation for all layers
  useEffect(() => {
    if (!isInitialized || !globeRef.current || !layersGroupRef.current) return;
    
    const syncRotation = () => {
      const frameId = requestAnimationFrame(syncRotation);
      
      // We don't need to manually update rotations as they're all in the same group
      // This is just to ensure the animation frame keeps running for twinkling
      
      return () => cancelAnimationFrame(frameId);
    };
    
    const frameId = requestAnimationFrame(syncRotation);
    return () => cancelAnimationFrame(frameId);
  }, [isInitialized]);
  
  // Animation loop for twinkling stars
  useEffect(() => {
    if (!starsLayerRef.current || !isInitialized) return;
    
    const starsTwinkle = () => {
      if (!starsLayerRef.current) return;
      
      const sizes = starsLayerRef.current.geometry.attributes.size;
      const count = sizes.count;
      
      for (let i = 0; i < count; i++) {
        // Slightly vary size to create twinkling effect
        const scale = 0.8 + Math.random() * 0.4;
        sizes.array[i] *= scale;
        
        // Keep sizes within bounds
        if (sizes.array[i] > defaultProps.starsSize * 1.2) {
          sizes.array[i] = defaultProps.starsSize * 0.8;
        } else if (sizes.array[i] < defaultProps.starsSize * 0.5) {
          sizes.array[i] = defaultProps.starsSize * 0.7;
        }
      }
      
      sizes.needsUpdate = true;
    };
    
    const interval = setInterval(starsTwinkle, 100);
    return () => clearInterval(interval);
  }, [isInitialized]);

  // Build material when globe is initialized or when relevant props change
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
      transparent: boolean;
      opacity: number;
    };
    
    // Make globe transparent
    globeMaterial.transparent = true;
    globeMaterial.opacity = defaultProps.globeTransparency;
    
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
    
    // Update ocean layer if config changes
    if (oceanSphereRef.current) {
      (oceanSphereRef.current.material as THREE.MeshPhongMaterial).opacity = defaultProps.oceanOpacity;
    }
  }, [
    isInitialized,
    globeConfig.globeColor,
    globeConfig.emissive,
    globeConfig.emissiveIntensity,
    globeConfig.shininess,
  ]);

  // Build data when globe is initialized or when data changes
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;

    const arcs = data;
    let points = [];
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number };
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    // remove duplicates for same lat and lng
    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every(
            (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"],
          ),
        ) === i,
    );

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    globeRef.current
      .arcsData(data)
      .arcStartLat((d) => (d as { startLat: number }).startLat * 1)
      .arcStartLng((d) => (d as { startLng: number }).startLng * 1)
      .arcEndLat((d) => (d as { endLat: number }).endLat * 1)
      .arcEndLng((d) => (d as { endLng: number }).endLng * 1)
      .arcColor((e: any) => (e as { color: string }).color)
      .arcAltitude((e) => (e as { arcAlt: number }).arcAlt * 1)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((e) => (e as { order: number }).order * 1)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    globeRef.current
      .pointsData(filteredPoints)
      .pointColor((e) => (e as { color: string }).color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor(() => defaultProps.polygonColor)
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings,
      );
  }, [
    isInitialized,
    data,
    defaultProps.pointSize,
    defaultProps.showAtmosphere,
    defaultProps.atmosphereColor,
    defaultProps.atmosphereAltitude,
    defaultProps.polygonColor,
    defaultProps.arcLength,
    defaultProps.arcTime,
    defaultProps.rings,
    defaultProps.maxRings,
  ]);

  // Handle rings animation with cleanup
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;

    const interval = setInterval(() => {
      if (!globeRef.current) return;

      const newNumbersOfRings = genRandomNumbers(
        0,
        data.length,
        Math.floor((data.length * 4) / 5),
      );

      const ringsData = data
        .filter((d, i) => newNumbersOfRings.includes(i))
        .map((d) => ({
          lat: d.startLat,
          lng: d.startLng,
          color: d.color,
        }));

      globeRef.current.ringsData(ringsData);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [isInitialized, data]);

  return <group ref={groupRef} />;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, []);

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2500); // Increased fog distance
  
  // Increase camera distance to accommodate the larger globe
  const adjustedCameraZ = cameraZ * (props.globeConfig.globeScale || 1.8) / 1.2;
  
  const cameraPosition = globeConfig.positionOffset ? 
    new Vector3(0, 0, adjustedCameraZ) : 
    new Vector3(-(globeConfig.positionOffset ?? 0) * 100, 0, adjustedCameraZ);
  
  const targetPosition = globeConfig.positionOffset ? 
    new Vector3(globeConfig.positionOffset * 100, 0, 0) : 
    new Vector3(0, 0, 0);
  
  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 2500)}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.8} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
        intensity={0.8}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.9}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={1.0}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={adjustedCameraZ}
        maxDistance={adjustedCameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
        target={targetPosition}
      />
    </Canvas>
  );
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}