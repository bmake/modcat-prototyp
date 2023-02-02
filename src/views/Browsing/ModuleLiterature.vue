<template>
  <!-- Das Feature Literatur(abfragen) ist nur durch ein studentisches Projekt erkundet wurden und
    nicht vollständig/in einem extrem frühen Status. Auch die Datenbasis ist unzuverlässig strukturiert.
    Bis auf der Datenebene weitergearbeitet wurde, soll hier nicht weiterentwickelt werden. -->
  <div class="wrapper">
    <md-content style="border-color: #a5a5a5">
      <div>
        <h3 style="color: #a5a5a5"><b>Literatur</b></h3>
        <!-- Je Zeile der Antwort wird einmal iteriert. 
        genutzt wird: https://github.com/tkhquang/vue-simple-accordion-->
        <vsa-list>
          <vsa-item v-for="(obj, index) in resultLiterature" :key="index">
            <vsa-heading>
              [Icon hier]
              {{ obj.titel.value }}
            </vsa-heading>

            <vsa-content>
              <b>Autor(en):</b> {{ displayAuthors(obj.authors.value) }}<br />
              <b>Titel:</b> {{ obj.titel.value }}<br />
              <div
                v-if="
                  Object.keys(obj).includes('pageStart') &&
                    Object.keys(obj).includes('pageEnd')
                "
              >
                <b>Seiten:</b> {{ obj.pageStart.value }} - {{ obj.pageEnd.value
                }}<br />
              </div>
              <b>Verlag:</b> {{ obj.publisher.value }} ({{
                obj.datePublished.value
              }}) <br />
              <br />
              <div
                v-if="
                  Object.keys(obj).includes('auflage') &&
                    obj.auflage.value != ''
                "
              >
                <b>Auflage:</b> {{ obj.auflage.value }}<br />
              </div>
              <div
                v-if="Object.keys(obj).includes('isbn') && obj.isbn.value != ''"
              >
                <b>ISBN:</b> {{ obj.isbn.value }}<br />
              </div>
              <b>literaturUri</b><br />
            </vsa-content>
          </vsa-item>
        </vsa-list>
      </div>
    </md-content>
  </div>
</template>

<script>
import axios from "axios";
import {
  VsaList,
  VsaItem,
  VsaHeading,
  VsaContent,
  VsaIcon
} from "vue-simple-accordion";
import "vue-simple-accordion/dist/vue-simple-accordion.css";
import { selectQueries } from "../queries";

export default {
  components: {
    VsaList,
    VsaItem,
    VsaHeading,
    VsaContent
  },
  data() {
    return {
      resultLiterature: null,
      loading: true,
      errored: false,
      code: this.$route.params.code,
      studyProgram: this.$parent.studyProgram,
      moduleUri: this.$parent.moduleUri
    };
  },
  mounted() {
    this.getLiteratureData(this.code);
  },
  methods: {
    querySparql(query) {
      //fragt per Axios query, speichert in resultLiterature, loading und errored zur Kontrolle
      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query",
          query,
          {
            headers: { "Content-Type": "application/sparql-query" }
          }
        )
        .then(response => {
          this.resultLiterature = response.data.results.bindings;
        })
        .catch(e => {
          this.errored = true;
          this.errors.push(e);
          //console.log(error);
        })
        .finally(() => (this.loading = false));
    },
    displayAuthors(authorsInput) {
      this.authorsArray = [];
      //Eingabe zu Liste einzelner Autoren
      this.authorsArray = authorsInput.split(", ");
      this.authorsString = "";
      //Zahl der Autoren auswerten
      if (this.authorsArray.length < 4) {
        //alle anzeigen
        this.authorsArray.forEach(element => {
          this.authorsString += element + ", ";
        });
        //extra ", " abschneiden
        this.authorsString = this.authorsString.slice(0, -2);
      } else {
        //et al.
        for (let i = 0; i < 3; i++) {
          this.authorsString += this.authorsArray[i] + ", ";
        }
        //extra ", " abschneiden
        this.authorsString = this.authorsString.slice(0, -2);
        this.authorsString += " et al.";
      }
      return this.authorsString;
    },
    getQueryLiterature() {
      //get query from queries.js
      let queryLiterature = selectQueries.selectQueries(
        "MLqueryLiterature",
        this.moduleUri,
        this.studyProgram
      );
      return queryLiterature;
    },
    getLiteratureData() {
      //Server mit query anfragen
      this.querySparql(this.getQueryLiterature());
    }
  }
};
</script>

<style lang="scss" scoped>
.md-content {
  width: 100%;
  display: inline-flex;
  justify-content: left;
  align-items: center;
  border-radius: 5px;
  border-style: solid;
  margin: 2px;
  padding: 5px;
}
</style>
