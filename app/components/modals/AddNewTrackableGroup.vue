<template>
<Frame>
  <Page>
    <ActionBar :title="this.process + ' Trackable'">
      <NavigationButton text="Cancel" android.systemIcon="ic_menu_close_clear_cancel" @tap="$modal.close" />
    </ActionBar>
    <StackLayout backgroundColor="#3c495e">
      <TextField v-model="textFieldValue" hint='Enter Trackable Group Name' style.placeholderColor='rgba(255,255,255,0.6)'/>
      <Button text='Save' @tap='addAndClose'/>
    </StackLayout>
  </Page>
</Frame>
</template>

<script>
export default {
  data(){
    return {
      textFieldValue: this.title ? this.title : "",
      process: this.editType ? "Edit" : "New"
    }
  },
  props: ['editType', 'title', 'trackableID'],
  methods: {
    addAndClose() {
      if(this.process === 'New'){
        this.$store.dispatch('addNewTrackable', this.textFieldValue)
      }else{
        let newData = {id: this.trackableID, title: this.textFieldValue}
        this.$store.dispatch('editTrackable', newData)
      }
      
      this.$modal.close()
    }
  }
}
</script>

<style scoped>
  Page {
    background: blue;
  }

  TextField {
    color: white;
  }
</style>
