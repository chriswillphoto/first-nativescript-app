<template>
  <Page>
    <ActionBar id=3 :title="title">
      <NavigationButton text="Cancel" android.systemIcon="ic_menu_close_clear_cancel" @tap="$navigateTo(Trackables, {props: {trackableID}})" />
      <ActionItem android.systemIcon='ic_menu_edit' ios.systemIcon='3' @tap='edit' />
      <ActionItem android.systemIcon='ic_menu_delete' ios.systemIcon='3' @tap='deletePrompt' />
    </ActionBar>
    <ScrollView>
    <GridLayout rows='40, auto'>
      <SegmentedBar row='0' width='100%' height='20px' v-model='viewSelect' selectedIndex='2'>
        <SegmentedBarItem v-for='(item, index) in viewOptions' :title='item' :key='index' />
      </SegmentedBar>

      <FlexboxLayout row='1' backgroundColor='pink' justifyContent='space-around' alignContent='space-around' alignItems='center' flexWrap='wrap'  v-if='viewOptions[viewSelect] == "Monthly"'>
      <Label width='10%' text='left' style='padding-top: 8px; padding-bottom: 8px; text-align: center;' @tap='downMonth' />
      <Label width='80%' :text='month.name' backgroundColor='skyblue' style.paddingTop='8px' style.paddingBottom='8px' style.textAlignment='center' />
      <Label width='10%' text='right' style='padding-top: 8px; padding-bottom: 8px; text-align: center;' @tap='upMonth' />
      <Button class='type-button' :class='item.status' :key='index+item.status' v-for='(item, index) in days' :text="item.date.getDate()" width='14.3%' height='40px' @tap='toggle(item)' />
      </FlexboxLayout>

      <FlexboxLayout row='1' backgroundColor='pink' alignContent='stretch' alignItems='stretch' flexWrap='wrap'  v-else-if='viewOptions[viewSelect] == "Daily"'>
        <Label width='10%' text='left' style='padding-top: 8px; padding-bottom: 8px; text-align: center;' @tap='downMonth' />
        <Label width='80%' backgroundColor='skyblue' style.paddingTop='8px' style.paddingBottom='8px' style.textAlignment='center' height='100vh'>
          <FormattedString>
            <Span text='test' />
          </FormattedString>
        </Label>
        <Label width='10%' text='right' style='padding-top: 8px; padding-bottom: 8px; text-align: center;' @tap='upMonth' />
      </FlexboxLayout>
    </GridLayout>
    </ScrollView>
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
      selectedDay: new Date(Date.now()).getDate(),
      selectedYear: new Date(Date.now()).getFullYear(),
      viewSelect: 0,
      viewOptions: ['Monthly', 'Weekly', 'Daily']
    }
  },
  computed: {
    activeMeasurable() {
      let measurable = this.$store.state.measurablesLookup[this.measurableID]

      return measurable 
    },
    title(){
      var title = this.$store.state.measurablesLookup[this.measurableID]['title']
      return title ? title : ''
    },
    type(){
      let type = this.$store.state.measurablesLookup[this.measurableID]['type']
      return type ? type : ''
    },
    frequency(){
      var frequency = this.$store.state.measurablesLookup[this.measurableID]['frequency']
      return frequency ? frequency : ''
    },
    month(){
      return MonthLookup[this.selectedMonth]
    },
    days(){
      let numberOfDays = this.month.days
      let dayArray = []
      for(var i=1;i<=numberOfDays;i++){
        let dayObj = {}
        dayObj.date = new Date(this.selectedYear, this.selectedMonth, i)
        dayObj.status = 'inactive'
        if(this.monthDatapoints[new Date(dayObj.date).getDate()]){ dayObj.status = 'active' }
        dayArray.push(dayObj)
      }
      let dayZero = dayArray[0].date.getDay()
      let lastDay = dayArray[dayArray.length - 1].date.getDay()

      if(dayZero != 0){
        let prevMonthDay = MonthLookup[this.selectedMonth == 0 ? 11 : this.selectedMonth - 1].days
        for(var i = dayZero -1; i>=0; i--){
          let dayObj = {}
          dayObj.date = new Date(this.selectedYear, this.selectedMonth - 1, prevMonthDay) //TODO FIX FOR YEAR CHANGES
          dayObj.status = 'month-filler'
          prevMonthDay -= 1
          dayArray.unshift(dayObj)
        }
      }

      if(lastDay != 6){
        let nextMonthDay = 1
        for(var i = lastDay + 1; i <= 6; i++){
          let dayObj = {}
          dayObj.date = new Date(this.selectedYear, this.selectedMonth + 1, nextMonthDay) //TODO FIX FOR YEAR CHANGES
          dayObj.status = 'month-filler'
          nextMonthDay += 1
          dayArray.push(dayObj)
        }
      }
      // console.log('DAY', dayArray)
      return dayArray
    },
    monthDatapoints(){
      var datArrayObj = {}
      let datArray = this.$store.state.datapoints[this.measurableID]
      let filteredToMonth = datArray.filter((datapoint) => {
        let month = new Date(datapoint.timestamp).getMonth()
        return month == this.selectedMonth
      }).map((datapoint) => {
        datArrayObj[new Date(datapoint.timestamp).getDate()] = datapoint
      })

      return datArrayObj
    },
    viewRender(){

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
    },
    upMonth(){
      if(this.selectedMonth < 11){ this.selectedMonth += 1 }else{ this.selectedMonth = 0 }
      console.log(this.days)
    },
    downMonth(){
      if(this.selectedMonth > 0){ this.selectedMonth -= 1 }else{ this.selectedMonth = 11 }
    },
    toggle(item){
      if(this.type == 'Yes/No' && item.status != 'active'){
        this.$store.dispatch('addDatapoint', {
          measurable_id: this.measurableID,
          trackable_id: this.trackableID,
          value: 'Yes',
          timestamp: item.date.toString()
        }).then(() => {
          console.log("DONE")
        })
      }
    }
  },
  mounted(){
    var test = new Date(Date.now());
    
    console.log(test.getDay())
    // console.log(this.activeMeasurable)
  }
}
</script>

<style>
  .type-button.month-filler {
    background-color: lightslategray;
  }

  .type-button.inactive {
    background-color: white;
  }
</style>
