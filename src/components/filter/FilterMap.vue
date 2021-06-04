<template>
    <h3>Map</h3>
    <div v-if="step !== 0" @click="onBackClicked">BACK</div>
    <!-- dream types -->
    <div v-if="step === 0">
        <p 
            v-for="dreamType in dreamTypes" 
            :key="dreamType.id"
            @click="getDreams(dreamType.id)"    
        >
            {{ dreamType.display }}
        </p>
    </div>
    <!-- dreams -->
    <div v-if="step === 1">
        <filter-list 
            :data="dreams"
        />
    </div>
</template>

<script>
import { dreamTypes } from '@/utils/surveyData.js';
import { functions } from '@/firebase';
import FilterList from '@/components/filter/FilterList.vue';

export default {
    beforeMount() {
        this.setState(this.$store.getters['filter/mapData'].step);
    },
    data() {
        return {
            cfGetDremByType: functions.httpsCallable('getDreamByType'),
            dreamTypes: dreamTypes,
            step: null,
        }
    },
    methods: {
        async setState(step) {
            if(step === 1) {
                const typeId = this.$store.getters['filter/mapData'].typeId;
                if(typeId !== null) {
                    await this.getDreams(typeId);
                }
                else { this.step = 0; }
            }
            else { this.step = 0; }
        },
        onBackClicked() {
            this.$store.commit('filter/setMapData', {
                step: 0,
                typeId: null,
            });
            this.step = 0;
        },
        async getDreams(typeId) {
            this.$store.dispatch('loader/pending');
            //get dreams
            const dreams = await this.cfGetDremByType({ 
                userId: this.$store.getters['auth/user'].data.uid,
                typeId: typeId
            })
            //set store
            this.$store.commit('filter/setMapData', {
                step: 1,
                typeId: typeId,
            });
            //set page data
            this.dreams = dreams.data;
            this.step = 1;
            this.$store.dispatch('loader/done');
        }
    },
    components: { FilterList },
}
</script>

<style>

</style>