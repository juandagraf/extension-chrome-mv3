const url = window.location.href;
var s = document.createElement('script');
let contadorAprobadas = 0;
let contadorProcesadas = 0;

//Si el url contiene SinDetectar (son los links correspondientes a las imagenes de multas)
//cerrar la pestaña con ESC
if (url.match("SinDetectar")) {

  document.onkeydown = KeyPress;

  function KeyPress(e) {
    const evento = window.event ? event : e
    if (!evento.repeat) {
      switch (evento.keyCode) {
        case 27:
          window.close();
          break;
        default:
          //Hacer nada
          break;
      }
    }
  }
}

getDatos();
injectarJS();

// Event listener
document.addEventListener('RW759_connectExtension', function (e) {
  const multa = e.detail["multa"];
  const procesada = e.detail["procesada"];
  contadorAprobadas += multa;
  contadorProcesadas += procesada;
  setDatos(contadorAprobadas, contadorProcesadas);
});

function getDatos() {
  chrome.storage.sync.get({
    multas: 0,
    procesadas: 0
  }, function (items) {
    contadorAprobadas = items.multas;
    contadorProcesadas = items.procesadas;
  });
}

function injectarJS() {
  s.src = chrome.runtime.getURL('scripts/inject.js');
  (document.head || document.documentElement).appendChild(s);
  s.onload = function () {
    s.remove();
  };
}

function setDatos(contAp, contPro) {
  try {
    chrome.storage.sync.set({
      multas: contAp,
      procesadas: contPro
    });
  } catch (e) {
    console.error(e);
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.reiniciar)
       contadorAprobadas = 0;
       contadorProcesadas = 0;
    }
);