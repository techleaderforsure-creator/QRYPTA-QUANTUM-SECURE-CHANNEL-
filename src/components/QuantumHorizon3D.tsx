import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface QuantumHorizon3DProps {
  className?: string;
}

export const QuantumHorizon3D: React.FC<QuantumHorizon3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090A0C, 0.04);

    // Camera
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);
    camera.lookAt(0, 0, 0);

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x090A0C, 0);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (e) {
      console.warn('WebGL not supported, graceful fallback will render', e);
      return;
    }

    // --- 1. Central Core Sphere ---
    const coreGeo = new THREE.SphereGeometry(0.72, 64, 64);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0E1015,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x2A1A10,
      emissiveIntensity: 0.4,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Inner glow shell
    const innerGlowGeo = new THREE.SphereGeometry(0.76, 32, 32);
    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: 0xC5A880,
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    });
    const innerGlowMesh = new THREE.Mesh(innerGlowGeo, innerGlowMat);
    scene.add(innerGlowMesh);

    // --- 2. Accretion Disk Particles ---
    const particleCount = 3000;
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    const radiusArray = new Float32Array(particleCount);
    const speedArray = new Float32Array(particleCount);
    const angleArray = new Float32Array(particleCount);

    const colorGold = new THREE.Color(0xC5A880);
    const colorCrimson = new THREE.Color(0x8D1428);
    const colorIvory = new THREE.Color(0xFAF6F0);
    const colorCharcoal = new THREE.Color(0x28201C);

    for (let i = 0; i < particleCount; i++) {
      const r = 1.05 + Math.pow(Math.random(), 1.6) * 1.5;
      const angle = Math.random() * Math.PI * 2;
      const verticalSpread = (Math.random() - 0.5) * 0.14 * (r / 2.2);

      posArray[i * 3] = Math.cos(angle) * r;
      posArray[i * 3 + 1] = verticalSpread;
      posArray[i * 3 + 2] = Math.sin(angle) * r;

      radiusArray[i] = r;
      angleArray[i] = angle;
      speedArray[i] = (0.45 / Math.sqrt(r)) * (0.8 + Math.random() * 0.4);

      // Color gradient transitioning through champagne-gold, deep crimson, and warm ivory
      const t = (r - 1.05) / 1.5;
      const pColor = t < 0.35 
        ? colorCrimson.clone().lerp(colorGold, t / 0.35)
        : colorGold.clone().lerp(colorIvory, (t - 0.35) / 0.65);

      colorArray[i * 3] = pColor.r;
      colorArray[i * 3 + 1] = pColor.g;
      colorArray[i * 3 + 2] = pColor.b;
    }

    const diskGeo = new THREE.BufferGeometry();
    diskGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    diskGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const diskMat = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const diskPoints = new THREE.Points(diskGeo, diskMat);
    diskPoints.rotation.x = THREE.MathUtils.degToRad(32);
    diskPoints.rotation.z = THREE.MathUtils.degToRad(-15);
    scene.add(diskPoints);

    // --- 3. Orbital Geodesic Rings ---
    const createRing = (radius: number, tiltX: number, tiltY: number, colorHex: number, opacity: number) => {
      const ringGeo = new THREE.BufferGeometry();
      const segments = 128;
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
      }
      ringGeo.setFromPoints(points);
      const ringMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity,
      });
      const ringLine = new THREE.Line(ringGeo, ringMat);
      ringLine.rotation.x = tiltX;
      ringLine.rotation.y = tiltY;
      return ringLine;
    };

    const ring1 = createRing(1.6, THREE.MathUtils.degToRad(25), THREE.MathUtils.degToRad(10), 0xC5A880, 0.5);
    const ring2 = createRing(2.1, THREE.MathUtils.degToRad(-35), THREE.MathUtils.degToRad(40), 0x8D1428, 0.4);
    const ring3 = createRing(2.6, THREE.MathUtils.degToRad(70), THREE.MathUtils.degToRad(-20), 0xC5A880, 0.25);
    scene.add(ring1);
    scene.add(ring2);
    scene.add(ring3);

    // --- 4. Lights ---
    const ambientLight = new THREE.AmbientLight(0xFAF6F0, 0.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xE5C79D, 1.4);
    dirLight1.position.set(4, 5, 3);
    scene.add(dirLight1);

    const pointLightGold = new THREE.PointLight(0xC5A880, 4.0, 9);
    pointLightGold.position.set(0, 0.2, 0);
    scene.add(pointLightGold);

    // Mouse parallax tracking
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.35;
      targetRotX = y * 0.2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!prefersReducedMotion) {
        // Orbit particles
        const posAttr = diskGeo.attributes.position as THREE.BufferAttribute;
        const pos = posAttr.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          angleArray[i] += speedArray[i] * delta * 0.8;
          const r = radiusArray[i];
          pos[i * 3] = Math.cos(angleArray[i]) * r;
          pos[i * 3 + 2] = Math.sin(angleArray[i]) * r;
        }
        posAttr.needsUpdate = true;

        // Rotate rings slowly
        ring1.rotation.z += 0.003;
        ring2.rotation.z -= 0.002;
        ring3.rotation.x += 0.001;
        coreMesh.rotation.y += 0.004;
        innerGlowMesh.rotation.y -= 0.006;
      }

      // Smooth camera parallax
      currentRotY += (targetRotY - currentRotY) * 0.05;
      currentRotX += (targetRotX - currentRotX) * 0.05;
      scene.rotation.y = currentRotY;
      scene.rotation.x = currentRotX;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      coreGeo.dispose();
      coreMat.dispose();
      innerGlowGeo.dispose();
      innerGlowMat.dispose();
      diskGeo.dispose();
      diskMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[460px] md:h-[520px] flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      {/* Decorative center subtle ring backdrop */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[320px] h-[320px] md:w-[420px] md:h-[420px] rounded-full border border-[#C5A880]/15 blur-[1px]" />
        <div className="w-[460px] h-[460px] md:w-[540px] md:h-[540px] rounded-full border border-[#C5A880]/10" />
      </div>
    </div>
  );
};
