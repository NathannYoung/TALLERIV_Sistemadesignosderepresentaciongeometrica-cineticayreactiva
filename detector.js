// ============================================================
// DETECTOR.JS — SEGUIMIENTO DE MANOS Y GESTOS CON MEDIAPIPE
// Optimizado para alta velocidad (Lite Model) y baja latencia
// ============================================================

// Objeto de estado global compartido con sketch.js
const HandTracker = {
  activo: false,
  camaraLista: false,
  numManos: 0,
  
  // Coordenadas normalizadas [0..1] en modo espejo
  manoX: 0.5,
  manoY: 0.5,
  
  // Gestos
  esPuno: false,
  esAbierta: false,
  gestoActivo: false,
  gestoId: 0,
  gestoNombre: "NINGUNO",
  
  // Control de selección en Menú
  celdaHover: -1,         // 0..8
  estadoSeleccion: -1,    // 0..8 si se está abriendo la mano
  progresoSeleccion: 0.0, // 0.0 a 1.0
  tiempoInicioApertura: 0,
  
  // Lateralidad
  manoPrincipal: "Right",
  
  // Configuración de cámara
  facingMode: "user" // "user" (frontal) o "environment" (trasera)
};

let videoElement = null;
let mpHands = null;
let cameraHelper = null;
let seleccionConfirmada = false;
let isProcessingFrame = false;

// Variables de amortiguación anti-parpadeo (Debounce & Hysteresis)
let framesSinMano = 0;
const MAX_FRAMES_GRACIA = 10; // ~300ms a 30 FPS para estabilizar caídas momentáneas de frames
let candidatoGestoActual = 0;
let framesCandidatoGesto = 0;
let ultimoTextoUI = "";
let ultimoTipoUI = "";

let listaCamaras = [];
let indiceCamaraActual = 0;
let esComputadora = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

// ============================================================
// INICIALIZACIÓN
// ============================================================

function initHandDetector() {
  videoElement = document.getElementById("webcam");

  actualizarEstadoUI("waiting", "Iniciando MediaPipe Hands...");

  mpHands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  // maxNumHands: 2 permite detectar ambas manos para la Fila 2 (Estados 4, 5, 6)
  // modelComplexity 0 = Lite (óptimo para 60 FPS en web y móviles)
  mpHands.setOptions({
    maxNumHands: 2,
    modelComplexity: 0,
    minDetectionConfidence: 0.45,
    minTrackingConfidence: 0.45
  });

  mpHands.onResults(onHandResults);

  iniciarStreamCamara();
}

// Iniciar cámara y solicitar permisos explícitos al navegador
async function iniciarStreamCamara(deviceIdDeseado = null) {
  actualizarEstadoUI("waiting", "Esperando permiso de cámara...");

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    actualizarEstadoUI("waiting", "Navegador sin soporte de cámara WebRTC.");
    return;
  }

  if (cameraHelper) {
    try { cameraHelper.stop(); } catch (e) {}
    cameraHelper = null;
  }

  if (videoElement && videoElement.srcObject) {
    try {
      videoElement.srcObject.getTracks().forEach(track => track.stop());
    } catch (e) {}
  }

  // Resolución optimizada (480x360 en PC, 320x240 en móviles para máxima fluidez a 60 FPS)
  let videoConstraints = {
    width: { ideal: esComputadora ? 480 : 320, max: 480 },
    height: { ideal: esComputadora ? 360 : 240, max: 360 }
  };

  if (deviceIdDeseado) {
    videoConstraints.deviceId = { exact: deviceIdDeseado };
  } else if (!esComputadora) {
    videoConstraints.facingMode = HandTracker.facingMode;
  }

  // Intervalo de procesamiento: ~30 FPS en PC, ~20 FPS en móviles (ahorra >60% de CPU/GPU en celulares)
  let ultimoTiempoEnvioMP = 0;
  const INTERVALO_FRAME_MP = esComputadora ? 32 : 50;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: videoConstraints
    });

    videoElement.srcObject = stream;
    await videoElement.play();

    HandTracker.camaraLista = true;
    await actualizarListaCamaras();

    const tracks = stream.getVideoTracks();
    const nombreCam = tracks.length > 0 && tracks[0].label ? tracks[0].label : (esComputadora ? "Cámara Web" : "Cámara Frontal");
    actualizarEstadoUI("active", `Cámara activa: ${nombreCam}`);

    // Bucle con guardia para evitar apilamiento de cuadros
    cameraHelper = new Camera(videoElement, {
      onFrame: async () => {
        const ahora = performance.now();
        if (ahora - ultimoTiempoEnvioMP < INTERVALO_FRAME_MP) return;
        if (isProcessingFrame) return;
        if (videoElement && videoElement.readyState >= 2) {
          isProcessingFrame = true;
          ultimoTiempoEnvioMP = ahora;
          try {
            await mpHands.send({ image: videoElement });
          } catch (err) {
            // Ignorar errores esporádicos en frames
          } finally {
            isProcessingFrame = false;
          }
        }
      },
      width: esComputadora ? 480 : 320,
      height: esComputadora ? 360 : 240
    });
    cameraHelper.start();

  } catch (err) {
    console.warn("[!] Error al iniciar captura primaria:", err);

    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      actualizarEstadoUI("waiting", "Permiso denegado. Permite la cámara en el navegador.");
      return;
    }

    try {
      const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = fallbackStream;
      await videoElement.play();

      HandTracker.camaraLista = true;
      await actualizarListaCamaras();
      actualizarEstadoUI("active", "Cámara conectada.");

      cameraHelper = new Camera(videoElement, {
        onFrame: async () => {
          const ahora = performance.now();
          if (ahora - ultimoTiempoEnvioMP < INTERVALO_FRAME_MP) return;
          if (isProcessingFrame) return;
          if (videoElement && videoElement.readyState >= 2) {
            isProcessingFrame = true;
            ultimoTiempoEnvioMP = ahora;
            try {
              await mpHands.send({ image: videoElement });
            } finally {
              isProcessingFrame = false;
            }
          }
        },
        width: esComputadora ? 480 : 320,
        height: esComputadora ? 360 : 240
      });
      cameraHelper.start();
    } catch (e2) {
      console.error("[X] Imposible acceder a cámara:", e2);
      actualizarEstadoUI("waiting", "Sin cámara. Usa táctil o ratón.");
    }
  }
}

async function actualizarListaCamaras() {
  try {
    const dispositivos = await navigator.mediaDevices.enumerateDevices();
    listaCamaras = dispositivos.filter(d => d.kind === "videoinput");
  } catch (e) {}
}

function alternarCamara() {
  if (listaCamaras.length > 1) {
    indiceCamaraActual = (indiceCamaraActual + 1) % listaCamaras.length;
    const proximaCamara = listaCamaras[indiceCamaraActual];
    iniciarStreamCamara(proximaCamara.deviceId);
  } else {
    HandTracker.facingMode = HandTracker.facingMode === "user" ? "environment" : "user";
    iniciarStreamCamara();
  }
}

// ============================================================
// PROCESAMIENTO DE DETECCIÓN DE MANOS
// ============================================================

function onHandResults(results) {
  // Manejo de pérdida temporal de manos (Grace Period para evitar parpadeo en Estado 9)
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    framesSinMano++;
    if (framesSinMano <= MAX_FRAMES_GRACIA) {
      // Durante el período de gracia retenemos la interacción para que no parpadee ni se corte Estado 9
      return;
    }

    HandTracker.activo = false;
    HandTracker.numManos = 0;
    HandTracker.celdaHover = -1;
    HandTracker.estadoSeleccion = -1;
    HandTracker.progresoSeleccion = 0;
    HandTracker.esPuno = false;
    HandTracker.esAbierta = false;
    HandTracker.gestoActivo = false;
    HandTracker.gestoId = 0;
    HandTracker.gestoNombre = "NINGUNO";
    candidatoGestoActual = 0;
    framesCandidatoGesto = 0;
    actualizarEstadoUI("active", "Cámara activa. Acerca tu mano.");
    return;
  }

  // Detección activa confirmada
  framesSinMano = 0;
  HandTracker.activo = true;
  HandTracker.numManos = results.multiHandLandmarks.length;

  const manos = [];
  for (let i = 0; i < results.multiHandLandmarks.length; i++) {
    const lms = results.multiHandLandmarks[i];
    const rawX = (lms[0].x + lms[9].x) * 0.5;
    const rawY = (lms[0].y + lms[9].y) * 0.5;
    const hx = 1.0 - rawX; // Coordenada horizontal en modo espejo [0..1]
    const hy = rawY;

    const esPuno = verificarPuno(lms);
    const esAbierta = !esPuno;

    // En video sin espejo pasado a MediaPipe, "Right" es la mano izquierda real del usuario
    const rawLabel = results.multiHandedness && results.multiHandedness[i]
      ? results.multiHandedness[i].label
      : "Right";

    const esManoIzq = (HandTracker.facingMode === "user") ? (rawLabel === "Right") : (rawLabel === "Left");
    const esManoDer = !esManoIzq;

    manos.push({
      lms,
      hx,
      hy,
      esPuno,
      esAbierta,
      esManoIzq,
      esManoDer,
      rawLabel
    });
  }

  // Coordenadas primarias para visualización
  HandTracker.manoX = manos[0].hx;
  HandTracker.manoY = manos[0].hy;
  HandTracker.manoPrincipal = manos[0].rawLabel;
  HandTracker.esPuno = manos.some(m => m.esPuno);
  HandTracker.esAbierta = manos.some(m => m.esAbierta);
  HandTracker.gestoActivo = true;

  // ============================================================
  // CLASIFICADOR DE LOS 9 GESTOS IDÉNTICO A MANOSV2.PY
  // ============================================================
  let tipoGestoDetectado = 0;
  let nombreGestoDetectado = "NINGUNO";

  if (manos.length >= 2) {
    // --------------------------------------------------------
    // GESTOS DE 2 MANOS: ESTADOS 4, 5, 6
    // --------------------------------------------------------
    const m1 = manos[0];
    const m2 = manos[1];
    const dPalmas = dist2D(m1.lms[9], m2.lms[9]);
    const dMunecas = dist2D(m1.lms[0], m2.lms[0]);
    const dIndices = dist2D(m1.lms[8], m2.lms[8]);
    const hyProm = (m1.hy + m2.hy) * 0.5;

    // 👐 ESTADO 4: [AMBAS] Manos abiertas sobre el pecho (separadas)
    if (!m1.esPuno && !m2.esPuno && dPalmas > 0.18 && dIndices > 0.16 && hyProm >= 0.28) {
      tipoGestoDetectado = 4;
      nombreGestoDetectado = "Manos Abiertas en Pecho";
    }
    // 🤝 ESTADO 6: [AMBAS] Dedos entrelazados con muñecas abiertas
    else if ((dPalmas < 0.28 || dIndices < 0.24) && dMunecas > dPalmas * 1.15 && hyProm >= 0.25) {
      tipoGestoDetectado = 6;
      nombreGestoDetectado = "Dedos Entrelazados";
    }
    // 🙏 ESTADO 5: [AMBAS] Manos unidas en pecho / rezo
    else if (dPalmas < 0.24 && dIndices < 0.24 && hyProm >= 0.22) {
      tipoGestoDetectado = 5;
      nombreGestoDetectado = "Manos Unidas en Pecho";
    }
  } else if (manos.length === 1) {
    // --------------------------------------------------------
    // GESTOS DE 1 MANO (IZQUIERDA: 1, 2, 3 | DERECHA: 7, 8, 9)
    // --------------------------------------------------------
    const m = manos[0];
    const lms = m.lms;

    // Lateralidad robusta: etiqueta MediaPipe + posición en espejo
    const esIzq = m.esManoIzq || (m.hx < 0.40);
    const esDer = m.esManoDer || (m.hx > 0.60);

    // Antebrazo horizontal con puño (dx_mano > dy_mano * 0.6)
    const dxMano = Math.abs(lms[0].x - lms[9].x);
    const dyMano = Math.abs(lms[0].y - lms[9].y);
    const esHorizontal = (dxMano > dyMano * 0.6);

    // === GRUPO MANO DERECHA: ESTADOS 7, 8, 9 ===
    if (esDer) {
      // ⌚ ESTADO 9: [DER] Antebrazo horizontal con puño cruzado en pecho/cuello
      if (m.esPuno && m.hy >= 0.35 && m.hy <= 0.85 && esHorizontal) {
        tipoGestoDetectado = 9;
        nombreGestoDetectado = "Antebrazo Horizontal con Puño";
      }
      // 🧠 ESTADO 7: [DER] Mano en la sien (zona superior derecha de la cabeza)
      else if (m.hy <= 0.42 && m.hx >= 0.45 && !m.esPuno) {
        tipoGestoDetectado = 7;
        nombreGestoDetectado = "Mano en la Sien";
      }
      // 💆 ESTADO 8: [DER] Mano en el cuello / garganta
      else if (m.hy >= 0.38 && m.hy <= 0.72 && m.hx >= 0.26 && m.hx <= 0.76 && !m.esPuno) {
        tipoGestoDetectado = 8;
        nombreGestoDetectado = "Mano en el Cuello";
      }
      // Si la mano derecha hace puño en el pecho
      else if (m.esPuno && m.hy >= 0.35 && m.hy <= 0.85) {
        tipoGestoDetectado = 9;
        nombreGestoDetectado = "Puño en Pecho";
      }
    }

    // === GRUPO MANO IZQUIERDA: ESTADOS 1, 2, 3 ===
    if (tipoGestoDetectado === 0 && esIzq) {
      // 🤔 ESTADO 1: [IZQ] Puño bajo el mentón
      if (m.esPuno && m.hy >= 0.32 && m.hy <= 0.65 && m.hx >= 0.26 && m.hx <= 0.74) {
        tipoGestoDetectado = 1;
        nombreGestoDetectado = "Puño bajo el Mentón";
      }
      // 🦾 ESTADO 2: [IZQ] Mano sobre hombro izquierdo (lado izquierdo en espejo hx <= 0.48)
      else if (m.hx <= 0.48 && m.hy >= 0.28 && m.hy <= 0.75) {
        tipoGestoDetectado = 2;
        nombreGestoDetectado = "Mano en Hombro Izquierdo";
      }
      // 👃 ESTADO 3: [IZQ] Mano en la nariz / centro del rostro
      else if (m.hy <= 0.44 && m.hy >= 0.15 && m.hx >= 0.28 && m.hx <= 0.72 && !m.esPuno) {
        tipoGestoDetectado = 3;
        nombreGestoDetectado = "Mano en la Nariz";
      }
      // Si hace puño en otra posición de la mano izquierda
      else if (m.esPuno && m.hy >= 0.30) {
        tipoGestoDetectado = 1;
        nombreGestoDetectado = "Puño Izquierdo";
      }
    }

    // Fallback unificado si la clasificación estricta de lateralidad no coincidió
    if (tipoGestoDetectado === 0) {
      if (m.esPuno) {
        if (m.hy < 0.60 && m.hx >= 0.28 && m.hx <= 0.72) {
          tipoGestoDetectado = 1;
          nombreGestoDetectado = "Puño bajo Mentón";
        } else if (esHorizontal) {
          tipoGestoDetectado = 9;
          nombreGestoDetectado = "Antebrazo con Puño";
        }
      } else {
        if (m.hy <= 0.38) {
          tipoGestoDetectado = (m.hx > 0.50) ? 7 : 3;
          nombreGestoDetectado = (m.hx > 0.50) ? "Mano en Sien" : "Mano en Nariz";
        } else if (m.hx <= 0.45 && m.hy <= 0.70) {
          tipoGestoDetectado = 2;
          nombreGestoDetectado = "Mano en Hombro";
        } else if (m.hy >= 0.38 && m.hy <= 0.70 && m.hx >= 0.30 && m.hx <= 0.70) {
          tipoGestoDetectado = 8;
          nombreGestoDetectado = "Mano en Cuello";
        }
      }
    }
  }

  // Debounce de 2 frames para estabilizar el gesto y evitar parpadeo
  if (tipoGestoDetectado === candidatoGestoActual) {
    framesCandidatoGesto++;
    if (framesCandidatoGesto >= 2) {
      HandTracker.gestoId = tipoGestoDetectado;
      HandTracker.gestoNombre = nombreGestoDetectado;
    }
  } else {
    candidatoGestoActual = tipoGestoDetectado;
    framesCandidatoGesto = 0;
  }

  const enMenu = (typeof estado === "undefined" || estado === 0);

  if (enMenu) {
    let fila = 0;
    let col = 0;
    let nombreFila = "";
    let manoAbiertaMenu = false;
    let esPunoMenu = false;

    if (manos.length === 1) {
      const m = manos[0];
      const hx = Math.max(0.0, Math.min(1.0, m.hx));
      col = (hx < 0.333) ? 0 : (hx < 0.666 ? 1 : 2);

      if (m.esManoIzq) {
        fila = 0; // Fila 1 (Superior): Estados 1, 2, 3
        nombreFila = "Mano Izquierda";
      } else {
        fila = 2; // Fila 3 (Inferior): Estados 7, 8, 9
        nombreFila = "Mano Derecha";
      }
      manoAbiertaMenu = m.esAbierta;
      esPunoMenu = m.esPuno;
    } else {
      // 2 manos a la vez -> Fila 2 (Centro): Estados 4, 5, 6
      fila = 1;
      const cx = (manos[0].hx + manos[1].hx) * 0.5;
      const hx = Math.max(0.0, Math.min(1.0, cx));
      col = (hx < 0.333) ? 0 : (hx < 0.666 ? 1 : 2);
      nombreFila = "Ambas Manos";

      manoAbiertaMenu = (!manos[0].esPuno && !manos[1].esPuno);
      esPunoMenu = (manos[0].esPuno || manos[1].esPuno);
    }

    const celda = fila * 3 + col;
    HandTracker.celdaHover = celda;

    if (manoAbiertaMenu) {
      if (HandTracker.estadoSeleccion !== celda) {
        HandTracker.estadoSeleccion = celda;
        HandTracker.tiempoInicioApertura = Date.now();
        HandTracker.progresoSeleccion = 0;
        seleccionConfirmada = false;
      } else {
        const transcurrido = Date.now() - HandTracker.tiempoInicioApertura;
        HandTracker.progresoSeleccion = Math.min(1.0, transcurrido / 2000.0);

        if (HandTracker.progresoSeleccion >= 1.0 && !seleccionConfirmada) {
          seleccionConfirmada = true;
          const estadoTarget = celda + 1;
          if (typeof entrarEstado === "function") {
            entrarEstado(estadoTarget);
          }
        }
      }
      actualizarEstadoUI("detecting", `${nombreFila} en Tercio ${col + 1} → Estado ${celda + 1} (${Math.round(HandTracker.progresoSeleccion * 100)}%)`);
    } else {
      HandTracker.estadoSeleccion = -1;
      HandTracker.progresoSeleccion = 0;
      seleccionConfirmada = false;
      if (esPunoMenu) {
        actualizarEstadoUI("active", `${nombreFila} en Tercio ${col + 1} → Estado ${celda + 1} (Puño: Navegando)`);
      } else {
        actualizarEstadoUI("active", `${nombreFila} en Tercio ${col + 1} → Estado ${celda + 1}`);
      }
    }
  } else {
    // Fuera del menú (Estados interactivos 1 a 9)
    HandTracker.celdaHover = -1;
    HandTracker.estadoSeleccion = -1;
    HandTracker.progresoSeleccion = 0;

    const gestoEsperado = (typeof estado !== "undefined") ? estado : 0;
    const nombresGestos = [
      "",
      "Puño bajo el Mentón",
      "Mano en Hombro Izquierdo",
      "Mano en la Nariz",
      "Manos Abiertas en Pecho",
      "Manos Unidas en Pecho",
      "Dedos Entrelazados",
      "Mano en la Sien",
      "Mano en el Cuello",
      "Antebrazo Horizontal con Puño"
    ];

    if (HandTracker.gestoId === gestoEsperado) {
      actualizarEstadoUI("detecting", `🟢 Estado ${gestoEsperado}: ¡Gesto ${gestoEsperado} (${HandTracker.gestoNombre}) activo!`);
    } else if (HandTracker.gestoId > 0) {
      actualizarEstadoUI("active", `⚠️ Estado ${gestoEsperado} (espera: ${nombresGestos[gestoEsperado]}) — Detectado: Gesto ${HandTracker.gestoId} (${HandTracker.gestoNombre})`);
    } else {
      actualizarEstadoUI("waiting", `Estado ${gestoEsperado}: esperando Gesto ${gestoEsperado} (${nombresGestos[gestoEsperado] || ""})`);
    }
  }
}

// ============================================================
// RECONOCIMIENTO GEOMÉTRICO DE GESTOS
// ============================================================

function dist2D(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

function verificarPuno(landmarks) {
  const wrist = landmarks[0];
  let dedosCerrados = 0;
  const pares = [[8, 6], [12, 10], [16, 14], [20, 18]];

  for (const [tip, pip] of pares) {
    const dTip = dist2D(landmarks[tip], wrist);
    const dPip = dist2D(landmarks[pip], wrist);
    if (dTip < dPip * 1.08) {
      dedosCerrados++;
    }
  }
  return dedosCerrados >= 3;
}

function verificarManoAbierta(landmarks) {
  return !verificarPuno(landmarks);
}

function actualizarEstadoUI(tipo, texto) {
  if (tipo === ultimoTipoUI && texto === ultimoTextoUI) return;
  ultimoTipoUI = tipo;
  ultimoTextoUI = texto;

  const dot = document.getElementById("status-dot");
  const txt = document.getElementById("status-text");
  if (dot) dot.className = `status-dot ${tipo}`;
  if (txt) txt.innerText = texto;
}
