<template>
    <div class="navigation" :class="{'restitution-active' : showRestitutionMenu}">
        <router-link :to="'/'">
            <div class="navigation__item navigation__item--home"></div>
        </router-link>
        <router-link :to="'/visualisation'">
            <div class="navigation__item navigation__item--statistics"></div>
        </router-link>
        <div 
            class="navigation__item navigation__item--more"
            @click="showRestitutionMenu = !showRestitutionMenu">
            <div
                class="navigation__item__more" 
                :class="{'navigation__item__more--active' : showRestitutionMenu }"
            ></div>
        </div>
        <router-link :to="'/tri'">
            <div class="navigation__item navigation__item--sleep"></div>
        </router-link>
        <router-link :to="'/profil'">
            <div class="navigation__item navigation__item--profile"></div>
        </router-link>
    </div>
    <div
        class="restitution" 
        :class="{'restitution--active' : showRestitutionMenu }"
    >
        <div class="restitution__item">
            <div class="fakeScanBtn" @click="onFakeClicked"></div>
            <div class="restitution__item__icon restitution__item__icon--scan"></div>
            <scan-text 
                :successCallback="scanSuccess"
                :errorCallback="scanError"
                :opacity="isFake? 0.8 : 1"
            />
        </div>
        <router-link :to="'/restitution'">
            <div class="restitution__item">
                <div class="restitution__item__icon restitution__item__icon--write"></div>
                <p>Ecrire manuellement</p>
            </div>
        </router-link>
        <div class="restitution__item">
            <div class="restitution__item__icon restitution__item__icon--micro"></div>
            <p>Dicter le rêve</p>
        </div>
    </div>
</template>

<script>

import ScanText from '@/components/ScanText.vue'

export default {
    data() {
        return {
            isFake: false,
        }
    },
    methods: {
        scanSuccess(data) {
            this.$store.state.restitution.text = data
            this.$router.push('/restitution')
            this.$store.dispatch('loader/done')
        },
        scanError(error) {
            this.$store.dispatch('loader/done')
        },
        onFakeClicked() {
            this.$data.isFake = !this.$data.isFake;
            this.$store.commit("fake/setIsFake", this.$data.isFake);
        }
    },
    components: {
        ScanText
    },
    computed: {
        storeData() {
            return this.$store.getters['restitution/data']
        }
    },
    props: {
        showRestitutionMenu: {
            type: Boolean,
            required: false,
            default: false,
        }
    }
}
</script>

<style lang="scss" scoped>

//transitions
.restitution {
    transform: translateY(20rem);
    opacity: 0;
    transition: 0.5s ease;
    &--active {
        transform: translateY(0rem);
        opacity: 1;
    }
}

//animations
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

.restitution {
    z-index: 1;
    position: fixed;
    bottom: 8rem;
    width: 100%;
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: $C-black;

    &__item {
        padding: 2rem 0;
        color: $C-white;
        cursor: pointer;
        font-size: 1.5rem;
        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: relative;

        &:first-child {
            border-bottom: solid thin $C-extradark;
        }
        
    &__icon {

        width: 2rem;
        height: 2rem;
        background: $C-white;
        margin-right: 1rem;

        &--scan {
            -webkit-mask: url('@/assets/images/icons/scan.svg') no-repeat center;
            mask: url('@/assets/images/icons/scan.svg') no-repeat center;
        }

        &--write {
            -webkit-mask: url('@/assets/images/icons/write.svg') no-repeat center;
            mask: url('@/assets/images/icons/write.svg') no-repeat center;
        }

        &--micro {
            -webkit-mask: url('@/assets/images/icons/micro.svg') no-repeat center;
            mask: url('@/assets/images/icons/micro.svg') no-repeat center;
        }
    }
    }
}

.router-link-active {
    .navigation__item {
        background: $C-white;
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
    background-color: $C-black;
    border-top: solid thin $C-white;

    &__item {
        cursor: pointer;
        width: 2.7rem;
        height: 2.7rem;
        background: $C-light;

        &--home {
            -webkit-mask: url('@/assets/images/icons/home_icon.svg') no-repeat center;
            mask: url('@/assets/images/icons/home_icon.svg') no-repeat center;
        }

        &--sleep {
            -webkit-mask: url('@/assets/images/icons/filters_icon.svg') no-repeat center;
            mask: url('@/assets/images/icons/filters_icon.svg') no-repeat center;
        }

        &--statistics {
            -webkit-mask: url('@/assets/images/icons/visu_icon.svg') no-repeat center;
            mask: url('@/assets/images/icons/visu_icon.svg') no-repeat center;
        }

        &--profile {
            -webkit-mask: url('@/assets/images/icons/account_icon.svg') no-repeat center;
            mask: url('@/assets/images/icons/account_icon.svg') no-repeat center;
        }
        
        &__more {
            -webkit-mask: url('@/assets/images/icons/add.svg') no-repeat center;
            mask: url('@/assets/images/icons/add.svg') no-repeat center;
            background: $C-black;
            width: 1.8rem;
            height: 1.8rem;
            position: absolute;
            top: 50%;
            left: 50%;
        }

        &--more {
            width: 6rem;
            height: 6rem;
            border-radius: 50%;
            position: relative;
            background-color: $C-white;
            -webkit-box-shadow: 0px 0px 20px 0px #FFFFFF; 
            box-shadow: 0px 0px 20px 0px #FFFFFF;
            &:before {
                content: '';
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                border-radius: 50%;
                border: solid thin $C-white;
                width: 6.8rem;
                height: 6.8rem;
            }
        }
    }
}

.fakeScanBtn {
    position: absolute;
    width: 5rem;
    left: 0;
    height: 100%
}
</style> 