<template>
  <CFooter v-if="!isMobile" class="sticky-bottom">
    <div>
      <label>Smartandon</label>
      <span class="ms-1"
        >&copy; {{ new Date().getFullYear() }}</span
      >
    </div>
    <div class="ms-auto">
      <span class="me-1" target="_blank">Developed by</span>
      <a href="https://www.linkedin.com/in/khalif-raflika-868404246/">M. Khalif Raflika</a>
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
