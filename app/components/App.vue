<template>
    <Page>
        <ActionBar title="Welcome to NativeScript-Vue!">
          <NavigationButton text="Cancel" android.systemIcon="ic_menu_close_clear_cancel" @tap="$navigateTo(testPage)" /> <!-- TODO: REMOVE IN PRODUCTION -->
        </ActionBar>
        <DockLayout stretchLastChild='true' style.backgroundColor='rgb(235,235,235)'>
          <Button text='addNew' @tap='addNew' dock='bottom' />
          <ListView for='item in trackables' style.backgroundColor='white' @itemTap='toDetail'>
            <v-template>
            <Label class='message' textWrap='true'>
              <FormattedString textWrap='true'>
                <Span :text='item.title + "\n"' style='display: block;' />
                <Span :text='"test: " + item.id' style='font-size: 12px;' />
              </FormattedString>
            </Label>
            </v-template>
          </ListView>
        </DockLayout>
    </Page>
</template>

<script>
  import addGroup from '~/components/modals/AddNewTrackableGroup.vue'
  import trackableDetail from '~/components/TrackablesDetail.vue'
  import testPage from '~/components/Testpage.vue'
  export default {
    data() {
      return {
        msg: 'Hello World!',
        db: this.$store.state.database,
        test: [],
        modal: addGroup,
        Detail: trackableDetail,
        testPage
      }
    },
    computed: {
      trackables() {
        return this.$store.state.trackables
      }
    },
    components: {
      trackableDetail
    },
    methods: {
      addNew(){
        this.$showModal(this.modal)
      },
      toDetail({item}) {
        console.log(item)
        this.$navigateTo(this.Detail, {
          transition: {},
          transitioniOS: {},
          transitionAndroid: {},

          props: {
            title: item.title,
            trackableID: item.id
          }
        });
      }
    }
  }
</script>

<style scoped>
    AbsoluteLayout {
      position: absolute;
      left: 0;
      top: 0;
    }
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: left;
        font-size: 20;
        color: #333333;
        padding: 5px 10px;
    }

    Button {
      height: 40px;
      width: 80%;
      /* border-radius: 50%; */
      border-radius: 5px;
      background-color: purple;
      margin-bottom: 5px;
      margin-top: 5px;
      color: white;
    }
</style>
