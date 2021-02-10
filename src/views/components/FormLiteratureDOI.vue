<template>
  <div>
    <!-- Eingabe der DOI -->
    <div>
      <div class="md-layout-item md-size-100">
        <md-field>
          <label>DOI</label>
          <md-input v-model="doi" @keyup.enter="queryDoiData" />
        </md-field>
      </div>
      <md-button class="md-layout-item md-warning" @click="queryDoiData">
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
    <br />

    <!-- Ausgabe der Daten -->
    <div class="md-layout-item md-size-100" v-if="loading === false">
      <!-- Titel -->
      <div class="md-size-100">
        <md-field>
          <label>Titel</label>
          <md-input v-model="cleanedDoiData.title" />
        </md-field>
      </div>

      <!-- Artikel -->
      <div v-if="cleanedDoiData.type == 'article-journal'">
        <!-- Erschienen In -->
        <div class="md-size-100">
          <p style="text-align: left">Erschienen in</p>
          <div class="md-layout md-gutter">
            <!-- Titel -->
            <div class="md-layout-item md-size-70">
              <md-field>
                <label>Titel</label>
                <md-input
                  style="text-overflow:clip"
                  v-model="cleanedDoiData.article.containerTitle"
                />
              </md-field>
            </div>
            <!-- Band -->
            <div class="md-layout-item md-size-10">
              <md-field>
                <label>Band</label>
                <md-input v-model="cleanedDoiData.article.volume" />
              </md-field>
            </div>
            <!-- Jahr -->
            <div class="md-layout-item md-size-20">
              <md-field>
                <label>Veröffentlichung</label>
                <md-input v-model="cleanedDoiData.article.publishDate" />
              </md-field>
            </div>
          </div>
        </div>
        <!-- Herausgeber -->
        <div class="md-size-100">
          <md-field>
            <label>Herausgeber</label>
            <md-input v-model="cleanedDoiData.article.publisher" />
          </md-field>
        </div>
        <!-- Veröffentlichung -->
        <div class="md-size-100">
          <md-field>
            <label>Veröffentlichung</label>
            <md-input v-model="cleanedDoiData.article.publishDate" />
          </md-field>
        </div>
        <!-- Seiten -->
        <div class="md-size-100">
          <div class="md-layout md-gutter">
            <!-- Start -->
            <div class="md-layout-item md-size-50">
              <md-field>
                <label>Seiten von</label>
                <md-input
                  style="text-overflow:clip"
                  v-model="cleanedDoiData.article.pageStart"
                />
              </md-field>
            </div>
            <!-- Ende -->
            <div class="md-layout-item md-size-50">
              <md-field>
                <label>Seiten bis</label>
                <md-input v-model="cleanedDoiData.article.pageEnd" />
              </md-field>
            </div>
          </div>
        </div>
      </div>

      <!-- Buch -->
      <div v-if="cleanedDoiData.type == 'book'">
        <!-- ISBN -->
        <div class="md-size-100">
          <md-field>
            <label>ISBN</label>
            <md-input v-model="cleanedDoiData.book.isbn" />
          </md-field>
        </div>
        <!-- Herausgeber -->
        <div class="md-size-100">
          <md-field>
            <label>Herausgeber</label>
            <md-input v-model="cleanedDoiData.book.publisher" />
          </md-field>
        </div>
        <!-- Veröffentlichung -->
        <div class="md-size-100">
          <md-field>
            <label>Veröffentlichung</label>
            <md-input v-model="cleanedDoiData.book.publishDate" />
          </md-field>
        </div>
        <!-- Herausgeber -->
        <div class="md-size-100">
          <md-field>
            <label>Auflage</label>
            <md-input v-model="cleanedDoiData.book.volume" />
          </md-field>
        </div>
      </div>

      <!-- URL -->
      <div class="md-size-100">
        <md-field>
          <label>URL</label>
          <md-input v-model="cleanedDoiData.url" />
        </md-field>
      </div>
      <!-- DOI -->
      <div class="md-size-100">
        <md-field>
          <label>DOI</label>
          <md-input v-model="cleanedDoiData.uri" />
        </md-field>
      </div>

      <!-- Autoren -->
      <div class="md-size-100">
        <label>Autoren/innen</label>
        <div v-for="(autor, index) in cleanedDoiData.authors" :key="autor">
          <div class="md-layout md-gutter">
            <!-- Nachname -->
            <div class="md-layout-item md-size-20">
              <md-field>
                <label>Nachname</label>
                <md-input v-model="autor.family" />
              </md-field>
            </div>
            <!-- Vorname -->
            <div class="md-layout-item md-size-20">
              <md-field>
                <label>Vorname</label>
                <md-input v-model="autor.given" />
              </md-field>
            </div>
            <!-- URL/ Profil-Link -->
            <div class="md-layout-item md-size-60">
              <md-field>
                <label>Profil-Link/URL*</label>
                <md-input v-model="autor.url" @change="checkAutor(index)" />
                <AutorSelectionPopUp
                  v-if="showPopUp"
                  @close="showPopUp = false"
                  @duplicateChecked="handleAutorSelection"
                  :existingAuthors="existingAuthors"
                  :autorIndex="authorIndexPopUp"
                >
                </AutorSelectionPopUp>
                <!-- Plus, Minus, Verschieben-Symbole -->
                <span>
                  <i
                    class="fas fa-minus-circle"
                    @click="removeAutor(index)"
                    v-show="cleanedDoiData.authors.length > 1"
                  />
                  <i
                    class="fas fa-plus-circle"
                    @click="addAutor()"
                    v-show="index == cleanedDoiData.authors.length - 1"
                  />
                </span>
              </md-field>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- JSON-Output 
    <div v-if="loading === false">
      <br /><br /><br /><br />
      {{ rawDoiData }}
    </div>
    -->
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import AutorSelectionPopUp from "./AutorSelectionPopUp";

export default {
  name: "literatureDOI",
  components: {
    AutorSelectionPopUp,
  },
  data() {
    return {
      doi: "https://doi.org/10.1257/jep.29.2.213",
      prefixes:
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
        "PREFIX module: <https://bmake.th-brandenburg.de/module/> " +
        "PREFIX schema: <https://schema.org/>  ",
      rawDoiData: {},
      loading: null,
      apiError: null,
      showPopUp: false,
      authorIndexPopUp: 0,
      existingAuthors: [],
    };
  },
  computed: {
    // Restructure API result due to changing keys depending on DOI
    cleanedDoiData() {
      // Prepare object
      let filteredResponse = {
        type: this.rawDoiData.type,
        title: this.rawDoiData.title,
        article: {
          containerTitle: "",
          publisher: "",
          volume: "",
          publishDate: "",
          pageStart: "",
          pageEnd: "",
        },
        book: {
          isbn: "",
          publisher: "",
          publishDate: "",
          volume: "",
        },
        authors: [],
        url: "",
        uri: "",
      };
      if (this.rawDoiData.length < 1) return filteredResponse;
      // Map values
      // Literature Data
      if (this.rawDoiData.type == "article-journal") {
        filteredResponse.article.containerTitle = this.rawDoiData[
          "container-title"
        ];
        filteredResponse.article.publisher = this.rawDoiData["publisher"];
        filteredResponse.article.volume = this.rawDoiData["volume"];
        filteredResponse.article.publishDate = this.rawDoiData[
          "published-print"
        ]["date-parts"][0].join("-");
        let pages = this.rawDoiData["page"].split("-");
        filteredResponse.article.pageStart = pages[0];
        filteredResponse.article.pageEnd = pages[1];
      } else if (this.rawDoiData.type == "book") {
        filteredResponse.book.isbn = this.rawDoiData["isbn-type"][0].value;
        // Merge title and subtitle
        if (this.rawDoiData["subtitle"].length > 0) {
          filteredResponse.title =
            filteredResponse.title + " – " + this.rawDoiData["subtitle"];
        }
        filteredResponse.book.publisher = this.rawDoiData["publisher"];
        filteredResponse.book.publishDate = this.rawDoiData["published-print"][
          "date-parts"
        ][0].join("-");
        if (this.rawDoiData["link"][0]["content-type"] == "application/pdf") {
          filteredResponse.url = this.rawDoiData["link"][0]["URL"];
        }
      }
      filteredResponse.uri = this.doi;

      // Find author names
      let possibleAuthorObjects = ["author", "editor"];
      for (const [i, object] of possibleAuthorObjects.entries()) {
        if (typeof this.rawDoiData[object] == "undefined") {
          possibleAuthorObjects.splice(i, 1);
        }
      }

      // Authors
      for (let author of this.rawDoiData[possibleAuthorObjects[0]]) {
        console.log(author);
        filteredResponse.authors.push({
          family: author.family,
          given: author.given,
          url: "",
          uri: "",
        });
      }

      return filteredResponse;
    },
  },
  methods: {
    addAutor() {
      this.cleanedDoiData.authors.push({ family: "", given: "", url: "" });
      this.$forceUpdate();
    },
    removeAutor(index) {
      this.cleanedDoiData.authors.splice(index, 1);
      this.$forceUpdate();

      //this.changedArray[input].push(index);
    },
    checkAutor(index) {
      let autor = this.cleanedDoiData.authors[index];

      // User has to input all values for an author
      if (
        autor.given.length < 1 ||
        autor.family.length < 1 ||
        autor.url.length < 1
      )
        return;

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

      queryAutor += " {?autorUri schema:sameAs '" + autor.url + "' } ";
      queryAutor += " UNION ";
      queryAutor += " { ?autorUri schema:familyName '" + autor.family + "' ; ";
      queryAutor += "             schema:givenName '" + autor.given + "' . } ";
      queryAutor += "  }";

      //Log
      console.log("checkAutorQuery");
      console.log(queryAutor);

      // Daten vom Fuseki abrufen
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
          let result = response.data.results.bindings;
          let formattedResult = [];
          for (let entry of result) {
            formattedResult.push({
              given: entry.autorVorname.value,
              family: entry.autorNachname.value,
              url: entry.autorProfilLink.value,
              uri: entry.autorUri.value,
            });
          }
          this.existingAuthors = formattedResult;
          this.authorIndexPopUp = index;
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    // Query literature data from doi.org API
    queryDoiData() {
      this.loading = true;
      this.apiError = null;
      axios
        .get(this.doi, {
          headers: {
            Accept: "application/vnd.citationstyles.csl+json",
          },
          crossdomain: true,
        })
        .then((response) => {
          this.rawDoiData = response.data;
          this.loading = false;
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
    autorDuplicationCheck(index) {
      let autor = this.cleanedDoiData.authors[index];
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
      if (result.autor.given.length > 0) {
        this.cleanedDoiData.authors[result.index].given = result.autor.given;
        this.cleanedDoiData.authors[result.index].family = result.autor.family;
        this.cleanedDoiData.authors[result.index].url = result.autor.url;
        this.cleanedDoiData.authors[result.index].uri = result.autor.uri;
      }
    },
  },
  watch: {
    existingAuthors() {
      if (this.existingAuthors.length < 1) return;
      this.showPopUp = true;
    },
    cleanedDoiData(data) {
      if (
        data.type == "book" &&
        data.book.isbn.length > 0 &&
        data.url.length < 1
      ) {
        axios
          .get("https://opac.th-brandenburg.de/search?isbn=" + data.book.isbn, {
            headers: {
              Accept: "text/html",
            },
            crossdomain: true,
          })
          .then((response) => {
            if (response.data.includes("in die Merkliste")) {
              console.log(
                "https://opac.th-brandenburg.de/search?isbn=" + data.book.isbn
              );
              data.url =
                "https://opac.th-brandenburg.de/search?isbn=" + data.book.isbn;
              this.cleanedDoiData = data;
              this.$forceUpdate();
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
  },
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
