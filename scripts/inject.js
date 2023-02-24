const url = window.location.href;

if (url.match("Crop")) {
    
    const _BotonLeft = document.getElementById('left');
    const _BotonRight = document.getElementById('right');
    const cloneBotonLeft = _BotonLeft.cloneNode(true);
    const cloneBotonRight = _BotonRight.cloneNode(true);
    _BotonLeft.parentElement.replaceChild(cloneBotonLeft, _BotonLeft);
    _BotonRight.parentElement.replaceChild(cloneBotonRight, _BotonRight);
    const nuevoScript = document.createElement('script');

    $(document).off('keydown');
    $(document).off('keypress');
    cambiarCodigo();

    let linkMulta = $('#ShowMultaImg').attr('src');
    const _inputPatente = document.getElementById('patente');
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

    _inputPatente.value = "";
    posicionarMenuPatente();

    // #####################
    // ## Event Listeners ##
    // #####################

    //Abrir imagen de multa al hacer click
    _multaImg.addEventListener('click', () => {
        window.open(linkMulta, "_blank");
    });

    cloneBotonLeft.addEventListener('click', function () {
        getMultaImgSrc();
    });
    cloneBotonRight.addEventListener('click', function () {
        getMultaImgSrc();
    });

    //Transforma el input de la patente a mayusculas
    _inputPatente.addEventListener('keypress', function (e) {
        forceKeyPressUppercase(e);
    });

    //Aviso al intentar recargar la pagina (evita cerrar la pagina por error)
    window.addEventListener("beforeunload", function (e) {
        var confirmationMessage = "\o/";
        if (messages.length > 5) {
            (e || window.event).returnValue = confirmationMessage; // Gecko + IE
            return confirmationMessage; // Webkit, Safari, Chrome
        }
        else {
            location.href = '/';
        }
        
    });

    //  ###################
    //  #### Funciones ####
    //  ###################
    function abrirMultaNuevaVentana() {
        window.open(linkMulta, "_blank");
    }

function posicionarMenuPatente() {
    $('div.input-group').css({
        "position": "absolute",
        "top": "404px",
        "left": "400px"
    });
}

    function cambiarCodigo() {

        let scripts = document.body.getElementsByTagName('script');
        const _script1 = document.createElement('script');
        
        _script1.innerHTML = "";
        nuevoScript.innerHTML = "";
        
        let codigo;
        let busqueda;
        let index;

        //Script tag 1
        codigo = scripts[0].innerHTML;
        busqueda = "$('#quitar').button('reset');\n";
        index = codigo.indexOf(busqueda);

        if (index !== -1) {    
            let output = codigo.slice(0, index + busqueda.length) + "document.dispatchEvent(new CustomEvent('RW759_connectExtension', {detail: {multa: 0,procesada: 1}}));" + codigo.slice(index + busqueda.length);
            _script1.innerHTML = output;
            if (_script1.innerHTML != "") {
                scripts[0].parentElement.replaceChild(_script1, scripts[0]);
            }
        }  

        //Script tag 2
        codigo = scripts[1].innerHTML;

        //Conseguir el bloque de codigo de $(document).keydown(function(e) que maneja el crop
        //y guardarlo para usarlo en una funcion
        let funcionCropTexto = "";
        try {
            let indexFin;
            let count = 0;
            busqueda = "$(document).keydown(function(e) {";
            index = codigo.indexOf(busqueda);
            let replace = `function doImageCrop(e) {`
            let output = replace + codigo.slice(index + busqueda.length, codigo.length);
            funcionCropTexto = output;
            indexFin = 0;
            busqueda = "});";
            //Buscar 2 coincidencias de busqueda
            while (count < 2 && indexFin !== -1) {
                indexFin = funcionCropTexto.indexOf(busqueda, indexFin + busqueda.length);
                count++;
            }
            //Eliminar todo el texto que sobre y quedarse solo con la funcion
            funcionCropTexto = funcionCropTexto.slice(0, indexFin-1) + "}";
            funcionCropTexto += "\n$(document).keydown(doImageCrop);";
        }
        catch (e) {
            console.log(e.message);
        }

         //Conseguir el bloque de codigo de $(document).keypress(function(e) que maneja el ingreso de patente
        //y guardarlo para usarlo en una funcion
        let funcionIngresoPatenteTexto = "";
        try {
            let indexFin;
            let count = 0;
            busqueda = "$(document).keypress(function(e) {";
            index = codigo.indexOf(busqueda);
            let replace = `function ingresoPatente(e) {`
            let output = replace + codigo.slice(index + busqueda.length, codigo.length);
            funcionIngresoPatenteTexto = output;
            indexFin = 0;
            busqueda = "});";
            //Buscar 3 coincidencias de busqueda
            while (count < 3 && indexFin !== -1) {
                indexFin = funcionIngresoPatenteTexto.indexOf(busqueda, indexFin + busqueda.length);
                count++;
            }
            //Eliminar todo el texto que sobre y quedarse solo con la funcion
            funcionIngresoPatenteTexto = funcionIngresoPatenteTexto.slice(0, indexFin-1) + "}";
            funcionIngresoPatenteTexto += "\n$(document).keypress(ingresoPatente);";
        }
        catch (e) {
            console.log(e.message);
        }

        //No admitir patentes empezadas en Q
        //No funciona
        try {
            busqueda = `if (rPatv.test($('#patente').val()) || rPatn.test($('#patente').val()) || rPatM.test($('#patente').val()) || rPatL.test($('#patente').val())) {\n`;
            index = funcionIngresoPatenteTexto.indexOf(busqueda);
            let add = `if($('#patente').val().startsWith('Q'))\n\treturn alert('NO EXISTEN PATENTES COMENZADAS CON "Q"');\n`;
            let output = funcionIngresoPatenteTexto.slice(0, index + busqueda.length) + add + funcionIngresoPatenteTexto.slice(index + busqueda.length);
            funcionIngresoPatenteTexto = output;
            console.log(output);
        }
        catch (e) {
            console.log(e.message);
        }

        busqueda = "let idsa = messages.indexOf(text.textContent);\n";
        index = funcionIngresoPatenteTexto.indexOf(busqueda);
        
        if (index !== -1) {    
            funcionIngresoPatenteTexto = funcionIngresoPatenteTexto.slice(0, index + busqueda.length) + "document.dispatchEvent(new CustomEvent('RW759_connectExtension', { detail: {multa: 1, procesada: 1}}));" + funcionIngresoPatenteTexto.slice(index + busqueda.length);
            nuevoScript.innerHTML = funcionCropTexto + "\n" + funcionIngresoPatenteTexto;
            scripts[0].parentElement.appendChild(nuevoScript);
        }
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

    function eliminarGuion(e) {
        if (e.target.value == "-") {
            e.target.value = "";
        }
    }
}