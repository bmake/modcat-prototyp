<template>
  <div class="wrapper">
    <BrowsingHeader />
    <div class="main main-raised">
      <div style="text-align: center; margin-bottom:10px; padding-top: 3em">
        <h3>
          <b>Modulbeschreibung: </b><router-link :to="{ name: 'modul', params: { code: $route.params.code }}">{{ info[0].label.value }}</router-link>
        </h3>
        <h3>
          <b>Studiengang: </b><router-link to="/#">{{ info[0].studyProgramName.value }} </router-link>
          <b>Fachbereich: </b><router-link to="/#">{{ info[0].FBcode.value }}</router-link>

        </h3>
      </div>
      <!-- nested routing -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import BrowsingHeader from "@/views/components/BrowsingHeader.vue";
import axios from "axios";

export default {
  components: {
    BrowsingHeader
  },
  data() {
    return {
      info: null,
      loading: true,
      errored: false,
      code: this.$route.params.code
    }
  },
  mounted() {
    this.queryModul(this.code);
  },
  methods: {
    querySparql(query) {
      //fragt per Axios query, speichert in info, loading und errored zur Kontrolle
      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query",
          query,
          {
            headers: { "Content-Type": "application/sparql-query" }
          }
        )
        .then(response => {
          this.info = response.data.results.bindings;
        })
        .catch(e => {
          this.errored = true;
          this.errors.push(e);
          console.log(error);
          
        })
        .finally(() => this.loading = false)
        ;
    },
    queryModul(code) {
      //aus Modulkürzel den Titel, Studiengang und Fachbereich
      let modifiedCode = '"' + code + '"';

      let query =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " + 
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX fbw: <https://www.th-brandenburg.de/mitarbeiterseiten/fbw/> " +
        "PREFIX fbi: <https://www.th-brandenburg.de/mitarbeiterseiten/fbi/> " +
        "PREFIX fbt: <https://www.th-brandenburg.de/mitarbeiterseiten/fbt/> " +
        "PREFIX schema: <https://schema.org/> " +
  
        "SELECT DISTINCT ?url ?label ?studyProgramName ?FBcode" +
        " WHERE { " +
	      //Modul
  	    '?url  schema:courseCode ' + modifiedCode + ' . ' +
        "?url a module:Module ; " +
        //Modultitel
        "    schema:name ?label; " +
        "  schema:isPartOf ?studyProgram . " +
        'FILTER(lang(?label) = "de") ' +

        //Studiengang
        "?studyProgram a module:StudyProgram ; " +
        "  schema:name ?studyProgramName . " +
        'FILTER(lang(?studyProgramName) = "de") ' +

        //Fachbereich
        "?studyProgram schema:provider ?department ." +
        "?department rdfs:label ?FBcode ;" + //Kürzel wie FBW
        "        rdfs:name ?name." + //vollständiger Name
        "}";
        console.log(query);
      this.querySparql(query);
    }
  }
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

.md-content {
  width: 35%;
  display: inline-flex;
  justify-content: left;
  align-items: center;
  border-radius: 5px;
  border-style: solid;
  margin: 2px;
  padding: 5px;
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