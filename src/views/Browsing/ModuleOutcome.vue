<template>
  <div class="wrapper">
    <md-content style="border-color: #92d050">
      <div>
        <h3 style="color: #92d050;"><b>Didaktik</b></h3>
        <div class="container">
          <!-- Left content -->
          <div class="container__half">
            <b>Lernziele nach Kompetenzarten und -stufen: </b>
            <!-- verursacht unkontrollierte Breite
            <md-list>
              <md-list-item v-for="gb in (resultOutcome[0].learnBlooms.value.split('|'))" :key="gb">
                {{ gb }}
              </md-list-item>
            </md-list> -->
            <ul id="goalsAndBlooms">
              <li
                v-for="gb in resultOutcome[0].learnBlooms.value.split('|')"
                :key="gb"
              >
                {{ gb }}
              </li>
            </ul>
          </div>

          <!-- Right content -->
          <div class="container__half">
            <b>Sozialkompetenz</b>
            <md-divider
              style="height:2px; border-width:0; color: #92d050; background-color: #92d050"
            />
            <b>Personalkompetenz</b>
          </div>
        </div>

        <md-divider
          style="height:2px; border-width:0; color: #92d050; background-color: #92d050"
        />
        <b>Strukturierte Lerninhalte: </b>
        <ul id="contents">
          <li
            v-for="co in resultOutcome[0].contents.value.split('|')"
            :key="co"
          >
            {{ co }}
          </li>
        </ul>
        <md-divider
          style="height:2px; border-width:0; color: #92d050; background-color: #92d050"
        />
        <b>Prüfungsleistungen: </b>
        <ul id="exams">
          <li v-for="ex in resultOutcome[0].exams.value.split('|')" :key="ex">
            {{ ex }}
          </li>
        </ul>
      </div>
    </md-content>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      resultOutcome: null,
      loading: true,
      errored: false,
      code: this.$route.params.code
    };
  },
  mounted() {
    this.queryOutcome(this.code);
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
          this.resultOutcome = response.data.results.bindings;
        })
        .catch(e => {
          this.errored = true;
          this.errors.push(e);
          console.log(error);
        })
        .finally(() => (this.loading = false));
    },
    queryOutcome(code) {
      let query =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT ?code ?learnBlooms ?contents ?exams" +
        " WHERE {  " +
        "  module:" +
        code +
        " schema:courseCode ?code ;" +
        "    schema:name ?label ." +
        'FILTER(lang(?label) = "de") ' +
        // Lernergebnisse, Kompetenzen, Bloomsche Taxonomie
        "OPTIONAL { " +
        'SELECT (GROUP_CONCAT(?comNames; separator=" | ") as ?learnBlooms) ' +
        "WHERE { " +
        '	SELECT (CONCAT(?learnResult, " @ ", COALESCE(?comName1, "")) as ?comNames) ' +
        "	WHERE { " +
        '      SELECT ?learnResult (GROUP_CONCAT(?bname; separator=" @ ") as ?comName1)' +
        "      WHERE {" +
        "        SELECT ?learnResult ?position ?bname" +
        "        WHERE {" +
        "          module:LResults_" +
        code +
        " schema:itemListElement ?resList ." +
        "          ?resList schema:description ?learnResult ;" +
        "              schema:position ?position ." +
        "          ?resList schema:additionalType ?addList ." +
        "           ?addList schema:name ?bname." +
        '            FILTER(lang(?bname) = "de") ' +
        "        } GROUP BY ?learnResult ?position ?bname ORDER BY DESC(?bname)" +
        "      } GROUP BY ?learnResult ?position  ORDER BY ?position" +
        "      }" +
        " } " +
        " } " +
        // Prüfungsleistungen
        "OPTIONAL { " +
        '  SELECT (GROUP_CONCAT(?examName; separator=" | ") as ?exams) ' +
        "    WHERE {" +
        "      module:Exam_" +
        code +
        " schema:itemListElement ?exam ." +
        "      ?exam schema:name ?examName ;" +
        "          schema:position ?examPos ." +
        "    } ORDER BY ?examPos" +
        "} " +
        // Inhaltselemente
        "OPTIONAL { " +
        '    SELECT (GROUP_CONCAT(?contentName; separator=" | ") as ?contents)' +
        "    WHERE {" +
        "      module:Content_" +
        code +
        " schema:itemListElement ?content ." +
        "      ?content schema:name ?contentName ;" +
        "            schema:position ?contentPos ." +
        "    } ORDER BY ?contentPos" +
        "} " +
        "}";
      console.log(query);
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

.container {
  display: flex;
}

.container__half {
  flex: 1;
}
</style>
