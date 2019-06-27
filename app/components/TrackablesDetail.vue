<template>
  <Page>
    <ActionBar id=2 :title="title">
      <ActionItem android.systemIcon='ic_menu_delete' ios.systemIcon='3' @tap='deletePrompt' />
    </ActionBar>
    <Label :text='trackableID'/>
  </Page>
</template>

<script>
export default {
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
