<template>
  <Frame>
    <Page>
      <ActionBar title="Select Measurable Type" />
      <StackLayout backgroundColor="#3c495e">
        <ListPicker :items="typeList" v-model="type" style.Color='white' />
        <Button text='Add' @tap='addAndClose'/>
      </StackLayout>
    </Page>
  </Frame>
</template>

<script>
export default {
  data(){
    return {
      type: '',
      typeList: ['Yes/No', '%', 'KG', '$', 'Time'],
    }
  },
  methods: {
    addAndClose(){
      this.$modal.close(this.typeList[this.type])
    }
  }
}
</script>

<style>

</style>
