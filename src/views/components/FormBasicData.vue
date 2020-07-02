<template>
  <form v-if="role == 1 || role == 2" @submit.prevent="validateInput">
    <div style="text-align:left; font-size:26px;">
      <b v-if="modBasisOrigin.length > 0"
        >Rahmendaten zum Modul {{ modBasis.code.value }}</b
      >
    </div>

    <form class="md-layout md-gutter" @submit.prevent="validateInput">
      <!--<div class="md-layout-item md-size-33">
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
      </div>-->

      <div class="md-layout-item md-size-70">
        <md-field :class="getValidationClass('label')">
          <label>Modulbezeichnung*</label>
          <md-input
            v-if="modBasisOrigin.length > 0"
            v-model.trim="modBasis.label.value"
            @change="addChanged('label')"
            :disabled="role != 2"
          />
          <!--remove v-if & v-else; change modBasis[0] to modBasis-->
          <md-input v-else disabled />
          <span class="md-error" v-if="!$v.modBasis.label.value.required"
            >Pflichtfeld</span
          >
        </md-field>
      </div>

      <div class="md-layout-item md-size-30">
        <md-field class="xs" :class="getValidationClass('accPerson')">
          <label>Modulverantwortliche/r*</label>
          <md-select
            v-if="modBasisOrigin.length > 0"
            v-model="modBasis.accPerson.value"
            @md-selected="countLecturer++"
            :disabled="role != 2"
            md-dense
          >
            <md-option
              v-if="lecturers.length > 0"
              v-for="(lecturer, index) in lecturers"
              v-bind:value="lecturer.lecturer.value"
              v-bind:key="index"
            >
              {{ lecturer.lecturerLabel.value }}
            </md-option>
          </md-select>
          <md-select v-else md-dense disabled />
          <span
            style="margin-bottom: 20px"
            class="md-error"
            v-if="!$v.modBasis.accPerson.value.required"
            >Pflichtfeld</span
          >
        </md-field>
      </div>

      <div class="md-layout-item md-size-25">
        <md-field class="xs" :class="getValidationClass('modType_name')">
          <label>Modultyp*</label>
          <md-select
            v-if="modBasisOrigin.length > 0"
            v-model="modBasis.modType_name.value"
            @md-selected="countModType++"
            name="modulType"
            id="modulType"
            :disabled="role != 2"
            md-dense
          >
            <md-option value="Pflichtmodul">Pflichtmodul</md-option>
            <md-option value="Wahlpflichtmodul">Wahlpflichtmodul</md-option>
          </md-select>
          <md-select v-else md-dense disabled />
          <span class="md-error" v-if="!$v.modBasis.modType_name.value.required"
            >Pflichtfeld</span
          >
        </md-field>
      </div>
      <div class="md-layout-item md-size-25">
        <md-field :class="getValidationClass('duration')">
          <label>Semesterdauer*</label>
          <div v-if="modBasisOrigin.length > 0">
            <md-input
              v-if="!newBoolean"
              v-model="modBasis.duration.value"
              @change="addChanged('duration')"
              :disabled="role != 2"
            />
            <md-select
              v-else
              v-model="modBasis.duration.value"
              @md-selected="addChanged('duration')"
              :disabled="role != 2"
              md-dense
            >
              <md-option value="P0.5Y">1 Semester</md-option>
              <md-option value="P1Y">2 Semester</md-option>
            </md-select>
          </div>
          <md-input v-else disabled />
          <span class="md-error" v-if="!$v.modBasis.duration.value.required"
            >Pflichtfeld</span
          >
        </md-field>
      </div>
      <div class="md-layout-item md-size-25">
        <md-field :class="getValidationClass('swsSum')">
          <label>SWS*</label>
          <md-input
            v-if="modBasisOrigin.length > 0"
            v-model="modBasis.swsSum.value"
            @change="addChanged('swsSum')"
            :disabled="role != 2"
            :type="newBoolean ? 'number' : 'text'"
          />
          <md-input v-else disabled />
          <span
            style="margin-bottom: 20px"
            class="md-error"
            v-if="!$v.modBasis.swsSum.value.required"
            >Pflichtfeld</span
          >
        </md-field>
      </div>
      <div class="md-layout-item md-size-25">
        <md-field :class="getValidationClass('ects')">
          <label>ECTS*</label>
          <md-input
            v-if="modBasisOrigin.length > 0"
            v-model="modBasis.ects.value"
            @change="addChanged('ects')"
            :disabled="role != 2"
            type="number"
          />
          <md-input v-else disabled />
          <span class="md-error" v-if="!$v.modBasis.ects.value.required"
            >Pflichtfeld</span
          >
        </md-field>
      </div>
      <div class="md-layout-item md-size-50">
        <md-field :class="getValidationClass('learnTypes')">
          <label>Lehrform* (mit , getrennt)</label>
          <md-input
            v-if="modBasisOrigin.length > 0"
            v-model="modBasis.learnTypes.value"
            @change="addChanged('learnTypes')"
            :disabled="role != 2"
          />
          <md-input v-else disabled />
          <span class="md-error" v-if="!$v.modBasis.learnTypes.value.required"
            >Pflichtfeld</span
          >
        </md-field>
      </div>
      <div class="md-layout-item md-size-50">
        <div
          style="text-align:left;"
          v-if="modBasisOrigin.length > 0"
          :class="getValidationClass('languages')"
        >
          <span style="font-size:14px; color:#2e2e2e; font-family:arial;"
            >Lehrsprachen*:
          </span>
          <md-checkbox
            v-model="modBasis.languages.value"
            value="de"
            style="margin-left:10px;"
            @change="addChanged('languages')"
            :disabled="role != 2"
            >Deutsch</md-checkbox
          >
          <md-checkbox
            v-if="modBasisOrigin.length > 0"
            v-model="modBasis.languages.value"
            value="en"
            @change="addChanged('languages')"
            :disabled="role != 2"
            >Englisch</md-checkbox
          >
          <span
            style="color: red; font-size: 12px"
            class="md-error"
            v-if="
              (countCheckboxValidation > 1 &&
                !$v.modBasis.languages.value.lanLength) ||
                !this.checkboxChanged
            "
            >Pflichtfeld</span
          ><!--$v.modBasis.languages.value.lanLength-->
        </div>
      </div>

      <div class="md-layout-item md-size-70">
        <md-field :class="getValidationClass('grade_name')">
          <label>Notengewichtung*</label>
          <md-input
            v-if="modBasisOrigin.length > 0"
            v-model="modBasis.grade_name.value"
            @change="addChanged('grade_name')"
            :disabled="role != 2"
          />
          <md-input v-else disabled />
          <span class="md-error" v-if="!$v.modBasis.grade_name.value.required"
            >Pflichtfeld</span
          >
        </md-field>
      </div>

      <div class="md-layout-item md-size-30">
        <md-field class="xs" :class="getValidationClass('courseMode')">
          <label>Häufigkeit*</label>
          <md-select
            v-if="modBasisOrigin.length > 0"
            v-model="modBasis.courseMode.value"
            @md-selected="countCourseMode++"
            :disabled="role != 2"
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
          <span class="md-error" v-if="!$v.modBasis.courseMode.value.required"
            >Pflichtfeld</span
          >
        </md-field>
      </div>

      <div class="md-layout-item md-size-100">
        <md-field>
          <label>Verwendbarkeit</label>
          <md-textarea
            v-if="modBasisOrigin.length > 0"
            v-model="modBasis.eduUse.value"
            @change="addChanged('eduUse')"
            :disabled="role != 2"
            md-autogrow
          />
          <md-input v-else disabled />
        </md-field>
      </div>

      <div class="md-layout-item md-size-100">
        <md-field>
          <label>Voraussetzungen</label>
          <md-textarea
            v-if="modBasisOrigin.length > 0"
            v-model="modBasis.pre.value"
            @change="addChanged('pre')"
            :disabled="role != 2"
            md-autogrow
          />
          <md-input v-else disabled />
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-field>
          <label>Website</label>
          <md-textarea
            v-if="modBasisOrigin.length > 0"
            v-model="modBasis.url.value"
            @change="addChanged('url')"
            :disabled="role != 2"
            md-autogrow
          />
          <md-input v-else disabled />
        </md-field>
      </div>

      <div class="md-layout-item md-size-100">
        <md-field>
          <label>Beschreibung und Kommentare zum Modul</label>
          <md-textarea
            v-if="modBasisOrigin.length > 0"
            v-model="modBasis.comment.value"
            @change="addChanged('comment')"
            :disabled="role != 2"
            md-autogrow
          />
          <md-input v-else disabled />
        </md-field>
      </div>

      <div class="md-layout-item" ref="notification">
        <md-button
          v-if="modBasisOrigin.length > 0"
          type="submit"
          :disabled="role != 2"
          >Änderung speichern</md-button
        >
        <!--@click="updateData"-->
        <md-button
          v-if="modBasisOrigin.length > 0"
          @click="resetData"
          :disabled="role != 2"
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
        <p>{{ updateQuery }}</p>
        <p>changed Array: {{ changedArray }}</p>
        <p>deleteArray: {{ this.delete }}</p>
        <p>insertArray: {{ this.insert }}</p>
        <p>where: {{ this.where }}</p>
        <p>modBasis: {{ modBasis }}</p>
        <p>update: {{ updateQuery }}</p>
      </div>
    </form>
  </form>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import lodash from "lodash";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  props: [
    "modBasisOrigin",
    "moduleUri",
    "role",
    "studyProgram",
    "newBoolean",
    "code"
  ],
  name: "basisData",
  mixins: [validationMixin],
  data() {
    return {
      countModType: 0,
      countCourseMode: 0,
      countLecturer: 0,
      countCheckboxValidation: 0,
      checkboxChanged: true,
      lecturers: [],
      modBasis: {
        label: null,
        accPerson: null,
        modType_name: null,
        grade_name: null,
        learnTypes: null,
        swsSum: null,
        ects: null,
        duration: null,
        courseMode: null,
        languages: []
      },
      changedArray: [],
      updateQuery: "",
      notification: false,
      prefixes:
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> ",
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
  mounted() {
    let query =
      "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
      "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
      "PREFIX thbfbwm: <https://www.th-brandenburg.de/mitarbeiterseiten/fbw/> " +
      "SELECT DISTINCT ?lecturer ?lecturerLabel " +
      "WHERE {?lecturer a module:Lecturer; rdfs:label ?lecturerLabel.}";
    axios
      .post("http://fbw-sgmwi.th-brandenburg.de:3030/modcat/query", query, {
        headers: { "Content-Type": "application/sparql-query" }
      })
      .then(response => {
        this.lecturers = response.data.results.bindings;
      })
      .catch(e => {
        this.errors.push(e);
      });
  },
  validations: {
    modBasis: {
      label: {
        value: {
          required
        }
      },
      accPerson: {
        value: {
          required
        }
      },
      modType_name: {
        value: {
          required
        }
      },
      grade_name: {
        value: {
          required
        }
      },
      learnTypes: {
        value: {
          required
        }
      },
      swsSum: {
        value: {
          required
        }
      },
      ects: {
        value: {
          required
        }
      },
      duration: {
        value: {
          required
        }
      },
      courseMode: {
        value: {
          required
        }
      },
      languages: {
        value: {
          lanLength(value) {
            this.countCheckboxValidation++;
            this.checkboxChanged = true;
            if (value.length > 0) {
              this.checkboxBoolean = true;
              return true;
            } else {
              this.checkboxBoolean = false;
              return false;
            }
          }
        }
      }
    }
  },
  methods: {
    validateInput() {
      this.$v.$touch();
      if (
        !this.changedArray.includes("languages") &&
        this.modBasis.languages.value.length == 0
      ) {
        this.checkboxChanged = false;
      } else {
        this.checkboxChanged = true;
      }
      if (!this.$v.$invalid) {
        console.log("validation success");
        console.log(this.moduleUri);
        this.updateData();
      }
    },
    getValidationClass(fieldName) {
      const field = this.$v.modBasis[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    addChanged(item) {
      if (item == "learnTypes") {
        let learnTypes = this.modBasis.learnTypes.value;
        this.modBasis.learnTypes.value = learnTypes.split(",");
      }
      if (this.changedArray.indexOf(item) === -1) {
        this.changedArray.push(item);
      } else {
        let i = this.changedArray.indexOf(item);
        if (!this.newBoolean) {
          let arr = this.insert[i];
          arr.splice(3, 1, this.modBasis[item].value);
          this.insert.splice(i, 1, arr);
        }
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
          this.template.modType_name[this.modBasis.modType_name.value][0],
          '"; '
        );
        insArray.push(
          this.template.modType_name.p[1],
          '"',
          this.template.modType_name[this.modBasis.modType_name.value][1],
          '". '
        );
      } else if (i == "accPerson") {
        delArray.push(
          this.template[i].s,
          this.template[i].p,
          this.template[i].o,
          ". "
        );
        insArray.push(
          this.template[i].s,
          this.template[i].p,
          " <",
          this.modBasis[i].value,
          ">. "
        );
      } else {
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
          this.modBasis[i].value,
          '". '
        );
      }

      this.delete.push(delArray);
      this.insert.push(insArray);
    },
    updateData() {
      let query = this.prefixes;
      if (!this.newBoolean) {
        if (this.changedArray.includes("duration")) {
          let i = this.changedArray.indexOf("duration");
          let d = this.insert[i][3];
          d = d.replace("1 Semester", "P0.5Y").replace("2 Semester", "P1Y");
          this.insert[i][3] = d;
        }
        if (this.delete.length > 0) {
          query += " DELETE { ";
          this.delete.forEach(function(itemArr) {
            for (let a = 0; a < itemArr.length; a++) {
              query += itemArr[a];
            }
          });
          query += " } ";
        }
        query += " INSERT { ";
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
      } else {
        let subject = " <" + this.moduleUri + "> ";
        query += " INSERT DATA { ";
        //label and courde code and name
        query +=
          subject +
          ' a module:Module; rdfs:label  "' +
          this.modBasis.label.value +
          '" ; schema:courseCode "' +
          this.code +
          '" ; ';
        query += ' schema:name "' + this.modBasis.label.value + '" ;';
        //accountable person
        query +=
          " schema:accountablePerson  <" +
          this.modBasis.accPerson.value +
          "> ; ";
        //module type
        let moduleType =
          "module:ModuleType_" + this.studyProgram + "_" + this.code;
        query += " module:eduAlignm_ModuleType  " + moduleType + " ; ";
        //course instance
        let today = new Date();
        let year = today
          .getFullYear()
          .toLocaleString()
          .substring(2, 4);
        let sem = this.modBasis.courseMode.value.substring(6, 8);
        let semYear = sem + year;
        let courseInstance = "module:" + semYear + "_" + this.code;
        query += " schema:hasCourseInstance  " + courseInstance + " ; ";
        //SWS
        let sws = "module:SWS_" + this.studyProgram + "_" + this.code;
        query += " module:eduAlignm_SWS  " + sws + " ; ";
        //ECTS
        query +=
          ' schema:educationalCredentialAwarded  "' +
          this.modBasis.ects.value +
          '"; ';
        //Lehrform
        let learnTypes = this.modBasis.learnTypes.value.join('" , "');
        query += ' schema:learningResourceType  "' + learnTypes + '"; ';
        //languages
        let lan = this.modBasis.languages.value.join('" , "');
        query += ' schema:inLanguage  "' + lan + '" ; ';
        //Notengewichtung
        let grade = "module:Grade_" + this.studyProgram + "_" + this.code;
        query += " module:eduAlignm_Grade  " + grade + " ; ";
        //Verwendbarkeit
        if (this.modBasis.eduUse.value != "") {
          query +=
            ' schema:educationalUse  "' + this.modBasis.eduUse.value + '" ; ';
        }
        //Voraussetzung
        if (this.modBasis.pre.value != "") {
          query +=
            ' schema:coursePrerequisites  "' + this.modBasis.pre.value + '" ; ';
        }
        //Website
        if (this.modBasis.url.value != "") {
          query += ' schema:url  "' + this.modBasis.url.value + '" ; ';
        }
        //comment
        if (this.modBasis.comment.value != "") {
          query += ' schema:comment  "' + this.modBasis.comment.value + '" ; ';
        }
        query +=
          ' schema:timeRequired  "PT' + this.modBasis.ects.value * 30 + 'H" ; ';
        query += " schema:isPartOf  module:" + this.studyProgram + " . ";

        //module Type
        query +=
          moduleType +
          ' a  schema:AlignmentObject ; schema:alignmentType "Modultyp" ; schema:targetName  "' +
          this.template.modType_name[this.modBasis.modType_name.value][0] +
          '" ; schema:targetDescription  "' +
          this.template.modType_name[this.modBasis.modType_name.value][1] +
          '" . '; //!!!!!!!!!!!!!!!!!!!!!!!!!!!----------------------------------SPO

        //course instance
        query +=
          courseInstance +
          ' a  schema:CourseInstance ; schema:courseMode  "' +
          this.modBasis.courseMode.value +
          '" ; ' +
          ' schema:duration  "' +
          this.modBasis.duration.value +
          '" ; schema:instructor  <' +
          this.modBasis.accPerson.value +
          "> . "; //!!!!!!!!!!!!!!!!!!!!!!!!!!!----------------------------------Dozenten

        //SWS
        query +=
          sws +
          ' a  schema:AlignmentObject ; schema:alignmentType "SWS" ; schema:targetDescription  "Umfang des Moduls in Semesterwochenstunden" ; ' +
          ' schema:targetName  "' +
          this.modBasis.swsSum.value +
          ' SWS" . '; //!!!!!!!!!!!!!!!!!!!!!!!!!!!----------------------------------SPO

        //Notengewichtung
        query +=
          grade +
          ' a  schema:AlignmentObject ; schema:alignmentType  "Gewichtung der Note" ;  ' +
          ' schema:targetName  "' +
          this.modBasis.grade_name.value +
          '" . '; //!!!!!!!!!!!!!!!!!!!!!!!!!!!----------------------------------SPO, Beschreibung

        query += ' }';
      }

      this.updateQuery = query;

      /*axios
        .post("http://fbw-sgmwi.th-brandenburg.de:3030/modcat/update", query, {
          headers: { "Content-Type": "application/sparql-update" }
        })
        .then(response => {
          let status = response.status;
          if (status == 204) {
            this.notification = true;
            setTimeout(() => {
              this.notification = false;
            }, 1500);
          }
          this.clearCache();
        })
        .catch(e => {
          this.errors.push(e);
        });*/
    },
    clearCache() {
      this.countModType = 0;
      this.countCourseMode = 0;
      this.countLecturer = 0;
      this.countCheckboxValidation = 0;
      this.checkboxChanged = true;
      this.changedArray = [];
      this.delete = [];
      this.insert = [];
    },
    resetData() {
      this.initialState();
      this.$v.$reset();
    },
    initialState() {
      this.countModType = 0;
      this.countCourseMode = 0;
      this.countLecturer = 0;
      this.countCheckboxValidation = 0;
      this.checkboxChanged = true;
      this.changedArray = [];
      this.delete = [];
      this.insert = [];
      this.template = {
        label: {
          s: " <" + this.moduleUri + "> ",
          p: " rdfs:label ",
          o: " ?label "
        },
        accPerson: {
          s: " <" + this.moduleUri + "> ",
          p: " schema:accountablePerson ",
          o: " ?accPerson "
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
      if (!Object.keys(this.modBasisOrigin[0]).includes("pre")) {
        this.modBasis[0]["pre"] = { value: "" };
      }
      this.modBasis = this.modBasis[0];
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
    }
  },
  watch: {
    modBasisOrigin(v) {
      this.initialState();
      this.countLecturer = 0;
    },
    countModType(v) {
      if (v <= 2) {
        if (
          this.modBasis.modType_name.value !=
          this.modBasisOrigin[0].modType_name.value
        ) {
          if (this.changedArray.indexOf("modType_name") === -1) {
            this.changedArray.push("modType_name");
            if (this.countModType == 1) {
              this.countModType++;
            }
          }
        }
      } else if (v > 2) {
        let i = this.changedArray.indexOf("modType_name");
        if (!this.newBoolean) {
          let arr = this.insert[i];
          let v = this.modBasis.modType_name.value;
          arr.splice(3, 1, this.template.modType_name[v][0]);
          arr.splice(7, 1, this.template.modType_name[v][1]);
          this.insert.splice(i, 1, arr);
        }
      }
    },
    countCourseMode(v) {
      if (v <= 2) {
        if (
          this.modBasis.courseMode.value !=
          this.modBasisOrigin[0].courseMode.value
        ) {
          if (this.changedArray.indexOf("courseMode") === -1) {
            this.changedArray.push("courseMode");
            if (this.countCourseMode == 1) {
              this.countCourseMode++;
            }
          }
        }
      } else if (v > 2) {
        let i = this.changedArray.indexOf("courseMode");
        if (!this.newBoolean) {
          let arr = this.insert[i];
          arr.splice(3, 1, this.modBasis[0].courseMode.value);
          this.insert.splice(i, 1, arr);
        }
      }
    },
    countLecturer(v) {
      if (v <= 2) {
        if (
          this.modBasis.accPerson.value !=
          this.modBasisOrigin[0].accPerson.value
        ) {
          if (this.changedArray.indexOf("accPerson") === -1) {
            this.changedArray.push("accPerson");
            if (this.countLecturer == 1) {
              this.countLecturer++;
            }
          }
        }
      } else if (v > 2) {
        let i = this.changedArray.indexOf("accPerson");
        if (!this.newBoolean) {
          let arr = this.insert[i];
          arr.splice(3, 1, this.modBasis.accPerson.value);
          this.insert.splice(i, 1, arr);
        }
      }
    },
    changedArray(v) {
      if (v.length > 0 && !this.newBoolean) {
        let item = v[v.length - 1];
        this.generateTriples(item);
      }
    }
  }
};
</script>

<style scoped>
button.md-button {
  margin-right: 10px;
  margin-top: 10px;
}
.alert.alert-success {
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #8bc34a !important;
  transition: opacity 0.5s;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
span {
  top: 31px;
}
</style>
