<template>
  <div class="wrapper">
    <div class="module description">
      <div style="display: flex; justify-content: center;">
        <md-content style="border-color: #0070c0">
          <div>
            <h4 style="color: #0070c0"><b>Rahmendaten</b></h4>
            <p>
              Aktuelle Studien- und Prüfungsordnung (SPO)<br/>
              Alle SPO-relevanten Daten<br/>
              Modulverantwortliche und Lehrende<br/>
              Webseite und sonstige Informationen<br/>
            </p>
            <router-link :to="{ name: 'base', params: { code: $route.params.code }}"><b>Anschauen</b></router-link>
          </div>
        </md-content>
        <md-content style="border-color: #92d050">
          <div>
            <h4 style="color: #92d050;"><b>Didaktik</b></h4>
            <p>
              Lernziele nach Kompetenzarten und -stufen<br/>
              Strukturierte Lerninhalte<br/>
              Prüfungsleistungen<br/>
            </p>
            <router-link :to="{ name: 'outcome', params: { code: $route.params.code }}"><b>Anschauen</b></router-link>
          </div>
        </md-content>
      </div>
      <div style="display: flex; justify-content: center;">
        <md-content style="border-color: #92d050">
          <div>
            <h4 style="color: #92d050"><b>Methodik</b></h4>
            <p>
              Lehr- und Lernformen<br/>
              Aufteilung der Workload<br/>
            </p>
            <router-link :to="{ name: 'method', params: { code: $route.params.code }}"><b>Anschauen</b></router-link>
          </div>
        </md-content>
        <md-content style="border-color: #a5a5a5">
          <div>
            <h4 style="color: #a5a5a5"><b>Literatur</b></h4>
            <p>
              Empfohlene Literatur und sonstige Quellen<br/>
              Links (DOIs und URLs) elektronischer Ressourcen<br/>
              Web-IDs von Autor*innen und Verlagen<br/>
            </p>
            <router-link :to="{ name: 'literature', params: { code: $route.params.code }}"><b>Anschauen</b></router-link>
          </div>
        </md-content>
      </div>
    </div>
  </div>
</template>