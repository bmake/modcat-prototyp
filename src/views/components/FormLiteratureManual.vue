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
          <md-option value="Buch">Buch</md-option>
          <md-option value="Artikel">Artikel</md-option>
          <md-option value="DigitalesDokument">DigitalesDokument</md-option>
        </md-select>
      </md-field>
    </div>
    <!-- END DropDown -->
    <!-- Ausgabe der Daten in Formular -->
    <div @change="generateQuery">
      <label> Eingabebereich Literatur</label>
      <!-- Titel -->
      <div class="md-size-100">
        <md-field>
          <label>Titel*</label>
          <md-input v-model="inputs.titelNeu" />
        </md-field>
      </div>
      <!-- ISBN -->
      <div v-if="litAuswahl == 'Buch'" class="md-size-100">
        <md-field>
          <label>ISBN</label>
          <md-input v-model="inputs.isbnNeu" @change="getOpacLink" />
        </md-field>
      </div>
      <!-- Erscheinen IN z.B. Journal-->
      <div v-if="litAuswahl == 'Artikel'" class="md-size-100">
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
          <label>Veröffentlichung*</label>
          <md-input v-model="inputs.datePublishedNeu" />
        </md-field>
      </div>
      <!-- Auflage -->
      <div v-if="litAuswahl == 'Buch'" class="md-size-100">
        <md-field>
          <label>Auflage</label>
          <md-input v-model="inputs.auflageNeu" />
        </md-field>
      </div>
      <!-- Artikel Seiten "von" - "bis" z.B. Journal-->
      <div v-if="litAuswahl == 'Artikel'" class="md-size-100">
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
          <label v-if="loading">Suche OPAC-Link ...</label>
          <label v-else>URL</label>
          <md-input v-model="inputs.urlLinkNeu" v-if="loading" disabled />
          <md-input v-model="inputs.urlLinkNeu" v-else />
        </md-field>
      </div>

      <!-- DOI-Link (Identifier nicht ausgeben, aber DOI-Link, wenn vorhanden) -->
      <div v-if="litAuswahl == 'Buch'" class="md-size-100">
        <md-field>
          <label>DOI</label>
          <md-input v-model="inputs.doiLinkNeu" />
        </md-field>
      </div>
      <!-- Autoren/innen -->
      <div class="md-size-100">
        <label>Autoren/innen</label>
        <div
          v-for="(autor, i) in autoren"
          :key="autor"
          class="md-layout md-gutter"
        >
          <!-- Nachname -->
          <div class="md-layout-item md-size-20">
            <md-field>
              <label>Nachname*</label>
              <md-input v-model="autor.autorNachnameNeu" />
            </md-field>
          </div>
          <!-- Vorname -->
          <div class="md-layout-item md-size-20">
            <md-field>
              <label>Vorname*</label>
              <md-input v-model="autor.autorVornameNeu" />
            </md-field>
          </div>
          <!-- URL/ Profil-Link -->
          <div class="md-layout-item md-size-60">
            <md-field>
              <label>Profil-Link/URL*</label>
              <md-input
                v-model="autor.autorProfilLinkNeu"
                @change="autorDuplicationCheck(i)"
              />
              <AutorSelectionPopUp
                v-if="showPopUp"
                @close="showPopUp = false"
                @duplicateChecked="handleAutorSelection"
                :demoExistingAutor="demoExistingAutor"
                :autorIndex="i"
              >
              </AutorSelectionPopUp>
              <!-- Plus, Minus, Verschieben-Symbole -->
              <span>
                <i
                  class="fas fa-minus-circle"
                  @click="removeAutor('autoren', i)"
                  v-show="autoren.length > 1"
                />
                <i
                  class="fas fa-plus-circle"
                  @click="addAutor('autoren', i)"
                  v-show="i == autoren.length - 1"
                />
                <i class="handle fas fa-arrows-alt" style="margin-left: 10px" />
              </span>
            </md-field>
          </div>
        </div>
      </div>
      <!-- ENDE Autoren/innen -->

      <!-- TestAusagbe -->
      <p>
        Message is: {{ inputs.titelNeu }} - {{ inputs.titelInBandNeu }} -
        {{ autoren }}
      </p>
      <button class="md-layout-item md-size-20" @click="generateQuery">
        QueryLaden
      </button>
      <button class="md-layout-item md-size-20" @click="checkAutor">
        checkAutor
      </button>
    </div>
    <!-- ENDE - Ausgabe der Daten in Formular -->
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import AutorSelectionPopUp from "./AutorSelectionPopUp";

export default {
  props: [    
    "moduleUri"
  ],
  name: "literatureManual",
  components: {
    AutorSelectionPopUp,
  },
  data() {
    return {
      changedArray: [],
      label: "Manuell",
      litAuswahl: "Buch",
      prefixes:
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/>  ",
      inputs: {
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
        literaturUri: [],
        literaturJournalUri: [],
        publisherUri: [],
      },
      autoren: [
        {
          autorUri: [],
          autorNachnameNeu: [],
          autorVornameNeu: [],
          autorProfilLinkNeu: [],
        },
      ],
      loading: false,
      demoExistingAutor: [
        {
          vorname: "Klaus",
          nachname: "Cleber",
          url: "http://facebook.com/klaus",
        },
        {
          vorname: "Klaus",
          nachname: "Cleber",
          url: "http://xing.com/klausi",
        },
      ],
      showPopUp: false,
      test: null,
    };
  },
  methods: {
    addAutor(input, index) {
      this[input].push({ autorNachnameNeu: [] });
    },
    removeAutor(input, index) {
      this[input].splice(index, 1);

    },
    checkAutor() {
      //Vorschalg: Entweder die ganze Query in eine For-Schleif + das jeweils abfangen,
      //           oder den index aus dem Formular-Teil übergeben
      let queryAutor = this.prefixes;

      queryAutor +=
        " SELECT DISTINCT ?autorUri ?autorVorname ?autorNachname ?autorProfilLink ";
      queryAutor += " WHERE { ";
      queryAutor += " ?autorUri  a module:Author; ";
      queryAutor += "            schema:givenName ?autorVorname; ";
      queryAutor += "            schema:familyName ?autorNachname. ";

      queryAutor += " OPTIONAL { ";
      queryAutor += " ?autorUri schema:sameAs ?autorProfilLink.  ";
      queryAutor += " } ";

      queryAutor +=
        " {?autorUri schema:sameAs '" +
        this.autoren[0].autorProfilLinkNeu +
        "' } ";
      queryAutor += " UNION ";
      queryAutor +=
        " { ?autorUri schema:familyName '" +
        this.autoren[0].autorNachnameNeu +
        "' ; ";
      queryAutor +=
        "             schema:givenName '" +
        this.autoren[0].autorVornameNeu +
        "' . } ";
      queryAutor += "  }";

      //Log
      console.log("checkAutorQuery");
      console.log(queryAutor);

      // Daten vom Fuseki abrufen
      /*
      axios
        .post(
          "http://fbwsvcdev.fh-brandenburg.de:8080/fuseki/modcat/query",
          queryAutor,
          {
            headers: { "Content-Type": "application/sparql-query" },
          }
        )
        .then((response) => {
          // JSON responses are automatically parsed.
          this.moduleInfo = response.data.results.bindings;
        })
        .catch((e) => {
          this.errors.push(e);
        });
      */
    },
    getOpacLink() {
      this.inputs.urlLinkNeu = "";
      this.loading = true;
      axios
        .get(
          "https://opac.th-brandenburg.de/search?isbn=" + this.inputs.isbnNeu,
          {
            headers: {
              Accept: "text/html",
            },
            crossdomain: true,
          }
        )
        .then((response) => {
          if (response.data.includes("in die Merkliste")) {
            this.inputs.urlLinkNeu =
              "https://opac.th-brandenburg.de/search?isbn=" +
              this.inputs.isbnNeu;
          }
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
    autorDuplicationCheck(index) {
      let autor = this.autoren[index];
      if (this.demoExistingAutor.length < 1) return;
      if (
        autor.autorVornameNeu.length > 0 &&
        autor.autorNachnameNeu.length > 0 &&
        autor.autorProfilLinkNeu.length > 0
      ) {
        console.log(index);
        this.showPopUp = true;
      }
    },
    handleAutorSelection(result) {
      this.test = result;
      if (result.autor.vorname.length > 0) {
        console.log(result);
        this.autoren[result.index].autorVornameNeu = result.autor.vorname;
        this.autoren[result.index].autorNachnameNeu = result.autor.nachname;
        this.autoren[result.index].autorProfilLinkNeu = result.autor.url;
      }
    },
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
    generateQuery() {
      let query = ""; //let query = this.prefixes; // wird in LiteratureForm hinzugefügt

      // Generate Literature URI
      if (this.inputs.doiLinkNeu.length > 0) {
        this.inputs.literaturUri = "<" + this.inputs.doiLinkNeu + ">";
      } else if (this.inputs.isbnNeu.length > 0) {
        this.inputs.literaturUri =
          "<http://isbn-international.org/" + this.inputs.isbnNeu + ">";
      } else {
        this.inputs.literaturUri =
          "<https://th-brandenburg.de/literatur/" + uuidv4() + ">";
      }

      // Generate Autoren URIs
      console.log(this.autoren);
      for (let autor of this.autoren) {
        // if (autor.autorProfilLinkNeu.inclued('orcid.org')) -> Dann Orcid als URI
        autor.autorUri = "<https://th-brandenburg.de/autor/" + uuidv4() + ">";
      }

      // Generate Pulisher URIs (Herausgeber/ Verlag) 
      if (this.inputs.publisherNeu.length > 0) {
          this.inputs.publisherUri = "<https://th-brandenburg.de/publisher/" + uuidv4() + ">";
          console.log(this.inputs.publisherUri);
      }
      
      if (this.inputs.titelNeu.length > 0) {
        //query += " INSERT { "; //wird in LiteratureForm hinzugefügt
        //query += "module:GPMO "; //Nur zum Test
        query += "  <" + this.moduleUri + "> ";
        query += "schema:citation " + this.inputs.literaturUri + " . ";

        if (this.litAuswahl === "Buch") {
          query += this.inputs.literaturUri + " a schema:Book ; ";

          if (this.inputs.isbnNeu.length > 0) {
            query += 'schema:isbn "' + this.inputs.isbnNeu + '"; ';
          }
          if (this.inputs.publisherNeu.length > 0) {
            // Referenz zur Pulisher URIs erzeugen (Herausgeber/ Verlag) 
            query += "schema:publisher " + this.inputs.publisherUri + "; ";
          }
          if (this.inputs.datePublishedNeu.length > 0) {
            query +=
              'schema:datePublished "' + this.inputs.datePublishedNeu + '"; ';
          }
          if (this.inputs.auflageNeu.length > 0) {
            query += 'schema:bookEdition "' + this.inputs.auflageNeu + '"; ';
          }
          if (this.inputs.urlLinkNeu.length > 0) {
            query += 'schema:url "' + this.inputs.urlLinkNeu + '"; ';
          }
          if (this.inputs.doiLinkNeu.length > 0) {
            query += 'schema:identifier "' + this.inputs.doiLinkNeu + '"; ';
          }
          //Referenz zu den Autoren in Lit erzeugen
          if (
            this.autoren.every((autor) => autor.autorNachnameNeu.length > 0)
          ) {
            query += "schema:author ";
            for (let autor of this.autoren) {
              query += autor.autorUri + " , ";
            }
            query = query.slice(0, query.length - 3);
            query += " ; ";
          }
        } else if (this.litAuswahl === "Artikel") {
          //In Journal als Book definiert
          if (this.inputs.titelInBandNeu.length > 0) {
            this.inputs.literaturJournalUri =
              "<https://th-brandenburg.de/literatur/" + uuidv4() + ">";
            query += this.inputs.literaturJournalUri + " a schema:Book ; ";

            if (this.inputs.bandInBandNeu.length > 0) {
              query +=
                'schema:bookEdition "' + this.inputs.publisherNeu + '"; ';
            }
            if (this.inputs.jahrInBandNeu.length > 0) {
              query +=
                'schema:datePublished "' + this.inputs.bandInBandNeu + '"; ';
            }

            query += 'schema:headline "' + this.inputs.titelInBandNeu + '". ';
          }

          //Artikle
          query += this.inputs.literaturUri + " a schema:Article ; ";

          if (this.inputs.titelInBandNeu.length > 0) {
            query += 'schema:isPartOf "' + this.inputs.literaturJournalUri + '"; ';
          }
          if (this.inputs.publisherNeu.length > 0) {
             // Referenz zur Pulisher URIs erzeugen (Herausgeber/ Verlag) 
            query += "schema:publisher " + this.inputs.publisherUri + "; ";
          }
          if (this.inputs.datePublishedNeu.length > 0) {
            query += 'schema:datePublished "' + this.inputs.datePublishedNeu + '"; ';
          }
          if (
            this.inputs.seitenVonInBandNeu.length > 0 &&
            this.inputs.seitenBisInBandNeu.length > 0
          ) {
            query += 'schema:pageStart "' + this.seitenVonInBandNeu + '"; ';
            query += 'schema:pageEnd "' + this.seitenBisInBandNeu + '"; ';
          }
          if (this.inputs.urlLinkNeu.length > 0) {
            query += 'schema:url "' + this.inputs.urlLinkNeu + '"; ';
          }
        } else if (this.litAuswahl === "DigitalesDokument") {
          query += this.inputs.literaturUri + " a schema:DigitalDocument ; ";

          if (this.inputs.publisherNeu.length > 0) {
            query += "schema:publisher " + this.inputs.publisherNeu + "; ";
          }
          if (this.inputs.datePublishedNeu.length > 0) {
            query +=
              'schema:datePublished "' + this.inputs.datePublishedNeu + '"; ';
          }
          if (this.inputs.urlLinkNeu.length > 0) {
            query += 'schema:url "' + this.inputs.urlLinkNeu + '"; ';
          }
        }
        //Titel
        query += 'schema:headline "' + this.inputs.titelNeu + '". ';

        //Autoren/innen
        if (this.autoren.every(autor => autor.autorNachnameNeu.length > 0)) {
          for (let autor of this.autoren) {
            query += autor.autorUri + " a module:Author ; ";

            if (autor.autorNachnameNeu != "") {
              query += 'schema:familyName "' + autor.autorNachnameNeu + '"; ';
            }
            if (autor.autorVornameNeu != "") {
              query += 'schema:givenName "' + autor.autorVornameNeu + '"; ';
            }

            query += 'schema:sameAs "' + autor.autorProfilLinkNeu + '". ';
          }
        }
        
        //Herausgeber/ Verlag
        if (this.inputs.publisherNeu.length > 0) {
            // Generate Pulisher URIs (Herausgeber/ Verlag) 
            query += this.inputs.publisherUri + ' a schema:Organization ; ';
            query += 'schema:legalName "' + this.inputs.publisherNeu + '". ';
        }

      }

      //Log
      console.log("literatureManuell");
      console.log(query);
      this.updateQuery = query;

      // Let Literature.vue know of changes
      this.$emit("queryChanged", query);
    },
  },
};
</script>
