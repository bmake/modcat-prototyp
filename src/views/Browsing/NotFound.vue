<template>
  <div class="wrapper">
    <BrowsingHeader />
    <h2>Leider konnte die gesuchte Seite nicht gefunden werden.</h2>
    Kehren Sie zur
    <router-link to="/browsing/filter">Filterauswahl</router-link> zurück.
  </div>
</template>

<script>
import BrowsingHeader from "@/views/components/BrowsingHeader.vue";

export default {
  components: {
    BrowsingHeader
  }
};
</script>
