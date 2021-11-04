<template>
  <div class="wrapper">
    <BrowsingHeader />
    <div class="main main-raised">
      <div style="text-align: center; margin-bottom:10px; padding-top: 3em">
        <h3>
          <b>Hier wird die weiterführende Optionen Navigation mit Wissengraph angeboten.</b>
        </h3>
      </div>      
    </div>
  </div>  
</template>

<script>
import BrowsingHeader from '@/views/components/BrowsingHeader.vue'

export default {
    components: {
      BrowsingHeader
    }
}
</script>