<template>
  <div v-if="role == 1 || role == 2">
    <div style="text-align:left; font-size:26px;">
      <b>Lehr-/Lernformen und Aufteilung der Workload</b>
    </div>
    <form @submit.prevent="validateInput">
      <div>
        <div class="md-layout md-gutter">

          <div class="md-layout-item md-size-100">
            <div
              class="alert alert-danger md-layout-item md-size-100"
              style="margin-top: 30px"
              v-if="newBoolean && !existence"
            >
              Bitte vervollständigen Sie zuerst die Rahmendaten!
            </div>
          </div>

          <div class="md-layout-item md-size-80">
            <md-field>
              <label>Modulbezeichnung</label>
              <md-input
                v-if="modMethod.length > 0 && existence"
                v-model="modMethod[0].label.value"
                disabled
              />
              <md-input v-else disabled />
            </md-field>
          </div>
        </div>

        <div
          class="md-layout md-gutter"
          style="border-color:#fcdd86; border-width: 3px; border-style: solid; border-radius: 10px; margin:3px;"
          v-sortable="{ onEnd: reorder1, handle: '.handle' }"
        >
          <div
            class="md-layout-item md-size-100"
            style="margin-bottom: 10px"
            v-for="(input, i) in $v.inputs1.$each.$iter"
            :key="input.$model.id"
          >
            <md-field :class="getValidationClass('inputs1')">
              <label>Lehr- und Lernmethode*</label>
              <md-textarea
                v-if="modMethod.length > 0 && existence"
                v-model.trim="input.$model.name"
                @change="addChanged('inputs1', i)"
                :disabled="role != 1 && role != 2"
                md-autogrow
              />
              <md-input v-else disabled />
              <span v-if="role == 1 || role == 2">
                <i
                  class="fas fa-minus-circle"
                  @click="remove('1', i)"
                  v-show="inputs1.length > 1"
                />
                <i
                  class="fas fa-plus-circle"
                  @click="add('1', i)"
                  v-show="i == inputs1.length - 1"
                />
                <i
                  class="handle fas fa-arrows-alt"
                  style="margin-left: 10px"
                ></i>
              </span>
              <span class="md-error" v-if="!input.name.required"
                >Pflichtfeld</span
              >
            </md-field>
          </div>
        </div>

        <div
          class="md-layout md-gutter md-alignment-center-right"
          style="border-color:#fcdd86; border-width: 3px; border-style: solid; border-radius: 10px; margin:3px;"
          v-sortable="{ onEnd: reorder2, handle: '.handle' }"
        >
          <div class="md-layout-item md-size-30">
            <md-field>
              <label>Gesamtworkload</label>
              <md-input
                type="number"
                v-if="modMethod.length > 0"
                v-model="modMethod[0].workloadSum.value"
                disabled
              />
              <md-input v-else disabled />
              <span v-if="modMethod.length > 0" class="md-suffix">Stunden</span>
            </md-field>
          </div>
          <div
            class="md-layout-item md-layout md-gutter md-size-70"
            style="margin-bottom: 10px"
            v-for="(input, i) in $v.inputs2.$each.$iter"
            :key="input.$model.id"
          >
            <div class="md-layout-item md-size-70">
              <md-field :class="getValidationClass('inputs2')">
                <label>Workload-Komponente*</label>
                <md-input
                  v-if="modMethod.length > 0 && existence"
                  v-model.trim="input.$model.name[0]"
                  @change="addChanged('inputs2', i)"
                  :disabled="role != 1 && role != 2"
                />
                <md-input v-else disabled />
                <span class="md-error" v-if="!input.name.required"
                  >Bitte beide Felder vervollständigen</span
                >
              </md-field>
            </div>
            <div
              class="md-layout-item md-size-30"
              style="margin-right: 0; padding: 0"
            >
              <md-field :class="getValidationClass('inputs2')">
                <label>in Stunden*</label>
                <md-input
                  type="number"
                  v-if="modMethod.length > 0 && existence"
                  v-model="input.$model.name[1]"
                  @change="addChanged('inputs2', i)"
                  :disabled="role != 1 && role != 2"
                />
                <md-input v-else disabled />
                <span v-if="role == 1 || role == 2">
                  <i
                    class="fas fa-minus-circle"
                    @click="remove('2', i)"
                    v-show="inputs2.length > 1"
                  />
                  <i
                    class="fas fa-plus-circle"
                    @click="add('2', i)"
                    v-show="i == inputs2.length - 1"
                  />
                  <i
                    class="handle fas fa-arrows-alt"
                    style="margin-left: 10px"
                  ></i>
                </span>
              </md-field>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <div class="col-md-12">
              <md-button
                v-if="modMethod.length > 0"
                type="submit"
                :disabled="role != 1 && role != 2"
                >Änderung speichern</md-button
              >
              <md-button
                v-if="modMethod.length > 0"
                @click="resetData"
                :disabled="role != 1 && role != 2"
                >Änderung verwerfen</md-button
              >
              <!--<md-button v-if="modMethod.length > 0" @click="generatePDF"
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
              <!--<p>input1 is: {{ inputs1 }}</p>
              <p>input2 is: {{ inputs2 }}</p>
              <p>changedArray: {{ changedArray }}</p>
              <p>delete: {{ this.delete }}</p>
              <p>insert: {{ insert }}</p>
              <p>where: {{ where }}</p>
              <p>update: {{ updateQuery }}</p>
              <p>modOutcome: {{ modMethod[0] }}</p>-->
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import jsPDF from "jspdf";
import lodash from "lodash";
import { validationMixin } from "vuelidate";
import { alphaNum, required } from "vuelidate/lib/validators";
import Sortable from "sortablejs";

export default {
  props: [
    "modMethodOrigin",
    "moduleUri",
    "role",
    "newBoolean",
    "code",
    "basicFilled"
  ],
  name: "method",
  mixins: [validationMixin],
  directives: {
    sortable: {
      inserted: function(el, binding) {
        new Sortable(el, binding.value || {});
      }
    }
  },
  data() {
    return {
      changedArray: [],
      updateQuery: "",
      existence: true,
      notification: false,
      modMethod: [],
      prefixes:
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/>  ",
      delete: [],
      insert: [],
      where: [],
      countWorkload: 0,
      inputs1: [
        {
          id: 0,
          name: []
        }
      ],
      inputs2: [
        {
          id: 0,
          name: []
        }
      ]
    };
  },
  mounted() {
    this.initialState();
  },
  validations: {
    inputs1: {
      required,
      $each: {
        name: {
          required
        }
      }
    },
    inputs2: {
      required,
      $each: {
        name: {
          required(value) {
            if (
              value.length < 2 ||
              value[0] == "" ||
              value[0] == null ||
              value[1] == "" ||
              value[1] == null
            ) {
              return false;
            } else {
              return true;
            }
          }
        }
      }
    }
  },
  methods: {
    reorder1({ oldIndex, newIndex }) {
      const movedItem = this.inputs1.splice(oldIndex, 1)[0];
      this.inputs1.splice(newIndex, 0, movedItem);
      this.addChanged("inputs1", newIndex + 1);
      this.addChanged("inputs1", oldIndex + 1);
    },
    reorder2({ oldIndex, newIndex }) {
      const movedItem = this.inputs2.splice((oldIndex - 1), 1)[0];
      this.inputs2.splice((newIndex - 1), 0, movedItem);
      this.addChanged("inputs2", newIndex);
      this.addChanged("inputs2", oldIndex);
    },
    validateInput() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.updateData();
      }
    },
    getValidationClass(fieldName) {
      const field = this.$v[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    add(input, index) {
      this["inputs" + input].push({ name: [] });
    },
    remove(input, index) {
      this["inputs" + input].splice(index, 1);
      this.changedArray["inputs" + input].push(index);
      this.caculateSum();
    },
    addChanged(item, position) {
      if (this.changedArray[item].indexOf(position) === -1) {
        this.changedArray[item].push(position);
      }
      if (item == "inputs2") {
        this.caculateSum();
      }
    },
    caculateSum() {
      let sum = 0;
      for (let i = 0; i < this.inputs2.length; i++) {
        if (this.inputs2[i].name[1] != null) {
          sum = sum + parseInt(this.inputs2[i].name[1]);
        }
      }
      this.modMethod[0].workloadSum.value = sum;
    },
    updateData() {
      let query = this.prefixes;
      if (!this.newBoolean) {
        if (this.changedArray.inputs1.length > 0) {
          let teachingformsSub = " module:TeachingForms_" + this.code;
          let tripleDelWhe =
            teachingformsSub +
            " schema:itemListElement ?interType . ?interType ?pTeach ?oTeach . ";
          this.delete.push(tripleDelWhe);
          this.where.push(tripleDelWhe);
          let tripleIns = teachingformsSub + " schema:itemListElement ";
          let tripleInsDetail = "";
          for (let i = 0; i < this.inputs1.length; i++) {
            let sub = "module:TF" + (i + 1) + "_" + this.code;
            if (i == this.inputs1.length - 1) {
              tripleIns += sub + " . ";
            } else {
              tripleIns += sub + ", ";
            }
            tripleInsDetail +=
              sub +
              ' a schema:ListItem ; schema:name  "' +
              this.inputs1[i].name +
              '" ; schema:position ' +
              (i + 1) +
              " .  ";
          }
          this.insert.push(tripleIns);
          this.insert.push(tripleInsDetail);
        }

        if (this.changedArray.inputs2.length > 0) {
          let workloadsSub = " module:CompWL_" + this.code;
          let tripleDelWhe =
            workloadsSub +
            " schema:valueReference ?workloads . ?workloads ?pWork ?oWork . ";
          this.delete.push(tripleDelWhe);
          this.where.push(tripleDelWhe);
          let tripleIns = workloadsSub + " schema:valueReference ";
          let tripleInsDetail = "";
          for (let i = 0; i < this.inputs2.length; i++) {
            let sub = "module:WL" + (i + 1) + "_" + this.code;
            if (i == this.inputs2.length - 1) {
              tripleIns += sub + " . ";
            } else {
              tripleIns += sub + ", ";
            }
            tripleInsDetail +=
              sub +
              ' a schema:PropertyValue ; schema:name  "' +
              this.inputs2[i].name[0] +
              '" ; schema:value ' +
              this.inputs2[i].name[1] +
              " .  ";
          }
          this.insert.push(tripleIns);
          this.insert.push(tripleInsDetail);
        }

        query += " DELETE { ";
        this.delete.forEach(function(item) {
          query += item;
        });
        query += " } INSERT { ";
        this.insert.forEach(function(item) {
          query += item;
        });
        query += " } WHERE { ";
        this.where.forEach(function(item) {
          query += item;
        });
        query += " }";
      } else {
        let subject = " <" + this.moduleUri + "> ";
        let teachingformSub = "module:TeachingForms_" + this.code;
        let workloadsSub = "module:CompWL_" + this.code;

        query += " INSERT DATA { ";

        query +=
          subject +
          " module:addProp_TeachingForms " +
          teachingformSub +
          " ;  module:addProp_CompWL " +
          workloadsSub +
          " . ";

        //interactivity types
        let teachingformCourse =
          teachingformSub +
          ' a schema:ItemList ; schema:identifier "TeachingForms" ; schema:name "Lehr-Lernmethoden ' +
          this.code +
          '" ; schema:itemListElement ';
        let teachingformCourseDetail = "";
        for (let i = 0; i < this.inputs1.length; i++) {
          let sub = "module:TF" + (i + 1) + "_" + this.code;
          if (i == this.inputs1.length - 1) {
            teachingformCourse += sub + " . ";
          } else {
            teachingformCourse += sub + ", ";
          }
          teachingformCourseDetail +=
            sub +
            ' a schema:ListItem ; schema:name  "' +
            this.inputs1[i].name +
            '" ; schema:position ' +
            (i + 1) +
            " .  ";
        }
        query += teachingformCourse;
        query += teachingformCourseDetail;

        //workloads
        let workloadsCourse =
          workloadsSub +
          ' a schema:PropertyValue ; schema:identifier "Workload" ; schema:name "Aufteilung der Workload in Stunden ' +
          this.code +
          '" ; schema:valueReference ';
        let workloadsCourseDetail = "";
        for (let i = 0; i < this.inputs2.length; i++) {
          let sub = "module:WL" + (i + 1) + "_" + this.code;
          if (i == this.inputs2.length - 1) {
            workloadsCourse += sub + " . ";
          } else {
            workloadsCourse += sub + ", ";
          }
          workloadsCourseDetail +=
            sub +
            ' a schema:PropertyValue ; schema:name  "' +
            this.inputs2[i].name[0] +
            '" ; schema:value ' +
            this.inputs2[i].name[1] +
            " .  ";
        }
        query += workloadsCourse;
        query += workloadsCourseDetail;

        query += " } ";
      }

      this.updateQuery = query;

      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/update",
          query,
          {
            headers: { "Content-Type": "application/sparql-update" }
          }
        )
        .then(response => {
          let status = response.status;
          if (status == 204) {
            this.notification = true;
            setTimeout(() => {
              this.notification = false;
            }, 2000);
          }
          this.clearCache();
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    checkModule() {
      let query =
        " PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        " PREFIX schema: <https://schema.org/> " +
        " SELECT ?label " +
        " WHERE { <" +
        this.moduleUri +
        '> schema:name ?label . FILTER(lang(?label) = "de") } ';
      axios
        .post(
          "http://fbw-sgmwi.th-brandenburg.de:3030/RelaunchJuly20_ModCat/query",
          query,
          {
            headers: { "Content-Type": "application/sparql-query" }
          }
        )
        .then(response => {
          let res = response.data.results.bindings;
          if (res.length > 0) {
            this.existence = true;
            if (this.newBoolean) {
              this.modMethod[0].label = res[0].label;
            }
          } else {
            this.existence = false;
          }
          //this.$v.$reset();
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    clearCache() {
      this.countWorkload = this.inputs2.length;
      this.changedArray = {
        inputs1: [],
        inputs2: []
      };
      this.delete = [];
      this.insert = [];
      this.where = [];
    },
    resetData() {
      this.initialState();
    },
    initialState() {
      this.inputs1 = [
        {
          id: 0,
          name: []
        }
      ];
      this.inputs2 = [
        {
          id: 0,
          name: []
        }
      ];
      this.changedArray = {
        inputs1: [],
        inputs2: []
      };
      this.existence = true;
      this.modMethod = [];
      this.delete = [];
      this.insert = [];
      this.where = [];
      this.modMethod = _.cloneDeep(this.modMethodOrigin);
      if (this.newBoolean) {
        this.checkModule();
      }
      //this.$v.$reset();
    },
    generatePDF() {
      const doc = new jsPDF();
      let pdfHead = [];
      let pdfBody = [];
      let q =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT ?code ?workloadSum ?workloadDetails ?interTypes " +
        "WHERE { " +
        "   <" +
        this.moduleUri +
        "> schema:courseCode ?code . " +
        "            OPTIONAL { " +
        '    SELECT (SUM(?workloadValue) as ?workloadSum) (GROUP_CONCAT(?workloadDetail; separator="\\n") as ?workloadDetails) ' +
        "                WHERE { " +
        "                 <" +
        this.moduleUri +
        ">" +
        "  module:addProp_CompWL ?addPropCompWL . " +
        "                  ?addPropCompWL schema:valueReference ?workload . " +
        "                  ?workload schema:name ?workloadName ; " +
        "                            schema:value ?workloadValue . " +
        '                  BIND(CONCAT(?workloadName, ": ", STR(?workloadValue), " Stunden") as ?workloadDetail) ' +
        "                } " +
        "            } " +
        "            OPTIONAL { " +
        '    SELECT (GROUP_CONCAT(?interType; separator="\\n") as ?interTypes) ' +
        "                WHERE { " +
        "                  <" +
        this.moduleUri +
        "> schema:interactivityType ?interType . " +
        "                } " +
        "            } " +
        "}";

      axios
        .post("http://fbw-sgmwi.th-brandenburg.de:3030/modcat/query", q, {
          headers: { "Content-Type": "application/sparql-query" }
        })
        .then(response => {
          let res = response.data.results.bindings;
          pdfHead.push(["Modul-Kurzkennzeichen", res[0].code.value]);
          pdfBody.push(["Lehr- und Lernmethoden", res[0].interTypes.value]);
          pdfBody.push([
            "Gesamtworkload und ihre Zusammensetzung",
            "Gesamt: " +
              res[0].workloadSum.value +
              " Stunden, davon: " +
              "\n  " +
              res[0].workloadDetails.value
          ]);

          doc.autoTable({
            styles: { overflow: "linebreak" },
            columnStyles: {
              0: { cellWidth: 50 },
              1: { cellWidth: 130 }
            },
            head: pdfHead,
            body: pdfBody
          });
          doc.save("Didaktik.pdf");
        })
        .catch(e => {
          this.errors.push(e);
        });
    }
  },
  watch: {
    modMethodOrigin(v) {
      this.initialState();
    },
    basicFilled(v) {
      this.existence = true;
      this.checkModule();
    },
    modMethod(v) {
      if (!this.newBoolean && v.length > 0) {
        let intertypes = v[0].interTypes.value;
        let workloaddetails = v[0].workloadDetails.value;
        this.countWorkload = workloaddetails.length;
        for (let i = 0; i < intertypes.length; i++) {
          this.inputs1[i] = { id: i, name: intertypes[i] };
        }
        for (let i = 0; i < workloaddetails.length; i++) {
          this.inputs2[i] = { id: i, name: workloaddetails[i] };
        }
      }
    }
  }
};
</script>

<style scoped>
.md-suffix {
  font-size: 12px !important;
  font-family: "Dosis", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
}
input {
  width: 100%;
}
span {
  top: 32px;
  padding: 0;
}
</style>
