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

      <div class="md-layout-item">
        <md-field>
          <label>SPO</label>
          <md-input
            v-if="modBasis.length > 0"
            v-model="modBasis[0].spo.value"
            disabled
          />
          <md-input v-else disabled />
        </md-field>
      </div>

      <div class="md-layout-item">
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
      <div class="md-layout-item">
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
      <div class="md-layout-item">
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
      <div class="md-layout-item">
        <md-field>
          <label>Verwendbarkeit</label>
          <md-input
            v-if="modBasis.length > 0"
            v-model="modBasis[0].eduUse.value"
            @change="addChanged('endUse')"
          />
          <md-input v-else disabled />
        </md-field>
      </div>
      <div class="md-layout-item">
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
      <div class="md-layout-item">
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
      <div class="md-layout-item">
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
      <div class="md-layout-item md-size-33">
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

      <div class="md-layout-item md-size-66">
        <md-field>
          <label>Voraussetzungen</label>
          <md-input
            v-if="modBasis.length > 0"
            v-model="modBasis[0].pre.value"
            @change="addChanged('pre')"
          />
          <md-input v-else disabled />
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-field>
          <label>Website</label>
          <md-input
            v-if="modBasis.length > 0"
            v-model="modBasis[0].url.value"
            @change="addChanged('url')"
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
          />
          <md-textarea v-else disabled />
        </md-field>
      </div>

      <div class="md-layout-item md-size-100" style="text-align:left;" v-if="modBasis.length > 0">
        <span style="font-size:14px; color:#2e2e2e; font-family:arial;"
          ><br />Lehrsprachen: <br
        /></span>
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

      <div class="md-layout md-gutter">
        <div class="md-layout-item">
          <div>
            <md-button v-if="modBasis.length > 0" type="primary">Speichern</md-button>
            <md-button v-if="modBasis.length > 0" type="primary">Download</md-button>
            <p>module uri: {{ moduleUri }}</p>
            <p>Message is: {{ changedArray }}</p>
            <p>delete: {{ this.delete }}</p>
            <p>insert: {{ this.insert }}</p>
           <!-- <p>where: {{ this.where }}</p>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["modBasis", "moduleUri"],
  name: "basisData",
  data() {
    return {
      countModType: 0,
      countCourseMode: 0,
      changedArray: [],
      updateQuery: "",
      prefixes: "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
              "PREFIX module: <https://bmake.th-brandenburg.de/module/>\n" +
              "PREFIX schema: <https://schema.org/>",
      template: {
        label: {
          s: " <" + this.moduleUri + "> ",
          p: " rdfs:label ",
          o: " ?label "
        },
        modType_name: {
          s: " ?modType ",
          p: "  ",
          o: ""
        },
        grade_name: "  ",
        /*learnTypes: ,
        eduUse: ,
        swsSum: ,
        ects: ,
        duration: ,
        courseMode: ,
        pre: ,
        url: ,
        comment: ,
        languages:*/
      },
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
        "    schema:learningResourceType ?learnType ; " +
        "    schema:inLanguage ?languages ; " +
        "    schema:url ?url ; " +
        "    schema:comment ?comment . " +
        "  ?semester schema:duration ?durationSem; " +
        "            schema:courseMode ?courseMode ; " +
        "            schema:instructor ?instrctor. " +
        "  ?curr schema:targetName ?curr_name ; " +
        "        schema:targetDescription ?curr_des . " +
        "  ?grade schema:targetName ?grade_name ; " +
        "         schema:targetDescription ?grade_des . " +
        "  ?modType schema:targetName ?modType_name ; " +
        "           schema:educationalFramework ?spo . " +
        "  ?sws schema:targetName ?swsSum . ",
    };
  },
  methods: {
    addChanged(item) {
      if(this.changedArray.indexOf(item) === -1) {
        this.changedArray.push(item);
        /*console.log(this.changedArray);*/
      }
    },
    generateTriples(i) {
      let sub = " <" + this.moduleUri + "> ";
      if (i == 'label') {
        this.delete = this.delete + sub + " rdfs:label ?label . ";
        this.insert =
          this.insert +
          sub +
          ' rdfs:label  "' +
          this.modBasis[0].label.value +
          '" . ';
      } else if (i == 'modType_name') {
        this.delete =
          this.delete +
          " ?modType schema:targetName ?modType_name ; schema:targetDescription ?modType_des . ";
        if (this.modBasis[0].modType_name.value == "Pflichtmodul") {
          this.insert =
            this.insert +
            " ?modType schema:targetName 'Pflichtmodul' ; schema:targetDescription 'muss von allen Studierenden belegt und absolviert werden' . ";
        } else {
          this.insert =
            this.insert +
            " ?modType schema:targetName 'Wahlpflichtmodul' ; schema:targetDescription 'kann aus einer Reihe von Modulen ausgewählt werden, wird angeboten, wenn sich genügend Interessenten finden' . ";
        }
      } else if (i == 'grade_name') {
        this.delete = this.delete + " ?grade schema:targetName ?grade_name . ";
        this.insert =
          this.insert +
          ' ?grade schema:targetName  "' +
          this.modBasis[0].grade_name.value +
          '" . ';
      } else if (i == 'learnTypes') {
        this.delete =
          this.delete + sub + " schema:learningResourceType ?learnTypes . ";
        this.modBasis[0].learnTypes.value = this.modBasis[0].learnTypes.value.split(",");
        let objstr = this.modBasis[0].learnTypes.value.join('","');
        let triple = sub + " schema:learningResourceType " + objstr;
        /*this.modBasis[0].learnTypes.value.forEach(function(item) {
          triple = triple + '"' + item + '",';
        });
        triple = triple.substring(0, triple.length - 1);*/
        this.insert = this.insert + triple + " . ";
      } else if (i == 'eduUse') {
        this.delete = this.delete + sub + " schema:educationalUse ?eduUse . ";
        this.insert =
          this.insert +
          sub +
          ' schema:educationalUse  "' +
          this.modBasis[0].eduUse.value +
          '" . ';
      } else if (i == 'swsSum') {
        this.delete = this.delete + " ?sws schema:targetName ?swsSum . ";
        this.insert =
          this.insert +
          ' ?sws schema:targetName  "' +
          this.modBasis[0].swsSum.value +
          '" . ';
      } else if (i == 'ects') {
        this.delete =
          this.delete + sub + " schema:educationalCredentialAwarded ?ects . ";
        this.insert =
          this.insert +
          sub +
          " schema:educationalCredentialAwarded " +
          this.modBasis[0].ects.value +
          " . ";
      } else if (i == 'duration') {
        let duration = this.modBasis[0].duration.value.replace(
          "1 Semester",
          "P0.5Y"
        );
        duration = duration.replace("2 Semester", "P1Y");
        this.delete =
          this.delete + " ?semester schema:duration ?durationSem . ";
        this.insert =
          this.insert + ' ?semester schema:duration  "' + duration + '" . ';
      } else if (i == 'courseMode') {
        this.delete =
          this.delete + " ?semester schema:courseMode ?courseMode . ";
        this.insert =
          this.insert +
          ' ?semester schema:courseMode  "' +
          this.modBasis[0].courseMode.value +
          '" . ';
      } else if (i == 'pre') {
        this.delete = this.delete + sub + " schema:coursePrerequisites ?pre . ";
        this.insert =
          this.insert +
          sub +
          ' schema:coursePrerequisites  "' +
          this.modBasis[0].pre.value +
          '" . ';
      } else if (i == 'url') {
        this.delete = this.delete + sub + " schema:url ?url . ";
        this.insert =
          this.insert + sub + ' schema:url  "' + this.modBasis[0].url.value + '" . ';
      } else if (i == 'comment') {
        this.delete = this.delete + sub + " schema:comment ?comment . ";
        this.insert =
          this.insert +
          sub +
          ' schema:comment  "' +
          this.modBasis[0].comment.value +
          '" . ';
      } else if (i == 'languages') {
        this.delete = this.delete + sub + " schema:inLanguage ?languages . ";
      }


      /*console.log(i + " changed");*/
    }
  },
  watch: {
    modBasis(v) {
      if (v.length > 0){
        this.countModType = 0;
        this.countCourseMode = 0;
        this.changedArray = [];
        /*this.where = sub + this.where;*/
      }
    },
    countModType(v) {
      if (v == 2) {
        this.changedArray.push('modType_name');
      }
    },
    countCourseMode(v) {
      if (v == 2) {
        this.changedArray.push('courseMode');
      }
    },
    changedArray(v) {
      if (v.length > 0) {
        let item = v[v.length-1];
        this.generateTriples(item);
      }
    }


  },

};
</script>
