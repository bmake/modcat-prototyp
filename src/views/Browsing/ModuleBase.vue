<template>
  <div class="wrapper">
    <md-content style="border-color: #0070c0">
      <div style="width: 100%">
        <h4>Aktuelle Studien- und Prüfungsordnung (SPO)</h4>
        <div
          v-if="
            Object.keys(this.resultBase[0]).includes('spolink') &&
              Object.keys(this.resultBase[0]).includes('sponame')
          "
        >
          <a :href="resultBase[0].spolink.value" target="_blank">
            {{ resultBase[0].sponame.value }}
          </a>
          <br />
        </div>

        <md-divider
          style="height:2px; border-width:0; color: #92d050; background-color: #0070c0"
        />

        <h4>SPO-relevante Daten</h4>
        <b>Typ:</b> {{ resultBase[0].modType_name.value }} <br />
        <b>Rhythmus:</b> {{ resultBase[0].courseMode.value }} <br />
        <b>Dauer:</b> {{ resultBase[0].duration.value }} <br />
        <div v-if="Object.keys(this.resultBase[0]).includes('studysem')">
          <b>Semester:</b> {{ resultBase[0].studysem.value }} <br />
        </div>
        <b>ECTS:</b> {{ resultBase[0].ects.value }} <br />
        <b>SWS:</b> {{ resultBase[0].swsSum.value }} <br />
        <div
          v-if="
            Object.keys(this.resultBase[0]).includes('eduUse') &&
              resultBase[0].eduUse.value != ''
          "
        >
          <b>Zweck:</b> {{ resultBase[0].eduUse.value }} <br />
        </div>
        <div
          v-if="
            Object.keys(this.resultBase[0]).includes('pre') &&
              resultBase[0].pre.value != ''
          "
        >
          <b>Vorraussetzung:</b> {{ resultBase[0].pre.value }} <br />
        </div>
        <div
          v-if="
            Object.keys(this.resultBase[0]).includes('basedOnModulLabel') &&
              Object.keys(this.resultBase[0]).includes('basedOn')
          "
        >
          <b>Voraussetzung:</b>
          <router-link :to="resultBase[0].basedUrl.value">
            {{ resultBase[0].basedOnModulLabel.value }}
          </router-link>
        </div>
        <md-divider
          style="height:2px; border-width:0; color: #92d050; background-color: #0070c0"
        />

        <h4>Modulverantwortliche und Lehrende</h4>
        <b>Verantwortlich: </b>
        <a :href="resultBase[0].accPerson.value" target="_blank">
          {{ resultBase[0].accPersonLabel.value }}
        </a>
        <md-divider
          style="height:2px; border-width:0; color: #92d050; background-color: #0070c0"
        />

        <h4>Weitere Informationen</h4>
        <div v-if="Object.keys(this.resultBase[0]).includes('learnTypes')">
          <b>Lehrveranstaltungen:</b> {{ resultBase[0].learnTypes.value }}
          <br />
        </div>
        <div
          v-if="
            Object.keys(this.resultBase[0]).includes('comment') &&
              resultBase[0].comment.value != ''
          "
        >
          <b>Kommentar:</b> {{ resultBase[0].comment.value }} <br />
        </div>
        <div v-if="Object.keys(this.resultBase[0]).includes('languages')">
          <b>Sprache(n):</b> {{ resultBase[0].languages.value }} <br />
        </div>
        <div v-if="Object.keys(this.resultBase[0]).includes('grade_name')">
          <b>Notenanteil:</b> {{ resultBase[0].grade_name.value }} <br />
        </div>
        <div v-if="Object.keys(this.resultBase[0]).includes('url')">
          <b>Website:</b>
          <a :href="resultBase[0].url.value" target="_blank">
            {{ resultBase[0].url.value }}
          </a>
          <br />
        </div>
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
      resultBase: null,
      loading: true,
      errored: false,
      errors: [],
      code: this.$route.params.code,
      moduleUri: this.$parent.moduleUri,
      studyProgram: this.$parent.studyProgram, //ist "Wirtschaftsinformatik (B.Sc.)", soll "BWIK"
      studyProgramCode: this.$parent.studyProgramCode
    };
  },
  mounted() {
    //also initates query for base-data
    this.getBaseData();
  },
  methods: {
    querySparql(query) {
      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query",
          query,
          {
            headers: { "Content-Type": "application/sparql-query" }
          }
        )
        .then(response => {
          this.resultBase = response.data.results.bindings;
        })
        .catch(e => {
          this.errored = true;
          this.errors.push(e);
        })
        .finally(() => (this.loading = false));
    },
    getQueryBase() {
      //cut prefix
      this.studyProgramCode = this.studyProgramCode.slice(39);
      //get query from queries.js
      let queryBase = selectQueries.selectQueries(
        "MBqueryBase",
        this.moduleUri,
        this.studyProgramCode
      );
      return queryBase;
    },
    getBaseData() {
      this.querySparql(this.getQueryBase());
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
h4 {
  color: #0070c0;
}
</style>
