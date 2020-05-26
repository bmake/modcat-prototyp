<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>

          <div class="modal-body">
            <form novalidate class="md-layout" @submit.prevent="validateInput">
              <div class="md-layout-item md-size-100">
                <md-field :class="getValidationClass('studyProgram')">
                  <label>Bitte wählen Sie einen Studiengang aus</label>
                  <md-select
                    v-model="studyProgram"
                    name="studyProgram"
                    id="studyProgram"
                  >
                    <md-option value="WIB">WI Bachelor</md-option>
                    <md-option value="WIM">WI Master</md-option>
                    <md-option value="BWLB">BWL Bachelor</md-option>
                    <md-option value="BWLM">BWL Master</md-option>
                  </md-select>
                  <span class="md-error" v-if="!$v.studyProgram.required"
                    >Sie müssen einen Studiengang auswählen</span
                  >
                </md-field>
              </div>

              <div style="margin-top: 15px" class="md-layout-item  md-size-100">
                <md-field :class="getValidationClass('course')">
                  <label>Modulkürzel</label>
                  <span class="md-prefix" style="font-size: x-small"
                    >https://bmake.th-brandenburg.de/module/</span
                  >
                  <md-input v-model="course"
                            name="course"
                            id="course" />
                  <span style="margin-bottom: 20px" class="md-error" v-if="!$v.course.required"
                    >Sie müssen einen Modulkürzel eingeben</span
                  >
                  <!--<span class="md-error" v-else-if="!$v.course.minlength">Invalid first name</span>-->
                </md-field>
              </div>

              <md-button style="margin-top: 30px" type="submit" class="md-primary">
                OK
              </md-button>
            </form>
          </div>

          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <!--<div>
  <div slot="header">
    <h4 class="modal-title">Modal Title</h4>
    <md-button
            class="md-simple md-just-icon md-round modal-default-button"
            @click="$emit('close')"
    >
      <md-icon>clear</md-icon>
    </md-button>
  </div>

  <div slot="body">
    <p>
      Far far away, behind the word mountains, far from the countries Vokalia and
      Consonantia, there live the blind texts. Separated they live in
      Bookmarksgrove right at the coast of the Semantics, a large language ocean.
      A small river named Duden flows by their place and supplies it with the
      necessary regelialia. It is a paradisematic country, in which roasted parts
      of sentences fly into your mouth. Even the all-powerful Pointing has no
      control about the blind texts it is an almost unorthographic life One day
      however a small line of blind text by the name of Lorem Ipsum decided to
      leave for the far World of Grammar.
    </p>
  </div>

  <div slot="footer">
    <md-button class="md-simple">Nice Button</md-button>
    <md-button class="md-danger md-simple" @click="$emit('close')"
    >Close</md-button
    >
  </div>
</div>-->
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "NewModulePopUp",
  mixins: [validationMixin],
  data() {
    return {
      studyProgram: null,
      course: null
    };
  },
  validations: {
    studyProgram: {
      required
    },
    course: {
      required
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    validateInput() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.$emit("close");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
span {
  top: 35px;
}
</style>
