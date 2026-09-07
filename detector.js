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

let listaCamaras = [];
let indiceCamaraActual = 0;
let esComputadora = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

// ============================================================
// INICIALIZACIÓN
// ============================================================

function initHandDetector() {
  videoElement = document.getElementById("webcam");

  actualizarEstadoUI("waiting", "Iniciando MediaPipe Hands (Modo Rápido)...");

  mpHands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  // modelComplexity 0 = Lite (3x más rápido, perfecto para 60 FPS en web/móvil)
  mpHands.setOptions({
    maxNumHands: 1, // 1 mano principal ahorra 50% de procesamiento
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

  // Resolución optimizada (480x360 es ideal: rápida y muy precisa para MediaPipe)
  let videoConstraints = {
    width: { ideal: 480, max: 640 },
    height: { ideal: 360, max: 480 }
  };

  if (deviceIdDeseado) {
    videoConstraints.deviceId = { exact: deviceIdDeseado };
  } else if (!esComputadora) {
    videoConstraints.facingMode = HandTracker.facingMode;
  }

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
        if (isProcessingFrame) return;
        if (videoElement && videoElement.readyState >= 2) {
          isProcessingFrame = true;
          try {
            await mpHands.send({ image: videoElement });
          } catch (err) {
            // Ignorar errores esporádicos en frames
          } finally {
            isProcessingFrame = false;
          }
        }
      },
      width: 480,
      height: 360
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
          if (isProcessingFrame) return;
          if (videoElement && videoElement.readyState >= 2) {
            isProcessingFrame = true;
            try {
              await mpHands.send({ image: videoElement });
            } finally {
              isProcessingFrame = false;
            }
          }
        },
        width: 480,
        height: 360
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
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    HandTracker.activo = false;
    HandTracker.numManos = 0;
    HandTracker.celdaHover = -1;
    HandTracker.estadoSeleccion = -1;
    HandTracker.progresoSeleccion = 0;
    HandTracker.esPuno = false;
    HandTracker.esAbierta = false;
    HandTracker.gestoActivo = false;
    actualizarEstadoUI("active", "Cámara activa. Acerca tu mano.");
    return;
  }

  HandTracker.activo = true;
  HandTracker.numManos = results.multiHandLandmarks.length;

  const landmarks = results.multiHandLandmarks[0];
  const handedness = results.multiHandedness && results.multiHandedness[0] 
    ? results.multiHandedness[0].label 
    : "Right";
  HandTracker.manoPrincipal = handedness;

  // Centro de la palma normalizado en modo espejo
  const rawX = (landmarks[0].x + landmarks[9].x) * 0.5;
  const rawY = (landmarks[0].y + landmarks[9].y) * 0.5;
  HandTracker.manoX = 1.0 - rawX;
  HandTracker.manoY = rawY;

  // Clasificación geométrica
  const esPuno = verificarPuno(landmarks);
  const esAbierta = verificarManoAbierta(landmarks);

  HandTracker.esPuno = esPuno;
  HandTracker.esAbierta = esAbierta;
  HandTracker.gestoActivo = esPuno || esAbierta;

  // Lógica del menú principal
  if (typeof estado !== "undefined" && estado === 0) {
    const col = Math.min(2, Math.max(0, Math.floor(HandTracker.manoX * 3)));
    const row = Math.min(2, Math.max(0, Math.floor(HandTracker.manoY * 3)));
    const celda = row * 3 + col;

    HandTracker.celdaHover = celda;

    if (esAbierta) {
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
      actualizarEstadoUI("detecting", `Seleccionando Estado ${celda + 1} (${Math.round(HandTracker.progresoSeleccion * 100)}%)`);
    } else {
      HandTracker.estadoSeleccion = -1;
      HandTracker.progresoSeleccion = 0;
      seleccionConfirmada = false;
      if (esPuno) {
        actualizarEstadoUI("active", `Navegando (Puño) en Sector ${celda + 1}`);
      } else {
        actualizarEstadoUI("active", `Mano en Sector ${celda + 1}`);
      }
    }
  } else {
    HandTracker.celdaHover = -1;
    HandTracker.estadoSeleccion = -1;
    HandTracker.progresoSeleccion = 0;
    actualizarEstadoUI("detecting", `Interactuando en Estado ${typeof estado !== "undefined" ? estado : ""}`);
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
    if (dTip < dPip * 1.1) {
      dedosCerrados++;
    }
  }
  return dedosCerrados >= 3;
}

function verificarManoAbierta(landmarks) {
  const wrist = landmarks[0];
  let dedosAbiertos = 0;
  const pares = [[8, 6], [12, 10], [16, 14], [20, 18]];

  for (const [tip, pip] of pares) {
    const dTip = dist2D(landmarks[tip], wrist);
    const dPip = dist2D(landmarks[pip], wrist);
    if (dTip > dPip * 1.25) {
      dedosAbiertos++;
    }
  }
  return dedosAbiertos >= 3;
}

function actualizarEstadoUI(tipo, texto) {
  const dot = document.getElementById("status-dot");
  const txt = document.getElementById("status-text");
  if (dot) dot.className = `status-dot ${tipo}`;
  if (txt) txt.innerText = texto;
}
