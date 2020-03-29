<template>
<div>
<div style="text-align:left; font-size:26px;"><b>Rahmendaten zum Modul</b></div>

<div class="md-layout md-gutter">
<div class="md-layout-item md-size-33">
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

<div class="md-layout-item md-size-100">
    <md-field>
      <label>Modulbezeichnung</label>
      <md-input v-model="initial"></md-input>
    </md-field>
</div>

  <div class="md-layout-item">
      <md-field>
        <label>SPO</label>
        <md-select v-model="spo" name="spo" id="spo" md-dense>
          <md-option
            v-if="Object.keys(moduleList).length > 0"
            v-for="(modulejson, index) in moduleList"
            v-bind:value="modulejson.module.value"
            v-bind:key="index"
          >
            {{ modulejson.label.value }}
          </md-option>
        </md-select>
      </md-field>
    </div>


  <div class="md-layout-item">
      <md-field class="xs">
        <label>Modultyp</label>
        <md-select
          v-model="modType"
          name="modulType"
          id="modulType"
          md-dense>
          <md-option>Pflichtmodul</md-option>
          <md-option>Wahlpflichtmodul</md-option>
          <md-option>Transfermodul</md-option>
        </md-select>
      </md-field>
    </div>
    <div class="md-layout-item">
        <md-field>
        <label>Notengewichtung</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>
    <div class="md-layout-item">
        <md-field>
        <label>Lehrveranstaltungen</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>
    <div class="md-layout-item">
        <md-field>
        <label>Verwendbarkeit</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>
    <div class="md-layout-item">
        <md-field>
        <label>SWS</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>
    <div class="md-layout-item">
        <md-field>
        <label>ECTS</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>
    <div class="md-layout-item">
        <md-field>
        <label>Semester</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>
    <div class="md-layout-item md-size-33">
      <md-field class="xs">
        <label>Häufigkeit</label>
        <md-select
          v-model="modType"
          name="modulType"
          id="modulType"
          md-dense>
          <md-option>WiSe</md-option>
          <md-option>SoSe</md-option>
          <md-option>jedes Semester</md-option>
          <md-option>alle 2 Jahre</md-option>
        </md-select>
      </md-field>
    </div>
        
    <div class="md-layout-item md-size-66">
        <md-field>
        <label>Voraussetzungen</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>
    <div class="md-layout-item">
        <md-field>
        <label>Website</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>



    <div class="md-layout-item md-size-100">
        <md-field>
        <label>Beschreibung und Kommentare zum Modul</label>
        <md-textarea v-model="aboutme"></md-textarea>
        </md-field>
        </div>

<div class="md-layout-item md-size-100" style="text-align:left;">
    <span style="font-size:14px; color:#2e2e2e; font-family:arial;"><br>Lehrsprachen: <br></span>
    <md-checkbox v-model="array" value="deutsch" style="margin-left:10px;">deutsch</md-checkbox>
    <md-checkbox v-model="array" value="englisch">englisch</md-checkbox>
  </div>

        <div class="md-layout md-gutter">
<div class="md-layout-item">
    <div>
    <md-button type="primary">Speichern</md-button>
    <md-button type="secondary">Download</md-button>   
    <p>Message is: {{ selected }}</p>
    <span>Checked names: {{ array }}</span>
    </div>
        </div>


   
</div>
</div>
</div>
</template>

<script>

export default {
    props: ['modBasis'],
    name: 'RegularCheckboxes',
    data: () => ({
      array: [],
    })
  }

</script>