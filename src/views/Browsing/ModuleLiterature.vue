<template>
  <!-- Das Feature Literatur(abfragen) ist nur durch ein studentisches Projekt erkundet wurden und
    nicht vollständig/in einem extrem frühen Status. Auch die Datenbasis ist unzuverlässig strukturiert.
    Bis auf der Datenebene weitergearbeitet wurde, soll hier nicht weiterentwickelt werden.
    
    Diese Seite ist nur grob vorgestaltet, um die Abfrage von Literaturdaten zu zeigen. Wegen der
    uneinheitlichen Informationen werden (bisher) nur die scheinbar einfachen Dinge (Autor, Titel,
    Verlag) angezeigt, aber in Abfrage und Antwort sind häufig noch weitere Daten (isbn, autorProfilLink,
    pageStart, pageEnd) enthalten. Bei mehreren Autoren kommt es scheinbar zu Dopplungen. -->
  <div class="wrapper">
    <md-content style="border-color: #a5a5a5">
      <div>
        <h3 style="color: #a5a5a5"><b>Literatur</b></h3>
        <!-- Je Zeile der Antwort wird einmal iteriert. Vielleicht entsteht hier ein Problem für Literatur mit
        mehreren Autoren. -->
        <p
          v-for="(obj,index) in resultLiterature"
          :key="index"
        >
          <!-- Diese Komponente generiert einen Button mit dem Titel der Literatur, welcher bei Anklicken die
          einfachen Daten anzeigt oder versteckt. Es ist (noch) kein Indikator (toogle-Dreieck) vorhanden, der
          dies anzeigt.
          Conditional Rendering könnte ein Lösungsansatz für unvollständige Daten sein.-->
          <Accordion class="mb-4">
            <template v-slot:title>
              <span class="font-semibold text-xl">{{ obj.titel.value }}</span>
            </template>
            <template v-slot:content>
              <div>
                <b>Autor:</b> {{ obj.autorVorname.value }} {{ obj.autorNachname.value }}<br>
                <b>Titel:</b> {{ obj.titel.value }}<br>
                <div v-if="(Object.keys(obj).includes('pageStart') && Object.keys(obj).includes('pageEnd'))">
                  <b>Seiten:</b> {{obj.pageStart.value}} - {{obj.pageEnd.value}}<br>
                </div>
                <b>Verlag:</b> {{ obj.publisherName.value }} ({{ obj.datePublished.value }}) <br>
                <br>
                <div v-if="(Object.keys(obj).includes('auflage') && obj.auflage.value != '')"><b>Auflage:</b> {{ obj.auflage.value }}<br></div>
                <div v-if="(Object.keys(obj).includes('autorProfilLink') && obj.autorProfilLink.value != '')"><b>Link zum Autor:</b> {{ obj.autorProfilLink.value }}<br></div>
                <b>autorUri</b><br>
                <div v-if="(Object.keys(obj).includes('isbn') && obj.isbn.value != '')"><b>ISBN:</b> {{ obj.isbn.value }}<br></div>
                <b>literaturUri</b><br>
                <b>pubishlerUri</b><br>
              </div>
            </template>
          </Accordion>            
        </p>
      </div>
    </md-content>
  </div>
</template>

<script>
import axios from "axios";
import Accordion from "@/views/Browsing/Accordion.vue";

export default {
  components: {
    Accordion
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
          console.log(error);
        })
        .finally(() => (this.loading = false));
    },
    queryLiterature(code) {
      //angepasst aus queries.js
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