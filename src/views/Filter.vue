<template>
  <div class="wrapper">
    <BrowsingHeader />
    <div class="main main-raised">
      <div style="text-align: center; margin-bottom:10px; padding-top: 3em">
        <h3>
          <b>Bitte wählen Sie Ihre Filter auf der linken Seite aus um die Tabelle einzuschränken.</b>
        </h3>
      </div>

      <div class="section section-examples">
        <div class="container-fluid text-left" style="margin-left:100px;">
          <div class="md-layout">
            <div class="md-layout-item">
              <h4><b>Wählen Sie die gewünschten Fachbereiche</b></h4>
                  <md-checkbox v-model="array" value="1">Fachbereich Wirtschaft</md-checkbox>
                  <md-checkbox v-model="array" value="2">Fachbereich Informatik</md-checkbox>
                  <md-checkbox v-model="array" value="3">Fachbereich Technik</md-checkbox>
            
              <h4><b>Wählen Sie Ihren gewünschten Studiengang</b></h4>
                  <md-field style="width: 500px">
                    <label for="course">Studiengang</label>   
                    <md-select v-model="cou" name="course" id="course" >
                      <md-option value="Betriebswirtschaft B.Sc.">Betriebswirtschaft B.Sc.</md-option>
                      <md-option value="Betriebswirtschaft M.Sc.">Betriebswirtschaft M.Sc.</md-option>
                    </md-select>
                  </md-field>

              <h4><b>Wählen Sie ein Modultyp</b></h4>
                  <md-radio v-model="radio" :value="objA">Pflicht</md-radio>
                  <md-radio v-model="radio" :value="objB">Wahl</md-radio>
                  <md-radio v-model="radio" :value="objC">Studium Generale</md-radio>


              <h4><b>Wählen Sie die Lehrperson</b></h4>
                  <md-field style="width: 500px">
                    <label for="lecturer">Lehrperson</label>   
                    <md-select v-model="lec" name="lecturer" id="lecturer" >
                      <md-option value="Meister">Prof. Vera G. Meister</md-option>
                      <md-option value="Johannsen">Prof. Andreas Johannsen</md-option>
                    </md-select>
                  </md-field>

              <h4><b>Wählen Sie die Lehrsprache</b></h4>
                  <md-checkbox v-model="array1" value="1">deutsch</md-checkbox>
                  <md-checkbox v-model="array1" value="2">englisch</md-checkbox>
                  <md-checkbox v-model="array1" value="3">andere</md-checkbox>

              <h4><b>Wählen Sie die Lehr-Lernform</b></h4>
                  <md-checkbox v-model="array2" value="1">Problem Based Learning</md-checkbox>
                  <md-checkbox v-model="array2" value="2">Vortragend</md-checkbox>
                  <md-checkbox v-model="array2" value="3">Projektarbeit</md-checkbox>
        
              <h4><b>Wählen Sie die Prüfungsform</b></h4>
                  <md-checkbox v-model="array3" value="1">Schriftlich</md-checkbox>
                  <md-checkbox v-model="array3" value="2">Mündlich</md-checkbox>
                  <md-checkbox v-model="array3" value="3">Projekt</md-checkbox>

              <h4><b>Wählen Sie die Kompetenzstufe</b></h4>
                  <md-checkbox v-model="array4" value="1">Anwendung</md-checkbox>
                  <md-checkbox v-model="array4" value="2">Orientierung</md-checkbox>
                  <md-checkbox v-model="array4" value="3">Wiedergabe</md-checkbox>

              <h4><b>Wählen Sie die Kompetenzziele</b></h4>
                  <md-checkbox v-model="array5" value="1">Soziale</md-checkbox>
                  <md-checkbox v-model="array5" value="2">Personale</md-checkbox>
                  <md-checkbox v-model="array5" value="3">Technische</md-checkbox>
          </div>
        
               <div class="md-layout-item" style="padding-right:105px; margin-left: -200px">
                  <md-table v-model="searched" md-sort="name5" md-sort-order="asc" md-card md-fixed-header style="height: 1000px" >
                        <md-table-toolbar>
                          <div class="md-toolbar-section-start">
                            <h1 class="md-title">Users</h1>
                          </div>

                          <md-field md-clearable class="md-toolbar-section-end">
                            <md-input placeholder="Suchfeld..." v-model="search" @input="searchOnTable" />
                          </md-field>
                        </md-table-toolbar>

                        <md-table-row slot="md-table-row" slot-scope="{ item }">
                          <md-table-cell md-label="Modultitel" md-sort-by="name">{{ item.name }}</md-table-cell>
                          <md-table-cell md-label="Studiengang" md-sort-by="email">{{ item.email }}</md-table-cell>
                          <md-table-cell md-label="FB" md-sort-by="gender">{{ item.gender }}</md-table-cell>
                          <md-table-cell md-label="Lehrperson" md-sort-by="title">{{ item.title }}</md-table-cell>
                        </md-table-row>
                      </md-table>   
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "jspdf-autotable";
import BrowsingHeader from '@/views/components/BrowsingHeader.vue';

  const toLower = text => {
    return text.toString().toLowerCase()
  }

  const searchByName = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.name).includes(toLower(term)))
    }

    return items
  }

export default {
  components: {
    BrowsingHeader
  },
  name: "index",
  bodyClass: "index-page",
  props: {},
  name: 'RegularCheckboxes',
  check: 'RegularRadio',
  name5: 'TableSearch',

  data() {

    return {
      search: null,
      searched: [],
      users: [
        {
          id: 1,
          name: "Enterprise Knowledge Enginering",
          email: "WI Master",
          gender: "FBW",
          title: "Prof. Vera Meister"
        },
                {
          id: 2,
          name: "Betriebssysteme",
          email: "WI Master",
          gender: "FBW",
          title: "Prof. Rother"
        },
                {
          id: 3,
          name: "Mathe 1",
          email: "WI Bachelor",
          gender: "FBW",
          title: "Prof. Andreas Johannsen"
        },
                {
          id: 1,
          name: "Prozessmodellierung",
          email: "WI Master",
          gender: "FBW",
          title: "Prof. Vera Meister"
        },
                {
          id: 2,
          name: "Design Thinking",
          email: "WI Master",
          gender: "FBW",
          title: "Prof. Jochen Scheeg"
        },
                {
          id: 3,
          name: "Projektmanagement",
          email: "WI Bachelor",
          gender: "FBW",
          title: "Prof. Andreas Johannsen"
        },
        {
          id: 1,
          name: "Mathe 2",
          email: "WI Master",
          gender: "FBW",
          title: "Prof. Vera Meister"
        },
                {
          id: 2,
          name: "Mathe 3",
          email: "WI Master",
          gender: "FBW",
          title: "Prof. Jochen Scheeg"
        },
                {
          id: 3,
          name: "Statistik",
          email: "WI Bachelor",
          gender: "FBW",
          title: "Prof. Andreas Johannsen"
        },
      ],
      modules: [{
                studiengang: '',
                art: '',
                modul: '',
                dozentinnen: '',
                aktion: ''
            }],
      array: [],
      array1: [],
      array2: [],
      array4: [],
      array5: [],
      objA: { check: 'Pflicht' },
      objB: { check: 'Wahl' },
      objC: { check: 'SG' },
      lecturers: false,
      courses: false,
      lecturerList: [],
      studyProgram: "",
      course: "",
      labels: [],
      showList: true,
      arrowCounter: 0
    };
  },
  methods: {
    deleteRow(index, module) {
            var idx = this.modules.indexOf(module);
            console.log(idx, index);
            if (idx > -1) {
                this.modules.splice(idx, 1);
            }
            this.calculateTotal();
        },
        addNewRow() {
            this.modules.push({
                product_no: '',
                product_name: '',
                product_price: '',
                product_qty: '',
                line_total: 0
            });
        },

    
    watch: {
    course(v) {
      this.showList = true;
      let i = this.labels.indexOf(v);
      let value = this.modules[i];
      this.$emit("module", value);
      this.$emit("lecturerList", this.studyProgram);
      this.$emit("newBoolean", false);
    },
    lecturerList(v) {
      this.course = "";
      this.modules = [];
      this.labels = [];
      this.showList = true;
      this.queryLecturerList(v);
    }
  },
methods: {
    queryLecturerList() {
      let spquery =
        "prefix module: <https://bmake.th-brandenburg.de/module/> " +
        "prefix fbw: <https://www.th-brandenburg.de/mitarbeiterseiten/fbw/> " +
        "prefix fbt: <https://www.th-brandenburg.de/mitarbeiterseiten/fbt/> " +
        "prefix fbi: <https://www.th-brandenburg.de/mitarbeiterseiten/fbi/> " +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX fb: <http://rdf.freebase.com/ns/> " +
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
        "PREFIX sc: <http://purl.org/science/owl/sciencecommons/> " +
        "prefix schema: <https://schema.org/> " +
        "SELECT DISTINCT ?lecturers ?fachbereich " +
        "WHERE { " +
        "?fb schema:provider ?fachbereich . " +
        "OPTIONAL { ?a schema:isPartOf ?p . } " +
        "optional { ?a schema:accountablePerson ?lecturers . } " +
        "} " +
        "limit 100 ";

      axios
        .post("http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query", spquery, {
          headers: { "Content-Type": "application/sparql-query" }
        })
        .then(response => {
          this.lecturerList = response.data.results.bindings;
          for (let a = 0; a < this.lecturerList.length; a++) {
            this.lecturers.push(this.lecturerList[a].lecturers.value);
            this.fachbereich.push(this.lecturerList[a].fachbereich.value);
          }
          console.log(response);
        })
        .catch(e => {
          this.errors.push(e);
        });
    }
  },

        newUser () {
        window.alert('Noop')
      },
      searchOnTable () {
        this.searched = searchByName(this.users, this.search)
      }
    },
    created () {
      this.searched = this.users
    },


    changeShowPopUp(value) {
      this.showPopUp = value;
    },
    getModule(value) {
      this.selectedModule = value;
      this.basicFilled = false;
    },
    getStudyProgram(value) {
      this.studyProgram = value;
    },
    getCode(value) {
      this.code = value;
    },
    getNewBoolean(value) {
      this.newBoolean = value;
    },
    changeBasicFill(value) {
      this.basicFilled= value;
    },
    getModBasicData(value) {
      this.modBasis = value;
      console.log(value)
      this.code = value[0].code.value;
    },
    getModOutcomes(value) {
      this.modOutcome = value;
    },
    getModMethod(value) {
      this.modMethod = value;
    },
    getModLiter(value) {
      this.modLiter = value;
    },
    getModTeacher(value) {
      this.modTeacher = value;
    },
    getFormType(value) {
      this.form = value;
    },
  };
</script>
<style lang="scss">
.faded {
  opacity: 0.2 !important;
  transition: 0.3s opacity !important;
}
.highlight {
  opacity: 1 !important;
}

g.selected rect {
  stroke: #ffc107 !important;
  stroke-width: 2px !important;
}

.md-button.choosed {
  background-color: #ea80fc !important;
}

#download {
  background-color: #fff9c4 !important;
}
#download:hover {
  background-color: #fcdd86 !important;
  background-color: #ea80fc;
}

.header-filter {
  padding: 5%;
}

.brand h3 {
  margin-top: 0 !important;
}

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

#mods td, #mods th {
  border: 1px solid #ddd;
  padding: 8px;
}

#mods tr:nth-child(even){background-color: #f2f2f2;}

#mods tr:hover {background-color: #ddd;}

#mods th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: rgb(255, 143, 0);
  color: white;
}
</style>
