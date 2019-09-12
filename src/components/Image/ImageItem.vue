<template>
<div class="imgItem">
  <div class="imgContainer" :title="item.name">
    <span class="imgLink">
      <img :src="item.url" width="70">
    </span>
  </div>
  <div class="imgInfo">
    <div class="name" :title="item.name">{{item.name}}</div>
  </div>
  <div class="options">
    <el-button size="mini" type="danger" @click="deleteItem()">删除</el-button>
  </div>
</div>
</template>

<script>
  export default {
    name: 'ImageItem',
    props: {
      item: {
        type: Object,
        default: () => {}
      }
    },
    methods: {
      deleteItem() {
        this.$parent.deleteItem(this.item)
      }
    }
  }
</script>

<style scoped>

</style>
