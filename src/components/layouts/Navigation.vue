<template>
    <div class="navigation">
        <router-link :to="'/'">
            <div class="navigation__item">
                    
            </div>
        </router-link>
        <router-link :to="'/visualisation'">
            <div class="navigation__item">
                    
            </div>
        </router-link>
        <div 
            class="navigation__item navigation__item--center"
            @click="showRestitutionMenu = !showRestitutionMenu">
                
        </div>
        <router-link :to="'/sommeil'">
            <div class="navigation__item">
                    
            </div>
        </router-link>
        <router-link :to="'/statistiques'">
            <div class="navigation__item">
                    
            </div>
        </router-link>
    </div>
    <transition name="slide-fade">
        <div v-if="showRestitutionMenu" class="restitution__menu">
            <div class="restitution__menu__item">
                <scan-text 
                    :successCallback="scanSuccess"
                    :errorCallback="scanError"
                />
            </div>
            <router-link :to="'/restitution'">
                <div class="restitution__menu__item">Ecrire manuellement</div>
            </router-link>
        </div>
    </transition>
</template>

<script>

import ScanText from '@/components/ScanText.vue'

export default {
    data() {
        return {
            showRestitutionMenu: false,
        }
    },
    methods: {
        scanSuccess(data) {
            this.$store.commit('restitution/setText', data)
            this.$router.push('/restitution')
            this.$store.dispatch('loader/hide')
        },
        scanError(error) {
            console.log(error)
            this.$store.dispatch('loader/hide')
        }
    },
    components: {
        ScanText
    }
}
</script>

<style lang="scss" scoped>

.restitution__menu {
    z-index: 1;
    position: absolute;
    bottom: 8rem;
    width: 100%;
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
    padding: 1.5rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: lightgray;

    &__item {
        color: black;
        cursor: pointer;
        font-size: 1.5rem;
        text-align: center;
        padding: 1rem;
        &:first-child {
            border-bottom: solid thin black;
        }
    }
}

.navigation {
    z-index: 2;
    position: fixed;
    display: flex;
    justify-content: space-around;
    align-items: center;
    bottom: 0;
    width: 100%;
    padding: 0 1rem;
    height: 8rem;
    box-sizing: border-box;
    background-color: lightgray;
    
    &__item {
        cursor: pointer;
        width: 3rem;
        height: 3rem;
        background: grey;
        border-radius: 50%;

        &--center {
            width: 5rem;
            height: 5rem;
        }
    }
}


//restitution menu animation
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20rem);
  opacity: 0;
}

</style> 