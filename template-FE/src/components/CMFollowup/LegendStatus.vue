<template>
  <div class="mb-3 p-2 bg-dark text-light legend-wrapper">
    <div class="d-flex justify-content-evenly align-items-center text-center w-100">
      <div class="legend-item">
        <div class="dot bg-white"></div>
        <span class="label">finished</span>
      </div>
      <div class="legend-item">
        <div class="dot custom-progress"></div>
        <span class="label">on progress</span>
      </div>
      <div class="legend-item">
        <div class="dot custom-delay"></div>
        <span class="label">delay</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LegendStatus",
};
</script>

<style>
.custom-progress {
  background-color: #5bf1ff;
}

.custom-delay {
  background-color: #fe9999;
}

.legend-wrapper {
  width: 100%;
  border-radius: 6px;
}

.legend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.dot {
  height: 20px;
  width: 20px;
  border-radius: 50%;
}

.label {
  font-size: 9px;
}
</style>