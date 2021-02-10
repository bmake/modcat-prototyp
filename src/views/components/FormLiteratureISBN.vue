<template>
  <div>
    <div>
      <p>Bitte geben Sie eine gültige ISBN ein</p>
      <md-input
        class="md-layout-item md-size-80"
        v-model="isbn"
        @keyup.enter="queryISBNData"
      />
      <md-button class="md-layout-item md-warning" @click="queryISBNData">
        Laden
      </md-button>
      <div v-if="loading === true">
        <div class="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </div>
      <div v-if="apiError !== null">
        {{ apiError }}
      </div>
    </div>
    <!-- Ausgabe der Daten in Formular -->
    <div @change="generateQuery" class="md-layout-item md-size-100" v-if="loading === false">
      <br />
      <!-- Titel -->
      <div class="md-size-100">
        <md-field>
          <label>Titel</label>
          <md-input v-model="cleanedISBNData.title" />
        </md-field>
      </div>
      <!-- ISBN -->
      <div class="md-size-100">
        <md-field>
          <label>ISBN</label>
          <md-input v-model="isbn" disabled />
        </md-field>
      </div>
      <!-- Herausgeber -->
      <div class="md-size-100">
        <md-field>
          <label>Herausgeber</label>
          <md-input v-model="cleanedISBNData.publisher" />
        </md-field>
      </div>
      <!-- Veröffentlichung -->
      <div class="md-size-100">
        <md-field>
          <label>Veröffentlichung</label>
          <md-input v-model="cleanedISBNData.publishedDate" />
        </md-field>
      </div>
      <!-- Auflage -->
      <div class="md-size-100">
        <md-field>
          <label>Auflage</label>
          <md-input v-model="cleanedISBNData.contentVersion" />
        </md-field>
      </div>
      <!-- URL -->
      <div class="md-size-100">
        <md-field>
          <label>URL</label>
          <md-input v-model="cleanedISBNData.infoLink" />
        </md-field>
      </div>
      <!-- Autoren/innen -->
      <div class="md-size-100">
        <label>Autoren/innen</label>
        <div
          v-for="(author, i) in cleanedISBNData.authors" :key="author"
          class="md-layout md-gutter"
        >
          <!-- Nachname -->
          <div class="md-layout-item md-size-20">
            <md-field>
              <label>Nachname*</label>
              <md-input v-model="author.family" />
            </md-field>
          </div>
          <!-- Vorname -->
          <div class="md-layout-item md-size-20">
            <md-field>
              <label>Vorname*</label>
              <md-input v-model="author.given" />
            </md-field>
          </div>
          <!-- URL/ Profil-Link -->
          <div class="md-layout-item md-size-60">
            <md-field>
              <label>Profil-Link/URL*</label>
              <md-input
                v-model="author.url"
               @change="autorDuplicationCheck(i)"
              />
              <AutorSelectionPopUp
                v-if="showPopUp"
                @close="showPopUp = false"
                @duplicateChecked="handleAutorSelection"
                :demoExistingAutor="demoExistingAutor"
                :autorIndex="authorIndexPopUp"
              >
              </AutorSelectionPopUp>
              <!-- Plus, Minus, Verschieben-Symbole -->
              <span>
                <i
                  class="fas fa-minus-circle"
                  @click="removeAutor(i)"
                  v-show="cleanedISBNData.authors.length > 1"
                />
                <i
                  class="fas fa-plus-circle"
                  @click="addAutor()"
                  v-show="i == cleanedISBNData.authors.length - 1"
                />
                <i class="handle fas fa-arrows-alt" style="margin-left: 10px" />
              </span>
            </md-field>
          </div>
        </div>
      </div>
      <!-- ENDE Autoren/innen -->
    </div>
    <!-- JSON-Output
    <div v-if="loading === false">
      <br /><br /><br /><br />
      {{ rawISBNData }}
    </div>
    -->
  </div>
</template>

<script>
import axios from "axios";
import AutorSelectionPopUp from "./AutorSelectionPopUp";
import { v4 as uuidv4 } from "uuid";

export default {
  props: ["moduleUri"],
  name: "literatureISBN",
  components: {
    AutorSelectionPopUp,
  },
  data() {
    return {
      isbn: "978-1-83867-495-3",
      rawISBNData: [],
      loading: null,
      apiError: null,
      opacLink: "",
      showPopUp: false,
      authorIndexPopUp: 0,
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
    };
  },
  computed: {
    // Clean up API response
    // authors part, simplify structure
    cleanedISBNData() {
      if (this.rawISBNData.length < 1) return {};
      let data = JSON.parse(JSON.stringify(this.rawISBNData));
      let cleanedData = {};
      let authors = [];
      for (let author of data.items[0].volumeInfo.authors) {
        let authorObject = {};
        let nameParts = author.split(" ");
        authorObject.given = nameParts[0];
        nameParts.shift();
        authorObject.family = nameParts.join(" ");
        authorObject.url = "";
        authorObject.uri = "";
        authors.push(authorObject);
      }
      delete data.items[0].volumeInfo.authors;
      data.items[0].volumeInfo.authors = authors;

      if (data.items[0].volumeInfo.subtitle.length > 1 ) {
        let title = data.items[0].volumeInfo.title+" - "+data.items[0].volumeInfo.subtitle;
        data.items[0].volumeInfo.title = title;
      }
      data.items[0].volumeInfo.publisherUri = "";
      data.items[0].volumeInfo.literatureUri = "";
      data.items[0].volumeInfo.industryIdentifiers = this.isbn;


      cleanedData = data.items[0].volumeInfo;

      
      
      return cleanedData;
    },
  },
  methods: {
    addAutor() {
      this.cleanedISBNData.authors.push({ family: "", given: "", url: "" });
      this.$forceUpdate();
    },
    removeAutor(index) {
      this.cleanedISBNData.authors.splice(index, 1);
      this.$forceUpdate();
    },
    autorDuplicationCheck(index) {
      let autor = this.cleanedISBNData.authors[index];
      if (this.demoExistingAutor.length < 1) return;
      if (
        autor.given.length > 0 &&
        autor.family.length > 0 &&
        autor.url.length > 0
      ) {
        console.log(index);
        this.authorIndexPopUp = index;
        this.showPopUp = true;
      }
    },
    handleAutorSelection(result) {
      if (result.autor.vorname.length > 0) {
        console.log(result);
        this.cleanedISBNData.authors[result.index].given = result.autor.vorname;
        this.cleanedISBNData.authors[result.index].family = result.autor.nachname;
        this.cleanedISBNData.authors[result.index].url = result.autor.url;
        this.$forceUpdate();
      }
    },
    // Query literature data from Google Books API
    queryISBNData() {
      this.loading = true;
      this.apiError = null;
      axios
        .get("https://www.googleapis.com/books/v1/volumes?q=" + this.isbn, {
          headers: {
            Accept: "application/json",
          },
          crossdomain: true,
        })
        .then((response) => {
          this.rawISBNData = response.data;
          this.loading = false;
          this.generateQuery();
        })
        .catch((e) => {
          if (e.toString().includes("504")) {
            this.apiError = "Error: API antwortet nicht. (Code 504)";
          } else if (e.toString().includes("404")) {
            this.apiError = "Error: Fehlerhafte Eingabe.";
          } else {
            this.apiError = e;
          }
          this.loading = null;
        });
    },
    // Query für fuseki
    generateQuery() {
      let query = ""; //let query = this.prefixes; // wird in LiteratureForm hinzugefügt

      // Generate Literature URI
      if (this.cleanedISBNData.industryIdentifiers.length > 0) {
        this.cleanedISBNData.industryIdentifiers = "<http://isbn-international.org/" + this.isbn + ">";
      } else {
        this.cleanedISBNData.industryIdentifiers =
          "<https://th-brandenburg.de/literatur/" + uuidv4() + ">";
      }

      // Generate Autoren URIs
      console.log(this.cleanedISBNData.authors);
      for (let autor of this.cleanedISBNData.authors) {
        // if (autor.autorProfilLinkNeu.inclued('orcid.org')) -> Dann Orcid als URI
        if (autor.uri.length < 1) {autor.uri = "<https://th-brandenburg.de/autor/" + uuidv4() + ">";}
      }

      // Generate Pulisher URIs (Herausgeber/ Verlag) 
      if (this.cleanedISBNData.publisher.length > 0) {
          this.cleanedISBNData.publisherUri = "<https://th-brandenburg.de/publisher/" + uuidv4() + ">";
          console.log(this.cleanedISBNData.publisherUri);
      }
      // generate 
      if (this.cleanedISBNData.title.length > 0) {
        //query += " INSERT { "; //wird in LiteratureForm hinzugefügt
        //query += "module:GPMO "; //Nur zum Test
        query += "  <" + this.moduleUri + "> ";
        query += "schema:citation " + this.cleanedISBNData.industryIdentifiers + " . ";

        
        query += this.cleanedISBNData.industryIdentifiers + " a schema:Book ; ";

        if (this.isbn.length > 0) {
          query += 'schema:isbn "' + this.isbn + '"; ';
        }
        if (this.cleanedISBNData.publisher.length > 0) {
          // Referenz zur Pulisher URIs erzeugen (Herausgeber/ Verlag) 
          query += "schema:publisher " + this.cleanedISBNData.publisherUri + "; ";
        }
        if (this.cleanedISBNData.publishedDate.length > 0) {
          query +=
            'schema:datePublished "' + this.cleanedISBNData.publishedDate + '"; ';
        }
        if (this.cleanedISBNData.contentVersion.length > 0) {
          query += 'schema:bookEdition "' + this.cleanedISBNData.contentVersion + '"; ';
        }
        if (this.cleanedISBNData.infoLink != this.opacLink || this.cleanedISBNData.infoLink.length > 0) {
          query += 'schema:url "' + this.cleanedISBNData.infoLink + '"; ';
        }
        //Referenz zu den Autoren in Lit erzeugen
        if (
          this.cleanedISBNData.authors.every((autor) => autor.family.length > 0)
        ) {
          query += "schema:author ";
          for (let autor of this.cleanedISBNData.authors) {
            query += autor.uri + " , ";
          }
          query = query.slice(0, query.length - 3);
          query += " ; ";
        }
        
        //Titel
        query += 'schema:headline "' + this.cleanedISBNData.title + '". ';

        //Autoren/innen
        if (this.cleanedISBNData.authors.every((autor) => autor.family.length > 0)) {
          for (let autor of this.cleanedISBNData.authors) {
            query += autor.uri + " a module:Author ; ";

            if (autor.family != "") {
              query += 'schema:familyName "' + autor.family + '"; ';
            }
            if (autor.given != "") {
              query += 'schema:givenName "' + autor.given + '"; ';
            }

            query += 'schema:sameAs "' + autor.url + '". ';
          }
        }
        
        //Herausgeber/ Verlag
        if (this.cleanedISBNData.publisher.length > 0) {
            // Generate Pulisher URIs (Herausgeber/ Verlag) 
            query += this.cleanedISBNData.publisherUri + ' a schema:Organization ; ';
            query += 'schema:legalName "' + this.cleanedISBNData.publisher + '". ';
        }

      }

      //Log
      console.log("literatureISBN");
      console.log(query);
      this.updateQuery = query;

      // Let Literature.vue know of changes
      this.$emit("queryChanged", query);
    },
  },
  watch: {
    cleanedISBNData(data) {
      if (this.opacLink.length < 1 || this.opacLink.substring(this.opacLink.length - this.isbn.length) != this.isbn) {
        axios
          .get("https://opac.th-brandenburg.de/search?isbn=" + this.isbn, {
            headers: {
              Accept: "text/html",
            },
            crossdomain: true,
          })
          .then((response) => {
            if (response.data.includes("in die Merkliste")) {
              console.log(
                "https://opac.th-brandenburg.de/search?isbn=" + this.isbn
              );
              data.infoLink = "https://opac.th-brandenburg.de/search?isbn=" + this.isbn;
              this.opacLink = data.infoLink;
              this.cleanedISBNData = data;
              this.$forceUpdate();
              this.generateQuery();
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        console.log(false);
      }
    }
  }
};
</script>
<style scoped>
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;
  margin-top: 5vh;
  margin-bottom: 10vh;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid rgb(255, 143, 0);
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
