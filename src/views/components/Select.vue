<template>
  <div class="md-layout md-gutter select md-alignment-center-center">
    <div class="md-layout-item md-size-25">
      <md-field>
        <label>Studiengang</label>
        <md-select v-model="studyProgram" name="studyProgram" id="studyProgram">
          <md-option value="WIB">WI Bachelor</md-option>
          <md-option value="WIM">WI Master</md-option>
          <md-option value="BWLB">BWL Bachelor</md-option>
          <md-option value="BWLM">BWL Master</md-option>
        </md-select>
      </md-field>
    </div>

    <div class="md-layout-item md-size-25">
      <!--- <md-field>
        <label style="font-size:18px;">Modul</label>
        <md-select v-model="course" name="course" id="course">
          <md-option
            v-if="Object.keys(moduleList).length > 0"
            v-for="(modulejson, index) in moduleList"
            v-bind:value="modulejson.module.value"
            v-bind:key="index"
          >
            {{ modulejson.label.value }}
          </md-option>
        </md-select>
      </md-field> --->

      <md-autocomplete
        v-model="course"
        name="course"
        id="course"
        :md-options="labels"
      >
        <label>Modul</label>

        <template slot="md-autocomplete-item" slot-scope="{ item, term }">
          <md-highlight-text :md-term="term">{{ item }}</md-highlight-text>
        </template>

        <template slot="md-autocomplete-empty" slot-scope="{ term }">
          <a>Nichts unter "{{ term }}" gefunden.</a>
          <a @click="noop()">Legen Sie ein neues Modul an</a>
        </template>
      </md-autocomplete>

      <!--- <md-autocomplete v-model="value" :md-options="modules" @md-changed="getModules" @md-opened="getModules">
      <label>Country</label>

      <template slot="md-autocomplete-item" slot-scope="{ item }">{{ item.name }}</template>
    </md-autocomplete> --->
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
      labels: []
    };
  },
  watch: {
    course(v) {
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
    },
    noop() {
      window.alert("noop");
    },
    /*getModules(searchTerm) {
      this.modules = new Promise(resolve => {
        window.setTimeout(() => {
          if (!searchTerm) {
            resolve(this.moduleList);
          } else {
            const term = searchTerm.toLowerCase();

            resolve(
              this.moduleList.filter(({ name }) =>
                name.toLowerCase().includes(term)
              )
            );
          }
        }, 500);
      });
    }*/
  }
};
</script>

<style>

</style>
