// ============================================================
// DETECTOR.JS — SEGUIMIENTO DE MANOS Y GESTOS CON MEDIAPIPE
// ============================================================

// Objeto de estado global compartido con sketch.js
const HandTracker = {
  activo: false,
  camaraLista: false,
  numManos: 0,
  
  // Coordenadas normalizadas [0..1] en modo espejo
  manoX: 0.5,
  manoY: 0.5,
  
  // Ambas manos si están presentes
  manos: [],
  
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
  manoPrincipal: "Right", // "Left" o "Right"
  
  // Configuración de cámara
  facingMode: "user" // "user" (frontal) o "environment" (trasera)
};

let videoElement = null;
let debugCanvas = null;
let debugCtx = null;
let mpHands = null;
let cameraHelper = null;
let seleccionConfirmada = false;

let listaCamaras = [];
let indiceCamaraActual = 0;
let esComputadora = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

// ============================================================
// INICIALIZACIÓN
// ============================================================

function initHandDetector() {
  videoElement = document.getElementById("webcam");
  debugCanvas = document.getElementById("cam-debug-canvas");
  if (debugCanvas) {
    debugCtx = debugCanvas.getContext("2d");
  }

  // Verificación de seguridad para computadoras en file://
  if (window.location.protocol === "file:") {
    alert("⚠️ AVISO PARA COMPUTADORAS:\n\nTu navegador (Chrome/Edge/Firefox) bloquea el acceso a la cámara en archivos locales (file:///).\n\nPara que la cámara funcione en tu compu:\n1. Sube la carpeta a GitHub Pages (https://) o\n2. Ábrela con un servidor local (por ejemplo con la extensión 'Live Server' de VS Code o ejecutando 'python -m http.server 8000').");
  }

  actualizarEstadoUI("waiting", "Iniciando MediaPipe Hands...");

  mpHands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  mpHands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  mpHands.onResults(onHandResults);

  iniciarStreamCamara();
}

// Iniciar cámara y solicitar permisos explícitos al navegador
async function iniciarStreamCamara(deviceIdDeseado = null) {
  actualizarEstadoUI("waiting", "Esperando permiso de cámara en el navegador...");

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    actualizarEstadoUI("waiting", "Navegador sin soporte de cámara WebRTC.");
    alert("Tu navegador no soporta o bloquea la captura de cámara en este entorno.");
    return;
  }

  if (cameraHelper) {
    try { cameraHelper.stop(); } catch (e) {}
    cameraHelper = null;
  }

  if (videoElement.srcObject) {
    try {
      videoElement.srcObject.getTracks().forEach(track => track.stop());
    } catch (e) {}
  }

  // Configurar restricciones según sea computadora o celular
  let videoConstraints = {
    width: { ideal: 640 },
    height: { ideal: 480 }
  };

  if (deviceIdDeseado) {
    videoConstraints.deviceId = { exact: deviceIdDeseado };
  } else if (!esComputadora) {
    // En celulares/tablets usar cámara frontal por defecto
    videoConstraints.facingMode = HandTracker.facingMode;
  }

  try {
    // Dispara el diálogo de permiso nativo del navegador ("Permitir usar tu cámara")
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: videoConstraints
    });

    videoElement.srcObject = stream;
    await videoElement.play();

    HandTracker.camaraLista = true;

    // Obtener la lista de cámaras disponibles en la computadora/móvil
    await actualizarListaCamaras();

    // Obtener el nombre de la cámara en uso
    const tracks = stream.getVideoTracks();
    const nombreCam = tracks.length > 0 && tracks[0].label ? tracks[0].label : (esComputadora ? "Cámara de la Computadora" : "Cámara Frontal");
    actualizarEstadoUI("active", `Cámara activa: ${nombreCam}`);

    // Iniciar loop de detección con MediaPipe
    cameraHelper = new Camera(videoElement, {
      onFrame: async () => {
        if (videoElement && videoElement.readyState >= 2) {
          await mpHands.send({ image: videoElement });
        }
      },
      width: 640,
      height: 480
    });
    cameraHelper.start();

  } catch (err) {
    console.warn("[!] Error al iniciar captura de cámara con restricciones primarias:", err);

    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      actualizarEstadoUI("waiting", "Permiso denegado. Permite la cámara en la barra de direcciones.");
      alert("⚠️ Permiso de cámara denegado.\n\nPor favor haz clic en el icono del candado o la cámara en la barra de direcciones de tu navegador y selecciona 'Permitir'.");
      return;
    }

    if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
      actualizarEstadoUI("waiting", "No se detectó ninguna cámara en esta compu.");
      alert("No se encontró ninguna cámara conectada en tu computadora.");
      return;
    }

    // Intento con restricciones genéricas mínimas { video: true }
    try {
      const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = fallbackStream;
      await videoElement.play();

      HandTracker.camaraLista = true;
      await actualizarListaCamaras();

      actualizarEstadoUI("active", "Cámara conectada. Buscando manos...");

      cameraHelper = new Camera(videoElement, {
        onFrame: async () => {
          if (videoElement && videoElement.readyState >= 2) {
            await mpHands.send({ image: videoElement });
          }
        },
        width: 640,
        height: 480
      });
      cameraHelper.start();
    } catch (e2) {
      console.error("[X] Imposible acceder a la cámara:", e2);
      actualizarEstadoUI("waiting", "Sin cámara. Usa interacción táctil o ratón.");
    }
  }
}

// Obtener todas las cámaras conectadas a la computadora
async function actualizarListaCamaras() {
  try {
    const dispositivos = await navigator.mediaDevices.enumerateDevices();
    listaCamaras = dispositivos.filter(d => d.kind === "videoinput");
    console.log(`[✓] Cámaras detectadas en la computadora (${listaCamaras.length}):`, listaCamaras.map(c => c.label));
  } catch (e) {
    console.warn("No se pudieron enumerar las cámaras:", e);
  }
}

// Cambiar o alternar entre cámaras disponibles (útil en compu con varias cámaras o en celular frontal/trasera)
function alternarCamara() {
  if (listaCamaras.length > 1) {
    indiceCamaraActual = (indiceCamaraActual + 1) % listaCamaras.length;
    const proximaCamara = listaCamaras[indiceCamaraActual];
    console.log("Cambiando a cámara:", proximaCamara.label);
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
  // Dibujar preview en el mini canvas
  dibujarDebugCanvas(results);

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

  // Tomamos la mano principal (primera detectada)
  const landmarks = results.multiHandLandmarks[0];
  const handedness = results.multiHandedness && results.multiHandedness[0] 
    ? results.multiHandedness[0].label 
    : "Right";
  HandTracker.manoPrincipal = handedness;

  // Extraer posición normalizada de la palma (promedio de muñeca y base de dedos)
  // En modo espejo, invertimos X para que el movimiento sea natural
  const rawX = (landmarks[0].x + landmarks[9].x) / 2.0;
  const rawY = (landmarks[0].y + landmarks[9].y) / 2.0;
  HandTracker.manoX = 1.0 - rawX; // Espejo horizontal
  HandTracker.manoY = rawY;

  // Clasificación de gestos
  const esPuno = verificarPuno(landmarks);
  const esAbierta = verificarManoAbierta(landmarks);

  HandTracker.esPuno = esPuno;
  HandTracker.esAbierta = esAbierta;
  HandTracker.gestoActivo = esPuno || esAbierta || (results.multiHandLandmarks.length > 1);

  // ----------------------------------------------------------
  // LÓGICA DE MENÚ (CUADRÍCULA 3x3)
  // ----------------------------------------------------------
  if (typeof estado !== "undefined" && estado === 0) { // estado === MENU
    const col = Math.min(2, Math.max(0, Math.floor(HandTracker.manoX * 3)));
    const row = Math.min(2, Math.max(0, Math.floor(HandTracker.manoY * 3)));
    const celda = row * 3 + col; // 0..8

    HandTracker.celdaHover = celda;

    if (esAbierta) {
      if (HandTracker.estadoSeleccion !== celda) {
        HandTracker.estadoSeleccion = celda;
        HandTracker.tiempoInicioApertura = Date.now();
        HandTracker.progresoSeleccion = 0;
        seleccionConfirmada = false;
      } else {
        const transcurrido = Date.now() - HandTracker.tiempoInicioApertura;
        HandTracker.progresoSeleccion = Math.min(1.0, transcurrido / 2000.0); // 2 segundos

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
      // Puño cerrado o mano no abierta: solo navega / hover
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
    // Dentro de un estado
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

// ============================================================
// DIBUJO DE FEEDBACK EN MINI CANVAS
// ============================================================

function dibujarDebugCanvas(results) {
  if (!debugCtx || !debugCanvas) return;

  if (debugCanvas.width !== videoElement.videoWidth && videoElement.videoWidth > 0) {
    debugCanvas.width = videoElement.videoWidth;
    debugCanvas.height = videoElement.videoHeight;
  }

  debugCtx.save();
  debugCtx.clearRect(0, 0, debugCanvas.width, debugCanvas.height);

  if (videoElement && videoElement.readyState >= 2) {
    debugCtx.drawImage(videoElement, 0, 0, debugCanvas.width, debugCanvas.height);
  }

  if (results.multiHandLandmarks) {
    for (const lms of results.multiHandLandmarks) {
      // Dibujar esqueleto de mano
      debugCtx.strokeStyle = "#00ffcc";
      debugCtx.lineWidth = 3;
      debugCtx.fillStyle = "#ff0066";

      for (let i = 0; i < lms.length; i++) {
        const x = lms[i].x * debugCanvas.width;
        const y = lms[i].y * debugCanvas.height;
        debugCtx.beginPath();
        debugCtx.arc(x, y, 4, 0, 2 * Math.PI);
        debugCtx.fill();
      }
    }
  }
  debugCtx.restore();
}

function actualizarEstadoUI(tipo, texto) {
  const dot = document.getElementById("status-dot");
  const txt = document.getElementById("status-text");
  if (dot) {
    dot.className = `status-dot ${tipo}`;
  }
  if (txt) {
    txt.innerText = texto;
  }
}
