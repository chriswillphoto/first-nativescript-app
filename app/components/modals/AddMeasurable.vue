<template>
  <Frame>
    <Page>
      <ActionBar title="Detail">
        <NavigationButton text="Cancel" android.systemIcon="ic_menu_close_clear_cancel" @tap="$modal.close" />
      </ActionBar>
      <StackLayout backgroundColor="#3c495e" style.padding='16px'>
        <TextField v-model="measurableName" hint='Enter Measurable Name' style.placeholderColor='rgba(255,255,255,0.6)'/>
        <FlexboxLayout backgroundColor="#3c495e">
          <Label text='Select Measurable Type' width='80%' color='white' />
          <Label :text='type' width='20%' alignSelf='flex-end' textAlign='right' style='text-align: right;' color='white' @tap='changeType' />
        </FlexboxLayout>
        <!-- <Label>
          <FormattedString>
            <Span text='Select type' style='display: block; width: 40%; margin-right: 40px;' />
            <Span :text='type' style='margin-left: 40%;' />
          </FormattedString>
        </Label> -->
        <Button text='Add' @tap='addAndClose'/>
      </StackLayout>
    </Page>
  </Frame>
</template>

<script>
import TypeModal from '~/components/modals/TypeModal.vue'
export default {
  props: [
    'id'
  ],
  data() {
    return {
      frequencyList: ['Daily', 'Weekly', 'Fortnightly', 'Monthly'],
      measurableName: '',
      type: 'Yes/No',
      frequency: '',
      TypeModal: TypeModal
    }
  },
  methods: {
    addAndClose() {

    },
    changeType() {
      this.$showModal(TypeModal, {fullscreen: true}).then((newType) => {
        this.type = newType
      })
    }
  }
}
</script>

<style>
/* TODO */
</style>
