<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <h3>
                Achtung!
              </h3>
            </slot>
          </div>
          {{ this.result.index }}
          <div class="modal-body">
            <h5 class="text-left">
              Handelt es sich bei Ihrer Eingabe um eine Person aus dieser Liste?
              Bitte prüfen Sie die Links und wählen Sie wenn möglich die
              korrekte Person aus oder lehnen Sie mit Klick auf "Nein" ab.
            </h5>
            <md-button
              class="md-simple md-just-icon md-round modal-default-button"
              @click="$emit('close')"
            >
              <md-icon>clear</md-icon>
            </md-button>

            <!-- Input from Fuseki -->
            <div
              class="md-layout md-layout-item md-size-100"
              v-for="(autor, i) in demoExistingAutor"
              :key="autor"
            >
              <md-radio :id="i" v-model="selection" :value="i"> </md-radio>
              <md-radio-label class="center-vertically" :for="i">
                {{ autor.nachname + ", " + autor.vorname + " – " }}
                <a :href="autor.url" target="_blank" v-html="autor.url"></a>
              </md-radio-label>
            </div>
          </div>

          <md-button
            style="margin-top: 2vh;"
            class="md-success"
            @click="emitYesResult()"
          >
            Ja
          </md-button>
          <md-button
            style="margin-top: 2vh; margin-left: 0.5vw;"
            class="md-danger"
            @click="emitNoResult()"
          >
            Nein
          </md-button>
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AutorSelectionPopUp",
  props: ["demoExistingAutor", "autorIndex"],
  data() {
    return {
      selection: -1,
      result: {
        autor: null,
        index: this.autorIndex,
      },
    };
  },
  methods: {
    emitYesResult() {
      this.result.autor = this.demoExistingAutor[this.selection];
      this.$emit("duplicateChecked", this.result);
      this.$emit("close");
    },
    emitNoResult() {
      this.$emit("duplicateChecked", this.result);
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
span {
  top: 35px;
}

.center-vertically {
  line-height: normal;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-left {
  text-align: left;
}
</style>
