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
                  <md-input
                    v-model.trim="course"
                    name="course"
                    id="course"
                  ></md-input>
                  <span
                    style="margin-bottom: 20px"
                    class="md-error"
                    v-if="!$v.course.required"
                    >Sie müssen einen Modulkürzel eingeben</span
                  >
                  <!--<span
                    style="margin-bottom: 20px"
                    class="md-error"
                    v-if="this.space && $v.course.required"
                    >Leerzeichen sind nicht erlaubt</span
                  >-->
                  <span
                    style="margin-bottom: 20px"
                    class="md-error"
                    v-if="!$v.course.url && $v.course.required"
                    >Ungültige URL</span
                  >
                  <span
                    style="margin-bottom: 20px"
                    class="md-error"
                    v-if="!this.unique && $v.course.required && $v.course.url"
                    >Das eingegebene Kürzel ist schon vorhanden!</span
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
import { required, url, helpers } from "vuelidate/lib/validators";

//const touchMap = new WeakMap();

export default {
  name: "NewModulePopUp",
  mixins: [validationMixin],
  data() {
    return {
      studyProgram: null,
      course: null,
      unique: true,
      space: false,
      newModule: null,
      modBasic: null,
      modOutcome: null,
      modMethod: null,
      prefix: "https://bmake.th-brandenburg.de/module/"
    };
  },
  validations: {
    studyProgram: {
      required
    },
    course: {
      required,
      //url: url('https://bmake.th-brandenburg.de/module/' + value),
      url(value) {
        if (value === "" || value == null) {
          return true;
        } else {
          return url("https://bmake.th-brandenburg.de/module/" + value);
        }
      },
      /*hasSpace(value) {
        if (value === "" || value == null) {
          return true;
        } else {
          if (value.includes(" ")) {
            this.space = true;
            return false;
          } else {
            this.space = false;
            return true;
          }
        }
      },*/
      async isUnique(value) {
        if ((value === "" || value == null) && this.space) {
          return true;
        } else {
          let query =
            " PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
            " ASK  { <https://bmake.th-brandenburg.de/module/" +
            value +
            "> a module:Module .}";

          let boo = true;
          await axios
            .post(
              "http://fbw-sgmwi.th-brandenburg.de:3030/modcat/query",
              query,
              {
                headers: { "Content-Type": "application/sparql-query" }
              }
            )
            .then(response => {
              boo = !response.data.boolean;
              this.unique = boo;
            })
            .catch(e => {
              this.errors.push(e);
            });
          return Boolean(boo);
        }
        /*return this.checkExistence(value);*/
      }
    }
  },
  methods: {
    /*checkExistence(code) {
      let query =
        " PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        " ASK  { module:" +
        code +
        " a module:Module .}";

      let boo = true;
      axios
        .post("http://fbw-sgmwi.th-brandenburg.de:3030/modcat/query", query, {
          headers: { "Content-Type": "application/sparql-query" }
        })
        .then(response => {
          boo = !response.data.boolean;
          this.unique = boo;
        })
        .catch(e => {
          this.errors.push(e);
        });

      return Boolean(boo);
    },*/
    getValidationClass(fieldName) {
      //console.log("fieldName", this.$v[fieldName])
      const field = this.$v[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    generateEmptyArray() {
      this.newModule = this.course;
      this.modBasic = [
        {
          code: { type: "literal", value: this.course },
          label: { type: "literal", value: "" },
          accPerson: { type: "uri", value: "" },
          semester: { type: "uri", value: "" },
          modType_name: { type: "literal", value: "" },
          grade_name: { type: "literal", value: "" },
          learnTypes: { type: "literal", value: [] },
          eduUse: { type: "literal", value: "" },
          swsSum: { type: "literal", value: "" },
          ects: { type: "literal", value: "" },
          duration: { type: "literal", value: "" },
          courseMode: { type: "literal", value: "" },
          pre: { type: "literal", value: "" },
          url: { type: "literal", value: "" },
          comment: { type: "literal", value: "" },
          languages: { type: "literal", value: [] }
        }
      ];
      this.modOutcome = [
        {
          code: { type: "literal", value: this.course },
          label: { type: "literal", value: "" },
          learnBlooms: { type: "literal", value: [] },
          contents: { type: "literal", value: [] }, //Array in Array ["Sie beherrschen...", "Apply"]
          exams: { type: "literal", value: [] }
        }
      ];
      this.modMethod = [
        {
          code: { type: "literal", value: this.course },
          label: { type: "literal", value: "" },
          interTypes: { type: "literal", value: [] }, //String array
          workloadSum: {
            type: "literal",
            datatype: "http://www.w3.org/2001/XMLSchema#integer",
            value: ""
          },
          workloadDetails: { type: "literal", value: [] }
        } //array in array ["xxx", 40]
      ];
    },
    validateInput() {
      /*this.$v.$reset()
      if (touchMap.has(this.$v)) {
        clearTimeout(touchMap.get(this.$v))
      }
      touchMap.set(this.$v, setTimeout(this.$v.$touch, 1000))*/

      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.generateEmptyArray();

        //this.$emit('close');
      }
    }
  },
  watch: {
    newModule: {
      handler(v) {
        //console.log("module", v);
        let m = "https://bmake.th-brandenburg.de/module/" + v;
        this.$emit("module", m);
        this.$emit("code", v);
        this.$emit("newBoolean", true);
      }
    },
    modBasic: {
      handler(v) {
        if (this.modBasic.length > 0) {
          //console.log("modBasicData", v);
          this.$emit("modBasicData", v);
          this.$emit("studyProgram", this.studyProgram);
          this.$emit("close");
        }
      }
    }
    /*modOutcome(v) {
      //this.$emit("modOutcomes", v);
    },
    modMethod(v) {
      //this.$emit("modMethods", v);
    }*/
  }
};
</script>

<style lang="scss" scoped>
span {
  top: 35px;
}
</style>
