// ============================================================
// NEON SYSTEM — WEB EDITION (p5.js)
// Port 1:1 idéntico al sistema Processing 4
// Mismas velocidades, tamaños, comportamientos y previews
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

// Gifs de personajes por estado (1..9)
let gifsEstados = new Array(10);
let mostrarGifEstado = false;
let tiempoInicioGif = 0;
const DURACION_GIF_ESTADO = 3000; // 3 segundos
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

// Control de interacción dentro de estados (retorno automático tras 8 segundos)
let ultimaActividadEstado = 0;
const TIEMPO_INACTIVIDAD_ESTADO = 8000;

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

  for (let i = 1; i <= 9; i++) {
    const numStr = i < 10 ? `0${i}` : `${i}`;
    loadImage(`data/${numStr}/gift ${numStr}.gif`,
      (img) => { gifsEstados[i] = img; },
      () => {}
    );
  }
}

// ============================================================
// SETUP
// ============================================================
function setup() {
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

  // Inicializar todas las partículas de preview con valores exactos
  inicializarPreviews();

  // Inicializar estados activos
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

// ============================================================
// INICIALIZACIÓN DE PREVIEWS EXACTOS (1:1 CON PROCESSING)
// ============================================================
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
    while (dist(previewX3[i], previewY3[i], 0, 0) < 78 + 40) {
      previewX3[i] = random(-600, 600);
      previewY3[i] = random(-350, 350);
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
    previewRadio5[i] = random(120, 500);
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
    // Control de inactividad: si pasan 8 segundos sin interacción, vuelve automáticamente al menú
    if (hayInteraccionActiva()) {
      ultimaActividadEstado = millis();
    } else if (millis() - ultimaActividadEstado >= TIEMPO_INACTIVIDAD_ESTADO) {
      volverAlMenu();
      return;
    }

    // Fondo negro idéntico a Processing
    background(0);

    // Dibujar el estado interactivo centrado
    push();
    translate(width / 2, height / 2);
    dibujarEstado(estado);
    pop();

    // Dibujar GIF animado del personaje si está activo
    dibujarGifEstado();
  }
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
}

function iniciarGifEstado(n) {
  estadoActualGif = n;
  mostrarGifEstado = true;
  tiempoInicioGif = millis();
}

function dibujarGifEstado() {
  if (!mostrarGifEstado || estadoActualGif < 1 || estadoActualGif > 9) return;

  const transcurrido = millis() - tiempoInicioGif;
  if (transcurrido > DURACION_GIF_ESTADO) {
    mostrarGifEstado = false;
    return;
  }

  const gif = gifsEstados[estadoActualGif];
  if (gif && gif.width > 0) {
    push();
    resetMatrix();

    noStroke();
    rectMode(CORNER);
    fill(0, 128); // 50%
    rect(0, 0, width, height);

    let maxW = width * 0.95;
    let maxH = height * 0.88;
    let w = gif.width * 2.0;
    let h = gif.height * 2.0;

    if (w > maxW || h > maxH) {
      let factor = min(maxW / w, maxH / h);
      w *= factor;
      h *= factor;
    }

    let yBase = height;
    translate(width / 2.0, yBase - h / 2.0);
    scale(-1.0, 1.0);

    imageMode(CENTER);
    image(gif, 0, 0, w, h);
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
    let escalaImg = Math.min(maxW / img.width, maxH / img.height);
    let wImg = img.width * escalaImg;
    let hImg = img.height * escalaImg;

    push();
    imageMode(CENTER);
    image(img, cx, cy, wImg, hImg);
    pop();
  }

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
// DIBUJAR MENÚ (EXACTO A PROCESSING 4)
// ============================================================

function dibujarMenu() {
  background(0);
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

      // Render de los previews exactos con su resolución nativa 1370x850
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

function touchStarted() {
  if (estado !== MENU) {
    interactuarEnEstado();
  }
  return false;
}

function mousePressed() {
  if (estado !== MENU) {
    interactuarEnEstado();
  }
}

function keyPressed() {
  if (keyCode === ESCAPE || key === 'm' || key === 'M') {
    if (estado !== MENU) volverAlMenu();
  } else if (key >= '1' && key <= '9') {
    entrarEstado(parseInt(key));
  }
}

function hayInteraccionActiva() {
  return mouseIsPressed || HandTracker.gestoActivo || HandTracker.activo;
}

// ============================================================
// ============================================================
// PREVIEWS EXACTOS DEL MENÚ (1:1 CON LOS .PDE DE PROCESSING)
// ============================================================
// ============================================================

// PREVIEW 1: RADAR CONCÉNTRICO VIOLETA
function dibujarPreviewEstado1(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  ellipseMode(CENTER);
  noStroke();

  let limiteX = (anchoCelda - 40) / 2.0;
  let limiteY = altoCelda / 2.0;

  push();
  translate(centroX, centroY);

  for (let anillo = 0; anillo < 10; anillo++) {
    let fase = (frameCount * 0.25 + anillo * 75) % 360;
    let radioMaxPrev = limiteX + 15;
    let radio = map(fase, 0, 360, 40, radioMaxPrev);
    let alphaAnillo = map(radio, 40, radioMaxPrev, 140, 50);
    let cantidadPuntos = 20;

    for (let i = 0; i < cantidadPuntos; i++) {
      let tamPunto = 25 + Math.sin(anillo * 30 + i * 15) * 5;
      let angulo = TWO_PI * i / cantidadPuntos;
      let px = Math.cos(angulo) * radio;
      let py = Math.sin(angulo) * radio;

      if (py - tamPunto / 2.0 <= -limiteY || py + tamPunto / 2.0 >= limiteY) continue;
      if (px - tamPunto / 2.0 <= -limiteX || px + tamPunto / 2.0 >= limiteX) continue;

      fill(139, 99, 199, alphaAnillo);
      ellipse(px, py, tamPunto, tamPunto);
    }
  }

  // Círculo central (+25%: 150 * 1.25 = 187.5)
  let pulso = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  fill(violeta);
  ellipse(0, 0, 187.5 * pulso, 187.5 * pulso);

  pop();
}

// PREVIEW 2: DERIVA RADIAL VIOLETA
function dibujarPreviewEstado2(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  ellipseMode(CENTER);
  noStroke();

  let maxDist = 650.0;
  let limiteX = (anchoCelda - 40) / 2.0;
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

    if (px < -limiteX || px > limiteX || py < -limiteY || py > limiteY) continue;

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

// PREVIEW 3: REBOTE VIOLETA
function dibujarPreviewEstado3(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  ellipseMode(CENTER);
  noStroke();

  let pulso = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  let radioSeguro = 78 * pulso + 15;

  push();
  translate(centroX, centroY);

  for (let i = 0; i < CANTIDAD_PARTICULAS_E3; i++) {
    let giro = Math.sin(frameCount * previewFrecuencia3[i] + previewFase3[i]) * 0.045;
    let nuevoVX = previewVX3[i] * Math.cos(giro) - previewVY3[i] * Math.sin(giro);
    let nuevoVY = previewVX3[i] * Math.sin(giro) + previewVY3[i] * Math.cos(giro);

    previewVX3[i] = lerp(previewVX3[i], nuevoVX, 0.10);
    previewVY3[i] = lerp(previewVY3[i], nuevoVY, 0.10);

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

    let limX = 640;
    let limY = 380;
    if (previewX3[i] < -limX) { previewX3[i] = -limX; previewVX3[i] = Math.abs(previewVX3[i]); }
    if (previewX3[i] > limX)  { previewX3[i] = limX;  previewVX3[i] = -Math.abs(previewVX3[i]); }
    if (previewY3[i] < -limY) { previewY3[i] = -limY; previewVY3[i] = Math.abs(previewVY3[i]); }
    if (previewY3[i] > limY)  { previewY3[i] = limY;  previewVY3[i] = -Math.abs(previewVY3[i]); }

    fill(139, 99, 199, 140);
    circle(previewX3[i], previewY3[i], previewTam3[i]);
  }

  // Círculo central (+25%: 150 * 1.25 = 187.5)
  fill(violeta);
  circle(0, 0, 187.5 * pulso);

  pop();
}

// PREVIEW 4: CUADRADOS ORTOGONALES AZULES
function dibujarPreviewEstado4(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  noStroke();

  push();
  translate(centroX, centroY);

  let pulso = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  let radioSeguro = 110.0 * pulso;
  let limX = 640;
  let limY = 380;
  let v = 1.0;

  for (let i = 0; i < CANTIDAD_PREVIEW_E4; i++) {
    if (previewDir4[i] === 0) previewX4[i] += v;
    else if (previewDir4[i] === 1) previewY4[i] += v;
    else if (previewDir4[i] === 2) previewX4[i] -= v;
    else if (previewDir4[i] === 3) previewY4[i] -= v;

    if (previewX4[i] >= limX) {
      previewX4[i] = limX;
      if (previewDir4[i] === 0) previewDir4[i] = random(1) < 0.5 ? 1 : 3;
    } else if (previewX4[i] <= -limX) {
      previewX4[i] = -limX;
      if (previewDir4[i] === 2) previewDir4[i] = random(1) < 0.5 ? 1 : 3;
    }

    if (previewY4[i] >= limY) {
      previewY4[i] = limY;
      if (previewDir4[i] === 1) previewDir4[i] = random(1) < 0.5 ? 0 : 2;
    } else if (previewY4[i] <= -limY) {
      previewY4[i] = -limY;
      if (previewDir4[i] === 3) previewDir4[i] = random(1) < 0.5 ? 0 : 2;
    }

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

    fill(baseParticulasAzul, 220);
    square(previewX4[i], previewY4[i], previewTam4[i]);
  }

  // Cuadrado central (+25%: 150 * 1.25 = 187.5)
  fill(baseCentroAzul);
  square(0, 0, 187.5 * pulso);

  pop();
}

// PREVIEW 5: CUADRADOS EN ANILLO AZUL
function dibujarPreviewEstado5(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  noStroke();

  let limiteX = (anchoCelda - 40) / 2.0;
  let limiteY = altoCelda / 2.0;

  push();
  translate(centroX, centroY);

  for (let i = 0; i < CANTIDAD_CUADRADOS5; i++) {
    previewAngulo5[i] += 0.0025;
    let r = previewRadio5[i] + Math.sin(frameCount * 0.016 + previewFase5[i]) * 15;
    let px = Math.cos(previewAngulo5[i]) * r;
    let py = Math.sin(previewAngulo5[i]) * r;

    if (px < -limiteX || px > limiteX || py < -limiteY || py > limiteY) continue;

    fill(baseParticulasAzul, 220);
    square(px, py, previewTam5[i]);
  }

  // Cuadrado central (+25%: 150 * 1.25 = 187.5)
  let pulsoPreview = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  fill(baseCentroAzul);
  square(0, 0, 187.5 * pulsoPreview);

  pop();
}

// PREVIEW 6: CUADRADOS OSCILANTES AZULES
function dibujarPreviewEstado6(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  noStroke();

  let limiteX = (anchoCelda - 40) / 2.0;
  let limiteY = altoCelda / 2.0;

  push();
  translate(centroX, centroY);

  for (let i = 0; i < CANTIDAD_CUADRADOS6; i++) {
    let offsetX = obtenerOffsetX6(previewFase6[i]);
    let offsetY = obtenerOffsetY6(previewFase6[i]);

    let px = previewBaseX6[i] + offsetX;
    let py = previewBaseY6[i] + offsetY;

    if (px < -limiteX || px > limiteX || py < -limiteY || py > limiteY) continue;

    fill(baseParticulasAzul, 220);
    square(px, py, previewTam6[i]);
  }

  // Cuadrado central (+25%: 150 * 1.25 = 187.5)
  let pulsoPreview = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  fill(baseCentroAzul);
  square(0, 0, 187.5 * pulsoPreview);

  pop();
}

function obtenerOffsetX6(fase) {
  let t = (frameCount * 1.0 + fase * 20) % 240;
  if (t < 60) return map(t, 0, 60, -30.0, 30.0);
  else if (t < 120) return 30.0;
  else if (t < 180) return map(t, 120, 180, 30.0, -30.0);
  else return -30.0;
}

function obtenerOffsetY6(fase) {
  let t = (frameCount * 1.0 + fase * 20) % 240;
  if (t < 60) return -30.0;
  else if (t < 120) return map(t, 60, 120, -30.0, 30.0);
  else if (t < 180) return 30.0;
  else return map(t, 180, 240, 30.0, -30.0);
}

// PREVIEW 7: TRIÁNGULOS VERDES GIRATORIOS
function dibujarPreviewEstado7(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  noStroke();

  let limiteX = (anchoCelda - 40) / 2.0;
  let limiteY = altoCelda / 2.0;

  push();
  translate(centroX, centroY);

  for (let i = 0; i < CANTIDAD_PARTICULAS_E7; i++) {
    let movX = previewBaseX7[i] + Math.sin(frameCount * 0.042 + previewFase7[i]) * 40;
    let movY = previewBaseY7[i] + Math.cos(frameCount * 0.038 + previewFase7[i]) * 36;
    previewRotacion7[i] += 0.030;

    if (movX < -limiteX || movX > limiteX || movY < -limiteY || movY > limiteY) continue;

    push();
    translate(movX, movY);
    rotate(previewRotacion7[i]);
    fill(verdeTriangulos, 190);
    trianguloEquilatero(previewTam7[i]);
    pop();
  }

  // Triángulo central (+25%: 220 * 1.25 = 275)
  let pulsoPreview = 1.0 + Math.sin(frameCount * 0.09) * 0.09;
  push();
  scale(pulsoPreview);
  fill(verdeTriangulos, 230);
  trianguloEquilatero(275);
  pop();

  pop();
}

// PREVIEW 8: TRIÁNGULOS VERDES EN VAIVÉN
function dibujarPreviewEstado8(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  noStroke();

  let limiteX = (anchoCelda - 40) / 2.0;
  let limiteY = altoCelda / 2.0;

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

    if (movX < -limiteX || movX > limiteX || movY < -limiteY || movY > limiteY) continue;

    push();
    translate(movX, movY);
    rotate(previewRotacion8[i]);
    fill(verdeTriangulos, 190);
    trianguloEquilatero(previewTam8[i]);
    pop();
  }

  // Triángulo central (+25%: 215 * 1.25 = 268.75)
  let pulsoPreview = 1.0 + Math.sin(frameCount * 0.09) * 0.09;
  push();
  scale(pulsoPreview);
  fill(verdeTriangulos, 230);
  trianguloEquilatero(268.75);
  pop();

  pop();
}

// PREVIEW 9: TRIÁNGULOS VERDES EN CAPAS MULTICAPA
function dibujarPreviewEstado9(centroX, centroY, anchoCelda, altoCelda) {
  rectMode(CENTER);
  noStroke();

  let limiteX = (anchoCelda - 40) / 2.0;
  let limiteY = altoCelda / 2.0;

  push();
  translate(centroX, centroY);

  for (let i = 0; i < CANTIDAD_PREVIEW_E9; i++) {
    let anguloPrev = previewBaseAngulo9[i] + frameCount * 0.0038;
    previewRotacionPropia9[i] += 0.030;
    let x = Math.cos(anguloPrev) * previewBaseRadio9[i];
    let y = Math.sin(anguloPrev) * previewBaseRadio9[i];

    if (x < -limiteX || x > limiteX || y < -limiteY || y > limiteY) continue;

    push();
    translate(x, y);
    rotate(previewRotacionPropia9[i]);
    fill(90, 255, 175, 10);
    trianguloEquilatero(previewTamParticula9[i] * 1.55);
    fill(75, 235, 155, 16);
    trianguloEquilatero(previewTamParticula9[i] * 1.34);
    fill(65, 220, 145, 24);
    trianguloEquilatero(previewTamParticula9[i] * 1.18);
    fill(verdeTriangulos, 210);
    trianguloEquilatero(previewTamParticula9[i]);
    pop();
  }

  // Triángulo central (+25%: 205 * 1.25 = 256.25)
  let respiracion = 1.0 + Math.sin(frameCount * 0.09) * 0.08;
  push();
  scale(respiracion);
  fill(verdeTriangulos, 230);
  trianguloEquilatero(256.25);
  pop();

  pop();
}

function trianguloEquilatero(tam) {
  let h = tam * 0.866;
  triangle(0, -h * 0.67, -tam * 0.5, h * 0.33, tam * 0.5, h * 0.33);
}

// ============================================================
// ============================================================
// IMPLEMENTACIÓN DE LOS 9 ESTADOS ACTIVOS (PANTALLA COMPLETA)
// ============================================================
// ============================================================

let huellasEstado1 = [];
let particulasEstado2 = [];
let gruposVisualesEstado2 = [];
let particulasEstado3 = [];
let manchasEstado3 = [];
let hormigasActivasE3 = 0;
let cuadradosEstado4 = [];
let cuadradosEstado5 = [];
let union5 = 0;
let cuadradosEstado6 = [];
let union6 = 0;
let particulasEstado7 = [];
let incertidumbreClic7 = 0;
let particulasEstado8 = [];
let activacionE8 = 0;
let particulasEstado9 = [];
let rotacionCentralE9 = 0;

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

function interactuarEnEstado() {
  ultimaActividadEstado = millis();
  if (estado === 1) clickEstado1();
  if (estado === 3) clickEstado3();
  if (estado === 7) incertidumbreClic7 = 1.0;
  if (estado === 8) activacionE8 = 1.0;
  if (estado === 9) clickEstado9();
}

// ------------------------------------------------------------
// ESTADO 1: RADAR Y HUELLAS (PULSOS CON VELOCIDAD 0.25)
// ------------------------------------------------------------
function reiniciarEstado1() {
  huellasEstado1 = [];
}

function clickEstado1() {
  let hx = mouseIsPressed ? mouseX - width / 2 : (HandTracker.manoX - 0.5) * width;
  let hy = mouseIsPressed ? mouseY - height / 2 : (HandTracker.manoY - 0.5) * height;
  huellasEstado1.push({ x: hx, y: hy, frameInicio: frameCount, alpha: 255 });
}

function dibujarEstado1() {
  if (hayInteraccionActiva() && frameCount % 60 === 0) {
    clickEstado1();
  }

  push();
  noStroke();

  // Radar central base
  for (let anillo = 0; anillo < 10; anillo++) {
    let fase = (frameCount * 0.25 + anillo * 75) % 360;
    let radio = map(fase, 0, 360, 40, width / 2.0);
    let alphaAnillo = map(radio, 40, width / 2.0, 140, 20);
    let cantidadPuntos = 20;

    for (let i = 0; i < cantidadPuntos; i++) {
      let tamPunto = 25 + Math.sin(anillo * 30 + i * 15) * 5;
      let angulo = TWO_PI * i / cantidadPuntos;
      let px = Math.cos(angulo) * radio;
      let py = Math.sin(angulo) * radio;

      let absX = px + width / 2;
      let absY = py + height / 2;
      if (absX <= 0 || absX >= width || absY <= 0 || absY >= height) continue;

      fill(139, 99, 199, alphaAnillo);
      ellipse(px, py, tamPunto, tamPunto);
    }
  }

  // Huellas activas
  for (let h = huellasEstado1.length - 1; h >= 0; h--) {
    let huella = huellasEstado1[h];
    huella.alpha -= 0.09;

    for (let anillo = 0; anillo < 10; anillo++) {
      let fase = ((frameCount - huella.frameInicio) * 0.25 + anillo * 75) % 360;
      let radio = map(fase, 0, 360, 40, width / 2.0);
      let alphaAnillo = map(radio, 40, width / 2.0, huella.alpha, 0);
      let cantidadPuntos = 20;

      for (let i = 0; i < cantidadPuntos; i++) {
        let tamPunto = 25 + Math.sin(anillo * 30 + i * 15) * 5;
        let angulo = TWO_PI * i / cantidadPuntos;
        let px = huella.x + Math.cos(angulo) * radio;
        let py = huella.y + Math.sin(angulo) * radio;

        let absX = px + width / 2;
        let absY = py + height / 2;
        if (absX <= 0 || absX >= width || absY <= 0 || absY >= height) continue;

        fill(139, 99, 199, alphaAnillo);
        ellipse(px, py, tamPunto, tamPunto);
      }
    }

    if (huella.alpha <= 20) {
      huellasEstado1.splice(h, 1);
    }
  }

  // Círculo central (+25%: 150 * 1.25 = 187.5)
  let pulso = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  fill(violeta);
  ellipse(0, 0, 187.5 * pulso, 187.5 * pulso);
  pop();
}

// ------------------------------------------------------------
// ESTADO 2: ÓRBITAS Y CONCENTRICOS (VELOCIDAD 0.50)
// ------------------------------------------------------------
function reiniciarEstado2() {
  particulasEstado2 = [];
  for (let i = 0; i < 64; i++) {
    particulasEstado2.push({
      ang: random(TWO_PI),
      dist: random(0, 650.0),
      vel: 0.50 * random(0.85, 1.15),
      fase: random(TWO_PI),
      tam: random(20, 35)
    });
  }
}

function dibujarEstado2() {
  push();
  noStroke();

  for (let p of particulasEstado2) {
    p.dist += p.vel;
    if (p.dist > 650.0) {
      p.dist = random(0, 30);
      p.ang = random(TWO_PI);
      p.vel = 0.50 * random(0.85, 1.15);
      p.tam = random(20, 35);
    }

    let onda = Math.sin(frameCount * 0.010 + p.fase) * 8 * (p.dist / 650.0);
    let px = Math.cos(p.ang) * p.dist - Math.sin(p.ang) * onda;
    let py = Math.sin(p.ang) * p.dist + Math.cos(p.ang) * onda;

    let alphaPart = 140;
    if (p.dist < 80) alphaPart = map(p.dist, 0, 80, 0, 140);
    else if (p.dist > 550) alphaPart = map(p.dist, 550, 650, 140, 0);

    fill(139, 99, 199, alphaPart);
    circle(px, py, p.tam);
  }

  // Círculo central (+25%: 150 * 1.25 = 187.5)
  let pulso = 1.0 + Math.sin(frameCount * 0.025) * 0.04;
  fill(violeta);
  circle(0, 0, 187.5 * pulso);
  pop();
}

// ------------------------------------------------------------
// ESTADO 3: FRUTA Y HORMIGAS (REBOTES Y MANCHAS)
// ------------------------------------------------------------
function reiniciarEstado3() {
  particulasEstado3 = [];
  manchasEstado3 = [];
  for (let i = 0; i < 64; i++) {
    let ang = random(TWO_PI);
    let vel = random(0.45, 0.55);
    particulasEstado3.push({
      x: random(-width / 2 + 50, width / 2 - 50),
      y: random(-height / 2 + 50, height / 2 - 50),
      vx: Math.cos(ang) * vel,
      vy: Math.sin(ang) * vel,
      fase: random(TWO_PI),
      frecuencia: random(0.008, 0.020),
      tam: random(20, 35)
    });
  }
}

function clickEstado3() {
  // Crear manchas al interactuar
  for (let i = 0; i < 6; i++) {
    manchasEstado3.push({
      x: random(-250, 250),
      y: random(-200, 200),
      tam: random(30, 60),
      alpha: 100
    });
  }
}

function dibujarEstado3() {
  push();
  noStroke();

  // Dibujar manchas acumuladas
  for (let m = manchasEstado3.length - 1; m >= 0; m--) {
    let mancha = manchasEstado3[m];
    mancha.alpha -= 0.1;
    fill(139, 99, 199, mancha.alpha);
    circle(mancha.x, mancha.y, mancha.tam);
    if (mancha.alpha <= 0) manchasEstado3.splice(m, 1);
  }

  let pulso = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  let radioSeguro = 78 * pulso + 15;

  for (let p of particulasEstado3) {
    let giro = Math.sin(frameCount * p.frecuencia + p.fase) * 0.045;
    let nvx = p.vx * Math.cos(giro) - p.vy * Math.sin(giro);
    let nvy = p.vx * Math.sin(giro) + p.vy * Math.cos(giro);
    p.vx = lerp(p.vx, nvx, 0.10);
    p.vy = lerp(p.vy, nvy, 0.10);

    p.x += p.vx;
    p.y += p.vy;

    let d = dist(p.x, p.y, 0, 0);
    if (d < radioSeguro) {
      let rep = Math.atan2(p.y, p.x);
      p.x = Math.cos(rep) * radioSeguro;
      p.y = Math.sin(rep) * radioSeguro;
      let vel = dist(0, 0, p.vx, p.vy);
      let nAng = rep + random(-0.2, 0.2);
      p.vx = Math.cos(nAng) * vel;
      p.vy = Math.sin(nAng) * vel;
    }

    let limX = width / 2 - 40;
    let limY = height / 2 - 40;
    if (p.x < -limX) { p.x = -limX; p.vx = Math.abs(p.vx); }
    if (p.x > limX)  { p.x = limX;  p.vx = -Math.abs(p.vx); }
    if (p.y < -limY) { p.y = -limY; p.vy = Math.abs(p.vy); }
    if (p.y > limY)  { p.y = limY;  p.vy = -Math.abs(p.vy); }

    fill(139, 99, 199, 160);
    circle(p.x, p.y, p.tam);
  }

  // Círculo central violeta (+25%: 150 * 1.25 = 187.5)
  fill(violeta);
  circle(0, 0, 187.5 * pulso);
  pop();
}

// ------------------------------------------------------------
// ESTADO 4: IDENTIDAD (CUADRADOS ORTOGONALES)
// ------------------------------------------------------------
function reiniciarEstado4() {
  cuadradosEstado4 = [];
  for (let i = 0; i < 40; i++) {
    cuadradosEstado4.push({
      x: random(-width / 2 + 80, width / 2 - 80),
      y: random(-height / 2 + 80, height / 2 - 80),
      dir: Math.floor(random(4)),
      contador: 0,
      cambio: Math.floor(random(40, 150)),
      tam: random(20, 32)
    });
  }
}

function dibujarEstado4() {
  push();
  rectMode(CENTER);
  noStroke();

  let pulso = 1.0 + Math.sin(frameCount * 0.025) * 0.05;
  let radioSeguro = 110.0 * pulso;
  let limX = width / 2 - 60;
  let limY = height / 2 - 60;
  let v = 1.0;

  for (let c of cuadradosEstado4) {
    if (c.dir === 0) c.x += v;
    else if (c.dir === 1) c.y += v;
    else if (c.dir === 2) c.x -= v;
    else if (c.dir === 3) c.y -= v;

    if (c.x >= limX) { c.x = limX; c.dir = random(1) < 0.5 ? 1 : 3; }
    else if (c.x <= -limX) { c.x = -limX; c.dir = random(1) < 0.5 ? 1 : 3; }
    if (c.y >= limY) { c.y = limY; c.dir = random(1) < 0.5 ? 0 : 2; }
    else if (c.y <= -limY) { c.y = -limY; c.dir = random(1) < 0.5 ? 0 : 2; }

    let d = dist(c.x, c.y, 0, 0);
    if (d < radioSeguro) {
      let ang = Math.atan2(c.y, c.x);
      c.x = Math.cos(ang) * radioSeguro;
      c.y = Math.sin(ang) * radioSeguro;
      c.dir = Math.floor(random(4));
      c.contador = 0;
    }

    c.contador++;
    if (c.contador >= c.cambio) {
      c.contador = 0;
      c.cambio = Math.floor(random(40, 150));
      c.dir = (c.dir === 0 || c.dir === 2) ? (random(1) < 0.5 ? 1 : 3) : (random(1) < 0.5 ? 0 : 2);
    }

    fill(baseParticulasAzul, 220);
    square(c.x, c.y, c.tam);
  }

  // Cuadrado central (+25%: 150 * 1.25 = 187.5)
  fill(baseCentroAzul);
  square(0, 0, 187.5 * pulso);
  pop();
}

// ------------------------------------------------------------
// ESTADO 5: EMPATÍA (80 CUADRADOS EN MARCO AZUL)
// ------------------------------------------------------------
function reiniciarEstado5() {
  cuadradosEstado5 = [];
  union5 = 0;
  for (let i = 0; i < 80; i++) {
    cuadradosEstado5.push({
      ang: random(TWO_PI),
      radio: random(150, 420),
      tam: random(20, 35),
      vel: 0.0025,
      fase: random(TWO_PI),
      deriva: random(TWO_PI)
    });
  }
}

function dibujarEstado5() {
  push();
  rectMode(CENTER);
  noStroke();

  let hayInteraccion = hayInteraccionActiva();
  if (hayInteraccion) {
    union5 = lerp(union5, 1.0, 0.008);
  } else {
    union5 = lerp(union5, 0.0, 0.010);
  }

  let pulso = 1.0 + Math.sin(frameCount * 0.025) * 0.05;

  for (let i = 0; i < cuadradosEstado5.length; i++) {
    let c = cuadradosEstado5[i];
    c.ang += c.vel;
    let r = c.radio + Math.sin(frameCount * 0.016 + c.fase) * 15;
    let px = Math.cos(c.ang) * r;
    let py = Math.sin(c.ang) * r;

    // Si se activa, convergen hacia el marco central
    if (union5 > 0.01) {
      let angMarco = i * (TWO_PI / 80);
      let marcoX = Math.cos(angMarco) * (190 * pulso);
      let marcoY = Math.sin(angMarco) * (190 * pulso);
      px = lerp(px, marcoX, union5);
      py = lerp(py, marcoY, union5);
    }

    let colorActual = lerpColor(baseParticulasAzul, destacadoAzul, union5 * 0.6);
    fill(colorActual, 220);
    square(px, py, c.tam);
  }

  // Cuadrado central (+25%: 150 * 1.25 = 187.5)
  fill(baseCentroAzul);
  square(0, 0, 187.5 * pulso);
  pop();
}

// ------------------------------------------------------------
// ESTADO 6: COLABORACIÓN (DOBLE MARCO INTERCONECTADO)
// ------------------------------------------------------------
function reiniciarEstado6() {
  cuadradosEstado6 = [];
  union6 = 0;
  for (let i = 0; i < 64; i++) {
    cuadradosEstado6.push({
      bx: random(-width / 2 + 80, width / 2 - 80),
      by: random(-height / 2 + 80, height / 2 - 80),
      fase: random(TWO_PI),
      tam: random(20, 35)
    });
  }
}

function dibujarEstado6() {
  push();
  rectMode(CENTER);
  noStroke();

  let hayInteraccion = hayInteraccionActiva();
  if (hayInteraccion) {
    union6 = lerp(union6, 1.0, 0.008);
  } else {
    union6 = lerp(union6, 0.0, 0.010);
  }

  let pulso = 1.0 + Math.sin(frameCount * 0.025) * 0.05;

  for (let i = 0; i < cuadradosEstado6.length; i++) {
    let c = cuadradosEstado6[i];
    let ox = obtenerOffsetX6(c.fase);
    let oy = obtenerOffsetY6(c.fase);
    let px = c.bx + ox;
    let py = c.by + oy;

    if (union6 > 0.01) {
      let angDoble = i * (TWO_PI / 64);
      let dX = Math.cos(angDoble) * (220 * pulso);
      let dY = Math.sin(angDoble) * (220 * pulso);
      px = lerp(px, dX, union6);
      py = lerp(py, dY, union6);
    }

    let colorActual = lerpColor(baseParticulasAzul, destacadoAzul, union6 * 0.5);
    fill(colorActual, 220);
    square(px, py, c.tam);
  }

  // Cuadrado central (+25%: 150 * 1.25 = 187.5)
  fill(baseCentroAzul);
  square(0, 0, 187.5 * pulso);
  pop();
}

// ------------------------------------------------------------
// ESTADO 7: FUTURO / INCERTIDUMBRE (TRIÁNGULOS VERDES)
// ------------------------------------------------------------
function reiniciarEstado7() {
  particulasEstado7 = [];
  incertidumbreClic7 = 0;
  for (let i = 0; i < 64; i++) {
    particulasEstado7.push({
      bx: random(-width / 2 + 80, width / 2 - 80),
      by: random(-height / 2 + 80, height / 2 - 80),
      fase: random(TWO_PI),
      tam: random(20, 30),
      rot: random(TWO_PI)
    });
  }
}

function dibujarEstado7() {
  if (incertidumbreClic7 > 0) incertidumbreClic7 -= 0.015;
  push();
  noStroke();

  for (let p of particulasEstado7) {
    let movX = p.bx + Math.sin(frameCount * 0.042 + p.fase) * 40;
    let movY = p.by + Math.cos(frameCount * 0.038 + p.fase) * 36;
    p.rot += 0.030;

    push();
    translate(movX, movY);
    rotate(p.rot);
    fill(verdeTriangulos, 190);
    trianguloEquilatero(p.tam);
    pop();
  }

  // Triángulo central (+25%: 220 * 1.25 = 275)
  let pulso = 1.0 + Math.sin(frameCount * 0.09) * 0.09;
  push();
  scale(pulso);
  fill(verdeTriangulos, 230);
  trianguloEquilatero(275);
  pop();

  pop();
}

// ------------------------------------------------------------
// ESTADO 8: FUTURO / ANSIEDAD (VAIVÉN Y LÍNEAS NERVIOSAS)
// ------------------------------------------------------------
function reiniciarEstado8() {
  particulasEstado8 = [];
  activacionE8 = 0;
  for (let i = 0; i < 84; i++) {
    particulasEstado8.push({
      bx: random(-width / 2 + 80, width / 2 - 80),
      by: random(-height / 2 + 80, height / 2 - 80),
      fase: random(TWO_PI),
      tam: random(20, 30),
      rot: random(TWO_PI)
    });
  }
}

function dibujarEstado8() {
  if (activacionE8 > 0) activacionE8 -= 0.015;
  push();
  noStroke();

  for (let p of particulasEstado8) {
    let factorProgreso = (Math.sin(frameCount * 0.022 + p.fase) + 1.0) / 2.0;
    p.rot += 0.030;

    let iniX = p.bx - 75;
    let iniY = p.by - 75;
    let fnX = p.bx + 75;
    let fnY = p.by + 75;

    let movX = lerp(iniX, fnX, factorProgreso);
    let movY = lerp(iniY, fnY, factorProgreso);

    push();
    translate(movX, movY);
    rotate(p.rot);
    fill(verdeTriangulos, 190);
    trianguloEquilatero(p.tam);
    pop();
  }

  // Triángulo central (+25%: 165 * 1.25 = 206.25)
  let pulso = 1.0 + Math.sin(frameCount * 0.09) * 0.09;
  push();
  scale(pulso);
  fill(verdeTriangulos, 230);
  trianguloEquilatero(206.25);
  pop();

  pop();
}

// ------------------------------------------------------------
// ESTADO 9: FUTURO / EXPECTATIVA (ÓRBITAS DINÁMICAS)
// ------------------------------------------------------------
function reiniciarEstado9() {
  particulasEstado9 = [];
  rotacionCentralE9 = 0;
  for (let i = 0; i < 100; i++) {
    let anguloSector = TWO_PI * i / 100;
    particulasEstado9.push({
      ang: (anguloSector + random(-0.25, 0.25) + TWO_PI) % TWO_PI,
      radio: random(115, 920),
      tam: random(20, 30),
      rot: random(TWO_PI)
    });
  }
}

function clickEstado9() {
  rotacionCentralE9 += PI / 4;
}

function dibujarEstado9() {
  rotacionCentralE9 += 0.0038;
  push();
  noStroke();

  for (let p of particulasEstado9) {
    let angulo = p.ang + rotacionCentralE9;
    p.rot += 0.030;
    let x = Math.cos(angulo) * p.radio;
    let y = Math.sin(angulo) * p.radio;

    push();
    translate(x, y);
    rotate(p.rot);
    fill(90, 255, 175, 10);
    trianguloEquilatero(p.tam * 1.55);
    fill(75, 235, 155, 16);
    trianguloEquilatero(p.tam * 1.34);
    fill(65, 220, 145, 24);
    trianguloEquilatero(p.tam * 1.18);
    fill(verdeTriangulos, 210);
    trianguloEquilatero(p.tam);
    pop();
  }

  // Triángulo central (+25%: 205 * 1.25 = 256.25)
  let respiracion = 1.0 + Math.sin(frameCount * 0.09) * 0.08;
  push();
  scale(respiracion);
  fill(verdeTriangulos, 230);
  trianguloEquilatero(256.25);
  pop();

  pop();
}
