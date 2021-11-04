<template>
  <div class="wrapper">
    <BrowsingHeader />
    <div class="main main-raised">
      <div
        style="text-align: center; margin-bottom:10px; padding-top: 1em; padding-bottom: 1em"
      >
        <h4>
          <b>Wählen Sie einen Einstieg</b>
        </h4>
        <md-list-item class="padded">
          <md-avatar>
            <img src="../assets/imgBrowseIcons/searchIcon.svg" />
          </md-avatar>
          <md-field style="max-width: 25em">
            <md-input placeholder="Suchbegriff(e) eingeben"></md-input>
            <md-icon>search</md-icon>
          </md-field>
          <md-button class="md-raised red">Suche</md-button>
        </md-list-item>
        <md-list-item class="padded">
          <md-avatar>
            <img src="../assets/imgBrowseIcons/filterIcon.svg" />
          </md-avatar>
          Nach Fachbereichen, Studiengängen, Lehrpersonen, etc. filtern
          <md-button class="md-raised red">Filtern</md-button>
        </md-list-item>
        <md-list-item class="padded">
          <md-avatar>
            <img src="../assets/imgBrowseIcons/graphIcon.svg" />
          </md-avatar>
          Über den Wissensgraphen frei navigieren
          <md-button class="md-raised red">Navigation</md-button>
        </md-list-item>
        <md-list-item class="padded">
          <md-avatar>
            <img src="../assets/imgBrowseIcons/reportIcon.svg" />
          </md-avatar>
          Berichte und Übersichten konfigurieren und ausgeben
          <md-button class="md-raised red">Report</md-button>
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
  max-width: 100px;
}

.md-list-item.padded {
  padding-left: 6em;
  padding-right: 4em;
}
</style>
