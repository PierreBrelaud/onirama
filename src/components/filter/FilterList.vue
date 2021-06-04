<template>
    <h3>List</h3>
    <div>
        <p v-for="dream in data.hits.hits" :key="dream._id">
            {{ dream._source.title }}
            <ul>
                <span 
                    v-for="(emotion, index) in dream._source.emotions"
                    :key="index">
                    {{ getSubEmotion(emotion.type, emotion.value).display }} &nbsp;
                </span>
            </ul>
        </p>
    </div>
    <!-- {{ data }} -->
</template>

<script>
import { getSubEmotion } from '@/utils/surveyData.js' 
export default {
    data() {
        return {

        }
    },
    methods: {
        getSubEmotion(typeId, valueId) {
            return getSubEmotion(typeId, valueId)
        }
    },
    props: {
        data: {
            type: Object,
            required: true,
        }
    }
}
</script>

<style>

</style>