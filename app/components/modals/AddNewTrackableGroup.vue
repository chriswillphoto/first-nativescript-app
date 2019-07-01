<template>
<Frame>
  <Page>
    <ActionBar :title="this.process + ' Trackable'">
      <NavigationButton text="Cancel" android.systemIcon="ic_menu_close_clear_cancel" @tap="$modal.close" />
    </ActionBar>
    <StackLayout backgroundColor="#3c495e">
      <TextField v-model="textFieldValue" hint='Enter Trackable Group Name' style.placeholderColor='rgba(255,255,255,0.6)'/>
      <Button text='Add' @tap='addAndClose'/>
    </StackLayout>
  </Page>
</Frame>
</template>

<script>
export default {
  data(){
    return {
      textFieldValue: "",
      process: this.editType ? "Edit" : "New"
    }
  },
  props: ['editType'],
  methods: {
    addAndClose() {
      if(this.process === 'New'){
        this.$store.dispatch('addNewTrackable', this.textFieldValue)
      }else{

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
