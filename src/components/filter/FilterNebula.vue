
<template>
    <button @click="clear">clear</button>  
    <div v-if="step !== 0" @click="onBackClicked">BACK</div>
    <div>
        <p>step - {{ step }}</p>
    </div>
    <!-- nebula emotions -->
    <div v-if="step === 0">
        <div v-for="emotion in emotionsData" :key="emotion.id">
            <p @click="onEmotionClicked(emotion.id)">
                {{ emotion.display }} - {{ emotion.count }}
            </p>
        </div>
    </div>
    <!-- nebula sub emotions -->
    <div v-if="step === 1">
        <div v-for="emotion in subEmotionsData" :key="emotion.id">
            <p 
                @click="onSubEmotionClicked(emotion.typeId, emotion.id)"
            >
                {{ emotion.display }} - {{ emotion.count }}
            </p>
        </div>
    </div>
    <!-- list -->
    <filter-list 
        v-if="step === 2 && dreamsData"
        :data="dreamsData"
    />
</template>


<script>
import { getAllEmotions, getAllSubEmotions } from '@/utils/surveyData'
import { functions } from '@/firebase'
import FilterList from '@/components/filter/FilterList.vue'

export default {
    beforeMount() {
        this.setState(this.$store.getters['filter/nebulaData'].step);
    },
    data() {
        return {
            cfGetEmotionsCount: functions.httpsCallable('emotionTypeCount'),
            cfGetSubEmotionsCount: functions.httpsCallable('emotionValueCount'),
            cfGetDreams: functions.httpsCallable('getDreamByEmotion'),
            step: null,
            emotionsData: null,
            subEmotionsData: null,
            dreamsData: null,
        }
    },
    watch: {
        step: function(val) {
            this.setState(val);      
        }
    },
    methods: {
        onBackClicked() {
            if(this.step === 1) {
                this.setStoreData({
                    step: 0,
                    emotionId: null,
                    subEmotionId: null,
                })
            }
            if(this.step === 2) {    
                this.setStoreData({
                    step: 1,
                    emotionId: this.getEmotionId(),
                    subEmotionId: null,
                })
            }
            this.step -= 1;
        },
        onEmotionClicked(emotionId) {
            this.setStoreData({
                step: 1,
                emotionId: emotionId,
                subEmotionId: null,
            });
            this.step = 1;
        },
        onSubEmotionClicked(emotionId, subEmotionId) {
            this.setStoreData({
                step: 2,
                emotionId: emotionId,
                subEmotionId: subEmotionId,
            });
            this.step = 2;
        },
        async setState(step) {
            if(step === 0) {
                await this.setEmotionStep();
            }
            if(step === 1) {
                await this.setSubEmotionStep();
            }
            if(step === 2) {
                await this.setDreamStep();
            }
            this.step = step;
        },
        async setEmotionStep() {
            //if no data fetch
            if(!this.emotionsData) {
                await this.fetchData('emotion');
            }
        },
        async setSubEmotionStep() {
            await this.fetchData('subEmotion');
        },
        async setDreamStep() {
            await this.fetchData('dream');
        },
        async fetchData(type) {
            //init loader
            this.$store.dispatch('loader/pending');

            switch(type) {
                case 'emotion':
                    await this.getEmotionsCount();
                    break;
                case 'subEmotion': 
                    await this.getSubEmotionsCount();
                    break;
                case 'dream': 
                    await this.getDreams();
                    break;
                default: 
                    break;
            }
            //close loader
            this.$store.dispatch('loader/done');
        },
        async getEmotionsCount() {
            const emotions = await this.cfGetEmotionsCount({ 
                userId: this.getUserId(),
                emotions: getAllEmotions()
            })
            this.emotionsData = emotions.data;
        },
        async getSubEmotionsCount() {
            const subEmotions = await this.cfGetSubEmotionsCount({
                userId: this.getUserId(),
                emotions: getAllSubEmotions(this.getEmotionId()),
                typeId: this.getEmotionId(),
            })
            this.subEmotionsData = subEmotions.data;
        },
        async getDreams() {
            const dreams = await this.cfGetDreams({
                userId:  this.getUserId(),
                valueId: this.getSubEmotionId(),
                typeId: this.getEmotionId(),
            })
            this.dreamsData = dreams.data;
        },
        clear() {
            this.$store.commit('filter/clearNebula');
        },
        getEmotionId() {
            return this.$store.getters['filter/nebulaData'].emotionId;
        },
        getSubEmotionId() {
            return this.$store.getters['filter/nebulaData'].subEmotionId;
        },
        setStoreData(data) {
            this.$store.commit('filter/setNebulaData', data);
        },
        getUserId() {
            return this.$store.getters['auth/user'].data.uid;
        },
    },
    components: { FilterList }
}
</script>

<style>

</style>