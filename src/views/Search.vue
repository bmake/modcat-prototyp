<template>
  <div class="wrapper">
    <BrowsingHeader />
    <h3>Hier wird die Suche präsentiert</h3>
    <h5>Gesucht nach: {{ searchedFor }}</h5>
  </div>
</template>

<script>
import BrowsingHeader from "@/views/components/BrowsingHeader.vue";

export default {
  components: {
    BrowsingHeader
  },
  data() {
    return {
      searchedFor: ""
    };
  },
  created() {
    this.searchedFor = this.$route.params.lookFor;
  }
};
</script>
