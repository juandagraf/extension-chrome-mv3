
const url = window.location.href;
var s = document.createElement('script');
let multasTotales = 0;
let cantLotes = 0;

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
  const multas = e.detail["multas"];
  multasTotales += multas;
  cantLotes += 1;
  setDatos(multasTotales, cantLotes);
});

function getDatos() {
  chrome.storage.sync.get({
    multasTotal: 0,
    lotesHechos: 0
  }, function (items) {
    multasTotales = items.multasTotal;
    cantLotes = items.lotesHechos;
  });
}

function injectarJS() {
  s.src = chrome.runtime.getURL('scripts/inject.js');
  (document.head || document.documentElement).appendChild(s);
  s.onload = function () {
    s.remove();
  };
}

function setDatos(mt, cl) {
  try {
    chrome.storage.sync.set({
      multasTotal: mt,
      lotesHechos: cl
    });
  } catch (e) {
    console.error(e.message);
  }
}
