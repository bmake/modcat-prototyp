<template>
  <div class="wrapper">
    <div class="module description">
      <div style="display: flex; justify-content: center;">
        <md-content style="border-color: #0070c0">
          <div>
            <h4 style="color: #0070c0"><b>Rahmendaten</b></h4>
            <p>
              <a :href="result[0].spolink.value" target="_blank">
                Aktuelle Studien- und Prüfungsordnung (SPO)
              </a> <br>
              SPO-relevanten Daten <br>
              <b>ECTS:</b> {{ result[0].ects.value }} <br>
              <b>Verantwortlich: </b>
              <a :href="result[0].accPerson.value" target="_blank">
                {{ result[0].accPersonLabel.value }}
              </a>
            </p>
            <router-link :to="{ name: 'base', params: { code: $route.params.code }}"><b>Anschauen</b></router-link>
          </div>
        </md-content>
        <md-content style="border-color: #92d050">
          <div>
            <h4 style="color: #92d050;"><b>Didaktik</b></h4>
            <p>
              Lernziele nach Kompetenzarten und -stufen<br/>
              Strukturierte Lerninhalte<br/>
              <b>Prüfungsleistungen:</b> {{ result[0].exams.value }}<br/>
            </p>
            <router-link :to="{ name: 'outcome', params: { code: $route.params.code }}"><b>Anschauen</b></router-link>
          </div>
        </md-content>
      </div>
      <div style="display: flex; justify-content: center;">
        <md-content style="border-color: #92d050">
          <div>
            <h4 style="color: #92d050"><b>Methodik</b></h4>
            <p>
              <b>Lehr- und Lernformen:</b> {{ result[0].interTypes.value }}<br/>
              <b>Aufteilung der Workload:</b> {{ result[0].workloadDetails.value }}<br/>
            </p>
            <router-link :to="{ name: 'method', params: { code: $route.params.code }}"><b>Anschauen</b></router-link>
          </div>
        </md-content>
        <md-content style="border-color: #a5a5a5">
          <div>
            <h4 style="color: #a5a5a5"><b>Literatur</b></h4>
            <p>
              Empfohlene Literatur und sonstige Quellen<br/>
              Links (DOIs und URLs) elektronischer Ressourcen<br/>
              Web-IDs von Autor*innen und Verlagen<br/>
            </p>
            <router-link :to="{ name: 'literature', params: { code: $route.params.code }}"><b>Anschauen</b></router-link>
          </div>
        </md-content>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      result: null,
      loading: true,
      errored: false,
      code: this.$route.params.code
    }
  },
  mounted() {
    this.queryMethod(this.code);
  },
  methods: {
    querySparql(query) {
      //fragt per Axios query, speichert in result, loading und errored zur Kontrolle
      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query",
          query,
          {
            headers: { "Content-Type": "application/sparql-query" }
          }
        )
        .then(response => {
          this.result = response.data.results.bindings;
        })
        .catch(e => {
          this.errored = true;
          console.log(error);
          
        })
        .finally(() => this.loading = false)
        ;
    },
    queryMethod(code) {
      let query =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT ?code ?label ?exams ?interTypes ?workloadSum ?workloadDetails ?studyProgram ?spolink ?accPerson ?accPersonLabel ?ects ?url " +
        "WHERE { " +
        "  module:" +
        code +
        " schema:courseCode ?code ; " +
        "         schema:name ?label ;  " +
        "      schema:isPartOf ?studyProgram ; " +
          // ECTS
        "         schema:numberOfCredits ?ects ;  " +
          // Modulverantwortliche (URI)
        "         schema:accountablePerson ?accPerson . " +
          // Modulverantwortliche Label (Prof. Dr....)
        "   ?accPerson rdfs:label ?accPersonLabel .  " +
        'FILTER(lang(?label) = "de")' +
        // Prüfungsleistungen
        "OPTIONAL { " +
        '  SELECT (GROUP_CONCAT(?examName; separator=", ") as ?exams) ' +
        "    WHERE {" +
        "      module:Exam_" +
        code +
        " schema:itemListElement ?exam ." +
        "      ?exam schema:name ?examName ;" +
        "          schema:position ?examPos ." +
        "    } ORDER BY ?examPos" +
        "} " +
          // Lehr- und Lernmethode
        "  OPTIONAL { " +
        '    SELECT (GROUP_CONCAT(?teachingFormName; separator=", ") as ?interTypes) ' +
        "    WHERE { " +
        " module:TeachingForms_" +
        code +
        "      schema:itemListElement ?teachingForm . " +
        " ?teachingForm schema:name ?teachingFormName ; " +
        "       schema:position ?teachingFormPos . " +
        "    } ORDER BY ?teachingFormPos " +
        "  } " +
        //URL des Moduls
        " OPTIONAL { <" +
        code +
        ">  schema:url ?url . " +
        " } " +
        "OPTIONAL { " +
        //Studienordnung (SPO) Name und Link
        "  ?studyProgram" +
        " schema:subjectOf ?spocode ." +
  	    "  ?spocode schema:url ?spolink." +
        "}" +
        "  OPTIONAL { " +
          // Gesamtworkload, Workload-Komponente in Stunden
        'SELECT (SUM(?workloadValue) as ?workloadSum) (GROUP_CONCAT(?workloadDetail; separator=", ") as ?workloadDetails) ' +
        "WHERE { " +
        "  SELECT DISTINCT * " +
        "  WHERE { " +
        " module:CompWL_" +
        code +
        "      schema:valueReference ?workload . " +
        "      ?workload schema:name ?workloadName ; " +
        "                schema:value ?workloadValue . " +
        '      BIND(CONCAT(?workloadName, " ", STR(?workloadValue)," h") as ?workloadDetail) ' +
        "    } ORDER BY ?workload " +
        "}" +
        "  } " +
        "}";
        //console.log(query);
      this.querySparql(query);
    }
  }
};
</script>

<style lang="scss" scoped>
.faded {
  opacity: 0.2 !important;
  transition: 0.3s opacity !important;
}
.highlight {
  opacity: 1 !important;
}

g.selected rect {
  stroke: #ffc107 !important;
  stroke-width: 2px !important;
}

.md-button.choosed {
  background-color: #ea80fc !important;
}

#download {
  background-color: #fff9c4 !important;
}
#download:hover {
  background-color: #fcdd86 !important;
  background-color: #ea80fc;
}

.header-filter {
  padding: 5%;
}

.brand h3 {
  margin-top: 0 !important;
}

@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
  .brand2 h2 {
    padding: 50px;
  }
  .svg.md-layout-item {
    min-width: 40%;
    max-width: 40%;
    margin-left: 5%;
    margin-right: 3%;
  }
}

@media all and (max-width: 700px) {
  .svg.md-layout-item {
    min-width: 100%;
    max-width: 100%;
  }
}

@media all and (max-width: 500px) {
  .brand {
    margin-top: 3em;
    max-width: max-content !important;
    width: 100% !important;
  }
  .brand h1 {
    font-size: 2.2em !important;
  }
  .brand2 h2 {
    font-size: xx-large !important;
  }
}

.select {
  padding: 5em;
}

.select .md-field.md-theme-default label {
  color: #2e2e2e !important;
  font-size: large;
}

.select .md-field.md-theme-default .md-menu.md-select input {
  -webkit-text-fill-color: white !important;
  font-weight: bold !important;
  font-size: large !important;
  margin-top: 5px;
}

.select .md-field.md-autocomplete.md-theme-default .md-menu input {
  -webkit-text-fill-color: white !important;
  font-weight: bold !important;
  font-size: large !important;
  margin-top: 5px;
}

.md-menu-content {
  max-width: 400px !important;
}

span.md-list-item-text {
  white-space: normal !important;
  max-height: max-content !important;
  padding: 5px !important;
  font-size: medium !important;
}

.md-highlight-text.md-theme-default {
  white-space: normal !important;
  max-height: max-content !important;
  font-size: medium !important;
}

span.md-highlight-text-match {
  color: #2e2e2e !important;
}

.md-list.md-dense .md-list-item-text {
  margin-left: 20px !important;
  font-size: small !important;
}

.md-content {
  width: 35%;
  display: inline-flex;
  justify-content: left;
  align-items: center;
  border-radius: 5px;
  border-style: solid;
  margin: 2px;
  padding: 5px;
}

@media all and (max-width: 700px) {
  .md-menu-content {
    max-width: 200px !important;
  }
  .md-list.md-dense .md-list-item-text {
    margin-left: 5px !important;
    font-size: small !important;
  }
  .select {
    padding: 3em;
    margin-bottom: 3em;
  }
  .select .md-layout-item.md-size-25 {
    min-width: 100%;
    max-width: 100%;
  }
  .md-autocomplete + strong {
    margin-top: 36px;
    display: block;
  }
}

#mods {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 93%;
}

#mods td, #mods th {
  border: 1px solid #ddd;
  padding: 8px;
}

#mods tr:nth-child(even){background-color: #f2f2f2;}

#mods tr:hover {background-color: #ddd;}

#mods th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: rgb(255, 143, 0);
  color: white;
}
</style>