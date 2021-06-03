<template>
    <h3>Chronology</h3>
    <h4>type : {{ navigationType }}</h4>
</template>

<script>
export default {
    props: {
        navigationType: {
            type: String,
            required: true,
        }
    }
}
</script>

<style>

</style>