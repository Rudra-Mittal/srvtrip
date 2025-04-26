import { useEffect, useRef } from 'react';
import * as THREE from 'three'  

const Loader = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Initialize scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, containerWidth / containerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      alpha: true // Enable transparency
    });
    
    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const sphere = (() => {
      const geometry = new THREE.SphereGeometry(1.3, 25, 20);
      const edges = new THREE.EdgesGeometry(geometry);
      return new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({
              color: 0xffffff,
              transparent: true
          })
      );
  })();

  const cameraWireframe = (() => {
    const group = new THREE.Group();
    
    // Camera body
    const bodyGeometry = new THREE.BoxGeometry(1.9, 1.8, 1.0);
    const bodyEdges = new THREE.EdgesGeometry(bodyGeometry);
    const bodyLines = new THREE.LineSegments(
        bodyEdges,
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true })
    );

    // Lens
    const lensGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.6, 20);
    const lensEdges = new THREE.EdgesGeometry(lensGeometry);
    const lensLines = new THREE.LineSegments(
        lensEdges,
        new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    lensLines.rotation.x = Math.PI/2;
    lensLines.position.z = 0.8;

    // Button generator with optional parameters
    const addButton = (x: number, y: number, z: number, radius = 0.1, height = 0.08) => {
        const geometry = new THREE.CylinderGeometry(radius, radius, height, 8);
        const edges = new THREE.EdgesGeometry(geometry);
        const button = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ 
                color: radius > 0.1 ? 0xff0000 : 0xffffff // Red for shutter button
            })
        );
        button.rotation.x = Math.PI/2;
        button.position.set(x, y, z);
        return button;
    };

    // Add buttons
    group.add(
        bodyLines,
        lensLines,
        // Shutter button (larger and red)
        addButton(0, 0.5, 0.6, 0.15, 0.1), // Center top position
        // Other buttons
        addButton(0.5, 0.5, 0.6),  // Right button
        addButton(-0.5, 0.5, 0.6), // Left button
        addButton(0, -0.5, 0.6)    // Bottom button
    );

    return group;
})();

  // Suitcase wireframe
  const suitcaseWireframe = (() => {
const group = new THREE.Group();

// Main body (vertical cuboid: height > width)
const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 0.8); // Width, Height, Depth
const bodyEdges = new THREE.EdgesGeometry(bodyGeometry);
const bodyLines = new THREE.LineSegments(
  bodyEdges,
  new THREE.LineBasicMaterial({ color: 0xffffff })
);

// Two parallel lines on the top face (horizontal)
const topLinesGeometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  -0.4, 1, 0.4,  -0.4, 1, -0.4,  // Left Line
   0.4, 1, 0.4,   0.4, 1, -0.4   // Right Line
]);
topLinesGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
const topLines = new THREE.LineSegments(
  topLinesGeometry,
  new THREE.LineBasicMaterial({ color: 0xffffff })
);

// Handle (two parallel rods + top bar)
const handleGeometry = new THREE.BufferGeometry();
const handleVertices = new Float32Array([
  // Left vertical rod
  -0.5, 1.2, 0.3,  -0.5, 1.7, 0.3,
  // Right vertical rod
   0.5, 1.2, 0.3,   0.5, 1.7, 0.3,
  // Connecting top bar
  -0.5, 1.7, 0.3,   0.5, 1.7, 0.3
]);
handleGeometry.setAttribute('position', new THREE.BufferAttribute(handleVertices, 3));
const handle = new THREE.LineSegments(
  handleGeometry,
  new THREE.LineBasicMaterial({ color: 0xffffff })
);

// Side straps
const strapGeometry = new THREE.BoxGeometry(0.1, 1.5, 0.8);
const strapEdges = new THREE.EdgesGeometry(strapGeometry);

const leftStrap = new THREE.LineSegments(
  strapEdges,
  new THREE.LineBasicMaterial({ color: 0xffffff })
);
leftStrap.position.set(-0.8, 0.25, 0);

const rightStrap = leftStrap.clone();
rightStrap.position.set(0.8, 0.25, 0);

group.add(
  bodyLines,
  topLines,
  handle,
  leftStrap,
  rightStrap
);

return group;
})();



  scene.add(sphere, cameraWireframe, suitcaseWireframe);

// Physics setup
const gravity = 9.8;
const floorLevel = 1;
const peakHeight = 5;
let currentHeight = floorLevel;
let bounceCount = 0;
let velocity = Math.sqrt(2 * gravity * (peakHeight - floorLevel));
camera.position.set(8, 5, 10);
  camera.lookAt(0, 2, 0);

  let lastTime = 0;

    // Improved resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !containerRef.current) return;
      
      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      // Update camera
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      // Update renderer
      rendererRef.current.setSize(width, height);
    };

    // Use ResizeObserver for container size changes
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Also listen for window resize events
    window.addEventListener('resize', handleResize);

  function animate(timestamp: number) {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
    
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // Physics update
    velocity -= gravity * deltaTime;
    currentHeight += velocity * deltaTime;

    // Bounce logic
    if(currentHeight < floorLevel) {
        velocity = Math.sqrt(2 * gravity * (peakHeight - floorLevel));
        currentHeight = floorLevel;
        bounceCount++;
    }

    // Transition parameters
    const rawProgress = (currentHeight - floorLevel) / (peakHeight - floorLevel);
    const isCameraTurn = bounceCount % 2 === 0;
    
    // Scale-based transition with cubic easing
    const progress = Math.pow(rawProgress, 3);
    const sphereScale = 0.7 - progress;
    const objectScale = progress;

    // Update sphere
    sphere.position.y = currentHeight;
    sphere.scale.set(sphereScale, sphereScale, sphereScale);
    sphere.visible = sphereScale > 0.09;
    sphere.rotation.y += deltaTime * 5 * sphereScale;

    // Update objects
    const updateObject = (obj: THREE.Group<THREE.Object3DEventMap>, active: boolean) => {
        obj.position.copy(sphere.position);
        obj.scale.set(objectScale, objectScale, objectScale);
        obj.visible = active && objectScale > 0.01;
        obj.rotation.y += deltaTime * 5 * objectScale;
    };

    updateObject(cameraWireframe, isCameraTurn);
    updateObject(suitcaseWireframe, !isCameraTurn);
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationIdRef.current = requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animationIdRef.current = requestAnimationFrame(animate);

  return () => {
    resizeObserver.disconnect();
    window.removeEventListener('resize', handleResize);
    
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    
    if (rendererRef.current) {
      rendererRef.current.dispose();
      if (container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
    }
  };
  }, []);

  // Make container size responsive to viewport
  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '30vh',
        minHeight: '200px',
        maxHeight: '400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }} 
    />
  );
};

export default Loader;