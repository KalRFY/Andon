<template>
  <div>
    Redirecting to TPM System...
  </div>
</template>

<script>

export default {

  name: 'RedirectTPM',





  mounted() {
    window.location.href = 'http://mt-system.id:9200';
  },

};

</script>