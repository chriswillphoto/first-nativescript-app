<template>
  <Page>
    <ActionBar id=2 :title="title">
      <NavigationButton text="Cancel" android.systemIcon="ic_menu_close_clear_cancel" @tap="$navigateTo(Home)" />
      <ActionItem android.systemIcon='ic_menu_edit' ios.systemIcon='3' @tap='edit' />
      <ActionItem android.systemIcon='ic_menu_delete' ios.systemIcon='3' @tap='deletePrompt' />
    </ActionBar>
    <DockLayout stretchLastChild='true' style.backgroundColor='rgb(235,235,235)'>
      <Button text='addNew' @tap='measurableModal' dock='bottom' />
      <ListView for='(item, index) in measurables' style.backgroundColor='white' @itemTap='toDetail'>
        <v-template>
        <Label class='message' textWrap='true'>
          <FormattedString>
            <Span :text='item.title + "\n"' style='display: block;' />
            <Span :text='item.type + "\n"' style='font-size: 12px;' />
            <Span :text='item.frequency' style='font-size: 12px;' />
          </FormattedString>
        </Label>
        </v-template>
      </ListView>
    </DockLayout>
  </Page>
</template>

<script>
import Home from '~/components/App.vue'
import Modal from '~/components/modals/AddMeasurable.vue'
import Edit from '~/components/modals/AddNewTrackableGroup.vue'
import List from '~/components/MeasurablesDetail.vue'
export default {
  data() {
    return {
      Home: Home,
      Modal: Modal,
      Edit: Edit,
      List: List
    }
  },
  computed: {
    measurables() {
      return this.$store.state.measurables[this.trackableID]
    },
    title(){
      var title = this.$store.state.trackableLookup[this.trackableID]["title"]

      return title ? title :  "Deleted"
    }
  },
  props: ['trackableID'],
  methods: {
    deletePrompt(){
      confirm({
        title: "Delete Trackable?",
        message: "This will permanently delete this trackable group and all associated data",
        okButtonText: "Delete",
        cancelButtonText: "Cancel"
      }).then(result => {
        if(result == true) { this.$store.dispatch('deleteTrackable', this.trackableID); this.$navigateTo(Home) }
      });
    },
    edit(){
      this.$showModal(this.Edit, {props: {editType: "Edit", title: this.title, trackableID: this.trackableID}})
    },
    measurableModal(){
      this.$showModal(this.Modal, {props: {id: this.trackableID}})
    },
    toDetail(event){
      this.$navigateTo(List, {
        transition: {},
        transitioniOS: {},
        transitionAndroid: {},

        props: {
          title: event.item.title,
          measurableID: event.item.id,
          trackableID: event.item.trackable_id
        }
      })
    }
  }
}
</script>

<style scoped>
  ActionBar {
      background-color: #53ba82;
      color: #ffffff;
  }
</style>
