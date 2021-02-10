<template>
  <div>
    <div>
      <p>Bitte geben Sie eine gültige ISBN ein</p>
      <md-input
        class="md-layout-item md-size-80"
        v-model="isbn"
        @keyup.enter="queryISBNData"
      />
      <button class="md-layout-item md-size-20" @click="queryISBNData">
        Laden
      </button>
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
    <div class="md-layout-item md-size-100" v-if="loading === false">
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
      <!-- Authoren -->
      <div class="md-size-100">
        <label>Autoren/innen</label>
        <div v-for="author in cleanedISBNData.authors" :key="author">
          <div class="md-layout md-gutter">
            <!-- Nachname -->
            <div class="md-layout-item md-size-50">
              <md-field>
                <label>Nachname</label>
                <md-input v-model="author.family" />
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
      {{ rawISBNData }}
    </div>
    -->
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "literatureISBN",
  data() {
    return {
      isbn: "978-1-83867-495-3",
      rawISBNData: [],
      loading: null,
      apiError: null,
      opacLink: "",
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
        authors.push(authorObject);
      }
      delete data.items[0].volumeInfo.authors;
      data.items[0].volumeInfo.authors = authors;

      if (data.items[0].volumeInfo.subtitle.length > 1 ) {
        let title = data.items[0].volumeInfo.title+" - "+data.items[0].volumeInfo.subtitle;
        data.items[0].volumeInfo.title = title;
      }
      
      cleanedData = data.items[0].volumeInfo;

      
      
      return cleanedData;
    },
  },
  methods: {
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
