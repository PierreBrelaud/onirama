<template>
  <DreamTimer :startDay="'2021-06-08'"
              :startDate="'23:00:00'"
              :endDay="'2021-06-09'"
              :endDate="'02:59:40'" />
</template>

<script>
import DreamTimer from '@/components/DreamTimer.vue'

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
      DreamTimer,
    },
}
</script>

<style lang="scss" scoped>

</style>