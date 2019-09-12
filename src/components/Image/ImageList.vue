<template>
<div>
  <ImageItem v-for="each in items" :item="each"></ImageItem>
  <div class="clearBoth"></div>
</div>
</template>

<script>
  import ImageItem from '@/components/Image/ImageItem'
  import BasePagination from '@/components/Table/BasePagination'
  export default {
    name: 'ImageList',
    components: {
      ImageItem,
      BasePagination
    },
    data() {
      return {
        items: [1, 2, 3, 4, 5]
      }
    }
  }
</script>

<style scoped>

</style>
