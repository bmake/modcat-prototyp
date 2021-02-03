<template>
  <div v-if="role == 1 || role == 2">
    <!-- Literaturüberschrift -->
    <div style="text-align:left; font-size:26px;">
      <b>Literatur </b>
    </div>
    <form @submit.prevent="">
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
          <!-- Ausgabe des ausgewählten Moduls (außerhalb des gelben Rahmens) -->
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
        </div>

        <!-- Gelber Rahmen -->
        <div
          class="md-layout md-gutter"
          style="border-color:#fcdd86; border-width: 3px; border-style: solid; border-radius: 10px; margin:3px;"
        >
          <!-- Ausgabe der SPARQL-Daten in Inputs -->
          <div class="md-layout-item md-size-100">
            <!-- 
               <div> 
                 <md-input v-model="modLiterature[0].titel.value"/> 
               </div>-->

            <!-- Literatur-Block (Zusammenfassung) -->
            <div v-for="literature in literatureHeadings" :key="literature">
              <!-- {{ literature.titel.value }} -->
              <md-field class="literatureHeading">
                <p v-html="literature"></p>
              </md-field>
            </div>

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

            <!-- Ausgeklappte Anzeige einer Literatur -->
            <!-- var "detailAnsicht" ist der Schalter für Anzeige -->
            <div v-if="(detailAnsicht = true)">
              <label> Ausgeklappte Anzeige einer Literatur</label>
              <!-- Titel -->
              <div class="md-size-100">
                <md-field>
                  <label>Titel</label>
                  <md-input
                    v-if="modLiterature.length > 0 && existence"
                    v-model="modLiterature[0].titel.value"
                    disabled
                  />
                  <md-input v-else disabled />
                </md-field>
              </div>
              <!-- ISBN -->
              <div class="md-size-100">
                <md-field>
                  <label>ISBN</label>
                  <md-input
                    v-if="modLiterature.length > 0 && existence"
                    v-model="modLiterature[0].isbn.value"
                    disabled
                  />
                  <md-input v-else disabled />
                </md-field>
              </div>
              <!-- Herausgeber/ Verlag -->
              <!-- Hier kommen noch dieverse Fehler, wie Existenz von Publisher besser prüfen? -->
              <div
                class="md-size-100"
                v-if="
                  modLiterature.length > 0 &&
                    modLiterature[5].hasOwnProperty('publisherName')
                "
              >
                <md-field>
                  <label>Herausgeber/ Verlag</label>
                  <md-input v-model="modLiterature[5].publisherName.value" />
                </md-field>
              </div>

              <!-- Veröffentlichung -->
              <div class="md-size-100">
                <md-field>
                  <label>Veröffentlichung</label>
                  <md-input
                    v-if="modLiterature.length > 0 && existence"
                    v-model="modLiterature[0].datePublished.value"
                    disabled
                  />
                  <md-input v-else disabled />
                </md-field>
              </div>
              <!-- Auflage -->
              <div class="md-size-100">
                <md-field>
                  <label>Auflage</label>
                  <md-input
                    v-if="modLiterature.length > 0 && existence"
                    v-model="modLiterature[0].auflage.value"
                    disabled
                  />
                  <md-input v-else disabled />
                </md-field>
              </div>
              <!-- URL z.B. OPAC-Link, Springer-Link oder arxiv-Link -->
              <!-- 
                <div class="md-layout-item md-size-100">
                    <md-field>
                      <label>URL</label>
                      <md-input
                          v-if="modLiterature.length > 0 && existence"
                          v-model="modLiterature[0].url.value"
                          disabled
                        />
                      <md-input v-else disabled />
                    </md-field>
                </div>
                -->
              <!-- DOI-Link (Identifier nicht ausgeben, aber DOI-Link, wenn vorhanden) -->
              <!-- 
                <div class="md-layout-item md-size-100">
                    <md-field>
                      <label>DOI</label>
                      <md-input
                          v-if="modLiterature.length > 0 && existence"
                          v-model="modLiterature[0].litIdentifier.value"
                          disabled
                        />
                      <md-input v-else disabled />
                    </md-field>
                </div>
                -->
              <!-- Autoren/innen -->
              <div class="md-size-100">
                <label>Autoren/innen</label>
                <div class="md-layout md-gutter">
                  <!-- Nachname -->
                  <div class="md-layout-item md-size-20">
                    <md-field>
                      <label>Nachname</label>
                      <md-input
                        v-if="modLiterature.length > 0 && existence"
                        v-model="modLiterature[0].autorNachname.value"
                        disabled
                      />
                      <md-input v-else disabled />
                    </md-field>
                  </div>
                  <!-- Vorname -->
                  <div class="md-layout-item md-size-20">
                    <md-field>
                      <label>Vorname</label>
                      <md-input
                        v-if="modLiterature.length > 0 && existence"
                        v-model="modLiterature[0].autorVorname.value"
                        disabled
                      />
                      <md-input v-else disabled />
                    </md-field>
                  </div>
                  <!-- URL/ Profil-Link -->
                  <div class="md-layout-item md-size-60">
                    <md-field>
                      <label>Profil-Link/URL</label>
                      <md-input
                        v-if="modLiterature.length > 0 && existence"
                        v-model="modLiterature[0].autorUri.value"
                        disabled
                      />
                      <md-input v-else disabled />
                    </md-field>
                  </div>
                </div>
                <!-- ENDE Autoren/innen -->
                <!-- Autoren/innen -->
                <div class="md-layout md-gutter">
                  <!-- Nachname -->
                  <div class="md-layout-item md-size-20">
                    <md-field>
                      <label>Nachname</label>
                      <md-input
                        v-if="modLiterature.length > 0 && existence"
                        v-model="modLiterature[1].autorNachname.value"
                        disabled
                      />
                      <md-input v-else disabled />
                    </md-field>
                  </div>
                  <!-- Vorname -->
                  <div class="md-layout-item md-size-20">
                    <md-field>
                      <label>Vorname</label>
                      <md-input
                        v-if="modLiterature.length > 0 && existence"
                        v-model="modLiterature[1].autorVorname.value"
                        disabled
                      />
                      <md-input v-else disabled />
                    </md-field>
                  </div>
                  <!-- URL/ Profil-Link -->
                  <div class="md-layout-item md-size-60">
                    <md-field>
                      <label>Profil-Link/URL</label>
                      <md-input
                        v-if="modLiterature.length > 0 && existence"
                        v-model="modLiterature[1].autorUri.value"
                        disabled
                      />
                      <md-input v-else disabled />
                    </md-field>
                  </div>
                </div>
                <!-- ENDE Autoren/innen -->
                <div>{{ cleanedLiterature[1] }}</div>
              </div>
            </div>
            <div>
              <!-- Text-Ausgabe JSON-->
              <!-- 
              <span v-once>JSON-Ausgabe: {{ this.modLiterature }}</span>
              -->
            </div>
          </div>
          <!-- ENDE Gelber Rahmen -->
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
      detailAnsicht: true,
    };
  },
  computed: {
    // Current tab position for literature submission
    currentTabComponent() {
      return "FormLiterature" + this.currentTab;
    },
    // Clean raw Fuseki response (aggregate authors, merge duplicates)
    cleanedLiterature() {
      if (this.modLiteratureOrigin.length < 1) return [];

      let cleanedLiterature = [];

      for (let entry of this.modLiteratureOrigin) {
        // Get index of entry in cleanedLiterature array
        let indexInResult = cleanedLiterature
          .map((e) => e.literaturUri.value)
          .indexOf(entry.literaturUri.value);

        // index = -1 -> doesn't exist
        if (indexInResult < 0) {
          // Clone literature object
          let newEntry = JSON.parse(JSON.stringify(entry));

          // Build author object
          let autor = {
            autorVorname: newEntry.autorVorname,
            autorNachname: newEntry.autorNachname,
            autorUri: newEntry.autorUri,
          };

          // Restructure author part
          delete newEntry.autorVorname;
          delete newEntry.autorNachname;
          delete newEntry.autorUri;
          newEntry.autoren = [];
          newEntry.autoren.push(autor);

          // Append restructured literature entry
          cleanedLiterature.push(newEntry);

          // Literature already exists
        } else {
          let newAutor = {
            autorVorname: entry.autorVorname,
            autorNachname: entry.autorNachname,
            autorUri: entry.autorUri,
          };
          // Add next author to literature object
          cleanedLiterature[indexInResult].autoren.push(newAutor);
        }
      }
      return cleanedLiterature;
    },
    literatureHeadings() {
      let beschreibungen = [];
      let data = this.cleanedLiterature;

      for (let entry of data) {
        if (typeof entry.autoren[0].autorVorname === "undefined") continue;
        let autoren = entry.autoren
          .map(
            (autor) =>
              autor.autorNachname.value +
              ", " +
              autor.autorVorname.value.charAt(0) +
              "."
          )
          .join(", ");
        beschreibungen.push(
          autoren +
            ", " +
            entry.datePublished.value +
            ". " +
            entry.titel.value +
            ",<br><a href='" +
            entry.literaturUri.value +
            "'>" +
            entry.literaturUri.value +
            "</a>"
        );
      }
      return beschreibungen;
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
.literatureHeading {
  text-align: left;
}
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
