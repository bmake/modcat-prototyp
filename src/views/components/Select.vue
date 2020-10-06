<template>
  <div class="md-layout md-gutter select md-alignment-center-center">
    <div class="md-layout-item md-size-30">
      <md-field>
        <label>Studiengang</label>
        <md-select v-model="studyProgram" name="studyProgram" id="studyProgram">
          <md-option value="BWIK">Wirtschaftsinformatik (B.Sc.)</md-option>
          <md-option value="MWIV">Wirtschaftsinformatik (M.Sc.)</md-option>
          <md-option value="BBWV">Betriebswirtschaftslehre (B.Sc.)</md-option>
          <md-option value="MBWV">Betriebswirtschaftslehre (M.Sc.)</md-option>
          <md-option value="BIFK">Informatik Bachelor</md-option>
          <md-option value="BACS">Applied Computer Science (B.Sc.)</md-option>
          <md-option value="BMZK">Medizininformatik (B.Sc.)</md-option>
        </md-select>
      </md-field>
    </div>

    <div class="md-layout-item md-size-30">
      <md-autocomplete
        v-model="course"
        name="course"
        id="course"
        :md-options="labels"
      >
        <label>Modul</label>

        <div slot="md-autocomplete-item" slot-scope="{ item, term }">
          <md-highlight-text :md-term="term">{{ item }}</md-highlight-text>
        </div>

        <div slot="md-autocomplete-empty" slot-scope="{ term }" v-if="showList">
          <a @click="$emit('showPopUp'), (showList = false)"
            >Nichts unter "{{ term }}" gefunden. <br />
            Legen Sie ein neues Modul an</a
          >
        </div>
      </md-autocomplete>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Select",
  data() {
    return {
      moduleList: [],
      studyProgram: "",
      course: "",
      modules: [],
      labels: [],
      showList: true
    };
  },
  watch: {
    course(v) {
      this.showList = true;
      let i = this.labels.indexOf(v);
      let value = this.modules[i];
      this.$emit("module", value);
      this.$emit("studyProgram", this.studyProgram);
      this.$emit("newBoolean", false);
    },
    studyProgram(v) {
      this.course = "";
      this.modules = [];
      this.labels = [];
      this.showList = true;
      this.queryModuleList(v);
    }
  },
  methods: {
    queryModuleList(sp) {
      let query =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT ?module ?label " +
        "WHERE { " +
        "  ?module a module:Module ; " +
        "          schema:isPartOf module:" +
        sp +
        " ; " +
        "          schema:name ?label. " +
        '          FILTER(lang(?label) = "de")' +
        "} ORDER BY ?label";

      axios
        .post("http://fbwsvcdev.fh-brandenburg.de:8080/fuseki/modcat/query", query, {
          headers: { "Content-Type": "application/sparql-query" }
        })
        .then(response => {
          this.moduleList = response.data.results.bindings;
          for (let a = 0; a < this.moduleList.length; a++) {
            this.modules.push(this.moduleList[a].module.value);
            this.labels.push(this.moduleList[a].label.value);
          }
        })
        .catch(e => {
          this.errors.push(e);
        });
    }
  }
};
</script>

<style scoped>
.md-menu-content:not(.md-select-menu) .md-menu-content-container .md-list {
  width: 600px;
  font-size: 16px !important;
}
</style>
