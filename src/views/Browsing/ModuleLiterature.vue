<template>
  <div class="wrapper">
    <md-content style="border-color: #a5a5a5">
          <div>
            <h3 style="color: #a5a5a5"><b>Literatur</b></h3>
            <p
              v-for="(obj,index) in resultLiterature"
              :key="index"
              style="border-top: solid 2px #a5a5a5;"
            >
              test              
            </p>

            
            
          </div>
        </md-content>
  </div>
</template>

<script>
import axios from "axios";

export default {
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
      //fragt per Axios query, speichert in resultMethod, loading und errored zur Kontrolle
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
          console.log(error);
        })
        .finally(() => (this.loading = false));
    },
    queryLiterature(code) {
      let query =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT ?code ?label ?literaturUri ?titel ?auflage ?autorUri ?autorLabel ?autorVorname ?autorNachname " +
        "?autorProfilLink ?datePublished ?isbn ?litIdentifier ?pageStart ?pageEnd ?publisherUri ?publisherName " +
        "WHERE { " +
        //"module:GPMO " + //Nur zum Test
        'module:' + code + ' ' +
        "schema:courseCode ?code ; " +
        "         schema:name ?label .  " +
        'FILTER(lang(?label) = "de") ' +
        "OPTIONAL { " +
        //"module:GPMO " + //Nur zum Test
        'module:' + code + ' ' +
        "schema:citation ?literaturUri. " +
        "?literaturUri schema:headline ?titel. " +
        "OPTIONAL { ?literaturUri schema:datePublished ?datePublished. } " +
        //Optionale Angaben Autor
        "OPTIONAL { " +
        "   ?literaturUri schema:author ?autorUri. " +
        "   OPTIONAL { ?autorUri  schema:givenName ?autorVorname. } " +
        "   OPTIONAL { ?autorUri  schema:familyName ?autorNachname. } " +
        "   OPTIONAL { ?autorUri  schema:sameAs ?autorProfilLink. } " +
        "} " +
        //Optionale Angaben Book
        "OPTIONAL { " +
        "   ?literaturUri a schema:Book. " +
        "   OPTIONAL { ?literaturUri schema:bookEdition ?auflage. } " +
        "   OPTIONAL { ?literaturUri schema:isbn ?isbn. } " +
        "} " +
        // Optionale Angaben Book-Identifier (DOI)
        "OPTIONAL { ?literaturUri schema:identifier ?litIdentifier. } " +
        //Optionale Angaben Article
        "OPTIONAL { " +
        "   ?literaturUri a schema:Article. " +
        "   OPTIONAL { ?literaturUri schema:pageStart ?pageStart;  " +
        "                            schema:pageEnd ?pageEnd. } " +
        "} " +
        //Optionale Angaben DigitalDocument - Keine expliziten Angaben
        //"OPTIONAL { ?literaturUri a schema:DigitalDocument; "} " +

        //Optionale Angaben zum Herausgeber (für Book + DigitalDocument)
        "OPTIONAL { " +
        "   ?literaturUri schema:publisher ?publisherUri. " +
        "   OPTIONAL { ?publisherUri schema:legalName ?publisherName .} " +
        "} " +
        "} " + //Schließende Klammer 1. Optional
        "}"; //Schließende Klammer vom WHERE
      //debug: console.log(query);
      this.querySparql(query);
    }
  }
};

</script>

<style lang="scss">
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