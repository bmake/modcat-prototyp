<template>
  <div>
    <p> DOI: {{ message }} </p>
    <input v-model="message">
  </div>
</template>

<script>
export default {
  name: "literatureDOI",
  data() {
    return {
      message: "Hier DOI eingeben!"
    };
  },
};
</script>
