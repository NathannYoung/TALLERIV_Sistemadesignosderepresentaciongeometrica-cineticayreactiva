// ============================================================
// NEON SYSTEM — WEB EDITION (p5.js)
// Port 1:1 idéntico al sistema Processing 4
// Mismas velocidades, tamaños, comportamientos e interacciones
// Optimizado para alta velocidad (60 FPS) y soporte táctil / gestual
// ============================================================

const MENU = 0;
let estado = MENU;
let estadoAnterior = MENU;

// Colores del sistema idénticos a Processing
let violeta;
let azul;
let verde;
let baseParticulasAzul;
let baseCentroAzul;
let destacadoAzul;
let verdeTriangulos;

// Colores de fondo para cada estado
let coloresEncendido = [];

// Dimensiones de celdas
let margen = 10;
let celdaW = 0;
let celdaH = 0;

// Sonido de selección
let sonidoEstado = null;

// Tutoriales de personajes por estado (1..9): capas 1 y 2 alternadas (3 ciclos en 2 segundos)
let capasEstado1 = new Array(10);
let capasEstado2 = new Array(10);
let mostrarGifEstado = false;
let tiempoInicioGif = 0;
const DURACION_GIF_ESTADO = 2000; // 2 segundos exactos
let estadoActualGif = -1;

// Imágenes del Tutorial (carpeta data/TUTORIAL/1.png a 12.png)
let imagenesTutorial = new Array(13);
let tutorialCargado = false;

// Control del Tutorial / Demostración en Menú
let tiempoInactividadMenu = 0;
let tutorialMostradoEnMenuActual = false;
let secuenciaSectoresMenuActiva = false;
let inicioSecuenciaSectores = 0;
let estadoActualDemoMenu = 1;
let progresoActualDemoMenu = 0;
const secuenciaCompletaDemo = [1, 2, 3, 6, 5, 4, 7, 8, 9];

// Control de selección por Mouse / Touch en Menú
let estadoSeleccionMouse = -1;
let inicioMouseSeleccion = 0;
const tiempoSeleccion = 2000; // 2 segundos

// Control de inactividad dentro de estados (retorno automático tras 10 segundos)
let ultimaActividadEstado = 0;
const TIEMPO_INACTIVIDAD_ESTADO = 10000;

// ============================================================
// VARIABLES DE PREVIEWS (IDÉNTICAS A PROCESSING)
// ============================================================

// Preview 2 (64 partículas en deriva radial)
const CANTIDAD_PARTICULAS_PREVIEW_E2 = 64;
let previewAngulo2 = new Float32Array(CANTIDAD_PARTICULAS_PREVIEW_E2);
let previewDistancia2 = new Float32Array(CANTIDAD_PARTICULAS_PREVIEW_E2);
let previewVelocidad2 = new Float32Array(CANTIDAD_PARTICULAS_PREVIEW_E2);
let previewFase2 = new Float32Array(CANTIDAD_PARTICULAS_PREVIEW_E2);
let previewTam2 = new Float32Array(CANTIDAD_PARTICULAS_PREVIEW_E2);
let previewEstado2Inicializado = false;

// Preview 3 (64 partículas rebotando)
const CANTIDAD_PARTICULAS_E3 = 64;
let previewX3 = new Float32Array(CANTIDAD_PARTICULAS_E3);
let previewY3 = new Float32Array(CANTIDAD_PARTICULAS_E3);
let previewVX3 = new Float32Array(CANTIDAD_PARTICULAS_E3);
let previewVY3 = new Float32Array(CANTIDAD_PARTICULAS_E3);
let previewFase3 = new Float32Array(CANTIDAD_PARTICULAS_E3);
let previewFrecuencia3 = new Float32Array(CANTIDAD_PARTICULAS_E3);
let previewTam3 = new Float32Array(CANTIDAD_PARTICULAS_E3);
let previewEstado3Inicializado = false;

// Preview 4 (64 cuadrados ortogonales)
const CANTIDAD_PREVIEW_E4 = 64;
let previewX4 = new Float32Array(CANTIDAD_PREVIEW_E4);
let previewY4 = new Float32Array(CANTIDAD_PREVIEW_E4);
let previewDir4 = new Int32Array(CANTIDAD_PREVIEW_E4);
let previewContador4 = new Int32Array(CANTIDAD_PREVIEW_E4);
let previewCambio4 = new Int32Array(CANTIDAD_PREVIEW_E4);
let previewTam4 = new Float32Array(CANTIDAD_PREVIEW_E4);
let previewEstado4Inicializado = false;

// Preview 5 (80 cuadrados orbitando)
const CANTIDAD_CUADRADOS5 = 80;
let previewAngulo5 = new Float32Array(CANTIDAD_CUADRADOS5);
let previewRadio5 = new Float32Array(CANTIDAD_CUADRADOS5);
let previewFase5 = new Float32Array(CANTIDAD_CUADRADOS5);
let previewTam5 = new Float32Array(CANTIDAD_CUADRADOS5);
let previewEstado5Inicializado = false;

// Preview 6 (64 cuadrados en oscilación cuadrada)
const CANTIDAD_CUADRADOS6 = 64;
let previewBaseX6 = new Float32Array(CANTIDAD_CUADRADOS6);
let previewBaseY6 = new Float32Array(CANTIDAD_CUADRADOS6);
let previewFase6 = new Float32Array(CANTIDAD_CUADRADOS6);
let previewTam6 = new Float32Array(CANTIDAD_CUADRADOS6);
let previewEstado6Inicializado = false;

// Preview 7 (64 triángulos orbitando y rotando)
const CANTIDAD_PARTICULAS_E7 = 64;
let previewBaseX7 = new Float32Array(CANTIDAD_PARTICULAS_E7);
let previewBaseY7 = new Float32Array(CANTIDAD_PARTICULAS_E7);
let previewTam7 = new Float32Array(CANTIDAD_PARTICULAS_E7);
let previewFase7 = new Float32Array(CANTIDAD_PARTICULAS_E7);
let previewRotacion7 = new Float32Array(CANTIDAD_PARTICULAS_E7);
let previewEstado7Inicializado = false;

// Preview 8 (84 triángulos en vaivén rápido)
const CANTIDAD_PARTICULAS_E8 = 84;
let previewBaseX8 = new Float32Array(CANTIDAD_PARTICULAS_E8);
let previewBaseY8 = new Float32Array(CANTIDAD_PARTICULAS_E8);
let previewFase8 = new Float32Array(CANTIDAD_PARTICULAS_E8);
let previewTam8 = new Float32Array(CANTIDAD_PARTICULAS_E8);
let previewRotacion8 = new Float32Array(CANTIDAD_PARTICULAS_E8);
let previewEstado8Inicializado = false;

// Preview 9 (100 triángulos en capas multicapa)
const CANTIDAD_PREVIEW_E9 = 100;
let previewBaseAngulo9 = new Float32Array(CANTIDAD_PREVIEW_E9);
let previewBaseRadio9 = new Float32Array(CANTIDAD_PREVIEW_E9);
let previewTamParticula9 = new Float32Array(CANTIDAD_PREVIEW_E9);
let previewRotacionPropia9 = new Float32Array(CANTIDAD_PREVIEW_E9);
let previewEstado9Inicializado = false;

// ============================================================
// PRELOAD
// ============================================================
function preload() {
  try {
    soundFormats('mp3', 'ogg');
    sonidoEstado = loadSound('data/elegir.mp3',
      () => console.log("[✓] Audio data/elegir.mp3 cargado"),
      (err) => console.warn("[!] Audio opcional:", err)
    );
  } catch (e) {
    console.warn("p5.sound no disponible o audio bloqueado:", e);
  }

  for (let i = 1; i <= 12; i++) {
    loadImage(`data/TUTORIAL/${i}.png`, 
      (img) => { imagenesTutorial[i] = img; tutorialCargado = true; },
      () => {}
    );
  }

  const rutasCapas = [
    null,
    { c1: "data/01/capa1.png", c2: "data/01/Capa2.png" },
    { c1: "data/02/capa1.png", c2: "data/02/capa2.png" },
    { c1: "data/03/capa1.png", c2: "data/03/Capa2.png" },
    { c1: "data/04/capa1.png", c2: "data/04/Capa2.png" },
    { c1: "data/05/Capa1.png", c2: "data/05/Capa2.png" },
    { c1: "data/06/Capa1.png", c2: "data/06/Capa2.png" },
    { c1: "data/07/Capa1.png", c2: "data/07/Capa2.png" },
    { c1: "data/08/Capa1.png", c2: "data/08/Capa2.png" },
    { c1: "data/09/Capa1.png", c2: "data/09/Capa2.png" }
  ];

  for (let i = 1; i <= 9; i++) {
    const numStr = i < 10 ? `0${i}` : `${i}`;
    const r = rutasCapas[i];

    loadImage(r.c1,
      (img) => { capasEstado1[i] = img; },
      () => {
        const alt1 = `data/${numStr}/${r.c1.includes('Capa1') ? 'capa1.png' : 'Capa1.png'}`;
        loadImage(alt1, (img) => { capasEstado1[i] = img; }, () => {});
      }
    );

    loadImage(r.c2,
      (img) => { capasEstado2[i] = img; },
      () => {
        const alt2 = `data/${numStr}/${r.c2.includes('Capa2') ? 'capa2.png' : 'Capa2.png'}`;
        loadImage(alt2, (img) => { capasEstado2[i] = img; }, () => {});
      }
    );
  }
}

// ============================================================
// SETUP
// ============================================================
function setup() {
  // CRÍTICO: pixelDensity(1) evita que pantallas Retina / 4K / móviles
  // multipliquen por 4x o 9x el costo de renderizado por cuadro
  pixelDensity(1);

  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  frameRate(60);
  rectMode(CORNER);
  imageMode(CENTER);

  // Colores exactos de Processing
  violeta = color(139, 99, 199);
  azul = color(74, 143, 217);
  verde = color(74, 174, 109);
  baseParticulasAzul = color(25, 64, 107);
  baseCentroAzul = color(74, 143, 217);
  destacadoAzul = color(155, 220, 255);
  verdeTriangulos = color(105, 235, 160);

  // Paleta de fondo de cada estado
  coloresEncendido[0] = color(0);
  coloresEncendido[1] = color(48, 25, 75);
  coloresEncendido[2] = color(70, 35, 85);
  coloresEncendido[3] = color(80, 55, 25);
  coloresEncendido[4] = color(20, 70, 50);
  coloresEncendido[5] = color(20, 55, 90);
  coloresEncendido[6] = color(25, 40, 90);
  coloresEncendido[7] = color(55, 25, 80);
  coloresEncendido[8] = color(80, 25, 60);
  coloresEncendido[9] = color(45, 45, 45);

  calcularDimensiones();
  tiempoInactividadMenu = millis();

  inicializarPreviews();
  inicializarEstadosActivos();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calcularDimensiones();
}

function calcularDimensiones() {
  celdaW = (width - margen * 4) / 3.0;
  celdaH = (height - margen * 4) / 3.0;
}

function inicializarPreviews() {
  // Preview 2
  for (let i = 0; i < CANTIDAD_PARTICULAS_PREVIEW_E2; i++) {
    previewAngulo2[i] = random(TWO_PI);
    previewDistancia2[i] = random(0, 650.0);
    previewVelocidad2[i] = 0.50 * random(0.85, 1.15);
    previewFase2[i] = random(TWO_PI);
    previewTam2[i] = random(20, 35);
  }
  previewEstado2Inicializado = true;

  // Preview 3
  for (let i = 0; i < CANTIDAD_PARTICULAS_E3; i++) {
    previewX3[i] = random(-600, 600);
    previewY3[i] = random(-350, 350);
    while (dist(previewX3[i], previewY3[i], 0, 0) < 130) {
      previewX3[i] = random(-600, 600);
      previewY3[i] = random(-350, 350);
    }
    let ang = random(TWO_PI);
    let vel = random(0.45, 0.55);
    previewVX3[i] = Math.cos(ang) * vel;
    previewVY3[i] = Math.sin(ang) * vel;
    previewFase3[i] = random(TWO_PI);
    previewFrecuencia3[i] = random(0.008, 0.020);
    previewTam3[i] = random(20, 35);
  }
  previewEstado3Inicializado = true;

  // Preview 4
  for (let i = 0; i < CANTIDAD_PREVIEW_E4; i++) {
    previewX4[i] = random(-600, 600);
    previewY4[i] = random(-350, 350);
    while (dist(previewX4[i], previewY4[i], 0, 0) < 130) {
      previewX4[i] = random(-600, 600);
      previewY4[i] = random(-350, 350);
    }
    previewDir4[i] = Math.floor(random(4));
    previewContador4[i] = 0;
    previewCambio4[i] = Math.floor(random(40, 150));
    previewTam4[i] = random(20, 32);
  }
  previewEstado4Inicializado = true;

  // Preview 5
  for (let i = 0; i < CANTIDAD_CUADRADOS5; i++) {
    previewAngulo5[i] = i * (TWO_PI / CANTIDAD_CUADRADOS5);
    previewRadio5[i] = random(120, 935);
    previewFase5[i] = random(TWO_PI);
    previewTam5[i] = random(20, 35);
  }
  previewEstado5Inicializado = true;

  // Preview 6
  for (let i = 0; i < CANTIDAD_CUADRADOS6; i++) {
    previewBaseX6[i] = random(-650, 650);
    previewBaseY6[i] = random(-400, 400);
    previewFase6[i] = random(TWO_PI);
    previewTam6[i] = random(20, 35);
  }
  previewEstado6Inicializado = true;

  // Preview 7
  for (let i = 0; i < CANTIDAD_PARTICULAS_E7; i++) {
    previewBaseX7[i] = random(-650, 650);
    previewBaseY7[i] = random(-400, 400);
    while (dist(previewBaseX7[i], previewBaseY7[i], 0, 0) < 130) {
      previewBaseX7[i] = random(-650, 650);
      previewBaseY7[i] = random(-400, 400);
    }
    previewFase7[i] = random(TWO_PI);
    previewTam7[i] = random(20, 30);
    previewRotacion7[i] = random(TWO_PI);
  }
  previewEstado7Inicializado = true;

  // Preview 8
  for (let i = 0; i < CANTIDAD_PARTICULAS_E8; i++) {
    previewBaseX8[i] = random(-650, 650);
    previewBaseY8[i] = random(-400, 400);
    while (dist(previewBaseX8[i], previewBaseY8[i], 0, 0) < 130) {
      previewBaseX8[i] = random(-650, 650);
      previewBaseY8[i] = random(-400, 400);
    }
    previewFase8[i] = random(TWO_PI);
    previewTam8[i] = random(20, 30);
    previewRotacion8[i] = random(TWO_PI);
  }
  previewEstado8Inicializado = true;

  // Preview 9
  for (let i = 0; i < CANTIDAD_PREVIEW_E9; i++) {
    let anguloSector = TWO_PI * i / CANTIDAD_PREVIEW_E9;
    previewBaseAngulo9[i] = (anguloSector + random(-0.25, 0.25) + TWO_PI) % TWO_PI;
    previewBaseRadio9[i] = random(115, 920);
    previewTamParticula9[i] = random(20, 30);
    previewRotacionPropia9[i] = random(TWO_PI);
  }
  previewEstado9Inicializado = true;
}

// ============================================================
// BUCLE PRINCIPAL (DRAW)
// ============================================================
function draw() {
  background(0);

  if (estado === MENU) {
    actualizarDemoSectoresMenu();

    if (!secuenciaSectoresMenuActiva) {
      actualizarSeleccionMouse();
    }

    dibujarMenu();

  } else {
    // Control de inactividad idéntico a Processing:
    // Mientras el GIF se reproduce, no se cuenta inactividad
    if (mostrarGifEstado) {
      ultimaActividadEstado = millis();
    } else if (interaccionValidaEstado()) {
      ultimaActividadEstado = millis();
    } else if (millis() - ultimaActividadEstado >= TIEMPO_INACTIVIDAD_ESTADO) {
      volverAlMenu();
      return;
    }

    // Fondo negro idéntico a Processing
    background(0);

    // Dibujar el estado interactivo centrado con escala responsiva para celulares/tablets
    push();
    translate(width / 2, height / 2);
    let escalaEstado = obtenerEscalaEstado();
    scale(escalaEstado);
    dibujarEstado(estado);
    pop();

    // Dibujar GIF animado del personaje con transparencia (SCREEN)
    dibujarGifEstado();
  }
}

// Escala adaptativa para pantallas móviles y tablets (evita figuras gigantes en celulares)
function obtenerEscalaEstado() {
  let menorDim = Math.min(width, height);
  if (menorDim < 850) {
    return Math.max(0.42, menorDim / 850.0);
  }
  return 1.0;
}

// ============================================================
// CONTROL DE NAVEGACIÓN Y SELECCIÓN
// ============================================================

function entrarEstado(n) {
  if (n < 1 || n > 9) return;
  estado = n;
  ultimaActividadEstado = millis();

  if (sonidoEstado && sonidoEstado.isLoaded()) {
    try { sonidoEstado.play(); } catch (e) {}
  }

  iniciarGifEstado(n);
  reiniciarEstado(n);
  if (n === 2) {
    transferirPreviewAEstado2();
  }
}

function volverAlMenu() {
  estado = MENU;
  mostrarGifEstado = false;
  estadoActualGif = -1;
  secuenciaSectoresMenuActiva = false;
  tutorialMostradoEnMenuActual = false;
  tiempoInactividadMenu = millis();
  estadoSeleccionMouse = -1;
  inicioMouseSeleccion = 0;
  reiniciarEstado1();
  reiniciarEstado2();
  reiniciarEstado3();
  reiniciarEstado4();
  reiniciarEstado5();
  reiniciarEstado6();
  reiniciarEstado7();
  reiniciarEstado8();
  reiniciarEstado9();
}

function iniciarGifEstado(n) {
  let folderIndex = n;
  if (n === 5) folderIndex = 6;
  else if (n === 6) folderIndex = 5;
  estadoActualGif = folderIndex;
  mostrarGifEstado = true;
  tiempoInicioGif = millis();
}

// Render del tutorial del estado alternando 2 imágenes (capa1 y capa2) 3 veces cada una durante 2 segundos
function dibujarGifEstado() {
  if (!mostrarGifEstado || estadoActualGif < 1 || estadoActualGif > 9) return;

  // Mientras se muestra el tutorial de 2s, se mantiene activa la sesión
  ultimaActividadEstado = millis();

  const transcurrido = millis() - tiempoInicioGif;
  if (transcurrido >= DURACION_GIF_ESTADO) {
    mostrarGifEstado = false;
    ultimaActividadEstado = millis(); // Inicia el conteo de inactividad de 10s al terminar el tutorial
    return;
  }

  // Pantalla negra de fondo al 25% de opacidad (idéntico a Processing)
  push();
  resetMatrix();
  noStroke();
  rectMode(CORNER);
  fill(0, 255 * 0.25); // 25% de opacidad (alpha = 63.75)
  rect(0, 0, width, height);
  pop();

  // Exactamente 3 ciclos de cada una de las 2 imágenes durante los 2 segundos:
  // 6 pasos en total de ~333.33 ms cada uno (Paso 0: Capa1, Paso 1: Capa2, Paso 2: Capa1, ...)
  let paso = Math.floor((transcurrido / DURACION_GIF_ESTADO) * 6);
  if (paso < 0) paso = 0;
  if (paso > 5) paso = 5;

  let img = (paso % 2 === 0) ? capasEstado1[estadoActualGif] : capasEstado2[estadoActualGif];
  if (!img) img = capasEstado1[estadoActualGif] || capasEstado2[estadoActualGif];

  if (img && img.width > 0) {
    push();
    resetMatrix();

    let maxW = width * 0.95;
    let maxH = height * 0.88;
    let w = img.width * 2.0;
    let h = img.height * 2.0;

    if (w > maxW || h > maxH) {
      let factor = min(maxW / w, maxH / h);
      w *= factor;
      h *= factor;
    }

    let yBase = height;
    translate(width / 2.0, yBase - h / 2.0);
    scale(-1.0, 1.0); // Modo espejo horizontal idéntico a Processing

    // Clave para eliminar fondo negro: SCREEN hace transparentes los píxeles negros
    blendMode(SCREEN);
    imageMode(CENTER);
    image(img, 0, 0, w, h);
    blendMode(BLEND);

    pop();
  }
}

// ============================================================
// TUTORIAL Y DEMOSTRACIÓN DE SECTORES EN EL MENÚ
// ============================================================

function actualizarDemoSectoresMenu() {
  if (estado !== MENU) {
    secuenciaSectoresMenuActiva = false;
    return;
  }

  let hayInteraccion = mouseIsPressed || HandTracker.activo;
  if (hayInteraccion) {
    tiempoInactividadMenu = millis();
    if (secuenciaSectoresMenuActiva) {
      secuenciaSectoresMenuActiva = false;
    }
    return;
  }

  // 1. Al iniciar o regresar: espera 10 segundos de inactividad
  if (!secuenciaSectoresMenuActiva) {
    if (!tutorialMostradoEnMenuActual) {
      if (millis() - tiempoInactividadMenu >= 10000) {
        secuenciaSectoresMenuActiva = true;
        inicioSecuenciaSectores = millis();
        estadoActualDemoMenu = 1;
        tutorialMostradoEnMenuActual = true;
      }
      return;
    }

    // 2. Repite cada 45 segundos de inactividad continua
    if (millis() - tiempoInactividadMenu >= 45000) {
      secuenciaSectoresMenuActiva = true;
      inicioSecuenciaSectores = millis();
      estadoActualDemoMenu = 1;
    }
  } else {
    let transcurrido = millis() - inicioSecuenciaSectores;
    let duracionTotal = 12000.0;
    let duracionPaso = duracionTotal / secuenciaCompletaDemo.length;
    let paso = Math.floor(transcurrido / duracionPaso);

    if (paso >= secuenciaCompletaDemo.length) {
      secuenciaSectoresMenuActiva = false;
      tiempoInactividadMenu = millis();
    } else {
      estadoActualDemoMenu = secuenciaCompletaDemo[paso];
      let tiempoPaso = transcurrido - paso * duracionPaso;
      progresoActualDemoMenu = constrain(tiempoPaso / duracionPaso, 0.0, 1.0);
    }
  }
}

function dibujarMarcoSectorMenu(estadoNum, progreso) {
  if (estadoNum < 1 || estadoNum > 9) return;

  push();
  rectMode(CORNER);
  noStroke();
  fill(0, 128);
  rect(0, 0, width, height);
  pop();

  let idx = estadoNum - 1;
  let fila = Math.floor(idx / 3);
  let col = idx % 3;

  let x = margen + col * (celdaW + margen);
  let y = margen + fila * (celdaH + margen);

  let baseImg = 1;
  if (estadoNum >= 1 && estadoNum <= 3) baseImg = 1;
  else if (estadoNum >= 4 && estadoNum <= 6) baseImg = 5;
  else if (estadoNum >= 7 && estadoNum <= 9) baseImg = 9;

  let subFrame = 0;
  if (progreso < 0.25) subFrame = 0;
  else if (progreso < 0.50) subFrame = 1;
  else if (progreso < 0.70) subFrame = 2;
  else subFrame = 3;

  let imgIdx = baseImg + subFrame;

  if (imgIdx >= 1 && imgIdx <= 12 && imagenesTutorial[imgIdx]) {
    let img = imagenesTutorial[imgIdx];
    let cx = x + celdaW / 2.0;
    let cy = height / 2.0;

    let maxH = celdaH * 1.44;
    let maxW = celdaW * 1.44;
    let factor = min(maxW / img.width, maxH / img.height);
    let wImg = img.width * factor;
    let hImg = img.height * factor;

    push();
    imageMode(CENTER);
    image(img, cx, cy, wImg, hImg);
    pop();
  }

  // Rectángulo blanco dinámico
  let perimetro = (celdaW + celdaH) * 2.0;
  let recorrido = perimetro * progreso;

  push();
  rectMode(CORNER);
  noFill();
  stroke(255);
  strokeWeight(2.5);
  drawProgress(x, y, celdaW, celdaH, recorrido);
  pop();
}

// ============================================================
// DIBUJO DEL MENÚ 3x3 (IDÉNTICO A PROCESSING)
// ============================================================
function dibujarMenu() {
  rectMode(CORNER);

  let numero = 1;

  for (let fila = 0; fila < 3; fila++) {
    for (let col = 0; col < 3; col++) {
      let x = margen + col * (celdaW + margen);
      let y = margen + fila * (celdaH + margen);

      push();
      translate(x + celdaW / 2, y + celdaH / 2);

      // Escala idéntica a Processing: coordenadas relativas a 1370 x 850
      let escala = Math.min(celdaW, celdaH) / 850.0;
      scale(escala);

      switch (numero) {
        case 1: dibujarPreviewEstado1(0, 0, 1370, 850); break;
        case 2: dibujarPreviewEstado2(0, 0, 1370, 850); break;
        case 3: dibujarPreviewEstado3(0, 0, 1370, 850); break;
        case 4: dibujarPreviewEstado4(0, 0, 1370, 850); break;
        case 5: dibujarPreviewEstado5(0, 0, 1370, 850); break;
        case 6: dibujarPreviewEstado6(0, 0, 1370, 850); break;
        case 7: dibujarPreviewEstado7(0, 0, 1370, 850); break;
        case 8: dibujarPreviewEstado8(0, 0, 1370, 850); break;
        case 9: dibujarPreviewEstado9(0, 0, 1370, 850); break;
      }
      pop();

      numero++;
    }
  }

  // Secuencia demo de sectores
  if (secuenciaSectoresMenuActiva) {
    dibujarMarcoSectorMenu(estadoActualDemoMenu, progresoActualDemoMenu);
    return;
  }

  // Hover visual (idéntico a Processing)
  let celdaHoverFinal = HandTracker.celdaHover;
  if (celdaHoverFinal === -1 && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    for (let f = 0; f < 3; f++) {
      for (let c = 0; c < 3; c++) {
        let hx = margen + c * (celdaW + margen);
        let hy = margen + f * (celdaH + margen);
        if (mouseX >= hx && mouseX <= hx + celdaW && mouseY >= hy && mouseY <= hy + celdaH) {
          celdaHoverFinal = f * 3 + c;
          break;
        }
      }
      if (celdaHoverFinal !== -1) break;
    }
  }

  // Recuadro cian sutil de hover
  if (HandTracker.estadoSeleccion === -1 && estadoSeleccionMouse === -1 && celdaHoverFinal >= 0 && celdaHoverFinal <= 8) {
    let f = Math.floor(celdaHoverFinal / 3);
    let c = celdaHoverFinal % 3;
    let hx = margen + c * (celdaW + margen);
    let hy = margen + f * (celdaH + margen);

    push();
    stroke(0, 220, 255, 80);
    strokeWeight(2);
    noFill();
    rect(hx, hy, celdaW, celdaH);
    pop();
  }

  // Progreso de selección por mano
  if (HandTracker.estadoSeleccion !== -1 && HandTracker.progresoSeleccion > 0) {
    let f = Math.floor(HandTracker.estadoSeleccion / 3);
    let c = HandTracker.estadoSeleccion % 3;
    let sx = margen + c * (celdaW + margen);
    let sy = margen + f * (celdaH + margen);
    dibujarMarcoNeon(sx, sy, celdaW, celdaH, HandTracker.progresoSeleccion);
  }

  // Progreso de selección por ratón / táctil
  if (estadoSeleccionMouse !== -1) {
    let f = Math.floor((estadoSeleccionMouse - 1) / 3);
    let c = (estadoSeleccionMouse - 1) % 3;
    let sx = margen + c * (celdaW + margen);
    let sy = margen + f * (celdaH + margen);
    let progreso = constrain((millis() - inicioMouseSeleccion) / tiempoSeleccion, 0.0, 1.0);
    dibujarMarcoNeon(sx, sy, celdaW, celdaH, progreso);
  }
}

function dibujarMarcoNeon(x, y, w, h, progreso) {
  let perimetro = (w + h) * 2.0;
  let recorrido = perimetro * progreso;

  push();
  noFill();
  stroke(0, 220, 255, 120);
  strokeWeight(6);
  drawProgress(x, y, w, h, recorrido);

  stroke(255, 255, 255, 230);
  strokeWeight(2);
  drawProgress(x, y, w, h, recorrido);
  pop();
}

function drawProgress(x, y, w, h, d) {
  let s = d;
  if (s > 0) {
    let a = Math.min(s, w);
    line(x, y, x + a, y);
  }
  if (s > w) {
    let a = Math.min(s - w, h);
    line(x + w, y, x + w, y + a);
  }
  if (s > w + h) {
    let a = Math.min(s - w - h, w);
    line(x + w, y + h, x + w - a, y + h);
  }
  if (s > w * 2 + h) {
    let a = Math.min(s - w * 2 - h, h);
    line(x, y + h, x, y + h - a);
  }
}

// ============================================================
// ENTRADAS: MOUSE, TOUCH Y TECLADO
// ============================================================

function actualizarSeleccionMouse() {
  if (!mouseIsPressed) {
    estadoSeleccionMouse = -1;
    inicioMouseSeleccion = 0;
    return;
  }

  let celdaActual = -1;
  for (let f = 0; f < 3; f++) {
    for (let c = 0; c < 3; c++) {
      let cx = margen + c * (celdaW + margen);
      let cy = margen + f * (celdaH + margen);
      if (mouseX >= cx && mouseX <= cx + celdaW && mouseY >= cy && mouseY <= cy + celdaH) {
        celdaActual = f * 3 + c + 1;
        break;
      }
    }
    if (celdaActual !== -1) break;
  }

  if (celdaActual === -1) {
    estadoSeleccionMouse = -1;
    inicioMouseSeleccion = 0;
    return;
  }

  if (estadoSeleccionMouse !== celdaActual) {
    estadoSeleccionMouse = celdaActual;
    inicioMouseSeleccion = millis();
  } else {
    let progreso = (millis() - inicioMouseSeleccion) / tiempoSeleccion;
    if (progreso >= 1.0) {
      entrarEstado(estadoSeleccionMouse);
      estadoSeleccionMouse = -1;
      inicioMouseSeleccion = 0;
    }
  }
}

let tiempoUltimoGestoValido = 0;

function interaccionValidaEstado() {
  if (mostrarGifEstado) return false;
  let hayGesto = mouseIsPressed || (HandTracker.activo && HandTracker.gestoId === estado);
  if (hayGesto) {
    tiempoUltimoGestoValido = millis();
    return true;
  }
  // Amortiguador de gracia de 250ms para mantener interacción continua y fluida
  return (millis() - tiempoUltimoGestoValido < 250);
}

function mousePressed() {
  if (estado !== MENU) {
    activarClickEstado();
  }
}

function touchStarted(event) {
  if (event && event.target && event.target.tagName !== 'CANVAS') {
    return true;
  }
  if (event && event.cancelable) {
    event.preventDefault();
  }
  if (!window.experienciaIniciada) {
    return false;
  }
  if (estado !== MENU) {
    activarClickEstado();
  }
  return false;
}

function mouseReleased() {
  if (estado === 2) soltarEstado2();
  if (estado === 3) soltarActivacionEstado3();
}

function touchEnded(event) {
  if (event && event.target && event.target.tagName !== 'CANVAS') {
    return true;
  }
  if (event && event.cancelable) {
    event.preventDefault();
  }
  if (estado === 2) soltarEstado2();
  if (estado === 3) soltarActivacionEstado3();
  return false;
}

function keyPressed() {
  if (keyCode === ESCAPE || key === 'm' || key === 'M') {
    if (estado !== MENU) volverAlMenu();
  } else if (key >= '1' && key <= '9') {
    entrarEstado(parseInt(key));
  }
}

function activarClickEstado() {
  if (mostrarGifEstado) return;
  ultimaActividadEstado = millis();
  if (estado === 1) clickEstado1();
  if (estado === 2) presionarEstado2();
  if (estado === 3) iniciarActivacionEstado3();
  if (estado === 4) clickEstado4();
  if (estado === 5) clickEstado5();
  if (estado === 6) clickEstado6();
  if (estado === 7) clickEstado7();
  if (estado === 8) clickEstado8();
  if (estado === 9) clickEstado9();
}

// ============================================================
// PREVIEWS EXACTOS DEL MENÚ (1:1 CON LOS .PDE DE PROCESSING)
// ============================================================

// PREVIEW 1: RADAR CONCÉNTRICO VIOLETA (IDÉNTICO A ESTADO_1.PDE)
function dibujarPreviewEstado1(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  ellipseMode(CENTER);
  noStroke();

  let margenHorizontal = 20;
  let anchoRecorte = anchoCelda - margenHorizontal * 2.0;
  let limiteX = anchoRecorte / 2.0;
  let limiteY = altoCelda / 2.0;

  push();
  translate(centroX, centroY);

  for (let anillo = 0; anillo < 10; anillo++) {
    let fase = (frameCount * 0.25 + anillo * 75) % 360;
    let radioMaxPrev = limiteX + 15;
    let radio = map(fase, 0, 360, 40, radioMaxPrev);
    let alphaAnillo = map(radio, 40, radioMaxPrev, 140, 50);
    let cantidadPuntos = 20;

    fill(139, 99, 199, alphaAnillo);
    for (let i = 0; i < cantidadPuntos; i++) {
      let tamPunto = 25 + Math.sin(anillo * 30 + i * 15) * 5;
      let angulo = TWO_PI * i / cantidadPuntos;
      let px = Math.cos(angulo) * radio;
      let py = Math.sin(angulo) * radio;

      // Desaparición estricta al tocar los bordes de celda
      if (py - tamPunto / 2.0 <= -limiteY || py + tamPunto / 2.0 >= limiteY) continue;
      if (px - tamPunto / 2.0 <= -limiteX || px + tamPunto / 2.0 >= limiteX) continue;

      ellipse(px, py, tamPunto, tamPunto);
    }
  }

  // Círculo central (+25%: 150 * 1.25 = 187.5)
  let pulso = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  fill(violeta);
  ellipse(0, 0, 187.5 * pulso, 187.5 * pulso);

  pop();
}

// PREVIEW 2: DERIVA RADIAL VIOLETA (IDÉNTICO A ESTADO_2.PDE)
function dibujarPreviewEstado2(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  ellipseMode(CENTER);
  noStroke();

  let maxDist = 650.0;
  let margenHorizontal = 20;
  let anchoRecorte = anchoCelda - margenHorizontal * 2.0;
  let limiteX = anchoRecorte / 2.0;
  let limiteY = altoCelda / 2.0;

  push();
  translate(centroX, centroY);

  for (let i = 0; i < CANTIDAD_PARTICULAS_PREVIEW_E2; i++) {
    previewDistancia2[i] += previewVelocidad2[i];

    if (previewDistancia2[i] > maxDist) {
      previewDistancia2[i] = random(0, 30);
      previewAngulo2[i] = random(TWO_PI);
      previewVelocidad2[i] = 0.50 * random(0.85, 1.15);
      previewTam2[i] = random(20, 35);
    }

    let d = previewDistancia2[i];
    let ang = previewAngulo2[i];
    let onda = Math.sin(frameCount * 0.010 + previewFase2[i]) * 8 * (d / maxDist);

    let px = Math.cos(ang) * d - Math.sin(ang) * onda;
    let py = Math.sin(ang) * d + Math.cos(ang) * onda;

    if (px <= -limiteX || px >= limiteX || py <= -limiteY || py >= limiteY) continue;

    let alphaPart = 140;
    if (d < 80) {
      alphaPart = map(d, 0, 80, 0, 140);
    } else if (d > maxDist - 100) {
      alphaPart = map(d, maxDist - 100, maxDist, 140, 0);
    }

    fill(139, 99, 199, alphaPart);
    circle(px, py, previewTam2[i]);
  }

  // Círculo central (+25%: 150 * 1.25 = 187.5)
  let pulsoPreview = 1.0 + Math.sin(frameCount * 0.025) * 0.04;
  fill(violeta);
  circle(0, 0, 187.5 * pulsoPreview);

  pop();
}

// PREVIEW 3: REBOTE VIOLETA (IDÉNTICO A ESTADO_3.PDE)
function dibujarPreviewEstado3(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  ellipseMode(CENTER);
  noStroke();

  let pulso = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  let radioSeguro = 97.5 * pulso + 15; // 78 * 1.25 = 97.5

  let margenHorizontal = 20;
  let anchoRecorte = anchoCelda - margenHorizontal * 2.0;
  let limX = anchoRecorte / 2.0;
  let limY = altoCelda / 2.0;

  if (!previewEstado3Inicializado) {
    for (let i = 0; i < CANTIDAD_PARTICULAS_E3; i++) {
      previewX3[i] = random(-limX, limX);
      previewY3[i] = random(-limY, limY);
      while (dist(previewX3[i], previewY3[i], 0, 0) < 97.5 + 40) {
        previewX3[i] = random(-limX, limX);
        previewY3[i] = random(-limY, limY);
      }
      let angulo = random(TWO_PI);
      let vel = random(0.45, 0.55);
      previewVX3[i] = Math.cos(angulo) * vel;
      previewVY3[i] = Math.sin(angulo) * vel;
      previewFase3[i] = random(TWO_PI);
      previewFrecuencia3[i] = random(0.008, 0.020);
      previewTam3[i] = random(20, 35);
    }
    previewEstado3Inicializado = true;
  }

  push();
  translate(centroX, centroY);

  for (let i = 0; i < CANTIDAD_PARTICULAS_E3; i++) {
    let giro = Math.sin(frameCount * previewFrecuencia3[i] + previewFase3[i]) * 0.045;
    let nvx = previewVX3[i] * Math.cos(giro) - previewVY3[i] * Math.sin(giro);
    let nvy = previewVX3[i] * Math.sin(giro) + previewVY3[i] * Math.cos(giro);
    previewVX3[i] = lerp(previewVX3[i], nvx, 0.10);
    previewVY3[i] = lerp(previewVY3[i], nvy, 0.10);

    previewX3[i] += previewVX3[i];
    previewY3[i] += previewVY3[i];

    let d = dist(previewX3[i], previewY3[i], 0, 0);
    if (d < radioSeguro) {
      let rep = Math.atan2(previewY3[i], previewX3[i]);
      previewX3[i] = Math.cos(rep) * radioSeguro;
      previewY3[i] = Math.sin(rep) * radioSeguro;
      let vel = dist(0, 0, previewVX3[i], previewVY3[i]);
      let nAng = rep + random(-0.2, 0.2);
      previewVX3[i] = Math.cos(nAng) * vel;
      previewVY3[i] = Math.sin(nAng) * vel;
    }

    if (previewX3[i] < -limX) { previewX3[i] = -limX; previewVX3[i] = Math.abs(previewVX3[i]); }
    if (previewX3[i] > limX)  { previewX3[i] = limX;  previewVX3[i] = -Math.abs(previewVX3[i]); }
    if (previewY3[i] < -limY) { previewY3[i] = -limY; previewVY3[i] = Math.abs(previewVY3[i]); }
    if (previewY3[i] > limY)  { previewY3[i] = limY;  previewVY3[i] = -Math.abs(previewVY3[i]); }

    fill(139, 99, 199, 140);
    circle(previewX3[i], previewY3[i], previewTam3[i]);
  }

  // Círculo fruta (+25%: 150 * 1.25 = 187.5)
  fill(violeta);
  circle(0, 0, 187.5 * pulso);

  pop();
}

// PREVIEW 4: CUADRADOS ORTOGONALES AZULES (IDÉNTICO A ESTADO_4.PDE)
function dibujarPreviewEstado4(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  noStroke();

  let pulso = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  let radioSeguro = 110.0 * pulso;
  let margenHorizontal = 20;
  let anchoRecorte = anchoCelda - margenHorizontal * 2.0;
  let limX = anchoRecorte / 2.0;
  let limY = altoCelda / 2.0;
  let v = 1.0;

  if (!previewEstado4Inicializado) {
    for (let i = 0; i < CANTIDAD_PREVIEW_E4; i++) {
      previewX4[i] = random(-limX, limX);
      previewY4[i] = random(-limY, limY);
      while (dist(previewX4[i], previewY4[i], 0, 0) < 130) {
        previewX4[i] = random(-limX, limX);
        previewY4[i] = random(-limY, limY);
      }
      previewDir4[i] = Math.floor(random(4));
      previewContador4[i] = 0;
      previewCambio4[i] = Math.floor(random(40, 150));
      previewTam4[i] = random(20, 32);
    }
    previewEstado4Inicializado = true;
  }

  push();
  translate(centroX, centroY);

  for (let i = 0; i < CANTIDAD_PREVIEW_E4; i++) {
    if (previewDir4[i] === 0) previewX4[i] += v;
    else if (previewDir4[i] === 1) previewY4[i] += v;
    else if (previewDir4[i] === 2) previewX4[i] -= v;
    else if (previewDir4[i] === 3) previewY4[i] -= v;

    if (previewX4[i] >= limX) { previewX4[i] = limX; previewDir4[i] = random(1) < 0.5 ? 1 : 3; }
    else if (previewX4[i] <= -limX) { previewX4[i] = -limX; previewDir4[i] = random(1) < 0.5 ? 1 : 3; }
    if (previewY4[i] >= limY) { previewY4[i] = limY; previewDir4[i] = random(1) < 0.5 ? 0 : 2; }
    else if (previewY4[i] <= -limY) { previewY4[i] = -limY; previewDir4[i] = random(1) < 0.5 ? 0 : 2; }

    let d = dist(previewX4[i], previewY4[i], 0, 0);
    if (d < radioSeguro) {
      let ang = Math.atan2(previewY4[i], previewX4[i]);
      previewX4[i] = Math.cos(ang) * radioSeguro;
      previewY4[i] = Math.sin(ang) * radioSeguro;
      previewDir4[i] = Math.floor(random(4));
      previewContador4[i] = 0;
    }

    previewContador4[i]++;
    if (previewContador4[i] >= previewCambio4[i]) {
      previewContador4[i] = 0;
      previewCambio4[i] = Math.floor(random(40, 150));
      if (previewDir4[i] === 0 || previewDir4[i] === 2) {
        previewDir4[i] = random(1) < 0.5 ? 1 : 3;
      } else {
        previewDir4[i] = random(1) < 0.5 ? 0 : 2;
      }
    }

    fill(baseParticulasAzul);
    square(previewX4[i], previewY4[i], previewTam4[i]);
  }

  // Cuadrado central (+25%: 150 * 1.25 = 187.5)
  fill(baseCentroAzul);
  square(0, 0, 187.5 * pulso);

  pop();
}

// Trayectoria cuadrada libre para Colaboración (idéntica a Processing)
function obtenerOffsetX6(fase) {
  let velocidad = 1.0;
  let amplitud = 30.0;
  let t = (frameCount * velocidad + fase * 20) % 240;

  if (t < 60) {
    return map(t, 0, 60, -amplitud, amplitud);
  } else if (t < 120) {
    return amplitud;
  } else if (t < 180) {
    return map(t, 120, 180, amplitud, -amplitud);
  } else {
    return -amplitud;
  }
}

function obtenerOffsetY6(fase) {
  let velocidad = 1.0;
  let amplitud = 30.0;
  let t = (frameCount * velocidad + fase * 20) % 240;

  if (t < 60) {
    return -amplitud;
  } else if (t < 120) {
    return map(t, 60, 120, -amplitud, amplitud);
  } else if (t < 180) {
    return amplitud;
  } else {
    return map(t, 180, 240, amplitud, -amplitud);
  }
}

// PREVIEW 5 (CENTRO): COLABORACIÓN — OSCILACIÓN CUADRADA CON RECORTE ESTRICTO
function dibujarPreviewEstado5(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  noStroke();

  if (!previewEstado6Inicializado) {
    for (let i = 0; i < CANTIDAD_CUADRADOS6; i++) {
      previewBaseX6[i] = random(-650, 650);
      previewBaseY6[i] = random(-400, 400);
      previewFase6[i] = random(TWO_PI);
      previewTam6[i] = random(20, 35);
    }
    previewEstado6Inicializado = true;
  }

  let margenHorizontal = 20;
  let anchoRecorte = anchoCelda - margenHorizontal * 2.0;
  let limX = anchoRecorte / 2.0;
  let limY = altoCelda / 2.0;

  push();
  translate(centroX, centroY);

  // Recorte estricto idéntico a clip() de Processing para no dibujar fuera del sector
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(-limX, -limY, anchoRecorte, altoCelda);
  drawingContext.clip();

  for (let i = 0; i < CANTIDAD_CUADRADOS6; i++) {
    let offsetX = obtenerOffsetX6(previewFase6[i]);
    let offsetY = obtenerOffsetY6(previewFase6[i]);

    let px = previewBaseX6[i] + offsetX;
    let py = previewBaseY6[i] + offsetY;

    fill(25, 64, 107, 220); // baseParticulasAzul
    square(px, py, previewTam6[i]);
  }

  // Cuadrado central (+25%: 150 * 1.25 = 187.5)
  let pulsoPreview = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  fill(74, 143, 217); // baseCentroAzul
  square(0, 0, 187.5 * pulsoPreview);

  drawingContext.restore();
  pop();
  rectMode(CORNER);
}

// PREVIEW 6 (DERECHA): EMPATÍA — ÓRBITA A VELOCIDAD 0.0025 CON RECORTE ESTRICTO
function dibujarPreviewEstado6(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  noStroke();

  if (!previewEstado5Inicializado) {
    for (let i = 0; i < CANTIDAD_CUADRADOS5; i++) {
      previewAngulo5[i] = i * (TWO_PI / CANTIDAD_CUADRADOS5);
      previewRadio5[i] = random(120, Math.min(anchoCelda, altoCelda) * 1.1);
      previewFase5[i] = random(TWO_PI);
      previewTam5[i] = random(20, 35);
    }
    previewEstado5Inicializado = true;
  }

  let margenHorizontal = 20;
  let anchoRecorte = anchoCelda - margenHorizontal * 2.0;
  let limX = anchoRecorte / 2.0;
  let limY = altoCelda / 2.0;

  push();
  translate(centroX, centroY);

  // Recorte estricto idéntico a clip() de Processing para no dibujar fuera del sector
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(-limX, -limY, anchoRecorte, altoCelda);
  drawingContext.clip();

  for (let i = 0; i < CANTIDAD_CUADRADOS5; i++) {
    // Velocidad exacta de Processing: 0.0025 (reducida desde 0.007)
    previewAngulo5[i] += 0.0025;

    let r = previewRadio5[i] + Math.sin(frameCount * 0.016 + previewFase5[i]) * 15;
    let px = Math.cos(previewAngulo5[i]) * r;
    let py = Math.sin(previewAngulo5[i]) * r;

    fill(25, 64, 107, 220); // baseParticulasAzul
    square(px, py, previewTam5[i]);
  }

  // Cuadrado central (+25%: 150 * 1.25 = 187.5)
  let pulsoPreview = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  fill(74, 143, 217); // baseCentroAzul
  square(0, 0, 187.5 * pulsoPreview);

  drawingContext.restore();
  pop();
  rectMode(CORNER);
}

// PREVIEW 7: TRIÁNGULOS VERDES EN ÓRBITA Y ROTACIÓN (IDÉNTICO A ESTADO_7.PDE)
function dibujarPreviewEstado7(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  noStroke();

  if (!previewEstado7Inicializado) {
    for (let i = 0; i < CANTIDAD_PARTICULAS_E7; i++) {
      let bx = random(-650, 650);
      let by = random(-400, 400);
      while (dist(bx, by, 0, 0) < 130) {
        bx = random(-650, 650);
        by = random(-400, 400);
      }
      previewBaseX7[i] = bx;
      previewBaseY7[i] = by;
      previewFase7[i] = random(TWO_PI);
      previewTam7[i] = random(20, 30);
      previewRotacion7[i] = random(TWO_PI);
    }
    previewEstado7Inicializado = true;
  }

  let margenHorizontal = 20;
  let anchoRecorte = anchoCelda - margenHorizontal * 2.0;
  let limX = anchoRecorte / 2.0;
  let limY = altoCelda / 2.0;

  push();
  translate(centroX, centroY);

  for (let i = 0; i < CANTIDAD_PARTICULAS_E7; i++) {
    let movX = previewBaseX7[i] + Math.sin(frameCount * 0.042 + previewFase7[i]) * 40;
    let movY = previewBaseY7[i] + Math.cos(frameCount * 0.038 + previewFase7[i]) * 36;
    previewRotacion7[i] += 0.030;

    if (movX < -limX || movX > limX || movY < -limY || movY > limY) continue;

    dibujarTrianguloRotadoDirecto(drawingContext, movX, movY, previewRotacion7[i], previewTam7[i], 105, 235, 160, 0.75);
  }

  // Triángulo central (+25%: 220 * 1.25 = 275)
  let pulsoPreview7 = 1.0 + Math.sin(frameCount * 0.09) * 0.09;
  dibujarTrianguloRotadoDirecto(drawingContext, 0, 0, 0, 275 * pulsoPreview7, 105, 235, 160, 0.90);

  pop();
  rectMode(CORNER);
}

// PREVIEW 8: TRIÁNGULOS VERDES EN VAIVÉN DIAGONAL (IDÉNTICO A ESTADO_8.PDE)
function dibujarPreviewEstado8(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  noStroke();

  if (!previewEstado8Inicializado) {
    for (let i = 0; i < CANTIDAD_PARTICULAS_E8; i++) {
      let bx = random(-650, 650);
      let by = random(-400, 400);
      while (dist(bx, by, 0, 0) < 130) {
        bx = random(-650, 650);
        by = random(-400, 400);
      }
      previewBaseX8[i] = bx;
      previewBaseY8[i] = by;
      previewFase8[i] = random(TWO_PI);
      previewTam8[i] = random(20, 30);
      previewRotacion8[i] = random(TWO_PI);
    }
    previewEstado8Inicializado = true;
  }

  let margenHorizontal = 20;
  let anchoRecorte = anchoCelda - margenHorizontal * 2.0;
  let limX = anchoRecorte / 2.0;
  let limY = altoCelda / 2.0;

  push();
  translate(centroX, centroY);

  for (let i = 0; i < CANTIDAD_PARTICULAS_E8; i++) {
    let factorProgresoMenu = (Math.sin(frameCount * 0.022 + previewFase8[i]) + 1.0) / 2.0;
    previewRotacion8[i] += 0.030;

    let iniX = previewBaseX8[i] - 75;
    let iniY = previewBaseY8[i] - 75;
    let fnX = previewBaseX8[i] + 75;
    let fnY = previewBaseY8[i] + 75;

    let movX = lerp(iniX, fnX, factorProgresoMenu);
    let movY = lerp(iniY, fnY, factorProgresoMenu);

    if (movX < -limX || movX > limX || movY < -limY || movY > limY) continue;

    dibujarTrianguloRotadoDirecto(drawingContext, movX, movY, previewRotacion8[i], previewTam8[i], 105, 235, 160, 0.75);
  }

  // Triángulo central (+25%: (165 + 50) * 1.25 = 268.75)
  let pulsoPreview8 = 1.0 + Math.sin(frameCount * 0.09) * 0.09;
  dibujarTrianguloRotadoDirecto(drawingContext, 0, 0, 0, 268.75 * pulsoPreview8, 105, 235, 160, 0.90);

  pop();
  rectMode(CORNER);
}

// PREVIEW 9: TRIÁNGULOS VERDES EN CAPAS MULTICAPA (IDÉNTICO A ESTADO_9.PDE)
function dibujarPreviewEstado9(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  noStroke();

  if (!previewEstado9Inicializado) {
    for (let i = 0; i < CANTIDAD_PREVIEW_E9; i++) {
      let anguloSector = (TWO_PI * i) / CANTIDAD_PREVIEW_E9;
      previewBaseAngulo9[i] = (anguloSector + random(-0.25, 0.25) + TWO_PI) % TWO_PI;
      previewBaseRadio9[i] = random(115, 920);
      previewTamParticula9[i] = random(20, 30);
      previewRotacionPropia9[i] = random(TWO_PI);
    }
    previewEstado9Inicializado = true;
  }

  let margenHorizontal = 20;
  let anchoRecorte = anchoCelda - margenHorizontal * 2.0;
  let limX = anchoRecorte / 2.0;
  let limY = altoCelda / 2.0;

  push();
  translate(centroX, centroY);

  for (let i = 0; i < CANTIDAD_PREVIEW_E9; i++) {
    let anguloPrev = previewBaseAngulo9[i] + frameCount * 0.0038;
    previewRotacionPropia9[i] += 0.030;
    let x = Math.cos(anguloPrev) * previewBaseRadio9[i];
    let y = Math.sin(anguloPrev) * previewBaseRadio9[i];

    if (x < -limX || x > limX || y < -limY || y > limY) continue;

    let tamP = previewTamParticula9[i];
    let rot = previewRotacionPropia9[i];
    let ctx = drawingContext;

    dibujarTrianguloRotadoDirecto(ctx, x, y, rot, tamP * 1.55, 90, 255, 175, 0.04);
    dibujarTrianguloRotadoDirecto(ctx, x, y, rot, tamP * 1.34, 75, 235, 155, 0.06);
    dibujarTrianguloRotadoDirecto(ctx, x, y, rot, tamP * 1.18, 65, 220, 145, 0.09);
    dibujarTrianguloRotadoDirecto(ctx, x, y, rot, tamP, 105, 235, 160, 0.82);
  }

  // Triángulo central (+25%: 205 * 1.25 = 256.25)
  let respiracion = 1.0 + Math.sin(frameCount * 0.09) * 0.08;
  dibujarTrianguloRotadoDirecto(drawingContext, 0, 0, 0, 256.25 * respiracion, 105, 235, 160, 0.90);

  pop();
  rectMode(CORNER);
}

// Dibujo directo optimizado de triángulos equiláteros rotados (sin matrices save/restore)
function dibujarTrianguloRotadoDirecto(ctx, cx, cy, ang, tam, r, g, b, a) {
  const h = tam * 0.8660254;
  const v1y = -h * 0.67;
  const v2x = -tam * 0.5;
  const v2y = h * 0.33;
  const v3x = tam * 0.5;

  const cosA = Math.cos(ang);
  const sinA = Math.sin(ang);

  ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
  ctx.beginPath();
  ctx.moveTo(cx - v1y * sinA, cy + v1y * cosA);
  ctx.lineTo(cx + v2x * cosA - v2y * sinA, cy + v2x * sinA + v2y * cosA);
  ctx.lineTo(cx + v3x * cosA - v2y * sinA, cy + v3x * sinA + v2y * cosA);
  ctx.closePath();
  ctx.fill();
}

function trianguloEquilatero(tam) {
  let h = tam * 0.866;
  triangle(0, -h * 0.67, -tam * 0.5, h * 0.33, tam * 0.5, h * 0.33);
}

// ============================================================
// ============================================================
// IMPLEMENTACIÓN 1:1 DE LOS 9 ESTADOS ACTIVOS E INTERACCIONES
// ============================================================
// ============================================================

function reiniciarEstado(n) {
  switch (n) {
    case 1: reiniciarEstado1(); break;
    case 2: reiniciarEstado2(); break;
    case 3: reiniciarEstado3(); break;
    case 4: reiniciarEstado4(); break;
    case 5: reiniciarEstado5(); break;
    case 6: reiniciarEstado6(); break;
    case 7: reiniciarEstado7(); break;
    case 8: reiniciarEstado8(); break;
    case 9: reiniciarEstado9(); break;
  }
}

function dibujarEstado(n) {
  switch (n) {
    case 1: dibujarEstado1(); break;
    case 2: dibujarEstado2(); break;
    case 3: dibujarEstado3(); break;
    case 4: dibujarEstado4(); break;
    case 5: dibujarEstado5(); break;
    case 6: dibujarEstado6(); break;
    case 7: dibujarEstado7(); break;
    case 8: dibujarEstado8(); break;
    case 9: dibujarEstado9(); break;
  }
}

function inicializarEstadosActivos() {
  reiniciarEstado1();
  reiniciarEstado2();
  reiniciarEstado3();
  reiniciarEstado4();
  reiniciarEstado5();
  reiniciarEstado6();
  reiniciarEstado7();
  reiniciarEstado8();
  reiniciarEstado9();
}

// ============================================================
// ESTADO 1 — RADAR + HUELLAS (100% IDÉNTICO A ESTADO_1.PDE)
// ============================================================
let centroEstado1X = 0;
let centroEstado1Y = 0;
let estado1Inicializado = false;
let huellasEstado1 = [];
let alphaHuellasEstado1 = [];
let tiemposHuellasEstado1 = [];
let ultimoClickContinuoEstado1 = 0;

function reiniciarEstado1() {
  huellasEstado1 = [];
  alphaHuellasEstado1 = [];
  tiemposHuellasEstado1 = [];
  centroEstado1X = 0;
  centroEstado1Y = 0;
  estado1Inicializado = false;
  ultimoClickContinuoEstado1 = millis();
}

function clickEstado1() {
  if (estado !== 1) return;
  ultimaActividadEstado = millis();
  ultimoClickContinuoEstado1 = millis();

  if (estado1Inicializado) {
    huellasEstado1.push({ x: centroEstado1X, y: centroEstado1Y });
    alphaHuellasEstado1.push(100.0);
    tiemposHuellasEstado1.push(frameCount);

    // Mantener hasta 8 huellas máximas en pantalla para rendimiento óptimo
    if (huellasEstado1.length > 8) {
      huellasEstado1.shift();
      alphaHuellasEstado1.shift();
      tiemposHuellasEstado1.shift();
    }
  }

  centroEstado1X = random(-width / 2 + 100, width / 2 - 100);
  centroEstado1Y = random(-height / 2 + 100, height / 2 - 100);
  estado1Inicializado = true;
}

function dibujarEstado1() {
  if (!estado1Inicializado) {
    centroEstado1X = 0;
    centroEstado1Y = 0;
    estado1Inicializado = true;
    ultimaActividadEstado = millis();
  }

  // Creación continua al mantener gesto o click cada 2500ms
  if (interaccionValidaEstado()) {
    ultimaActividadEstado = millis();
    if (millis() - ultimoClickContinuoEstado1 >= 2500) {
      clickEstado1();
    }
  }

  let pulso = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  let tamanoCentral = 187.5 * pulso; // +25%: 150 * 1.25 = 187.5

  // 1. Actualizar opacidad de las huellas
  for (let i = 0; i < alphaHuellasEstado1.length; i++) {
    alphaHuellasEstado1[i] -= 0.09;
    alphaHuellasEstado1[i] = Math.max(20, alphaHuellasEstado1[i]);
  }

  push();
  noStroke();

  // 2. Dibujar todas las huellas
  for (let h = 0; h < huellasEstado1.length; h++) {
    let pos = huellasEstado1[h];
    let alphaH = alphaHuellasEstado1[h];
    let tiempoH = tiemposHuellasEstado1[h];

    // Anillos de la huella
    for (let anillo = 0; anillo < 10; anillo++) {
      let fase = ((frameCount - tiempoH) * 0.25 + anillo * 75) % 360;
      if (fase < 0) fase += 360;

      let radioMaxHuella = Math.max(width, height) * 0.85;
      let radio = map(fase, 0, 360, 80, radioMaxHuella);
      let alphaAnillo = map(radio, 80, radioMaxHuella, alphaH, alphaH * 0.45);
      alphaAnillo = constrain(alphaAnillo, 0, alphaH);

      let cantidadPuntos = 20;
      fill(139, 99, 199, alphaAnillo);
      for (let i = 0; i < cantidadPuntos; i++) {
        let tamPunto = 25 + Math.sin(h * 50 + anillo * 30 + i * 15) * 5;
        let angulo = TWO_PI * i / cantidadPuntos;
        let px = pos.x + Math.cos(angulo) * radio;
        let py = pos.y + Math.sin(angulo) * radio;

        // Si tocan los bordes, desaparecen
        if (py - tamPunto / 2.0 <= -height / 2.0 || py + tamPunto / 2.0 >= height / 2.0) continue;
        if (px - tamPunto / 2.0 <= -width / 2.0 || px + tamPunto / 2.0 >= width / 2.0) continue;

        ellipse(px, py, tamPunto, tamPunto);
      }
    }

    // Círculo central de la huella
    let pulsoHuella = 1.0 + Math.sin((frameCount - tiempoH) * 0.06) * 0.07;
    let tamanoHuella = 187.5 * pulsoHuella;
    fill(139, 99, 199, alphaH);
    ellipse(pos.x, pos.y, tamanoHuella, tamanoHuella);
  }

  // 3. Radar del círculo actual
  for (let anillo = 0; anillo < 10; anillo++) {
    let fase = (frameCount * 0.25 + anillo * 75) % 360;
    let radioMaxE1 = width / 2.0 + Math.abs(centroEstado1X) + 20;
    let radio = map(fase, 0, 360, 80, radioMaxE1);
    let alphaAnillo = map(radio, 80, radioMaxE1, 90, 40);
    let cantidadPuntos = 20;

    fill(139, 99, 199, alphaAnillo);
    for (let i = 0; i < cantidadPuntos; i++) {
      let tamPunto = 25 + Math.sin(anillo * 30 + i * 15) * 5;
      let angulo = TWO_PI * i / cantidadPuntos;
      let px = centroEstado1X + Math.cos(angulo) * radio;
      let py = centroEstado1Y + Math.sin(angulo) * radio;

      if (py - tamPunto / 2.0 <= -height / 2.0 || py + tamPunto / 2.0 >= height / 2.0) continue;
      if (px - tamPunto / 2.0 <= -width / 2.0 || px + tamPunto / 2.0 >= width / 2.0) continue;

      ellipse(px, py, tamPunto, tamPunto);
    }
  }

  // 4. Círculo central actual (+25%: 150 * 1.25 = 187.5)
  fill(violeta);
  ellipse(centroEstado1X, centroEstado1Y, tamanoCentral, tamanoCentral);

  pop();
}

// ============================================================
// ESTADO 2 — PARTÍCULAS Y CÍRCULOS MEDIANOS (100% IDÉNTICO A ESTADO_2.PDE)
// ============================================================
const CANTIDAD_GRUPOS_ESTADO2 = 5;
const MAX_GRUPOS_DIBUJADOS_ESTADO2 = 4;
let particulasEstado2 = [];
let gruposVisualesEstado2 = [];
let offsetTandaEstado2 = 0;
let numeroTandaEstado2 = 0;
let inicioUltimaTandaEstado2 = 0;
let mousePresionadoEstado2 = false;
let pulsacionProcesadaEstado2 = false;
let contadorEmisionEstado2 = 0;
let previewTransferidaEstado2 = false;

class GrupoVisualEstado2 {
  constructor(indice, anguloInicial, tipoDistancia) {
    this.indiceOrbita = indice;
    this.angulo = anguloInicial;
    this.tamano = 8; // tamanoInicialGrupoEstado2
    this.alpha = 255;
    this.creciendo = true;
    this.tipoDistancia = tipoDistancia; // 0 = cerca (200px), 1 = lejos (330px)
  }

  actualizar() {
    if (this.creciendo) {
      this.tamano = lerp(this.tamano, 95, 0.025);
      if (Math.abs(this.tamano - 95) < 0.5) {
        this.tamano = 95;
        this.creciendo = false;
      }
    }
  }

  posicion() {
    let radioActual = 200 + (this.tipoDistancia * 130);
    return {
      x: Math.cos(this.angulo) * radioActual,
      y: Math.sin(this.angulo) * radioActual
    };
  }

  dibujar() {
    let p = this.posicion();
    noStroke();
    fill(139, 99, 199, this.alpha);
    ellipse(p.x, p.y, this.tamano, this.tamano);
  }
}

class ParticulaEstado2 {
  constructor(vaAlGrupo, grupo) {
    this.x = 0;
    this.y = 0;
    this.grupoDestino = grupo;
    this.haciaGrupo = vaAlGrupo;
    this.tamanoParticula = random(20, 30);
    this.alpha = 85;
    this.activa = true;

    this.faseOnda = random(TWO_PI);
    this.frecuenciaOnda = random(0.008, 0.015);
    this.amplitudOnda = random(0.5, 0.9);
    this.anguloRadial = random(TWO_PI);

    this.velocidadBase = 0.50 * random(0.75, 1.25);
    this.vx = Math.cos(this.anguloRadial) * this.velocidadBase;
    this.vy = Math.sin(this.anguloRadial) * this.velocidadBase;
  }

  actualizar() {
    if (this.haciaGrupo && this.grupoDestino >= 0 && this.grupoDestino < gruposVisualesEstado2.length) {
      let grupo = gruposVisualesEstado2[this.grupoDestino];
      let destino = grupo.posicion();
      let dx = destino.x - this.x;
      let dy = destino.y - this.y;
      let distancia = Math.hypot(dx, dy);

      if (distancia < 10) {
        this.activa = false;
        return;
      }

      let dirX = dx / distancia;
      let dirY = dy / distancia;
      let perpX = -dirY;
      let perpY = dirX;

      let onda = Math.sin(frameCount * this.frecuenciaOnda + this.faseOnda);
      let factorOnda = constrain(distancia / 220.0, 0.15, 1.0);

      dirX += perpX * onda * this.amplitudOnda * factorOnda;
      dirY += perpY * onda * this.amplitudOnda * factorOnda;

      let mag = Math.hypot(dirX, dirY);
      if (mag > 0) {
        dirX = (dirX / mag) * this.velocidadBase;
        dirY = (dirY / mag) * this.velocidadBase;
      }

      this.vx = lerp(this.vx, dirX, 0.035);
      this.vy = lerp(this.vy, dirY, 0.035);

      let vmag = Math.hypot(this.vx, this.vy);
      if (vmag > 0) {
        this.vx = (this.vx / vmag) * this.velocidadBase;
        this.vy = (this.vy / vmag) * this.velocidadBase;
      }
    } else {
      let dirRadX = Math.cos(this.anguloRadial);
      let dirRadY = Math.sin(this.anguloRadial);

      let ondaLibre = Math.sin(frameCount * this.frecuenciaOnda + this.faseOnda);
      let perpX = -dirRadY * ondaLibre * 0.16;
      let perpY = dirRadX * ondaLibre * 0.16;

      dirRadX += perpX;
      dirRadY += perpY;
      let mag = Math.hypot(dirRadX, dirRadY);
      if (mag > 0) {
        dirRadX = (dirRadX / mag) * this.velocidadBase;
        dirRadY = (dirRadY / mag) * this.velocidadBase;
      }

      this.vx = lerp(this.vx, dirRadX, 0.15);
      this.vy = lerp(this.vy, dirRadY, 0.15);

      let vmag = Math.hypot(this.vx, this.vy);
      if (vmag > 0) {
        this.vx = (this.vx / vmag) * this.velocidadBase;
        this.vy = (this.vy / vmag) * this.velocidadBase;
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    if (Math.hypot(this.x, this.y) > 800) {
      this.activa = false;
    }
  }

  dibujar() {
    noStroke();
    fill(139, 99, 199, this.alpha);
    ellipse(this.x, this.y, this.tamanoParticula, this.tamanoParticula);
  }
}

let ultimoGestoEstado2 = 0;

function reiniciarEstado2() {
  particulasEstado2 = [];
  gruposVisualesEstado2 = [];
  offsetTandaEstado2 = 0;
  numeroTandaEstado2 = 0;
  inicioUltimaTandaEstado2 = 0;
  mousePresionadoEstado2 = false;
  pulsacionProcesadaEstado2 = false;
  contadorEmisionEstado2 = 0;
  previewTransferidaEstado2 = false;
  ultimoGestoEstado2 = 0;
}

function transferirPreviewAEstado2() {
  particulasEstado2 = [];

  for (let i = 0; i < CANTIDAD_PARTICULAS_PREVIEW_E2; i++) {
    let nueva = new ParticulaEstado2(false, -1);

    if (previewEstado2Inicializado) {
      nueva.anguloRadial = previewAngulo2[i];
      let d = previewDistancia2[i];
      let onda = Math.sin(frameCount * 0.05 + previewFase2[i]) * 15 * (d / 650.0);
      nueva.x = Math.cos(nueva.anguloRadial) * d - Math.sin(nueva.anguloRadial) * onda;
      nueva.y = Math.sin(nueva.anguloRadial) * d + Math.cos(nueva.anguloRadial) * onda;
      nueva.tamanoParticula = previewTam2[i];
      nueva.faseOnda = previewFase2[i];
    } else {
      nueva.anguloRadial = random(TWO_PI);
      let d = random(30, 750);
      nueva.x = Math.cos(nueva.anguloRadial) * d;
      nueva.y = Math.sin(nueva.anguloRadial) * d;
      nueva.tamanoParticula = random(20, 32);
      nueva.faseOnda = random(TWO_PI);
    }

    nueva.velocidadBase = 0.50 * random(0.75, 1.25);
    nueva.vx = Math.cos(nueva.anguloRadial) * nueva.velocidadBase;
    nueva.vy = Math.sin(nueva.anguloRadial) * nueva.velocidadBase;
    nueva.activa = true;
    nueva.haciaGrupo = false;

    particulasEstado2.push(nueva);
  }

  previewTransferidaEstado2 = true;
}

function presionarEstado2() {
  ultimaActividadEstado = millis();
  mousePresionadoEstado2 = true;

  if (!pulsacionProcesadaEstado2) {
    crearNuevaTandaEstado2();
    pulsacionProcesadaEstado2 = true;
  }
}

function soltarEstado2() {
  mousePresionadoEstado2 = false;
  pulsacionProcesadaEstado2 = false;
  ultimaActividadEstado = millis();
}

function crearNuevaTandaEstado2() {
  numeroTandaEstado2++;

  // Mantener exactamente hasta 4 tandas (20 grupos) en pantalla
  if (gruposVisualesEstado2.length >= MAX_GRUPOS_DIBUJADOS_ESTADO2 * CANTIDAD_GRUPOS_ESTADO2) {
    for (let i = 0; i < CANTIDAD_GRUPOS_ESTADO2; i++) {
      gruposVisualesEstado2.shift();
    }

    for (let i = particulasEstado2.length - 1; i >= 0; i--) {
      let p = particulasEstado2[i];
      if (p.grupoDestino >= 0) {
        if (p.grupoDestino < CANTIDAD_GRUPOS_ESTADO2) {
          p.activa = false;
        } else {
          p.grupoDestino -= CANTIDAD_GRUPOS_ESTADO2;
        }
      }
    }
  }

  let desplazamiento = radians(36);
  offsetTandaEstado2 = (offsetTandaEstado2 + desplazamiento) % TWO_PI;
  inicioUltimaTandaEstado2 = gruposVisualesEstado2.length;

  let ciclo = (numeroTandaEstado2 - 1) % 4;
  let tipoDistancia = (ciclo < 2) ? 0 : 1; // 0 = 200px, 1 = 330px

  for (let i = 0; i < CANTIDAD_GRUPOS_ESTADO2; i++) {
    let angulo = -HALF_PI + offsetTandaEstado2 + (i * TWO_PI / CANTIDAD_GRUPOS_ESTADO2);
    let grupo = new GrupoVisualEstado2(inicioUltimaTandaEstado2 + i, angulo, tipoDistancia);
    gruposVisualesEstado2.push(grupo);
  }
}

function emitirParticulasEstado2() {
  contadorEmisionEstado2++;
  if (contadorEmisionEstado2 < 3) return;
  contadorEmisionEstado2 = 0;

  if (!mousePresionadoEstado2 || gruposVisualesEstado2.length === 0) {
    let nueva = new ParticulaEstado2(true, -1);
    nueva.haciaGrupo = false;
    nueva.velocidadBase = 0.50 * random(0.75, 1.25);
    let ang = random(TWO_PI);
    nueva.vx = Math.cos(ang) * nueva.velocidadBase;
    nueva.vy = Math.sin(ang) * nueva.velocidadBase;
    nueva.anguloRadial = ang;
    particulasEstado2.push(nueva);
    return;
  }

  let primeraNuevaTanda = Math.max(0, gruposVisualesEstado2.length - CANTIDAD_GRUPOS_ESTADO2);
  let cantidadNuevaTanda = gruposVisualesEstado2.length - primeraNuevaTanda;
  let grupoLocal = Math.floor(frameCount / 3) % cantidadNuevaTanda;
  let grupo = primeraNuevaTanda + grupoLocal;

  particulasEstado2.push(new ParticulaEstado2(true, grupo));
}

function dibujarEstado2() {
  if (!previewTransferidaEstado2) {
    transferirPreviewAEstado2();
  }

  // Control de interacción: Click / Touch o Detección de Gestos por Cámara
  if (mostrarGifEstado) {
    ultimoGestoEstado2 = 0;
  } else if (mouseIsPressed) {
    ultimaActividadEstado = millis();
    if (!mousePresionadoEstado2) {
      presionarEstado2();
    }
  } else if (HandTracker.activo && HandTracker.gestoId === 2) {
    ultimaActividadEstado = millis();

    if (!mousePresionadoEstado2) {
      presionarEstado2(); // Activa exactamente una nueva tanda de 5 círculos alrededor
      ultimoGestoEstado2 = 2;
    }
  } else {
    // Sin interacción activa del gesto 2
    if (mousePresionadoEstado2) {
      soltarEstado2();
    }
    ultimoGestoEstado2 = 0;
  }

  // Emisión continua cada 3 frames
  emitirParticulasEstado2();

  // Actualizar partículas
  for (let i = particulasEstado2.length - 1; i >= 0; i--) {
    let p = particulasEstado2[i];
    p.actualizar();
    if (!p.activa) {
      particulasEstado2.splice(i, 1);
    }
  }

  // Actualizar grupos y calcular opacidades escalonadas (100%, 75%, 50%, 25%)
  let totalTandas = Math.floor(gruposVisualesEstado2.length / CANTIDAD_GRUPOS_ESTADO2);

  for (let i = 0; i < gruposVisualesEstado2.length; i++) {
    let grupo = gruposVisualesEstado2[i];
    grupo.actualizar();

    let tandaIdx = Math.floor(i / CANTIDAD_GRUPOS_ESTADO2);
    let distanciaDesdeReciente = (totalTandas - 1) - tandaIdx;

    let targetAlpha = 255;
    if (distanciaDesdeReciente === 0) targetAlpha = 255;            // 100%
    else if (distanciaDesdeReciente === 1) targetAlpha = 255 * 0.75; // 75%
    else if (distanciaDesdeReciente === 2) targetAlpha = 255 * 0.50; // 50%
    else if (distanciaDesdeReciente === 3) targetAlpha = 255 * 0.25; // 25%

    grupo.alpha = lerp(grupo.alpha, targetAlpha, 0.1);
  }

  push();
  // Dibujar partículas
  for (let p of particulasEstado2) {
    p.dibujar();
  }

  // Dibujar grupos visuales
  for (let g of gruposVisualesEstado2) {
    g.dibujar();
  }

  // Círculo central (+25%: 150 * 1.25 = 187.5)
  let pulsoActual = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  noStroke();
  fill(violeta);
  ellipse(0, 0, 187.5 * pulsoActual, 187.5 * pulsoActual);

  pop();
}

// ------------------------------------------------------------
// ============================================================
// ESTADO 3 — FRUTA + HORMIGAS + MANCHAS (100% IDÉNTICO A ESTADO_3.PDE)
// ============================================================
const CANTIDAD_HORMIGAS_E3 = 5;
const MAX_MANCHAS_E3 = 500;
const RADIO_FRUTA_E3 = 97.5; // +25%: 78 * 1.25 = 97.5
const VELOCIDAD_PARTICULAS_MIN_E3 = 0.45;
const VELOCIDAD_PARTICULAS_MAX_E3 = 0.55;
const INTERVALO_ENTRE_HORMIGAS_E3 = 850;

const OPACIDAD_NUEVA_E3 = 25.0;
const OPACIDAD_GENERACION_ANTERIOR_E3 = 12.5;
const OPACIDAD_MIN_E3 = 6.25;

class ParticulaEstado3 {
  constructor(id) {
    this.id = id;
    this.tam = random(25, 35);
    this.x = random(-width / 2.0 + 45, width / 2.0 - 45);
    this.y = random(-height / 2.0 + 45, height / 2.0 - 45);

    let angulo = random(TWO_PI);
    let velocidad = random(VELOCIDAD_PARTICULAS_MIN_E3, VELOCIDAD_PARTICULAS_MAX_E3);
    this.vx = Math.cos(angulo) * velocidad;
    this.vy = Math.sin(angulo) * velocidad;

    this.fase = random(TWO_PI);
    this.frecuencia = random(0.008, 0.020);

    this.hormiga = false;
    this.progreso = 0;
    this.inicioCruce = { x: 0, y: 0 };
    this.finCruce = { x: 0, y: 0 };
    this.ultimaMarca = 0;
  }

  actualizarMovimientoLibre() {
    let giro = Math.sin(frameCount * this.frecuencia + this.fase) * 0.045;
    let nuevoVX = this.vx * Math.cos(giro) - this.vy * Math.sin(giro);
    let nuevoVY = this.vx * Math.sin(giro) + this.vy * Math.cos(giro);

    this.vx = lerp(this.vx, nuevoVX, 0.10);
    this.vy = lerp(this.vy, nuevoVY, 0.10);

    this.x += this.vx;
    this.y += this.vy;

    // Rebote contra la fruta central (+25%: 97.5)
    let radioSeguro = RADIO_FRUTA_E3 * pulsoFrutaEstado3() + this.tam / 2.0 + 5;
    let distanciaAlCentro = Math.hypot(this.x, this.y);

    if (distanciaAlCentro < radioSeguro) {
      let anguloRepulsion = Math.atan2(this.y, this.x);
      this.x = Math.cos(anguloRepulsion) * radioSeguro;
      this.y = Math.sin(anguloRepulsion) * radioSeguro;

      let velocidad = Math.hypot(this.vx, this.vy);
      let nuevoAngulo = anguloRepulsion + random(-0.2, 0.2);
      this.vx = Math.cos(nuevoAngulo) * velocidad;
      this.vy = Math.sin(nuevoAngulo) * velocidad;
    }

    // Límites de pantalla
    let limiteX = width / 2.0 - 80;
    let limiteY = height / 2.0 - 80;

    if (this.x < -limiteX) { this.x = -limiteX; this.vx = Math.abs(this.vx); }
    if (this.x > limiteX)  { this.x = limiteX;  this.vx = -Math.abs(this.vx); }
    if (this.y < -limiteY) { this.y = -limiteY; this.vy = Math.abs(this.vy); }
    if (this.y > limiteY)  { this.y = limiteY;  this.vy = -Math.abs(this.vy); }
  }

  iniciarCruce() {
    this.hormiga = true;
    this.progreso = 0;

    let angulo = random(TWO_PI);
    let distancia = RADIO_FRUTA_E3 + 45;

    this.inicioCruce = { x: Math.cos(angulo) * distancia, y: Math.sin(angulo) * distancia };
    this.finCruce = { x: -Math.cos(angulo) * distancia, y: -Math.sin(angulo) * distancia };

    this.ultimaMarca = millis() - 200;
  }

  actualizarCruce() {
    this.progreso += 0.0030;
    if (this.progreso > 1.0) this.progreso = 1.0;

    let baseX = lerp(this.inicioCruce.x, this.finCruce.x, this.progreso);
    let baseY = lerp(this.inicioCruce.y, this.finCruce.y, this.progreso);

    let dirX = this.finCruce.x - this.inicioCruce.x;
    let dirY = this.finCruce.y - this.inicioCruce.y;
    let mag = Math.hypot(dirX, dirY);
    if (mag > 0) {
      dirX /= mag;
      dirY /= mag;
    }

    let latX = -dirY;
    let latY = dirX;
    let onda = Math.sin(this.progreso * TWO_PI * 2.5 + this.fase) * 12;

    this.x = baseX + latX * onda;
    this.y = baseY + latY * onda;

    if (millis() - this.ultimaMarca >= 70) {
      let distanciaCentro = Math.hypot(this.x, this.y);
      if (distanciaCentro <= RADIO_FRUTA_E3 - 3) {
        agregarManchaEstado3(this.x, this.y);
      }
      this.ultimaMarca = millis();
    }

    if (this.progreso >= 1.0) {
      this.hormiga = false;
      this.progreso = 0;

      let angulo = random(TWO_PI);
      let velocidad = random(VELOCIDAD_PARTICULAS_MIN_E3, VELOCIDAD_PARTICULAS_MAX_E3);
      this.vx = Math.cos(angulo) * velocidad;
      this.vy = Math.sin(angulo) * velocidad;

      liberarHormigaEstado3(this.id);
      proximaHormigaEstado3 = millis() + INTERVALO_ENTRE_HORMIGAS_E3;
    }
  }

  dibujar() {
    noStroke();
    if (this.hormiga) {
      if (interaccionValidaEstado() || activacionEstado3) {
        fill(50, 20, 80, 200); // Hormiga activa destacada
      } else {
        fill(139, 99, 199, 140);
      }
      circle(this.x, this.y, this.tam);
    } else {
      fill(139, 99, 199, 85);
      circle(this.x, this.y, this.tam);
    }
  }
}

class ManchaEstado3 {
  constructor(x, y, generacion) {
    this.x = x;
    this.y = y;
    this.tamano = 4;
    this.generacion = generacion;
    this.opacidad = OPACIDAD_NUEVA_E3;
  }

  actualizar() {
    if (this.tamano < 40) {
      this.tamano = Math.min(40, this.tamano + 0.45);
    }

    let antiguedad = generacionActualEstado3 - this.generacion;
    let objetivo = OPACIDAD_NUEVA_E3;

    if (antiguedad >= 1) objetivo = OPACIDAD_GENERACION_ANTERIOR_E3;
    if (antiguedad >= 2) objetivo = OPACIDAD_MIN_E3;

    objetivo = Math.max(OPACIDAD_MIN_E3, objetivo);
    this.opacidad = lerp(this.opacidad, objetivo, 0.025);
  }

  dibujar() {
    let pulso = pulsoFrutaEstado3();
    let tamanoDibujo = this.tamano * pulso;
    noStroke();
    fill(245, 238, 255, this.opacidad);
    circle(this.x, this.y, tamanoDibujo);
  }
}

let particulasEstado3 = [];
let manchasEstado3 = [];
let hormigasActivasEstado3 = new Array(CANTIDAD_HORMIGAS_E3).fill(-1);
let esHormigaEstado3 = new Array(CANTIDAD_PARTICULAS_E3).fill(false);
let siguienteParticulaEstado3 = 0;
let activacionEstado3 = false;
let proximaHormigaEstado3 = 0;
let generacionActualEstado3 = 0;
let estado3Inicializado = false;

function pulsoFrutaEstado3() {
  return 1.0 + Math.sin(frameCount * 0.025) * 0.05;
}

function inicializarEstado3() {
  particulasEstado3 = [];
  manchasEstado3 = [];
  for (let i = 0; i < CANTIDAD_PARTICULAS_E3; i++) {
    particulasEstado3.push(new ParticulaEstado3(i));
    esHormigaEstado3[i] = false;
  }
  for (let i = 0; i < CANTIDAD_HORMIGAS_E3; i++) {
    hormigasActivasEstado3[i] = -1;
  }
  siguienteParticulaEstado3 = 0;
  generacionActualEstado3 = 0;
  activacionEstado3 = false;
  ultimaActividadEstado = millis();
  proximaHormigaEstado3 = 0;
  estado3Inicializado = true;
}

function reiniciarEstado3() {
  activacionEstado3 = false;
  manchasEstado3 = [];
  generacionActualEstado3 = 0;
  siguienteParticulaEstado3 = 0;
  proximaHormigaEstado3 = 0;
  estado3Inicializado = false;
  particulasEstado3 = [];
  for (let i = 0; i < CANTIDAD_PARTICULAS_E3; i++) {
    esHormigaEstado3[i] = false;
  }
  for (let i = 0; i < CANTIDAD_HORMIGAS_E3; i++) {
    hormigasActivasEstado3[i] = -1;
  }
}

function iniciarActivacionEstado3() {
  if (estado !== 3) return;
  ultimaActividadEstado = millis();
  if (activacionEstado3) return;

  generacionActualEstado3++;
  activacionEstado3 = true;
  proximaHormigaEstado3 = millis();
}

function soltarActivacionEstado3() {
  activacionEstado3 = false;
  ultimaActividadEstado = millis();
}

function completarGrupoEstado3() {
  let cantidad = 0;
  for (let p of particulasEstado3) {
    if (p.hormiga) cantidad++;
  }
  if (cantidad >= CANTIDAD_HORMIGAS_E3) return;
  if (millis() < proximaHormigaEstado3) return;

  let indice = -1;
  for (let vuelta = 0; vuelta < particulasEstado3.length; vuelta++) {
    let idx = (siguienteParticulaEstado3 + vuelta) % particulasEstado3.length;
    if (!particulasEstado3[idx].hormiga) {
      siguienteParticulaEstado3 = (idx + 1) % particulasEstado3.length;
      indice = idx;
      break;
    }
  }

  if (indice === -1) return;

  particulasEstado3[indice].iniciarCruce();
  if (indice >= 0 && indice < esHormigaEstado3.length) esHormigaEstado3[indice] = true;
  for (let i = 0; i < CANTIDAD_HORMIGAS_E3; i++) {
    if (hormigasActivasEstado3[i] === -1) {
      hormigasActivasEstado3[i] = indice;
      break;
    }
  }
  proximaHormigaEstado3 = millis() + INTERVALO_ENTRE_HORMIGAS_E3;
}

function liberarHormigaEstado3(indice) {
  if (indice >= 0 && indice < esHormigaEstado3.length) esHormigaEstado3[indice] = false;
  for (let i = 0; i < CANTIDAD_HORMIGAS_E3; i++) {
    if (hormigasActivasEstado3[i] === indice) {
      hormigasActivasEstado3[i] = -1;
      return;
    }
  }
}

function agregarManchaEstado3(x, y) {
  if (manchasEstado3.length >= MAX_MANCHAS_E3) return;
  let radioSeguro = RADIO_FRUTA_E3 - 21;
  if (Math.hypot(x, y) > radioSeguro) return;

  let mejorX = x;
  let mejorY = y;
  for (let intento = 0; intento < 8; intento++) {
    let angulo = random(TWO_PI);
    let desplazamiento = random(0, 10);
    let candidatoX = x + Math.cos(angulo) * desplazamiento;
    let candidatoY = y + Math.sin(angulo) * desplazamiento;
    if (Math.hypot(candidatoX, candidatoY) <= radioSeguro) {
      mejorX = candidatoX;
      mejorY = candidatoY;
      break;
    }
  }

  manchasEstado3.push(new ManchaEstado3(mejorX, mejorY, generacionActualEstado3));
}

function dibujarEstado3() {
  if (!estado3Inicializado) {
    inicializarEstado3();
  }

  if (interaccionValidaEstado()) {
    ultimaActividadEstado = millis();
    if (!activacionEstado3) {
      iniciarActivacionEstado3();
    }
  } else {
    if (activacionEstado3) {
      soltarActivacionEstado3();
    }
  }

  for (let p of particulasEstado3) {
    if (!p.hormiga) {
      p.actualizarMovimientoLibre();
    } else {
      p.actualizarCruce();
    }
  }

  if (activacionEstado3) {
    completarGrupoEstado3();
  }

  push();
  noStroke();

  // 1. Fruta central (+25%: 150 * 1.25 = 187.5)
  let tamanoFruta = RADIO_FRUTA_E3 * 2.0 * pulsoFrutaEstado3();
  fill(violeta);
  circle(0, 0, tamanoFruta);

  // 2. Manchas acumuladas
  for (let mancha of manchasEstado3) {
    mancha.actualizar();
    mancha.dibujar();
  }

  // 3. Partículas y hormigas
  for (let p of particulasEstado3) {
    p.dibujar();
  }

  pop();
}

// ============================================================
// ESTADO 4 — IDENTIDAD Y ACOPLE ORTOGONAL (100% IDÉNTICO A ESTADO_4.PDE)
// ============================================================
const PARTICULAS_INICIALES4 = 40;
const TAM_INICIAL_CUADRADO4 = 24;
const TAM_MINIMO_CUADRADO4 = 50;
const TAM_MAXIMO_CUADRADO4 = 180;
const DISTANCIA_BASE_CUADRADO4 = 100; // 90 + 10 (+25%: 187.5 / 2 + 6 = 100)
const MARGEN_MOVIMIENTO4 = 90;
const VELOCIDAD_ACERCAMIENTO_CUADRADO4 = 1.0;

class ParticulaEstado4 {
  constructor(cuadrado) {
    this.esCuadrado = cuadrado;

    if (cuadrado) {
      this.tam = TAM_INICIAL_CUADRADO4;
      this.tamFinal = random(TAM_MINIMO_CUADRADO4, TAM_MAXIMO_CUADRADO4);
      this.creciendo = true;
      this.terminado = false;
      this.anguloFinal = random(TWO_PI);

      let varR = random(-15, 15);
      let varG = random(-20, 20);
      let varB = random(-15, 15);
      this.colorFinalPersonalizado = color(
        constrain(155 + varR, 0, 255),
        constrain(220 + varG, 0, 255),
        constrain(255 + varB, 0, 255)
      );
    } else {
      this.tam = random(20, 30);
      this.tamFinal = this.tam;
      this.creciendo = false;
      this.terminado = false;
      this.anguloFinal = 0;
      this.colorFinalPersonalizado = color(25, 64, 107);
    }

    this.x = random(-width / 2.0 + MARGEN_MOVIMIENTO4, width / 2.0 - MARGEN_MOVIMIENTO4);
    this.y = random(-height / 2.0 + MARGEN_MOVIMIENTO4, height / 2.0 - MARGEN_MOVIMIENTO4);

    this.velocidad = 1.0;
    this.direccion = Math.floor(random(4));
    this.contadorDireccion = 0;
    this.siguienteCambio = Math.floor(random(40, 150));
    this.colorActual = color(25, 64, 107);
  }
}

let particulasEstado4 = [];
let estado4Inicializado = false;
let cuadradoActivo4 = -1;

function pulsoCentralEstado4() {
  return 1.0 + Math.sin(frameCount * 0.025) * 0.05;
}

function inicializarEstado4() {
  if (estado4Inicializado) return;
  particulasEstado4 = [];
  for (let i = 0; i < PARTICULAS_INICIALES4; i++) {
    particulasEstado4.push(new ParticulaEstado4(false));
  }
  cuadradoActivo4 = -1;
  ultimaActividadEstado = millis();
  estado4Inicializado = true;
}

function reiniciarEstado4() {
  particulasEstado4 = [];
  cuadradoActivo4 = -1;
  estado4Inicializado = false;
  ultimaActividadEstado = millis();
}

function clickEstado4() {
  if (estado !== 4) return;
  inicializarEstado4();
  ultimaActividadEstado = millis();
}

function crearCuadrado4() {
  let nuevo = new ParticulaEstado4(true);
  nuevo.x = random(-width / 2.0 + MARGEN_MOVIMIENTO4, width / 2.0 - MARGEN_MOVIMIENTO4);
  nuevo.y = random(-height / 2.0 + MARGEN_MOVIMIENTO4, height / 2.0 - MARGEN_MOVIMIENTO4);
  particulasEstado4.push(nuevo);
  cuadradoActivo4 = particulasEstado4.length - 1;
}

function moverParticulaEstado4(p) {
  if (p.esCuadrado && p.terminado) return;

  let v = p.velocidad;
  if (p.direccion === 0) p.x += v;
  else if (p.direccion === 1) p.y += v;
  else if (p.direccion === 2) p.x -= v;
  else if (p.direccion === 3) p.y -= v;

  let limiteX = width / 2.0 - MARGEN_MOVIMIENTO4 - p.tam / 2.0;
  let limiteY = height / 2.0 - MARGEN_MOVIMIENTO4 - p.tam / 2.0;

  if (p.x >= limiteX) {
    p.x = limiteX;
    if (p.direccion === 0) p.direccion = random(1) < 0.5 ? 1 : 3;
  } else if (p.x <= -limiteX) {
    p.x = -limiteX;
    if (p.direccion === 2) p.direccion = random(1) < 0.5 ? 1 : 3;
  }

  if (p.y >= limiteY) {
    p.y = limiteY;
    if (p.direccion === 1) p.direccion = random(1) < 0.5 ? 0 : 2;
  } else if (p.y <= -limiteY) {
    p.y = -limiteY;
    if (p.direccion === 3) p.direccion = random(1) < 0.5 ? 0 : 2;
  }

  let radioSeguro = 110.0 * pulsoCentralEstado4();
  let d = Math.hypot(p.x, p.y);
  if (d < radioSeguro) {
    let angulo = Math.atan2(p.y, p.x);
    p.x = Math.cos(angulo) * radioSeguro;
    p.y = Math.sin(angulo) * radioSeguro;
    p.direccion = Math.floor(random(4));
    p.contadorDireccion = 0;
  }

  p.contadorDireccion++;
  if (p.contadorDireccion >= p.siguienteCambio) {
    p.contadorDireccion = 0;
    p.siguienteCambio = Math.floor(random(40, 150));
    if (p.direccion === 0 || p.direccion === 2) {
      p.direccion = random(1) < 0.5 ? 1 : 3;
    } else {
      p.direccion = random(1) < 0.5 ? 0 : 2;
    }
  }
}

function actualizarCuadrado4(p, indice) {
  if (!p.esCuadrado || p.terminado) return;

  if (p.creciendo) {
    p.tam = lerp(p.tam, p.tamFinal, 0.015);
    let progreso = constrain(map(p.tam, TAM_INICIAL_CUADRADO4, p.tamFinal, 0, 1), 0, 1);

    let colorIni = color(25, 64, 107);
    let colorDest = color(90, 175, 240);
    if (progreso < 0.5) {
      p.colorActual = lerpColor(colorIni, colorDest, progreso * 2);
    } else {
      p.colorActual = lerpColor(colorDest, p.colorFinalPersonalizado, (progreso - 0.5) * 2);
    }

    if (Math.abs(p.tam - p.tamFinal) < 0.5) {
      p.tam = p.tamFinal;
      p.creciendo = false;
    }
  }

  if (!p.terminado) {
    let distanciaObjetivo = DISTANCIA_BASE_CUADRADO4 + p.tam / 2.0;
    let destinoX = Math.cos(p.anguloFinal) * distanciaObjetivo;
    let destinoY = Math.sin(p.anguloFinal) * distanciaObjetivo;

    let dx = destinoX - p.x;
    let dy = destinoY - p.y;
    let d = Math.hypot(dx, dy);

    if (d <= VELOCIDAD_ACERCAMIENTO_CUADRADO4) {
      p.x = destinoX;
      p.y = destinoY;
      if (!p.creciendo) {
        p.terminado = true;
        cuadradoActivo4 = -1; // Libera turno para que el siguiente cuadrado pueda nacer
      }
    } else {
      p.x += (dx / d) * VELOCIDAD_ACERCAMIENTO_CUADRADO4;
      p.y += (dy / d) * VELOCIDAD_ACERCAMIENTO_CUADRADO4;
    }
  }
}

function dibujarEstado4() {
  rectMode(CENTER);
  noStroke();
  inicializarEstado4();

  let interactuando4 = interaccionValidaEstado();
  if (interactuando4) {
    ultimaActividadEstado = millis();
    if (cuadradoActivo4 === -1) {
      crearCuadrado4();
    }
  }

  push();
  for (let i = 0; i < particulasEstado4.length; i++) {
    let p = particulasEstado4[i];

    if (!p.esCuadrado) {
      moverParticulaEstado4(p);
    } else {
      actualizarCuadrado4(p, i);
    }

    let tamanoDibujo;
    if (p.esCuadrado && p.terminado) {
      let pulsoCuadrado = 1.0 + Math.sin(frameCount * 0.06 + p.anguloFinal) * 0.05;
      tamanoDibujo = p.tamFinal * pulsoCuadrado;
    } else {
      tamanoDibujo = p.tam + Math.sin(frameCount * 0.02 + i) * 1.5;
    }

    fill(p.colorActual);
    square(p.x, p.y, tamanoDibujo);
  }

  let pulso = pulsoCentralEstado4();
  fill(baseCentroAzul);
  square(0, 0, 187.5 * pulso); // +25%: 150 * 1.25 = 187.5
  pop();
  rectMode(CORNER);
}

// ============================================================
// ESTADO 5 — COLABORACIÓN (100% IDÉNTICO A PROCESSING ESTADO_6.PDE)
// Cuadrados en oscilación cuadrada y fusión continua en doble marco
// ============================================================
let x6 = new Float32Array(CANTIDAD_CUADRADOS6);
let y6 = new Float32Array(CANTIDAD_CUADRADOS6);
let baseX6 = new Float32Array(CANTIDAD_CUADRADOS6);
let baseY6 = new Float32Array(CANTIDAD_CUADRADOS6);
let objetivoX6 = new Float32Array(CANTIDAD_CUADRADOS6);
let objetivoY6 = new Float32Array(CANTIDAD_CUADRADOS6);
let tam6 = new Float32Array(CANTIDAD_CUADRADOS6);
let fase6 = new Float32Array(CANTIDAD_CUADRADOS6);
let deriva6 = new Float32Array(CANTIDAD_CUADRADOS6);

let union6 = 0;
let brilloMarco6 = 0;
let estado5Inicializado = false;

function calcularDobleMarco6() {
  let piezasPorCapa = Math.floor(CANTIDAD_CUADRADOS6 / 2); // 32
  let indice = 0;

  // CAPA INTERIOR (+25%: 194 * 1.25 = 242.5)
  let ladoInt = 242.5;
  let mitadInt = ladoInt / 2.0;
  let porLadoInt = Math.floor(piezasPorCapa / 4); // 8

  for (let i = 0; i < porLadoInt; i++) {
    objetivoX6[indice] = map(i, 0, porLadoInt - 1, -mitadInt, mitadInt);
    objetivoY6[indice] = -mitadInt;
    indice++;
  }
  for (let i = 0; i < porLadoInt; i++) {
    objetivoX6[indice] = mitadInt;
    objetivoY6[indice] = map(i, 0, porLadoInt - 1, -mitadInt, mitadInt);
    indice++;
  }
  for (let i = 0; i < porLadoInt; i++) {
    objetivoX6[indice] = map(i, 0, porLadoInt - 1, mitadInt, -mitadInt);
    objetivoY6[indice] = mitadInt;
    indice++;
  }
  for (let i = 0; i < porLadoInt; i++) {
    objetivoX6[indice] = -mitadInt;
    objetivoY6[indice] = map(i, 0, porLadoInt - 1, mitadInt, -mitadInt);
    indice++;
  }

  // CAPA EXTERIOR (+25%: 278 * 1.25 = 347.5)
  let ladoExt = 347.5;
  let mitadExt = ladoExt / 2.0;
  let porLadoExt = Math.floor(piezasPorCapa / 4); // 8

  for (let i = 0; i < porLadoExt; i++) {
    objetivoX6[indice] = map(i, 0, porLadoExt - 1, -mitadExt, mitadExt);
    objetivoY6[indice] = -mitadExt;
    indice++;
  }
  for (let i = 0; i < porLadoExt; i++) {
    objetivoX6[indice] = mitadExt;
    objetivoY6[indice] = map(i, 0, porLadoExt - 1, -mitadExt, mitadExt);
    indice++;
  }
  for (let i = 0; i < porLadoExt; i++) {
    objetivoX6[indice] = map(i, 0, porLadoExt - 1, mitadExt, -mitadExt);
    objetivoY6[indice] = mitadExt;
    indice++;
  }
  for (let i = 0; i < porLadoExt; i++) {
    objetivoX6[indice] = -mitadExt;
    objetivoY6[indice] = map(i, 0, porLadoExt - 1, mitadExt, -mitadExt);
    indice++;
  }
}

function reiniciarEstado5() {
  union6 = 0;
  brilloMarco6 = 0;

  for (let i = 0; i < CANTIDAD_CUADRADOS6; i++) {
    tam6[i] = random(20, 35);
    fase6[i] = random(TWO_PI);
    deriva6[i] = random(TWO_PI);

    baseX6[i] = random(-width / 2.0 + 80, width / 2.0 - 80);
    baseY6[i] = random(-height / 2.0 + 80, height / 2.0 - 80);

    x6[i] = baseX6[i];
    y6[i] = baseY6[i];
  }

  calcularDobleMarco6();
  estado5Inicializado = true;
}

function clickEstado5() {
  ultimaActividadEstado = millis();
}

function dibujarEstado5() {
  if (!estado5Inicializado) {
    reiniciarEstado5();
  }

  rectMode(CENTER);

  let formarMarco6 = interaccionValidaEstado();
  if (formarMarco6) {
    union6 = lerp(union6, 1.0, 0.006);
    ultimaActividadEstado = millis();
  } else {
    union6 = lerp(union6, 0.0, 0.010);
  }

  let objetivoBrillo = constrain(map(union6, 0.65, 1.0, 0, 1), 0, 1);
  brilloMarco6 = lerp(brilloMarco6, objetivoBrillo, 0.015);

  let colorMarco = lerpColor(baseParticulasAzul, baseCentroAzul, union6);

  let pulsoConjunto = 1.0;
  if (union6 > 0.99) {
    pulsoConjunto = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  }

  push();
  scale(pulsoConjunto);
  noStroke();

  let colorCentro = lerpColor(baseCentroAzul, destacadoAzul, brilloMarco6 * 0.25);

  // 1. Dibujar las 64 partículas que convergen hacia los bordes
  for (let i = 0; i < CANTIDAD_CUADRADOS6; i++) {
    if (formarMarco6) {
      let distanciaLibre = lerp(100, 0, union6);
      let movimientoX = Math.sin(frameCount * 0.01 + fase6[i]) * distanciaLibre;
      let movimientoY = Math.cos(frameCount * 0.01 + deriva6[i]) * distanciaLibre;

      let objetivoX = objetivoX6[i] + movimientoX;
      let objetivoY = objetivoY6[i] + movimientoY;

      x6[i] = lerp(x6[i], objetivoX, 0.009);
      y6[i] = lerp(y6[i], objetivoY, 0.009);
    } else {
      let libreX = baseX6[i] + obtenerOffsetX6(fase6[i]);
      let libreY = baseY6[i] + obtenerOffsetY6(fase6[i]);

      x6[i] = lerp(x6[i], libreX, 0.018);
      y6[i] = lerp(y6[i], libreY, 0.018);
    }

    // Al unirse, el color de todas las partículas se iguala exactamente al del centro
    let colorFinal = lerpColor(colorMarco, colorCentro, union6);
    let tamanoFinal = lerp(tam6[i], 72.5, union6); // +25%: 58.0 * 1.25 = 72.5

    let alfa = 255;
    let margenX = width / 2.0 - 50;
    let margenY = height / 2.0 - 50;

    if (Math.abs(x6[i]) > margenX || Math.abs(y6[i]) > margenY) {
      alfa = 0;
    }

    fill(red(colorFinal), green(colorFinal), blue(colorFinal), alfa);
    square(x6[i], y6[i], tamanoFinal);
  }

  // 2. Cuadrado central que crece y absorbe todo el interior (+25%: 150 -> 187.5, 330 -> 412.5)
  let tamanoCentro = lerp(187.5, 412.5, union6);
  fill(colorCentro);
  square(0, 0, tamanoCentro);

  pop();
  rectMode(CORNER);
}

// ============================================================
// ESTADO 6 — EMPATÍA (100% IDÉNTICO A PROCESSING ESTADO_5.PDE)
// Cuadrados en órbita a 0.0025 y convergencia a marco simple
// ============================================================
let angulo5 = new Float32Array(CANTIDAD_CUADRADOS5);
let radio5 = new Float32Array(CANTIDAD_CUADRADOS5);
let x5 = new Float32Array(CANTIDAD_CUADRADOS5);
let y5 = new Float32Array(CANTIDAD_CUADRADOS5);
let objetivoX5 = new Float32Array(CANTIDAD_CUADRADOS5);
let objetivoY5 = new Float32Array(CANTIDAD_CUADRADOS5);
let tam5 = new Float32Array(CANTIDAD_CUADRADOS5);
let fase5 = new Float32Array(CANTIDAD_CUADRADOS5);
let deriva5 = new Float32Array(CANTIDAD_CUADRADOS5);

let union5 = 0;
let brilloMarco5 = 0;
let crecimientoCentro5 = 0;
let estado6Inicializado = false;

function calcularMarco5() {
  let lado = 425; // +25%: 340 * 1.25 = 425
  let mitad = lado / 2.0;
  let porLado = Math.floor(CANTIDAD_CUADRADOS5 / 4); // 20
  let indice = 0;

  // ARRIBA
  for (let i = 0; i < porLado; i++) {
    objetivoX5[indice] = map(i, 0, porLado - 1, -mitad, mitad);
    objetivoY5[indice] = -mitad;
    indice++;
  }
  // DERECHA
  for (let i = 0; i < porLado; i++) {
    objetivoX5[indice] = mitad;
    objetivoY5[indice] = map(i, 0, porLado - 1, -mitad, mitad);
    indice++;
  }
  // ABAJO
  for (let i = 0; i < porLado; i++) {
    objetivoX5[indice] = map(i, 0, porLado - 1, mitad, -mitad);
    objetivoY5[indice] = mitad;
    indice++;
  }
  // IZQUIERDA
  for (let i = 0; i < porLado; i++) {
    objetivoX5[indice] = -mitad;
    objetivoY5[indice] = map(i, 0, porLado - 1, mitad, -mitad);
    indice++;
  }
}

function reiniciarEstado6() {
  union5 = 0;
  brilloMarco5 = 0;
  crecimientoCentro5 = 0;

  for (let i = 0; i < CANTIDAD_CUADRADOS5; i++) {
    angulo5[i] = random(TWO_PI);
    radio5[i] = random(187.5, 900); // 150 * 1.25 = 187.5
    tam5[i] = random(20, 35);
    fase5[i] = random(TWO_PI);
    deriva5[i] = random(TWO_PI);

    x5[i] = Math.cos(angulo5[i]) * radio5[i];
    y5[i] = Math.sin(angulo5[i]) * radio5[i];
  }

  calcularMarco5();
  estado6Inicializado = true;
}

function clickEstado6() {
  ultimaActividadEstado = millis();
}

function dibujarEstado6() {
  if (!estado6Inicializado) {
    reiniciarEstado6();
  }

  rectMode(CENTER);
  noStroke();

  let formarMarco5 = interaccionValidaEstado();
  if (formarMarco5) {
    union5 = lerp(union5, 1.0, 0.006);
    ultimaActividadEstado = millis();
  } else {
    union5 = lerp(union5, 0.0, 0.010);
  }

  let objetivoBrillo = constrain(map(union5, 0.65, 1.0, 0, 1), 0, 1);
  brilloMarco5 = lerp(brilloMarco5, objetivoBrillo, 0.015);

  let objetivoCrecimiento = constrain(map(union5, 0.82, 1.0, 0, 1), 0, 1);
  crecimientoCentro5 = lerp(crecimientoCentro5, objetivoCrecimiento, 0.010);
  let pulsoCentral = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  let colorMarco = lerpColor(baseParticulasAzul, destacadoAzul, brilloMarco5);

  for (let i = 0; i < CANTIDAD_CUADRADOS5; i++) {
    if (formarMarco5) {
      let distanciaLibre = lerp(120, 0, union5);
      let movimientoX = Math.sin(frameCount * 0.01 + fase5[i]) * distanciaLibre;
      let movimientoY = Math.cos(frameCount * 0.01 + deriva5[i]) * distanciaLibre;

      // El marco acompaña la expansión y contracción del latido central
      let escalaMarco = lerp(1.0, pulsoCentral, union5);
      let objetivoX = objetivoX5[i] * escalaMarco + movimientoX;
      let objetivoY = objetivoY5[i] * escalaMarco + movimientoY;

      x5[i] = lerp(x5[i], objetivoX, 0.009);
      y5[i] = lerp(y5[i], objetivoY, 0.009);
    } else {
      angulo5[i] += 0.0025; // Velocidad idéntica a Processing 0.0025
      let r = radio5[i] + Math.sin(frameCount * 0.016 + deriva5[i]) * 15;
      let destX = Math.cos(angulo5[i]) * r;
      let destY = Math.sin(angulo5[i]) * r;

      x5[i] = lerp(x5[i], destX, 0.025);
      y5[i] = lerp(y5[i], destY, 0.025);
    }

    let pulsoLuz = Math.max(0, Math.sin(frameCount * 0.025));
    let intensidad = pulsoLuz * brilloMarco5;
    let colorFinal = lerpColor(colorMarco, destacadoAzul, intensidad * 0.3);

    // Crecimiento y latido en sincronía con la figura central
    let factorCrecimiento = lerp(1.0, 1.45, crecimientoCentro5);
    let latidoParticula = 1.0 + Math.sin(frameCount * 0.05) * 0.10 * union5;
    let tamanoFinal = tam5[i] * factorCrecimiento * latidoParticula;

    let alfa = 255;
    let margenX = width / 2.0 - 80;
    let margenY = height / 2.0 - 80;

    if (Math.abs(x5[i]) > margenX || Math.abs(y5[i]) > margenY) {
      alfa = 0;
    }

    fill(red(colorFinal), green(colorFinal), blue(colorFinal), alfa);
    square(x5[i], y5[i], tamanoFinal);
  }

  // Cuadrado central latiendo y expandiéndose (+25%: 150->187.5, 300->375)
  let tamanoInicialCentro = 187.5;
  let tamanoMaximoCentro = 375;
  let tamanoCentro = lerp(tamanoInicialCentro, tamanoMaximoCentro, crecimientoCentro5) * pulsoCentral;

  let colorCentro = lerpColor(baseCentroAzul, destacadoAzul, brilloMarco5 * 0.35);
  fill(colorCentro);
  square(0, 0, tamanoCentro);

  rectMode(CORNER);
}

// ============================================================
// ESTADO 7 — FUTURO / INCERTIDUMBRE (100% IDÉNTICO A ESTADO_7.PDE)
// ============================================================
const TAM_CENTRAL_E7 = 275; // 220 * 1.25 (+25%)

let tamParticula7 = new Float32Array(CANTIDAD_PARTICULAS_E7);
let faseParticula7 = new Float32Array(CANTIDAD_PARTICULAS_E7);
let derivaParticula7 = new Float32Array(CANTIDAD_PARTICULAS_E7);
let baseX7 = new Float32Array(CANTIDAD_PARTICULAS_E7);
let baseY7 = new Float32Array(CANTIDAD_PARTICULAS_E7);
let radioBase7 = new Float32Array(CANTIDAD_PARTICULAS_E7);
let anguloBase7 = new Float32Array(CANTIDAD_PARTICULAS_E7);
let rotacionBase7 = new Float32Array(CANTIDAD_PARTICULAS_E7);

let incertidumbreClic7 = 0;
let estado7Inicializado = false;

function reiniciarEstado7() {
  incertidumbreClic7 = 0;

  for (let i = 0; i < CANTIDAD_PARTICULAS_E7; i++) {
    if (previewEstado7Inicializado) {
      baseX7[i] = previewBaseX7[i];
      baseY7[i] = previewBaseY7[i];
      faseParticula7[i] = previewFase7[i];
      derivaParticula7[i] = previewFase7[i];
      tamParticula7[i] = previewTam7[i];
      rotacionBase7[i] = previewRotacion7[i];
    } else {
      tamParticula7[i] = random(20, 30);
      faseParticula7[i] = random(TWO_PI);
      derivaParticula7[i] = random(TWO_PI);
      let bx = random(-width / 2.0 + 80, width / 2.0 - 80);
      let by = random(-height / 2.0 + 80, height / 2.0 - 80);
      while (dist(bx, by, 0, 0) < 130) {
        bx = random(-width / 2.0 + 80, width / 2.0 - 80);
        by = random(-height / 2.0 + 80, height / 2.0 - 80);
      }
      baseX7[i] = bx;
      baseY7[i] = by;
      rotacionBase7[i] = random(TWO_PI);
    }

    anguloBase7[i] = (TWO_PI * i) / CANTIDAD_PARTICULAS_E7;
    let capa = i % 4;
    radioBase7[i] = 160 + capa * 80 + random(-25, 25);
  }
  estado7Inicializado = true;
}

function clickEstado7() {
  ultimaActividadEstado = millis();
}

function dibujarEstado7() {
  if (!estado7Inicializado) {
    reiniciarEstado7();
  }

  if (interaccionValidaEstado()) {
    ultimaActividadEstado = millis();
    incertidumbreClic7 = lerp(incertidumbreClic7, 1.0, 0.055);
  } else {
    incertidumbreClic7 = lerp(incertidumbreClic7, 0.0, 0.045);
  }

  let p = suavizarE7(incertidumbreClic7);

  // 1. Dibujar las 64 partículas
  for (let i = 0; i < CANTIDAD_PARTICULAS_E7; i++) {
    dibujarTrianguloExteriorE7(i, p);
  }

  // 2. Triángulo central
  dibujarTrianguloCentralE7(p);
}

function dibujarTrianguloExteriorE7(i, p) {
  // 1. Posición libre inicial (~1.70 px/frame)
  let movLibreX = baseX7[i] + Math.sin(frameCount * 0.042 + faseParticula7[i]) * 40;
  let movLibreY = baseY7[i] + Math.cos(frameCount * 0.038 + faseParticula7[i]) * 36;

  // 2. Posición orbital durante la activación
  let angulo = anguloBase7[i];
  let oscilacionBase = Math.sin(frameCount * 0.045 + i * 0.73 + faseParticula7[i]);
  let radio = radioBase7[i] + oscilacionBase * lerp(12, 65, p);

  let derivaAngular = Math.sin(frameCount * 0.025 + i * 1.31 + derivaParticula7[i]) * lerp(0.025, 0.20, p);
  angulo += derivaAngular;

  let orbitalX = Math.cos(angulo) * radio + Math.sin(frameCount * 0.065 + i * 2.0) * 22 * p;
  let orbitalY = Math.sin(angulo) * radio + Math.cos(frameCount * 0.055 + i * 1.6) * 22 * p;

  // 3. Interpolación de libre a orbital según 'p'
  let x = lerp(movLibreX, orbitalX, p);
  let y = lerp(movLibreY, orbitalY, p);

  // 4. Rotación
  let rotacionOrbital = angulo + HALF_PI + Math.sin(frameCount * 0.015 + i) * lerp(0.03, 0.22, p);
  let rotacion = lerp(rotacionBase7[i], rotacionOrbital, p);

  let tam = tamParticula7[i];

  dibujarTrianguloGlowE7(x, y, tam, rotacion, p, 210);

  if (p > 0.03) {
    let separacion = lerp(0, 28, p);
    let direccionX = Math.sin(i * 2.17 + frameCount * 0.012);
    let direccionY = Math.cos(i * 1.73 + frameCount * 0.010);

    dibujarTrianguloFantasmaE7(
      x + direccionX * separacion,
      y + direccionY * separacion,
      tam * (1.0 + 0.08 * p),
      rotacion + 0.08 * p,
      80 * p
    );

    dibujarTrianguloFantasmaE7(
      x - direccionX * separacion * 0.75,
      y - direccionY * separacion * 0.75,
      tam * (1.0 - 0.06 * p),
      rotacion - 0.065 * p,
      55 * p
    );
  }
}

function dibujarTrianguloCentralE7(p) {
  let amplitud = lerp(3, 25, p);
  let x = Math.sin(frameCount * 0.032) * amplitud;
  let y = Math.cos(frameCount * 0.026) * amplitud;

  let rotacion = Math.sin(frameCount * 0.022) * lerp(0.015, 0.12, p);
  let pulsoExtra = (incertidumbreClic7 > 0.5) ? (1.0 + Math.sin(frameCount * 0.08) * 0.08) : 1.0;
  let tam = TAM_CENTRAL_E7 * (1.0 + Math.sin(frameCount * 0.025) * 0.04) * pulsoExtra;

  push();
  translate(x, y);
  rotate(rotacion);
  noStroke();

  dibujarTrianguloGlowE7(0, 0, tam, 0, p, 255);

  if (p > 0.03) {
    let desplazamiento = lerp(0, 32, p);
    dibujarTrianguloFantasmaE7(
      -desplazamiento * 0.85,
      desplazamiento * 0.40,
      tam * (1.0 + 0.05 * p),
      rotacion + 0.06 * p,
      70 * p
    );

    dibujarTrianguloFantasmaE7(
      desplazamiento * 0.65,
      -desplazamiento * 0.50,
      tam * (1.0 - 0.04 * p),
      rotacion - 0.045 * p,
      45 * p
    );
  }

  pop();
}

function dibujarTrianguloGlowE7(x, y, tam, rotacion, incertidumbre, alphaBase) {
  let ctx = drawingContext;
  dibujarTrianguloRotadoDirecto(ctx, x, y, rotacion, tam * 1.55, 90, 255, 175, (10 + incertidumbre * 8) / 255);
  dibujarTrianguloRotadoDirecto(ctx, x, y, rotacion, tam * 1.34, 75, 235, 155, (16 + incertidumbre * 10) / 255);
  dibujarTrianguloRotadoDirecto(ctx, x, y, rotacion, tam * 1.18, 65, 220, 145, (24 + incertidumbre * 12) / 255);
  dibujarTrianguloRotadoDirecto(ctx, x, y, rotacion, tam, 105, 235, 160, alphaBase / 255);
}

function dibujarTrianguloFantasmaE7(x, y, tam, rotacion, alpha) {
  if (alpha <= 0) return;
  let ctx = drawingContext;
  dibujarTrianguloRotadoDirecto(ctx, x, y, rotacion, tam * 1.35, 100, 255, 185, (alpha * 0.22) / 255);
  dibujarTrianguloRotadoDirecto(ctx, x, y, rotacion, tam, 110, 245, 175, alpha / 255);
}

function suavizarE7(t) {
  t = constrain(t, 0, 1);
  return t * t * (3.0 - 2.0 * t);
}

// ============================================================
// ESTADO 8 — FUTURO / ANSIEDAD (100% IDÉNTICO A ESTADO_8.PDE)
// ============================================================
const TAM_CENTRAL_E8 = 206.25; // 165 * 1.25 (+25%)

let posX8 = new Float32Array(CANTIDAD_PARTICULAS_E8);
let posY8 = new Float32Array(CANTIDAD_PARTICULAS_E8);
let tamParticula8 = new Float32Array(CANTIDAD_PARTICULAS_E8);
let faseParticula8 = new Float32Array(CANTIDAD_PARTICULAS_E8);
let rotacionAleatoria8 = new Float32Array(CANTIDAD_PARTICULAS_E8);

let activacionE8 = 0;
let estado8Inicializado = false;

function reiniciarEstado8() {
  activacionE8 = 0;

  for (let i = 0; i < CANTIDAD_PARTICULAS_E8; i++) {
    tamParticula8[i] = random(20, 30);
    faseParticula8[i] = random(TWO_PI);
    rotacionAleatoria8[i] = random(TWO_PI);

    let rx = random(-width / 2.0 + 80, width / 2.0 - 80);
    let ry = random(-height / 2.0 + 80, height / 2.0 - 80);
    while (dist(rx, ry, 0, 0) < 240) {
      rx = random(-width / 2.0 + 80, width / 2.0 - 80);
      ry = random(-height / 2.0 + 80, height / 2.0 - 80);
    }
    posX8[i] = rx;
    posY8[i] = ry;
  }

  estado8Inicializado = true;
}

function clickEstado8() {
  ultimaActividadEstado = millis();
}

function dibujarEstado8() {
  if (!estado8Inicializado) {
    reiniciarEstado8();
  }

  let interactuando8 = interaccionValidaEstado();
  let objetivoE8 = 0.0;
  if (interactuando8) {
    ultimaActividadEstado = millis();
    objetivoE8 = 1.0;
  }

  let velocidadActivacionE8 = (objetivoE8 > activacionE8) ? 0.050 : 0.035;
  activacionE8 = lerp(activacionE8, objetivoE8, velocidadActivacionE8);

  if (Math.abs(activacionE8 - objetivoE8) < 0.001) {
    activacionE8 = objetivoE8;
  }

  let p = suavizarE8(activacionE8);

  let velocidadTension = lerp(0.040, 0.16, p);
  let onda = Math.sin(frameCount * velocidadTension);
  let pulsoTension = Math.pow(Math.max(0, onda), 6);

  // 1. Partículas
  for (let i = 0; i < CANTIDAD_PARTICULAS_E8; i++) {
    let factorProgreso = (Math.sin(frameCount * 0.022 + faseParticula8[i]) + 1.0) / 2.0;

    let inicioDiagonalX = posX8[i] - 75;
    let inicioDiagonalY = posY8[i] - 75;
    let finDiagonalX = posX8[i] + 75;
    let finDiagonalY = posY8[i] + 75;

    let movLibreX = lerp(inicioDiagonalX, finDiagonalX, factorProgreso);
    let movLibreY = lerp(inicioDiagonalY, finDiagonalY, factorProgreso);

    let distAlCentro = dist(posX8[i], posY8[i], 0, 0);
    let dirX = (distAlCentro > 0.001) ? -posX8[i] / distAlCentro : 0;
    let dirY = (distAlCentro > 0.001) ? -posY8[i] / distAlCentro : 0;

    let radioSeguro = 200.0;
    let distDisponible = Math.max(0, distAlCentro - radioSeguro);

    let oscilacionIdaVuelta = Math.sin(frameCount * 0.12 + faseParticula8[i] * 2.0);
    let desplBase = Math.min(65.0, distDisponible * 0.35);
    let amplitudOsc = Math.min(30.0, distDisponible * 0.18);
    let avanceHaciaCentro = desplBase + oscilacionIdaVuelta * amplitudOsc;
    avanceHaciaCentro = constrain(avanceHaciaCentro, 0, distDisponible);

    let posActivaX = posX8[i] + dirX * avanceHaciaCentro;
    let posActivaY = posY8[i] + dirY * avanceHaciaCentro;

    let finalX = lerp(movLibreX, posActivaX, p);
    let finalY = lerp(movLibreY, posActivaY, p);

    let vibracionX = 0;
    let vibracionY = 0;
    let tamActual = tamParticula8[i];

    if (p > 0.01 || interactuando8) {
      let factorVib = Math.max(p, interactuando8 ? 1.0 : 0.0);
      vibracionX = random(-9, 9) * factorVib;
      vibracionY = random(-9, 9) * factorVib;
      tamActual = lerp(tamParticula8[i], random(35, 42) + Math.sin(frameCount * 0.8 + i) * 5, factorVib);
    }

    let rotPart = rotacionAleatoria8[i] + (p * 0.15 * Math.sin(frameCount * 0.08 + i));
    dibujarBrilloParticulaE8(finalX + vibracionX, finalY + vibracionY, rotPart, tamActual, p);
  }

  // 2. Triángulo Central
  dibujarTrianguloCentralE8(p, pulsoTension);
}

function dibujarBrilloParticulaE8(x, y, rot, tam, ansiedad) {
  let ctx = drawingContext;
  dibujarTrianguloRotadoDirecto(ctx, x, y, rot, tam * 1.55, 90, 255, 175, (15 + ansiedad * 15) / 255);
  dibujarTrianguloRotadoDirecto(ctx, x, y, rot, tam * 1.25, 75, 235, 155, (30 + ansiedad * 20) / 255);
  dibujarTrianguloRotadoDirecto(ctx, x, y, rot, tam, 105, 235, 160, 230 / 255);
}

function dibujarTrianguloCentralE8(p, pulsoTension) {
  let velocidad = lerp(0.025, 0.14, p);
  let amplitud = lerp(2, 18, p);

  let x = Math.sin(frameCount * velocidad) * amplitud;
  x += Math.sin(frameCount * velocidad * 2.31) * amplitud * 0.35;
  let y = Math.cos(frameCount * velocidad * 0.83) * amplitud * 0.50;

  let respiracion = Math.sin(frameCount * lerp(0.035, 0.12, p));
  let tam = TAM_CENTRAL_E8 * (1.0 + respiracion * lerp(0.025, 0.075, p));
  tam *= (1.0 - pulsoTension * p * 0.10);

  if (interaccionValidaEstado()) {
    tam += Math.sin(frameCount * 0.7) * 7;
    x += random(-5, 5);
    y += random(-5, 5);
  }

  let rotacion = Math.sin(frameCount * velocidad * 0.55) * lerp(0.01, 0.085, p);

  if (p > 0.03) {
    let desplazamiento = lerp(0, 25, p);
    dibujarTrianguloFantasmaE8(x - desplazamiento, y, tam, rotacion, 45 * p);
    dibujarTrianguloFantasmaE8(x - desplazamiento * 0.55, y, tam, rotacion, 70 * p);
  }

  dibujarTrianguloGlowE8(x, y, tam, rotacion, p, 255);
}

function dibujarTrianguloGlowE8(x, y, tam, rotacion, ansiedad, alphaBase) {
  let ctx = drawingContext;
  dibujarTrianguloRotadoDirecto(ctx, x, y, rotacion, tam * 1.70, 90, 255, 175, (9 + ansiedad * 10) / 255);
  dibujarTrianguloRotadoDirecto(ctx, x, y, rotacion, tam * 1.42, 75, 235, 155, (14 + ansiedad * 13) / 255);
  dibujarTrianguloRotadoDirecto(ctx, x, y, rotacion, tam * 1.20, 65, 220, 145, (25 + ansiedad * 15) / 255);
  dibujarTrianguloRotadoDirecto(ctx, x, y, rotacion, tam, 105, 235, 160, alphaBase / 255);
}

function dibujarTrianguloFantasmaE8(x, y, tam, rotacion, alpha) {
  if (alpha <= 0) return;
  let ctx = drawingContext;
  dibujarTrianguloRotadoDirecto(ctx, x, y, rotacion, tam * 1.35, 105, 235, 160, (alpha * 0.18) / 255);
  dibujarTrianguloRotadoDirecto(ctx, x, y, rotacion, tam, 105, 235, 160, alpha / 255);
}

function suavizarE8(t) {
  t = constrain(t, 0, 1);
  return t * t * (3.0 - 2.0 * t);
}

// ============================================================
// ESTADO 9 — FUTURO / EXPECTATIVA (100% IDÉNTICO A ESTADO_9.PDE)
// ============================================================
const CANTIDAD_PARTICULAS_E9 = 100;
const RADIO_MIN_E9 = 115;
const RADIO_MAX_E9 = 920;
const TAM_CENTRAL_E9 = 256.25; // 205 * 1.25 (+25%)

const VELOCIDAD_INICIAL_E9 = 0.060;
const VELOCIDAD_MIN_GIRO_E9 = 0.018;
const ANGULO_LIMITE_E9 = (330 * Math.PI) / 180.0;

let velocidadGiroActualE9 = VELOCIDAD_INICIAL_E9;
let anguloParticulaE9 = new Float32Array(CANTIDAD_PARTICULAS_E9);
let radioParticulaE9 = new Float32Array(CANTIDAD_PARTICULAS_E9);
let velocidadOrbitaE9 = new Float32Array(CANTIDAD_PARTICULAS_E9);
let tamParticulaE9 = new Float32Array(CANTIDAD_PARTICULAS_E9);
let rotacionPropiaE9 = new Float32Array(CANTIDAD_PARTICULAS_E9);
let velocidadRotacionPropiaE9 = new Float32Array(CANTIDAD_PARTICULAS_E9);
let brilloParticulasE9 = new Float32Array(CANTIDAD_PARTICULAS_E9);

let rotacionCentralE9 = 0;
let activacionE9 = 0;
let enRetrocesoE9 = false;
let anguloObjetivoRetrocesoE9 = 0;
let progresoRetrocesoE9 = 0;
let estado9Inicializado = false;

function reiniciarEstado9() {
  rotacionCentralE9 = 0;
  activacionE9 = 0;
  enRetrocesoE9 = false;
  progresoRetrocesoE9 = 0;
  velocidadGiroActualE9 = VELOCIDAD_INICIAL_E9;

  for (let i = 0; i < CANTIDAD_PARTICULAS_E9; i++) {
    let anguloSector = (TWO_PI * i) / CANTIDAD_PARTICULAS_E9;
    anguloParticulaE9[i] = (anguloSector + random(-0.25, 0.25) + TWO_PI) % TWO_PI;
    radioParticulaE9[i] = random(115, 920);
    velocidadOrbitaE9[i] = random(0.0030, 0.0045);
    tamParticulaE9[i] = random(20, 30);
    rotacionPropiaE9[i] = random(TWO_PI);
    velocidadRotacionPropiaE9[i] = random(-0.055, 0.055);
    brilloParticulasE9[i] = 0;
  }
  estado9Inicializado = true;
}

function clickEstado9() {
  ultimaActividadEstado = millis();
}

function dibujarEstado9() {
  if (!estado9Inicializado) {
    reiniciarEstado9();
  }

  let clickMantenerE9 = interaccionValidaEstado();

  if (clickMantenerE9) {
    ultimaActividadEstado = millis();
  }

  let objetivo = clickMantenerE9 ? 1.0 : 0.0;
  activacionE9 = lerp(activacionE9, objetivo, 0.075);

  if (clickMantenerE9) {
    if (enRetrocesoE9) {
      progresoRetrocesoE9 += 0.07;
      rotacionCentralE9 = lerp(rotacionCentralE9, anguloObjetivoRetrocesoE9, 0.12);
      if (progresoRetrocesoE9 >= 1.0 || Math.abs(rotacionCentralE9 - anguloObjetivoRetrocesoE9) < 0.01) {
        enRetrocesoE9 = false;
      }
    } else {
      rotacionCentralE9 += velocidadGiroActualE9;
      if (rotacionCentralE9 >= ANGULO_LIMITE_E9) {
        enRetrocesoE9 = true;
        progresoRetrocesoE9 = 0;
        anguloObjetivoRetrocesoE9 = (random(180, 350) * Math.PI) / 180.0;
        velocidadGiroActualE9 = Math.max(velocidadGiroActualE9 * 0.75, VELOCIDAD_MIN_GIRO_E9);
      }
    }
  } else {
    enRetrocesoE9 = false;
    rotacionCentralE9 = lerp(rotacionCentralE9, 0, 0.1);
    velocidadGiroActualE9 = lerp(velocidadGiroActualE9, VELOCIDAD_INICIAL_E9, 0.05);
  }

  actualizarParticulasE9(activacionE9);
  dibujarTrianguloCentralE9(activacionE9);
}

function actualizarParticulasE9(p) {
  let direccionCentral = rotacionCentralE9 - HALF_PI;
  direccionCentral = Math.atan2(Math.sin(direccionCentral), Math.cos(direccionCentral));

  for (let i = 0; i < CANTIDAD_PARTICULAS_E9; i++) {
    anguloParticulaE9[i] += velocidadOrbitaE9[i];
    rotacionPropiaE9[i] += velocidadRotacionPropiaE9[i];

    let x = Math.cos(anguloParticulaE9[i]) * radioParticulaE9[i];
    let y = Math.sin(anguloParticulaE9[i]) * radioParticulaE9[i];

    let diferencia = Math.abs(diferenciaAngularE9(direccionCentral, anguloParticulaE9[i]));
    let anchoHaz = (25.0 * Math.PI) / 180.0;
    let impacto = 1.0 - constrain(diferencia / anchoHaz, 0, 1);
    impacto = Math.pow(impacto, 2.2);
    impacto *= lerp(0.70, 1.0, p);

    if (impacto > brilloParticulasE9[i]) {
      brilloParticulasE9[i] = lerp(brilloParticulasE9[i], impacto, 0.35);
    } else {
      brilloParticulasE9[i] *= 0.94;
    }
    brilloParticulasE9[i] = constrain(brilloParticulasE9[i], 0, 1);

    let brillo = brilloParticulasE9[i];
    let tamActual = tamParticulaE9[i] * (1.0 + brillo * 0.35);

    let ctx = drawingContext;
    let rCore = Math.round(lerp(105, 190, brillo));
    let gCore = Math.round(lerp(235, 255, brillo));
    let bCore = Math.round(lerp(160, 225, brillo));
    let aCore = lerp(210, 255, brillo) / 255;
    let rot = rotacionPropiaE9[i];

    dibujarTrianguloRotadoDirecto(ctx, x, y, rot, tamActual * (1.55 + brillo * 0.40), 90, 255, 175, (10 + brillo * 40) / 255);
    dibujarTrianguloRotadoDirecto(ctx, x, y, rot, tamActual * (1.34 + brillo * 0.25), 75, 235, 155, (16 + brillo * 50) / 255);
    dibujarTrianguloRotadoDirecto(ctx, x, y, rot, tamActual * (1.18 + brillo * 0.15), 65, 220, 145, (24 + brillo * 60) / 255);
    dibujarTrianguloRotadoDirecto(ctx, x, y, rot, tamActual, rCore, gCore, bCore, aCore);
  }
}

function dibujarTrianguloCentralE9(p) {
  let respiracion = 1.0 + Math.sin(frameCount * 0.025) * 0.04;
  let tam = TAM_CENTRAL_E9 * respiracion;
  let intensidadGlow = lerp(0.55, 1.0, p);
  let ctx = drawingContext;

  dibujarTrianguloRotadoDirecto(ctx, 0, 0, rotacionCentralE9, tam * lerp(1.55, 1.95, p), 75, 235, 155, (7 * intensidadGlow) / 255);
  dibujarTrianguloRotadoDirecto(ctx, 0, 0, rotacionCentralE9, tam * lerp(1.30, 1.55, p), 85, 245, 165, (17 * intensidadGlow) / 255);
  dibujarTrianguloRotadoDirecto(ctx, 0, 0, rotacionCentralE9, tam * 1.18, 95, 255, 175, (35 * intensidadGlow) / 255);
  dibujarTrianguloRotadoDirecto(ctx, 0, 0, rotacionCentralE9, tam, 105, 235, 160, 245 / 255);
}

function diferenciaAngularE9(a, b) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}
