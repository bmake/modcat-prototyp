<template>
  <div class="wrapper">
    <md-content style="border-color: #92d050">
      <div>
        <h3 style="color: #92d050"><b>Methodik</b></h3>
        <p>
          Lehr- und Lernformen<br/>
          Aufteilung der Workload<br/>
        </p>
        <router-link :to="{ name: 'method', params: { code: $route.params.code }}"><b>Anschauen</b></router-link>
      </div>
    </md-content>
  </div>
</template>

<style lang="scss">
.md-content {
  width: 100%;
  display: inline-flex;
  justify-content: left;
  align-items: center;
  border-radius: 5px;
  border-style: solid;
  margin: 2px;
  padding: 5px;
}
</style>