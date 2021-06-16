<template>
    <div class="home appview">
        <!-- default -->
        <div v-if="state === 0" class="container">
            <div class="container__header">
                <h1 class="container__header__title">Bonjour</h1>
                <p class="container__header__subtitle">
                    C'est très calme par ici... <br/>
                    Avez-vous rêvé cette nuit ?
                </p>
            </div>
            <div class="container__footer">
                <button 
                    @click="$emit('showRestitution')"
                    class="container__footer__action btn">
                    Ajouter un rêve
                </button>
            </div>
        </div>
        <!-- generating -->
        <div v-if="state === 1" class="container">
            <div class="container__header">
                <h1 class="container__header__title">Bonjour</h1>
                <p class="container__header__subtitle">
                    Une nouvelle brèche vers le monde onirique se forme. Préparez-vous pour l’exploration.
                </p>
            </div>
            <div class="container__content">
                <p class="container__content__subtitle">
                    L’exploration démarre dans
                </p>
                <dream-timer 
                    v-on:endTimer="onTimerEnded"
                    v-if="publishDate" 
                    :timeStamp="publishDate"
                />
            </div>
            <div class="container__footer">
                <button class="container__footer__action btn">
                    Modifier le récit
                </button>
            </div>
        </div>
        <!-- generated -->
        <div v-if="state === 2" class="container">
            <div class="container__header">
                <h1 class="container__header__title">Bonjour</h1>
                <p class="container__header__subtitle">
                    Vous êtes fin prêt à explorer votre rêve.
                </p>
            </div>
            <div class="container__footer">
                <button 
                    @click="generateDream"
                    class="container__footer__action btn">
                    Découvrir mon rêve
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import DreamController from '@/firebase/db/DreamController.js'
import DreamTimer from '@/components/DreamTimer.vue'

export default {
    components: { DreamTimer },
    mounted() {
        this.$store.dispatch('loader/pending')
        DreamController.getNotGeneratedDream((res) => {
            console.log(res.docs.length)
            if(res.docs.length === 0) {
                this.state = 0;
            }
            else {
                const dream = res.docs[0].data();
                this.dreamId = res.docs[0].id;
                const delay = 6;
                const now = new Date();
                now.setHours(now.getHours() + delay);
                this.publishDate = dream.publishDate.toDate()
                this.state = 1;
            }
            this.$store.dispatch('loader/done')
        }, (err) => {
            this.state = 0;
            this.$store.dispatch('loader/done')
        })
    },
    data() {
        return {
            state: null,
            publishDate: null,
            dreamId: null,
        }
    },
    methods: {
        onTimerEnded() {
            this.state = 2;
        },
        generateDream() {
            DreamController.generateDream(this.dreamId, 
            (res) => {
            }, 
            (err) => console.log(err));
        }
    }
}
</script>

<style lang="scss" scoped>

.container {
    padding: 3rem 0;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;

    &__header {
        width: 100%;
        &__title {
            font-size: 6rem;
            margin-bottom: 1.5rem;
        }

        &__subtitle {
            margin: auto;
            width: 70%;
            font-size: 1.4rem;
            color: $C-extralight;
        }
    }

    &__content {
        width: 100%;

        &__title {
            font-size: 8rem;
        }

        &__subtitle {
            margin: 0 auto 1.5rem auto;
            width: 70%;
            font-size: 1.4rem;
            color: $C-extralight;
        }
    }

    &__footer {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
    }
}
.home {
    background: url('@/assets/images/home.png') no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
}
</style>