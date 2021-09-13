export default {
    methods: {
        showModal() {
            this.$refs["my-modal"].show();
        },
        continuar() {
            this.$router.replace({ name: "login" });
        }
    }
}