<template>
  <div v-if="role == 1 || role == 2">
    <div style="text-align:left; font-size:26px;">
      <b>Didaktischer Ansatz</b>
    </div>
    <div class="md-layout md-gutter">
      <!--<div class="md-layout-item md-size-20">
        <md-field>
          <label>Modulkürzel</label>
          <md-input
            v-if="modMethod.length > 0"
            v-model="modMethod[0].code.value"
            name="modKuerzel"
            id="modKuerzel"
            md-dense
            disabled
          >
          </md-input>
          <md-input v-else disabled />
        </md-field>
      </div>-->
      <div class="md-layout-item md-size-80">
        <md-field>
          <label>Modulbezeichnung</label>
          <md-input
            v-if="modMethod.length > 0"
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
    >
      <div
        class="md-layout-item md-size-100"
        v-for="(input, i) in inputs1"
        :key="i"
      >
        <md-field>
          <label>Lehr- und Lernmethode</label>
          <md-textarea
            v-if="modMethod.length > 0"
            v-model="input.name"
            @change="addChanged('inputs1', i)"
            :disabled="role != 1 && role != 2"
            md-autogrow
          />
          <md-input v-else disabled />
          <span v-if="role == 1 || role == 2">
            <i
              class="fas fa-minus-circle"
              @click="remove('1', i)"
              v-show="i || (!i && inputs1.length > 1)"
            />
            <i
              class="fas fa-plus-circle"
              @click="add('1', i)"
              v-show="i == inputs1.length - 1"
            />
          </span>
        </md-field>
      </div>
    </div>

    <div
      class="md-layout md-gutter md-alignment-center-right"
      style="border-color:#fcdd86; border-width: 3px; border-style: solid; border-radius: 10px; margin:3px;"
    >
      <div class="md-layout-item md-size-30">
        <md-field>
          <label>Gesamtworkload</label>
          <md-input
            type="number"
            v-if="modMethod.length > 0"
            :disabled="role != 1 && role != 2"
            v-model="modMethod[0].workloadSum.value"
          />
          <md-input v-else disabled />
          <span v-if="modMethod.length > 0" class="md-suffix">Stunden</span>
        </md-field>
      </div>
      <div
        class="md-layout-item md-layout md-gutter md-size-70"
        v-for="(input, i) in inputs2"
        :key="i"
      >
        <div class="md-layout-item md-size-70">
          <md-field>
            <label>Workload-Komponente</label>
            <md-input
              v-if="modMethod.length > 0"
              v-model="input.name[0]"
              @change="addChanged('inputs2', i)"
              :disabled="role != 1 && role != 2"
            />
            <md-input v-else disabled />
          </md-field>
        </div>
        <div
          class="md-layout-item md-size-30"
          style="margin-right: 0; padding: 0"
        >
          <md-field>
            <label>in Stunden</label>
            <md-input
              type="number"
              v-if="modMethod.length > 0"
              v-model="input.name[1]"
              @change="addChanged('inputs2', i)"
              :disabled="role != 1 && role != 2"
            />
            <md-input v-else disabled />
            <span v-if="role == 1 || role == 2">
              <i
                class="fas fa-minus-circle"
                @click="remove('2', i)"
                v-show="i || (!i && inputs2.length > 1)"
              />
              <i
                class="fas fa-plus-circle"
                @click="add('2', i)"
                v-show="i == inputs2.length - 1"
              />
            </span>
          </md-field>
        </div>
      </div>
    </div>

    <div>
      <div class="md-layout md-gutter">
        <div class="md-layout-item">
          <div class="col-md-12">
            <md-button
              v-if="modMethod.length > 0"
              @click="updateData"
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
            <p>update: {{ updateQuery }}</p>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import jsPDF from "jspdf";
import lodash from "lodash";

export default {
  props: ["modMethodOrigin", "moduleUri", "role"],
  name: "method",
  data() {
    return {
      changedArray: [],
      updateQuery: "",
      notification: false,
      modMethod: [],
      prefixes:
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/>  ",
      delete: [],
      insert: [],
      countWorkload: 0,
      where:
        " schema:interactivityType ?interType ;  " +
        " module:addProp_CompWL ?addPropCompWL . ",
      inputs1: [
        {
          name: []
        }
      ],
      inputs2: [
        {
          name: []
        }
      ]
    };
  },
  methods: {
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
      if (this.changedArray.inputs1.length > 0) {
        let sub = " <" + this.moduleUri + "> ";
        this.delete.push(sub + " schema:interactivityType ?interType . ");
        let tripleIns = sub + ' schema:interactivityType "';
        for (let i = 0; i < this.inputs1.length; i++) {
          if (i == this.inputs1.length - 1) {
            tripleIns += this.inputs1[i].name + '" . ';
          } else {
            tripleIns += this.inputs1[i].name + '", "';
          }
        }
        this.insert.push(tripleIns);
      }

      if (this.changedArray.inputs2.length > 0) {
        let code = this.modMethod[0].code.value;
        if (this.inputs2.length <= this.countWorkload) {
          for (let i = 0; i < this.inputs2.length; i++) {
            if (
              this.inputs2[i].name[0] != null &&
              this.inputs2[i].name[1] != null &&
              this.inputs2[i].name[0] != "" &&
              this.inputs2[i].name[1] != ""
            ) {
              let sub = " module:WL" + (i + 1) + "_" + code;
              let triple =
                sub +
                " schema:name ?workloadName" +
                (i + 1) +
                " ; " +
                " schema:value ?workloadValue" +
                (i + 1) +
                " . ";
              let tripleIns =
                sub +
                ' schema:name "' +
                this.inputs2[i].name[0] +
                '" ; ' +
                " schema:value " +
                this.inputs2[i].name[1] +
                " . ";
              this.delete.push(triple);
              this.insert.push(tripleIns);
              this.where += triple;
            }
          }
          if (this.inputs2.length < this.countWorkload) {
            for (let i = this.inputs2.length; i < this.countWorkload; i++) {
              let sub = " module:WL" + (i + 1) + "_" + code;
              let triple =
                sub +
                " schema:name ?workloadName" +
                (i + 1) +
                " ; " +
                " schema:value ?workloadValue" +
                (i + 1) +
                " . " +
                " ?addPropCompWL schema:valueReference " +
                sub +
                " . ";
              this.delete.push(triple);
              this.where += triple;
            }
          }
        } else {
          for (let i = 0; i < this.countWorkload; i++) {
            if (
              this.inputs2[i].name[0] != null &&
              this.inputs2[i].name[1] != null &&
              this.inputs2[i].name[0] != "" &&
              this.inputs2[i].name[1] != ""
            ) {
              let sub = " module:WL" + (i + 1) + "_" + code;
              let triple =
                sub +
                " schema:name ?workloadName" +
                (i + 1) +
                " ; " +
                " schema:value ?workloadValue" +
                (i + 1) +
                " . ";
              let tripleIns =
                sub +
                ' schema:name "' +
                this.inputs2[i].name[0] +
                '" ; ' +
                " schema:value " +
                this.inputs2[i].name[1] +
                " . ";
              this.delete.push(triple);
              this.insert.push(tripleIns);
              this.where += triple;
            }
          }
          for (let i = this.countWorkload; i < this.inputs2.length; i++) {
            if (
              this.inputs2[i].name[0] != null &&
              this.inputs2[i].name[1] != null &&
              this.inputs2[i].name[0] != "" &&
              this.inputs2[i].name[1] != ""
            ) {
              let sub = " module:WL" + (i + 1) + "_" + code;
              let tripleIns =
                sub +
                " a   schema:PropertyValue ; " +
                ' schema:name "' +
                this.inputs2[i].name[0] +
                '" ; ' +
                "                schema:value " +
                this.inputs2[i].name[1] +
                " . " +
                " ?addPropCompWL schema:valueReference " +
                sub +
                " . ";
              this.insert.push(tripleIns);
            }
          }
        }
      }

      let query = this.prefixes;
      query += " DELETE { ";
      this.delete.forEach(function(item) {
        query += item;
      });
      query += " } INSERT { ";
      this.insert.forEach(function(item) {
        query += item;
      });
      query += " } WHERE { <" + this.moduleUri + "> " + this.where + " }";
      this.updateQuery = query;

      axios
        .post("http://fbw-sgmwi.th-brandenburg.de:3030/modcat/update", query, {
          headers: { "Content-Type": "application/sparql-update" }
        })
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
    clearCache() {
      this.countWorkload = this.inputs2.length
      this.changedArray = {
        inputs1: [],
        inputs2: []
      };
      this.delete = [];
      this.insert = [];
      this.where =
        " schema:interactivityType ?interType ;  " +
        " module:addProp_CompWL ?addPropCompWL . ";
    },
    resetData() {
      this.initialState();
    },
    initialState() {
      this.inputs1 = [
        {
          name: []
        }
      ];
      this.inputs2 = [
        {
          name: []
        }
      ];
      this.changedArray = {
        inputs1: [],
        inputs2: []
      };
      this.modMethod = [];
      this.delete = [];
      this.insert = [];
      this.where =
        " schema:interactivityType ?interType ;  " +
        " module:addProp_CompWL ?addPropCompWL . ";
      this.modMethod = _.cloneDeep(this.modMethodOrigin);
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
    modMethod(v) {
      if (v.length > 0) {
        let intertypes = v[0].interTypes.value;
        let workloaddetails = v[0].workloadDetails.value;
        this.countWorkload = workloaddetails.length;
        for (let i = 0; i < intertypes.length; i++) {
          this.inputs1[i] = { name: intertypes[i] };
        }
        for (let i = 0; i < workloaddetails.length; i++) {
          this.inputs2[i] = { name: workloaddetails[i] };
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
</style>
