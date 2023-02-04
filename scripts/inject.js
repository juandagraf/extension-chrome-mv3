const url = window.location.href;
const cantidadServers = 39;
let existeUrl = true;

for (i = 1; i <= cantidadServers; i++) {
    let palabra = "multas";
    palabra = palabra + i;
    if (url.match(palabra)) {
        existeUrl = true;
        break;
    }
}

if (url.match("Crop") && existeUrl) {

    let multasLote = 0;
    let contadorQuitadas = 0;
    let linkMulta = $('#ShowMultaImg').attr('src');
    let guardado = false;
    let LOTE = messages.length;

    const _botonLeft = document.getElementById('left');
    const _botonRight = document.getElementById('right');
    const _inputPatente = document.getElementById('patente');
    const quitBt = document.getElementById('quitar');
    const _multaImg = document.getElementById('ShowMultaImg');

    observeElement(_inputPatente, "value", function (oldValue, newValue) {
        if (oldValue == "" && newValue == "-") {
            _inputPatente.value = "";
        }
    });

    function observeElement(element, property, callback, delay = 0) {
        let elementPrototype = Object.getPrototypeOf(element);
        if (elementPrototype.hasOwnProperty(property)) {
            let descriptor = Object.getOwnPropertyDescriptor(elementPrototype, property);
            Object.defineProperty(element, property, {
                get: function () {
                    return descriptor.get.apply(this, arguments);
                },
                set: function () {
                    let oldValue = this[property];
                    descriptor.set.apply(this, arguments);
                    let newValue = this[property];
                    if (typeof callback == "function") {
                        setTimeout(callback.bind(this, oldValue, newValue), delay);
                    }
                    return newValue;
                }
            });
        }
    }

    //posicionarMenuPatente();
    _inputPatente.value = "";

    // #####################
    // ## Event Listeners ##
    // #####################

    //Abrir imagen de multa al hacer click
    _multaImg.addEventListener('click', () => {
        window.open(linkMulta, "_blank");
    });

    _botonLeft.addEventListener('click', function () {
        getMultaImgSrc();
    });
    _botonRight.addEventListener('click', function () {
        getMultaImgSrc();
    });

    //Transforma el input de la patente a mayusculas
    _inputPatente.addEventListener('keypress', function (e) {
        forceKeyPressUppercase(e);
    });

    quitBt.addEventListener('click', function () {
        contadorQuitadas++;
        contQuit.innerHTML = contadorQuitadas;
    });

    //Aviso al intentar recargar la pagina (evita cerrar la pagina por error)
    window.addEventListener("beforeunload", function (e) {

        if ((messages.length <= 0)) {
            guardar().then(
              history.back()
            );        
        }
        else if (messages.length < 5) {
            LOTE -= messages.length;
            guardar().then(
              history.back()
            );
        }
        else {
            var confirmationMessage = "\o/";
            (e || window.event).returnValue = confirmationMessage; // Gecko + IE
            return confirmationMessage; // Webkit, Safari, Chrome
        }
    });

    //  ###################
    //  #### Funciones ####
    //  ###################
    function abrirMultaNuevaVentana() {
        window.open(linkMulta, "_blank");
    }

    function forceKeyPressUppercase(e) {
        let el = e.target;
        let charInput = e.keyCode;
        if ((charInput >= 97) && (charInput <= 122)) { // lowercase
            if (!e.ctrlKey && !e.metaKey && !e.altKey) { // no modifier key
                let newChar = charInput - 32;
                let start = el.selectionStart;
                let end = el.selectionEnd;
                el.value = el.value.substring(0, start) + String.fromCharCode(newChar) + el.value.substring(end);
                el.setSelectionRange(start + 1, start + 1);
                e.preventDefault();
            }
        }
        else if (!(charInput >= 48 && charInput <= 57) && !(charInput >= 65 && charInput <= 90)) { //no permitir todo lo que no sean nros
            let start = el.selectionStart;
            let end = el.selectionEnd;
            el.value = el.value.substring(0, start) + el.value.substring(end);
            el.setSelectionRange(start + 1, start + 1);
            e.preventDefault();
        }
    }

    function getMultaImgSrc() {
        linkMulta = $('#ShowMultaImg').attr('src');
    }

    //Abrir imagen de multa al hacer click
    _multaImg.addEventListener('click', () => {
        window.open(linkMulta, "_blank");
    });

    async function guardar() {
        if (!guardado) {
            guardado = true;
            //Menos 1 porque el contador se suma despues de hacer la cuenta
            multasLote = LOTE - contadorQuitadas - 1;

            document.dispatchEvent(new CustomEvent('RW759_connectExtension', {
                detail: {
                    multas: multasLote,
                }
            }));
        }
    }

/*
    function posicionarMenuPatente() {
        $('div.input-group').css({
            "position": "absolute",
            "top": "410px",
            "left": "400px"
        });
        $('div.input-group').attr('id', 'mydiv');
        $('span.input-group-addon.user-color').attr('id', 'mydivheader');
    }
*/
    function eliminarGuion(e) {
        if (e.target.value == "-") {
            e.target.value = "";
        }
    }

/*
    //###########################################################
    //### Codigo para arrastrar el menu de ingreso de patente ###
    //###########################################################
    // W3School Drag Element

    dragElement(document.getElementById("mydiv"));

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    */
    console.log('Inyectado..');
}