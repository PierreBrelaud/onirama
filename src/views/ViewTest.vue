<template>
    <h1>Test view</h1>
    <firestore-test/>
    <trois-js-test />
</template>

<script>
import FirestoreTest from '@/components/test/FirestoreTest.vue'
import TroisJsTest from '@/components/test/TroisJsTest.vue'
export default {
    components: {
        FirestoreTest,
        TroisJsTest
    }
}
</script>
<style>

</style>