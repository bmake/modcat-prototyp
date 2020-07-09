<template>
  <div class="md-layout md-gutter select md-alignment-center-center">
    <div class="md-layout-item md-size-20">
      <md-field>
        <label>Studiengang</label>
        <md-select v-model="studyProgram" name="studyProgram" id="studyProgram" disableOptionCentering panelClass="myPanelClass">
          <md-option value="WIB">WI Bachelor</md-option>
          <md-option value="WIM">WI Master</md-option>
          <md-option value="BWLB">BWL Bachelor</md-option>
          <md-option value="BWLM">BWL Master</md-option>
        </md-select>
      </md-field>
    </div>

    <div class="md-layout-item md-size-60">
      <md-autocomplete
        v-model="course"
        name="course"
        id="course"
        :md-options="labels"
      >
        <label>Modul</label>

        <div slot="md-autocomplete-item" slot-scope="{ item, term }">
          <div :md-term="term">{{ item }}</div>
        </div>

        <div slot="md-autocomplete-empty" slot-scope="{ term }" v-if="showList">
          <a @click="$emit('showPopUp'), showList = false">Nichts unter "{{ term }}" gefunden. <br> Legen Sie ein neues Modul an</a>
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
      console.log("course", this.course);
      let i = this.labels.indexOf(v);
      let value = this.modules[i];
      this.$emit("module", value);
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
        "          rdfs:label ?label. " +
        "}";

      axios
        .post("http://fbw-sgmwi.th-brandenburg.de:3030/modcat/query", query, {
          headers: { "Content-Type": "application/sparql-query" }
        })
        .then(response => {
          this.moduleList = response.data.results.bindings;
          for (let a = 0; a < this.moduleList.length; a++) {
            this.modules.push(this.moduleList[a].module.value)
            this.labels.push(this.moduleList[a].label.value)
          }
        })
        .catch(e => {
          this.errors.push(e);
        });
    }
  }
};
</script>

<style>
.md-input, .md-field .md-textarea {
  font-size: 18px !important;
  font-weight: bold;
  -webkit-text-fill-color: #ffffff !important;
}

.md-virtual-repeat-container.md-autocomplete-suggestions-container {
     width:700px !important;
}
</style>
