<template>
<div>
<div class="md-layout md-gutter">
<div class="md-layout-item">
      <md-field>
        <label>Modulkürzel</label>
        <md-input
          v-model="modKuerzel"
          name="modKuerzel"
          id="modKuerzel"
          md-dense disabled>
        </md-input>
      </md-field>
    </div>

    <div class="md-layout-item">
        <md-field>
        <label>Anzahl Lernergebnisse</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>

    <div class="md-layout-item">
        <md-field>
        <label>Lernergebnis Nr.</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>

    <div class="md-layout-item">
        <md-field>
        <label>Anzahl Inhaltselemente</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>

    <div class="md-layout-item">
        <md-field>
        <label>Art Inhaltselement</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>

    <div class="md-layout-item">
        <md-field>
        <label>Anzahl Prüfungsvorleistungen</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>

    <div class="md-layout-item">
        <md-field>
        <label>Art Prüfungsvorleistung</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>

    <div class="md-layout-item">
        <md-field>
        <label>Anzahl Prüfungsleistungen</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>

    <div class="md-layout-item">
        <md-field>
        <label>Art Prüfungsleistung</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>

    <div class="md-layout-item">
      <md-field class="xs">
        <label>Bloomsche Taxonomie</label>
        <md-select
          v-model="modType"
          name="modulType"
          id="modulType"
          md-dense>
          <md-option>erschaffen</md-option>
          <md-option>evaluieren</md-option>
          <md-option>analysieren</md-option>
          <md-option>anwenden</md-option>
          <md-option>verstehen</md-option>
          <md-option>erinnern</md-option>
        </md-select>
      </md-field>
    </div>
</div>
<div class="md-layout md-gutter">
<div class="md-layout-item">
    <div class="col-md-12">
    <md-button type="primary">Speichern</md-button>
    <md-button type="secondary">Download</md-button>   
    <p>Message is: {{ selected }}</p>
    </div>
        </div>

</div>
</div>
</template>
<script>
export default {
    
    data() {
        return{
            selected:""
        }
    }

}


</script>