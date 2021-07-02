<template>
    <div class="home appview">
        <div class="star star-nightmare" @click="onStarClicked('nightmare')">
            <div class="star-element"></div>
        </div>
        <div class="star star-baddream" @click="onStarClicked('badDream')">
            <div class="star-element"></div>
        </div>
        <div class="star star-erotic" @click="onStarClicked('erotic')">
            <div class="star-element"></div>
        </div>
        <div class="star star-contemplatif" @click="onStarClicked('contemplative')">
            <div class="star-element"></div>
        </div>
        <div class="star star-inclassifiable" @click="onStarClicked('unclassifiable')">
            <div class="star-element"></div>
        </div>
        <div class="selected-star">{{ currentFake }}</div>

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
                <!--<p class="container__content__subtitle">
                    L’exploration démarre dans
                </p>-->
                <dream-timer 
                    v-on:endTimer="onTimerEnded"
                    v-if="publishDate" 
                    :timeStamp="publishDate"
                    type="time"
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
import { dateToFirestoreTimestamp } from '../utils/dateHelper'

export default {
    components: { DreamTimer },
    mounted() {
        this.$store.dispatch('loader/pending')
        DreamController.getNotGeneratedDream(
            this.$store.getters["auth/user"].data.uid, 
            (res) => {
                if(res.docs.length === 0) {
                    this.state = 0;
                }
                else {
                    const dream = res.docs[0].data();
                    this.dreamId = res.docs[0].id;
                    const delay = 6;
                    const now = new Date();
                    now.setHours(now.getHours() + delay);

                    this.publishDate = dream.publishDate.toDate();
                    
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
            debug: '',
            currentFake:'',
        }
    },
    methods: {
        onTimerEnded() {
            this.state = 2;
        },
        generateDream() {
            // is generated  > 9 > order by date -> dans dream controller
            const userId = this.$store.getters["auth/user"].data.uid;
            const dreams = [];

            DreamController.getDreamsForVisualisation(userId, (result) => {
                result.docs.forEach(doc => {
                    dreams.push(doc.data());
                });
                DreamController.generateDream(this.dreamId, 
                (res) => {
                    const result = {
                        current: 0,
                        dreams: dreams,
                        previousView: this.$store.getters['visualisation/data'].previousView
                    }
                    
                    this.$store.commit("visualisation/setData", result)

                    this.$router.push('/visualisation');
                }, 
                (err) => console.log(err));
            },
            (err) => console.log(err));
            
            // voir le resultat > mon dream
            
            // ajouter dans le store visu -> cf filtre
            // go visu
        },
        onStarClicked(type){
            this.currentFake = type.charAt(0).toUpperCase();
            this.$store.commit("fake/setCurrentFake", type);
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
    position: relative;
}
.star {
    width: 5rem;
    height: 5rem;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
}
.star-nightmare {
    left: 0.2rem;
    top: 0.2rem;
}
.star-baddream {
    right: 1rem;
    top: 0.5rem;
}
.star-erotic {
    top: 20rem;
    left: 8rem;
}
.star-contemplatif {
    top: 24rem;
    right: 8rem;
}
.star-inclassifiable {
    right: 6rem;
    bottom: 18rem;
}
.selected-star {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 1.5rem;
    opacity: 0.5;
}
.star-element {
    height: 0.5rem;
    width: 0.5rem;
    background: white;
    border-radius: 100%;
    box-shadow: 0px 0px 5px 0px #ffffff;
}
</style>