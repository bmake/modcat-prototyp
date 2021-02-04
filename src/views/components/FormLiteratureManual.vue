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
                      <md-input v-model="inputs.titelNeu" />
                    </md-field>
                </div>
                <!-- ISBN -->
                <div v-if="litAuswahl == 'Buch'"
                    class="md-size-100">
                    <md-field>
                      <label>ISBN</label>
                      <md-input v-model="inputs.isbnNeu" />
                    </md-field>
                </div>
                <!-- Erscheinen IN z.B. Journal-->
                <div v-if="litAuswahl == 'Artikel'"
                     class="md-size-100"> 
                  <label>In</label>
                  <div class="md-layout md-gutter"> 
                    <!-- Titel_IN -->
                    <div class="md-layout-item md-size-60">
                        <md-field>
                          <label>Titel</label>
                          <md-input v-model="inputs.titelInBandNeu" />
                        </md-field>
                    </div>
                    <!-- Band_IN -->
                    <div class="md-layout-item md-size-20">
                        <md-field>
                          <label>Band</label>
                          <md-input v-model="inputs.bandInBandNeu" />
                        </md-field>
                    </div>
                    <!-- Jahr_IN -->
                    <div class="md-layout-item md-size-20">
                        <md-field>
                          <label>Jahr</label>
                          <md-input v-model="inputs.jahrInBandNeu" />
                        </md-field>
                    </div>
                  </div>
                </div>  
                <!-- Herausgeber/ Verlag -->
                <div class="md-size-100">
                    <md-field>
                      <label>Herausgeber/ Verlag</label>
                      <md-input v-model="inputs.publisherNeu" />
                    </md-field>
                </div>
                
                <!-- Veröffentlichung -->
                <div class="md-size-100">
                    <md-field>
                      <label>Veröffentlichung</label>
                      <md-input v-model="inputs.datePublishedNeu" />
                    </md-field>
                </div>
                <!-- Auflage -->
                <div v-if="litAuswahl == 'Buch'" 
                     class="md-size-100">
                    <md-field>
                      <label>Auflage</label>
                      <md-input v-model="inputs.auflageNeu" />
                    </md-field>
                </div>
                <!-- Artikel Seiten "von" - "bis" z.B. Journal-->
                <div v-if="litAuswahl == 'Artikel'"
                     class="md-size-100"> 
                  <div class="md-layout md-gutter"> 
                    <!-- Seiten von -->
                    <div class="md-layout-item md-size-50">
                        <md-field>
                          <label>Seiten von</label>
                          <md-input v-model="inputs.seitenVonInBandNeu" />
                        </md-field>
                    </div>
                    <!-- Seiten bis -->
                    <div class="md-layout-item md-size-50">
                        <md-field>
                          <label>Seiten bis</label>
                          <md-input v-model="inputs.seitenBisInBandNeu" />
                        </md-field>
                    </div>
                  </div>
                </div>  
                <!-- URL z.B. OPAC-Link, Springer-Link oder arxiv-Link -->
                <div class="md-size-100">
                    <md-field>
                      <label>URL</label>
                      <md-input v-model="inputs.urlLinkNeu" />
                    </md-field>
                </div>
            
                <!-- DOI-Link (Identifier nicht ausgeben, aber DOI-Link, wenn vorhanden) -->
                <div v-if="litAuswahl == 'Buch'" 
                     class="md-size-100">
                    <md-field>
                      <label>DOI</label>
                      <md-input v-model="inputs.doiLinkNeu" /> 
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
                          <md-input v-model="inputs.autorNachnameNeu1"/>
                        </md-field>
                    </div>
                    <!-- Vorname -->
                    <div class="md-layout-item md-size-20">
                        <md-field>
                          <label>Vorname</label>
                          <md-input v-model="inputs.autorVornameNeu1"/>
                        </md-field>
                    </div>
                    <!-- URL/ Profil-Link -->
                    <div class="md-layout-item md-size-60">
                        <md-field>
                          <label>Profil-Link/URL</label>
                          <md-input v-model="inputs.autorProfilLinkNeu1"/>
                        </md-field>
                    </div>
                  </div>
                </div> <!-- ENDE Autoren/innen -->
                
              <!-- TestAusagbe -->
              <p>Message is: {{ inputs.titelNeu }} - {{ inputs.isbnNeu }} </p>
              <button class="md-layout-item md-size-20" @click="updateData">
                QueryLaden
              </button>
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
      prefixes:
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/>  ",
      inputs: [
        {
          id: 0,
          titelNeu: [],
          isbnNeu: [],
          publisherNeu: [],
          datePublishedNeu: [],
          auflageNeu: [],
          urlLinkNeu: [],
          doiLinkNeu: [],
          titelInBandNeu: [],
          bandInBandNeu: [],
          jahrInBandNeu: [],
          seitenVonInBandNeu: [],
          seitenBisInBandNeu: [],
          autorUri: [],
          autorNachnameNeu1: [],
          autorVornameNeu1: [],
          autorProfilLinkNeu1: [],
          literaturUri: [] 
        },
      ]
    };
  },
  methods: {
    /*
     ### Module GPMO
      module:GPMO schema:citation <http://doi.org/10.1007/978-3-8348-2428-8>.

      <http://doi.org/10.1007/978-3-8348-2428-8> a schema:Book ;
			rdfs:label "Gadatsch: GPM" ;
			schema:author resGate:Andreas_Gadatsch ;
			schema:headline "Grundkurs Geschäftsprozess-Management – Methoden und Werkzeuge für die IT-Praxis." ;
			schema:bookEdition "7. Auflage" ;
			schema:datePublished "2012" . 
			
resGate:Andreas_Gadatsch a module:Author ;
			rdfs:label "Andreas Gadatsch" ;
			schema:givenName "Andreas" ;
			schema:familyName "Gadatsch" ;
			schema:honorificPrefix "Prof. Dr." .
    */
    updateData() {
      let query = this.prefixes;
      
      //literaturUri + autorUri müss noch erzeugt werden
      //this.inputs.literaturUri = "<http://th-brandenburg.de/" + uuidv4() + ">";
      this.inputs.literaturUri = "<http://th-brandenburg.de/121234234>";
      this.inputs.autorUri = "<http://aurotUri.com/123456>";
      
      if (this.inputs.titelNeu.length > 0) {
        query += " INSERT { ";
        //query += " moduleUri ";
        query += "module:GPMO "; //Nur zum Test, muss dann am Ende für die 3 Zeilen davor weichen
        query += "schema:citation " + this.inputs.literaturUri + " . "; 

        if (this.litAuswahl === "Buch"){
          query += this.inputs.literaturUri + " a schema:Book ; ";
          
          if (this.inputs.isbnNeu.length > 0){
            query += 'schema:isbn "' + this.inputs.isbnNeu + '"; ';
          }
          if (this.inputs.publisherNeu.length > 0){
            query += 'schema:publisher "' + this.inputs.publisherNeu + '"; ';
          }
          if (this.inputs.datePublishedNeu.length > 0){
            query += 'schema:datePublished "' + this.inputs.datePublishedNeu + '"; ';
          }
          if (this.inputs.auflageNeu.length > 0){
            query += 'schema:bookEdition "' + this.inputs.auflageNeu + '"; ';
          }
          if (this.inputs.urlLinkNeu.length > 0){
            query += 'schema:url "' + this.inputs.urlLinkNeu + '"; ';
          }
          if (this.inputs.doiLinkNeu.length > 0){
            query += 'schema:identifier "' + this.inputs.doiLinkNeu + '"; ';
          }
          if (this.inputs.autorUri.length > 0){
            query += 'schema:author "' + this.inputs.autorUri + '"; ';
          }          
        }
        else if (this.litAuswahl === "Artikel"){
          query += this.inputs.literaturUri + " a schema:Article ; ";
          
        }
        else if (this.litAuswahl === "DigitalesDokument"){
          query += this.inputs.literaturUri + " a schema:DigitalDocument ; ";
        }
        //Titel
        query += 'schema:headline "' + this.inputs.titelNeu + '". ';

        //Autoren/innen

      }
          
         
      
      //Log
      console.log("literatureManuell");
      console.log(query);
      this.updateQuery = query;

      /*
      axios
        .post(
          "http://fbwsvcdev.fh-brandenburg.de:8080/fuseki/modcat/update",
          query,
          {
            headers: { "Content-Type": "application/sparql-update" }
          }
        )
        .then(response => {
          let status = response.status;
          if (status == 204) {
            this.notification = true;
            setTimeout(() => {
              this.notification = false;
            }, 2000);
          }
          this.clearCache();
        })
        .catch(e => {
          this.errors.push(e);
        });
      */
    },
    
    
    
    
  },
};
</script>