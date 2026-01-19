<template>

  <div>
    Redirecting to Order Spareparts...
  </div>

</template>

<script>

export default {
  name: 'RedirectOrderSpareparts',

  mounted() {

    window.location.href = 'https://iwms.toyota.co.id/StorageInquiry';

  },

};

</script>