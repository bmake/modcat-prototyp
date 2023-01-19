<template>
  <div class="wrapper">
    <md-content style="border-color: #92d050">
      <div style="width: 100%">
        <h3 style="color: #92d050"><b>Methodik</b></h3>
        <b>Lehr- und Lernformen:</b>
        <ul id="forms">
          <li
            v-for="forms in resultMethod[0].interTypes.value.split('|')"
            :key="forms"
          >
            {{ forms }}
          </li>
        </ul>
        <md-divider />
        <b>Workload:</b> {{ resultMethod[0].workloadSum.value }} Stunden<br />
        <md-divider />
        <b>Aufteilung der Workload:</b><br />
        <ul id="workload">
          <li
            v-for="workload in resultMethod[0].workloadDetails.value.split('|')"
            :key="workload"
          >
            {{ workload }}
          </li>
        </ul>
      </div>
    </md-content>
  </div>
</template>

<script>
import axios from "axios";
import { selectQueries } from "../queries";

export default {
  data() {
    return {
      resultMethod: null,
      loading: true,
      errored: false,
      code: this.$route.params.code,
      studyProgram: this.$parent.studyProgram,
      moduleUri: this.$parent.moduleUri
    };
  },
  mounted() {
    this.getQueryMethod(this.code);
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
        .finally(() => (this.loading = false));
    },
    getQueryMethod() {
      console.log("ping1");
      //get query from queries.js
      let queryMethod = selectQueries.selectQueries(
        "MMqueryMethod",
        this.moduleUri, //"https://bmake.th-brandenburg.de/module/ADIK",
        this.studyProgram //"Angewandte Informatik (B.Sc.)"
      );

      //Server anfragen
      this.querySparql(queryMethod);
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
