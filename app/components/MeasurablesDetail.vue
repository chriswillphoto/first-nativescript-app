<template>
  <Page>
    <ActionBar id=3 :title="title">
      <NavigationButton text="Cancel" android.systemIcon="ic_menu_close_clear_cancel" @tap="$navigateTo(Trackables, {props: {trackableID}})" />
      <ActionItem android.systemIcon='ic_menu_edit' ios.systemIcon='3' @tap='edit' />
      <ActionItem android.systemIcon='ic_menu_delete' ios.systemIcon='3' @tap='deletePrompt' />
    </ActionBar>
    
  </Page>
</template>

<script>
import Trackables from '~/components/TrackablesDetail.vue'
export default {
  props: ['measurableID', 'trackableID'],
  data(){
    return {
      Trackables
    }
  },
  computed: {
    title() {
      let measurable = this.$store.state.measurables[this.trackableID].find((element) => {
        return element.id == this.measurableID
      })

      return measurable ? measurable.title : ''
    }
  }
}
</script>

<style>

</style>
