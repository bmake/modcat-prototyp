<template>
  <div class="wrapper">
    <div
      class="header-filter"
      style="background-color: #FF8F00; text-align: center"
    >
      <div class="md-layout">
        <div class="md-layout-item">
          <div>
            <div class="brand">
              <img
                src="../../img/logo.svg"
                class="img"
                width="10%"
                height="auto"
              />
              <h1 style="color: white">Modulkatalog @THB</h1>
              <h3 style="color: white; margin-bottom: 70px">
                Fachbereich Wirtschaft
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main main-raised">
      <div
        style="text-align: center; margin-top:10px; margin-bottom: 0px; padding-top: 0em"
      >
        <div class="section section-examples">
          <div class="container-fluid text-center">
            <div class="md-layout">
              <!----
                          <div class="box md-layout-item">
                              <h2 class="header" style="background-color:#4CAF50"><b>{{ browsen }}</b></h2>
                              <h4>Suchen und finden Sie beliebige Daten und Auswertungen zu unseren Modulen – ganz ohne Anmeldung.</h4>
                          </div>

                          <div class="box md-layout-item">
                              <h2 class="header" style="background-color:#4CAF50"><b>{{ dokumentieren }}</b></h2>
                              <a>Dokumentieren Sie die Ihnen zugeordneten Module – melden Sie sich dafür mit Ihrem THB-Account an.</a>                              
                          </div>

                          <div class="box md-layout-item">
                              <h2 class="header" style="background-color:#4CAF50"><b>{{ editieren }}</b></h2>
                              <a>Aktualisieren Sie die von Ihnen verantworteten Module. Dafür benötigen Sie zusätzliche Schreibrechte.</a>                              

                          </div> ---->
              <div class="cards">

                <div class="columns md-layout-item">
                  <ul class="topic">
                    <li class="header">
                      <b>{{ browsen }}</b>
                    </li>
                    <li class="description">
                      <b
                        >Suchen und finden Sie beliebige Daten und Auswertungen
                        zu unseren Modulen – ganz ohne Anmeldung.</b
                      >
                    </li>
                    <li class="description">
                      <router-link to="/Browsing"><b>Anschauen</b></router-link>
                    </li>
                  </ul>
                </div>
                <!--to activate the linking fnuction of the card, change '<div>' to '<router-link>'-->
                <div class="columns md-layout-item">
                  <ul class="topic">
                    <li class="header">
                      <b>{{ dokumentieren }}</b>
                    </li>
                    <li class="description">
                      <b
                        >Dokumentieren Sie die Ihnen zugeordneten Module –
                        melden Sie sich dafür mit Ihrem THB-Account an.</b
                      >
                    </li>
                    <li class="description">
                      <div to="/Dokumentieren"
                        ><b>Anschauen</b></div
                      >
                    </li>
                  </ul>
                </div>

                <div class="columns md-layout-item">
                  <ul class="topic">
                    <li class="header">
                      <b>{{ editieren }}</b>
                    </li>
                    <li class="description">
                      <b
                        >Aktualisieren Sie die von Ihnen verantworteten Module –
                        dafür benötigen Sie zusätzliche Schreibrechte.</b
                      >
                    </li>
                    <li class="description">
                      <router-link to="/Starter"><b>Anschauen</b></router-link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Starter from "./Starter";
import Browsing from "./Browsing";
import Dokumentieren from "./Dokumentieren";

export default {
  routes: [
    {
      path: "/Starter",
      name: "Starter",
      component: Starter
    }
  ],

  data() {
    return {
      browsen: "Whatsup!",
      dokumentieren: "Whatsup!",
      editieren: "Whatsup!"
    };
  },
  created() {
    this.browsen = "Browsen";
    this.dokumentieren = "Dokumentieren";
    this.editieren = "Editieren";
  }
};
</script>
<style lang="scss">
.cards {
  margin-left: 8%;
  margin-right: 8%;
  margin-top: -161px;
}

.columns {
  float: left;
  width: 33.3%;
}

.topic {
  list-style-type: none;
  border: 3px solid rgb(255, 161, 74);
  border-radius: 10px;
  margin: 25px;
  padding: 0;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}

.topic:hover {
  box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.2);
}

.topic .header {
  background-color: rgba(255, 115, 0, 0);
  color: white;
  font-size: 25px;
}

.topic li {
  padding: 20px;
  text-align: center;
}

.topic .description {
  font-size: 20px;
}

@media only screen and (max-width: 600px) {
  .columns {
    width: 100%;
  }
}

.faded {
  opacity: 0.2 !important;
  transition: 0.3s opacity !important;
}
.highlight {
  opacity: 1 !important;
}

g.selected rect {
  stroke: #ffc107 !important;
  stroke-width: 2px !important;
}

.md-button.choosed {
  background-color: #ea80fc !important;
}

#download {
  background-color: #fff9c4 !important;
}
#download:hover {
  background-color: #fcdd86 !important;
  background-color: #ea80fc;
}

.header-filter {
  padding: 5%;
}

.brand h3 {
  margin-top: 0 !important;
}

@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
  .brand2 h2 {
    padding: 50px;
  }
  .svg.md-layout-item {
    min-width: 40%;
    max-width: 40%;
    margin-left: 5%;
    margin-right: 3%;
  }
}

@media all and (max-width: 700px) {
  .svg.md-layout-item {
    min-width: 100%;
    max-width: 100%;
  }
}

@media all and (max-width: 500px) {
  .brand {
    margin-top: 3em;
    max-width: max-content !important;
    width: 100% !important;
  }
  .brand h1 {
    font-size: 2.2em !important;
  }
  .brand2 h2 {
    font-size: xx-large !important;
  }
}

.select {
  padding: 5em;
}

.select .md-field.md-theme-default label {
  color: #2e2e2e !important;
  font-size: large;
}

.select .md-field.md-theme-default .md-menu.md-select input {
  -webkit-text-fill-color: white !important;
  font-weight: bold !important;
  font-size: large !important;
  margin-top: 5px;
}

.select .md-field.md-autocomplete.md-theme-default .md-menu input {
  -webkit-text-fill-color: white !important;
  font-weight: bold !important;
  font-size: large !important;
  margin-top: 5px;
}

.md-menu-content {
  max-width: 400px !important;
}

span.md-list-item-text {
  white-space: normal !important;
  max-height: max-content !important;
  padding: 5px !important;
  font-size: medium !important;
}

.md-highlight-text.md-theme-default {
  white-space: normal !important;
  max-height: max-content !important;
  font-size: medium !important;
}

span.md-highlight-text-match {
  color: #2e2e2e !important;
}

.md-list.md-dense .md-list-item-text {
  margin-left: 20px !important;
  font-size: small !important;
}

@media all and (max-width: 700px) {
  .md-menu-content {
    max-width: 200px !important;
  }
  .md-list.md-dense .md-list-item-text {
    margin-left: 5px !important;
    font-size: small !important;
  }
  .select {
    padding: 3em;
    margin-bottom: 3em;
  }
  .select .md-layout-item.md-size-25 {
    min-width: 100%;
    max-width: 100%;
  }
  .md-autocomplete + strong {
    margin-top: 36px;
    display: block;
  }
}
</style>
