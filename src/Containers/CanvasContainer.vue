<template>
  <canvas tabindex="0" @keyup.enter="changeColor" @keyup.esc="clearCanvas" width="1536" height="722" ref="canvasRef"
    @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"></canvas>
</template>

<script>
import { computed, onMounted } from "vue";

import { useCanvasContext } from "../Context/CanvasContext";

export default {
  setup() {
    const canvasContext = useCanvasContext();

    const canvasRef = computed({
      get: () => canvasContext.getCanvasRef.value,
      set: canvasContext.setCanvas,
    });

    const startDrawing = canvasContext.startDrawing;
    const draw = canvasContext.draw;
    const stopDrawing = canvasContext.stopDrawing;
    const setCTX = canvasContext.setCTX;
    const changeColor = canvasContext.changeColor;
    const clearCanvas = canvasContext.clearCanvas;

    onMounted(() => {
      setCTX();
    });

    return {
      canvasRef,
      startDrawing,
      stopDrawing,
      draw,
      changeColor,
      clearCanvas,
    };
  },
};
</script>

<style></style>
