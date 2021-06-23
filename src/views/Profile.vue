<template>
    <div class="appview">
        <h1>Préférences</h1>
        <div class="separator"></div>
        <h2>Qualité</h2>
        <div class="quality-list">
            <div 
                class="quality-item"
                @click="setSelected(0)"
                :class="{'selected': current === 'Basse'}">
                Basse
            </div>
            <div 
                class="quality-item"
                @click="setSelected(1)"
                :class="{'selected': current === 'Moyenne'}">
                Moyenne
            </div>
            <div 
                class="quality-item"
                @click="setSelected(2)"
                :class="{'selected': current === 'Haute'}">
                Haute
            </div>
        </div>
        <div class="separator"></div>
        <div v-if="user.data" class="infos">
            <h3>Utilisateur : {{ user.data.email }}</h3>
            <h3>UID : {{ user.data.uid }}</h3>
            <button class="btn" @click="logout">Logout</button>
        </div>
    </div>
</template>

<script>
import auth from "@/firebase/auth"
import { mapState } from 'vuex'

export default {
    data() {
        return {
            qualities: ['Basse', 'Moyenne', 'Haute'],
            current: this.$store.getters['settings/getQuality']
        }
    },
    computed: {
		...mapState('auth', ['user']),
    },
    methods: {
        logout() { 
            auth.logout(
                () => this.$router.push('/authentification'), 
                (error) => console.log(error)
            ) 
        },
        setSelected(value) {
            this.current = this.qualities[value];
            this.$store.commit("settings/setQuality", this.current);
            console.log(this.$store.getters['settings/getQuality']);
        }
    }
}
</script>

<style lang='scss' scoped>
.appview {
    padding: 2rem;
}
h1, h2 {
    text-align: center;
}
.separator {
    background: #FFFFFF;
    opacity: 0.2;
    height: 0.1rem;
    width: 100%;
    margin: 3rem 0;
}
.quality-list {
    display: flex;
    width: 100%;
    margin: 1rem 0;
}
.quality-item {
    width: 100%;
    text-align: center;
    font-size: 1.5rem;
    font-family: $F-bellota;
    padding: 0.8rem 0;
    margin: 0 1rem;
}
.selected {
    background: white;
    color: black;
    box-shadow: 0px 0px 5px 0px #ffffff;
    border-radius: 30px;
}
</style> 