<!-- <template>
  <span>{{ message }}</span>
</template>

<script>
  export default {
    data () {
      return {
        message: 'hello!'
      }
    },
    created () {
      this.message = 'bye!'
    }
  }
</script>
-->

<template>
  <div class="wrapper">
    <div class="header-filter" style="background-color: #cc0a2f;">
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
      <div class="section section-examples">
        <div class="container-fluid text-center">
          
          <div class="container">
        <div class="md-layout">
          <div
            class="md-layout-item md-size-33 md-small-size-66 md-xsmall-size-100 md-medium-size-40 mx-auto"
          >
            <login-card header-color="green">
              <h4 slot="title" class="card-title">Login</h4>
              <md-button
                slot="buttons"
                href="javascript:void(0)"
                class="md-just-icon md-simple md-white"
              >
                <i class="fab fa-facebook-square"></i>
              </md-button>
              <md-button
                slot="buttons"
                href="javascript:void(0)"
                class="md-just-icon md-simple md-white"
              >
                <i class="fab fa-twitter"></i>
              </md-button>
              <md-button
                slot="buttons"
                href="javascript:void(0)"
                class="md-just-icon md-simple md-white"
              >
                <i class="fab fa-google-plus-g"></i>
              </md-button>
              <p slot="description" class="description"><b>Melden Sie sich mit Ihren Hochschulzugangsdaten an, damit Sie die Services nutzen können.</b></p>
              <md-field class="md-form-group" slot="inputs">
                <md-icon>face</md-icon>
                <label>Name</label>
                <md-input v-model="firstname"></md-input>
              </md-field>
              <md-field class="md-form-group" slot="inputs">
                <md-icon>lock_outline</md-icon>
                <label>Passwort</label>
                <md-input v-model="password"></md-input>
              </md-field>
              <md-button slot="footer" class="md-simple md-success md-lg">
                Get Started
              </md-button>
            </login-card>
          </div>
        </div>
      </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

import {selectQueries} from "./queries";

export default {
  components: {

  },
  name: "index",
  bodyClass: "index-page",
  props: {},
  data() {

    return {

       modules: [{
                studiengang: '',
                art: '',
                modul: '',
                dozentinnen: '',
                aktion: ''
            }],
         lecturers: false,
         courses: false


    };
  },
  methods: {
    deleteRow(index, module) {
            var idx = this.modules.indexOf(module);
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
      let query = selectQueries.selectQueries("PDF", this.selectedModule, this.studyProgram)
      axios
        .post("http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query", query, {
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
            res[0].programName.value + ", " + res[0].modType_name.value
          ]);
          pdfBody.push([
            "Häufigkeit des Angebots von Modulen",
            res[0].courseMode.value
          ]);
          pdfBody.push(["Modulverantwortlicher", res[0].accPersonLabel.value]);
          pdfBody.push(["Dozent/in", res[0].instructorLabel.value]);
          pdfBody.push(["Lehrsprache", res[0].languages.value]);
          pdfBody.push([
            "Voraussetzungen",
            res[0].pre.value
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
          pdfBody.push(["Lernergebnisse", res[0].learnResults.value]);
          pdfBody.push(["Inhalte", res[0].contents.value]);
          pdfBody.push(["Lehr- und Lernmethoden", res[0].interTypes.value]);
          pdfBody.push(["Literatur", res[0].citations.value]);
          if(res[0].grade_name) {
            pdfBody.push([
              "Gewichtung der Note in der Gesamtnote",
              res[0].grade_name.value
            ]);
          }
          if(res[0].eduUse) {
            pdfBody.push(["Verwendbarkeit des Moduls", res[0].eduUse.value]);
          }
          if(res[0].comment) {
            pdfBody.push(["Besonderes", res[0].comment.value]);
          }
          if(res[0].url) {
            pdfBody.push(["URL", res[0].url.value]);
          }

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
<style lang="scss" scoped>
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
