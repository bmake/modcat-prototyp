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
          <div class="md-size-100">
            <!-- 
               <div> 
                 <md-input v-model="modLiterature[0].titel.value"/> 
               </div>-->

            <!-- Literatur-Block (Zusammenfassung) 
            v-if="cleanedLiterature[index].hasOwnProperty('publisherName')">
            -->
            <dl
              class="md-layout-item md-size-100 literatureHeading"
              style="margin-bottom: 10px"
              v-for="(literature, i) in cleanedLiterature"
              :key="literature"
            >
              <dt>
                <md-field>
                  <p v-html="literature.summary.value"></p>
                  <md-input></md-input>
                  <div>
                    <span>
                      <i
                        class="open"
                        @click="toggleLiterature('literature', i)"
                        v-show="cleanedLiterature[i].isHidden == true"
                      >
                        ▼
                      </i>
                      <i
                        class="close"
                        @click="toggleLiterature('literature', i)"
                        v-show="cleanedLiterature[i].isHidden == false"
                      >
                        ▲
                      </i>
                      <i
                        class="fas fa-minus-circle"
                        @click="removeLiterature(i)"
                        v-show="cleanedLiterature.length > 1"
                      />
                      <i
                        class="fas fa-plus-circle"
                        @click="isHidden = !isHidden"
                        v-show="i == cleanedLiterature.length - 1"
                      />
                      <i
                        class="handle fas fa-arrows-alt"
                        style="margin-left: 10px"
                      />
                    </span>
                  </div>
                </md-field>
              </dt>
              <dd v-if="cleanedLiterature[i].isHidden == false">
                <div
                  class="md-layout-item md-size-100 literatureHeading"
                  style="margin-bottom: 10px"
                >
                  <!-- Titel -->
                  <div
                    class="md-size-100"
                    v-if="literature.hasOwnProperty('titel')"
                  >
                    <md-field>
                      <label>Titel</label>
                      <md-input v-model="literature.titel.value" disabled />
                    </md-field>
                  </div>
                  <!-- ISBN -->
                  <div
                    class="md-size-100"
                    v-if="literature.hasOwnProperty('isbn')"
                  >
                    <md-field>
                      <label>ISBN</label>
                      <md-input v-model="literature.isbn.value" disabled />
                    </md-field>
                  </div>
                  <!-- Erschienen IN z.B. Journal -/->
                  <div class="md-size-100"
                       v-if="literature.hasOwnProperty('titelInBand')" >
                    <label>In</label>
                    <div class="md-layout md-gutter">
                      <!-/- Titel_IN -/->
                      <div class="md-layout-item md-size-60">
                        <md-field>
                          <label>Titel</label>
                          <md-input v-model="literature.titelInBand.value" disabled />
                        </md-field>
                      </div>
                      <!-/- Band_IN -/->
                      <div class="md-layout-item md-size-20">
                        <md-field>
                          <label>Band</label>
                           <md-input v-model="literature.volume.value" disabled />
                        </md-field>
                      </div>
                      <!-/- Jahr_IN -/->
                      <div class="md-layout-item md-size-20">
                        <md-field>
                          <label>Jahr</label>
                          <md-input v-model="literature.pulishDate.value" disabled />
                        </md-field>
                      </div>
                    </div>
                  </div> -->
                  <!-- Herausgeber/ Verlag -->
                  <div
                    class="md-size-100"
                    v-if="literature.hasOwnProperty('publisherName')"
                  >
                    <md-field>
                      <label>Herausgeber/ Verlag</label>
                      <md-input
                        v-model="literature.publisherName.value"
                        disabled
                      />
                    </md-field>
                  </div>
                  <!-- Veröffentlichung -->
                  <div
                    class="md-size-100"
                    v-if="literature.hasOwnProperty('datePublished')"
                  >
                    <md-field>
                      <label>Veröffentlichung</label>
                      <md-input
                        v-model="literature.datePublished.value"
                        disabled
                      />
                    </md-field>
                  </div>
                  <!-- Auflage -->
                  <div
                    class="md-size-100"
                    v-if="literature.hasOwnProperty('auflage')"
                  >
                    <md-field>
                      <label>Auflage</label>
                      <md-input v-model="literature.auflage.value" disabled />
                    </md-field>
                  </div>
                  <!-- Artikel Seiten "von" - "bis" z.B. Journal-/->
                  <div class="md-size-100"
                       v-if="literature.hasOwnProperty('seitenVonInBand')" >
                    <div class="md-layout md-gutter">
                      <!-/- Seiten von -/->
                      <div class="md-layout-item md-size-50">
                        <md-field>
                          <label>Seiten von</label>
                          <md-input v-model="literature.pageStart.value" disabled />
                        </md-field>
                      </div>
                      <!-/- Seiten bis -/->
                      <div class="md-layout-item md-size-50">
                        <md-field>
                          <label>Seiten bis</label>
                          <md-input v-model="literature.pageEnd.value" disabled />
                        </md-field>
                      </div>
                    </div>
                  </div> -->
                  <!-- URL z.B. OPAC-Link, Springer-Link oder arxiv-Link -->
                  <div
                    class="md-size-100"
                    v-if="literature.hasOwnProperty('url')"
                  >
                    <md-field>
                      <label>URL</label>
                      <md-input v-model="literature.url.value" disabled />
                    </md-field>
                  </div>
                  <!-- DOI-Link (Identifier nicht ausgeben, aber DOI-Link, wenn vorhanden) -->
                  <div
                    class="md-size-100"
                    v-if="literature.hasOwnProperty('litIdentifier')"
                  >
                    <md-field>
                      <label>DOI</label>
                      <md-input
                        v-model="literature.litIdentifier.value"
                        disabled
                      />
                    </md-field>
                  </div>

                  <!-- Autoren/innen -->
                  <div
                    class="md-size-100"
                    v-if="literature.hasOwnProperty('autoren')"
                  >
                    <label>Autoren/innen</label>
                    <!-- v-for Autoren -->
                    <div
                      class="md-layout md-gutter"
                      v-for="autor in literature.autoren"
                      :key="autor"
                    >
                      <!-- Nachname -->
                      <div class="md-layout-item md-size-20">
                        <md-field>
                          <label>Nachname</label>
                          <md-input
                            v-model="autor.autorNachname.value"
                            disabled
                          />
                        </md-field>
                      </div>
                      <!-- Vorname -->
                      <div class="md-layout-item md-size-20">
                        <md-field>
                          <label>Vorname</label>
                          <md-input
                            v-model="autor.autorVorname.value"
                            disabled
                          />
                        </md-field>
                      </div>
                      <!-- URL/ Profil-Link -->
                      <div class="md-layout-item md-size-60">
                        <md-field>
                          <label>Profil-Link/URL</label>
                          <md-input
                            v-if="typeof autor.autorProfilLink == 'undefined'"
                            disabled
                          />
                          <md-input
                            v-else
                            v-model="autor.autorProfilLink.value"
                            disabled
                          />
                        </md-field>
                      </div>
                    </div>
                  </div>
                </div>
              </dd>
            </dl>
            <div class="md-layout-item md-size-100">
              <!-- Tab-Control -->
              <div
                v-if="
                  !isHidden ||
                    typeof this.modLiteratureOrigin[0].titel == 'undefined'
                "
              >
                <!-- Tab-Header -->
                <div>
                  <div class="left-center-vertically">
                    <button
                      v-for="tab in tabs"
                      :key="tab"
                      :class="['tab-button', { active: currentTab === tab }]"
                      @click="currentTab = tab"
                    >
                      {{ tab }}
                    </button>
                  </div>
                  <!--
                  <div class="left-center-vertically">
                    <span class="h4">Literatur einpflegen</span>
                  </div>
                  -->
                  <div style="clear: both;"></div>
                </div>

                <!-- Subview laden -->
                <component
                  :is="currentTabComponent"
                  :moduleUri="moduleUri"
                  @queryChanged="receiveInsertQuery"
                />
              </div>
              <br />
            </div>
          </div>
          <!-- ENDE Gelber Rahmen -->
        </div>
        <!-- Buttons -->
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <div>
              <md-button
                type="submit"
                @click="updateData"
                :disabled="role != 1 && role != 2"
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
import axios from "axios";

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
      prefixes:
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/>  ",
      modLiterature: [],
      currentTab: "DOI",
      tabs: ["DOI", "ISBN", "Manual"],
      existence: true,
      notification: false,
      modMethod: [],
      insertQuery: null,
      isHidden: true,
      deleteLitRef: "",
    };
  },
  computed: {
    // Current tab position for literature submission
    currentTabComponent() {
      return "FormLiterature" + this.currentTab;
    },
    // Clean raw Fuseki response (aggregate authors, merge duplicates)
    cleanedLiterature() {
      if (typeof this.modLiteratureOrigin[0].titel == "undefined") return [];

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

          if (!entry.hasOwnProperty("autorNachname")) {
            cleanedLiterature.push(newEntry);
            continue;
          }

          // Build author object
          let autor = {
            autorVorname: newEntry.autorVorname,
            autorNachname: newEntry.autorNachname,
            autorProfilLink: newEntry.autorProfilLink,
            autorUri: newEntry.autorUri,
          };

          // Restructure author part
          delete newEntry.autorVorname;
          delete newEntry.autorNachname;
          delete newEntry.autorProfilLink;
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
            autorProfilLink: entry.autorProfilLink,
            autorUri: entry.autorUri,
          };
          // Add next author to literature object
          cleanedLiterature[indexInResult].autoren.push(newAutor);
        }
      }

      // Attach summary and isHidden property
      cleanedLiterature.forEach((entry) => {
        entry.summary = {};
        entry.summary.type = "literal";
        entry.summary.value = this.getLiteratureHeading(entry);
        entry.isHidden = true;
      });
      return cleanedLiterature;
    },
  },
  mounted() {
    this.initialState();
  },
  methods: {
    removeLiterature(index) {
      //log
      this.deleteLiteratureRef(
        this.cleanedLiterature[index].literaturUri.value
      );
      this.cleanedLiterature.splice(index, 1);
      this.$forceUpdate();
    },
    toggleLiterature(input, index) {
      this.cleanedLiterature[index].isHidden = !this.cleanedLiterature[index]
        .isHidden;
      this.$forceUpdate();
    },
    receiveInsertQuery(query) {
      this.insertQuery = query;
    },
    getLiteratureHeading(literatureData) {
      let autoren = "";
      if (
        !literatureData.hasOwnProperty("autoren") &&
        literatureData.hasOwnProperty("publisherName")
      ) {
        autoren = literatureData.publisherName.value;
      } else if (
        !literatureData.hasOwnProperty("autoren") &&
        !literatureData.hasOwnProperty("publisherName")
      ) {
        autoren = "";
      } else {
        autoren = literatureData.autoren
          .map(
            (autor) =>
              autor.autorNachname.value +
              ", " +
              autor.autorVorname.value.charAt(0) +
              "."
          )
          .join(", ");
      }
      let beschreibung =
        autoren +
        ", " +
        literatureData.datePublished.value.split("-")[0] +
        ". " +
        literatureData.titel.value +
        ",<br><br><a href='" +
        literatureData.literaturUri.value +
        "'>" +
        literatureData.literaturUri.value +
        "</a>";
      return beschreibung;
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
      //if (this.newBoolean) {
      // this.checkModule();
      //}
      //this.$v.$reset();
    },
    deleteLiteratureRef(litUri) {
      //log
      /*
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
      PREFIX module: <https://bmake.th-brandenburg.de/module/> 
      PREFIX schema: <https://schema.org/>   
      DELETE { module:GPMO schema:citation <http://isbn-international.org/13124344342553311>. }
      WHERE {  }
      */
      //this.deleteLitRef += "module:GPMO "; //Nur zum Test
      this.deleteLitRef += "  <" + this.moduleUri + "> ";
      this.deleteLitRef += "schema:citation <";
      this.deleteLitRef += litUri;
      this.deleteLitRef += "> . ";

      //log
    },
    updateData() {
      let query = this.prefixes;

      // DELETE Part der Query
      query += " DELETE { ";
      if (this.deleteLitRef != "") {
        query += this.deleteLitRef;
      }
      query += " } "; // DELETE Ende
      // INSERT Part der Query
      query += " INSERT { ";
      if (this.insertQuery != null) {
        query += this.insertQuery;
      }
      query += " } "; // INSERT Ende
      // WHERE Part der Query
      query += " WHERE { ";
      query += " } "; // WHERE Ende

      // für SPARQL-DataUpdate
      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/update",
          query,
          {
            headers: { "Content-Type": "application/sparql-update" },
          }
        )
        .then((response) => {
          let status = response.status;
          if (status == 204) {
            this.notification = true;
            setTimeout(() => {
              this.notification = false;
            }, 2000);
          }
          this.clearCache();
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
  },
  watch: {
    modLiteratureOrigin(v) {
      this.initialState();
    },
  },
};
</script>

<style lang="scss" scoped>
.literatureHeading {
  text-align: left;
  font-weight: normal;
}
.literatureButton {
  text-align: right;
  font-weight: normal;
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
.right-center-vertically {
  vertical-align: middle;
  float: right;
  line-height: 2rem;
  margin-bottom: 1rem;
}
.left-center-vertically {
  vertical-align: middle;
  float: left;
  line-height: 2rem;
  margin-bottom: 1rem;
}
</style>
