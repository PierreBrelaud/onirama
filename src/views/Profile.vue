<template>
    <h1>Profile</h1>
    <div v-if="user.data" class="infos">
        <h3>Utilisateur : {{ user.data.email }}</h3>
        <h3>UID : {{ user.data.uid }}</h3>
        <button @click="logout">Logout</button>
    </div>
</template>

<script>
import auth from "@/firebase/auth"
import { mapState } from 'vuex'

export default {
    computed: {
		...mapState('auth', ['user']),
    },
    methods: {
        logout() { 
            auth.logout(
                () => this.$router.push('/authentification'), 
                (error) => console.log(error)
            ) 
        }
    }
}
</script>

<style>
</style> 