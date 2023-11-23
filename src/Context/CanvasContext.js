import { computed, inject, provide, ref, reactive,onUpdated } from "vue";
import { getRandomHexColor } from "./../utils/color.utils.js";
import {usePubNubContext} from "./PubNubContext"
import {DRAW_CHANNEL} from "./../utils/channels.utils.js"

export const initCanvasContext = () => {
  const pubnub = usePubNubContext();
  pubnub.handleIncommingPubNubMessage(HandlePubNubDrawing);

  //canvas
  const canvasRef = ref(null);

  // State
  const state = reactive({
    drawing: false,
    x: 0,
    y: 0,
    ctx: null,
  });

  // Getters
  const getDrawing = computed(() => state.drawing);
  const getX = computed(() => state.x);
  const getY = computed(() => state.y);
  const getCTX = computed(() => state.ctx);
  const getCanvasRef = computed(() => canvasRef);

  const startDrawing = (e) => {
    console.log("START DRAWING")
    pubnub.publishToChannel(DRAW_CHANNEL,"START_DRAW",{x:e.clientX,y:e.clientY,color:state.ctx.strokeStyle})

    setStateDrawing(true)
    setStateXAndY(e.clientX,e.clientY)

  };

  const setStateDrawing = (value) =>
  {
    state.drawing = value;

  }
  const setStateXAndY = (x,y) =>
  {
    state.x = x;
    state.y = y;
  }

  const draw = (e) => {
    if (!state.drawing) return;

    performDrawing(e.clientX,e.clientY)
    pubnub.publishToChannel(DRAW_CHANNEL,"DRAW",{x:e.clientX,y:e.clientY,color:state.ctx.strokeStyle})
  };

  const performDrawing = (x,y) =>
  {
    state.ctx.beginPath();
    state.ctx.moveTo(state.x, state.y);
    state.ctx.lineTo(x, y);
    state.ctx.stroke();
    setStateXAndY(x,y)
  }

  const stopDrawing = () => {
    pubnub.publishToChannel(DRAW_CHANNEL,"STOP_DRAW",{})

    state.drawing = false;
  };

  const setCTX = () => {
    state.ctx = canvasRef.value.getContext("2d");
    state.ctx.strokeStyle = getRandomHexColor();

  };

  const changeColor = () => {
    state.ctx.strokeStyle = getRandomHexColor();
  };

  const setColor = (color) =>
  {
    state.ctx.strokeStyle = color;
  }

  const clearCanvas = () => {
    state.ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  };

  const setCanvasRef = (canvas) => {
    canvasRef.value = canvas;
  };

  function HandlePubNubDrawing(message)
  {
    switch(message.type)
    {
      case "START_DRAW":
        setStateDrawing(true),
        setStateXAndY(message.params.x,message.params.y)
        setColor(message.params.color);
      break; 
      case "DRAW":
        performDrawing(message.params.x,message.params.y);
      break; 
      case "STOP_DRAW":
        setStateDrawing(false)
      break; 
    }
  }




  provide("setCTX", setCTX);
  provide("setCanvas", setCanvasRef);
  provide("getDrawing", getDrawing);
  provide("getX", getX);
  provide("getY", getY);
  provide("getCTX", getCTX);
  provide("getCanvasRef", getCanvasRef);
  provide("startDrawing", startDrawing);
  provide("draw", draw);
  provide("stopDrawing", stopDrawing);
  provide("changeColor", changeColor);
  provide("clearCanvas", clearCanvas);
};

export const useCanvasContext = () => ({
  getDrawing: inject("getDrawing"),
  getX: inject("getX"),
  getY: inject("getY"),
  getCTX: inject("getCTX"),
  getCanvasRef: inject("getCanvasRef"),
  startDrawing: inject("startDrawing"),
  draw: inject("draw"),
  stopDrawing: inject("stopDrawing"),
  setCTX: inject("setCTX"),
  setCanvas: inject("setCanvas"),
  changeColor: inject("changeColor"),
  clearCanvas: inject("clearCanvas"),
});
