<template>
  <div v-if="role == 1 || role == 2">
    <!-- Literaturüberschrift -->
    <div style="text-align:left; font-size:26px;">
      <b>Literatur </b>
    </div>
    <form>
      <div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-100">
            <div
              class="alert alert-danger md-layout-item md-size-100"
              style="margin-top: 30px"
              v-if="newBoolean && !existence"
            >
              Bitte vervollständigen Sie zuerst die Rahmendaten!
            </div>
          </div>
          <!--
          <div class="md-layout-item md-size-80">
            <md-field>
              <label>Modulbezeichnung</label>
              <md-input
                v-if="modMethod.length > 0 && existence"
                v-model="modMethod[0].label.value"
                disabled
              />
              <md-input v-else disabled />
            </md-field>
          </div>
          -->
        </div>

        <!-- Gelber Rahmen -->
        <div
          class="md-layout md-gutter"
          style="border-color:#fcdd86; border-width: 3px; border-style: solid; border-radius: 10px; margin:3px;"
        >
          <!-- Ausgabe der SPARQL-Daten in Inputs -->
          <div>
            <!-- Hier soll die SPARQL-Ausgabe hin -->
            <div class="md-layout-item md-size-80">
              <md-field>
                <label>Modulbezeichnung</label>
                <md-input
                  v-if="modLiterature.length > 0 && existence"
                  v-model="modLiterature[0].label.value"
                  disabled
                />
                <md-input v-else disabled />
              </md-field>
            </div>
            <div>
              <!-- Simple Tabelle => Nur Test, am Ende wieder löschen! -->
              <table style="width:100%">
                <tr>
                  <td>
                    <md-field>
                      <label>Titel</label>
                      <md-input v-model="modLiterature[0].titel.value"
                    /></md-field>
                  </td>
                  <td>
                    <md-field>
                      <label>Auflage</label>
                      <md-input v-model="modLiterature[0].auflage.value"
                    /></md-field>
                  </td>
                  <td>
                    <md-field>
                      <label>Autor</label>
                      <md-input v-model="modLiterature[0].autorLabel.value"
                    /></md-field>
                  </td>
                </tr>
                <tr>
                  <td>
                    <md-field
                      ><md-input v-model="modLiterature[1].titel.value"
                    /></md-field>
                  </td>
                  <td>
                    <md-field
                      ><md-input v-model="modLiterature[1].auflage.value"
                    /></md-field>
                  </td>
                  <td>
                    <md-field
                      ><md-input v-model="modLiterature[1].autorLabel.value"
                    /></md-field>
                  </td>
                </tr>
                <tr>
                  <td>
                    <md-field
                      ><md-input v-model="modLiterature[2].titel.value"
                    /></md-field>
                  </td>
                  <td>
                    <md-field
                      ><md-input v-model="modLiterature[2].auflage.value"
                    /></md-field>
                  </td>
                  <td>
                    <md-field
                      ><md-input v-model="modLiterature[2].autorLabel.value"
                    /></md-field>
                  </td>
                </tr>
              </table>
            </div>
            <br />
            <div>
              <!-- Tab-Control -->
              <div>
                <button
                  v-for="tab in tabs"
                  :key="tab"
                  :class="['tab-button', { active: currentTab === tab }]"
                  @click="currentTab = tab"
                >
                  {{ tab }}
                </button>
                <!-- Subview laden -->
                <component :is="currentTabComponent" class="tab" />
              </div>
            </div>
            <br /><br />
            <div>
              <!-- Text-Ausgabe JSON-->
              <span v-once>JSON-Ausgabe: {{ this.modLiterature }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Buttons -->
      <div class="md-layout md-gutter">
        <div class="md-layout-item">
          <div>
            <md-button type="submit" :disabled="role != 1 && role != 2"
              >Änderung speichern</md-button
            >
            <md-button @click="resetData" :disabled="role != 1 && role != 2"
              >Änderung verwerfen</md-button
            >
            <!--<md-button v-if="modOutcome.length > 0" @click="generatePDF">Download</md-button>-->
            <transition name="fade">
              <div class="alert alert-success" v-if="notification">
                <div class="alert-icon">
                  <md-icon>check</md-icon>
                </div>
                Änderungen gespeichert!
              </div>
            </transition>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import FormLiteratureDOI from "./FormLiteratureDOI";
import FormLiteratureISBN from "./FormLiteratureISBN";
import FormLiteratureManual from "./FormLiteratureManual";
import { validationMixin } from "vuelidate";
import { alphaNum, required } from "vuelidate/lib/validators";
import Sortable from "sortablejs";

console.log(FormLiteratureDOI);

export default {
  components: {
    FormLiteratureDOI,
    FormLiteratureISBN,
    FormLiteratureManual,
  },
  props: [
    "modLiteratureOrigin",
    "moduleUri",
    "role",
    "newBoolean",
    "code",
    "basicFilled",
  ],
  name: "literature",
  mixins: [validationMixin],
  directives: {
    sortable: {
      inserted: function(el, binding) {
        new Sortable(el, binding.value || {});
      },
    },
  },
  data() {
    return {
      modLiterature: [],
      currentTab: "DOI",
      tabs: ["DOI", "ISBN", "Manual"],
      existence: true,
      notification: false,
      modMethod: [],
    };
  },
  computed: {
    currentTabComponent() {
      return "FormLiterature" + this.currentTab;
    },
  },
  mounted() {
    this.initialState();
  },
  methods: {
    validateInput() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.updateData();
      }
    },
    getValidationClass(fieldName) {
      const field = this.$v[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    resetData() {
      this.initialState();
    },
    initialState() {
      this.existence = true;
      this.modLiterature = [];
      this.delete = [];
      this.insert = [];
      this.where = [];
      this.modLiterature = _.cloneDeep(this.modLiteratureOrigin);
      // Log-Ausgabe
      console.log(this.modLiterature);
      //if (this.newBoolean) {
      // this.checkModule();
      //}
      //this.$v.$reset();
    },
    updateData() {
      // für SPARQL-DataUpdate
      /*axios
         .post(
           "http://fbwsvcdev.fh-brandenburg.de:8080/fuseki/modcat/update",
           query,
           {
             headers: { "Content-Type": "application/sparql-update" }
           }
         )
         .then(response => {
           let status = response.status;
           if (status == 204) {
             this.notification = true;
             setTimeout(() => {
               this.notification = false;
             }, 2000);
           }
           this.clearCache();
         })
         .catch(e => {
           this.errors.push(e);
         }); */
    },
  },
  watch: {
    modLiteratureOrigin(v) {
      this.initialState();
    },
  },
};
</script>

<style scoped>
.tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.tab-button:hover {
  background: #e0e0e0;
}
.tab-button.active {
  background: #e0e0e0;
}
.tab {
  border: 1px solid #ccc;
  padding: 10px;
}
.md-suffix {
  font-size: 12px !important;
  font-family: "Dosis", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
}
input {
  width: 100%;
}
span {
  top: 32px;
  padding: 0;
}
</style>
