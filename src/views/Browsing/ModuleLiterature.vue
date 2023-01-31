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
      code: this.$route.params.code
    };
  },
  mounted() {
    this.queryLiterature(this.code);
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
    queryLiterature(code) {
      //angepasst aus queries.js
      let query =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "PREFIX dc: <http://purl.org/dc/elements/1.1/> " +
        'SELECT ?code ?label ?literaturUri ?titel ?auflage (GROUP_CONCAT(?autorFullname; separator=", ") as ?authors)' +
        " ?datePublished ?isbn ?litIdentifier ?pageStart ?pageEnd ?publisher " +
        "WHERE {" +
        "module:" +
        code +
        " schema:courseCode ?code ;" +
        "                schema:name ?label ." +
        '  FILTER(lang(?label) = "de")' +
        "  OPTIONAL {" +
        //"module:GPMO " + //Nur zum Test
        "module:" +
        code +
        " schema:citation ?literaturUri." +
        "    ?literaturUri schema:headline ?titel." +
        "    OPTIONAL {" +
        "      ?literaturUri schema:datePublished ?datePublished." +
        "    }" +
        "    OPTIONAL {" +
        //Autoren
        "   ?literaturUri schema:itemListElement ?autorList . " +
        "   ?autorList schema:identifier ?autorUri . " +
        "        OPTIONAL {" +
        "          ?autorUri  schema:givenName ?autorVorname." +
        "        }" +
        "        OPTIONAL {" +
        "            ?autorUri  schema:familyName ?autorNachname." +
        "        }" +
        '        BIND((CONCAT(STR( ?autorVorname ), " ", STR( ?autorNachname)) ) AS ?autorFullname ) .' +
        "    }" +
        "    OPTIONAL {" +
        "      ?literaturUri a schema:Book." +
        "      OPTIONAL {" +
        "        ?literaturUri schema:bookEdition ?auflage." +
        "      }" +
        "      OPTIONAL {" +
        "        ?literaturUri schema:isbn ?isbn." +
        "      }" +
        "    }" +
        "    OPTIONAL {" +
        "      ?literaturUri schema:identifier ?litIdentifier." +
        "    }" +
        "    OPTIONAL {" +
        "      ?literaturUri a schema:Article." +
        "      OPTIONAL {" +
        "        ?literaturUri schema:pageStart ?pageStart;" +
        "                      schema:pageEnd ?pageEnd." +
        "      }" +
        "    }" +
        "    OPTIONAL {" +
        "      ?literaturUri dc:publisher ?publisher." +
        "    }" +
        "  }" +
        "} group by ?code ?label ?literaturUri ?titel ?auflage ?datePublished ?isbn ?litIdentifier ?pageStart ?pageEnd ?publisher";
      console.log(query);
      this.querySparql(query);
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
