<template>
<Frame>
  <Page>
    <ActionBar title="Detail">
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
      textFieldValue: ""
    }
  },
  methods: {
    addAndClose() {
      this.$store.dispatch('addNewTrackable', this.textFieldValue)
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
