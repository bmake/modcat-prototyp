    <template>
    <div>
        <div class="md-layout-item" v-for="(input,f) in this.inputs" v-bind:key="f">
        <md-field>
        <label>Hinzufügen</label>
        <md-input v-model="input.name"></md-input>
            <span>
                <i class="fas fa-minus-circle" @click="remove(f)" v-show="f || ( !f && inputs.length > 1)"></i>
                <i class="fas fa-plus-circle" @click="add(f)" v-show="f == inputs.length-1"></i>
            </span>
        </md-field>
    </div>
        <p>{{this.inputs}}</p>
    </div>
</template>

<script>
export default {
    props: ['moduleInfo'],
    data() {
        return{
            inputs: [
                {
                    name: ''
                }
            ]
        }
    },
    methods: {
        add(index) {
            this.inputs.push({ name: '' });
        },
        remove(index) {
            this.inputs.splice(index, 1);
        }
    }

}

</script>

<style>

  .form-control {
      margin-bottom: 10px;
  }
​
    .form-check{
        margin-bottom: 10px;
    }
​
    .form-check-label{
        margin-right: 28px;
        margin-left: 10px;
    }

</style>