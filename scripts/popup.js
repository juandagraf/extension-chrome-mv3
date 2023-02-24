    actualizarContadores();

    async function actualizarContadores() {
        chrome.storage.sync.get({
            multas: 0,
            procesadas: 0
        }, function (items) {
            //Actualizar DOMs
            document.getElementById('contadorMultas').innerHTML = `Cantidad de aprobadas: ${items.multas}`;
            document.getElementById('contadorProcesadas').innerHTML = `Cantidad de procesadas: ${items.procesadas}`;
        });
    }

    function reiniciarContadoresChromeAPI() {
        try {
            chrome.storage.sync.set({
              multas: 0,
              procesadas: 0
            });
          } catch (e) {
            console.error(e);
          }
    }

    async function reiniciarContadores() {
        //Buscar si la pagina esta abierta
        const tab = await chrome.tabs.query({ url: `*://*.servidor.lan/*` });
        //Si no existe 
        if(tab[0] == undefined) {
            reiniciarContadoresChromeAPI();
            actualizarContadores();
            console.log('No existe servidorLan');
        }
        else {
            let camaraAbierta = false;
            //Si la url contiene Crop (o sea, si hay una camara abierta)
            for (let i = 0; i < tab.length; i++) {
                if(tab[i].url.match("Crop")) {
                    camaraAbierta = true;
                }
            }
            if (camaraAbierta) {
                //Enviarle un mensaje al content script para reiniciar los contadores
                await chrome.tabs.sendMessage(tab[0].id, { reiniciar: true });
                console.log('Hay una camara abierta');
                reiniciarContadoresChromeAPI();
                actualizarContadores();
            }
            else {
                console.log('No hay camara abierta');
                reiniciarContadoresChromeAPI();
                actualizarContadores();
            }
        }
    }

    document.getElementById('btnReinciarContadores').addEventListener('click', reiniciarContadores);