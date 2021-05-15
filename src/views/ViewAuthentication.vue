<template>
    <!-- register -->
    <div v-if="state === 'register'" class="register">
        <h1>Créer un compte</h1>
        <input type="text" placeholder="Email" v-model="register.email" />
        <input
            type="password"
            placeholder="Mot de passe"
            v-model="register.password"
        />
        <p class="form-error" v-if="register.error">{{ register.error }}</p>
        <button @click="onRegister">Valider</button>
        <p>Déjà un compte ?</p>
        <button @click="setState('login')">Se connecter</button>
    </div>
    <!-- login -->
    <div v-if="state === 'login'" class="login">
        <h1>Connexion</h1>
        <input type="text" placeholder="Email" v-model="login.email" />
        <input
            type="password"
            placeholder="Mot de passe"
            v-model="login.password"
        />
        <p class="form-error" v-if="login.error">{{ login.error }}</p>
        <button @click="onLogin">Valider</button>
        <p>Vous n'avez pas de compte ?</p>
        <button @click="setState('register')">Créer un compte</button>
        <button @click="setState('reset')">Mot de passe oublié ?</button>
    </div>
    <!-- reset password -->
    <div v-if="state === 'reset'" class="reset">
        <h1>Mot de passe oublié</h1>
        <input type="text" placeholder="Email" v-model="reset.email" />
        <p class="form-error" v-if="reset.error">{{ reset.error }}</p>
        <button @click="onReset">Réinitialiser le mot de passe</button>
        <p>Vérifiez votre adresse mail</p>
        <button @click="setState('login')">Retour</button>
    </div>
</template>

<script>
import auth from "@/firebase/auth"
import authError from "@/firebase/auth/errors"

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
            state: "login",
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
                    (res) => {},
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
                    (res) => {},
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
.form-error {
    color: red;
}
</style>
