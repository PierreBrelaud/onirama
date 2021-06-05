<template>
    <!-- navigation -->
    <button @click="changeNavigationItem(item.MAP)">map</button>
    <button @click="changeNavigationItem(item.CHRONOLOGIY)">chronology</button>
    <button @click="changeNavigationItem(item.NEBULA)">nebula</button>
    <button @click="changeNavigationItem(item.SEARCH)">search</button>
    {{ navigationItem }}
    <br>
    <button @click="changeNavigationType(type.VISUALISATION)">visu</button>
    <button @click="changeNavigationType(type.LIST)">list</button>
    <!-- map -->
    <filter-map 
        v-if="navigationItem === item.MAP"
    />
    <!-- chronology -->
    <filter-chronology 
        v-if="navigationItem === item.CHRONOLOGIY"
    />
    <!-- nebula -->
    <filter-nebula 
        v-if="navigationItem === item.NEBULA"
    />
    <!-- search -->
    <filter-search 
        v-if="navigationItem === item.SEARCH"
    />

</template>

<script>
import FilterNebula from '@/components/filter/FilterNebula.vue'
import FilterChronology from '@/components/filter/FilterChronology.vue'
import FilterMap from '@/components/filter/FilterMap.vue'
import FilterSearch from '@/components/filter/FilterSearch.vue'

export default {
    beforeMount() {
        this.initFilter();
    },
    mounted() {
        // this.navigationItem = this.item.NEBULA;
        // this.navigationType = this.type.VISUALISATION;
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
                MAP: "map",
                SEARCH: "search"
            }
        }
    },
    methods: {
        initFilter() {
            //check state to get previous filters
            const prevNavigationItem = this.$store.getters['filter/navigationItem'];
            if(prevNavigationItem) {
                this.navigationItem = prevNavigationItem;
            }
            else {
                this.navigationItem = this.item.CHRONOLOGIY;
            }
        },
        changeNavigationItem(item) {
            this.$store.commit('filter/setNavigationItem', item);
            this.navigationItem = item;
        },
        changeNavigationType(type) {
            this.navigationType = type;
        }
    },
    components: { FilterNebula, FilterChronology, FilterMap, FilterSearch }
}
</script>

<style>

</style>