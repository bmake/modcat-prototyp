<template>
  <div class="wrapper">
    <parallax class="page-header header-filter" style="background-color: #FF8F00;">
      <div class="md-layout">
        <div class="md-layout-item">
          <div class="image-wrapper">
            <div class="brand">
              <h1>Modulkatalog @THB</h1>
              <h3>Fachbereich Wirtschaft</h3>
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
              <md-button href="" class="md-simple md-success md-lg">****SVG Area****</md-button>
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


export default {
  components: {

  },
  name: "index",
  bodyClass: "index-page",
  props: {

  },
  data() {
    return {

    };
  },
  methods: {

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


@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
}
</style>
