<template>
    <!-- navigation -->
    <button @click="changeNavigationItem(item.MAP)">map</button>
    <button @click="changeNavigationItem(item.CHRONOLOGIY)">chronology</button>
    <button @click="changeNavigationItem(item.NEBULA)">nebula</button>
    <br>
    <button @click="changeNavigationType(type.VISUALISATION)">visu</button>
    <button @click="changeNavigationType(type.LIST)">list</button>
    <!-- list -->
    <filter-list 
        v-if="navigationType === type.LIST"
    />
    <!-- map -->
    <filter-map 
        v-if="navigationItem === item.MAP
        && navigationType === type.VISUALISATION"
    />
    <!-- chronology -->
    <filter-chronology 
        v-if="navigationItem === item.CHRONOLOGIY
        && navigationType === type.VISUALISATION"
    />
    <!-- nebula -->
    <filter-nebula 
        v-if="navigationItem === item.NEBULA
        && navigationType === type.VISUALISATION"
    />

</template>

<script>
import FilterList from '@/components/filter/FilterList.vue'
import FilterNebula from '@/components/filter/FilterNebula.vue'
import FilterChronology from '@/components/filter/FilterChronology.vue'
import FilterMap from '@/components/filter/FilterMap.vue'

export default {
    mounted() {
        this.navigationItem = this.item.CHRONOLOGIY;
        this.navigationType = this.type.VISUALISATION;
    },
    data() {
        return {
            navigationItem: null,
            navigationType: null,
            type: { 
                VISUALISATION: "visualisation", 
                LIST: "list", 
            },
            item: { 
                CHRONOLOGIY: "chronology", 
                NEBULA: "nebula", 
                MAP: "map"
            }
        }
    },
    methods: {
        changeNavigationItem(item) {
            this.navigationItem = item;
        },
        changeNavigationType(type) {
            this.navigationType = type;
        }
    },
    components: { FilterList, FilterNebula, FilterChronology, FilterMap }
}
</script>

<style>

</style>