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
            <p>{{ user.data.email }}</p>
            <div class="separator smaller"></div>
            <p class="uid">{{ user.data.uid }}</p>  
            <button class="btn btn-logout" @click="logout">Se déconnecter</button>
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
        }
    }
}
</script>

<style lang='scss' scoped>
.appview {
    padding: 2rem;
    display: flex;
    flex-direction: column;
}
h1 {
    margin: 6rem 0;
}
h1, h2 {
    text-align: center;
}
.separator {
    background: #FFFFFF;
    opacity: 0.2;
    height: 0.2rem;
    width: 100%;
    margin: 2rem 0;
}
.separator.smaller{
    width: 60%;
    align-self: center;
    opacity: 0.5;
    margin: 1rem 0;
}
.quality-list {
    display: flex;
    width: 100%;
    margin-top: 2.5rem;
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
.infos {
    height: 100%;
    margin-top: 22rem;
    display: flex;
    flex-direction: column;
    position: relative;
}
.infos p {
    text-align: center;
}
.uid {
    font-size: 1rem;
}
.btn-logout {
    position: absolute;
    bottom: 0;
    left: 50%; transform: translateX(-50%);
    width: 25rem;
    background: transparent;
    color: white;
}
</style> 