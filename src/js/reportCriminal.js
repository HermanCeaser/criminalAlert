export default {
    methods: {
        emptyInputSearchData: function (colonia, calle, numero, postal) {

            var coloniaWhiteSpaces = colonia.split(' ').join('');
            var calleWhiteSpaces = calle.split(' ').join('');
            var validationRule = /^\S{3,}$/;

            if (this.validateEmptyInputs(validationRule, coloniaWhiteSpaces, calleWhiteSpaces)) return true;

            if (this.validateAllInputs(colonia, calle, numero, postal)) return true;

            if (this.validateAddress(colonia, calle)) return true;

            if (this.validateNumbers(numero, postal)) return true;

            if (this.valiteNegativeNumbers(numero, postal)) return true;

            if (this.validateLongNumbers(numero, postal)) return true;

            if (this.validateDecimalNumbers(numero, postal)) return true;


            return false;
        },

        validateDecimalNumbers: function (numero, postal) {
            if ((numero % 1) != 0 || (postal % 1) != 0) {
                this.createNoticeMessage(1)
                return true;
            }
            return false;
        },

        validateLongNumbers: function (numero, postal) {
            if (numero.toString().length > 10 || postal.toString().length > 6) {
                this.createNoticeMessage(2)
                return true;
            }
            return false;
        },

        validateEmptyInputs: function (validationRule, coloniaWhiteSpaces, calleWhiteSpaces) {
            if (!validationRule.test(coloniaWhiteSpaces) || !validationRule.test(calleWhiteSpaces)) {
                this.createNoticeMessage(3)
                return true;
            }
            return false;
        },

        valiteNegativeNumbers: function (numero, postal) {
            if (numero < 0 || postal < 0) {
                this.createNoticeMessage(4)
                return true;
            }
            return false;
        },

        validateNumbers: function (numero, postal) {
            if (isNaN(numero) || isNaN(postal)) {
                this.createNoticeMessage(5)
                return true;
            }
            return false;
        },

        validateAllInputs: function (colonia, calle, numero, postal) {
            if (!colonia || !calle || !numero || !postal) {
                this.dismissCountDown = this.dismissSecs;
                this.imputSearchMsm =
                    "Debe ingresar todos los campos para poder buscar";
                return true;
            }
            return false;
        },

        createNoticeMessage: function (value) {
            this.dismissCountDown = this.dismissSecs;
            switch (value) {
                case 1:
                    this.imputSearchMsm =
                        "No se permiten valores decimales en el numero o codigo postal ";
                    break;
                case 2:
                    this.imputSearchMsm =
                        "No se permiten valores grandes en el numero o codigo postal ";
                    break;
                case 3:
                    this.imputSearchMsm =
                        "No se permite campos vacíos, ingresar todos los campos para poder buscar";
                    break;
                case 4:
                    this.imputSearchMsm =
                        "No se permiten valores negativos en el numero o codigo postal ";
                    break;
                case 5:
                    this.imputSearchMsm =
                        "Debe ingresar valores numericos en el numero  y codigo postal";
                    break;
                default:
                    this.imputSearchMsm =
                        "Error on value";
                    break;
            }
        },

        validateAddress: function (colonia, calle) {
            //chek is the param colonia and calle are url's links
            const invalidColinia = colonia.match(
                /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
            );
            const invalidCalle = calle.match(
                /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
            );
            if (invalidColinia != null || invalidCalle != null) {
                this.dismissCountDown = this.dismissSecs;
                this.imputSearchMsm =
                    "Debe ingresar una direccion o colonia, validos";
                return true;
            }
            return false;
        },

        referenceVerification: function (referencia = "google.com") {
            if (!isNaN(referencia)) {
                this.inputMsm =
                    "Debe ingresar  url valido para continuar";
                return false;
            }
            const result = referencia.match(
                /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
            );
            if (result == null) {
                this.inputMsm =
                    "Debe ingresar  url valido para continuar";
                return false;
            }

            if (!result.toString().toLowerCase().includes('tijuana')) {
                this.inputMsm =
                    "url ingresado no cumple con nuestras normas, url debe ser de una pagina de noticieros de  tijuana por ejemplo:zetatijuana, elsoldetijuana, tijuanainformativo, elimparcial, afntijuana, milenio";
                return false;
            }

            if ((result.toString().toLowerCase().includes('zetatijuana') ||
                result.toString().toLowerCase().includes('elsoldetijuana') ||
                result.toString().toLowerCase().includes('tijuanainformativo') ||
                result.toString().toLowerCase().includes('elimparcial') ||
                result.toString().toLowerCase().includes('alfredoalvarez') ||
                result.toString().toLowerCase().includes('afntijuana') ||
                result.toString().toLowerCase().includes('milenio')) == false) {
                this.inputMsm =
                    "url ingresado no cumple con nuestras normas, url debe ser de una pagina de noticieros de  tijuana por ejemplo:zetatijuana, elsoldetijuana, tijuanainformativo, elimparcial, afntijuana, milenio";
                return false;
            }

            if (window.location.href.indexOf("franky") > -1) {
                alert("your url contains the name franky");
            }

            return true;
        },
        countDownChanged: function (dismissCountDown) {
            this.dismissCountDown = dismissCountDown;
        },
        countDownFormChanged: function (dismissFormCount) {
            this.dismissFormCount = dismissFormCount;
        },
        cleanForm: function () {
            this.formData.colonia = "";
            this.formData.calle = "";
            this.formData.numero = "";
            this.formData.postal = "";
            this.formData.nameCri = "";
            this.formData.descripcion = "";
            this.formData.fecha = "";
            this.formData.hora = "";
            this.selected = "";
            this.formData.referencia = "";
            this.savedLocations = [];
            this.selectedType = '';
            this.selectedSex = '';
        },
        showToast: function () {
            // Use a shorter name for this.$createElement
            const h = this.$createElement;
            // Increment the toast count
            this.count++;
            // Create the message
            const vNodesMsg = h("p", { class: ["text-center", "mb-0"] }, [
                h("b-spinner", { props: { type: "grow", small: true } }),
                " Registro ",
                h("strong", "exitoso!"),
                ` # ${this.count} `,
                h("b-spinner", { props: { type: "grow", small: true } }),
            ]);
            // Create the title
            const vNodesTitle = h(
                "div",
                { class: ["d-flex", "flex-grow-1", "align-items-baseline", "mr-2"] },
                [
                    h("strong", { class: "mr-2" }, "The Title"),
                    h("small", { class: "ml-auto text-italics" }, "42 seconds ago"),
                ]
            );
            // Pass the VNodes as an array for message and title
            this.$bvToast.toast([vNodesMsg], {
                title: [vNodesTitle],
                solid: true,
                variant: "info",
            });
        },
    }
}