<template>
  <div class="wrapper">
    <div class="header-filter" style="background-color: #FF8F00;">
      <div class="md-layout">
        <div class="md-layout-item">
          <div>
            <div class="brand">
              <img
                src="../../img/logo.svg"
                class="img"
                width="10%"
                height="auto"
              />
              <h1>Modulkatalog @THB</h1>
              <h3>Fachbereich Wirtschaft</h3>
              <div>
                <Select @module="getModule" @studyProgram="getStudyProgram" @newBoolean="getNewBoolean" @showPopUp="showPopUp = true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main main-raised">
      <div style="text-align: center; margin-bottom:10px; padding-top: 3em">
        <h3>
          <b
            >Bitte wählen Sie Ihre Rolle um die Modulbeschreibung zu
            bearbeiten</b
          >
        </h3>

        <md-button
          :disabled="!this.selectedModule"
          v-on:click="
            (role = 1), (style1 = false), (style2 = true), (style3 = false)
          "
          class="md-lg"
          v-bind:class="{ 'md-primary': !style2, 'md-rose': style2 }"
          >Lehrende</md-button
        >
        <md-button
          :disabled="!this.selectedModule"
          v-on:click="
            (role = 2), (style1 = false), (style2 = false), (style3 = true)
          "
          class="md-lg"
          v-bind:class="{ 'md-primary': !style3, 'md-rose': style3 }"
          >Studiengangleitung</md-button
        >
        <md-button
          class="md-lg"
          @click="showPopUp = true"
          v-bind:class="{ 'md-primary': !newBoolean, 'md-rose': newBoolean }"
          >Neues Modul</md-button
        >
        <NewModulePopUp
          v-if="showPopUp"
          @close="showPopUp = false"
          @module="getModule"
          @code="getCode"
          @newBoolean="getNewBoolean"
          @modBasicData="getModBasicData"
          @studyProgram="getStudyProgram"
          @modOutcomes="getModOutcomes"
          @modMethods="getModMethod"
        >
        </NewModulePopUp>
      </div>

      <div class="section section-examples">
        <div class="container-fluid text-center">
          <div class="md-layout">
            <div class="svg md-layout-item">
              <SVGGraph
                :module-uri="selectedModule"
                :studyProgram="studyProgram"
                :role="role"
                :code="code"
                :newBoolean="newBoolean"
                @modBasicData="getModBasicData"
                @modOutcomes="getModOutcomes"
                @modMethods="getModMethod"
                @modLiterature="getModLiter"
                @modTeachers="getModTeacher"
                @formType="getFormType"
              >
              </SVGGraph>
            </div>
            <div class="form md-layout-item">
              <div
                v-if="role == 1 || role == 2"
                style="text-align: right; padding: 1em"
              >
                <md-button
                  id="download"
                  @click="generatePDF"
                  class="md-simple md-success md-lg"
                  :disabled="selectedModule == ''"
                  >Modulbeschreibung herunterladen</md-button
                >
              </div>
              <div
                v-else
                class="md-layout md-gutter md-alignment-center-center"
              >
                <div class="brand2">
                  <h2>
                    <b>Willkommen zu Modulkatalog@THB</b>
                  </h2>
                  <p>Sie können die Modulbeschreibung hier herunterladen</p>
                  <p v-if="selectedModule == ''">
                    Bitte wählen Sie zuerst ein Modul aus
                  </p>
                  <md-button
                    @click="generatePDF"
                    class="md-warning md-lg"
                    :disabled="selectedModule == ''"
                    >Modulbeschreibung herunterladen</md-button
                  >
                </div>
              </div>
              <div v-show="role == 1 || role == 2">
                <keep-alive>
                  <component
                    v-bind:is="(form = this.form)"
                    @basicFill="changeBasicFill"
                    :role="role"
                    :modBasisOrigin="modBasis"
                    :studyProgram="studyProgram"
                    :newBoolean="newBoolean"
                    :moduleUri="selectedModule"
                    :code="code"
                    :basicFilled="basicFilled"
                    :modOutcomeOrigin="modOutcome"
                    :modMethodOrigin="modMethod"
                  />
                </keep-alive>
              </div>
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
import NewModulePopUp from "./components/NewModulePopUp";

export default {
  components: {
    Select,
    SVGGraph,
    BasicData: FormBasicData,
    Methods: FormMethods,
    Outcomes: FormOutcomes,
    Literature: FormLiterature,
    Teachers: FormTeachers,
    Dynamic: FormDynamic,
    NewModulePopUp
  },
  name: "index",
  bodyClass: "index-page",
  props: {},
  data() {
    return {
      selectedModule: "",
      studyProgram: "",
      code: null,
      basicFilled: false,
      role: null,
      newBoolean: false,
      modBasis: [],
      modOutcome: [],
      modMethod: [],
      modLiter: [],
      modTeacher: [],
      form: "BasicData",
      style1: false,
      style2: false,
      style3: false,
      showPopUp: false
    };
  },
  methods: {
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
    generatePDF() {
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
        "         schema:accountablePerson ?accPerson ;  " +
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
        '       SELECT ?swsSum  ' +
        "                WHERE {  " +
        "                  <" +
        this.selectedModule +
        "> module:eduAlignm_SWS ?sws .  " +
        //"                                  module:addProp_TeachingForms ?teachingform .  " +
        "                  ?sws schema:targetName ?swsSum .  " +
        //"                  ?teachingform schema:valueReference ?value .  " +
        //"                  ?value schema:name ?swsName ;  " +
        //"                         schema:value ?swsValue .  " +
        //'                  BIND(CONCAT(?swsName, ": ", STR(?swsValue)) as ?swsDetail)  ' +
        "                }  " +
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
          const res = response.data.results.bindings;
          let pdfHead = [];
          let pdfBody = [];
          let code = res[0].code.value;
          pdfHead.push(["Modul-Kurzkennzeichen", code]);
          pdfBody.push(["Modulbezeichnung", res[0].label.value]);
          pdfBody.push([
            "Aufteilung in Lehrveranstaltungen",
            res[0].learnTypes.value
          ]);
          pdfBody.push(["Dauer des Moduls", res[0].duration.value]);
          pdfBody.push([
            "Zuordnung zum Curriculum",
            res[0].curr_des.value + ", " + res[0].modType_name.value
          ]);
          pdfBody.push(["Verwendbarkeit des Moduls", res[0].eduUse.value]);
          pdfBody.push([
            "Häufigkeit des Angebots von Modulen",
            res[0].courseMode.value
          ]);
          pdfBody.push(["Modulverantwortlicher", res[0].accPersonLabel.value]);
          pdfBody.push(["Dozent/in", res[0].instructorLabel.value]);
          pdfBody.push(["Lehrsprache", res[0].languages.value]);
          pdfBody.push([
            "Voraussetzungen",
            res[0].pre
              .value
          ]);/*+ "basiert auf folgende Module: " + res[0].basedOns.value*/
          pdfBody.push(["ECTS-Credits", res[0].ects.value]);
          pdfBody.push([
            "Gesamtworkload und ihre Zusammensetzung",
            "Gesamt: " +
              res[0].workloadSum.value +
              " Stunden, davon: " +
              "\n" +
              res[0].workloadDetails.value
          ]);
          pdfBody.push(["Lehrform/SWS", res[0].swsSum.value]);
          pdfBody.push(["Studien-/Prüfungsleistungen", res[0].exams.value]);
          pdfBody.push([
            "Gewichtung der Note in der Gesamtnote",
            res[0].grade_name.value
          ]);
          pdfBody.push(["Lernergebnisse", res[0].learnResults.value]);
          pdfBody.push(["Inhalte", res[0].contents.value]);
          pdfBody.push(["Lehr- und Lernmethoden", res[0].interTypes.value]);
          pdfBody.push(["Literatur", res[0].citations.value]);
          pdfBody.push(["Besonderes", res[0].comment.value]);
          pdfBody.push(["URL", res[0].url.value]);

          const doc = new jsPDF();

          //this.pdfBody.push(["URL", pdf.textWithLink(res[0].url.value, {url: 'https://www.google.com/'})]);

          doc.autoTable({
            styles: { overflow: "linebreak" },
            columnStyles: {
              0: { cellWidth: 50 },
              1: { cellWidth: 130 }
            },
            head: pdfHead,
            body: pdfBody,
            didDrawCell: data => {
              if (
                data.section === "body" &&
                data.column.index === 1 &&
                data.row.index === 20
              ) {
                doc.link(
                  data.cell.x + 2,
                  data.cell.y + 2,
                  data.cell.width - 3,
                  data.cell.height - 4,
                  { url: res[0].url.value }
                );
              }
            }
          });
          doc.save(code + ".pdf");
        })
        .catch(e => {
          this.errors.push(e);
        });
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
</style>
