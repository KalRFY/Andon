<template>
  <CFooter v-if="!isMobile" class="sticky-bottom">
    <div>
      <label>Andon</label>
      <span class="ms-1"
        >&copy; {{ new Date().getFullYear() }}</span
      >
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    }
  },
  computed: {
    isMobile() {
      const ratio = this.windowWidth / this.windowHeight;
      return this.windowWidth <= 480 || (ratio > 1.5 && this.windowHeight < 500) || (this.windowHeight >= 360 && this.windowHeight <= 480) || ratio <= 0.76;
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
  }
}
</script>
