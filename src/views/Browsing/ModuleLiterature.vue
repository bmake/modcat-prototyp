<template>
  <div class="wrapper">
    <md-content style="border-color: #a5a5a5">
          <div>
            <h3 style="color: #a5a5a5"><b>Literatur</b></h3>
            <p>
              Empfohlene Literatur und sonstige Quellen<br/>
              Links (DOIs und URLs) elektronischer Ressourcen<br/>
              Web-IDs von Autor*innen und Verlagen<br/>
            </p>
            <router-link :to="{ name: 'literature', params: { code: $route.params.code }}"><b>Anschauen</b></router-link>
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