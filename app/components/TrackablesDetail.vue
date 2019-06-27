<template>
  <Page>
    <ActionBar id=2 :title="title">
      <ActionItem android.systemIcon='ic_menu_delete' ios.systemIcon='3' />
    </ActionBar>
    <Label :text='trackableID'/>
  </Page>
</template>

<script>
export default {
  props: ['trackableID', 'title']
}
</script>

<style scoped>
  ActionBar {
      background-color: #53ba82;
      color: #ffffff;
  }
</style>
