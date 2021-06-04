<template>
    <h3>List</h3>
    <div class="list">
        <div v-for="dream in data.hits.hits" :key="dream._id">
            <p>
                {{ displayTimestamp(dream._source.date) }}
            </p>
            <p>{{ dream._source.title }}</p>
            <ul>
                <li 
                    v-for="(emotion, index) in dream._source.emotions"
                    :key="index">
                    {{ getSubEmotion(emotion.type, emotion.value).display }} &nbsp;
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { getSubEmotion } from '@/utils/surveyData.js'
import { displayTimestamp } from '@/utils/dateHelper.js'

export default {
    data() {
        return {
        }
    },
    methods: {
        getSubEmotion(typeId, valueId) {
            return getSubEmotion(typeId, valueId)
        },
        displayTimestamp,
    },
    props: {
        data: {
            type: Object,
            required: true,
        }
    }
}
</script>

<style style="scss" scoped>

</style>