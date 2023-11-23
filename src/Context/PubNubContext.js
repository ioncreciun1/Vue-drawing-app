import PubNub from "pubnub"
import { defineStore } from 'pinia'
import {uuid} from "../utils/common.utils"

export const usePubNubContext = defineStore('PubNub',{
  state:()=>
  {
    return {
      pubNubInstance: new PubNub({      
        publishKey: import.meta.env.VITE_APP_PUBNUB_PUBLISH_KEY,
        subscribeKey: import.meta.env.VITE_APP_PUBNUB_SUBSCRIBE_KEY,
        uuid: uuid(),
      })
    }
  },
  actions:
  {
    publishToChannel(channel,drawType,params)
    {
      const publishPayload = {
        channel : channel,
        message: JSON.stringify({
            type: drawType,
            params: params
        })
      };
      this.pubNubInstance.publish(publishPayload)
    },

    subscribeToChannel(channel)
    {
      this.pubNubInstance.subscribe({channels:[channel]})
    },

    handleIncommingPubNubMessage(handleEvent)
    {
      this.pubNubInstance.addListener({
        message: (event) => {
          if (event.publisher === this.pubNubInstance.getUUID()) {
            return;
          }
          return handleEvent(JSON.parse(event.message))
        },
      });
    }
  }
})