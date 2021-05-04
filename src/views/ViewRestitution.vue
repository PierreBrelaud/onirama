<template>
    <h1>Restitution</h1>
    <div class="restitution__header">
        Header
    </div>
    <div class="restitution__content">
        <restitution-story v-if="current === 1"/>
        <restitution-survey v-if="current === 2"/>
        <restitution-survey  v-if="current === 3"/>
        <restitution-labeling 
            v-if="current === 4"
            :initialtext="''"
        />
    </div>
    <div class="resitution__footer">
        <button @click="previous" :disabled="current <= 1">Précédent</button>
        <button @click="next" v-if="current < elementsCount">Suivant</button>
        <button @click="end"  v-if="current >= elementsCount">Terminer</button>  
    </div>
</template>

<script>
import RestitutionLabeling from '@/components/restitution/RestitutionLabeling.vue'
import RestitutionSurvey from '@/components/restitution/RestitutionSurvey.vue'
import RestitutionStory from '@/components/restitution/RestitutionStory.vue'

export default {
    data() {
        return {
            elementsCount: 4,
            current: 1,
        }
    },
    methods: {
        previous() {
            this.current -= 1
        },
        next() {
            this.current += 1
        },
        end() {
            console.log('end')
        }
    },
    components: { RestitutionLabeling, RestitutionSurvey, RestitutionStory }
}
</script>

<style lang="scss" scoped>
</style> 