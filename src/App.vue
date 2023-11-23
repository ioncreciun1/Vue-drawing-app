<script>
import { initCanvasContext } from "./Context/CanvasContext.js";
import { usePubNubContext } from './Context/PubNubContext'
import CanvasContainer from "./Containers/CanvasContainer.vue";
import {DRAW_CHANNEL} from "./utils/channels.utils"

export default
{
  components:{
    CanvasContainer
  },
  setup()
  {
    const PubNubContext = usePubNubContext();
    PubNubContext.subscribeToChannel(DRAW_CHANNEL)
    initCanvasContext();
  }
}

</script>

<template>
  <div>
    <CanvasContainer/>
    <!-- <component :is="CanvasContainer" /> -->
  </div>
</template>

<style scoped></style>