<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <h3>Neues Modul anlegen</h3>
            </slot>
          </div>

          <div class="modal-body">
            <md-button
              class="md-simple md-just-icon md-round modal-default-button"
              @click="$emit('close')"
            >
              <md-icon>clear</md-icon>
            </md-button>
            <form novalidate class="md-layout" @submit.prevent="validateInput">
              <div class="md-layout-item md-size-100">
                <md-field :class="getValidationClass('studyProgram')">
                  <label>Bitte wählen Sie einen Studiengang aus</label>
                  <md-select
                    v-model="studyProgram"
                    name="studyProgram"
                    id="studyProgram"
                  >
                    <md-option value="WIB">WI Bachelor</md-option>
                    <md-option value="WIM">WI Master</md-option>
                    <md-option value="BWLB">BWL Bachelor</md-option>
                    <md-option value="BWLM">BWL Master</md-option>
                  </md-select>
                  <span class="md-error" v-if="!$v.studyProgram.required"
                    >Sie müssen einen Studiengang auswählen</span
                  >
                </md-field>
              </div>

              <div style="margin-top: 15px" class="md-layout-item  md-size-100">
                <md-field :class="getValidationClass('course')">
                  <label>Modulkürzel</label>
                  <span class="md-prefix" style="font-size: x-small"
                    >https://bmake.th-brandenburg.de/module/</span
                  >
                  <md-input v-model.trim="course" name="course" id="course" />
                  <span
                    style="margin-bottom: 20px"
                    class="md-error"
                    v-if="!$v.course.required"
                    >Sie müssen einen Modulkürzel eingeben</span
                  >
                  <span
                    style="margin-bottom: 20px"
                    class="md-error"
                    v-if="!$v.course.isUnique"
                    >Der eingegebene Kürzel ist schon vorhanden!</span
                  >
                </md-field>
              </div>

              <md-button
                style="margin-top: 30px"
                type="submit"
                class="md-primary"
              >
                OK
              </md-button>
            </form>
          </div>

          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

//const touchMap = new WeakMap()

export default {
  name: "NewModulePopUp",
  mixins: [validationMixin],
  data() {
    return {
      studyProgram: null,
      course: null
    };
  },
  validations: {
    studyProgram: {
      required
    },
    course: {
      required,
      async isUnique(value) {
        if (value === "" || value == null) return true;

        let query =
          " PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
          " ASK  { module:" +
          value +
          " a module:Module .}";

        let boo = true
        await axios
          .post("http://fbw-sgmwi.th-brandenburg.de:3030/modcat/query", query, {
            headers: { "Content-Type": "application/sparql-query" }
          })
          .then(response => {
            boo = !response.data.boolean;
            console.log(boo);
          })
          .catch(e => {
            this.errors.push(e);
          });
        return Boolean(await boo)
      }
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    validateInput() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.$emit("close");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
span {
  top: 35px;
}
</style>
