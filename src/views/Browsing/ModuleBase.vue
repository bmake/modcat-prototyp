<template>
  <div class="wrapper">
    <md-content style="border-color: #0070c0">
      <div style="width: 100%">
        <h4>Aktuelle Studien- und Prüfungsordnung (SPO)</h4>
        <div v-if="Object.keys(this.resultBase[0]).includes('spolink') && Object.keys(this.resultBase[0]).includes('sponame')"><a :href="resultBase[0].spolink.value" target="_blank">
          {{ resultBase[0].sponame.value }}
        </a> <br></div>
        <md-divider
            style="height:2px; border-width:0; color: #92d050; background-color: #0070c0"
          />

        <h4>SPO-relevante Daten</h4>
        <b>Typ:</b> {{ resultBase[0].modType_name.value }} <br>
        <b>Rhythmus:</b> {{ resultBase[0].courseMode.value }} <br>
        <b>Dauer:</b> {{ resultBase[0].duration.value }} <br>
        <div v-if="Object.keys(this.resultBase[0]).includes('studysem')"><b>Semester:</b> {{ resultBase[0].studysem.value }} <br></div>
        <b>ECTS:</b> {{ resultBase[0].ects.value }} <br>
        <b>SWS:</b> {{ resultBase[0].swsSum.value }} <br>
        <div v-if="(Object.keys(this.resultBase[0]).includes('eduUse') && resultBase[0].eduUse.value != '')"><b>Zweck:</b> {{ resultBase[0].eduUse.value }} <br></div>
        <div v-if="Object.keys(this.resultBase[0]).includes('pre') && resultBase[0].pre.value != ''"><b>Vorraussetzung:</b> {{ resultBase[0].pre.value }} <br></div>
        <div v-if="Object.keys(this.resultBase[0]).includes('basedOnModulLabel') && Object.keys(this.resultBase[0]).includes('basedOn')">
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
        <div v-if="Object.keys(this.resultBase[0]).includes('learnTypes')"><b>Lehrveranstaltungen:</b> {{ resultBase[0].learnTypes.value }} <br></div>
        <div v-if="(Object.keys(this.resultBase[0]).includes('comment') && resultBase[0].comment.value != '')"><b>Kommentar:</b> {{ resultBase[0].comment.value }} <br></div>
        <div v-if="Object.keys(this.resultBase[0]).includes('languages')"><b>Sprache(n):</b> {{ resultBase[0].languages.value }} <br></div>
        <div v-if="Object.keys(this.resultBase[0]).includes('grade_name')"><b>Notenanteil:</b> {{ resultBase[0].grade_name.value }} <br></div>
        <div v-if="Object.keys(this.resultBase[0]).includes('url')">
          <b>Website:</b>
          <a :href="resultBase[0].url.value" target="_blank">
            {{ resultBase[0].url.value }}
          </a> <br>
        </div>
      </div>
    </md-content>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      resultBase: null,
      resultSubQ1: null,
      loading: true,
      errored: false,
      code: this.$route.params.code,
      moduleUri: '',
      studyProgram: ''
    }
  },
  mounted() {
    //also initates query for base-data
    this.queryForParams(this.code);
  },
  methods: {
    querySparqlQ1(query) {
      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query",
          query,
          {
            headers: { "Content-Type": "application/sparql-query" }
          }
        )
        .then(response => {
          this.resultSubQ1 = response.data.results.bindings;
          this.moduleUri = this.resultSubQ1[0].uri.value;
          //Problem: mehrere Studiengänge möglich, nur erster behandelt
          this.studyProgram = this.resultSubQ1[0].studyProgram.value;

          //axios ist asychron, deswegen hier nächste query
          this.queryBase(this.code, this.moduleUri, this.studyProgram);
        })
        .catch(e => {
          this.errored = true;
          console.log(error);
          
        })
        .finally(() => this.loading = false)
        ;
    },
    queryForParams(code) {
      let subQ1 =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT ?uri ?label ?studyProgram ?FBcode " +
        "WHERE { " +
        '  ?uri schema:courseCode "' + code + '" ; ' +
        "    schema:name ?label ;" +
        "      schema:isPartOf ?studyProgram." +
        '    FILTER(lang(?label) = "de")' +
        //Fachbereich
        "?studyProgram schema:provider ?department ." +
        "?department rdfs:label ?FBcode ;" + //Kürzel wie FBW
        "        rdfs:name ?name." + //vollständiger Name
        "}";

      this.querySparqlQ1(subQ1);
    },
    queryBase(code, moduleUri, studyProgram) {
      //cut prefix
      studyProgram = studyProgram.slice(39);
      
      let query =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/>  " +
        "PREFIX schema: <https://schema.org/>  " +
        "SELECT DISTINCT ?code ?label ?accPerson ?accPersonLabel ?duration ?semester ?modType_name ?grade_name ?learnTypes ?eduUse ?swsSum ?ects ?studysem ?courseMode ?pre ?basedOn ?basedOnModulLabel ?basedCode ?basedUrl ?url ?comment ?languages ?sponame ?spolink" +
        " WHERE {  " +
        "<" +
        moduleUri +
          // Modulkürzel
        ">  schema:courseCode ?code ;  " +
          // Modulbezeichung
        "         schema:name ?label ;  " +
          // ECTS
        "         schema:numberOfCredits ?ects ;  " +
          // Dauer: z.B. 1 Semester...
        "         schema:timeRequired ?duration ;  " +
          // Kurs Instanz (URI)
        "         schema:hasCourseInstance ?semester ;  " +
          // Modulverantwortliche (URI)
        "         schema:accountablePerson ?accPerson . " +
          // Modulverantwortliche Label (Prof. Dr....)
        "   ?accPerson rdfs:label ?accPersonLabel .  " +
          // Deutsche Modulbezeichnungen,
        ' FILTER(lang(?label) = "de") ' +
          // Modultyp (Wahlpflicht, Pflicht)
        "   module:ModuleType_" +
        studyProgram +
        "_" +
        code +
        " schema:value ?modType_name . " +
          // SWS
        "   module:SWS_" +
        studyProgram +
        "_" +
        code +
        " schema:value ?swsSum . " +
          // Häufigkeit (jedes Wintersemester, jedes Sommersemester ...)
        "   ?semester schema:courseMode ?courseMode .  " +
          // Alle Vorraussetzungen in einem String zu fügen, getrennt durch '/'
        " OPTIONAL { " +
        '  SELECT (GROUP_CONCAT(?cpre; separator="/") as ?pre) ' +
        "  WHERE { <" +
        moduleUri +
        "> schema:coursePrerequisites ?cpre . " +
        ' FILTER(lang(?cpre) != "en") ' +
        "  } " +
        "} " +
          // Alle Lehrformen in einem String zu fügen, getrennt durch ' , '
        " OPTIONAL { " +
        '  SELECT (GROUP_CONCAT(?learnType; separator=", ") as ?learnTypes) ' +
        "  WHERE { <" +
        moduleUri +
        "> schema:interactivityType ?learnType . " +
        ' FILTER(lang(?learnType) = "de") ' +
        "  } " +
        "} " +
          // Alle Sprachen in einem String zu fügen, getrennt durch ' , '
        " OPTIONAL { " +
        '  SELECT (GROUP_CONCAT(?lan; separator=", ") as ?languages) ' +
        "    WHERE { " +
        "      module:Language_" +
        studyProgram +
        "_" +
        code +
        "      schema:value ?lan . " +
        "    }" +
        "  } " +
          //Verwendbarkeit auf Deutsch abzufragen
        " OPTIONAL { <" +
        moduleUri +
        ">  schema:educationalUse ?eduUse . " +
        ' FILTER(lang(?eduUse) = "de") ' +
        " } " +
          // Alle Module (URI) bei "basiert auf", getrennt durch ' | '
        " OPTIONAL { " +
        // Vorausgesetztes Modul
        "<" +
        moduleUri +
        ">  schema:isBasedOn ?basedOn . " +
        " ?basedOn schema:name ?basedOnModulLabel . " +
        ' FILTER(lang(?basedOnModulLabel) = "de") ' +
        'BIND(replace(str(?basedOn), str(module:), "") as ?basedCode) ' +
        'BIND(concat("/browsing/modul/", replace(str(?basedOn), str(module:), "")) as ?basedUrl) ' +
        " } " +
        //URL des Moduls
        " OPTIONAL { <" +
        moduleUri +
        ">  schema:url ?url . " +
        " } " +
          //Kommentar für Modul
        " OPTIONAL { <" +
        moduleUri +
        ">  schema:comment ?comment . " +
        " } " +
          // Notengewichtung
        " OPTIONAL { " +
        " module:GradingRatio_" +
        studyProgram +
        "_" +
        code +
        " schema:value ?grade_name . " +
        "  } " +
        " OPTIONAL { " +
        " module:StudySem_" +
        studyProgram +
        "_" +
        code +
        " schema:value ?studysem . " +
        "  } " +
        "OPTIONAL { " +
        //Studienordnung (SPO) Name und Link
        "  module:" +
        studyProgram +
        " schema:subjectOf ?spocode ." +
  	    "  ?spocode schema:url ?spolink;" +
        "   	   schema:name ?sponame." +
        "}" +
        " } ";

      //console.log(query);

      
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
          console.log(e);
        });
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