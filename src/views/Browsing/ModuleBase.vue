<template>
  <div class="wrapper">
    <md-content style="border-color: #0070c0">
          <div>
            <h3 style="color: #0070c0"><b>Rahmendaten</b></h3>
            <p>
              Aktuelle Studien- und Prüfungsordnung (SPO)<br/>
              Alle SPO-relevanten Daten<br/>
              Modulverantwortliche und Lehrende<br/>
              Webseite und sonstige Informationen<br/>
            </p>
            <router-link :to="{ name: 'base', params: { code: $route.params.code }}"><b>Anschauen</b></router-link>
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