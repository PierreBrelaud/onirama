<template>
    <div class="navigation">
        <navigation-item 
            class="navigation__item"
            v-for="navItem in navItems" 
            :key="navItem.url"
            :url="navItem.url"
            :name="navItem.name"
            :icon="navItem.icon"
        />
    </div>
	<router-view></router-view>
</template>

<script>
import NavigationItem from '@/components/layouts/NavigationItem.vue'

export default {
    data() {
        return {
            navItems: [
                { url: '/', name: 'Home', icon: '' },
                { url: '/visualisation', name: 'Visu', icon: '' },
                { url: '/restitution', name: 'Rest', icon: '' },
                { url: '/sommeil', name: 'Sleep', icon: '' },
                { url: '/statistiques', name: 'Stat', icon: '' },
                { url: '/profil', name: 'Prof', icon: '' },
            ]
        }
    },
    components: {
        NavigationItem
    }
}
</script>

<style lang="scss" scoped>

.navigation {
    position: fixed;
    display: flex;
    justify-content: space-around;
    bottom: 0;
    width: 100%;
    padding: 20px 5px;
    background-color: lightgray;
}

</style> 