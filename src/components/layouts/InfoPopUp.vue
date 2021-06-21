<template>
    <div class="info-container">
        <img class="info-img" src="@/assets/images/icons/question.svg" @click="isClosed = !isClosed">
        <div v-if="!isClosed" class="info-popup-container">
            <div class="info-popup">
                <div class="info-popup-close" @click="isClosed = !isClosed">
                    <img src="@/assets/images/icons/close.svg" alt="">
                </div>
                <div class="info-popup-title">{{ title }}</div>
                <div class="info-popup-text">{{ info }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title:{
            type: String,
            required: false,
        },
        info: {
            type: String,
            required: true,
        },
    },
    data(){
        return {
            isClosed: true,
        }
    }
}
</script>

<style lang="scss" scoped>
.info-container {
    width: auto;
    height: 2rem;
}
.info-img {
    height: 100%;
    width: auto;
}
.info-popup-container {
    z-index: 1;
    position: absolute;
    top:0;
    left: 0;
    display: flex;
    background: #00000096;
    width: 100%;
    height: 100%;
}
.info-popup {
    margin: 0 5rem;
    padding: 3rem;
    height: 30vh;
    width: 100%;
    background: white;
    align-self: center;
    color: black;
    border-radius: 2rem;
    position: relative;
    
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.info-popup-close {
    width: 2rem;
    height: auto;
    position: absolute;
    top: 1rem;
    right: 1rem;
}
.info-popup-close img {
    width: 100%;
    opacity: 0.5;
}
.info-popup-title {
    font-family: $F-canela;
    font-weight: $FW-thin;
    font-size: 3.5rem;
    text-align: center;
    padding-bottom: 1rem;
}
.info-popup-text {
    font-family: $F-bellota;
    font-size: 1.5rem;
    text-align: center;
}
</style>