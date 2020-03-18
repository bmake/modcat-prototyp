<template>
  <footer class="footer">
    <div class="container">
      <div class="copyright">
        &copy; {{ year }} created by
        <a href="https://bmake.th-brandenburg.de" target="_blank">BMaKE Group</a> @
        <a href="https://www.th-brandenburg.de/startseite/" target="_blank">THB</a>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  props: {
    backgroundColor: String,
    type: String
  },
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>
<style></style>
