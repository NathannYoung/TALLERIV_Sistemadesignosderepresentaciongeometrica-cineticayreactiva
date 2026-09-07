// ============================================================
// NEON SYSTEM — WEB EDITION (p5.js)
// Port completo de los 9 Estados, Menú, Tutorial y Gestos
// ============================================================

const MENU = 0;
let estado = MENU;
let estadoAnterior = MENU;

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

// Control de interacción dentro de estados
let ultimoGestoTiempo = 0;
let ultimaActividadEstado = 0;
const TIEMPO_INACTIVIDAD_ESTADO = 8000; // 8 segundos sin interacción para volver automáticamente al menú

// ============================================================
// PRELOAD
// ============================================================
function preload() {
  // Cargar sonido con fallback seguro
  try {
    soundFormats('mp3', 'ogg');
    sonidoEstado = loadSound('data/elegir.mp3', 
      () => console.log("[✓] Audio data/elegir.mp3 cargado"),
      (err) => console.warn("[!] No se pudo cargar audio (opcional):", err)
    );
  } catch (e) {
    console.warn("p5.sound no disponible o audio bloqueado:", e);
  }

  // Cargar las 12 imágenes del tutorial
  for (let i = 1; i <= 12; i++) {
    loadImage(`data/TUTORIAL/${i}.png`, 
      (img) => { imagenesTutorial[i] = img; tutorialCargado = true; },
      () => { /* imagen opcional si no existe */ }
    );
  }

  // Cargar los 9 GIFs animados de los estados
  for (let i = 1; i <= 9; i++) {
    const numStr = i < 10 ? `0${i}` : `${i}`;
    loadImage(`data/${numStr}/gift ${numStr}.gif`,
      (img) => { gifsEstados[i] = img; },
      () => { /* fallback si falta gif */ }
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

  // Inicializar estados
  inicializarEstado1();
  inicializarEstado2();
  inicializarEstado3();
  inicializarEstado4();
  inicializarEstado5();
  inicializarEstado6();
  inicializarEstado7();
  inicializarEstado8();
  inicializarEstado9();
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

    // Dibujar fondo del estado
    background(coloresEncendido[estado] || color(0));

    // Dibujar el estado interactivo
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

  // Reproducir sonido de transición
  if (sonidoEstado && sonidoEstado.isLoaded()) {
    try { sonidoEstado.play(); } catch (e) {}
  }

  // Activar GIF inicial del estado
  iniciarGifEstado(n);

  // Reiniciar variables del estado
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

    // 1. Pantalla negra de fondo al 50% de opacidad
    noStroke();
    rectMode(CORNER);
    fill(0, 128); // 50%
    rect(0, 0, width, height);

    // 2. Escalar adaptativamente al tamaño de pantalla
    let maxW = width * 0.95;
    let maxH = height * 0.88;
    let w = gif.width * 2.0;
    let h = gif.height * 2.0;

    if (w > maxW || h > maxH) {
      let factor = min(maxW / w, maxH / h);
      w *= factor;
      h *= factor;
    }

    // 3. Apoyar sobre la base inferior de la pantalla
    let yBase = height;

    // Modo espejo horizontal
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

  // Verificar si hay interacción activa (mano o mouse)
  let hayInteraccion = mouseIsPressed || HandTracker.activo;
  if (hayInteraccion) {
    tiempoInactividadMenu = millis();
    if (secuenciaSectoresMenuActiva) {
      secuenciaSectoresMenuActiva = false;
    }
    return;
  }

  if (!secuenciaSectoresMenuActiva) {
    // 1. Al inicio o volver al menú: espera 10s de inactividad
    if (!tutorialMostradoEnMenuActual) {
      if (millis() - tiempoInactividadMenu >= 10000) {
        secuenciaSectoresMenuActiva = true;
        inicioSecuenciaSectores = millis();
        estadoActualDemoMenu = 1;
        tutorialMostradoEnMenuActual = true;
      }
      return;
    }

    // 2. Si ya se mostró, repetir cada 45s de inactividad
    if (millis() - tiempoInactividadMenu >= 45000) {
      secuenciaSectoresMenuActiva = true;
      inicioSecuenciaSectores = millis();
      estadoActualDemoMenu = 1;
    }
  } else {
    // Recorrido único de 1 a 9 durante 12 segundos
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

  // 0. Fondo negro al 50% sobre toda la pantalla
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

  // Grupo de 4 imágenes
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

  // Dibujar imagen centrada en altura en el tercio respectivo
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

  // Rectángulo progresivo alrededor del sector
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
// DIBUJAR MENÚ Y PREVIEWS DE CADA ESTADO
// ============================================================

function dibujarMenu() {
  let numero = 1;

  for (let fila = 0; fila < 3; fila++) {
    for (let col = 0; col < 3; col++) {
      let x = margen + col * (celdaW + margen);
      let y = margen + fila * (celdaH + margen);

      push();
      translate(x + celdaW / 2, y + celdaH / 2);
      let escala = Math.min(celdaW, celdaH) / 850.0;
      scale(escala);

      // Dibujar preview del estado
      switch (numero) {
        case 1: dibujarPreviewEstado1(); break;
        case 2: dibujarPreviewEstado2(); break;
        case 3: dibujarPreviewEstado3(); break;
        case 4: dibujarPreviewEstado4(); break;
        case 5: dibujarPreviewEstado5(); break;
        case 6: dibujarPreviewEstado6(); break;
        case 7: dibujarPreviewEstado7(); break;
        case 8: dibujarPreviewEstado8(); break;
        case 9: dibujarPreviewEstado9(); break;
      }
      pop();

      numero++;
    }
  }

  // Si está corriendo el tutorial demo
  if (secuenciaSectoresMenuActiva) {
    dibujarMarcoSectorMenu(estadoActualDemoMenu, progresoActualDemoMenu);
    return;
  }

  // Hover visual (por mano o ratón)
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

  // Dibujar recuadro de hover
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

  // Progreso de selección por mano (abierta durante 2s)
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
  // Brillo exterior cian
  stroke(0, 220, 255, 120);
  strokeWeight(6);
  drawProgress(x, y, w, h, recorrido);

  // Línea interior brillante
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
// IMPLEMENTACIÓN DE LOS 9 ESTADOS
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
let huellasEstado1 = [];
const CANTIDAD_PARTICULAS_E1 = 64;
let previewFase1 = new Float32Array(CANTIDAD_PARTICULAS_E1);
let previewTam1 = new Float32Array(CANTIDAD_PARTICULAS_E1);

function inicializarEstado1() {
  for (let i = 0; i < CANTIDAD_PARTICULAS_E1; i++) {
    previewFase1[i] = random(TWO_PI);
    previewTam1[i] = random(16, 28);
  }
}

function reiniciarEstado1() {
  huellasEstado1 = [];
}

function clickEstado1() {
  let hx = mouseIsPressed ? mouseX - width / 2 : (HandTracker.manoX - 0.5) * width;
  let hy = mouseIsPressed ? mouseY - height / 2 : (HandTracker.manoY - 0.5) * height;
  huellasEstado1.push({ x: hx, y: hy, radio: 10, alpha: 255 });
}

function dibujarEstado1() {
  // Disparo periódico si la mano o click está activo
  if (hayInteraccionActiva() && frameCount % 60 === 0) {
    clickEstado1();
  }

  push();
  noFill();

  // Dibujar y actualizar huellas / ondas expansivas
  for (let i = huellasEstado1.length - 1; i >= 0; i--) {
    let h = huellasEstado1[i];
    h.radio += 0.25 * 6.0; // Velocidad 0.25
    h.alpha -= 0.6;

    stroke(139, 99, 199, h.alpha);
    strokeWeight(2);
    ellipse(h.x, h.y, h.radio * 2, h.radio * 2);

    // Partículas a lo largo de la circunferencia
    let numPuntos = 12;
    for (let p = 0; p < numPuntos; p++) {
      let ang = (TWO_PI / numPuntos) * p;
      let px = h.x + Math.cos(ang) * h.radio;
      let py = h.y + Math.sin(ang) * h.radio;

      // Desaparecen en los bordes
      let absX = px + width / 2;
      let absY = py + height / 2;
      if (absX >= 0 && absX <= width && absY >= 0 && absY <= height) {
        fill(180, 140, 240, h.alpha);
        noStroke();
        ellipse(px, py, 6, 6);
      }
    }

    if (h.alpha <= 0 || h.radio > width) {
      huellasEstado1.splice(i, 1);
    }
  }
  pop();
}

function dibujarPreviewEstado1() {
  push();
  noFill();
  stroke(139, 99, 199, 140);
  strokeWeight(2);
  ellipse(0, 0, 160, 160);
  ellipse(0, 0, 320, 320);

  let t = millis() * 0.001;
  for (let i = 0; i < CANTIDAD_PARTICULAS_E1; i++) {
    let ang = (TWO_PI / CANTIDAD_PARTICULAS_E1) * i;
    let r = 160 + Math.sin(t * 0.5 + previewFase1[i]) * 40;
    let px = Math.cos(ang) * r;
    let py = Math.sin(ang) * r;
    fill(139, 99, 199, 180);
    noStroke();
    ellipse(px, py, previewTam1[i] * 0.5, previewTam1[i] * 0.5);
  }
  pop();
}

// ------------------------------------------------------------
// ESTADO 2: ÓRBITAS Y CONCENTRICOS (VELOCIDAD 0.50)
// ------------------------------------------------------------
const CANTIDAD_PREVIEW_E2 = 64;
let anguloE2 = 0;

function inicializarEstado2() {}
function reiniciarEstado2() { anguloE2 = 0; }

function dibujarEstado2() {
  anguloE2 += 0.008;
  push();
  noFill();
  for (let r = 80; r <= 420; r += 70) {
    stroke(70, 35, 85, 120);
    strokeWeight(1.5);
    ellipse(0, 0, r * 2, r * 2);

    let cant = Math.floor(r / 20);
    for (let i = 0; i < cant; i++) {
      let a = (TWO_PI / cant) * i + anguloE2 * (r % 2 === 0 ? 1 : -1);
      let px = Math.cos(a) * r;
      let py = Math.sin(a) * r;
      fill(160, 100, 220, 200);
      noStroke();
      rect(px - 4, py - 4, 8, 8);
    }
  }
  pop();
}

function dibujarPreviewEstado2() {
  push();
  noFill();
  stroke(70, 35, 85, 180);
  ellipse(0, 0, 200, 200);
  ellipse(0, 0, 380, 380);

  let t = millis() * 0.001 * 0.5;
  for (let i = 0; i < 24; i++) {
    let a = (TWO_PI / 24) * i + t;
    let px = Math.cos(a) * 190;
    let py = Math.sin(a) * 190;
    fill(180, 120, 230, 220);
    noStroke();
    rect(px - 6, py - 6, 12, 12);
  }
  pop();
}

// ------------------------------------------------------------
// ESTADO 3: FRUTA Y HORMIGAS (TRIÁNGULOS)
// ------------------------------------------------------------
let hormigasE3 = [];
function inicializarEstado3() {
  hormigasE3 = [];
  for (let i = 0; i < 40; i++) {
    hormigasE3.push({
      ang: random(TWO_PI),
      dist: random(120, 480),
      vel: random(0.45, 0.55),
      tam: random(10, 16)
    });
  }
}
function reiniciarEstado3() { inicializarEstado3(); }
function clickEstado3() {
  for (let h of hormigasE3) h.dist = random(300, 500);
}

function dibujarEstado3() {
  push();
  // Fruta central
  fill(160, 110, 50, 220);
  stroke(220, 160, 70);
  strokeWeight(3);
  ellipse(0, 0, 120, 120);

  // Hormigas convergiendo
  for (let h of hormigasE3) {
    h.dist -= h.vel;
    if (h.dist < 60) h.dist = random(350, 520);
    let px = Math.cos(h.ang) * h.dist;
    let py = Math.sin(h.ang) * h.dist;

    fill(240, 180, 90, 220);
    noStroke();
    push();
    translate(px, py);
    rotate(h.ang + PI / 2);
    triangle(0, -h.tam, -h.tam * 0.6, h.tam * 0.6, h.tam * 0.6, h.tam * 0.6);
    pop();
  }
  pop();
}

function dibujarPreviewEstado3() {
  push();
  fill(120, 80, 30, 180);
  ellipse(0, 0, 100, 100);
  let t = millis() * 0.001;
  for (let i = 0; i < 16; i++) {
    let a = (TWO_PI / 16) * i;
    let d = 160 + Math.sin(t + i) * 50;
    let px = Math.cos(a) * d;
    let py = Math.sin(a) * d;
    fill(210, 150, 70, 200);
    noStroke();
    triangle(px, py - 8, px - 6, py + 6, px + 6, py + 6);
  }
  pop();
}

// ------------------------------------------------------------
// ESTADO 4: IDENTIDAD (CUADRADOS AZULES Y VERDES)
// ------------------------------------------------------------
let cuadradosE4 = [];
function inicializarEstado4() {
  cuadradosE4 = [];
  for (let i = 0; i < 35; i++) {
    cuadradosE4.push({
      x: random(-350, 350),
      y: random(-250, 250),
      tam: random(20, 70),
      creciendo: true
    });
  }
}
function reiniciarEstado4() { inicializarEstado4(); }

function dibujarEstado4() {
  push();
  rectMode(CENTER);
  for (let c of cuadradosE4) {
    if (c.creciendo) {
      c.tam += 0.3;
      if (c.tam > 90) c.creciendo = false;
    } else {
      c.tam -= 0.3;
      if (c.tam < 25) c.creciendo = true;
    }
    fill(20, 70, 120, 140);
    stroke(74, 143, 217, 200);
    strokeWeight(2);
    rect(c.x, c.y, c.tam, c.tam);
  }
  pop();
}

function dibujarPreviewEstado4() {
  push();
  rectMode(CENTER);
  let t = millis() * 0.001;
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      let s = 40 + Math.sin(t + i + j) * 15;
      fill(20, 70, 110, 150);
      stroke(74, 143, 217, 190);
      rect(i * 70, j * 70, s, s);
    }
  }
  pop();
}

// ------------------------------------------------------------
// ESTADO 5: EMPATÍA (80 CUADRADOS EN ANILLO AZUL)
// ------------------------------------------------------------
let cuadradosE5 = [];
function inicializarEstado5() {
  cuadradosE5 = [];
  for (let i = 0; i < 80; i++) {
    cuadradosE5.push({
      ang: random(TWO_PI),
      radio: random(150, 420),
      tam: random(16, 32),
      vel: random(0.003, 0.01)
    });
  }
}
function reiniciarEstado5() { inicializarEstado5(); }

function dibujarEstado5() {
  push();
  rectMode(CENTER);
  for (let c of cuadradosE5) {
    c.ang += c.vel;
    let px = Math.cos(c.ang) * c.radio;
    let py = Math.sin(c.ang) * c.radio;

    fill(20, 55, 120, 160);
    stroke(90, 170, 245, 180);
    strokeWeight(1.5);
    rect(px, py, c.tam, c.tam);
  }
  pop();
}

function dibujarPreviewEstado5() {
  push();
  rectMode(CENTER);
  let t = millis() * 0.001;
  for (let i = 0; i < 30; i++) {
    let a = (TWO_PI / 30) * i + t * 0.4;
    let px = Math.cos(a) * 200;
    let py = Math.sin(a) * 200;
    fill(20, 60, 130, 180);
    stroke(90, 180, 255, 200);
    rect(px, py, 22, 22);
  }
  pop();
}

// ------------------------------------------------------------
// ESTADO 6: COLABORACIÓN (DOBLE MARCO INTERCONECTADO)
// ------------------------------------------------------------
let redE6 = [];
function inicializarEstado6() {
  redE6 = [];
  for (let i = 0; i < 36; i++) {
    redE6.push({
      x: random(-350, 350),
      y: random(-250, 250),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5)
    });
  }
}
function reiniciarEstado6() { inicializarEstado6(); }

function dibujarEstado6() {
  push();
  stroke(40, 80, 160, 90);
  strokeWeight(1);
  for (let i = 0; i < redE6.length; i++) {
    let p = redE6[i];
    p.x += p.vx;
    p.y += p.vy;
    if (Math.abs(p.x) > 380) p.vx *= -1;
    if (Math.abs(p.y) > 280) p.vy *= -1;

    for (let j = i + 1; j < redE6.length; j++) {
      let q = redE6[j];
      let d = dist(p.x, p.y, q.x, q.y);
      if (d < 120) {
        line(p.x, p.y, q.x, q.y);
      }
    }
  }

  rectMode(CENTER);
  fill(90, 160, 240, 220);
  noStroke();
  for (let p of redE6) {
    rect(p.x, p.y, 8, 8);
  }
  pop();
}

function dibujarPreviewEstado6() {
  push();
  rectMode(CENTER);
  stroke(60, 110, 200, 120);
  noFill();
  rect(0, 0, 360, 260);
  rect(0, 0, 200, 140);

  fill(120, 180, 255, 200);
  noStroke();
  let t = millis() * 0.001;
  for (let i = 0; i < 16; i++) {
    let a = (TWO_PI / 16) * i;
    let px = Math.cos(a) * 140;
    let py = Math.sin(a) * 90;
    rect(px, py, 10, 10);
  }
  pop();
}

// ------------------------------------------------------------
// ESTADO 7: FUTURO / INCERTIDUMBRE (TRIÁNGULOS VERDES)
// ------------------------------------------------------------
let incertidumbreClic7 = 0;
function inicializarEstado7() {}
function reiniciarEstado7() { incertidumbreClic7 = 0; }

function dibujarEstado7() {
  if (incertidumbreClic7 > 0) incertidumbreClic7 -= 0.02;
  push();
  let t = millis() * 0.001;
  fill(40, 120, 70, 180);
  stroke(74, 174, 109, 230);
  strokeWeight(2);

  for (let i = 0; i < 32; i++) {
    let a = (TWO_PI / 32) * i + t * (1.0 + incertidumbreClic7 * 3.0);
    let r = 220 + Math.sin(t * 2 + i) * (30 + incertidumbreClic7 * 80);
    let px = Math.cos(a) * r;
    let py = Math.sin(a) * r;

    push();
    translate(px, py);
    rotate(a + PI / 2);
    triangle(0, -14, -10, 10, 10, 10);
    pop();
  }
  pop();
}

function dibujarPreviewEstado7() {
  push();
  let t = millis() * 0.001;
  fill(50, 130, 80, 160);
  stroke(74, 174, 109, 200);
  strokeWeight(2);
  for (let i = 0; i < 16; i++) {
    let a = (TWO_PI / 16) * i + t * 0.5;
    let px = Math.cos(a) * 180;
    let py = Math.sin(a) * 180;
    push();
    translate(px, py);
    rotate(a);
    triangle(0, -12, -8, 8, 8, 8);
    pop();
  }
  pop();
}

// ------------------------------------------------------------
// ESTADO 8: FUTURO / ANSIEDAD (CAMPO VECTORIAL RÁPIDO)
// ------------------------------------------------------------
let activacionE8 = 0;
function inicializarEstado8() {}
function reiniciarEstado8() { activacionE8 = 0; }

function dibujarEstado8() {
  if (activacionE8 > 0) activacionE8 -= 0.015;
  push();
  let t = millis() * 0.002 * (1.0 + activacionE8 * 2.0);
  stroke(90, 190, 120, 160);
  strokeWeight(2);

  for (let x = -300; x <= 300; x += 60) {
    for (let y = -200; y <= 200; y += 60) {
      let a = noise(x * 0.005, y * 0.005, t) * TWO_PI * 2;
      let len = 25 + activacionE8 * 15;
      line(x, y, x + Math.cos(a) * len, y + Math.sin(a) * len);
    }
  }
  pop();
}

function dibujarPreviewEstado8() {
  push();
  let t = millis() * 0.0015;
  stroke(80, 180, 110, 150);
  strokeWeight(2);
  for (let x = -200; x <= 200; x += 50) {
    for (let y = -150; y <= 150; y += 50) {
      let a = Math.sin(t + (x + y) * 0.01) * PI;
      line(x, y, x + Math.cos(a) * 20, y + Math.sin(a) * 20);
    }
  }
  pop();
}

// ------------------------------------------------------------
// ESTADO 9: FUTURO / EXPECTATIVA (ÓRBITAS VELOCES Y PULSOS)
// ------------------------------------------------------------
let rotacionE9 = 0;
function inicializarEstado9() {}
function reiniciarEstado9() { rotacionE9 = 0; }
function clickEstado9() { rotacionE9 += PI / 3; }

function dibujarEstado9() {
  rotacionE9 += 0.035;
  push();
  for (let ring = 80; ring <= 400; ring += 80) {
    let cant = Math.floor(ring / 15);
    let dir = ring % 160 === 0 ? 1 : -1;

    for (let i = 0; i < cant; i++) {
      let a = (TWO_PI / cant) * i + rotacionE9 * dir;
      let px = Math.cos(a) * ring;
      let py = Math.sin(a) * ring;

      fill(100, 220, 140, 200);
      stroke(50, 120, 70);
      strokeWeight(1);
      ellipse(px, py, 8, 8);
    }
  }
  pop();
}

function dibujarPreviewEstado9() {
  push();
  let t = millis() * 0.001 * 1.5;
  for (let r = 100; r <= 280; r += 90) {
    noFill();
    stroke(60, 150, 90, 130);
    ellipse(0, 0, r * 2, r * 2);
    for (let i = 0; i < 12; i++) {
      let a = (TWO_PI / 12) * i + t * (r % 180 === 0 ? 1 : -1);
      fill(90, 210, 130, 210);
      noStroke();
      ellipse(Math.cos(a) * r, Math.sin(a) * r, 10, 10);
    }
  }
  pop();
}
