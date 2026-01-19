<template>
  <div class="mb-3 p-2 bg-dark text-light legend-wrapper">
    <div class="d-flex justify-content-evenly align-items-center text-center w-100">
      <div class="legend-item">
        <div class="dot bg-white"></div>
        <span class="label">none</span>
      </div>
      <div class="legend-item">
        <div class="dot bg-warning"></div>
        <span class="label">comment</span>
      </div>
      <div class="legend-item">
        <div class="dot bg-danger"></div>
        <span class="label">delay</span>
      </div>
      <div class="legend-item">
        <div class="dot bg-success"></div>
        <span class="label">approved</span>
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