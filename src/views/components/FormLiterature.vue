<template>
  <div v-if="role == 1 || role == 2">
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
        </div>

        <div
          class="md-layout md-gutter"
          style="border-color:#fcdd86; border-width: 3px; border-style: solid; border-radius: 10px; margin:3px;"
        >
          <div>
            <!-- Tabs -->
            <label>Hier Variable mit Literatur einfügen </label>

            <!-- Tabs -->
            <div>
              <button
                v-for="tab in tabs"
                :key="tab"
                :class="['tab-button', { active: currentTab === tab }]"
                @click="currentTab = tab"
              >
                {{ tab }}
              </button>
              <component :is="currentTabComponent" class="tab" />
            </div>
          </div>
        </div>
      </div>
      <div class="md-layout md-gutter">
        <div class="md-layout-item">
          <div>
            <md-button
              type="submit"
              :disabled="role != 1 && role != 2"
              >Änderung speichern</md-button
            >
            <md-button
              @click="resetData"
              :disabled="role != 1 && role != 2"
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
    "modMethodOrigin",
    "moduleUri",
    "role",
    "newBoolean",
    "code",
    "basicFilled"
  ],
  name: "literature",
  mixins: [validationMixin],
  directives: {
    sortable: {
      inserted: function(el, binding) {
        new Sortable(el, binding.value || {});
      }
    }
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
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    resetData() {
      this.initialState();
    },
    initialState() {
      this.existence = true;
      this.modMethod = [];
      this.modMethod = _.cloneDeep(this.modMethodOrigin);
      //this.$v.$reset();
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
