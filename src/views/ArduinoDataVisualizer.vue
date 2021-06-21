<template>
  <div class="dataVisualizer">
    <div class="dataVisualizer__text">{{stateText}}</div>
    <div class="dataVisualizer__wrapper">
      <div class="dataVisualizer__array">
        <div class="dataVisualizer__array__title">Températures</div>
        <div class="dataVisualizer__array__item" v-for="item in dataValues.temp">{{item}}</div>
      </div>
      <div class="dataVisualizer__array">
        <div class="dataVisualizer__array__title">Cardiaques</div>
        <div class="dataVisualizer__array__item" v-for="item in dataValues.cardiac">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/index.js'

export default {
  data() {
    return {
      state: null,
      intervalState: null,
      isRunning: false,
      stateText: null,

      dataValues: {
        "temp" : null,
        "cardiac": null
      }
    }
  },
  mounted() {
    this.$data.stateText = "En attente de données"
    this.checkDeviceState()
    this.getDeviceDatas()
  },
  methods: {
    checkDeviceState() {
      db
          .collection('user')
          .doc(this.$store.getters["auth/user"].data.uid)
          .collection('device')
          .doc('listener')
          .onSnapshot((doc) => {
            if(doc.data() !== undefined) {
              this.$data.state = doc.data().status
              if(this.$data.state !== 'nothing') {
                this.$data.stateText = "Recuperation de données"
              } else {
                this.$data.stateText = "En attente de données"
              }
            }
          })
    },
    getDeviceDatas() {
      db
          .collection('user')
          .doc(this.$store.getters["auth/user"].data.uid)
          .collection('device')
          .doc('temp')
          .onSnapshot((doc) => {
            if(doc.data() !== undefined) {
              this.$data.dataValues.temp = doc.data().temperature
              this.$data.dataValues.cardiac = doc.data().cardiac
            }
          })
    }

  },
  components: {
  },
}
</script>

<style lang="scss" scoped>
.dataVisualizer {
  width: 100%;
  height: 100%;
  padding: 4rem;
  box-sizing: border-box;
  &__text {
    font-size: 5rem;
    color: $C-white;
    text-align: center;
  }
  &__wrapper {
    display: flex;
    justify-content: space-evenly;
    margin-top: 5rem;
  }
  &__array {
    &__title {
      font-size: 2.5rem;
      color: $C-white;
      margin-bottom: 1.5rem;
    }
    &__item {
      color: $C-white;
      font-size: 3rem;
      text-align: center;
      margin-bottom: 1.5rem;
    }
  }
}
</style>