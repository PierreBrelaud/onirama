<template>
    <!-- navigation -->
    <div class="filter appview">
        <!-- gap for header -->
        <div class="header"></div>
        <div class="nav">
            <div class="nav__slider" :class="'nav__slider--' + navigationItem">
                <!-- map 
                <div 
                    class="nav__slider__item" 
                    :class="{'nav__slider__item--selected' : navigationItem === 'map' }"
                    @click="changeNavigationItem(item.MAP)">
                    <h1>
                        Cartographie onirique
                    </h1>
                </div>
                -->
                <!-- search 
                <div 
                    class="nav__slider__item" 
                    :class="{'nav__slider__item--selected' : navigationItem === 'search' }"
                    @click="changeNavigationItem(item.SEARCH)">
                    <h1>
                        Recherche
                    </h1>
                </div>
                -->
                <!-- nebula 
                <div 
                    class="nav__slider__item" 
                    :class="{'nav__slider__item--selected' : navigationItem === 'nebula' }"
                    @click="changeNavigationItem(item.NEBULA)">
                    <h1>
                        Nébuleuse émotionnelle
                    </h1>
                </div>
                -->
                <!-- chronology -->
                <div 
                    class="nav__slider__item" 
                    :class="{'nav__slider__item--selected' : navigationItem === 'chronology' }"
                    @click="changeNavigationItem(item.CHRONOLOGY)">
                    <h1>
                        Chronologie
                    </h1>
                </div>
            </div>
        </div>
        <!-- map 
        <filter-map 
            v-if="navigationItem === item.MAP"
        />-->
        <!-- chronology -->
        <filter-chronology 
            v-if="navigationItem === item.CHRONOLOGY"
        />
        <!-- nebula 
        <filter-nebula 
            v-if="navigationItem === item.NEBULA"
        />-->
        <!-- search 
        <filter-search 
            v-if="navigationItem === item.SEARCH"
        />-->
    </div>

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
                CHRONOLOGY: "chronology", 
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
                this.navigationItem = this.item.CHRONOLOGY;
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

<style lang="scss" scoped>
.filter {
    overflow-x: hidden;
    .header {
        height: 4rem;
    }
    .nav {
        height: 13rem;
        width: 100%;
        position: relative;
        &__slider {
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            transition: 0.2s;

            &--map {
                left: 0vw;
            }
            &--search {
                left: -55vw;
            }
            &--nebula {
                left: -110vw;
            }
            &--chronology {
                left: 0vw;
            }

            &__item {
                
                
                width: 55vw;
                display: flex;
                justify-content: center;
                position: absolute;
                top: 0;
                height: 13rem;
                text-align: center;
                color: $C-light;
                cursor: pointer;

                @for $i from 1 through 4 {
                    &:nth-child(#{$i}) {
                        left: #{($i - 1) * 55 + 22.5}vw;
                    }
                }

                h1 {
                    margin: auto;
                    font-size: 20pt;
                    transition: .2s;
                }
                
                &--selected {
                    h1 {
                        color: $C-white;
                        font-size: 30pt;
                    }
                }
            }
        }
    }
}
</style>