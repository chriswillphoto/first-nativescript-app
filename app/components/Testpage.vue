<template>
  <Page>
    <ActionBar id=3 title="TestPage"/>
    <GridLayout columns="*, *">
      <ListView for='item in trackables' col='0'>
        <v-template>
          <Label textWrap='true'>
          <FormattedString>
            <Span :text='item.title + "\n"' style='display: block;' />
            <Span :text='"id: " + item.id' style='font-size: 12px;' />
          </FormattedString>
          </Label>
        </v-template>
      </ListView>
      <ListView for='item in measurables' col='1'>
        <v-template>
          <Label textWrap='true'>
          <FormattedString>
            <Span :text='item.title + "\n"' style='display: block;' />
            <Span :text='"id: " + item.id + "\n"' style='font-size: 12px;' />
            <Span :text='"trackable: " + item.trackable.title + "\n"' style='font-size: 12px;' />
            <Span :text='"type: " + item.type + "\n"' style='font-size: 12px;' />
            <Span :text='"frequency: " + item.frequency' style='font-size: 12px;' />
          </FormattedString>
          </Label>
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<script>
import {normalizeTrackable, normalizedMeasurable} from '~/utils.js'

export default {
  data() {
    return {
      
    }
  },
  computed: {
    trackables(){ return this.$store.state.trackables },
    measurables() { return this.$store.state.measurables.all }
  },
  methods: {

  }, //methods

}
</script>

<style scoped>
  Label {
    padding: 16px;
  }
</style>
