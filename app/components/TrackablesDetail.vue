<template>
  <Page>
    <ActionBar id=2 :title="title">
      <NavigationButton text="Cancel" android.systemIcon="ic_menu_close_clear_cancel" @tap="$navigateTo(Home)" />
      <ActionItem android.systemIcon='ic_menu_delete' ios.systemIcon='3' @tap='deletePrompt' />
    </ActionBar>
    <DockLayout stretchLastChild='true' style.backgroundColor='rgb(235,235,235)'>
      <Button text='addNew' @tap='measurableModal' dock='bottom' />
      <ListView for='(item, index) in measurables' style.backgroundColor='white' @itemTap='toDetail'>
        <v-template>
        <Label class='message' textWrap='true'>
          <FormattedString textWrap='true'>
            <Span :text='item.title + "\n"' style='display: block;' />
            <Span :text='index' style='font-size: 12px;' />
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
export default {
  data() {
    return {
      Home: Home,
      Modal: Modal
    }
  },
  computed: {
    measurables() {
      return this.$store.state.measurables[this.trackableID]
    }
  },
  props: ['trackableID', 'title'],
  methods: {
    deletePrompt(){
        confirm({
          title: "Delete Trackable?",
          message: "This will permanently delete this trackable group and all associated data",
          okButtonText: "Delete",
          cancelButtonText: "Cancel"
        }).then(result => {
          if(result == true) { this.$store.dispatch('deleteTrackable', this.trackableID) }
        });
    },
    measurableModal(){
      this.$showModal(this.Modal, {props: {id: this.trackableID}})
    },
    toDetail(event){
      console.log(event)
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
