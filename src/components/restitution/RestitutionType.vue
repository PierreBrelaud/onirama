<template>
    <div class="container">
        <div class="container__header">
            <h1>Quels rêves avez-vous fait ?</h1>
            <restitution-bullet :count="5" :active="1"/>
        </div>
        <div class="container__list">
            <div 
                class="container__list__item item"
                v-for="item in data" :key="item.id"
                @click="$emit('onDreamTypeClicked', item.id)"
            >
                <div class="item__left">
                    <h2>{{ item.display }}</h2>
                    <p>{{ item.description }}</p>
                </div>
                <div class="item__right">
                    <img src="@/assets/images/icons/right_arrow.svg" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { dreamTypes } from '@/utils/surveyData.js'
import RestitutionBullet from '@/components/restitution/RestitutionBullet.vue'

export default {
    data() {
        return {
            data: dreamTypes
        }
    },
    components: { RestitutionBullet }
}
</script>

<style lang="scss" scoped>
.container {
    &__header {
        h1 {
            text-align: center;
            width: 50%;
            margin: auto;
            font-size: 3rem;
        }
    }

    &__list {
        .item {
            cursor: pointer;
            display: flex;
            padding: 1rem 0;
            margin-left: 2rem;
            border-top: solid $C-dark 1px;
            align-items: center;

            &__left {

                h2 {
                    margin-bottom: .5rem;
                }
                p {
                    margin: 0;
                    color: $C-light;
                    font-size: 1.4rem;
                }
                flex-grow: 1;
            }

            &__right {
                margin: 0 2rem;
            }
            
        }
    }

}
</style>