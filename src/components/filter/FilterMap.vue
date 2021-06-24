<template>
    <div v-if="step !== 0" @click="onBackClicked">
        <img class="btn-back" src="@/assets/images/icons/right_arrow.png" alt="">
    </div>
    <!-- dream types -->
    <div v-if="step === 0">
        <div 
            v-for="dreamType in dreamTypes" 
            :key="dreamType.id"
            @click="getDreams(dreamType.id, dreamType.display)"
            class="map-container"
            :style="`background-image:url('/maps/map_${dreamType.id}.png')`"  
        >
            <h2>{{ dreamType.display }}</h2>
            
        </div>
    </div>
    <!-- dreams -->
    <div v-if="step === 1">
        <div 
            class="selected-map-img map-container"
            :style="`background-image:url('/maps/map_${currentType.type}.png')`"
        >
            <h2>{{currentType.display}}</h2>
        </div>
        <filter-list 
            :data="dreams"
        />
    </div>
    <div class="spacer"></div>
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
            currentType: null,
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
        async getDreams(typeId, display) {
            this.$store.dispatch('loader/pending');

            this.$data.currentType = {
                type: typeId,
                display
            };

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

<style scoped>
.map-container {
    height: 25rem;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
}
.map-container h2{
    position: absolute;
    bottom: 3rem;
    font-size: 4rem;
    width: 100%;
    text-align: center;
}
.spacer {
    height: 8rem;
}
.selected-map-img {
    width: 100%;
    margin-bottom: 3.8rem;
}
.btn-back {
    transform: scaleX(-1);
}
</style>