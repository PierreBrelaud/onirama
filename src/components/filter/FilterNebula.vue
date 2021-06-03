<template>
    <h3>Nebula</h3>
    <h4>type : {{ navigationType }}</h4>
    {{ emotions }}
</template>

<script>
import { dreamEmotions } from '@/utils/surveyData'

export default {
    data() {
        return {
            emotions: dreamEmotions 
        }
    },
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