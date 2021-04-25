<template>
    <h1>Home</h1>

    <div class="home__buttons">
        <base-home-button
            :icon="'1'" 
            :action="btn1Clicked"
        />
        <base-home-button
            :icon="'2'" 
            :action="btn2Clicked"
        />
        <base-home-button
            :icon="'3'" 
            :action="btn3Clicked"
        />
    </div>
</template>

<script>
import BaseHomeButton from '@/components/base/BaseHomeButton.vue'

export default {
    components: {
        BaseHomeButton
    },
    methods: {
        btn1Clicked() {
            this.$store.dispatch('loader/pending')
            setTimeout(() => {
                this.$store.dispatch('loader/done')
            }, 2000);
            console.log('button 1 clicked')
        },
        btn2Clicked() {
            console.log('button 2 clicked')
        },
        btn3Clicked() {
            console.log('button 3 clicked')
        },
    }
}
</script>

<style lang="scss" scoped>
.home__buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>