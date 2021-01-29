<template>
  <div>
    <p> ISBN: {{ message }} </p>
    <input v-model="message">
  </div>
</template>

<script>
export default {
  name: "literatureISBN",
  data() {
    return {
      message: "Hier ISBN eingeben!"
    };
  },
};
</script>