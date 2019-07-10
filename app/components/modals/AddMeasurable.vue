<template>
  <Frame>
    <Page>
      <ActionBar :title="process">
        <NavigationButton text="Cancel" android.systemIcon="ic_menu_close_clear_cancel" @tap="$modal.close" />
      </ActionBar>
      <StackLayout backgroundColor="#3c495e" style.padding='16px'>
        <TextField v-model="measurableName" hint='Enter Measurable Name' style.placeholderColor='rgba(255,255,255,0.6)'/>
        <FlexboxLayout backgroundColor="#3c495e">
          <Label text='Select Measurable Type' width='80%' color='white' />
          <Label :text='type' width='20%' alignSelf='flex-end' textAlign='right' style='text-align: right;' color='white' @tap='changeType' />
        </FlexboxLayout>
        <FlexboxLayout backgroundColor="#3c495e">
          <Label text='Select frequency' />
          <Label :text='frequency' width='20%' alignSelf='flex-end' textAlign='right' style='text-align: right;' color='white' @tap='changeFrequency' />
        </FlexboxLayout>
        <Button text='Add' @tap='addAndClose'/>
      </StackLayout>
    </Page>
  </Frame>
</template>

<script>
import TypeModal from '~/components/modals/TypeModal.vue'
import FreqModal from '~/components/modals/FrequencyModal.vue'
export default {
  props: [
    'trackableID', 'oldType', 'oldFreq', 'measurableID', 'editType', 'oldName'
  ],
  data() {
    return {
      measurableName: this.oldName ? this.oldName : '',
      type: this.oldType ? this.oldType : 'Yes/No',
      frequency: this.oldFreq ? this.oldFreq : 'Daily',
      process: this.editType ? 'Edit' : 'New',
      TypeModal,
      FreqModal,
    }
  },
  methods: {
    addAndClose() {

      if(this.measurableName.trim().length){
        let measurableObj = {
          title: this.measurableName.trim(),
          type: this.type,
          frequency: this.frequency,
          trackable_id: this.trackableID,
        }

        if(this.process === 'New'){
          this.$store.dispatch('addMeasurable', measurableObj)
        }else{
          measurableObj.id = this.measurableID
          this.$store.dispatch('editMeasurable', measurableObj)
        }
        this.$modal.close()
      }
    },
    changeType() {
      this.$showModal(TypeModal, {fullscreen: true, props: {selected: this.type}}).then((newType) => {
        this.type = newType
      })
    },
    changeFrequency() {
      this.$showModal(FreqModal, {fullscreen: true, props: {selected: this.frequency}}).then((newFreq) => {
        this.frequency = newFreq
      })
    }
  }
}
</script>

<style>
/* TODO */
</style>
