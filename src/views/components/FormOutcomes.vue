<template>
  <div v-if="role == 1 || role == 2">
    <div style="text-align:left; font-size:26px;">
      <b>Lernziele, Inhalte und Leistungen</b>
    </div>
    <form @submit.prevent="validateInput">
      <div>
        <div class="md-layout md-gutter">
          <!--<div class="md-layout-item md-size-20">
          <md-field>
            <label>Modulkürzel</label>
            <md-input
              v-if="modOutcome.length > 0"
              v-model="modOutcome[0].code.value"
              name="modKuerzel"
              id="modKuerzel"
              md-dense
              disabled
            >
            </md-input>
            <md-input v-else disabled />
          </md-field>
        </div>-->

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
                v-if="modOutcome.length > 0 && existence"
                v-model="modOutcome[0].label.value"
                disabled
              />
              <md-input v-else disabled />
            </md-field>
          </div>
        </div>

        <!--<div v-sortable>
          <li v-for="i in items" :key="i.id">{{ i.id }}</li>
        </div>-->

        <div
          class="md-layout md-gutter list"
          style="border-color:#fcdd86; border-width: 3px; border-style: solid; border-radius: 10px; margin: 3px;"
          v-sortable="{ onEnd: reorder1, handle: '.handle' }"
        >
          <div
            class="md-layout-item md-size-100 md-layout md-gutter md-alignment-bottom-center"
            v-if="!newBoolean"
            v-for="(input, i) in inputs1"
            :key="input.id"
          >
            <md-field class="md-layout-item md-size-55">
              <label>Lernergebnis</label>
              <md-textarea
                v-if="modOutcome.length > 0 && existence"
                v-model.trim="input.name[0]"
                @change="addChanged('inputs1', i + 1 + '0')"
                :disabled="role != 1 && role != 2"
                md-autogrow
              />
              <md-input v-else disabled />
            </md-field>
            <md-field class="md-layout-item md-size-20">
              <label>Kompetenzen</label>
              <md-select
                v-if="modOutcome.length > 0 && existence"
                v-model="input.name[1]"
                @md-selected="addChanged('inputs1', i + 1 + '1')"
                :disabled="role != 1 && role != 2"
                md-dense
              >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/SubjectMatterCompetence"
                  >Fachkompetenz</md-option
                >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/SocialCompetence"
                  >Sozialkompetenz</md-option
                >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/SelfCompetence"
                  >SelfCompetence</md-option
                >
              </md-select>
              <md-select v-else md-dense disabled />
            </md-field>
            <md-field class="md-layout-item md-size-25">
              <label>Bloomsche Taxonomie</label>
              <md-select
                v-if="modOutcome.length > 0 && existence"
                v-model="input.name[2]"
                @md-selected="addChanged('inputs1', i + 1 + '2')"
                :disabled="
                  (role != 1 && role != 2) ||
                    input.name[1] !=
                      'https://bmake.th-brandenburg.de/module/SubjectMatterCompetence'
                "
                md-dense
              >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/BloomTax_Remember"
                  >Erinnern</md-option
                >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/BloomTax_Understand"
                  >Verstehen</md-option
                >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/BloomTax_Apply"
                  >Anwenden</md-option
                >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/BloomTax_Analyze"
                  >Analysieren</md-option
                >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/BloomTax_Evaluate"
                  >Evaluieren</md-option
                >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/BloomTax_Create"
                  >Erschaffen</md-option
                >
              </md-select>
              <md-select v-else md-dense disabled />
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
                <i
                  class="handle fas fa-arrows-alt"
                  style="margin-left: 10px"
                ></i>
              </span>
            </md-field>
          </div>
          <div
            class="md-layout-item md-size-100 md-layout md-gutter md-alignment-bottom-center"
            style="margin-bottom: 10px"
            v-if="newBoolean"
            v-for="(input, i) in $v.inputs1.$each.$iter"
            :key="input.id"
          >
            <md-field
              class="md-layout-item md-size-55"
              :class="getValidationClass('inputs1')"
            >
              <label>Lernergebnis*</label>
              <md-textarea
                v-if="modOutcome.length > 0 && existence"
                v-model.trim="input.name.$model[0]"
                @change="addChanged('inputs1', parseInt(i) + 1 + '0')"
                :disabled="role != 1 && role != 2"
                md-autogrow
              />
              <md-input v-else disabled />
              <span class="md-error" v-if="!input.name.required"
                >Bitte alle bearbeitbaren Felder vervollständigen</span
              >
            </md-field>
            <md-field class="md-layout-item md-size-20">
              <label>Kompetenzen*</label>
              <md-select
                v-if="modOutcome.length > 0 && existence"
                v-model="input.name.$model[1]"
                @md-selected="
                  addChanged('inputs1', parseInt(i) + 1 + '1'),
                    clearBloom(parseInt(i))
                "
                :disabled="role != 1 && role != 2"
                md-dense
              >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/SubjectMatterCompetence"
                  >Fachkompetenz</md-option
                >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/SocialCompetence"
                  >Sozialkompetenz</md-option
                >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/SelfCompetence"
                  >SelfCompetence</md-option
                >
              </md-select>
              <md-select v-else md-dense disabled />
            </md-field>
            <md-field class="md-layout-item md-size-25">
              <label>Bloomsche Taxonomie*</label>
              <md-select
                v-if="modOutcome.length > 0 && existence"
                v-model="input.name.$model[2]"
                @md-selected="addChanged('inputs1', parseInt(i) + 1 + '2')"
                :disabled="
                  (role != 1 && role != 2) ||
                    input.name.$model[1] !=
                      'https://bmake.th-brandenburg.de/module/SubjectMatterCompetence'
                "
                md-dense
              >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/BloomTax_Remember"
                  >Erinnern</md-option
                >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/BloomTax_Understand"
                  >Verstehen</md-option
                >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/BloomTax_Apply"
                  >Anwenden</md-option
                >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/BloomTax_Analyze"
                  >Analysieren</md-option
                >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/BloomTax_Evaluate"
                  >Evaluieren</md-option
                >
                <md-option
                  value="https://bmake.th-brandenburg.de/module/BloomTax_Create"
                  >Erschaffen</md-option
                >
              </md-select>
              <md-select v-else md-dense disabled />
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
                <i
                  class="handle fas fa-arrows-alt"
                  style="margin-left: 10px"
                ></i>
              </span>
            </md-field>
          </div>
        </div>

        <div
          class="md-layout md-gutter"
          style="border-color:#fcdd86; border-width: 3px; border-style: solid; border-radius: 10px; margin:3px;"
          v-sortable="{ onEnd: reorder2, handle: '.handle' }"
        >
          <div
            class="md-layout-item md-size-100"
            v-if="!newBoolean"
            v-for="(input, i) in inputs2"
            :key="input.id"
          >
            <md-field>
              <label>Inhaltselement</label>
              <md-textarea
                v-if="modOutcome.length > 0 && existence"
                v-model.trim="input.name"
                @change="addChanged('inputs2', i)"
                :disabled="role != 1 && role != 2"
                md-autogrow
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
                <i
                  class="handle fas fa-arrows-alt"
                  style="margin-left: 10px"
                ></i>
              </span>
            </md-field>
          </div>
          <div
            class="md-layout-item md-size-100"
            style="margin-bottom: 10px"
            v-if="newBoolean"
            v-for="(input, i) in $v.inputs2.$each.$iter"
            :key="input.id"
          >
            <md-field :class="getValidationClass('inputs2')">
              <label>Inhaltselement*</label>
              <md-textarea
                v-if="modOutcome.length > 0 && existence"
                v-model.trim="input.name.$model"
                @change="addChanged('inputs2', i)"
                :disabled="role != 1 && role != 2"
                md-autogrow
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
              <span class="md-error" v-if="!input.name.required"
                >Pflichtfeld</span
              >
            </md-field>
          </div>
        </div>

        <!--<div class="md-layout md-gutter" style="border-color:#fcdd86; border-width: 3px; border-style: solid; border-radius: 10px; margin:3px;">
        <div
          class="md-layout-item md-size-100"
          v-for="(input, i) in inputs3"
          :key="i"
        >
          <md-field>
            <label>Prüfungsvorleistung</label>
            <md-input v-model="input.name"></md-input>
            <span>
              <i
                class="fas fa-minus-circle"
                @click="remove('3', i)"
                v-show="i || (!i && inputs3.length > 1)"
              ></i>
              <i
                class="fas fa-plus-circle"
                @click="add('3', i)"
                v-show="i == inputs3.length - 1"
              ></i>
            </span>
          </md-field>
        </div>
      </div>-->

        <div
          class="md-layout md-gutter"
          style="border-color:#fcdd86; border-width: 3px; border-style: solid; border-radius: 10px; margin:3px;"
          v-sortable="{ onEnd: reorder4, handle: '.handle' }"
        >
          <div
            class="md-layout-item md-size-100"
            v-if="!newBoolean"
            v-for="(input, i) in inputs4"
            :key="input.id"
          >
            <md-field>
              <label>Prüfungsleistung</label>
              <md-textarea
                v-if="modOutcome.length > 0 && existence"
                v-model="input.name"
                @change="addChanged('inputs4', i)"
                :disabled="role != 1 && role != 2"
                md-autogrow
              />
              <md-input v-else disabled />
              <span v-if="role == 1 || role == 2">
                <i
                  class="fas fa-minus-circle"
                  @click="remove('4', i)"
                  v-show="i || (!i && inputs4.length > 1)"
                />
                <i
                  class="fas fa-plus-circle"
                  @click="add('4', i)"
                  v-show="i == inputs4.length - 1"
                />
                <i
                  class="handle fas fa-arrows-alt"
                  style="margin-left: 10px"
                ></i>
              </span>
            </md-field>
          </div>
          <div
            class="md-layout-item md-size-100"
            style="margin-bottom: 10px"
            v-if="newBoolean"
            v-for="(input, i) in $v.inputs4.$each.$iter"
            :key="input.id"
          >
            <md-field :class="getValidationClass('inputs4')">
              <label>Prüfungsleistung*</label>
              <md-textarea
                v-if="modOutcome.length > 0 && existence"
                v-model.trim="input.name.$model"
                @change="addChanged('inputs4', i)"
                :disabled="role != 1 && role != 2"
                md-autogrow
              />
              <md-input v-else disabled />
              <span v-if="role == 1 || role == 2">
                <i
                  class="fas fa-minus-circle"
                  @click="remove('4', i)"
                  v-show="inputs4.length > 1"
                />
                <i
                  class="fas fa-plus-circle"
                  @click="add('4', i)"
                  v-show="i == inputs4.length - 1"
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
      </div>
      <div class="md-layout md-gutter">
        <div class="md-layout-item">
          <div>
            <md-button
              v-if="modOutcome.length > 0"
              type="submit"
              :disabled="role != 1 && role != 2"
              >Änderung speichern</md-button
            >
            <md-button
              v-if="modOutcome.length > 0"
              @click="resetData"
              :disabled="role != 1 && role != 2"
              >Änderung verwerfen</md-button
            >
            <!--<md-button v-if="modOutcome.length > 0" @click="generatePDF">Download</md-button>-->
            <transition name="fade">
              <div class="alert alert-success" v-if="notification">
                <div class="alert-icon">
                  <md-icon>check</md-icon>
                </div>
                Änderungen gespeichert!
              </div>
            </transition>
            <p>input1 is: {{ inputs1 }}</p>
            <p>input2 is: {{ inputs2 }}</p>
            <p>input4 is: {{ inputs4 }}</p>
            <p>count: {{ count }}</p>
            <p>changedArray: {{ changedArray }}</p>
            <!--<p>delete: {{ this.delete }}</p>-->
            <p>insert: {{ insert }}</p>
            <p>where: {{ where }}</p>
            <p>update: {{ updateQuery }}</p>
            <p>modOutcome: {{ modOutcome }}</p>
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
    "modOutcomeOrigin",
    "moduleUri",
    "role",
    "newBoolean",
    "code",
    "basicFilled"
  ],
  name: "outcome",
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
      items: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
      changedArray: [],
      updateQuery: "",
      existence: true,
      notification: false,
      count: 0,
      prefixes:
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/>  ",
      delete: [],
      insert: [],
      where: [],
      countLearn: 0,
      modOutcome: [],
      whereStr:
        " module:about_LResults ?LResult ; " +
        " module:about_Exam ?examCode ; " +
        " module:about_Content ?contentCode. " +
        " ?examCode schema:itemListElement ?exam . " +
        " ?contentCode schema:itemListElement ?content . ",
      inputs1: [
        {
          id: 0,
          name: []
        }
      ],
      inputs2: [
        {
          id: 0,
          name: ""
        }
      ],
      inputs3: [
        {
          id: 0,
          name: ""
        }
      ],
      inputs4: [
        {
          id: 0,
          name: ""
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
          required(value) {
            if (
              value.length < 2 ||
              value[0] == "" ||
              value[0] == null ||
              value[1] == null ||
              (value[1] ==
                "https://bmake.th-brandenburg.de/module/SubjectMatterCompetence" &&
                value[2] == null)
            ) {
              return false;
            } else {
              return true;
            }
          }
        }
      }
    },
    inputs2: {
      required,
      $each: {
        name: {
          required
        }
      }
    },
    inputs4: {
      required,
      $each: {
        name: {
          required
        }
      }
    }
  },
  methods: {
    reorder1({ oldIndex, newIndex }) {
      console.log(oldIndex, newIndex);
      const movedItem = this.inputs1.splice(oldIndex, 1)[0];
      this.inputs1.splice(newIndex, 0, movedItem);
      this.addChanged("inputs1", newIndex + 1 + "0");
      this.addChanged("inputs1", oldIndex + 1 + "0");
    },
    reorder2({ oldIndex, newIndex }) {
      console.log(oldIndex, newIndex);
      const movedItem = this.inputs2.splice(oldIndex, 1)[0];
      this.inputs2.splice(newIndex, 0, movedItem);
      this.addChanged("inputs2", newIndex + 1);
      this.addChanged("inputs2", oldIndex + 1);
    },
    reorder4({ oldIndex, newIndex }) {
      console.log(oldIndex, newIndex);
      const movedItem = this.inputs4.splice(oldIndex, 1)[0];
      this.inputs4.splice(newIndex, 0, movedItem);
      this.addChanged("inputs4", newIndex + 1);
      this.addChanged("inputs4", oldIndex + 1);
    },
    validateInput() {
      this.$v.$touch();

      if (!this.newBoolean) {
        this.updateData();
      } else if (!this.$v.$invalid) {
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
      if (input == "1") {
        //if (index > this.countLearn - 1) {

        /*let removeLength = index + 1;
        let totalLength = this.inputs1.length + 1;
        let i = this.changedArray.inputs1.indexOf(removeLength + "0");
        if (i > -1) {
          this.changedArray.inputs1.splice(i, 1);
        } else {
          //todo: remove actions
        }
        i = this.changedArray.inputs1.indexOf(removeLength + "1");
        if (i > -1) {
          this.changedArray.inputs1.splice(i, 1);
        }

        if (totalLength > removeLength) {
          for (let i = removeLength + 1; i <= totalLength; i++) {
            let a = this.changedArray.inputs1.indexOf(i + "0");
            if (a > -1) {
              this.changedArray.inputs1[a] = i - 1 + "0";
            }
            let b = this.changedArray.inputs1.indexOf(i + "1");
            if (b > -1) {
              this.changedArray.inputs1[b] = i - 1 + "1";
            }
          }
        }*/
        this.changedArray["inputs" + input].push(index + "0");
        //}
      } else {
        this.changedArray["inputs" + input].push(index);
      }
    },
    addChanged(item, position) {
      if (this.changedArray[item].indexOf(position) === -1) {
        if (this.count != 0) {
          if (item == "inputs1") {
            let p = parseInt(position.substring(0, position.length - 1));
            let n = parseInt(position.substring(position.length - 1));
            if (this[item][p - 1].name[n] != null) {
              this.changedArray[item].push(position);
            }
          } else {
            this.changedArray[item].push(position);
          }
        }
        this.count++;
      }
    },
    clearBloom(i) {
      if (this.count != 0) {
        if (
          this.inputs1[i].name[1] !=
            "https://bmake.th-brandenburg.de/module/SubjectMatterCompetence" &&
          this.inputs1[i].name[2]
        ) {
          this.inputs1[i].name.splice(2, 1);
        }
      }
    },
    updateData() {
      let query = "";
      query = this.prefixes;
      if (!this.newBoolean) {
        if (this.changedArray.inputs1.length > 0) {
          if (this.inputs1.length != this.countLearn) {
            let learningResultsSub = " module:LResults_" + this.code;
            let tripleDelWhe =
              learningResultsSub +
              " schema:itemListElement ?learningResults . ?learningResults ?pLearnResult ?oLearnResult . ";
            this.delete.push(tripleDelWhe);
            this.where.push(tripleDelWhe);

            let tripleIns = learningResultsSub + " schema:itemListElement ";
            let tripleInsDetail = "";
            for (let i = 0; i < this.inputs1.length; i++) {
              let num = "";
              if (i < 9) {
                num = "0" + (i + 1);
              } else {
                num = (i + 1).toString();
              }
              let sub = "module:LResult" + num + "_" + this.code;
              if (i == this.inputs1.length - 1) {
                tripleIns += sub + " . ";
              } else {
                tripleIns += sub + ", ";
              }
              tripleInsDetail +=
                sub +
                ' a schema:ListItem ; schema:name  "Learning result ' +
                this.code +
                " " +
                num +
                '" ; schema:position ' +
                (i + 1) +
                ' ; schema:description "' +
                this.inputs1[i].name[0] +
                '" ; schema:additionalType ' +
                " <" +
                this.inputs1[i].name[1] +
                "> ";
              if (this.inputs1[i].name[2]) {
                tripleInsDetail += ", <" + this.inputs1[i].name[2] + ">  . ";
              } else {
                tripleInsDetail += ". ";
              }
            }
            this.insert.push(tripleIns);
            this.insert.push(tripleInsDetail);
          } else {
            let tripleInsDetail = "";
            let tripleDelWhe = "";
            for (let i = 0; i < this.inputs1.length; i++) {
              let num = "";
              if (i < 9) {
                num = "0" + (i + 1);
              } else {
                num = (i + 1).toString();
              }
              let sub = " module:LResult" + num + "_" + this.code;
              tripleDelWhe +=
                sub +
                " schema:additionalType  ?LRaddType" +
                num +
                "; schema:description  ?LRdes" +
                num +
                ". ";
              tripleInsDetail +=
                sub +
                ' schema:description "' +
                this.inputs1[i].name[0] +
                '" ; schema:additionalType ' +
                " <" +
                this.inputs1[i].name[1] +
                "> ";
              if (this.inputs1[i].name[2]) {
                tripleInsDetail += ", <" + this.inputs1[i].name[2] + ">  . ";
              } else {
                tripleInsDetail += ". ";
              }
            }
            this.delete.push(tripleDelWhe);
            this.where.push(tripleDelWhe);
            this.insert.push(tripleInsDetail);
          }
        }

        if (this.changedArray.inputs2.length > 0) {
          let contentsSub = " module:Content_" + this.code;
          let tripleDelWhe =
            contentsSub +
            " schema:itemListElement ?contents . ?contents ?pContent ?oContent . ";
          this.delete.push(tripleDelWhe);
          this.where.push(tripleDelWhe);
          let tripleIns = contentsSub + " schema:itemListElement ";
          let tripleInsDetail = "";
          for (let i = 0; i < this.inputs2.length; i++) {
            let num = "";
            if (i < 9) {
              num = "0" + (i + 1);
            } else {
              num = (i + 1).toString();
            }
            let sub = " module:Content" + num + "_" + this.code;
            if (i == this.inputs2.length - 1) {
              tripleIns += sub + " . ";
            } else {
              tripleIns += sub + ", ";
            }
            tripleInsDetail +=
              sub +
              ' a schema:ListItem ; schema:name  "' +
              this.inputs2[i].name +
              '" ; schema:position ' +
              (i + 1) +
              " .  ";
          }
          this.insert.push(tripleIns);
          this.insert.push(tripleInsDetail);
        }

        if (this.changedArray.inputs4.length > 0) {
          let examsSub = " module:Exam_" + this.code;
          let tripleDelWhe =
            examsSub +
            " schema:itemListElement ?exams . ?exams ?pExam ?oExam . ";
          this.delete.push(tripleDelWhe);
          this.where.push(tripleDelWhe);
          let tripleIns = examsSub + " schema:itemListElement ";
          let tripleInsDetail = "";
          for (let i = 0; i < this.inputs4.length; i++) {
            let num = "";
            if (i < 9) {
              num = "0" + (i + 1);
            } else {
              num = (i + 1).toString();
            }
            let sub = " module:Exam" + num + "_" + this.code;
            if (i == this.inputs4.length - 1) {
              tripleIns += sub + " . ";
            } else {
              tripleIns += sub + ", ";
            }
            tripleInsDetail +=
              sub +
              ' a schema:ListItem ; schema:name  "' +
              this.inputs4[i].name +
              '" ; schema:position ' +
              (i + 1) +
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
        let learnResult = " module:LResults_" + this.code;
        let content = " module:Content_" + this.code;
        let exam = " module:Exam_" + this.code;

        query += " INSERT DATA { ";
        query +=
          subject +
          " module:about_LResults " +
          learnResult +
          " ;  module:about_Content " +
          content +
          " ;  module:about_Exam " +
          exam +
          " . ";

        //learning results
        query +=
          learnResult +
          ' a schema:ItemList ;  schema:identifier  "Results" ;  schema:name "Lernergebnisse ' +
          this.code +
          '" ; schema:itemListElement  ';

        let learningResultCourse = "";
        let learningResultCourseDetail = "";
        for (let i = 0; i < this.inputs1.length; i++) {
          let num = "";
          if (i < 9) {
            num = "0" + (i + 1);
          } else {
            num = (i + 1).toString();
          }
          let sub = "module:LResult" + num + "_" + this.code;
          if (i == this.inputs1.length - 1) {
            learningResultCourse += sub + " . ";
          } else {
            learningResultCourse += sub + ", ";
          }
          learningResultCourseDetail +=
            sub +
            ' a schema:ListItem ; schema:name  "Learning result ' +
            this.code +
            " " +
            num +
            '" ; schema:position ' +
            (i + 1) +
            ' ; schema:description "' +
            this.inputs1[i].name[0] +
            '" ; schema:additionalType ' +
            " <" +
            this.inputs1[i].name[1] +
            "> ";
          if (this.inputs1[i].name[2]) {
            learningResultCourseDetail +=
              ", <" + this.inputs1[i].name[2] + ">  .";
          } else {
            learningResultCourseDetail += ". ";
          }
        }
        query += learningResultCourse;
        query += learningResultCourseDetail;

        //Contents
        query +=
          content +
          ' a schema:ItemList ;  schema:identifier  "Content" ;  schema:name "Inhalt ' +
          this.code +
          '" ; schema:itemListElement  ';
        let contentCourse = "";
        let contentCourseDetail = "";
        for (let i = 0; i < this.inputs2.length; i++) {
          let num = "";
          if (i < 9) {
            num = "0" + (i + 1);
          } else {
            num = (i + 1).toString();
          }
          let sub = " module:Content" + num + "_" + this.code;
          if (i == this.inputs2.length - 1) {
            contentCourse += sub + " . ";
          } else {
            contentCourse += sub + ", ";
          }
          contentCourseDetail +=
            sub +
            ' a schema:ListItem ; schema:name  "' +
            this.inputs2[i].name +
            '" ; schema:position ' +
            (i + 1) +
            " .  ";
        }
        query += contentCourse;
        query += contentCourseDetail;

        //Exams
        query +=
          exam +
          ' a schema:ItemList ;  schema:identifier  "Exam" ;  schema:name "Studien-/Prüfungsleistungen ' +
          this.code +
          '" ; schema:itemListElement  ';
        let examCourse = "";
        let examCourseDetail = "";
        for (let i = 0; i < this.inputs4.length; i++) {
          let num = "";
          if (i < 9) {
            num = "0" + (i + 1);
          } else {
            num = (i + 1).toString();
          }
          let sub = " module:Exam" + num + "_" + this.code;
          if (i == this.inputs4.length - 1) {
            examCourse += sub + " . ";
          } else {
            examCourse += sub + ", ";
          }
          examCourseDetail +=
            sub +
            ' a schema:ListItem ; schema:name  "' +
            this.inputs4[i].name +
            '" ; schema:position ' +
            (i + 1) +
            " .  ";
        }
        query += examCourse;
        query += examCourseDetail;

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
          /*setTimeout(() => {
            this.clearCache();
          }, 20000);*/
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
              this.modOutcome[0].label = res[0].label;
            }
          } else {
            this.existence = false;
          }
          this.$v.$reset();
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    clearCache() {
      this.changedArray = {
        inputs1: [],
        inputs2: [],
        inputs3: [],
        inputs4: []
      };
      this.delete = [];
      this.insert = [];
      this.where = [];
      this.countLearn = this.inputs1.length;
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
          name: ""
        }
      ];
      this.inputs3 = [
        {
          id: 0,
          name: ""
        }
      ];
      this.inputs4 = [
        {
          id: 0,
          name: ""
        }
      ];
      this.changedArray = {
        inputs1: [],
        inputs2: [],
        inputs3: [],
        inputs4: []
      };
      this.existence = true;
      this.modOutcome = [];
      this.delete = [];
      this.insert = [];
      this.where = [];
      this.count = 0;
      this.modOutcome = _.cloneDeep(this.modOutcomeOrigin);
      //this.modOutcome = this.modOutcome[0];
      if (this.newBoolean) {
        this.checkModule();
      }
      this.$v.$reset();
    },
    generatePDF() {
      const doc = new jsPDF();
      let pdfHead = [];
      let pdfBody = [];
      let q =
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/> " +
        "SELECT DISTINCT ?code ?exams ?learnResults ?contents " +
        "WHERE { " +
        "    <" +
        this.moduleUri +
        "> " +
        "schema:courseCode ?code . " +
        " " +
        "            OPTIONAL { " +
        '    SELECT (GROUP_CONCAT(?exam; separator="\\n") as ?exams) ' +
        "                WHERE { " +
        "                  <" +
        this.moduleUri +
        "> module:about_Exam ?examCode. " +
        "                  ?examCode schema:itemListElement ?exam . " +
        "                } " +
        "            } " +
        "            OPTIONAL { " +
        '    SELECT (GROUP_CONCAT(?learnResult; separator="\\n") as ?learnResults) ' +
        "                WHERE { " +
        "                  <" +
        this.moduleUri +
        "> module:about_LResults ?LResult. " +
        "                  ?LResult schema:itemListElement ?resList . " +
        "                  ?resList schema:description ?learnResult " +
        "                } " +
        "            } " +
        " OPTIONAL { " +
        '    SELECT (GROUP_CONCAT(?content; separator="\\n") as ?contents) ' +
        "                WHERE { " +
        "                  SELECT ?content " +
        "                  WHERE { " +
        "                    <" +
        this.moduleUri +
        "> module:about_Content ?contentCode. " +
        "                    ?contentCode schema:itemListElement ?content . " +
        "                  } ORDER BY ?content " +
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
          pdfBody.push(["Lernergebnisse", res[0].learnResults.value]);
          pdfBody.push(["Inhalte", res[0].contents.value]);
          pdfBody.push(["Prüfungsleistungen", res[0].exams.value]);

          doc.autoTable({
            styles: { overflow: "linebreak" },
            columnStyles: {
              0: { cellWidth: 50 },
              1: { cellWidth: 130 }
            },
            head: pdfHead,
            body: pdfBody
          });
          doc.save("InhalteLeistungen.pdf");
        })
        .catch(e => {
          this.errors.push(e);
        });
    }
  },
  watch: {
    modOutcomeOrigin(v) {
      this.initialState();
    },
    basicFilled(v) {
      this.existence = true;
      this.checkModule();
    },
    modOutcome(v) {
      if (!this.newBoolean && this.modOutcomeOrigin.length > 0) {
        let learnblooms = v[0].learnBlooms.value;
        this.countLearn = learnblooms.length;
        let contents = v[0].contents.value;
        let exams = v[0].exams.value;
        for (let i = 0; i < learnblooms.length; i++) {
          this.inputs1[i] = { id: i, name: learnblooms[i] };
        }
        for (let i = 0; i < contents.length; i++) {
          this.inputs2[i] = { id: i, name: contents[i] };
        }
        for (let i = 0; i < exams.length; i++) {
          this.inputs4[i] = { id: i, name: exams[i] };
        }
      }
    }
  }
};
</script>
<style scoped>
span {
  top: 30px;
}
.list {
  position: relative;
}
.list > *.dragging {
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
}
</style>
