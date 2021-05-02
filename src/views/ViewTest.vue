<template>
    <div v-if="!isLabeling">
        <div v-if="formError">Merci de renseigner tous les champs</div>
        <textarea v-model="text" cols="80" rows="5">
        </textarea><br/><br/>
    </div>
    
    <labeling 
        v-if="isLabeling"
        :initialtext="text"
    />
<br/><br/><br/><br/><br/><br/><br/><br/>
    <button v-if="!isLabeling" @click="labelize">Labelize</button><br/><br/>
    <button v-if="isLabeling" @click="update">Modifier</button>
</template>

<script>
import Labeling from '@/components/Labeling.vue'

export default {
    data() {
        return {
            formError: false,
            text: 'test this is an test example of text test',
            isLabeling: false,
        }
    },
    methods: {
        labelize() {
            if(this.text === '') {
                this.formError = true
            }
            else {
                this.isLabeling = true
                this.formError = false
            }
        },
        update() {
            this.isLabeling = false
        }
    },
    components: {
        Labeling
    },
}
</script>

<style lang="scss" scoped>

</style>