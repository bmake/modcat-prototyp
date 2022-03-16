<template>
  <div class="wrapper">
    <BrowsingHeader />
    <div class="main main-raised">
      <div
        style="text-align: center; margin-bottom:10px; padding-top: 1em; padding-bottom: 1em"
      >
        <h3>
          <b>Wählen Sie einen Einstieg</b>
        </h3>
        <!-- Suche -->
        <md-list-item class="padded">
          <md-avatar>
            <img src="../assets/img/searchIcon.svg" />
          </md-avatar>
          <md-field style="max-width: 25em">
            <md-input placeholder="Suchbegriff(e) eingeben"></md-input>
            <!-- ToDo Eingabe übergeben, enter=absenden, escapen? -->
            <md-icon>search</md-icon>
          </md-field>
          <md-button class="md-raised red" :to="{ name: 'search'}">
            Suche
          </md-button>
        </md-list-item>
        <!-- Filter -->
        <md-list-item class="padded">
          <md-avatar>
            <img src="../assets/img/filterIcon.svg" />
          </md-avatar>
          Nach Fachbereichen, Studiengängen, Lehrpersonen, etc. filtern
          <md-button class="md-raised red" :to="{ name: 'filter'}">
            Filtern
          </md-button>
        </md-list-item>
        <!-- Wissengraph -->
        <md-list-item class="padded">
          <md-avatar>
            <img src="../assets/img/graphIcon.svg" />
          </md-avatar>
          Über den Wissensgraphen frei navigieren
          <md-button class="md-raised red" :to="{ name: 'navgraph'}">
            Navigation
          </md-button>
        </md-list-item>
        <!-- Report -->
        <md-list-item class="padded">
          <md-avatar>
            <img src="../assets/img/reportIcon.svg" />
          </md-avatar>
          Berichte und Übersichten konfigurieren und ausgeben
          <md-button class="md-raised red" :to="{ name: 'report'}">
            Report
          </md-button>
        </md-list-item>
      </div>
    </div>
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

<style>
.md-button.red {
  background-color: #cc0a2e !important;
  color: white !important;
  max-width: 100px;
}

.md-list-item.padded {
  padding-left: 6em;
  padding-right: 4em;
}
</style>
