export default {
  methods: {
    setUserData() {
      this.userRef
        .get()
        .then(doc => {
          if (doc.exists) {
            this.userData.nick = doc.data().nick;
            this.userData.correo = doc.data().correo;
            this.userData.reportes = doc.data().reportes;
            this.userData.avatar = doc.data().avatar;
            if (!this.showTop && !this.userTemp.emailVerified) {
              //nunca se va a ejecutar
              this.showToast();
            }
          }
        })
        .catch(error => {
          console.log("Error getting document:", error);
        });
    },
    shelfToggle() {
      this.isShelfOpen = !this.isShelfOpen;
    },
    onFileSelected() {
      this.selectedFile = event.target.files[0];
    },
    editContent() {
      if (!this.isEditing) {
        this.isEditing = !this.isEditing;
        this.isShelfOpen = true;
      } else {
        this.isEditing = !this.isEditing;
        this.isShelfOpen = false;
        this.loadingData = true;
        const res = this.userRef
          .update({
            nick: this.userData.nick
          })
          .then(() => {
            this.$bvToast.show("my-toast");
            this.loadingData = false;
          })
          .catch(error => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      }
    },
    saveUserComments: function() {
      this.loadingDataComment = true;

      if (!this.comment && !this.valueRating) {
        this.loadingDataComment = false;
        alert("Debe ingresar los campos para guardar!");
        return;
      }

      const res = this.userRef;
      if (!this.comment && this.valueRating != 0) {
        res
          .update({
            calificación: this.valueRating
          })
          .then(() => {
            this.$bvToast.show("my-toast");
            this.loadingDataComment = false;
          })
          .catch(error => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
            this.loadingDataComment = false;
          });
      } else if (this.valueRating == 0 && this.comment) {
        res
          .update({
            comentario: this.comment
          })
          .then(() => {
            this.$bvToast.show("my-toast");
            this.loadingDataComment = false;
          })
          .catch(error => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
            this.loadingDataComment = false;
          });
      } else if (this.valueRating != 0 && this.comment) {
        res
          .update({
            comentario: this.comment,
            calificación: this.valueRating
          })
          .then(() => {
            this.$bvToast.show("my-toast");
            this.loadingDataComment = false;
          })
          .catch(error => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
            this.loadingDataComment = false;
          });
      }
    },
    onRowSelected(items) {
      this.selected = items;
    },
    closeModal() {
      this.$refs.selectableTable.clearSelected();
      this.$refs["my-modal"].hide();
    },
    showModal() {
      this.$refs["my-modal"].show();
    }
    /*showToast() {//remover
            const h = this.$createElement;
            const id = this.toastId;
            const vNodesTitle = h(
                "div",
                { class: ["d-flex", "flex-grow-1", "align-items-baseline", "mr-2"] },
                [h("strong", { class: "mr-2" }, "Su correo aún no ha sido verificado!")]
            );

            // Create the custom  button
            const $closeButton = h(
                "b-button",
                {
                    on: { click: () => this.sendEmail() },
                },
                [h("strong", { class: "mr-2" }, "Enviar correo de verificación")],
                "enviar"
            );
            // Create the toast
            this.$bvToast.toast([$closeButton], {
                id: id,
                title: [vNodesTitle],
                solid: true,
                variant: "danger",
            });
        },*/
    /*sendEmail() {//remover
            this.$bvToast.hide(this.toastId);
            const h = this.$createElement;
            const vNodesMsg = h("p", { class: ["text-center", "mb-0"] }, [
                h("strong", "Correo enviado!"),
            ]);
            this.$bvToast.toast([vNodesMsg], {
                title: "Estatus",
                solid: true,
                variant: "success",
            });
            let user = firebase.auth().currentUser;
            user
                .sendEmailVerification()
                .then(() => { })
                .catch((error) => (this.error = error));
        },*/
  }
};
