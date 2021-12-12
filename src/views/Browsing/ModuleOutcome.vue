<template>
  <div class="wrapper">
    <md-content style="border-color: #92d050">
          <div>
            <h3 style="color: #92d050;"><b>Didaktik</b></h3>
            <p>
              Lernziele nach Kompetenzarten und -stufen<br/>
              Strukturierte Lerninhalte<br/>
              Prüfungsleistungen<br/>
            </p>
            <router-link :to="{ name: 'outcome', params: { code: $route.params.code }}"><b>Anschauen</b></router-link>
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