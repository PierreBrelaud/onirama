<template>
    <curve-history />
</template>

<script>
import CurveHistory from '@/components/curveHistory.vue'

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
      CurveHistory,
    },
}
</script>

<style lang="scss" scoped>

</style>