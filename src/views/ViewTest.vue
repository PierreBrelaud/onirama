<template>
    <scan-text 
        :successCallback="success"
        :errorCallback="error"
    />
</template>

<script>
import ScanText from '@/components/ScanText.vue'
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
        ScanText
    },
}
</script>
<style>

</style>