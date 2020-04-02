<template>
  <div class="wrapper">
    <parallax
      class="page-header header-filter"
      style="background-color: #FF8F00;"
    >
      <div class="md-layout">
        <div class="md-layout-item">
          <div class="image-wrapper">
            <div class="brand">
              <h1>Modulkatalog @THB</h1>
              <h3>Fachbereich Wirtschaft</h3>
              <div>
                <Select @module="getModule" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </parallax>
    <div class="main main-raised">
      <div class="section section-examples">
        <div class="container-fluid text-center">
          <div class="md-layout">
            <div class="md-layout-item">
              <SVGGraph
                :module-uri="selectedModule"
                @modBasicData="getModBasicData"
                @modOutcomes="getModOutcomes"
                @modMethods="getModMethod"
                @modLiterature="getModLiter"
                @modTeachers="getModTeacher"
                @formType="getFormType"
              >
              </SVGGraph>
            </div>
            <div class="md-layout-item">
              <md-button
                href=""
                @click="generatePDF"
                class="md-simple md-success md-lg"
                >Download PDF</md-button
              >
              <keep-alive>
                <component
                  v-bind:is="(form = this.form)"
                  :modBasis="modBasis"
                  :moduleUri="selectedModule"
                />
                <!--<component v-bind:is="form = 'Dynamic'"></component>-->
              </keep-alive>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Select from "./components/Select";
import SVGGraph from "./components/SVGGraph";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import FormBasicData from "./components/FormBasicData";
import FormMethods from "./components/FormMethods";
import FormOutcomes from "./components/FormOutcomes";
import FormLiterature from "./components/FormLiterature";
import FormTeachers from "./components/FormTeachers";
import FormDynamic from "./components/FormDynamic";

export default {
  components: {
    Select,
    SVGGraph,
    BasicData: FormBasicData,
    Methods: FormMethods,
    Outcomes: FormOutcomes,
    Literature: FormLiterature,
    Teachers: FormTeachers,
    Dynamic: FormDynamic
  },
  name: "index",
  bodyClass: "index-page",
  props: {},
  data() {
    return {
      selectedModule: "",
      modBasis: [],
      modOutcome: [],
      modMethod: [],
      modLiter: [],
      modTeacher: [],
      form: "BasicData",
      pdfHead: [],
      pdfBody: []
    };
  },
  methods: {
    getModule(value) {
      this.selectedModule = value;
      this.pdfHead = [];
      this.pdfBody = [];
      this.convertPDFArray();
    },
    getModBasicData(value) {
      this.modBasis = value;
      console.log("ModBasisValueStarter", this.modBasis);
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
    convertPDFArray() {
      console.log("convertSelectedModule", this.selectedModule);
      let query =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/>  " +
        "PREFIX schema: <https://schema.org/>  " +
        "SELECT DISTINCT ?code ?label ?learnTypes ?duration ?curr_des ?modType_name ?eduUse ?courseMode ?accPersonLabel ?instructorLabel ?languages ?pre ?basedOns ?ects ?workloadSum ?workloadDetails ?swsSum ?swsDetails ?exams ?grade_name ?learnResults ?contents ?interTypes ?citations ?comment ?url  " +
        " WHERE {  " +
        "<" +
        this.selectedModule +
        ">  schema:courseCode ?code ;  " +
        "         rdfs:label ?label;  " +
        "         module:eduAlignm_Curr ?curr ;   " +
        "         module:eduAlignm_Grade ?grade ;  " +
        "         module:eduAlignm_ModuleType ?modType ;   " +
        "         schema:educationalCredentialAwarded ?ects ;  " +
        "         schema:hasCourseInstance ?semester ;  " +
        "         schema:educationalUse ?eduUse ;  " +
        "            schema:accountablePerson ?accPerson ;  " +
        "         schema:coursePrerequisites ?pre ;  " +
        "         schema:url ?url ;  " +
        "         schema:comment ?comment .  " +
        "            ?accPerson rdfs:label ?accPersonLabel . " +
        "            ?semester schema:duration ?durationSem;  " +
        "                      schema:courseMode ?courseMode ;  " +
        "                      schema:instructor ?instrctor.  " +
        '            BIND(REPLACE(?durationSem, "P0.5Y", "1 Semester", "i") AS ?durationSem1) ' +
        '            BIND(REPLACE(?durationSem1, "P1Y", "2 Semester", "i") AS ?duration)' +
        "            ?instrctor rdfs:label ?instructorLabel .  " +
        "            ?curr schema:targetName ?curr_name ;  " +
        "                  schema:targetDescription ?curr_des .  " +
        "            ?grade schema:targetName ?grade_name ;  " +
        "                   schema:targetDescription ?grade_des .  " +
        "            ?modType schema:targetName ?modType_name .      " +
        "    " +
        "   OPTIONAL { <" +
        this.selectedModule +
        ">  schema:coursePrerequisites ?pre}  " +
        "   OPTIONAL {  " +
        '    SELECT (GROUP_CONCAT(?basedOnModule; separator=", ") as ?basedOns)  ' +
        "       WHERE {  " +
        "        <" +
        this.selectedModule +
        "> schema:isBasedOn ?basedOn .  " +
        "          ?basedOn rdfs:label ?basedOnModule .  " +
        "    }  " +
        "   }  " +
        "            OPTIONAL {  " +
        '              SELECT (GROUP_CONCAT(?language; separator=", ") as ?languages)  ' +
        "              WHERE {  " +
        "                  <" +
        this.selectedModule +
        "> schema:inLanguage ?lan .  " +
        '          BIND(REPLACE(?lan, "de", "Deutsch", "i") AS ?lan1)  ' +
        '          BIND(REPLACE(?lan1, "en", "Englisch", "i") AS ?language)  ' +
        "              }  " +
        "            }  " +
        "            OPTIONAL {  " +
        '           SELECT (GROUP_CONCAT(?learnType; separator=", ") as ?learnTypes)  ' +
        "              WHERE {  " +
        "                <" +
        this.selectedModule +
        "> schema:learningResourceType ?learnType.  " +
        "              }  " +
        "            }  " +
        "            OPTIONAL {  " +
        '       SELECT (SUM(?workloadValue) as ?workloadSum) (GROUP_CONCAT(?workloadDetail; separator="\\n") as ?workloadDetails)  ' +
        "                WHERE {  " +
        "                  <" +
        this.selectedModule +
        "> module:addProp_CompWL ?addPropCompWL .  " +
        "                  ?addPropCompWL schema:valueReference ?workload .  " +
        "                  ?workload schema:name ?workloadName ;  " +
        "                            schema:value ?workloadValue .  " +
        '                  BIND(CONCAT(?workloadName, ": ", STR(?workloadValue), " Stunden") as ?workloadDetail)  ' +
        "                }  " +
        "            }  " +
        "     OPTIONAL {  " +
        '       SELECT ?swsSum (GROUP_CONCAT(?swsDetail; separator="\\n") as ?swsDetails)  ' +
        "                WHERE {  " +
        "                  <" +
        this.selectedModule +
        "> module:eduAlignm_SWS ?sws ;  " +
        "                                  module:addProp_TeachingForms ?teachingform .  " +
        "                  ?sws schema:targetName ?swsSum .  " +
        "                  ?teachingform schema:valueReference ?value .  " +
        "                  ?value schema:name ?swsName ;  " +
        "                         schema:value ?swsValue .  " +
        '                  BIND(CONCAT(?swsName, ": ", STR(?swsValue)) as ?swsDetail)  ' +
        "                } GROUP BY ?swsSum  " +
        "     }  " +
        "            OPTIONAL {  " +
        '       SELECT (GROUP_CONCAT(?exam; separator="\\n") as ?exams)  ' +
        "                WHERE {  " +
        "                  <" +
        this.selectedModule +
        "> module:about_Exam ?examCode.  " +
        "                  ?examCode schema:itemListElement ?exam .  " +
        "                }  " +
        "            }  " +
        "            OPTIONAL {  " +
        '       SELECT (GROUP_CONCAT(?learnResult; separator="\\n") as ?learnResults)  ' +
        "                WHERE {  " +
        "                  <" +
        this.selectedModule +
        "> module:about_LResults ?LResult.  " +
        "                  ?LResult schema:itemListElement ?resList .  " +
        "                  ?resList schema:description ?learnResult  " +
        "                }  " +
        "            }  " +
        "    OPTIONAL {  " +
        '       SELECT (GROUP_CONCAT(?content; separator="\\n") as ?contents)  ' +
        "                WHERE {  " +
        "                  SELECT ?content  " +
        "                  WHERE {  " +
        "                    <" +
        this.selectedModule +
        "> module:about_Content ?contentCode.  " +
        "                    ?contentCode schema:itemListElement ?content .  " +
        "                  } ORDER BY ?content  " +
        "                }  " +
        "            }  " +
        "            OPTIONAL {  " +
        '       SELECT (GROUP_CONCAT(?interType; separator="\\n") as ?interTypes)  ' +
        "                WHERE {  " +
        "                  <" +
        this.selectedModule +
        "> schema:interactivityType ?interType .  " +
        "                }  " +
        "            }  " +
        "            OPTIONAL {  " +
        '       SELECT (GROUP_CONCAT(?citation; separator="\\n") as ?citations)  ' +
        "                WHERE {  " +
        '                  SELECT (CONCAT((GROUP_CONCAT(?authorLabel; separator=", ")), "\\n", ?headline) as ?citation)  ' +
        "                  WHERE {  " +
        "                    <" +
        this.selectedModule +
        "> schema:citation ?citationCode .  " +
        "                    ?citationCode schema:author ?author ;  " +
        "                                  schema:headline ?headline .  " +
        "                    ?author rdfs:label ?authorLabel .  " +
        "                  } GROUP BY ?headline  " +
        "                }  " +
        "            }  " +
        " }";
      axios
        .post("http://fbw-sgmwi.th-brandenburg.de:3030/modcat/query", query, {
          headers: { "Content-Type": "application/sparql-query" }
        })
        .then(response => {
          console.log("here");
          const res = response.data.results.bindings;
          console.log(res);
          this.pdfHead.push(["Modul-Kurzkennzeichen", res[0].code.value]);
          this.pdfBody.push(["Modulbezeichnung", res[0].label.value]);
          this.pdfBody.push([
            "Aufteilung in Lehrveranstaltungen",
            res[0].learnTypes.value
          ]);
          this.pdfBody.push(["Dauer des Moduls", res[0].duration.value]);
          this.pdfBody.push([
            "Zuordnung zum Curriculum",
            res[0].curr_des.value + ", " + res[0].modType_name.value
          ]);
          this.pdfBody.push(["Verwendbarkeit des Moduls", res[0].eduUse.value]);
          this.pdfBody.push([
            "Häufigkeit des Angebots von Modulen",
            res[0].courseMode.value
          ]);
          this.pdfBody.push([
            "Modulverantwortlicher",
            res[0].accPersonLabel.value
          ]);
          this.pdfBody.push(["Dozent/in", res[0].instructorLabel.value]);
          this.pdfBody.push(["Lehrsprache", res[0].languages.value]);
          this.pdfBody.push([
            "Voraussetzungen",
            res[0].pre.value +
              "basiert auf folgende Module: " +
              res[0].basedOns.value
          ]);
          this.pdfBody.push(["ECTS-Credits", res[0].ects.value]);
          this.pdfBody.push([
            "Gesamtworkload und ihre Zusammensetzung",
            "Gesamt: " +
              res[0].workloadSum.value +
              " Stunden, davon: " +
              "\n" +
              res[0].workloadDetails.value
          ]);
          this.pdfBody.push(["Lehrform/SWS", res[0].swsSum.value]);
          this.pdfBody.push([
            "Studien-/Prüfungsleistungen",
            res[0].exams.value
          ]);
          this.pdfBody.push([
            "Gewichtung der Note in der Gesamtnote",
            res[0].grade_name.value
          ]);
          this.pdfBody.push(["Lernergebnisse", res[0].learnResults.value]);
          this.pdfBody.push(["Inhalte", res[0].contents.value]);
          this.pdfBody.push([
            "Lehr- und Lernmethoden",
            res[0].interTypes.value
          ]);
          this.pdfBody.push(["Literatur", res[0].citations.value]);
          this.pdfBody.push(["Besonderes", res[0].comment.value]);
          this.pdfBody.push(["URL", res[0].url.value]);
          console.log("pdf", this.pdfBody);
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    generatePDF() {
      var doc = new jsPDF();
      doc.autoTable({
        styles: { overflow: "linebreak" },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 130 }
        },
        head: this.pdfHead,
        body: this.pdfBody
      });
      doc.save("module.pdf");
    }
  },
  computed: {},
  mounted() {} /*
  beforeDestroy() {
    window.removeEventListener("resize", this.leafActive);
  }*/
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

@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
}

@media all and (max-width: 500px) {
  .brand h1 {
    font-size: xx-large !important;
  }
}
</style>
