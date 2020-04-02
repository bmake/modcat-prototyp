<template>
  <div class="md-layout md-gutter select">

    <div class="md-layout-item">
      <md-field>
        <label>Studiengang</label>
        <md-select
          v-model="studyProgram"
          name="studyProgram"
          id="studyProgram"
          md-dense
        >
          <md-option value="WIB">WI Bachelor</md-option>
          <md-option value="WIM">WI Master</md-option>
          <md-option value="BWLB">BWL Bachelor</md-option>
          <md-option value="BWLM">BWL Master</md-option>
        </md-select>
      </md-field>
    </div>

    <div class="md-layout-item">
      <md-field>
        <label>Modul</label>
        <md-select v-model="course" name="course" id="course" md-dense>
          <md-option
            v-if="Object.keys(moduleList).length > 0"
            v-for="(modulejson, index) in moduleList"
            v-bind:value="modulejson.module.value"
            v-bind:key="index"
          >
            {{ modulejson.label.value }}
          </md-option>
        </md-select>
      </md-field>
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
      course: ""
    };
  },
  watch: {
    course(v) {
      this.$emit("module", v);
    },
    studyProgram(v) {
      this.course = ""
      this.queryModuleList(v)
    },
  },
  methods: {
    queryModuleList(sp) {
      console.log("here")
      let query =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT ?module ?label " +
        "WHERE { " +
        "  ?module a module:Module ; " +
        "          schema:isPartOf module:" + sp + " ; " +
        "          rdfs:label ?label. " +
        "}";
      console.log("query", query)

      axios
        .post("http://fbw-sgmwi.th-brandenburg.de:3030/modcat/query", query, {
          headers: { "Content-Type": "application/sparql-query" }
        })
        .then(response => {
          this.moduleList = response.data.results.bindings;
        })
        .catch(e => {
          this.errors.push(e);
        });
    }
  }
};
</script>

<style>
.select {
  padding: 50px;
}

.select .md-field.md-theme-default label {
  color: #2e2e2e !important;
}

.select .md-field.md-theme-default .md-menu.md-select input {
  -webkit-text-fill-color: white !important;
  font-weight: bold !important;
}

.md-menu-content {
  max-width: 330px !important;
}

span.md-list-item-text {
  white-space: normal;
  max-height: max-content;
  padding: 5px;
}

@media all and (max-width: 500px) {
  .md-menu-content {
    max-width: 250px !important;
  }
}

</style>
