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
        <label>Lehr und Lernmethoden</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>

    <div class="md-layout-item">
        <md-field>
        <label>Weitere Lehr- und Lernmethoden.</label>
        <md-textarea v-model="type"></md-textarea>
        </md-field>
    </div>

    <div class="md-layout-item">
        <md-field>
        <label>Anzahl Workload-Komponenten</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>

    <div class="md-layout-item">
        <md-field>
        <label>Workload Komponente</label>
        <md-input v-model="type"></md-input>
        </md-field>
    </div>
</div>
<div>
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