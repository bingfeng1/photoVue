<template>
  <div class="iconGroup">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["img"]
};
</script>

<style lang="scss">
.iconGroup {
  div{
    padding-top: 5px;
  }
  i {
    margin: 4px 10px;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
</style>