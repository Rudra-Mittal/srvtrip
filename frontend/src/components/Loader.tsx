import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TravelLoader: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const loadingTextRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Log successful mounting
    console.log('TravelLoader mounted');
    
    // Main variables
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let currentObject: THREE.Group;
    let nextObject: THREE.Group | null = null;
    let bounceHeight = 6; // Higher bounce for dramatic effect
    let initialHeight = bounceHeight;
    let gravity = 0.005; // Stronger gravity for faster initial drop
    let velocity = 0; // Start with zero initial velocity
    let bounceCount = 0;
    let frameId: number | null = null;
    let transitionProgress = 0;
    let isTransitioning = false;
    let particleSystem: THREE.Points;
    let spotlight: THREE.SpotLight;
    let cleanupFunctions: Function[] = []; // NEW: Store cleanup functions
    
    // Object configurations with enhanced colors
    const objectTypes = [
      { 
        type: 'globe',
        create: createGlobe,
        color: 0x00c6ff // Brighter blue
      },
      { 
        type: 'camera',
        create: createCamera,
        color: 0xff3366 // Vibrant pink
      },
      { 
        type: 'backpack',
        create: createBackpack,
        color: 0xb967ff // Vibrant purple
      }
    ];
    
    let currentObjectIndex = 0;
    
    // Initialize the scene
    const init = () => {
      console.log('Initializing Three.js scene');
      
      // Create scene with deeper fog for dramatic effect
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000015, 0.02);
      
      // Create camera
      camera = new THREE.PerspectiveCamera(
        60, 
        mountRef.current!.clientWidth / mountRef.current!.clientHeight, 
        0.1, 
        1000
      );
      camera.position.z = 15; // Moved further back to see higher bounces
      camera.position.y = 3;
      
      // Create renderer with antialiasing
      renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance' // Better performance on high-end devices
      });
      renderer.setSize(mountRef.current!.clientWidth, mountRef.current!.clientHeight);
      renderer.setClearColor(0x000015);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current!.appendChild(renderer.domElement);
      
      // Add lighting
      setupLights();
      
      // Create particle system for background
      createParticles();
      
      // Create ground plane for shadows with more dramatic glow
      createGround();
      
      // Create initial object
      createObject();
      
      // Start animation
      animate();
      
      // Handle window resize
      window.addEventListener('resize', onWindowResize);
      
      console.log('Three.js scene initialized');
    };
    
    // Set up scene lighting
    const setupLights = () => {
      // Soft ambient light
      const ambientLight = new THREE.AmbientLight(0x2a2a4a, 0.4);
      scene.add(ambientLight);
      
      // Main spotlight from above - brighter and more colorful
      spotlight = new THREE.SpotLight(0xa78cff, 1.5);
      spotlight.position.set(0, 12, 5);
      spotlight.angle = 0.5;
      spotlight.penumbra = 0.9; // Softer edge
      spotlight.castShadow = true;
      spotlight.shadow.mapSize.width = 1024;
      spotlight.shadow.mapSize.height = 1024;
      spotlight.shadow.camera.near = 1;
      spotlight.shadow.camera.far = 30;
      spotlight.shadow.bias = -0.0001;
      scene.add(spotlight);
      
      // Rim light for highlights - more intense
      const rimLight = new THREE.DirectionalLight(0x3498db, 0.9);
      rimLight.position.set(5, 3, -10);
      scene.add(rimLight);
      
      // Soft fill light from front-bottom
      const fillLight = new THREE.DirectionalLight(0x9b8eff, 0.5);
      fillLight.position.set(-3, -5, 8);
      scene.add(fillLight);
      
      // Add subtle pulsing point light for more atmosphere
      const pulseLight = new THREE.PointLight(0x5d34ff, 0.8, 15);
      pulseLight.position.set(0, 3, -5);
      scene.add(pulseLight);
      
      // Store pulse light for animation
      (window as any).pulseLight = pulseLight;
    };
    
    // Create floating particles
    const createParticles = () => {
      const particleCount = 400; // More particles
      const particles = new THREE.BufferGeometry();
      
      // Create particle positions in a spherical volume
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount); // Custom sizes
      
      const color1 = new THREE.Color(0x3498db); // blue
      const color2 = new THREE.Color(0x9b59b6); // purple
      const color3 = new THREE.Color(0xff5e62); // pink-red
      
      for (let i = 0; i < particleCount; i++) {
        // Position in a spherical distribution
        const radius = 15 + Math.random() * 20; // Wider distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Random sizes for particles
        sizes[i] = 0.05 + Math.random() * 0.15;
        
        // Gradient colors between three colors for more variety
        const colorChoice = Math.random();
        let particleColor;
        
        if (colorChoice < 0.33) {
          particleColor = color1;
        } else if (colorChoice < 0.66) {
          particleColor = color2;
        } else {
          particleColor = color3;
        }
        
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;
      }
      
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });
      
      particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);
    };
    
    // Create subtle ground plane for shadows
    const createGround = () => {
      const planeGeometry = new THREE.PlaneGeometry(30, 30);
      const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x000015,
        transparent: true,
        opacity: 0.3,
        shininess: 80 // More reflective
      });
      
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = -3; // Lower floor for more dramatic bounces
      plane.receiveShadow = true;
      scene.add(plane);
      
      // Add dramatic circle glow at the bottom
      const glowGeometry = new THREE.CircleGeometry(5, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x2a1f8e,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      });
      
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = -2.99;
      scene.add(glow);
      
      // Add secondary larger glow for more depth
      const outerGlowGeometry = new THREE.CircleGeometry(10, 32);
      const outerGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0x1e0f5f,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
      });
      
      const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
      outerGlow.rotation.x = -Math.PI / 2;
      outerGlow.position.y = -2.98;
      scene.add(outerGlow);
    };
    
    // Handle window resize
    const onWindowResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    // Create object based on current index
    const createObject = () => {
      console.log(`Creating object: ${objectTypes[currentObjectIndex].type}`);
      
      if (currentObject) {
        scene.remove(currentObject);
      }
      
      const objectConfig = objectTypes[currentObjectIndex];
      currentObject = objectConfig.create(objectConfig.color);
      
      // Position above the scene
      currentObject.position.y = initialHeight;
      console.log(`Initial position: y=${currentObject.position.y}`);
      
      // Apply shadow casting
      currentObject.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
        }
        if (child instanceof THREE.Line || child instanceof THREE.LineSegments) {
          const material = child.material as THREE.Material;
          if (material) {
            if (material.hasOwnProperty('transparent')) {
              (material as THREE.Material & { transparent: boolean }).transparent = true;
            }
          }
        }
      });
      
      scene.add(currentObject);
      
      // Reset physics
      velocity = 0;
      bounceCount = 0;
      
      // Update loading text
      if (loadingTextRef.current) {
        progressRef.current += 0.15;
        if (progressRef.current > 1) progressRef.current = 0.15;
        loadingTextRef.current.textContent = `LOADING • ${Math.floor(progressRef.current * 100)}%`;
      }
    };
    
    // Prepare next object for transition
    const prepareNextObject = () => {
      const nextIndex = (currentObjectIndex + 1) % objectTypes.length;
      const objectConfig = objectTypes[nextIndex];
      
      console.log(`Preparing next object: ${objectConfig.type}`);
      
      nextObject = objectConfig.create(objectConfig.color);
      
      // Position it above for smooth entrance
      nextObject.position.y = initialHeight + 5;
      nextObject.scale.set(0.01, 0.01, 0.01); // Start tiny
      
      // Make next object initially transparent
      nextObject.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          const material = child.material as THREE.Material;
          if (material && material.hasOwnProperty('opacity')) {
            (material as THREE.Material & { opacity: number }).opacity = 0;
          }
        }
        
        if (child instanceof THREE.Line || child instanceof THREE.LineSegments) {
          const material = child.material as THREE.Material;
          if (material) {
            if (material.hasOwnProperty('opacity')) {
              (material as THREE.Material & { opacity: number }).opacity = 0;
            }
            if (material.hasOwnProperty('transparent')) {
              (material as THREE.Material & { transparent: boolean }).transparent = true;
            }
          }
        }
      });
      
      scene.add(nextObject);
      isTransitioning = true;
      transitionProgress = 0;
    };
    
    // Complete the transition to the next object
    const completeTransition = () => {
      if (nextObject) {
        console.log('Completing transition');
        
        scene.remove(currentObject);
        currentObject = nextObject;
        nextObject = null;
        currentObjectIndex = (currentObjectIndex + 1) % objectTypes.length;
        
        // Reset for next cycle
        bounceCount = 0;
        velocity = 0;
        isTransitioning = false;
      }
    };
    
    // Main animation loop
    const animate = () => {
      const now = Date.now();
      const time = now * 0.001;
      
      // Animate pulsing light
      const pulseLight = (window as any).pulseLight;
      if (pulseLight) {
        pulseLight.intensity = 0.8 + Math.sin(time * 2) * 0.3;
      }
      
      // Animate particles
      if (particleSystem) {
        particleSystem.rotation.y = time * 0.03;
        
        const positions = particleSystem.geometry.attributes.position;
        const sizes = particleSystem.geometry.attributes.size;
        
        // Staggered updates for better performance
        const updateRange = Math.floor(positions.count / 4);
        const startOffset = Math.floor(time * 10) % 4 * updateRange;
        
        for (let i = startOffset; i < startOffset + updateRange && i < positions.count; i++) {
          const i3 = i * 3;
          
          // Add gentle wave motion
          const x = positions.array[i3];
          const y = positions.array[i3 + 1];
          const z = positions.array[i3 + 2];
          
          // More dramatic particle motion during transitions
          const intensityFactor = isTransitioning ? 2 : 1;
          
          positions.setXYZ(
            i,
            x + Math.sin(time * 0.5 + i * 0.01) * 0.01 * intensityFactor,
            y + Math.cos(time * 0.2 + i * 0.01) * 0.01 * intensityFactor,
            z + Math.cos(time * 0.3 + i * 0.02) * 0.01 * intensityFactor
          );
          
          // Pulse particle sizes
          sizes.array[i] = (0.05 + Math.random() * 0.15) * 
            (1 + Math.sin(time * 2 + i * 0.1) * 0.2);
        }
        
        positions.needsUpdate = true;
        sizes.needsUpdate = true;
      }
      
      // Spotlight dynamic movement
      if (spotlight) {
        spotlight.position.x = Math.sin(time * 0.5) * 2;
        spotlight.position.z = 5 + Math.cos(time * 0.5);
        
        // Make spotlight intensity pulse slightly
        spotlight.intensity = 1.5 + Math.sin(time * 2) * 0.1;
      }
      
      // Handle object transitions
      if (isTransitioning) {
        // Smoother, faster transitions - adjusted for better feel
        transitionProgress += 0.012; // ~1.5 second transition
        
        if (transitionProgress >= 1) {
          completeTransition();
        } else {
          // Custom easing functions for smooth transitions
          const easeOutBack = (t: number): number => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
          };
          
          const easeInOutCubic = (t: number): number => {
            return t < 0.5 
              ? 4 * t * t * t 
              : 1 - Math.pow(-2 * t + 2, 3) / 2;
          };
          
          // Use smoother easing functions for better transitions
          const eased = easeInOutCubic(transitionProgress);
          
          // Current object smoothly fades out
          currentObject.position.y += 0.01; // Slowly drift up
          currentObject.scale.set(
            1 - eased * 0.6, // Don't scale down too much - looks better
            1 - eased * 0.6, 
            1 - eased * 0.6
          );
          
          // Gentler rotation
          currentObject.rotation.y += 0.02;
          
          // Fade out with cubic easing
          currentObject.traverse((child) => {
            if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.LineSegments) {
              const material = child.material as THREE.Material & { opacity?: number };
              if (material && material.opacity !== undefined) {
                material.opacity = Math.max(0, 1 - eased * 1.2);
              }
            }
          });
          
          // Next object grows and drops in smoothly
          if (nextObject) {
            // Apply smoother ease-out motion
            const dropDistance = 5; // How far to drop from initial position
            nextObject.position.y = initialHeight + dropDistance - easeOutBack(eased) * dropDistance;
            
            // Smoother scale-up
            const scale = 0.01 + eased * 0.99;
            nextObject.scale.set(scale, scale, scale);
            
            // Gentle rotation
            nextObject.rotation.y = eased * Math.PI * 0.5;
            
            // Fade in smoothly
            nextObject.traverse((child) => {
              if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.LineSegments) {
                const material = child.material as THREE.Material & { opacity?: number };
                if (material && material.opacity !== undefined) {
                  // Delay fade-in slightly for smoother effect
                  const fadeStart = 0.2;
                  const fadeProgress = Math.max(0, (transitionProgress - fadeStart) / (1 - fadeStart));
                  material.opacity = Math.min(1, easeInOutCubic(fadeProgress) * 1.2);
                }
              }
            });
          }
        }
      } else {
        // Normal physics
        if (currentObject) {
          // Apply gravity
          velocity += gravity;
          
          // Add subtle rotation while falling
          currentObject.rotation.y += 0.01;
          if (velocity > 0) {
            // Create illusion of air resistance
            currentObject.rotation.x = Math.min(0.2, velocity * 0.1);
          }
          
          // Update position
          currentObject.position.y -= velocity;
          
          // Handle floor bounce - MODIFIED: trigger transition after first bounce
          if (currentObject.position.y <= -3 && velocity > 0) { // -3 is floor level
            bounceCount++;
            console.log(`Bounce #${bounceCount}`);
            
            // Ensure object doesn't go below floor
            currentObject.position.y = -3;
            
            // First bounce triggers transition instead of second bounce
            if (bounceCount === 1) {
              // Bounce back with reduced velocity for visual effect
              velocity = -velocity * 0.7; 
              
              // Add slight rotation on bounce
              const spinAxis = new THREE.Vector3(
                Math.random() - 0.5,
                0,
                Math.random() - 0.5
              ).normalize();
              
              currentObject.rotateOnAxis(spinAxis, Math.random() * 0.3);
              
              // Start transition after a short delay for better visual pacing
              setTimeout(() => {
                prepareNextObject();
              }, 300);
            }
          }
        }
      }
      
      // Always render on every frame
      renderer.render(scene, camera);
      
      // Request next frame
      frameId = window.requestAnimationFrame(animate);
    };
    
    // Object creation functions with enhanced visual details
    function createGlobe(color: number = 0x00c6ff): THREE.Group {
      const group = new THREE.Group();
      
      // Inner core glow - more intense
      const coreGeometry = new THREE.SphereGeometry(1.2, 32, 32);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x0a2a5a,
        transparent: true,
        opacity: 0.3
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      group.add(core);
      
      // Inner pulse sphere with controlled animation
      const pulseGeometry = new THREE.SphereGeometry(1.1, 24, 24);
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0x4f9fff,
        transparent: true,
        opacity: 0.1
      });
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
      group.add(pulse);
      
      // FIXED: Use the main animation loop instead of separate animation
      // This prevents duplicate objects from getting created
      
      // Sphere wireframe - brighter
      const sphereGeometry = new THREE.SphereGeometry(1.5, 24, 24);
      const sphereEdges = new THREE.EdgesGeometry(sphereGeometry);
      const sphereLines = new THREE.LineSegments(
        sphereEdges,
        new THREE.LineBasicMaterial({ 
          color: color, 
          transparent: true,
          opacity: 0.9
        })
      );
      group.add(sphereLines);
      
      // Add latitude lines
      const latitudeCount = 6;
      for (let i = 0; i < latitudeCount; i++) {
        if (i === 0 || i === latitudeCount-1) continue; // Skip poles
        
        const lat = Math.PI * (i / (latitudeCount - 1) - 0.5);
        const radius = 1.5 * Math.cos(lat);
        
        const points: THREE.Vector3[] = [];
        const segments = 48;
        
        for (let j = 0; j <= segments; j++) {
          const theta = (j / segments) * Math.PI * 2;
          points.push(new THREE.Vector3(
            radius * Math.cos(theta),
            0,
            radius * Math.sin(theta)
          ));
        }
        
        const circleGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const circle = new THREE.Line(
          circleGeometry,
          new THREE.LineBasicMaterial({ 
            color: color, 
            transparent: true, 
            opacity: 0.4 
          })
        );
        
        circle.position.y = 1.5 * Math.sin(lat);
        circle.rotation.x = Math.PI / 2;
        group.add(circle);
      }
      
      // Add meridian lines
      const meridianCount = 8;
      for (let i = 0; i < meridianCount; i++) {
        const phi = (i / meridianCount) * Math.PI;
        
        const points: THREE.Vector3[] = [];
        const segments = 32;
        
        for (let j = 0; j <= segments; j++) {
          const theta = (j / segments) * Math.PI * 2 - Math.PI / 2;
          points.push(new THREE.Vector3(
            1.5 * Math.cos(phi) * Math.cos(theta),
            1.5 * Math.sin(theta),
            1.5 * Math.sin(phi) * Math.cos(theta)
          ));
        }
        
        const meridianGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const meridian = new THREE.Line(
          meridianGeometry,
          new THREE.LineBasicMaterial({ 
            color: color, 
            transparent: true, 
            opacity: 0.4 
          })
        );
        
        group.add(meridian);
      }
      
      // Add glowing location markers
      for (let i = 0; i < 5; i++) {
        // Random spherical coordinates for pins
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI - Math.PI/2;
        const radius = 1.5;
        
        const x = radius * Math.cos(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi);
        const z = radius * Math.cos(phi) * Math.sin(theta);
        
        const pinMaterial = new THREE.MeshBasicMaterial({ 
          color: i === 0 ? 0xff3366 : 0xffffff,
          transparent: true,
          opacity: 0.9
        });
        
        const pinHead = new THREE.Mesh(
          new THREE.SphereGeometry(0.05 + (i === 0 ? 0.03 : 0), 8, 8),
          pinMaterial
        );
        
        pinHead.position.set(x, y, z);
        group.add(pinHead);
      }
      
      return group;
    }
    
    function createCamera(color: number = 0xff3366): THREE.Group {
      const group = new THREE.Group();
      
      // Inner glow - more dramatic
      const bodyInnerGeometry = new THREE.BoxGeometry(1.9, 1.3, 0.9);
      const bodyInnerMaterial = new THREE.MeshBasicMaterial({
        color: 0x19233d,
        transparent: true,
        opacity: 0.35
      });
      const bodyInner = new THREE.Mesh(bodyInnerGeometry, bodyInnerMaterial);
      group.add(bodyInner);
      
      // Camera body wireframe
      const bodyGeometry = new THREE.BoxGeometry(2, 1.4, 1);
      const bodyEdges = new THREE.EdgesGeometry(bodyGeometry);
      const bodyLines = new THREE.LineSegments(
        bodyEdges,
        new THREE.LineBasicMaterial({ 
          color: color, 
          transparent: true,
          opacity: 0.9,
          linewidth: 2
        })
      );
      group.add(bodyLines);
      
      // Lens inner glow - pulsing
      const lensInnerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.9, 16);
      const lensInnerMaterial = new THREE.MeshBasicMaterial({
        color: 0x19233d,
        transparent: true,
        opacity: 0.35
      });
      const lensInner = new THREE.Mesh(lensInnerGeometry, lensInnerMaterial);
      lensInner.rotation.x = Math.PI / 2;
      lensInner.position.z = 1;
      group.add(lensInner);
      
      // Lens wireframe
      const lensGeometry = new THREE.CylinderGeometry(0.55, 0.5, 1, 16);
      const lensEdges = new THREE.EdgesGeometry(lensGeometry);
      const lensLines = new THREE.LineSegments(
        lensEdges,
        new THREE.LineBasicMaterial({ 
          color: color, 
          transparent: true,
          opacity: 0.9
        })
      );
      lensLines.rotation.x = Math.PI / 2;
      lensLines.position.z = 1;
      group.add(lensLines);
      
      // Lens glass effect
      const lensGlassGeometry = new THREE.CircleGeometry(0.45, 16);
      const lensGlassMaterial = new THREE.MeshBasicMaterial({
        color: 0x99ccff,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      const lensGlass = new THREE.Mesh(lensGlassGeometry, lensGlassMaterial);
      lensGlass.position.z = 1.5;
      group.add(lensGlass);
      
      // Viewfinder with glow
      const viewfinderGeometry = new THREE.BoxGeometry(0.7, 0.5, 0.5);
      const viewfinderEdges = new THREE.EdgesGeometry(viewfinderGeometry);
      const viewfinderLines = new THREE.LineSegments(
        viewfinderEdges,
        new THREE.LineBasicMaterial({ 
          color: color, 
          transparent: true,
          opacity: 0.9
        })
      );
      viewfinderLines.position.y = 1;
      group.add(viewfinderLines);
      
      // Viewfinder eye piece glow
      const eyepieceGeometry = new THREE.CircleGeometry(0.2, 12);
      const eyepieceMaterial = new THREE.MeshBasicMaterial({
        color: 0x333355,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const eyepiece = new THREE.Mesh(eyepieceGeometry, eyepieceMaterial);
      eyepiece.position.set(0, 1, 0.25);
      group.add(eyepiece);
      
      // Lens detail rings
      for (let i = 1; i <= 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(0.4 + i * 0.04, 0.02, 16, 32);
        const ring = new THREE.Mesh(
          ringGeometry,
          new THREE.MeshBasicMaterial({ 
            color: color, 
            transparent: true,
            opacity: 0.7
          })
        );
        ring.rotation.y = Math.PI / 2;
        ring.position.z = 0.9 + i * 0.08;
        group.add(ring);
      }
      
      // Camera strap attachments
      const leftStrapPoint = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        new THREE.MeshBasicMaterial({ color: color })
      );
      leftStrapPoint.position.set(-1.1, 0, 0);
      group.add(leftStrapPoint);
      
      const rightStrapPoint = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        new THREE.MeshBasicMaterial({ color: color })
      );
      rightStrapPoint.position.set(1.1, 0, 0);
      group.add(rightStrapPoint);
      
      // Add camera strap hints
      const leftStrapGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1.1, 0, 0),
        new THREE.Vector3(-1.5, -0.8, 0.4)
      ]);
      
      const leftStrap = new THREE.Line(
        leftStrapGeometry,
        new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.6 })
      );
      group.add(leftStrap);
      
      const rightStrapGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(1.1, 0, 0),
        new THREE.Vector3(1.5, -0.8, 0.4)
      ]);
      
      const rightStrap = new THREE.Line(
        rightStrapGeometry,
        new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.6 })
      );
      group.add(rightStrap);
      
      // Flash unit
      const flashGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.3);
      const flashEdges = new THREE.EdgesGeometry(flashGeometry);
      const flashLines = new THREE.LineSegments(
        flashEdges,
        new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.8 })
      );
      flashLines.position.set(0.6, 0.8, 0);
      group.add(flashLines);
      
      return group;
    }
    
    function createBackpack(color: number = 0xb967ff): THREE.Group {
      const group = new THREE.Group();
      
      // Inner glow
      const bodyInnerGeometry = new THREE.BoxGeometry(2.1, 2.5, 1.1);
      const bodyInnerMaterial = new THREE.MeshBasicMaterial({
        color: 0x1a2333,
        transparent: true,
        opacity: 0.35
      });
      const bodyInner = new THREE.Mesh(bodyInnerGeometry, bodyInnerMaterial);
      group.add(bodyInner);
      
      // Main backpack body wireframe
      const bodyGeometry = new THREE.BoxGeometry(2.2, 2.6, 1.2);
      const bodyEdges = new THREE.EdgesGeometry(bodyGeometry);
      const bodyLines = new THREE.LineSegments(
        bodyEdges,
        new THREE.LineBasicMaterial({ 
          color: color, 
          transparent: true,
          opacity: 0.9
        })
      );
      group.add(bodyLines);
      
      // Front pocket inner glow
      const pocketInnerGeometry = new THREE.BoxGeometry(1.7, 1.1, 0.3);
      const pocketInnerMaterial = new THREE.MeshBasicMaterial({
        color: 0x1a2333,
        transparent: true,
        opacity: 0.35
      });
      const pocketInner = new THREE.Mesh(pocketInnerGeometry, pocketInnerMaterial);
      pocketInner.position.z = 0.8;
      pocketInner.position.y = -0.5;
      group.add(pocketInner);
      
      // Front pocket wireframe
      const pocketGeometry = new THREE.BoxGeometry(1.8, 1.2, 0.4);
      const pocketEdges = new THREE.EdgesGeometry(pocketGeometry);
      const pocketLines = new THREE.LineSegments(
        pocketEdges,
        new THREE.LineBasicMaterial({ 
          color: color, 
          transparent: true,
          opacity: 0.9
        })
      );
      pocketLines.position.z = 0.8;
      pocketLines.position.y = -0.5;
      group.add(pocketLines);
      
      // Left strap
      const leftStrapGeometry = new THREE.BoxGeometry(0.4, 2.2, 0.3);
      const leftStrapEdges = new THREE.EdgesGeometry(leftStrapGeometry);
      const leftStrapLines = new THREE.LineSegments(
        leftStrapEdges,
        new THREE.LineBasicMaterial({ 
          color: color, 
          transparent: true,
          opacity: 0.9
        })
      );
      leftStrapLines.position.x = -0.7;
      leftStrapLines.position.y = -0.3;
      leftStrapLines.position.z = 0.6;
      leftStrapLines.rotation.x = 0.2;
      group.add(leftStrapLines);
      
      // Right strap
      const rightStrapGeometry = new THREE.BoxGeometry(0.4, 2.2, 0.3);
      const rightStrapEdges = new THREE.EdgesGeometry(rightStrapGeometry);
      const rightStrapLines = new THREE.LineSegments(
        rightStrapEdges,
        new THREE.LineBasicMaterial({ 
          color: color, 
          transparent: true,
          opacity: 0.9
        })
      );
      rightStrapLines.position.x = 0.7;
      rightStrapLines.position.y = -0.3;
      rightStrapLines.position.z = 0.6;
      rightStrapLines.rotation.x = 0.2;
      group.add(rightStrapLines);
      
      // Buckle details
      const createBuckle = (x: number, y: number) => {
        const buckle = new THREE.Mesh(
          new THREE.CircleGeometry(0.1, 8),
          new THREE.MeshBasicMaterial({ 
            color: color, 
            transparent: true,
            opacity: 0.9 
          })
        );
        buckle.position.set(x, y, 0.81);
        buckle.rotation.y = Math.PI;
        group.add(buckle);
        
        // Add glint highlight to buckle
        const glint = new THREE.Mesh(
          new THREE.CircleGeometry(0.03, 6),
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
          })
        );
        glint.position.set(x - 0.03, y + 0.03, 0.82);
        glint.rotation.y = Math.PI;
        group.add(glint);
      };
      
      createBuckle(0, 0);
      createBuckle(0, -0.8);
      
      // Add a water bottle in side pocket
      const bottleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 12);
      const bottleEdges = new THREE.EdgesGeometry(bottleGeometry);
      const bottleLines = new THREE.LineSegments(
        bottleEdges,
        new THREE.LineBasicMaterial({
          color: 0x50e3c2,
          transparent: true,
          opacity: 0.8
        })
      );
      bottleLines.position.set(1.2, -0.5, 0);
      bottleLines.rotation.x = Math.PI/2;
      bottleLines.rotation.z = Math.PI/2;
      group.add(bottleLines);
      
      // Add map/document poking out the top
      const mapGeometry = new THREE.BoxGeometry(1.4, 0.05, 0.7);
      const mapEdges = new THREE.EdgesGeometry(mapGeometry);
      const mapLines = new THREE.LineSegments(
        mapEdges,
        new THREE.LineBasicMaterial({
          color: 0xf8f8f8,
          transparent: true,
          opacity: 0.7
        })
      );
      mapLines.position.set(0, 1.4, 0.2);
      mapLines.rotation.x = -0.2;
      group.add(mapLines);
      
      return group;
    }

    // Animate pulse for all objects in main animation loop
    const animatePulses = (time: number) => {
      scene.traverse((child) => {
        if (child.name === "pulse") {
          const scale = 1 + Math.sin(time * 2) * 0.1;
          child.scale.set(scale, scale, scale);
        }
      });
    };
    
    // Start the scene with a small delay to ensure DOM is ready
    setTimeout(() => {
      init();
    }, 100);
    
    // Cleanup function - properly dispose of all resources
    return () => {
      console.log('Cleaning up Three.js resources');
      window.removeEventListener('resize', onWindowResize);
      
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      
      // Properly dispose of all geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      
      // Clean up scene
      scene.clear();
      
      // Remove renderer
      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
      
      // Run any additional cleanup functions
      cleanupFunctions.forEach(fn => fn());
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#000015' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
      
      <div 
        ref={loadingTextRef} 
        style={{
          position: 'absolute',
          bottom: '36px',
          left: 0,
          width: '100%',
          textAlign: 'center',
          color: 'white',
          fontSize: '20px',
          letterSpacing: '4px',
          fontFamily: 'sans-serif',
          fontWeight: '300',
          opacity: 0.85
        }}
      >
        LOADING • 0%
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '80px',
        background: 'linear-gradient(to top, #000015, transparent)',
        pointerEvents: 'none'
      }}></div>
    </div>
  );
};

export default TravelLoader;