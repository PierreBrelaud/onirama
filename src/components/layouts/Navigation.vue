<template>
    <div class="navigation" :class="{'restitution-active' : showRestitutionMenu}">
        <router-link :to="'/'">
            <div class="navigation__item navigation__item--home"></div>
        </router-link>
        <router-link :to="'/sommeil'">
            <div class="navigation__item navigation__item--sleep"></div>
        </router-link>
        <div 
            class="navigation__item navigation__item--more"
            @click="showRestitutionMenu = !showRestitutionMenu">
            <div 
                class="navigation__item__more" 
                :class="{'navigation__item__more--active' : showRestitutionMenu}"
            ></div>
        </div>
        <router-link :to="'/statistiques'">
            <div class="navigation__item navigation__item--statistics"></div>
        </router-link>
        <router-link :to="'/profil'">
            <div class="navigation__item navigation__item--profile"></div>
        </router-link>
    </div>
    <div 
        class="restitution__menu" 
        :class="{'restitution__menu--active' : showRestitutionMenu }"
    >
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

//transitions
.restitution__menu {
    transform: translateY(20rem);
    opacity: 0;
    transition: 0.5s ease;
    &--active {
        transform: translateY(0rem);
        opacity: 1;
    }
}

.navigation {
    .navigation__item:not(.navigation__item--more) {
        opacity: 1;
        transition: opacity 0.5s ease, background .2s ease;
    }
    .navigation__item__more {
        transform: translate(-50%, -50%);
        transition: 0.5s ease;
    }

    &.restitution-active {
        .navigation__item:not(.navigation__item--more) {
            opacity: 0;
        }
        .navigation__item__more {
            transform: translate(-50%, -50%) rotate(45deg);
        }
    }
}

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
    background: white;

    &__item {
        color: black;
        cursor: pointer;
        font-size: 1.5rem;
        text-align: center;
        padding: 1rem;
        &:first-child {
            border-bottom: solid thin lightgrey;
        }
    }
}

.router-link-active {
    .navigation__item {
        background: black;
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
    background-color: white;
    
    &__item {
        cursor: pointer;
        width: 2.2rem;
        height: 2.2rem;
        background: lightgray;

        &--home {
            -webkit-mask: url('@/assets/images/icons/home.svg') no-repeat center;
            mask: url('@/assets/images/icons/home.svg') no-repeat center;
        }

        &--sleep {
            -webkit-mask: url('@/assets/images/icons/sleep.svg') no-repeat center;
            mask: url('@/assets/images/icons/sleep.svg') no-repeat center;
        }

        &--statistics {
            -webkit-mask: url('@/assets/images/icons/statistics.svg') no-repeat center;
            mask: url('@/assets/images/icons/statistics.svg') no-repeat center;
        }

        &--profile {
            -webkit-mask: url('@/assets/images/icons/profile.svg') no-repeat center;
            mask: url('@/assets/images/icons/profile.svg') no-repeat center;
        }
        
        &__more {
            -webkit-mask: url('@/assets/images/icons/add.svg') no-repeat center;
            mask: url('@/assets/images/icons/add.svg') no-repeat center;
            background: black;
            width: 1.8rem;
            height: 1.8rem;
            position: absolute;
            top: 50%;
            left: 50%;
        }

        &--more {
            width: 5rem;
            height: 5rem;
            border-radius: 50%;
            position: relative;
        }
    }
}
</style> 