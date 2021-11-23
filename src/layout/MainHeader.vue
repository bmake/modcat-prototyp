<template>
  <div class="header-filter" style="background-color: #FF8F00;">
    <div class="md-layout">
      <div class="md-layout-item">
        <div class="index-page">
          <div class="brand">
            <img
              src="../../img/logo.svg"
              class="img"
              width="10%"
              height="auto"
            />
            <h1>Modulkatalog @THB</h1>
            <h3>Fachbereich Wirtschaft</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainHeader"
};
</script>

<style scoped>
.header-filter {
  padding: 5%;
}

.brand h3 {
  margin-top: 0 !important;
}
</style>
