<template>
  <three-test />
</template>

<script>
import ThreeTest from '@/components/test/ThreeTest.vue'
export default {
  methods: {
    success(data) {
      console.log(data)
    },
    error(error) {
      console.log(error.message)
    }
  },
  components: {
    ThreeTest,
  },
}
</script>

<style lang="scss" scoped>
</style>