<template>
  <div>
    <label> Hey there! Enter all information!</label>
            <!-- Ausgeklappte Anzeige einer Literatur -->
            <!-- var "detailAnsicht" ist der Schalter für Anzeige -->
            
            <div> 
              <label> DropdownAuswahl</label>
              <md-field class="md-size-100">
                <label>Literaturauswahl*</label>
                <md-select v-model="litAuswahl">
                  <md-option
                    value="Buch"
                    >Buch</md-option
                  >
                  <md-option
                    value="Artikel"
                    >Artikel</md-option
                  >
                  <md-option
                    value="DigitalesDokument"
                    >DigitalesDokument</md-option
                  >  
                </md-select>
              </md-field>
            </div>  <!-- END DropDown -->
            <div> 
              <label> Eingabebereich Literatur</label>
                <!-- Titel -->
                <div class="md-size-100">
                    <md-field>
                      <label>Titel</label>
                      <md-input v-model="titelNeu" />
                    </md-field>
                </div>
                <!-- ISBN -->
                <div v-if="litAuswahl == 'Buch'"
                    class="md-size-100">
                    <md-field>
                      <label>ISBN</label>
                      <md-input v-model="isbnNeu" />
                    </md-field>
                </div>  
                <!-- Herausgeber/ Verlag -->
                <div class="md-size-100">
                    <md-field>
                      <label>Herausgeber/ Verlag</label>
                      <md-input v-model="publisherNeu" />
                    </md-field>
                </div>
                
                <!-- Veröffentlichung -->
                <div class="md-size-100">
                    <md-field>
                      <label>Veröffentlichung</label>
                      <md-input v-model="datePublishedNeu" />
                    </md-field>
                </div>
                <!-- Auflage -->
                <div class="md-size-100">
                    <md-field>
                      <label>Auflage</label>
                      <md-input v-model="auflageNeu" />
                    </md-field>
                </div>
                <!-- URL z.B. OPAC-Link, Springer-Link oder arxiv-Link -->
                <div class="md-size-100">
                    <md-field>
                      <label>URL</label>
                      <md-input v-model="urlLinkNeu" />
                    </md-field>
                </div>
            
                <!-- DOI-Link (Identifier nicht ausgeben, aber DOI-Link, wenn vorhanden) -->
                <div v-if="litAuswahl == 'Buch'" 
                     class="md-size-100">
                    <md-field>
                      <label>DOI</label>
                      <md-input v-model="doiLinkNeu" /> 
                    </md-field>
                </div>
                <!-- Autoren/innen -->
                <div class="md-size-100"> 
                  <label>Autoren/innen</label>
                  <div class="md-layout md-gutter"> 
                    <!-- Nachname -->
                    <div class="md-layout-item md-size-20">
                        <md-field>
                          <label>Nachname</label>
                          <md-input v-model="nachnameNeu1"/>
                        </md-field>
                    </div>
                    <!-- Vorname -->
                    <div class="md-layout-item md-size-20">
                        <md-field>
                          <label>Vorname</label>
                          <md-input v-model="vornameNeu1"/>
                        </md-field>
                    </div>
                    <!-- URL/ Profil-Link -->
                    <div class="md-layout-item md-size-60">
                        <md-field>
                          <label>Profil-Link/URL</label>
                          <md-input v-model="profilLinkNeu1"/>
                        </md-field>
                    </div>
                  </div>
                </div> <!-- ENDE Autoren/innen -->
                <!-- Autoren/innen -->
                <div class="md-size-100">
                  <div class="md-layout md-gutter"> 
                    <!-- Nachname -->
                    <div class="md-layout-item md-size-20">
                        <md-field>
                          <label>Nachname</label>
                          <md-input v-model="nachnameNeu2"/>
                        </md-field>
                    </div>
                    <!-- Vorname -->
                    <div class="md-layout-item md-size-20">
                        <md-field>
                          <label>Vorname</label>
                          <md-input v-model="vornameNeu2"/>
                        </md-field>
                    </div>
                    <!-- URL/ Profil-Link -->
                    <div class="md-layout-item md-size-60">
                        <md-field>
                          <label>Profil-Link/URL</label>
                          <md-input v-model="profilLinkNeu2"/>
                        </md-field>
                    </div>
                  </div>
                </div> <!-- ENDE Autoren/innen -->
            </div>
  </div>
</template>

<script>
export default {
  name: "literatureManual",
  data() {
    return {
      label: "Manuell",
      litAuswahl: "Buch",
    };
  },
};
</script>