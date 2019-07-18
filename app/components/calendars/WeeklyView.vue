<template>
  <FlexboxLayout row='1' backgroundColor='pink' alignContent='stretch' alignItems='stretch' flexWrap='wrap'>
    <Label width='10%' text='left' style='padding-top: 8px; padding-bottom: 8px; text-align: center;'  />
    <Label width='80%' backgroundColor='skyblue' style.paddingTop='8px' style.paddingBottom='8px' style.textAlignment='center' height='100vh'>
      <FormattedString>
        <Span text='WEEKLY' />
      </FormattedString>
    </Label>
    <Label width='10%' text='right' style='padding-top: 8px; padding-bottom: 8px; text-align: center;' />
  </FlexboxLayout>
</template>

<script>
export default {

}
</script>

<style>

</style>
