<template>
    <trois-js-test/>
</template>

<script>
import TroisJsTest from '@/components/test/TroisJsTest.vue';

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
        TroisJsTest
    },
}
</script>
<style>

</style>