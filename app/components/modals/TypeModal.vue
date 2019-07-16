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
        <Button :class='index == active ? "active" : ""' class='type-select-button' :key='index+item' v-for='(item, index) in typeList' :text="item" width='80px' height='80px' @tap='changeType(item, index)' />
      </FlexboxLayout>
      <Button text='Add' @tap='addAndClose'/>
      </StackLayout>
    </Page>
  </Frame>
</template>

<script>
import {measurableTypes} from '~/utils.js'

export default {
  props: [
    'selected'
  ],
  data(){
    return {
      type: '',
      typeList: measurableTypes,
      active: null
    }
  },
  methods: {
    changeType(item, index){
      this.active = index
      this.type = item
    },
    addAndClose(){
      this.$modal.close(this.type)
    }
  },
  beforeMount(){
    this.active = this.typeList.indexOf(this.selected)
  }
}
</script>

<style>
  .type-select-button {
    width: 80px;
    height: 80px;
    text-align: center;
    vertical-align: center;
    outline: 2px solid black;
    background-color: red;
  }

  .type-select-button.active {
    background-color: pink;
  }

</style>
