<template>
  <div class="wrapper">
    <div class="header-filter" style="background-color: #FF8F00;">
      <div class="md-layout">
        <div class="md-layout-item">
          <div>
            <div class="brand" style="margin-bottom: 3em">
              <img
                src="../../img/logo.svg"
                class="img"
                width="10%"
                height="auto"
              />
              <h1>Modulkatalog @THB</h1>
              <h3>Browsen Sie durch alle Module der THB</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main main-raised">
      <div style="text-align: center; padding-top: 3em">
        <h3>
          <b>Bitte wählen Sie Ihre Filter</b>
        </h3>
      </div>

      <div class="md-layout md-gutter" style="margin-left:3%; margin-right:3%;">
        <div class="md-layout-item md-size-40" style="padding-top: 50px">
          <h4><b>Fachbereiche</b></h4>
          <md-checkbox
            v-model="department"
            value="https://bmake.th-brandenburg.de/module/THB_FBW"
            >Fachbereich Wirtschaft</md-checkbox
          ><!--:disabled="selectedStudyProgram != '' "-->
          <md-checkbox
            v-model="department"
            value="https://bmake.th-brandenburg.de/module/THB_FBI"
            >Fachbereich Informatik</md-checkbox
          >
          <md-checkbox
            v-model="department"
            value="https://bmake.th-brandenburg.de/module/THB_FBT"
            >Fachbereich Technik</md-checkbox
          >

          <h4><b>Studiengang</b></h4>
          <md-field>
            <label>Studiengang</label>
            <md-select
              v-model="selectedStudyProgram"
              name="studyProgram"
              id="studyProgram"
            >
              <md-option
                v-for="(sp, index) in studyProgramList"
                :value="sp.studyprogramID.value"
                v-bind:key="index"
                >{{ sp.studyProgramName.value }}</md-option
              >
            </md-select>
          </md-field>

          <h4><b>Modultyp</b></h4>
          <md-checkbox v-model="moduleType" value="Pflichtmodul">Pflicht</md-checkbox>
          <md-checkbox v-model="moduleType" value="Wahlpflichtmodul"
            >Wahlpflicht</md-checkbox
          >
          <md-checkbox v-model="moduleType" value="Generale"
            >Studium Generale</md-checkbox
          >
          <md-checkbox v-model="moduleType" value="Profilmodul"
            >Profilmodul</md-checkbox
          >

          <h4><b>Lehrperson</b></h4>
          <md-autocomplete
            v-model="selectedLecturer"
            :md-options="lecturerLabels"
            class="xs"
          >
            <div slot="md-autocomplete-item" slot-scope="{ item, term }">
              <md-highlight-text :md-term="term">{{ item }}</md-highlight-text>
            </div>
          </md-autocomplete>

          <h4><b>Lehrsprache</b></h4>
          <md-checkbox v-model="language" value="de">deutsch</md-checkbox>
          <md-checkbox v-model="language" value="en">englisch</md-checkbox>
          <md-checkbox v-model="language" value="andere">andere</md-checkbox>

          <!--<h4><b>Lehr- Lernform</b></h4>
          <md-checkbox v-model="learnTypes" value="1"
            >Problem Based Learning</md-checkbox
          >
          <md-checkbox v-model="learnTypes" value="2"
            >Vortragend</md-checkbox
          >
          <md-checkbox v-model="learnTypes" value="3"
            >Projektarbeit</md-checkbox
          >

          <h4><b>Prüfungsform</b></h4>
          <md-checkbox v-model="exams" value="1">Schriftlich</md-checkbox>
          <md-checkbox v-model="exams" value="2">Mündlich</md-checkbox>
          <md-checkbox v-model="exams" value="3">Projekt</md-checkbox>-->

          <h4><b>Kompetenzziele</b></h4>
          <md-checkbox v-model="competence" value="SubjectMatterCompetence"
            >Fachkompetenz</md-checkbox
          >
          <md-checkbox v-model="competence" value="SocialCompetence"
            >Sozialkompetenz</md-checkbox
          >
          <md-checkbox v-model="competence" value="SelfCompetence"
            >Selbstkompetenz</md-checkbox
          >

          <h4><b>Kompetenzstufe</b></h4>
          <md-checkbox
            v-model="bloomTax"
            value="BloomTax_Remember"
            :disabled="!competence.includes('SubjectMatterCompetence')"
            >Erinnern</md-checkbox
          >
          <md-checkbox
            v-model="bloomTax"
            value="BloomTax_Understand"
            :disabled="!competence.includes('SubjectMatterCompetence')"
            >Verstehen</md-checkbox
          >
          <md-checkbox
            v-model="bloomTax"
            value="BloomTax_Apply"
            :disabled="!competence.includes('SubjectMatterCompetence')"
            >Anwenden</md-checkbox
          >
          <md-checkbox
            v-model="bloomTax"
            value="BloomTax_Analyze"
            :disabled="!competence.includes('SubjectMatterCompetence')"
            >Analysieren</md-checkbox
          >
          <md-checkbox
            v-model="bloomTax"
            value="BloomTax_Evaluate"
            :disabled="!competence.includes('SubjectMatterCompetence')"
            >Evaluieren</md-checkbox
          >
          <md-checkbox
            v-model="bloomTax"
            value="BloomTax_Create"
            :disabled="!competence.includes('SubjectMatterCompetence')"
            >Erschaffen</md-checkbox
          >
        </div>

        <div class="md-layout-item md-size-60">
          <md-card>
            <p
              style="padding-top: 2%; padding-left: 2%; color: black !important;"
            >
              {{ toBePaged.length }} Module werden angezeigt
            </p>
            <md-table
              v-model="pageItems"
              md-sort="label.value"
              md-sort-order="asc"
            >
              <md-table-toolbar style="padding-top: 0 !important;">
                <!--<div class="md-toolbar-section-start"></div>-->
                <md-field md-clearable class="md-toolbar-section-end">
                  <md-input
                    placeholder="Suchfeld..."
                    v-model="search"
                    @input="searchOnTable"
                  />
                </md-field>
              </md-table-toolbar>

              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell
                  md-label="Modultitel"
                  md-sort-by="label.value"
                  style="width: 38%"
                  >{{ item.label.value }}</md-table-cell
                >
                <md-table-cell
                  md-label="Studiengang"
                  md-sort-by="studyprogramLabel.value"
                  style="width: 22%"
                  >{{ item.studyprogramLabel.value }}</md-table-cell
                >
                <md-table-cell
                  md-label="FB"
                  md-sort-by="departmentLabel.value"
                  style="width: 10%"
                  >{{ item.departmentLabel.value }}</md-table-cell
                >
                <md-table-cell
                  md-label="Lehrperson"
                  md-sort-by="lecturerLabel.value"
                  style="width: 30%"
                  >{{ item.lecturerLabel.value }}</md-table-cell
                >
              </md-table-row>
            </md-table>
            <pagination
              type="warning"
              v-model="colorPagination"
              :page-count="pageCount"
              style="padding-top: 10px; padding-bottom: 10px; padding-left: 40%"
            >
            </pagination>
          </md-card>
          <!--<p>filters: {{ filters }}</p>
          <p>department: {{ department }}</p>
          <p>selectedStudyProgram: {{ selectedStudyProgram }}</p>
          <p>moduleType: {{ moduleType }}</p>
          <p>selectedLecturer: {{ selectedLecturer }}</p>
          <p>language: {{ language }}</p>
          <p>competence: {{ competence }}</p>
          <p>bloomTax: {{ bloomTax }}</p>
          <p>competenceBloom: {{ competenceBloom }}</p>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "jspdf-autotable";
import Pagination from "../components/Pagination";

const toLower = text => {
  return text.toString().toLowerCase();
};

const searchByName = (items, term) => {
  if (term) {
    return items.filter(item =>
      toLower(item.label.value).includes(toLower(term))
    );
  }
  return items;
};

export default {
  components: { Pagination },
  name: "index",
  name2: "TablePagination",
  bodyClass: "index-page",
  props: {},
  name3: "RegularCheckboxes",
  check: "RegularRadio",
  name4: "TableSearch",

  data() {
    return {
      search: null,
      size: 10,
      pageCount: 0,
      pageItems: [],
      toBeSearched: [],
      toBePaged: [],
      moduleList: [],
      studyProgramList: [],
      lecturers: [],
      lecturerLabels: [],
      department: "",
      selectedLecturer: "",
      selectedStudyProgram: "",
      moduleType: "",
      language: [],
      learnTypes: [],
      exams: [],
      competence: [],
      bloomTax: [],
      colorPagination: 1,
      courses: false,
      studyProgram: "",
      course: "",
      labels: [],
      showList: true,
      arrowCounter: 0,
      moduleQuery1:
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/>   " +
        "PREFIX schema: <https://schema.org/>   " +
        "SELECT DISTINCT ?moduleID ?label ?studyprogramLabel ?departmentLabel ?lecturerLabel " +
        "WHERE {   " +
        "  ?moduleID a module:Module ;   " +
        "            schema:isPartOf ?studyprogram ;   " +
        "            schema:accountablePerson ?lecturer; " +
        "            module:progrSpecProp_ModuleType ?moduleTypeCode ; " +
        "            module:progrSpecProp_Language ?languageCode ; " +
        "            module:about_LResults ?LResultsCode ; " +
        "            schema:name ?label .   " +
        '  FILTER(lang(?label) = "de")   ' +
        "  ?lecturer rdfs:label ?lecturerLabel .   " +
        "  ?studyprogram schema:name ?studyprogramLabel .   " +
        '  FILTER(lang(?studyprogramLabel) = "de")   ' +
        "  ?studyprogram  schema:provider  ?department . " +
        "  ?department rdfs:label ?departmentLabel . " +
        "  ?moduleTypeCode schema:valueReference ?moduleTypeValue . " +
        "  ?moduleTypeValue schema:value ?moduleType . " +
        "  ?languageCode schema:valueReference ?languageValue . " +
        "  ?languageValue schema:value ?language . " +
        "  ?LResultsCode schema:itemListElement ?LResultList . " +
        "  ?LResultList schema:additionalType ?competence . ",
      moduleQuery2: " } ORDER BY ?label ",
      competenceBloom: [],
      filters: [null, null, null, null, null, null, null]
    };
  },

  methods: {
    /*getPagination(value) {
      this.toBeSearched = value.pageItems
      this.pageItems = value.pageItems
    },*/
    searchOnTable() {
      if (this.search != null && this.search != "") {
        this.colorPagination = 1;
        let searchResults = searchByName(this.toBeSearched, this.search);
        this.toBePaged = searchResults;
        this.pageItems = searchResults.slice(
          (this.colorPagination - 1) * this.size,
          this.colorPagination * this.size
        );
        this.pageCount = Math.ceil(this.toBePaged.length / this.size);
      } else {
        this.colorPagination = 1;
        this.toBePaged = this.moduleList;
        this.pageItems = this.moduleList.slice(
          (this.colorPagination - 1) * this.size,
          this.colorPagination * this.size
        );
        this.pageCount = Math.ceil(this.toBePaged.length / this.size);
      }
    },
    queryLecturer() {
      let query =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX thbfbwm: <https://www.th-brandenburg.de/mitarbeiterseiten/fbw/> " +
        "SELECT DISTINCT ?lecturer ?lecturerLabel " +
        "WHERE {?lecturer a module:Lecturer; rdfs:label ?lecturerLabel.} ORDER BY ?lecturer";
      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query",
          query,
          {
            headers: { "Content-Type": "application/sparql-query" }
          }
        )
        .then(response => {
          let lecs = response.data.results.bindings;
          for (let a = 0; a < lecs.length; a++) {
            this.lecturers.push(lecs[a].lecturer.value);
            this.lecturerLabels.push(lecs[a].lecturerLabel.value);
          }
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    queryStudyProgram() {
      let query1 =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT ?studyprogramID ?studyProgramName  " +
        "WHERE { " +
        "  ?studyProgram a module:StudyProgram ; " +
        "          schema:name ?studyProgramName ; " +
        "          schema:provider ?department . " +
        '  FILTER(lang(?studyProgramName) = "de") ' +
        "  BIND(STR(?studyProgram) AS ?studyprogramID) ";

      if (this.department != "" && this.department != null) {
        query1 =
          query1 + '  FILTER(STR(?department) = "' + this.department + '")  ';
      }

      let query2 = "} ORDER BY ?studyProgramName";
      let query = query1 + query2;
      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query",
          query,
          {
            headers: { "Content-Type": "application/sparql-query" }
          }
        )
        .then(response => {
          this.studyProgramList = response.data.results.bindings;
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    queryModuleList(query) {
      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query",
          query,
          {
            headers: { "Content-Type": "application/sparql-query" }
          }
        )
        .then(response => {
          //let list = response.data.results.bindings;
          this.moduleList = response.data.results.bindings;
          /*for (let a = 0; a < list.length; a++) {
            let obj = {
              uri: list[a].module.value,
              label: list[a].label.value,
              studyprogram: list[a].studyprogramLabel.value
            };
            this.moduleList.push(obj);
          }*/
          this.toBePaged = this.moduleList;
          this.pageCount = Math.ceil(this.moduleList.length / this.size);
          this.pageItems = this.toBePaged.slice(0, this.size);
          this.toBeSearched = this.moduleList;
        })
        .catch(e => {
          this.errors.push(e);
        });
    }
  },
  watch: {
    colorPagination(v) {
      this.pageItems = this.toBePaged.slice((v - 1) * this.size, v * this.size);
      //this.toBeSearched = this.moduleList.slice((v - 1) * this.size, v * this.size);
    },
    department(v) {
      this.selectedStudyProgram = "";
      this.queryStudyProgram();
      if(v != "" && v != null) {
        //let query = this.moduleQuery1 + ' FILTER(STR(?department) = "' + v + '") ' + this.moduleQuery2;
        this.filters.splice(0, 1, ' FILTER(STR(?department) = "' + v + '")  ');
        // [0] = ' FILTER(STR(?department) = "' + v + '")  ';
        //this.queryModuleList(query)
      } else {
        this.filters.splice(0, 1, null);
      }
    },
    selectedStudyProgram(v) {
      if(v != "" && v != null) {
        this.filters.splice(1, 1, ' FILTER(STR(?studyprogram) = "' + v + '")  ');
      } else {
        this.filters.splice(1, 1, null);
      }
    },
    moduleType(v) {
      if(v != "" && v != null) {
        this.filters.splice(2, 1, ' FILTER REGEX(?moduleType, "' + v + '")  ');
      } else {
        this.filters.splice(2, 1, null);
      }
    },
    selectedLecturer(v) {
      if(v != "" && v != null) {
        let i = this.lecturerLabels.indexOf(v);
        if(i > 0) {
          let value = this.lecturers[i];
          this.filters.splice(3, 1, ' FILTER(STR(?lecturer) = "' + value + '")  ');
        }
      } else {
        this.filters.splice(3, 1, null);
      }
    },
    language(v) {
      if(v.length > 0) {
        let arr = [];
        for (let a = 0; a < v.length; a++) {
          if (v[a] == "andere") {
            arr[a] = ' (?language != "de" && ?language != "en") ';
          } else {
            arr[a] = ' (?language = "'+ v[a] +'") '
          }
        }
        let filStr = ' FILTER (' + arr.join(' || ') + ')  ';
        this.filters.splice(4, 1, filStr);
      } else {
        this.filters.splice(4, 1, null);
      }
    },
    competence(v) {
      if(v.length > 0) {
        this.competenceBloom = new Set()
        for (let a = 0; a < v.length; a++) {
          this.competenceBloom.add(v[a]);
        }
        if(this.bloomTax.length > 0 && v.includes("SubjectMatterCompetence")) {
          for (let b = 0; b < this.bloomTax.length; b++) {
            this.competenceBloom.add(this.bloomTax[b]);
          }
        }
      console.log("comBloom1", this.competenceBloom)
        if(this.bloomTax.length > 0 && v.includes("SubjectMatterCompetence")) {
          this.competenceBloom.delete("SubjectMatterCompetence")
        }
        console.log("comBloom2", this.competenceBloom)
        let arr = [];
        this.competenceBloom.forEach (function(value) {
          arr.push(' STR(?competence) = "https://bmake.th-brandenburg.de/module/' + value + '" ' )
        })
        let filStr = ' FILTER (' + arr.join(' || ') + ')  ';
        this.filters.splice(5, 1, filStr);
      } else {
        this.filters.splice(5, 1, null);
      }
    },
    bloomTax(v) {
      if(v.length > 0 ) {
        this.competenceBloom = new Set()
        for (let a = 0; a < v.length; a++) {
          this.competenceBloom.add(v[a]);
        }
        for (let b = 0; b < this.competence.length; b++) {
          this.competenceBloom.add(this.competence[b]);
        }
        console.log("comBloom3", this.competenceBloom)
        if(this.competenceBloom.has("SubjectMatterCompetence")) {
          this.competenceBloom.delete("SubjectMatterCompetence")
        }
        console.log("comBloom4", this.competenceBloom)
        let arr = [];
        this.competenceBloom.forEach (function(value) {
          arr.push(' STR(?competence) = "https://bmake.th-brandenburg.de/module/' + value + '" ' )
        })
        let filStr = ' FILTER (' + arr.join(' || ') + ')  ';
        this.filters.splice(5, 1, filStr);
      } else if (this.competence.length > 0) {
        this.competenceBloom = new Set()
        for (let a = 0; a < this.competence.length; a++) {
          this.competenceBloom.add(this.competence[a]);
        }
        let arr = [];
        this.competenceBloom.forEach (function(value) {
          arr.push(' STR(?competence) = "https://bmake.th-brandenburg.de/module/' + value + '" ' )
        })
        let filStr = ' FILTER (' + arr.join(' || ') + ')  ';
        this.filters.splice(5, 1, filStr);
      } else {
        this.filters.splice(5, 1, null);
      }
    },
    filters(v) {
      let filStr = "";
      for (let a = 0; a < v.length; a++) {
        if (v[a] != "" && v[a] != null) {
          filStr = filStr + v[a];
        }
      }
      let query = this.moduleQuery1 + filStr + this.moduleQuery2;
      console.log(query)
      this.queryModuleList(query)
    }
    /*search(v){
      if (v == null || v == "") {
        console.log("test")
        this.toBePaged = this.moduleList;
        this.colorPagination = 1;
      }
    }*/
  },
  mounted() {
    //this.searched = this.users;
    let query = this.moduleQuery1 + this.moduleQuery2;
    this.queryLecturer();
    this.queryStudyProgram();
    this.queryModuleList(query);
  }
};
</script>
<style lang="scss">
/*.md-table.md-theme-default .md-table-content {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}*/

/*#download {
  background-color: #fff9c4 !important;
}
#download:hover {
  background-color: #fcdd86 !important;
  background-color: #ea80fc;
}*/

/*.header-filter {
  padding: 5%;
}*/

/*.brand h3 {
  margin-top: 0 !important;
}*/

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

#mods td,
#mods th {
  border: 1px solid #ddd;
  padding: 8px;
}

#mods tr:nth-child(even) {
  background-color: #f2f2f2;
}

#mods tr:hover {
  background-color: #ddd;
}

#mods th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: rgb(255, 143, 0);
  color: white;
}
</style>
