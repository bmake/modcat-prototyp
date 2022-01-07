<template>
  <div class="wrapper">
    <md-content style="border-color: #92d050">
      <div style="width: 100%">
        <h3 style="color: #92d050"><b>Methodik</b></h3>
        <b>Lehr- und Lernformen:</b>
        <ul id="forms">
          <li v-for="forms in (resultMethod[0].interTypes.value.split('|'))" :key="forms">
            {{ forms }}
          </li>
        </ul>
        <md-divider/>
        <b>Workload:</b> {{ resultMethod[0].workloadSum.value }} Stunden<br/>
        <md-divider/>
        <b>Aufteilung der Workload:</b><br/>
        <ul id="workload">
          <li v-for="workload in (resultMethod[0].workloadDetails.value.split('|'))" :key="workload">
            {{ workload }}
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
      resultMethod: null,
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
          this.resultMethod = response.data.results.bindings;
        })
        .catch(e => {
          this.errored = true;
          this.errors.push(e);
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
        "SELECT DISTINCT ?code ?label ?interTypes ?workloadSum ?workloadDetails " +
        "WHERE { " +
        "  module:" +
        code +
        " schema:courseCode ?code ; " +
        "         schema:name ?label .  " +
        'FILTER(lang(?label) = "de")' +
          // Lehr- und Lernmethode
        "  OPTIONAL { " +
        '    SELECT (GROUP_CONCAT(?teachingFormName; separator=" | ") as ?interTypes) ' +
        "    WHERE { " +
        " module:TeachingForms_" +
        code +
        "      schema:itemListElement ?teachingForm . " +
        " ?teachingForm schema:name ?teachingFormName ; " +
        "       schema:position ?teachingFormPos . " +
        "    } ORDER BY ?teachingFormPos " +
        "  } " +
        "  OPTIONAL { " +
          // Gesamtworkload, Workload-Komponente in Stunden
        'SELECT (SUM(?workloadValue) as ?workloadSum) (GROUP_CONCAT(?workloadDetail; separator=" | ") as ?workloadDetails) ' +
        "WHERE { " +
        "  SELECT DISTINCT * " +
        "  WHERE { " +
        " module:CompWL_" +
        code +
        "      schema:valueReference ?workload . " +
        "      ?workload schema:name ?workloadName ; " +
        "                schema:value ?workloadValue . " +
        '      BIND(CONCAT(?workloadName, ": ", STR(?workloadValue), " Stunden") as ?workloadDetail) ' +
        "    } ORDER BY ?workload " +
        "}" +
        "  } " +
        "}";
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