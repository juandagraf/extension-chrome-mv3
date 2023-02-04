function getDatosGuardados() {
    chrome.storage.sync.get({
        multasTotal: 0,
        lotesHechos: 0
    }, function (items) {
        document.getElementById('contadorMultas').innerHTML = `Cantidad de aprobadas: ${items.multasTotal}`;
        document.getElementById('contadorLotes').innerHTML = `Cantidad de procesadas: ${items.lotesHechos}`;
    });
}

function reiniciarContadores() {
    chrome.storage.sync.set({
        multasTotal: 0,
        lotesHechos: 0
    }, function () {
        // Update status to let user know options were saved.
        document.getElementById('contadorMultas').innerHTML = `Cantidad de aprobadas: 0`;
        document.getElementById('contadorLotes').innerHTML = `Cantidad de procesadas: 0`;
    });
}

// ##### Listeners #######
chrome.storage.onChanged.addListener(async (changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key == "multasTotal") {
            document.getElementById('contadorMultas').innerHTML = `Cantidad de aprobadas: ${newValue}`;
        }
        else if (key == "lotesHechos") {
            document.getElementById('contadorLotes').innerHTML = `Cantidad de procesadas: ${newValue}`;
        }
    }
});

document.getElementById('btnReinciarContadores').addEventListener('click', reiniciarContadores);
document.addEventListener('DOMContentLoaded', getDatosGuardados);