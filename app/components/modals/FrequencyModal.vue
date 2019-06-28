<template>
  <Frame>
    <Page>
      <ActionBar title="Select Measurable Type" />
      <StackLayout backgroundColor="#3c495e">
      <ListPicker :items='frequencyList' v-model='frequency' />
      <Button text='Select' @tap='addAndClose'/>
      </StackLayout>
    </Page>
  </Frame>
</template>

<script>
export default {
  props: [
    'selected'
  ],
  data() {
    return {
      frequencyList: ['Daily', 'Weekly', 'Fortnightly', 'Monthly'],
      frequency: 0
    }
  },
  methods: {
    addAndClose(){
      this.$modal.close(this.frequencyList[this.frequency])
    }
  },
  beforeMount(){
    this.frequency = this.frequencyList.indexOf(this.selected)
  }
}
</script>

<style>

</style>
