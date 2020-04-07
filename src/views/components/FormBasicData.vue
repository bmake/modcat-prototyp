<template>
  <div>
    <div style="text-align:left; font-size:26px;">
      <b>Rahmendaten zum Modul</b>
    </div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-33">
        <md-field>
          <label>Modulkürzel</label>
          <md-input
            v-if="modBasis.length > 0"
            v-model="modBasis[0].code.value"
            name="modKuerzel"
            id="modKuerzel"
            md-dense
            disabled
          />
          <md-input v-else disabled />
        </md-field>
      </div>

      <div class="md-layout-item md-size-100">
        <md-field>
          <label>Modulbezeichnung</label>
          <md-input
            v-if="modBasis.length > 0"
            v-model="modBasis[0].label.value"
            @change="addChanged('label')"
          />
          <md-input v-else disabled />
        </md-field>
      </div>

      <div class="md-layout-item md-size-25">
        <md-field class="xs">
          <label>Modultyp</label>
          <md-select
            v-if="modBasis.length > 0"
            v-model="modBasis[0].modType_name.value"
            @md-selected="countModType++"
            name="modulType"
            id="modulType"
            md-dense
          >
            <md-option value="Pflichtmodul">Pflichtmodul</md-option>
            <md-option value="Wahlpflichtmodul">Wahlpflichtmodul</md-option>
          </md-select>
          <md-select v-else md-dense disabled />
        </md-field>
      </div>
      <div class="md-layout-item md-size-25">
        <md-field>
          <label>Semesterdauer</label>
          <md-input
            v-if="modBasis.length > 0"
            v-model="modBasis[0].duration.value"
            @change="addChanged('duration')"
          />
          <md-input v-else disabled />
        </md-field>
      </div>
      <div class="md-layout-item md-size-25">
        <md-field>
          <label>SWS</label>
          <md-input
            v-if="modBasis.length > 0"
            v-model="modBasis[0].swsSum.value"
            @change="addChanged('swsSum')"
          />
          <md-input v-else disabled />
        </md-field>
      </div>
      <div class="md-layout-item md-size-25">
        <md-field>
          <label>ECTS</label>
          <md-input
            v-if="modBasis.length > 0"
            v-model="modBasis[0].ects.value"
            @change="addChanged('ects')"
          />
          <md-input v-else disabled />
        </md-field>
      </div>
      <div class="md-layout-item md-size-50">
        <md-field>
          <label>Lehrveranstaltungen</label>
          <md-input
            v-if="modBasis.length > 0"
            v-model="modBasis[0].learnTypes.value"
            @change="addChanged('learnTypes')"
          />
          <md-input v-else disabled />
        </md-field>
      </div>
      <div
        class="md-layout-item md-size-50"
        style="text-align:left;"
        v-if="modBasis.length > 0"
      >
        <span style="font-size:14px; color:#2e2e2e; font-family:arial;"
          >Lehrsprachen:
        </span>
        <md-checkbox
          v-model="modBasis[0].languages.value"
          value="de"
          style="margin-left:10px;"
          @change="addChanged('languages')"
          >Deutsch</md-checkbox
        >
        <md-checkbox
          v-if="modBasis.length > 0"
          v-model="modBasis[0].languages.value"
          value="en"
          @change="addChanged('languages')"
          >Englisch</md-checkbox
        >
      </div>

      <div class="md-layout-item md-size-70">
        <md-field>
          <label>Notengewichtung</label>
          <md-input
            v-if="modBasis.length > 0"
            v-model="modBasis[0].grade_name.value"
            @change="addChanged('grade_name')"
          />
          <md-input v-else disabled />
        </md-field>
      </div>

      <div class="md-layout-item md-size-30">
        <md-field class="xs">
          <label>Häufigkeit</label>
          <md-select
            v-if="modBasis.length > 0"
            v-model="modBasis[0].courseMode.value"
            @md-selected="countCourseMode++"
            name="frequency"
            id="frequency"
            md-dense
          >
            <md-option value="jedes Wintersemester"
              >jedes Wintersemester</md-option
            >
            <md-option value="jedes Sommersemester"
              >jedes Sommersemester</md-option
            >
            <md-option value="jedes Winter/Sommersemester"
              >jedes Winter/Sommersemester</md-option
            >
          </md-select>
          <md-select v-else md-dense disabled />
        </md-field>
      </div>

      <div class="md-layout-item md-size-100">
        <md-field>
          <label>Verwendbarkeit</label>
          <md-textarea
            v-if="modBasis.length > 0"
            v-model="modBasis[0].eduUse.value"
            @change="addChanged('eduUse')"
            md-autogrow
          />
          <md-input v-else disabled />
        </md-field>
      </div>

      <div class="md-layout-item md-size-100">
        <md-field>
          <label>Voraussetzungen</label>
          <md-textarea
            v-if="modBasis.length > 0"
            v-model="modBasis[0].pre.value"
            @change="addChanged('pre')"
            md-autogrow
          />
          <md-input v-else disabled />
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-field>
          <label>Website</label>
          <md-textarea
            v-if="modBasis.length > 0"
            v-model="modBasis[0].url.value"
            @change="addChanged('url')"
            md-autogrow
          />
          <md-input v-else disabled />
        </md-field>
      </div>

      <div class="md-layout-item md-size-100">
        <md-field>
          <label>Beschreibung und Kommentare zum Modul</label>
          <md-textarea
            v-if="modBasis.length > 0"
            v-model="modBasis[0].comment.value"
            @change="addChanged('comment')"
            md-autogrow
          />
          <md-input v-else disabled />
        </md-field>
      </div>

      <div class="md-layout-item" ref="notification">
        <md-button v-if="modBasis.length > 0" @click="updateData"
          >Änderung speichern</md-button
        >
        <md-button v-if="modBasis.length > 0" @click="resetData"
          >Änderung verwerfen</md-button
        >
        <!--<md-button v-if="modBasis.length > 0" @click="generatePDF"
          >Download</md-button
        >-->
        <transition name="fade">
          <div class="alert alert-success" v-if="notification">
            <div class="alert-icon">
              <md-icon>check</md-icon>
            </div>
            Änderungen gespeichert!
          </div>
        </transition>
        <!--<p>{{ updateQuery }}</p>
        <p>changed Array: {{ changedArray }}</p>
        <p>deleteArray: {{ this.delete }}</p>
        <p>insertArray: {{ this.insert }}</p>
        <p>where: {{ this.where }}</p>-->
        <!--<p>modBasis: {{ modBasis[0] }}</p>
        <p>original: {{ modBasisOrigin[0] }}</p>-->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import lodash from 'lodash';

export default {
  props: ["modBasisOrigin", "moduleUri"],
  name: "basisData",
  data() {
    return {
      countModType: 0,
      countCourseMode: 0,
      changedArray: [],
      updateQuery: "",
      modBasis: [],
      notification: false,
      prefixes:
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/>  ",
      template: [],
      delete: [],
      insert: [],
      where:
        "schema:courseCode ?code ; " +
        "    rdfs:label ?label; " +
        "    module:eduAlignm_Curr ?curr ; " +
        "    module:eduAlignm_Grade ?grade ; " +
        "    module:eduAlignm_ModuleType ?modType ; " +
        "    schema:educationalCredentialAwarded ?ects ; " +
        "    schema:hasCourseInstance ?semester ; " +
        "    schema:educationalUse ?eduUse ; " +
        "    module:eduAlignm_SWS ?sws ; " +
        "    schema:accountablePerson ?accPerson ; " +
        "    schema:coursePrerequisites ?pre ; " +
        "    schema:learningResourceType ?learnTypes ; " +
        "    schema:inLanguage ?languages ; " +
        "    schema:url ?url ; " +
        "    schema:comment ?comment . " +
        "  ?semester schema:duration ?duration; " +
        "            schema:courseMode ?courseMode ; " +
        "            schema:instructor ?instrctor. " +
        "  ?curr schema:targetName ?curr_name ; " +
        "        schema:targetDescription ?curr_des . " +
        "  ?grade schema:targetName ?grade_name ; " +
        "         schema:targetDescription ?grade_des . " +
        "  ?modType schema:targetName ?modType_name ; " +
        "           schema:targetDescription ?modType_des ; " +
        "           schema:educationalFramework ?spo . " +
        "  ?sws schema:targetName ?swsSum . "
    };
  },
  methods: {
    addChanged(item) {
      if (item == "learnTypes") {
        let learnTypes = this.modBasis[0].learnTypes.value;
        this.modBasis[0].learnTypes.value = learnTypes.split(",");
      }
      if (this.changedArray.indexOf(item) === -1) {
        this.changedArray.push(item);
      } else {
        let i = this.changedArray.indexOf(item);
        let arr = this.insert[i];
        arr.splice(3, 1, this.modBasis[0][item].value);
        console.log("arr", arr);
        this.insert.splice(i, 1, arr);
      }
    },
    generateTriples(i) {
      let delArray = [];
      let insArray = [];
      if (i == "modType_name") {
        delArray.push(
          this.template.modType_name.s,
          this.template.modType_name.p[0],
          this.template.modType_name.o[0],
          "; "
        );
        delArray.push(
          this.template.modType_name.p[1],
          this.template.modType_name.o[1],
          ". "
        );
        insArray.push(
          this.template.modType_name.s,
          this.template.modType_name.p[0],
          '"',
          this.template.modType_name[this.modBasis[0].modType_name.value][0],
          '"; '
        );
        insArray.push(
          this.template.modType_name.p[1],
          '"',
          this.template.modType_name[this.modBasis[0].modType_name.value][1],
          '". '
        );
      } else {
        console.log("i", i);
        delArray.push(
          this.template[i].s,
          this.template[i].p,
          this.template[i].o,
          ". "
        );
        insArray.push(
          this.template[i].s,
          this.template[i].p,
          '"',
          this.modBasis[0][i].value,
          '". '
        );
      }
      this.delete.push(delArray);
      this.insert.push(insArray);
    },
    updateData() {
      if (this.changedArray.includes("duration")) {
        console.log("include duration");
        let i = this.changedArray.indexOf("duration");
        console.log(this.insert[i][3]);
        let d = this.insert[i][3];
        d = d.replace("1 Semester", "P0.5Y").replace("2 Semester", "P1Y");
        this.insert[i][3] = d;
        console.log(this.insert[i][3]);
      }
      let query = this.prefixes;
      query += " DELETE { ";
      this.delete.forEach(function(itemArr) {
        for (let a = 0; a < itemArr.length; a++) {
          query += itemArr[a];
        }
      });
      query += " } INSERT { ";
      this.insert.forEach(function(itemArr) {
        if (Array.isArray(itemArr[3])) {
          let str = itemArr[3].join('", "');
          itemArr[3] = str;
        }
        for (let a = 0; a < itemArr.length; a++) {
          query += itemArr[a];
        }
      });
      query += "} WHERE { <" + this.moduleUri + "> " + this.where + " }";
      this.updateQuery = query;

      axios
        .post("http://fbw-sgmwi.th-brandenburg.de:3030/modcat/update", query, {
          headers: { "Content-Type": "application/sparql-update" }
        })
        .then(response => {
          let status = response.status;
          if (status == 204) {
            this.notification = true;
            setTimeout(() => { this.notification = false }, 2000);
          }
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    resetData() {
      this.initialState();
    },
    initialState() {
      this.countModType = 0;
      this.countCourseMode = 0;
      this.changedArray = [];
      this.delete = [],
      this.insert = [],
      this.template = {
                label: {
                  s: " <" + this.moduleUri + "> ",
                  p: " rdfs:label ",
                  o: " ?label "
                },
                modType_name: {
                  s: " ?modType ",
                  p: [" schema:targetName ", " schema:targetDescription "],
                  o: [" ?modType_name ", " ?modType_des "],
                  Pflichtmodul: [
                    "Pflichtmodul",
                    "muss von allen Studierenden belegt und absolviert werden"
                  ],
                  Wahlpflichtmodul: [
                    "Wahlpflichtmodul",
                    "kann aus einer Reihe von Modulen ausgewählt werden, wird angeboten, wenn sich genügend Interessenten finden"
                  ]
                },
                grade_name: {
                  s: " ?grade ",
                  p: " schema:targetName ",
                  o: " ?grade_name "
                },
                learnTypes: {
                  s: " <" + this.moduleUri + "> ",
                  p: " schema:learningResourceType ",
                  o: " ?learnTypes "
                },
                eduUse: {
                  s: " <" + this.moduleUri + "> ",
                  p: " schema:educationalUse ",
                  o: " ?eduUse "
                },
                swsSum: {
                  s: " ?sws ",
                  p: " schema:targetName ",
                  o: " ?swsSum "
                },
                ects: {
                  s: " <" + this.moduleUri + "> ",
                  p: " schema:educationalCredentialAwarded ",
                  o: " ?ects "
                },
                duration: {
                  s: " ?semester ",
                  p: " schema:duration ",
                  o: " ?duration "
                },
                courseMode: {
                  s: " ?semester ",
                  p: " schema:courseMode ",
                  o: " ?courseMode "
                },
                pre: {
                  s: " <" + this.moduleUri + "> ",
                  p: " schema:coursePrerequisites ",
                  o: " ?pre "
                },
                url: {
                  s: " <" + this.moduleUri + "> ",
                  p: " schema:url ",
                  o: " ?url "
                },
                comment: {
                  s: " <" + this.moduleUri + "> ",
                  p: " schema:comment ",
                  o: " ?comment "
                },
                languages: {
                  s: " <" + this.moduleUri + "> ",
                  p: " schema:inLanguage ",
                  o: " ?languages "
                }
              };
      this.modBasis = _.cloneDeep(this.modBasisOrigin);
    },
    generatePDF() {
      const doc = new jsPDF();
      let pdfHead = [];
      let pdfBody = [];
      let q =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/>  " +
        "PREFIX schema: <https://schema.org/>  " +
        "SELECT DISTINCT ?code ?label ?semester ?modType_name ?grade_name ?learnTypes ?eduUse ?swsSum ?ects ?duration ?courseMode ?pre ?url ?comment ?languages" +
        " WHERE {  " +
        "<" +
        this.moduleUri +
        ">  schema:courseCode ?code ;  " +
        "         rdfs:label ?label;  " +
        "         module:eduAlignm_Curr ?curr ;   " +
        "         module:eduAlignm_Grade ?grade ;  " +
        "         module:eduAlignm_ModuleType ?modType ;   " +
        "         schema:educationalCredentialAwarded ?ects ;  " +
        "         schema:hasCourseInstance ?semester ;  " +
        "         schema:educationalUse ?eduUse ;  " +
        "         module:eduAlignm_SWS ?sws ; " +
        "         schema:accountablePerson ?accPerson ;  " +
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
        "            ?modType schema:targetName ?modType_name ." +
        "            ?sws schema:targetName ?swsSum . " +
        "            OPTIONAL {  " +
        '              SELECT (GROUP_CONCAT(?language; separator=", ") as ?languages)  ' +
        "              WHERE {  " +
        "                  <" +
        this.moduleUri +
        "> schema:inLanguage ?lan .  " +
        '          BIND(REPLACE(?lan, "de", "Deutsch", "i") AS ?lan1)  ' +
        '          BIND(REPLACE(?lan1, "en", "Englisch", "i") AS ?language)  ' +
        "              }  " +
        "            }  " +
        "            OPTIONAL {  " +
        '           SELECT (GROUP_CONCAT(?learnType; separator=", ") as ?learnTypes)  ' +
        "              WHERE {  " +
        "                <" +
        this.moduleUri +
        "> schema:learningResourceType ?learnType.  " +
        "              }  " +
        "            }  " +
        " }";

      axios
        .post("http://fbw-sgmwi.th-brandenburg.de:3030/modcat/query", q, {
          headers: { "Content-Type": "application/sparql-query" }
        })
        .then(response => {
          let res = response.data.results.bindings;
          pdfHead.push(["Modul-Kurzkennzeichen", res[0].code.value]);
          pdfBody.push(["Modulbezeichnung", res[0].label.value]);
          pdfBody.push([
            "Aufteilung in Lehrveranstaltungen",
            res[0].learnTypes.value
          ]);
          pdfBody.push(["Dauer des Moduls", res[0].duration.value]);
          pdfBody.push(["Modultyp", res[0].modType_name.value]);
          pdfBody.push(["Verwendbarkeit des Moduls", res[0].eduUse.value]);
          pdfBody.push([
            "Häufigkeit des Angebots von Modulen",
            res[0].courseMode.value
          ]);
          pdfBody.push(["Lehrsprache", res[0].languages.value]);
          pdfBody.push(["Voraussetzungen", res[0].pre.value]);
          pdfBody.push(["ECTS-Credits", res[0].ects.value]);
          pdfBody.push(["SWS", res[0].swsSum.value]);
          pdfBody.push([
            "Gewichtung der Note in der Gesamtnote",
            res[0].grade_name.value
          ]);
          pdfBody.push(["Kommentare", res[0].comment.value]);
          pdfBody.push(["URL", res[0].url.value]);

          doc.autoTable({
            styles: { overflow: "linebreak" },
            columnStyles: {
              0: { cellWidth: 50 },
              1: { cellWidth: 130 }
            },
            head: pdfHead,
            body: pdfBody
          });
          doc.save("Rahmendaten.pdf");
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
  },
  watch: {
    modBasisOrigin(v) {
      this.initialState();
    },
    countModType(v) {
      if (v == 2) {
        this.changedArray.push("modType_name");
      } else if (v > 2) {
        let i = this.changedArray.indexOf("modType_name");
        let arr = this.insert[i];
        let v = this.modBasis[0].modType_name.value;
        arr.splice(3, 1, this.template.modType_name[v][0]);
        arr.splice(7, 1, this.template.modType_name[v][1]);
        console.log("arr", arr);
        this.insert.splice(i, 1, arr);
      }
    },
    countCourseMode(v) {
      if (v == 2) {
        this.changedArray.push("courseMode");
      } else if (v > 2) {
        let i = this.changedArray.indexOf("courseMode");
        let arr = this.insert[i];
        arr.splice(3, 1, this.modBasis[0].courseMode.value);
        console.log("arr", arr);
        this.insert.splice(i, 1, arr);
      }
    },
    changedArray(v) {
      if (v.length > 0) {
        let item = v[v.length - 1];
        this.generateTriples(item);
      }
    }
  }
};
</script>

<style>
button.md-button {
  margin-right: 10px;
  margin-top: 10px;
}
.alert.alert-success {
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #8bc34a !important;
  transition: opacity .5s;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
