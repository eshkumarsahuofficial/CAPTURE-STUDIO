import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Camera, Aperture, Eye, Sparkles, Layers, Sliders } from 'lucide-react';

interface ThreeCameraHeroProps {
  onBookClick?: () => void;
  onExplorePortfolio?: () => void;
}

export const ThreeCameraHero: React.FC<ThreeCameraHeroProps> = ({
  onBookClick,
  onExplorePortfolio,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [apertureValue, setApertureValue] = useState<number>(1.8);
  const [explodedView, setExplodedView] = useState<number>(0);
  const [activeFinish, setActiveFinish] = useState<'obsidian' | 'champagne' | 'silver'>('obsidian');
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);

  // References to keep animation loop clean with zero GC allocations
  const stateRef = useRef({
    aperture: 1.8,
    exploded: 0,
    finish: 'obsidian' as 'obsidian' | 'champagne' | 'silver',
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
  });

  // Sync state to ref
  useEffect(() => {
    stateRef.current.aperture = apertureValue;
    stateRef.current.exploded = explodedView;
    stateRef.current.finish = activeFinish;
  }, [apertureValue, explodedView, activeFinish]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL safely
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Setup Scene, Camera, Renderer
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090C, 0.04);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Studio Room Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfffaed, 3.2);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.8);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x08090c, 1.2);
    scene.add(fillLight);

    // 5. Build Procedural Multi-Part 3D Camera Lens Assembly (Group)
    const lensAssembly = new THREE.Group();
    scene.add(lensAssembly);

    // Base materials
    const barrelMaterial = new THREE.MeshStandardMaterial({
      color: 0x111318,
      metalness: 0.85,
      roughness: 0.22,
    });

    const goldAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.14,
    });

    const knurledGripMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1d24,
      metalness: 0.7,
      roughness: 0.45,
    });

    const apertureBladeMaterial = new THREE.MeshStandardMaterial({
      color: 0x22252a,
      metalness: 0.6,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });

    const opticalGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: isSoftwareGl ? 0 : 0.92,
      opacity: isSoftwareGl ? 0.45 : 1,
      transparent: true,
      roughness: 0.04,
      ior: 1.55,
      thickness: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color(0x38bdf8),
      attenuationDistance: 0.8,
    });

    // Part 1: Outer Main Barrel
    const barrelGeom = new THREE.CylinderGeometry(1.4, 1.45, 1.8, 48, 1, true);
    const mainBarrel = new THREE.Mesh(barrelGeom, barrelMaterial);
    mainBarrel.rotation.x = Math.PI / 2;
    lensAssembly.add(mainBarrel);

    // Part 2: Gold Accent Trim Ring
    const goldRingGeom = new THREE.TorusGeometry(1.42, 0.035, 16, 64);
    const goldRing = new THREE.Mesh(goldRingGeom, goldAccentMaterial);
    goldRing.position.z = 0.5;
    lensAssembly.add(goldRing);

    // Part 3: Front Filter Thread & Red Ring
    const frontRimGeom = new THREE.CylinderGeometry(1.48, 1.45, 0.3, 48);
    const frontRim = new THREE.Mesh(frontRimGeom, barrelMaterial);
    frontRim.rotation.x = Math.PI / 2;
    frontRim.position.z = 0.95;
    lensAssembly.add(frontRim);

    // Red luxury cinema badge ring
    const cinemaRingGeom = new THREE.TorusGeometry(1.47, 0.02, 16, 64);
    const redRingMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      metalness: 0.5,
      roughness: 0.2,
    });
    const cinemaRing = new THREE.Mesh(cinemaRingGeom, redRingMat);
    cinemaRing.position.z = 0.98;
    lensAssembly.add(cinemaRing);

    // Part 4: Knurled Focus Grip Ring
    const knurledGeom = new THREE.CylinderGeometry(1.43, 1.43, 0.7, 48);
    const knurledRing = new THREE.Mesh(knurledGeom, knurledGripMaterial);
    knurledRing.rotation.x = Math.PI / 2;
    knurledRing.position.z = -0.15;
    lensAssembly.add(knurledRing);

    // Part 5: Optical Front Curved Glass Element
    const frontGlassGeom = new THREE.SphereGeometry(1.35, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.28);
    const frontGlass = new THREE.Mesh(frontGlassGeom, opticalGlassMaterial);
    frontGlass.rotation.x = -Math.PI / 2;
    frontGlass.position.z = 0.85;
    lensAssembly.add(frontGlass);

    // Part 6: Internal Lens Elements (Explodable)
    const innerGlassGeom = new THREE.SphereGeometry(1.0, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.24);
    const innerGlass = new THREE.Mesh(innerGlassGeom, opticalGlassMaterial);
    innerGlass.rotation.x = Math.PI / 2;
    innerGlass.position.z = 0.2;
    lensAssembly.add(innerGlass);

    // Rear glass element
    const rearGlassGeom = new THREE.SphereGeometry(0.85, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.22);
    const rearGlass = new THREE.Mesh(rearGlassGeom, opticalGlassMaterial);
    rearGlass.rotation.x = -Math.PI / 2;
    rearGlass.position.z = -0.85;
    lensAssembly.add(rearGlass);

    // Part 7: Mechanical Aperture Iris Assembly (8 Blades)
    const irisGroup = new THREE.Group();
    irisGroup.position.z = 0.1;
    lensAssembly.add(irisGroup);

    const bladeCount = 8;
    const blades: THREE.Mesh[] = [];

    // Create aperture blade shape
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.quadraticCurveTo(0.6, 0.35, 0.95, 0.1);
    bladeShape.lineTo(0.7, -0.4);
    bladeShape.quadraticCurveTo(0.3, -0.1, 0, 0);

    const bladeGeom = new THREE.ShapeGeometry(bladeShape);

    for (let i = 0; i < bladeCount; i++) {
      const angle = (i / bladeCount) * Math.PI * 2;
      const blade = new THREE.Mesh(bladeGeom, apertureBladeMaterial);
      blade.position.set(Math.cos(angle) * 0.45, Math.sin(angle) * 0.45, (i * 0.003));
      blade.rotation.z = angle + 0.3;
      blade.scale.set(0.9, 0.9, 0.9);
      blades.push(blade);
      irisGroup.add(blade);
    }

    // Part 8: Ground Contact Shadow Disk
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 5, 64, 64, 60);
      grad.addColorStop(0, 'rgba(0,0,0,0.8)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.5, 4.5),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.65, depthWrite: false })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.6;
    scene.add(shadowPlane);

    // Initial slight angle
    lensAssembly.rotation.x = 0.22;
    lensAssembly.rotation.y = -0.35;

    // Mouse parallax tracking
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.mouse.targetX = x * 0.45;
      stateRef.current.mouse.targetY = y * 0.35;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // 6. Smooth Animation Loop with Zero GC Allocation
    let frameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.05);

      // Interpolate mouse parallax
      stateRef.current.mouse.x = THREE.MathUtils.damp(
        stateRef.current.mouse.x,
        stateRef.current.mouse.targetX,
        4,
        delta
      );
      stateRef.current.mouse.y = THREE.MathUtils.damp(
        stateRef.current.mouse.y,
        stateRef.current.mouse.targetY,
        4,
        delta
      );

      // Base gentle idle oscillation + mouse parallax
      const time = clock.getElapsedTime();
      const targetRotX = 0.15 + stateRef.current.mouse.y * 0.5 + Math.sin(time * 0.5) * 0.05;
      const targetRotY = -0.3 + stateRef.current.mouse.x * 0.7 + Math.cos(time * 0.4) * 0.08;

      lensAssembly.rotation.x = THREE.MathUtils.damp(lensAssembly.rotation.x, targetRotX, 3.5, delta);
      lensAssembly.rotation.y = THREE.MathUtils.damp(lensAssembly.rotation.y, targetRotY, 3.5, delta);

      // Exploded View kinematics
      const exp = stateRef.current.exploded;
      frontRim.position.z = THREE.MathUtils.damp(frontRim.position.z, 0.95 + exp * 1.2, 5, delta);
      frontGlass.position.z = THREE.MathUtils.damp(frontGlass.position.z, 0.85 + exp * 1.1, 5, delta);
      goldRing.position.z = THREE.MathUtils.damp(goldRing.position.z, 0.5 + exp * 0.5, 5, delta);
      innerGlass.position.z = THREE.MathUtils.damp(innerGlass.position.z, 0.2 + exp * 0.3, 5, delta);
      knurledRing.position.z = THREE.MathUtils.damp(knurledRing.position.z, -0.15 - exp * 0.4, 5, delta);
      rearGlass.position.z = THREE.MathUtils.damp(rearGlass.position.z, -0.85 - exp * 1.0, 5, delta);

      // Aperture blade iris rotation based on f-stop
      // Lower f-number = wide open (f/1.2), higher f-number = closed aperture (f/16)
      const apertureNormalized = (stateRef.current.aperture - 1.2) / (16 - 1.2);
      const bladeRotationTarget = 0.25 + apertureNormalized * 0.85;
      const bladeScaleTarget = 0.9 + apertureNormalized * 0.35;

      for (let i = 0; i < blades.length; i++) {
        const baseAngle = (i / bladeCount) * Math.PI * 2;
        blades[i].rotation.z = THREE.MathUtils.damp(
          blades[i].rotation.z,
          baseAngle + bladeRotationTarget,
          6,
          delta
        );
        blades[i].scale.setScalar(
          THREE.MathUtils.damp(blades[i].scale.x, bladeScaleTarget, 6, delta)
        );
      }

      // Finish material updates
      if (stateRef.current.finish === 'champagne') {
        barrelMaterial.color.setHex(0x1e1b14);
        goldAccentMaterial.color.setHex(0xe5c05b);
      } else if (stateRef.current.finish === 'silver') {
        barrelMaterial.color.setHex(0x1e2229);
        goldAccentMaterial.color.setHex(0xd1d5db);
      } else {
        barrelMaterial.color.setHex(0x111318);
        goldAccentMaterial.color.setHex(0xd4af37);
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[620px] lg:h-[720px] flex items-center justify-center overflow-hidden">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing pointer-events-auto"
        aria-label="Interactive 3D Camera Lens Viewport"
      />

      {/* Atmospheric Cinematic Lighting Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Foreground Hero Typography Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col justify-between h-full py-12 pointer-events-none">
        {/* Top Left Spec Badge */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="px-3 py-1 bg-black/60 border border-[#D4AF37]/30 rounded-md backdrop-blur-md text-[11px] font-mono tracking-wider text-[#E5C05B] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>CAPTURE OPTICS 50mm F1.2 CINEMA</span>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
            GAIN-DATOLA STUDIO EDITION
          </span>
        </div>

        {/* Center-Left Hero Pitch */}
        <div className="max-w-xl pointer-events-auto space-y-5 my-auto">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
            <span>Precision Cinema</span>
            <span>·</span>
            <span>Authentic Emotion</span>
            <span>·</span>
            <span>Timeless Memories</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-[1.08] text-balance">
            CAPTURE YOUR MOMENTS. <br />
            <span className="text-gold-gradient">CREATE YOUR LEGACY.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-body leading-relaxed max-w-lg">
            Professional photography, royal wedding cinematography, and creative printing services crafted in Gaindatola with international visual standards.
          </p>

          {/* Action CTAs adhering to Top Bar Contract & Anti-Slop */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onBookClick}
              className="px-6 py-3 bg-[#D4AF37] text-slate-950 font-semibold text-sm rounded-lg hover:bg-[#E5C05B] transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Book Your Shoot</span>
            </button>

            <button
              onClick={onExplorePortfolio}
              className="px-6 py-3 bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 text-slate-200 hover:text-white font-medium text-sm rounded-lg backdrop-blur-sm transition-all"
            >
              Explore Portfolio
            </button>
          </div>
        </div>

        {/* Collapsible 3D Interactive HUD Dock (Bottom Center - Zero Viewport Occlusion) */}
        <div className="pointer-events-auto self-center w-full max-w-2xl">
          <div className="flex flex-col items-center">
            {/* Toggle HUD Button */}
            <button
              onClick={() => setIsHudCollapsed(!isHudCollapsed)}
              className="px-3 py-1 bg-black/80 border-t border-x border-white/10 rounded-t-lg text-[11px] font-mono text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Sliders className="w-3 h-3 text-[#D4AF37]" />
              <span>{isHudCollapsed ? '▴ Show 3D Lens Controls' : '▾ Hide 3D Controls'}</span>
            </button>

            {/* Dock Body */}
            {!isHudCollapsed && (
              <div className="w-full bg-[#0E1016]/90 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xl shadow-2xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Aperture Slider Control */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-slate-300 font-mono text-[11px]">
                      <span className="flex items-center gap-1 text-[#D4AF37]">
                        <Aperture className="w-3 h-3" /> Iris Aperture:
                      </span>
                      <span className="font-bold text-white">f/{apertureValue}</span>
                    </div>
                    <input
                      type="range"
                      min={1.2}
                      max={16}
                      step={0.1}
                      value={apertureValue}
                      onChange={(e) => setApertureValue(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>f/1.2 (Bokeh)</span>
                      <span>f/8</span>
                      <span>f/16 (Sharp)</span>
                    </div>
                  </div>

                  {/* Exploded View Separation Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-slate-300 font-mono text-[11px]">
                      <span className="flex items-center gap-1 text-[#D4AF37]">
                        <Layers className="w-3 h-3" /> Exploded View:
                      </span>
                      <span className="font-bold text-white">{Math.round(explodedView * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={explodedView}
                      onChange={(e) => setExplodedView(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>Assembled</span>
                      <span>Exploded Optic</span>
                    </div>
                  </div>

                  {/* Material Finish Swatches */}
                  <div className="space-y-1.5">
                    <div className="text-slate-300 font-mono text-[11px]">
                      <span>Barrel Finish:</span>
                    </div>
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        onClick={() => setActiveFinish('obsidian')}
                        className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
                          activeFinish === 'obsidian'
                            ? 'bg-black text-[#D4AF37] border border-[#D4AF37]'
                            : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                        }`}
                      >
                        Obsidian Matte
                      </button>
                      <button
                        onClick={() => setActiveFinish('champagne')}
                        className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
                          activeFinish === 'champagne'
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]'
                            : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                        }`}
                      >
                        Champagne
                      </button>
                      <button
                        onClick={() => setActiveFinish('silver')}
                        className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
                          activeFinish === 'silver'
                            ? 'bg-slate-700 text-white border border-slate-400'
                            : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                        }`}
                      >
                        Titanium
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
