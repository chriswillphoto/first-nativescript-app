<template>
  <Frame>
    <Page>
      <ActionBar title="Select Measurable Type" />
      <!-- <StackLayout backgroundColor="#3c495e">
        <ListPicker :items="typeList" v-model="type" style.Color='white' />
        <Button text='Add' @tap='addAndClose'/>
      </StackLayout> -->
      <StackLayout backgroundColor="#3c495e">
      <FlexboxLayout alignItems='flex-start' flexWrap='wrap' justifyContent='flex-start'>
        <Button :class='index == active ? "active" : ""' class='type-button' :key='index+item' v-for='(item, index) in typeList' :text="item" width='80px' height='80px' @tap='changeType(item, index)' />
      </FlexboxLayout>
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
      active: null
    }
  },
  methods: {
    changeType(item, index){
      this.active = index
      this.type = item
      console.log(this.classes)
    },
    addAndClose(){
      this.$modal.close(this.type)
    }
  }
}
</script>

<style>
  .type-button {
    width: 80px;
    height: 80px;
    text-align: center;
    vertical-align: center;
    outline: 2px solid black;
    background-color: red;
  }

  .type-button.active {
    background-color: pink;
  }

</style>
