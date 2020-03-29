<template>
<div>
    <div style="text-align:left; font-size:26px;"><b>Inhalte und Leistungen</b></div>
<div>
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
</div>

<div class="md-layout md-gutter">
    <div class="md-layout-item md-size-50">
        <md-field>
        <label>Anzahl Lernergebnisse</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>

    <div class="md-layout-item md-size-50" v-for="(input,i) in inputs1" :key="i">
        <md-field>
        <label>Art Lernergebnis</label>
        <md-input v-model="input.name"></md-input>
            <span>
                <i class="fas fa-minus-circle" @click="remove(i)" v-show="i || ( !i && inputs1.length > 1)"></i>
                <i class="fas fa-plus-circle" @click="add(i)" v-show="i == inputs1.length-1"></i>
            </span>
        </md-field>
    </div>
</div>

<div class="md-layout md-gutter">
    <div class="md-layout-item md-size-50">
        <md-field>
        <label>Anzahl Inhaltselemente</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>

    <div class="md-layout-item md-size-50" v-for="(input,i) in inputs2" :key="i">
        <md-field>
        <label>Art Inhaltselement</label>
        <md-input v-model="input.name"></md-input>
            <span>
                <i class="fas fa-minus-circle" @click="remove(i)" v-show="i || ( !i && inputs2.length > 1)"></i>
                <i class="fas fa-plus-circle" @click="add(i)" v-show="i == inputs2.length-1"></i>
            </span>
        </md-field>
    </div>
</div>

<div class="md-layout md-gutter">
    <div class="md-layout-item md-size-50">
        <md-field>
        <label>Anzahl Prüfungsvorleistungen</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>

    <div class="md-layout-item md-size-50" v-for="(input,i) in inputs2" :key="i">
        <md-field>
        <label>Art Prüfungsvorleistungen</label>
        <md-input v-model="input.name"></md-input>
            <span>
                <i class="fas fa-minus-circle" @click="remove(i)" v-show="i || ( !i && inputs2.length > 1)"></i>
                <i class="fas fa-plus-circle" @click="add(i)" v-show="i == inputs2.length-1"></i>
            </span>
        </md-field>
    </div>
</div>

<div class="md-layout md-gutter">
    <div class="md-layout-item md-size-50">
        <md-field>
        <label>Anzahl Prüfungsleistungen</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>

    <div class="md-layout-item md-size-50" v-for="(input,i) in inputs2" :key="i">
        <md-field>
        <label>Art Prüfungsvorleistungen</label>
        <md-input v-model="input.name"></md-input>
            <span>
                <i class="fas fa-minus-circle" @click="remove(i)" v-show="i || ( !i && inputs2.length > 1)"></i>
                <i class="fas fa-plus-circle" @click="add(i)" v-show="i == inputs2.length-1"></i>
            </span>
        </md-field>
    </div>
</div>

<div class="md-layout md-gutter">
    <div class="md-layout-item md-size-100">
      <md-field>
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
</div>
<div class="md-layout md-gutter">
<div class="md-layout-item">
    <div>
    <md-button type="primary">Speichern</md-button>
    <md-button type="secondary">Download</md-button>   
    <p>Message is: {{ selected }}</p>
    </div>
        </div>

</div>
</div>
</template>
<script>

    import FormDynamic from "./FormDynamic";


export default {
    lol: {
    FormDynamic,
  },
    data() {
        return{
            selected:"",
            inputs1: [
                {
                    name: ''
                }
            ],
            inputs2: [
                {
                    name: ''
                }
            ]
        }
    },
    methods: {
        add(index) {
            this.inputs1.push({ name: '' });
        },
        remove(index) {
            this.inputs1.splice(index, 1);
        
    }

}
}

</script>