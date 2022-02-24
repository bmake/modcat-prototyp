<template>
  <div class="wrapper">
    <md-content style="border-color: #0070c0">
      <div style="width: 100%">
        <h3 style="color: #0070c0"><b>Rahmendaten</b></h3>
        
        <h4>Aktuelle Studien- und Prüfungsordnung (SPO)</h4>
        <a :href="resultBase[0].spolink.value" target="_blank">
          {{ resultBase[0].sponame.value }}
        </a> <br>
        <md-divider
            style="height:2px; border-width:0; color: #92d050; background-color: #0070c0"
          />

        <h4>SPO-relevante Daten</h4>
        <b>Typ:</b> {{ resultBase[0].modType_name.value }} <br>
        <b>Rhythmus:</b> {{ resultBase[0].courseMode.value }} <br>
        <b>Dauer:</b> {{ resultBase[0].duration.value }} <br>
        <b>ECTS:</b> {{ resultBase[0].ects.value }} <br>
        <b>SWS:</b> {{ resultBase[0].swsSum.value }} <br>
        <div v-if="(resultBase[0].eduUse.value != '')"><b>Zweck:</b> {{ resultBase[0].eduUse.value }} <br></div>
        <div v-if="resultBase[0].pre.value != ''"><b>Vorraussetzung:</b> {{ resultBase[0].pre.value }} <br></div>
        
        <md-divider
            style="height:2px; border-width:0; color: #92d050; background-color: #0070c0"
          />

        <h4>Modulverantwortliche und Lehrende</h4>
        <b>Verantwortlich: </b>
        <a :href="resultBase[0].accPerson.value" target="_blank">
          {{ resultBase[0].accPersonLabel.value }}
        </a> <br>
        <md-divider
            style="height:2px; border-width:0; color: #92d050; background-color: #0070c0"
          />

        <h4>Weitere Informationen</h4>       
        <b>Lehrveranstaltungen:</b> {{ resultBase[0].learnTypes.value }} <br>
        <div v-if="(resultBase[0].comment.value != '')"><b>Kommentar:</b> {{ resultBase[0].comment.value }} <br></div>
        <b>Sprache(n):</b> {{ resultBase[0].languages.value }} <br>
        <b>Notenanteil:</b> {{ resultBase[0].grade_name.value }} <br>
        <b>Website:</b>
        <a :href="resultBase[0].url.value" target="_blank">
          {{ resultBase[0].url.value }}
        </a> <br>

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
          this.resultBase = response.data.results.bindings;
          this.moduleUri = this.resultBase[0].uri.value;
          this.studyProgram = this.resultBase[0].studyProgram.value;

          //axios ist asychron, deswegen hier nächste query
          this.queryBase(this.code, this.moduleUri, this.studyProgram);
        })
        .catch(e => {
          this.errored = true;
          this.errors.push(e);
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
        "SELECT DISTINCT ?uri ?label ?studyProgram " +
        "WHERE { " +
        '  ?uri schema:courseCode "' + code + '" ; ' +
        "    schema:name ?label ;" +
        "      schema:isPartOf ?studyProgram." +
        '    FILTER(lang(?label) = "de")' +
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
        "SELECT DISTINCT ?code ?label ?accPerson ?accPersonLabel ?duration ?semester ?modType_name ?grade_name ?learnTypes ?eduUse ?swsSum ?ects ?studysem ?courseMode ?pre ?basedOnModuls ?url ?comment ?languages ?sponame ?spolink" +
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
        ' SELECT (GROUP_CONCAT(DISTINCT ?basedOnModul; separator=" | ") as ?basedOnModuls) ' +
        "    WHERE { " +
        "<" +
        moduleUri +
        ">  schema:isBasedOn ?basedOn . " +
          // Abhängigkeit zwischen Modulen und Fachbereichen abzufragen
        " ?basedOn schema:name ?basedOnModulLabel ;   " +
        "          schema:isPartOf ?studyprogram .   " +
        "  ?studyprogram  schema:provider  ?department  " +
        ' FILTER(lang(?basedOnModulLabel) = "de") ' +
        "  BIND(SUBSTR(STR(?department), 44) AS ?studyprogramLabel)   " +
        '  BIND(CONCAT(STR(?basedOn), " @ ", ?basedOnModulLabel, " @ ", ?studyprogramLabel) as ?basedOnModul) ' +
        "   } " +
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

<style lang="scss">
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