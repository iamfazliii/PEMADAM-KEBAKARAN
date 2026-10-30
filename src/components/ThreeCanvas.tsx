import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ExtinguisherType } from '../types';
import { buildExtinguisherGroup, ComponentMetadata, createSprayParticleSystem } from '../utils/extinguisher3D';

interface ThreeCanvasProps {
  activeType: ExtinguisherType;
  isExploded: boolean;
  explodedAmount: number; // 0 to 1
  isComparison: boolean;
  isAutoRotate: boolean;
  isSpraying: boolean;
  onSelectComponent: (meta: ComponentMetadata | null) => void;
  onSprayingFinished: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  activeType,
  isExploded,
  explodedAmount,
  isComparison,
  isAutoRotate,
  isSpraying,
  onSelectComponent,
  onSprayingFinished
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // References to keep state in sync with animation loop without re-instantiating scene
  const stateRef = useRef({
    activeType,
    isExploded,
    explodedAmount,
    isComparison,
    isAutoRotate,
    isSpraying,
    currentExplodedProgress: 0,
    sprayTimer: 0
  });

  // Keep stateRef updated
  useEffect(() => {
    stateRef.current.activeType = activeType;
    stateRef.current.isExploded = isExploded;
    stateRef.current.explodedAmount = explodedAmount;
    stateRef.current.isComparison = isComparison;
    stateRef.current.isAutoRotate = isAutoRotate;
    stateRef.current.isSpraying = isSpraying;
  }, [activeType, isExploded, explodedAmount, isComparison, isAutoRotate, isSpraying]);

  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL (SwiftShader / headless Chromium)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030813);
    scene.fog = new THREE.FogExp2(0x030813, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 1.35, 3.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Studio Reflections (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.75, 0);
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Do not go beneath floor
    controls.minDistance = 1.1;
    controls.maxDistance = 8.5;
    controlsRef.current = controls;

    // 5. Studio Lighting Rig
    const warmKeyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    warmKeyLight.position.set(3, 5, 3);
    warmKeyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      warmKeyLight.shadow.mapSize.width = 1024;
      warmKeyLight.shadow.mapSize.height = 1024;
      warmKeyLight.shadow.bias = -0.0005;
      warmKeyLight.shadow.normalBias = 0.02;
    }
    scene.add(warmKeyLight);

    const coolHemiFill = new THREE.HemisphereLight(0x00e5ff, 0x051b33, 0.9);
    coolHemiFill.position.set(0, 10, 0);
    scene.add(coolHemiFill);

    const sciFiRimLight = new THREE.DirectionalLight(0x0077ff, 1.4);
    sciFiRimLight.position.set(-3, 2, -2.5);
    scene.add(sciFiRimLight);

    // 6. Futuristic Hologram Floor & Pedestal Grid
    const gridHelper = new THREE.GridHelper(16, 32, 0x00e5ff, 0x0a2540);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Main central glowing ring
    const ringGeo = new THREE.RingGeometry(0.78, 0.82, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide
    });
    const mainRing = new THREE.Mesh(ringGeo, ringMat);
    mainRing.rotation.x = Math.PI / 2;
    mainRing.position.y = 0.005;
    scene.add(mainRing);

    // Outer subtle ring
    const outerRing = new THREE.Mesh(
      new THREE.RingGeometry(1.2, 1.22, 64),
      new THREE.MeshBasicMaterial({ color: 0x0077ff, side: THREE.DoubleSide, opacity: 0.5, transparent: true })
    );
    outerRing.rotation.x = Math.PI / 2;
    outerRing.position.y = 0.004;
    scene.add(outerRing);

    // 7. Instantiate All 4 Procedural Models
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const models: Record<
      ExtinguisherType,
      ReturnType<typeof buildExtinguisherGroup>
    > = {
      water: buildExtinguisherGroup('water', maxAnisotropy),
      foam: buildExtinguisherGroup('foam', maxAnisotropy),
      drypowder: buildExtinguisherGroup('drypowder', maxAnisotropy),
      co2: buildExtinguisherGroup('co2', maxAnisotropy)
    };

    Object.values(models).forEach((m) => {
      scene.add(m.group);
      m.group.visible = false;
    });

    // 8. Raycasting Setup for Component Hover/Click
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      // Collect interactable objects from active models
      const activeModels = stateRef.current.isComparison
        ? Object.values(models).map((m) => m.group)
        : [models[stateRef.current.activeType].group];

      const checkList: THREE.Object3D[] = [];
      activeModels.forEach((grp) => {
        grp.traverse((child) => {
          if (child.userData && child.userData.metadata) {
            checkList.push(child);
          }
        });
      });

      const intersects = raycaster.intersectObjects(checkList, true);
      if (intersects.length > 0) {
        let currentObj: THREE.Object3D | null = intersects[0].object;
        while (currentObj && (!currentObj.userData || !currentObj.userData.metadata) && currentObj.parent) {
          currentObj = currentObj.parent;
        }
        if (currentObj && currentObj.userData && currentObj.userData.metadata) {
          onSelectComponent(currentObj.userData.metadata as ComponentMetadata);
          return;
        }
      }
      onSelectComponent(null);
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 10. Particle Spray Simulation State
    let activeSpraySystem: ReturnType<typeof createSprayParticleSystem> | null = null;
    let isCurrentlySpraying = false;

    // 11. Animation Loop with Software-GL Pacing
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          animationFrameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          animationFrameId = window.setTimeout(cb, 80);
        }
      };
      animationFrameId = window.setTimeout(poll, 5);
    }

    const comparisonOffsets: Record<ExtinguisherType, number> = {
      water: -1.8,
      foam: -0.6,
      drypowder: 0.6,
      co2: 1.8
    };

    const targetCameraPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();

    function animate() {
      const delta = Math.min(clock.getDelta(), 0.05);

      const { activeType, isExploded, explodedAmount, isComparison, isAutoRotate, isSpraying } = stateRef.current;

      // Handle Exploded View Exponential Damping Interpolation
      const targetExplode = isExploded ? Math.max(explodedAmount, 0.8) : 0;
      stateRef.current.currentExplodedProgress = THREE.MathUtils.damp(
        stateRef.current.currentExplodedProgress,
        targetExplode,
        8,
        delta
      );

      const explodeP = stateRef.current.currentExplodedProgress;

      // Update Models Visibility and Positioning
      if (isComparison) {
        // Arrange side-by-side
        (Object.keys(models) as ExtinguisherType[]).forEach((type) => {
          const m = models[type];
          m.group.visible = true;
          const targetX = comparisonOffsets[type];
          m.group.position.x = THREE.MathUtils.damp(m.group.position.x, targetX, 7, delta);
          m.group.position.z = THREE.MathUtils.damp(m.group.position.z, 0, 7, delta);

          // Reset exploded offsets during comparison
          m.headGroup.position.y = 1.05 + 0.12 + 0.24;
          m.hoseGroup.position.x = 0;
          m.pinMesh.position.x = 0.065;
        });

        // Set camera target wide
        targetCameraPos.set(0, 1.4, 4.6);
        targetLookAt.set(0, 0.7, 0);
      } else {
        // Single Active Model Centered
        (Object.keys(models) as ExtinguisherType[]).forEach((type) => {
          const m = models[type];
          if (type === activeType) {
            m.group.visible = true;
            m.group.position.x = THREE.MathUtils.damp(m.group.position.x, 0, 8, delta);
            m.group.position.z = THREE.MathUtils.damp(m.group.position.z, 0, 8, delta);

            // Apply Exploded View Offsets
            // Head lifts up to +0.38m
            m.headGroup.position.y = 1.05 + 0.12 + 0.24 + explodeP * 0.38;
            // Hose / Horn spreads outward +0.28m
            m.hoseGroup.position.x = explodeP * 0.28;
            // Pin pulls out to the side +0.15m
            m.pinMesh.position.x = 0.065 + explodeP * 0.15;
          } else {
            m.group.visible = false;
          }
        });

        targetCameraPos.set(0, 1.35, 3.8);
        targetLookAt.set(0, 0.75, 0);
      }

      // Auto Rotate if toggled
      if (controls) {
        controls.autoRotate = isAutoRotate;
        controls.autoRotateSpeed = 2.0;
        controls.update();
      }

      // Handle Spray Simulation Lifecycle
      if (isSpraying && !isCurrentlySpraying) {
        // Start spray
        isCurrentlySpraying = true;
        stateRef.current.sprayTimer = 2.5; // 2.5 seconds spray

        const activeModel = models[activeType];
        activeSpraySystem = createSprayParticleSystem(activeType);
        activeModel.nozzleAnchor.add(activeSpraySystem.points);
      } else if (!isSpraying && isCurrentlySpraying) {
        // Clean up spray
        if (activeSpraySystem) {
          const activeModel = models[activeType];
          activeModel.nozzleAnchor.remove(activeSpraySystem.points);
          activeSpraySystem.dispose();
          activeSpraySystem = null;
        }
        isCurrentlySpraying = false;
      }

      if (isCurrentlySpraying && activeSpraySystem) {
        activeSpraySystem.update(delta);
        stateRef.current.sprayTimer -= delta;
        if (stateRef.current.sprayTimer <= 0) {
          onSprayingFinished();
        }
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    animate();

    return () => {
      if (isSoftwareGl) {
        clearTimeout(animationFrameId);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      if (activeSpraySystem) {
        activeSpraySystem.dispose();
      }
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectComponent, onSprayingFinished]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing outline-none"
      data-testid="three-canvas-container"
    />
  );
};
