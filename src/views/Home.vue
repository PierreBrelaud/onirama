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
                <button class="container__footer__action btn">
                    Ajouter un rêve
                </button>
                <button class="container__footer__action btn btn--back">
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
                <h1 class="container__content__title">
                    5:59:34
                </h1>
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
                <button class="container__footer__action btn">
                    Découvrir mon rêve
                </button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            state: 1
        }
    },
    components: {
    },
    methods: {
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
    width: 100%;
}
</style>