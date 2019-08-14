<template>
  <div>{{type}}</div>
</template>

<script>
export default {
    props:{
        treeList:Array
    },
    computed:{
        type(){
            return this.treeList
        }
    }
}
</script>