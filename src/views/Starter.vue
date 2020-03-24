<template>
  <div class="wrapper">
    <parallax class="page-header header-filter" style="background-color: #FF8F00;">
      <div class="md-layout">
        <div class="md-layout-item">
          <div class="image-wrapper">
            <div class="brand">
              <h1>Modulkatalog @THB</h1>
              <h3>Fachbereich Wirtschaft</h3>
              <div>
                <Select @module="getModule"/>
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
              <SVGGraph :module-uri="selectedModule" @modBasicData="getModBasicData"
                @modOutcomes="getModOutcomes"
                @modMethods="getModMethod"
                @modLiterature="getModLiter"
                @modTeachers="getModTeacher"
                @formType="getFormType"
              >
              </SVGGraph>
            </div>
            <div class="md-layout-item">
              <md-button href="" class="md-simple md-success md-lg">****Form Area****</md-button>
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

export default {
  components: {
    Select,
    SVGGraph
  },
  name: "index",
  bodyClass: "index-page",
  props: {

  },
  data() {
    return {
      selectedModule: '',
      modBasis: null,
      modOutcome: null,
      modMethod: null,
      modLiter: null,
      modTeacher: null,
      form: 'BasicData'
    };
  },
  methods: {
    getModule(value) {
      this.selectedModule = value;
    },
    getModBasicData(value) {
      this.modBasis = value;
      console.log("ModBasisValueStarter", this.modBasis)
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
    }
  },
  computed: {

  },
  mounted() {

  },/*
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
