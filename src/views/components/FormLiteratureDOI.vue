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

    <!-- Ausgabe der Daten in Formular (DEMO) -->
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
            <div class="md-layout-item md-size-15">
              <md-field>
                <label>Band</label>
                <md-input v-model="cleanedDoiData.article.volume" />
              </md-field>
            </div>
            <!-- Jahr -->
            <div class="md-layout-item md-size-15">
              <md-field>
                <label>Band</label>
                <md-input v-model="cleanedDoiData.article.publishYear" />
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
            <md-input v-model="cleanedDoiData.article.publishYear" />
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
            <md-input v-model="cleanedDoiData.book.publishYear" />
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
        <div v-for="author in rawDoiData.author" :key="author">
          <div class="md-layout md-gutter">
            <!-- Nachname -->
            <div class="md-layout-item md-size-50">
              <md-field>
                <label>Nachname</label>
                <md-input v-model="author.family" disabled />
              </md-field>
            </div>
            <!-- Vorname -->
            <div class="md-layout-item md-size-50">
              <md-field>
                <label>Vorname</label>
                <md-input v-model="author.given" />
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
import axios from "axios";

export default {
  name: "literatureDOI",
  data() {
    return {
      doi: "https://doi.org/10.1257/jep.29.2.213",
      rawDoiData: {},
      loading: null,
      apiError: null,
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
          publishYear: "",
          pageStart: "",
          pageEnd: "",
        },
        book: {
          isbn: "",
          publisher: "",
          volume: "",
        },
        url: "",
        uri: "",
      };
      if (this.rawDoiData.length < 1) return filteredResponse;
      // Map values
      if (this.rawDoiData.type == "article-journal") {
        filteredResponse.article.containerTitle = this.rawDoiData[
          "container-title"
        ];
        filteredResponse.article.publisher = this.rawDoiData["publisher"];
        filteredResponse.article.volume = this.rawDoiData["volume"];
        filteredResponse.article.publishYear = this.rawDoiData[
          "published-print"
        ]["date-parts"][0][0];
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
        if (this.rawDoiData["link"][0]["content-type"] == "application/pdf") {
          filteredResponse.url = this.rawDoiData["link"][0]["URL"];
        }
      }
      filteredResponse.uri = this.doi;

      return filteredResponse;
    },
  },
  methods: {
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
  },
  watch: {
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
