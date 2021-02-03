<template>
  <div>
    <!-- Eingabe der DOI -->
    <div>
      <p>Bitte geben Sie eine gültige DOI ein</p>
      <md-input
        class="md-layout-item md-size-80"
        v-model="doi"
        @keyup.enter="queryDoiData"
      />
      <button class="md-layout-item md-size-20" @click="queryDoiData">
        Laden
      </button>
      <div v-if="loading === true">
        <div class="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </div>
      <div v-if="apiError !== null">
        {{ apiError }}
      </div>
    </div>
    <!-- Ausgabe der Daten in Formular (DEMO) -->
    <div class="md-layout-item md-size-100" v-if="loading === false">
      <br />
      <!-- Titel -->
      <div class="md-size-100">
        <md-field>
          <label>Titel</label>
          <md-input v-model="cleanedDoiData.title" disabled />
        </md-field>
      </div>
      <!-- Seiten -->
      <div class="md-size-100">
        <md-field>
          <label>Seiten</label>
          <md-input v-model="cleanedDoiData.page" disabled />
        </md-field>
      </div>
      <!-- Erschienen in -->
      <div class="md-size-100">
        <md-field>
          <label>Seiten</label>
          <md-input v-model="cleanedDoiData.containerTitle" disabled />
        </md-field>
      </div>
      <!-- Autoren -->
      <div class="md-size-100">
        <label>Autoren/innen</label>
        <div v-for="author in cleanedDoiData.author" :key="author">
          <div class="md-layout md-gutter">
            <!-- Nachname -->
            <div class="md-layout-item md-size-50">
              <md-field>
                <label>Nachname</label>
                <md-input v-model="author.family" disabled />
              </md-field>
            </div>
            <!-- Vorname -->
            <div class="md-layout-item md-size-50">
              <md-field>
                <label>Vorname</label>
                <md-input v-model="author.given" />
              </md-field>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- JSON-Output 
    <div v-if="loading === false">
      <br /><br /><br /><br />
      {{ rawDoiData }}
    </div>
    -->
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "literatureDOI",
  data() {
    return {
      doi: "https://doi.org/10.1257/jep.29.2.213",
      rawDoiData: null,
      loading: null,
      apiError: null,
    };
  },
  computed: {
    // Swap problematic property keys from raw API response
    // v-model doesn't accept properties with e.g. "-" (math. function!)
    cleanedDoiData() {
      let renamedData = Object.assign({}, this.rawDoiData);
      let newKeyLabels = { "container-title": "containerTitle" };
      for (let key in renamedData) {
        if (key in newKeyLabels) {
          let values = renamedData[key];
          delete renamedData[key];
          renamedData[newKeyLabels[key]] = values;
        }
      }
      return renamedData;
    },
  },
  methods: {
    // Query literature data from doi.org API
    queryDoiData() {
      this.loading = true;
      this.apiError = null;
      axios
        .get(this.doi, {
          headers: {
            Accept: "application/vnd.citationstyles.csl+json",
          },
          crossdomain: true,
        })
        .then((response) => {
          this.rawDoiData = response.data;
          this.loading = false;
        })
        .catch((e) => {
          if (e.toString().includes("504")) {
            this.apiError = "Error: API antwortet nicht. (Code 504)";
          } else if (e.toString().includes("404")) {
            this.apiError = "Error: Fehlerhafte Eingabe.";
          } else {
            this.apiError = e;
          }
          this.loading = null;
        });
    },
  },
};
</script>
<style scoped>
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;
  margin-top: 5vh;
  margin-bottom: 10vh;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid rgb(255, 143, 0);
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
