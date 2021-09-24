export default {
    methods: {
        validEmail: function (email) {
            var re =
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        mesajeVerificacion: function () {
            this.$router.replace({ name: "login" });
        },
        emailAlreadyUseMsm: function () {
            this.showDismissibleAlert = this.dismissSecs;
            this.alertMsm = 'Correo ingresado ya esta en uso'
        }
    }
}