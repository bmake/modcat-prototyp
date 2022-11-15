<template>
  <div class="wrapper">
    <md-content style="border-color: #92d050">
      <div>
        <h3 style="color: #92d050;"><b>Didaktik</b></h3>

        <div class="goals">
          <h4>Lernziele</h4>
          <h5 v-if="resultCompetenceSubjectmatter != 0">Fachkompetenz</h5>
          <ul id="goalsAndBlooms">
            <li
              v-for="(blooms, index) in resultCompetenceSubjectmatter"
              :key="index"
            >
              <b>{{ blooms.bname.value }}</b> - {{ blooms.learnResult.value }}
            </li>
          </ul>

          <h5 v-if="resultCompetenceSelf.length != 0">Persönliche Kompetenz</h5>
          <ul id="goalsSelf">
            <li v-for="(blooms, index) in resultCompetenceSelf" :key="index">
              {{ blooms.learnResult.value }}
            </li>
          </ul>

          <h5 v-if="resultCompetenceSocial != 0">Sozialkompetenz</h5>
          <ul id="goalsSocial">
            <li v-for="(blooms, index) in resultCompetenceSocial" :key="index">
              {{ blooms.learnResult.value }}
            </li>
          </ul>
        </div>

        <md-divider
          style="height:2px; border-width:0; color: #92d050; background-color: #92d050"
        />

        <div class="contents">
          <h4>Lerninhalte</h4>
          <ul id="contents">
            <li
              v-for="co in resultOutcome[0].contents.value.split('|')"
              :key="co"
            >
              {{ co }}
            </li>
          </ul>
        </div>

        <md-divider
          style="height:2px; border-width:0; color: #92d050; background-color: #92d050"
        />

        <div class="exams">
          <h4>Prüfungsleistungen</h4>
          <ul id="exams">
            <li v-for="ex in resultOutcome[0].exams.value.split('|')" :key="ex">
              {{ ex }}
            </li>
          </ul>
        </div>
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
      code: this.$route.params.code,
      resultCompetenceSubjectmatter: null,
      resultCompetenceSelf: null,
      resultCompetenceSocial: null
    };
  },
  mounted() {
    this.queryOutcome(this.code);
    this.queryGoals();
  },
  methods: {
    querySparql(query) {
      //fragt per Axios query, speichert in resultOutcome, loading und errored zur Kontrolle
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
      //console.log(query);
      this.querySparql(query);
    },
    queryGoals() {
      this.queryGoalsSubjectmatter(this.code);
      this.queryGoalsSelf(this.code);
      this.queryGoalsSocial(this.code);
    },
    //3 very similar methods, can be optimised
    queryGoalsSubjectmatter(code) {
      let query =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT ?code ?bname ?addList ?learnResult " +
        "WHERE { " +
        "  module:" +
        code +
        " schema:courseCode ?code ; " +
        "    schema:name ?label ." +
        '    FILTER(lang(?label) = "de")' +
        "  module:LResults_" +
        code +
        " schema:itemListElement ?resList ." +
        "                  ?resList schema:description ?learnResult ;" +
        "                      schema:position ?position ." +
        "                  ?resList schema:additionalType ?addList ;" +
        "                          schema:additionalType module:SubjectMatterCompetence." +
        "            ?addList schema:name ?bname." +
        '    FILTER(lang(?bname) = "de" && STR(?bname) != "Fachkompetenz") ' +
        "}";

      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query",
          query,
          {
            headers: { "Content-Type": "application/sparql-query" }
          }
        )
        .then(response => {
          this.resultCompetenceSubjectmatter = response.data.results.bindings;
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    queryGoalsSelf(code) {
      let query =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT ?code ?bname ?addList ?learnResult " +
        "WHERE { " +
        "  module:" +
        code +
        " schema:courseCode ?code ; " +
        "    schema:name ?label ." +
        '    FILTER(lang(?label) = "de")' +
        "  module:LResults_" +
        code +
        " schema:itemListElement ?resList ." +
        "                  ?resList schema:description ?learnResult ;" +
        "                      schema:position ?position ." +
        "                  ?resList schema:additionalType ?addList ;" +
        "                          schema:additionalType module:SelfCompetence." +
        "            ?addList schema:name ?bname." +
        '    FILTER(lang(?bname) = "de") ' +
        "}";

      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query",
          query,
          {
            headers: { "Content-Type": "application/sparql-query" }
          }
        )
        .then(response => {
          this.resultCompetenceSelf = response.data.results.bindings;
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    queryGoalsSocial(code) {
      let query =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT ?code ?bname ?addList ?learnResult " +
        "WHERE { " +
        "  module:" +
        code +
        " schema:courseCode ?code ; " +
        "    schema:name ?label ." +
        '    FILTER(lang(?label) = "de")' +
        "  module:LResults_" +
        code +
        " schema:itemListElement ?resList ." +
        "                  ?resList schema:description ?learnResult ;" +
        "                      schema:position ?position ." +
        "                  ?resList schema:additionalType ?addList ;" +
        "                          schema:additionalType module:SocialCompetence." +
        "            ?addList schema:name ?bname." +
        '    FILTER(lang(?bname) = "de") ' +
        "}";

      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query",
          query,
          {
            headers: { "Content-Type": "application/sparql-query" }
          }
        )
        .then(response => {
          this.resultCompetenceSocial = response.data.results.bindings;
        })
        .catch(e => {
          this.errors.push(e);
        });
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
