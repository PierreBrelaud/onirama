<template>
    <div class="appview">
        <!-- welcome -->
        <div v-if="state === 'welcome'" class="welcome">
            <div class="welcome__logo">
                <h1>LOGO ONIRAMA</h1>
            </div>
            <div class="welcome__actions">
                <button 
                    class="welcome__actions__btn btn"
                    @click="setState('login')"
                >
                    Se connecter
                </button>
                <button 
                    class="welcome__actions__btn btn btn--dark"
                    @click="setState('register')"
                >
                    Créer un compte
                </button>
            </div>
        </div>
        <!-- register -->
        <div v-if="state === 'register'" class="container">
            <div class="container__logo">
                <h1>LOGO ONIRAMA</h1>
            </div>
            <div class="container__title">
                <h1>Créer un compte</h1>
            </div>
            <div class="container__form">
                <input 
                    class="input-rounded container__form__input"
                    type="text" 
                    placeholder="Email" 
                    v-model="register.email" 
                />
                <input
                    class="input-rounded container__form__input"
                    type="password"
                    placeholder="Mot de passe"
                    v-model="register.password"
                />
                <p class="form-error" v-if="register.error">{{ register.error }}</p>
            </div>
            <div class="container__actions">
                <button 
                    class="container__actions__btn btn" 
                    @click="onRegister"
                >   
                    Créer
                </button>
                <button 
                    class="container__actions__btn btn btn--back" 
                    @click="setState('login')"
                >
                    Annuler
                </button>
            </div>
        </div>
        <!-- login -->
        <div v-if="state === 'login'" class="container">
            <div class="container__logo">
                <h1>LOGO ONIRAMA</h1>
            </div>
            <div class="container__title">
                <h1>Se connecter</h1>
            </div>
            <div class="container__form">
                <input 
                    class="input-rounded container__form__input"
                    type="text" 
                    placeholder="Email" 
                    v-model="login.email" 
                />
                <input
                    class="input-rounded container__form__input"
                    type="password"
                    placeholder="Mot de passe"
                    v-model="login.password"
                />
                <button 
                    class="btn btn--back"
                    @click="setState('reset')">
                    Mot de passe oublié ?
                </button>
                <p class="form-error" v-if="login.error">{{ login.error }}</p>
            </div>
            <div class="container__actions">
                <button 
                    class="container__actions__btn btn" 
                    @click="onLogin"
                >   
                    Connexion
                </button>
                <button 
                    class="container__actions__btn btn btn--back" 
                    @click="setState('register')"
                >
                    Créer un compte
                </button>
            </div>
        </div>
        <!-- reset password -->
        <div v-if="state === 'reset'" class="container">
            <div class="container__logo">
                <h1>LOGO ONIRAMA</h1>
            </div>
            <div class="container__title">
                <h1>Réinitialiser mon mot de passe</h1>
            </div>
            <div class="container__form">
                <input
                    class="container__form__input input-rounded"
                    type="text" 
                    placeholder="Email" 
                    v-model="reset.email" 
                />
                <p class="form-error" v-if="reset.error">{{ reset.error }}</p>
            </div>
            <div class="container__actions">
                <button 
                    class="container__actions__btn btn" 
                    @click="onReset"
                >   
                    Envoyer
                </button>
                <button 
                    class="container__actions__btn btn btn--back" 
                    @click="setState('login')"
                >
                    Annuler
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import auth from "@/firebase/auth"
import authError from "@/firebase/auth/errors"
import UserController from '@/firebase/db/UserController'

export default {
    data() {
        return {
            login: {
                email: null,
                password: null,
                error: null,
            },
            register: {
                email: null,
                password: null,
                error: null,
            },
            reset: {
                email: null,
                error: null,
            },
            state: "welcome",
        }
    },
    methods: {
        setState(state) {
            this.state = state
        },
        onRegister() {
            if (this.login.email && this.login.password) {
                auth.register(
                    this.register.email,
                    this.register.password,
                    (res) => {
                        UserController.add(res.user.uid, { email: res.user.email }, 
                        () => {
                            this.$router.push('/')
                        }, 
                        (err) => {
                            console.log(err.message)
                        })
                    },
                    (err) => {
                        this.register.error = authError.getAuthErrorMessage(err.code)
                    }
                )
            }
            else {
                this.login.error = authError.getAuthErrorMessage("auth/argument-error")
            }
        },
        onLogin() {
            if (this.login.email && this.login.password) {
                auth.login(
                    this.login.email,
                    this.login.password,
                    (res) => {
                        this.$router.push('/')
                    },
                    (err) => {
                        this.login.error = authError.getAuthErrorMessage(err.code)
                    }
                )
            } 
            else {
                this.login.error = authError.getAuthErrorMessage("auth/argument-error")
            }
        },
        onReset() {
            if (this.reset.email) {
                auth.resetPassword(
                    this.reset.email,
                    (res) => {
                        this.state = 'login'
                    },
                    (err) => {
                        this.reset.error = authError.getAuthErrorMessage(err.code)
                    }
                )
            }
            else {
                this.reset.error = authError.getAuthErrorMessage("auth/argument-error")
            }
        },
    },
};
</script>

<style lang="scss" scoped>
*, *:before, *:after {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
input, input:before, input:after {
    -webkit-user-select: initial;
    -khtml-user-select: initial;
    -moz-user-select: initial;
    -ms-user-select: initial;
    user-select: initial;
} 


.welcome, .container {
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.container {
    
    &__logo {
        margin-bottom: 6rem;
    }

    &__title {
        width: 100%;
        margin-bottom: 2rem;
        h1 { 
            text-align: left;
        }
    }

    &__form {
        width: 100%;

        &__input {
            margin: 1rem 0;
        }

        .btn--back {
            font-size: 1.2rem;
            width: 100%;
            padding: 0;
            text-align: right;
        }
    }

    &__actions {
        width: 60%;
        display: flex;
        flex-direction: column;
        margin-top: 6rem;

        &__btn {
            margin: 1rem 0;

            &.btn--back {
                margin-top: 0rem;
                padding: 0;
            }
        }
    }
}

.welcome {
    &__logo {
        margin-bottom: 6rem;
    }
    &__actions {
        display: flex;
        flex-direction: column;
        width: 80%;

        &__btn {
            margin: 1.5rem 0;
        }
    }
}
.form-error {
    color: red;
}
</style>
