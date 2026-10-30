import * as THREE from 'three';
import { ExtinguisherType } from '../types';

export interface ComponentMetadata {
  id: string;
  name: string;
  malayName: string;
  category: 'badan' | 'injap' | 'picu' | 'pin' | 'tolok' | 'hos' | 'corong' | 'asas';
  description: string;
}

// Procedural Canvas Label Generation (Zero external assets)
export function createExtinguisherTexture(type: ExtinguisherType, maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Cylinder deep fire red body
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle metallic powder-coat horizontal sheen
  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0, 'rgba(255,255,255,0.08)');
  grad.addColorStop(0.3, 'rgba(255,255,255,0.22)');
  grad.addColorStop(0.6, 'rgba(0,0,0,0.15)');
  grad.addColorStop(1, 'rgba(255,255,255,0.08)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Configuration per type
  let bandColor = '#dc2626';
  let title = 'AIR / WATER';
  let subtitle = 'KELAS A - BAHAN PEPEJAL';
  let classes = ['A'];
  let specText = 'ISIAN: 9.0 LITER AIR BERSIH • TEKANAN: 13.5 BAR';

  if (type === 'foam') {
    bandColor = '#e2c582'; // Cream
    title = 'BUIH / FOAM';
    subtitle = 'KELAS A & B (AFFF 6%)';
    classes = ['A', 'B'];
    specText = 'ISIAN: 9.0 LITER BUIH AFFF • MEMBENDUNG WAP MINYAK';
  } else if (type === 'drypowder') {
    bandColor = '#0284c7'; // Blue
    title = 'DEBU KERING / POWDER';
    subtitle = 'KELAS A, B, C (SERBA GUNA)';
    classes = ['A', 'B', 'C'];
    specText = 'ISIAN: 9.0 KG MONOAMONIUS FOSFAT (MAP 40)';
  } else if (type === 'co2') {
    bandColor = '#18181b'; // Black
    title = 'KARBON DIOKSIDA / CO₂';
    subtitle = 'KELAS B & ELEKTRIK (BERSIH)';
    classes = ['B', 'E'];
    specText = 'ISIAN: 5.0 KG CO₂ CECAIR • TEKANAN KERJA: 55 BAR';
  }

  // Header band (Color Identifier Band)
  ctx.fillStyle = bandColor;
  ctx.fillRect(30, 200, 964, 250);

  // Border strip
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 210, 944, 230);

  // Title text
  ctx.fillStyle = type === 'foam' ? '#09090b' : '#ffffff';
  ctx.font = 'bold 68px "Orbitron", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 512, 330);

  ctx.font = 'bold 36px "Rajdhani", sans-serif';
  ctx.fillText(subtitle, 512, 395);

  // Instruction White Card Section
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(50, 480, 924, 480);
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 4;
  ctx.strokeRect(50, 480, 924, 480);

  // PASS Header
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(60, 490, 904, 75);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Orbitron", sans-serif';
  ctx.fillText('TATACARA PENGGUNAAN P.A.S.S', 512, 545);

  // 4 Steps
  ctx.textAlign = 'left';
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 30px "Rajdhani", sans-serif';
  ctx.fillText('1. P - PULL: Tarik pin keselamatan keluar', 90, 615);
  ctx.fillText('2. A - AIM: Halakan muncung ke pangkal api', 90, 670);
  ctx.fillText('3. S - SQUEEZE: Tekan tuil picu pelepasan', 90, 725);
  ctx.fillText('4. S - SWEEP: Layangkan ke kiri dan kanan', 90, 780);

  // Class Badges
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 24px "Rajdhani", sans-serif';
  ctx.fillText('KLASIFIKASI KEBAKARAN DILULUSKAN:', 90, 835);

  classes.forEach((c, i) => {
    const x = 90 + i * 90;
    const y = 855;
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(x, y, 75, 45, 8);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(c, x + 37, y + 33);
  });

  // Spec footer text
  ctx.textAlign = 'left';
  ctx.fillStyle = '#475569';
  ctx.font = '500 22px "Rajdhani", sans-serif';
  ctx.fillText(specText, 90, 935);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// Procedural Pressure Gauge Dial Texture
export function createGaugeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dial face
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Red low pressure zone
  ctx.beginPath();
  ctx.arc(128, 128, 100, Math.PI * 0.8, Math.PI * 1.15);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 14;
  ctx.stroke();

  // Green operational zone (12-14 bar)
  ctx.beginPath();
  ctx.arc(128, 128, 100, Math.PI * 1.15, Math.PI * 1.65);
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 16;
  ctx.stroke();

  // Red overpressure zone
  ctx.beginPath();
  ctx.arc(128, 128, 100, Math.PI * 1.65, Math.PI * 2.05);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 14;
  ctx.stroke();

  // Text
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px "Orbitron", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BAR', 128, 180);
  ctx.font = 'bold 16px "Rajdhani", sans-serif';
  ctx.fillText('14', 128, 80);

  // Needle (pointing to green zone center)
  ctx.save();
  ctx.translate(128, 128);
  ctx.rotate(Math.PI * 1.4);
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.lineTo(-4, 0);
  ctx.lineTo(0, -90);
  ctx.lineTo(4, 0);
  ctx.closePath();
  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.restore();

  // Center pin
  ctx.beginPath();
  ctx.arc(128, 128, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// Procedural Contact Shadow Disc Texture
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
  gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Build Composite Extinguisher Model (3-12 parts)
export function buildExtinguisherGroup(
  type: ExtinguisherType,
  maxAnisotropy: number
): {
  group: THREE.Group;
  headGroup: THREE.Group;
  hoseGroup: THREE.Group;
  pinMesh: THREE.Mesh;
  nozzleAnchor: THREE.Object3D;
  interactiveParts: THREE.Object3D[];
} {
  const group = new THREE.Group();
  group.name = `extinguisher_${type}`;

  const interactiveParts: THREE.Object3D[] = [];

  // PBR Shared Materials
  const bodyTexture = createExtinguisherTexture(type, maxAnisotropy);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: bodyTexture,
    roughness: 0.28,
    metalness: 0.55
  });

  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.85,
    metalness: 0.1
  });

  const brassMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.85
  });

  const blackMetalMaterial = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.35,
    metalness: 0.8
  });

  const goldPinMaterial = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.2,
    metalness: 0.95
  });

  const hoseRubberMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.8,
    metalness: 0.15
  });

  // 1. Silinder Utama (Main Cylinder Body)
  // Height: 1.05m, Radius: 0.23m
  const cylinderHeight = 1.05;
  const cylinderRadius = 0.23;

  const cylinderGeo = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 36);
  const cylinderMesh = new THREE.Mesh(cylinderGeo, bodyMaterial);
  cylinderMesh.position.y = cylinderHeight / 2 + 0.12; // lifted above ground base
  cylinderMesh.rotation.y = Math.PI * 0.32; // center front label directly towards camera
  cylinderMesh.castShadow = true;
  cylinderMesh.receiveShadow = true;
  cylinderMesh.userData = {
    metadata: {
      id: 'body',
      name: 'Badan Silinder Keluli',
      malayName: 'Silinder Bertekanan',
      category: 'badan',
      description:
        'Silinder keluli tahan karat berkilat merah direka khas untuk menahan tekanan kerja cecair dan gas penolak nitrogen secara selamat.'
    } as ComponentMetadata
  };
  group.add(cylinderMesh);
  interactiveParts.push(cylinderMesh);

  // Top Dome & Neck Ring
  const domeGeo = new THREE.SphereGeometry(cylinderRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMat = new THREE.MeshStandardMaterial({
    color: 0xb91c1c,
    roughness: 0.25,
    metalness: 0.6
  });
  const topDome = new THREE.Mesh(domeGeo, domeMat);
  topDome.position.y = cylinderHeight + 0.12;
  topDome.castShadow = true;
  group.add(topDome);

  const neckCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.08, 24), brassMaterial);
  neckCollar.position.y = cylinderHeight + 0.12 + 0.21;
  neckCollar.castShadow = true;
  group.add(neckCollar);

  // 2. Base Ring (Tapak Kaki Getah / Pelindung)
  const baseRingGeo = new THREE.CylinderGeometry(cylinderRadius + 0.015, cylinderRadius + 0.02, 0.12, 32);
  const baseRing = new THREE.Mesh(baseRingGeo, baseMaterial);
  baseRing.position.y = 0.06;
  baseRing.castShadow = true;
  baseRing.receiveShadow = true;
  baseRing.userData = {
    metadata: {
      id: 'base',
      name: 'Tapak Pelindung Getah',
      malayName: 'Alas Tapak Silinder',
      category: 'asas',
      description: 'Melindungi dasar silinder daripada kakisan lantai, kelembapan, dan hentakan mekanikal semasa diletakkan.'
    } as ComponentMetadata
  };
  group.add(baseRing);
  interactiveParts.push(baseRing);

  // 3. Head & Valve Assembly Group (Moves up during Exploded View)
  const headGroup = new THREE.Group();
  headGroup.name = 'headGroup';
  headGroup.position.set(0, cylinderHeight + 0.12 + 0.24, 0);

  // Valve Body (Forged Brass Block)
  const valveBlockGeo = new THREE.BoxGeometry(0.1, 0.12, 0.14);
  const valveBlock = new THREE.Mesh(valveBlockGeo, brassMaterial);
  valveBlock.position.set(0, 0.06, 0);
  valveBlock.castShadow = true;
  valveBlock.userData = {
    metadata: {
      id: 'valve',
      name: 'Perhimpunan Injap Loyang (Valve Assembly)',
      malayName: 'Injap Pelepasan Tembaga',
      category: 'injap',
      description:
        'Injap utama bertindak membuka saliran tiub celup dalaman untuk membebaskan agen pemadam bertekanan tinggi apabila tuil picu ditekan.'
    } as ComponentMetadata
  };
  headGroup.add(valveBlock);
  interactiveParts.push(valveBlock);

  // Lower Fixed Carrying Handle
  const handleLowerGeo = new THREE.BoxGeometry(0.038, 0.022, 0.32);
  const handleLower = new THREE.Mesh(handleLowerGeo, blackMetalMaterial);
  handleLower.position.set(0, 0.11, 0.11);
  handleLower.rotation.x = 0.28;
  handleLower.castShadow = true;
  handleLower.userData = {
    metadata: {
      id: 'handle',
      name: 'Pemegang Pengangkat (Carry Handle)',
      malayName: 'Pemegang Bawah',
      category: 'picu',
      description:
        'Pemegang tetap keluli di bahagian bawah yang digunakan untuk mengangkat dan membawa alat pemadam api ke lokasi kebakaran dengan selamat.'
    } as ComponentMetadata
  };
  headGroup.add(handleLower);
  interactiveParts.push(handleLower);

  // Upper Operating Lever (Squeeze Trigger)
  const handleUpperGeo = new THREE.BoxGeometry(0.036, 0.02, 0.29);
  const handleUpper = new THREE.Mesh(handleUpperGeo, blackMetalMaterial);
  handleUpper.position.set(0, 0.17, 0.09);
  handleUpper.rotation.x = -0.16;
  handleUpper.castShadow = true;
  handleUpper.userData = {
    metadata: {
      id: 'trigger',
      name: 'Picu Pelepasan (Operating Lever)',
      malayName: 'Tuil Picu Atas',
      category: 'picu',
      description:
        'Tuil bergerak di atas yang ditekan (Squeeze) oleh jari pengguna untuk menolak rod injap pelepasan bagi memulakan semburan.'
    } as ComponentMetadata
  };
  headGroup.add(handleUpper);
  interactiveParts.push(handleUpper);

  // Safety Pull Pin & Ring (Pulls out horizontally in Exploded View)
  const pinGroup = new THREE.Group();
  pinGroup.name = 'pinGroup';
  pinGroup.position.set(0.065, 0.13, 0.05);

  const pinShaftGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.12, 12);
  const pinShaft = new THREE.Mesh(pinShaftGeo, goldPinMaterial);
  pinShaft.rotation.z = Math.PI / 2;
  pinShaft.castShadow = true;
  pinGroup.add(pinShaft);

  const pinRingGeo = new THREE.TorusGeometry(0.032, 0.006, 12, 24);
  const pinRing = new THREE.Mesh(pinRingGeo, goldPinMaterial);
  pinRing.position.set(0.06, 0, 0);
  pinRing.rotation.y = Math.PI / 2;
  pinRing.castShadow = true;
  pinGroup.add(pinRing);

  // Tamper seal tag
  const sealTagGeo = new THREE.BoxGeometry(0.015, 0.035, 0.02);
  const sealTagMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
  const sealTag = new THREE.Mesh(sealTagGeo, sealTagMat);
  sealTag.position.set(0.02, -0.025, 0);
  pinGroup.add(sealTag);

  pinGroup.userData = {
    metadata: {
      id: 'pin',
      name: 'Pin Keselamatan & Gelang Penarik (Safety Pin)',
      malayName: 'Pin Keselamatan & Meterai',
      category: 'pin',
      description:
        'Langkah pertama (P - Pull): Menghalang picu ditekan secara tidak sengaja. Pin mesti ditarik keluar dengan memutuskan dawai/meterai keselamatan sebelum boleh digunakan.'
    } as ComponentMetadata
  };
  headGroup.add(pinGroup);
  interactiveParts.push(pinGroup);

  // Pressure Gauge (Only on Water, Foam, and Dry Powder; CO2 uses high-pressure vessel without normal dial)
  if (type !== 'co2') {
    const gaugeGroup = new THREE.Group();
    gaugeGroup.position.set(-0.08, 0.08, 0);
    gaugeGroup.rotation.z = Math.PI / 2;

    const gaugeStemGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.04, 16);
    const gaugeStem = new THREE.Mesh(gaugeStemGeo, brassMaterial);
    gaugeGroup.add(gaugeStem);

    const gaugeCaseGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.032, 24);
    const gaugeCase = new THREE.Mesh(gaugeCaseGeo, brassMaterial);
    gaugeCase.position.y = 0.03;
    gaugeCase.castShadow = true;
    gaugeGroup.add(gaugeCase);

    // Gauge Dial Face
    const gaugeTexture = createGaugeTexture();
    const dialMat = new THREE.MeshBasicMaterial({ map: gaugeTexture });
    const dialMesh = new THREE.Mesh(new THREE.CircleGeometry(0.04, 24), dialMat);
    dialMesh.position.y = 0.047;
    dialMesh.rotation.x = -Math.PI / 2;
    gaugeGroup.add(dialMesh);

    gaugeGroup.userData = {
      metadata: {
        id: 'gauge',
        name: 'Tolok Tekanan (Pressure Gauge)',
        malayName: 'Tolok Penunjuk Tekanan',
        category: 'tolok',
        description:
          'Menunjukkan status gas penolak nitrogen. Jarum MESTI berada di zon HIJAU (12-14 bar). Zon merah kiri menandakan kurang tekanan, manakala zon merah kanan menandakan tekanan lampau.'
      } as ComponentMetadata
    };
    headGroup.add(gaugeGroup);
    interactiveParts.push(gaugeGroup);
  }

  group.add(headGroup);

  // 4. Hose & Discharge Assembly Group
  const hoseGroup = new THREE.Group();
  hoseGroup.name = 'hoseGroup';

  const nozzleAnchor = new THREE.Object3D();

  if (type === 'co2') {
    // CO2 Discharge Horn (Corong Pelepasan Hitam Kon Besar)
    const hornGroup = new THREE.Group();
    hornGroup.position.set(0.26, 0.96, 0.22);
    hornGroup.rotation.x = 1.05;
    hornGroup.rotation.z = -0.65;

    // Conical flared horn
    const hornGeo = new THREE.ConeGeometry(0.145, 0.48, 28, 1, true);
    const hornMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.92,
      metalness: 0.05
    });
    const hornMesh = new THREE.Mesh(hornGeo, hornMat);
    hornMesh.position.y = 0.12;
    hornMesh.castShadow = true;
    hornGroup.add(hornMesh);

    // Insulated handle ring (Frostbite protection grip)
    const gripGeo = new THREE.CylinderGeometry(0.055, 0.065, 0.18, 20);
    const gripMat = new THREE.MeshStandardMaterial({
      color: 0x374151,
      roughness: 0.95,
      metalness: 0.05
    });
    const gripMesh = new THREE.Mesh(gripGeo, gripMat);
    gripMesh.position.y = -0.15;
    hornGroup.add(gripMesh);

    hornGroup.userData = {
      metadata: {
        id: 'horn',
        name: 'Corong Pelepasan CO₂ (Discharge Horn)',
        malayName: 'Corong Tanduk Hitam Berpenebat',
        category: 'corong',
        description:
          'Corong kon hitam khas untuk mengembang dan mengarahkan gas CO₂ sejuk beku (-78.5°C). AMARAN: Pegang HANYA pada pemegang bertebat untuk mengelakkan radang dingin (frostbite)!'
      } as ComponentMetadata
    };
    hoseGroup.add(hornGroup);
    interactiveParts.push(hornGroup);

    // High Pressure Connecting Tube
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, cylinderHeight + 0.12 + 0.26, 0),
      new THREE.Vector3(0.14, cylinderHeight + 0.12 + 0.2, 0.08),
      new THREE.Vector3(0.22, 1.05, 0.18)
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.024, 12, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, hoseRubberMaterial);
    tubeMesh.castShadow = true;
    hoseGroup.add(tubeMesh);

    // Tip of horn is the spray origin
    nozzleAnchor.position.set(0.38, 0.72, 0.38);
    nozzleAnchor.rotation.set(0.6, 0.6, 0);
    hoseGroup.add(nozzleAnchor);
  } else {
    // Standard Flexible Hose & Jet/Aeration Nozzle
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.04, cylinderHeight + 0.12 + 0.24, 0),
      new THREE.Vector3(0.28, cylinderHeight + 0.1, 0.06),
      new THREE.Vector3(0.29, 0.62, 0.12),
      new THREE.Vector3(0.23, 0.32, 0.08)
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.019, 12, false);
    const hoseMesh = new THREE.Mesh(tubeGeo, hoseRubberMaterial);
    hoseMesh.castShadow = true;
    hoseMesh.userData = {
      metadata: {
        id: 'hose',
        name: 'Hos Pelepasan Fleksibel (Discharge Hose)',
        malayName: 'Hos Getah Bertebat Hitam',
        category: 'hos',
        description:
          'Hos getah sintetik bertetulang wayar tahan lelasan yang membolehkan pengguna mengarahkan semburan dengan bebas ke pangkal api.'
      } as ComponentMetadata
    };
    hoseGroup.add(hoseMesh);
    interactiveParts.push(hoseMesh);

    // Nozzle
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.set(0.23, 0.32, 0.08);

    const nozzleGeo =
      type === 'foam'
        ? new THREE.CylinderGeometry(0.028, 0.02, 0.14, 16) // Aeration nozzle
        : new THREE.CylinderGeometry(0.018, 0.025, 0.12, 16); // Jet nozzle

    const nozzleMesh = new THREE.Mesh(nozzleGeo, brassMaterial);
    nozzleGroup.add(nozzleMesh);

    nozzleGroup.userData = {
      metadata: {
        id: 'nozzle',
        name: type === 'foam' ? 'Muncung Pengudaraan Buih' : 'Muncung Jet Pelepasan',
        malayName: 'Muncung Hos (Nozzle)',
        category: 'hos',
        description:
          type === 'foam'
            ? 'Muncung khas berliang untuk menyerap udara dan mengembangkan larutan buih AFFF sebelum keluar.'
            : 'Muncung tirus untuk memfokuskan aliran agen pemadam kebakaran terus ke dasar bahan terbakar.'
      } as ComponentMetadata
    };
    hoseGroup.add(nozzleGroup);
    interactiveParts.push(nozzleGroup);

    // Nozzle tip spray anchor
    nozzleAnchor.position.set(0.23, 0.25, 0.08);
    nozzleAnchor.rotation.set(1.4, 0, 0); // pointing forward/down
    hoseGroup.add(nozzleAnchor);
  }

  group.add(hoseGroup);

  // Soft Radial Contact Shadow Grounding Disc
  const shadowGeo = new THREE.PlaneGeometry(0.9, 0.9);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: createContactShadowTexture(),
    transparent: true,
    opacity: 0.65,
    depthWrite: false
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.015;
  group.add(contactShadow);

  return {
    group,
    headGroup,
    hoseGroup,
    pinMesh: pinGroup as unknown as THREE.Mesh,
    nozzleAnchor,
    interactiveParts
  };
}

// Particle System for Realistic Spray Simulation
export function createSprayParticleSystem(type: ExtinguisherType): {
  points: THREE.Points;
  update: (delta: number) => void;
  dispose: () => void;
} {
  const particleCount = type === 'co2' ? 600 : type === 'drypowder' ? 500 : 350;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const lifetimes = new Float32Array(particleCount);
  const maxLifetimes = new Float32Array(particleCount);

  // Particle color based on type
  let pColor = 0x38bdf8; // water cyan
  let particleSize = 0.04;

  if (type === 'foam') {
    pColor = 0xfef08a; // frothy pale yellow / white
    particleSize = 0.065;
  } else if (type === 'drypowder') {
    pColor = 0xf8fafc; // chalky white cloud
    particleSize = 0.055;
  } else if (type === 'co2') {
    pColor = 0xe0f2fe; // freezing vapor mist
    particleSize = 0.08;
  }

  const pMaterial = new THREE.PointsMaterial({
    color: pColor,
    size: particleSize,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  // Initialize particles at rest
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = 0;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;

    velocities[i * 3] = 0;
    velocities[i * 3 + 1] = 0;
    velocities[i * 3 + 2] = 0;

    lifetimes[i] = Math.random() * 0.8;
    maxLifetimes[i] = 0.6 + Math.random() * 0.4;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(geometry, pMaterial);

  function resetParticle(i: number) {
    positions[i * 3] = 0;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;

    // Cone spray pattern along Z forward
    const speed = type === 'co2' ? 4.5 + Math.random() * 2 : 3.2 + Math.random() * 1.5;
    const spread = type === 'drypowder' ? 0.35 : type === 'co2' ? 0.28 : 0.18;

    velocities[i * 3] = (Math.random() - 0.5) * spread * speed;
    velocities[i * 3 + 1] = (Math.random() - 0.4) * spread * speed;
    velocities[i * 3 + 2] = speed * (0.85 + Math.random() * 0.3);

    lifetimes[i] = 0;
    maxLifetimes[i] = 0.5 + Math.random() * 0.4;
  }

  function update(delta: number) {
    const pos = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      lifetimes[i] += delta;
      if (lifetimes[i] >= maxLifetimes[i]) {
        resetParticle(i);
      }

      pos[i * 3] += velocities[i * 3] * delta;
      pos[i * 3 + 1] += velocities[i * 3 + 1] * delta - 1.2 * delta; // slight gravity
      pos[i * 3 + 2] += velocities[i * 3 + 2] * delta;
    }
    geometry.attributes.position.needsUpdate = true;
  }

  function dispose() {
    geometry.dispose();
    pMaterial.dispose();
  }

  return { points, update, dispose };
}
