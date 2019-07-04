<template>
  <Page>
    <ActionBar id=3 :title="activeMeasurable ? activeMeasurable.title : ''">
      <NavigationButton text="Cancel" android.systemIcon="ic_menu_close_clear_cancel" @tap="$navigateTo(Trackables, {props: {trackableID}})" />
      <ActionItem android.systemIcon='ic_menu_edit' ios.systemIcon='3' @tap='edit' />
      <ActionItem android.systemIcon='ic_menu_delete' ios.systemIcon='3' @tap='deletePrompt' />
    </ActionBar>
    <FlexboxLayout backgroundColor='pink' alignItems='flex-start'>
      <Label width='100%' :text='month.name' backgroundColor='skyblue' style.paddingTop='8px' style.paddingBottom='8px' style.textAlignment='center' />
    </FlexboxLayout>
  </Page>
</template>

<script>
import Trackables from '~/components/TrackablesDetail.vue'
import Edit from '~/components/modals/AddMeasurable.vue'
import {MonthLookup} from '~/utils.js'
export default {
  props: ['measurableID', 'trackableID'],
  data(){
    return {
      Trackables,
      Edit,
      selectedMonth: new Date(Date.now()).getMonth(),
    }
  },
  computed: {
    activeMeasurable() {
      let measurable = this.$store.state.measurables[this.trackableID].find((element) => {
        return element.id == this.measurableID
      })
      return measurable
    },
    month(){
      return MonthLookup[this.selectedMonth]
    }
  },
  methods: {
    deletePrompt(){
      confirm({
          title: "Delete Measurable?",
          message: "This will permanently delete this measurable and all associated data",
          okButtonText: "Delete",
          cancelButtonText: "Cancel"
        }).then(result => {
          if(result == true) {
            this.$store.dispatch('deleteMeasurable', {trackableID: this.trackableID, measurableID: this.measurableID})
            this.$navigateTo(Trackables, {props: {trackableID: this.trackableID}})
          }
        });
    },
    edit(){
      this.$showModal(this.Edit, {props: {editType: "Edit", measurableID: this.activeMeasurable.id, trackableID: this.activeMeasurable.trackable_id, oldFreq: this.activeMeasurable.frequency, oldType: this.activeMeasurable.type, oldName: this.activeMeasurable.title}})
    }
  },
  mounted(){
    var test = new Date(Date.now());
    console.log(test.getDay())
    console.log(this.activeMeasurable)
  }
}
</script>

<style>

</style>
