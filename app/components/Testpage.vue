<template>
  <Page>
    <Label text='Test Page' />
  </Page>
</template>

<script>
import {normalizeTrackable, normalizedMeasurable} from '~/utils.js'

export default {
  data() {
    test: []
  },
  methods: {
    fetchMeasurables(){
      this.$store.state.database.all('SELECT * FROM trackables', (err, resultSet) => {
        this.test = []
        if(err){
          console.error(err)
        }else{
          resultSet.forEach(element => {
            let normalized = normalizeTrackable(element)
            this.test.push(normalized)
          })
        }
      })
    },
    
  } //methods
}
</script>

<style>

</style>
