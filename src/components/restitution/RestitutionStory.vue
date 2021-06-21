<template>
    <div class="story">
        <div class="story__header">
            <!-- title -->
            <input 
                v-model="storeData.title" 
                type="text" 
                class="input-sm story__header__title story__item" 
                placeholder="Nouveau rêve"
            />
            <div class="story__header__row">
              <!-- date -->
              <input
                  v-model="storeData.date"
                  type="date"
                  placeholder="Date de votre rêve"
                  class="input-sm story__header__date story__item"
              />
              <input
                  :value="dateText"
                  type="text"
                  @click="clickTrigger"
                  class="input-sm story__header__date story__item"
              />
            </div>
        </div>
        <div class="story__dataDevice" ref="dataDevice" v-if="deviceDatas">
          <div class="dataDeviceItem" v-for="(item, index) in deviceDatas">
            <div class="dataDeviceItem__top" @click="pickElementInList" :data-index="index" :data-deviceid="item.itemId">
              <div class="dataDeviceItem__top__dateStart">{{item.data.start}}</div>
              <span></span>
              <div class="dataDeviceItem__top__dateEnd">{{item.data.end}}</div>
            </div>
          </div>
        </div>
        <!-- text -->
        <div class="story__content">
            <!-- <textarea 
                v-model="storeData.text"
                class="story__content__text story__item"
            ></textarea> -->
            <div
                ref="text"
                contenteditable="true" 
                @input="updateTextValue"
                class="story__content__text story__item">
            </div>
        </div>
    </div>
</template>

<script>
import UserController from '@/firebase/db/UserController.js'
import gsap from 'gsap'

export default {
  data() {
    return {
      deviceDatas : [],
      isOpen : false,
      dateText: null
    }
  },
    beforeMount() {
        const today = new Date()
        const localDateString = today.toLocaleString().substring(0, 10)
        const todayFormattedDate = 
            localDateString.substring(6, 10) + '-' + 
            localDateString.substring(3, 5) + '-' + 
            localDateString.substring(0, 2)

        this.storeData.date = todayFormattedDate;

        UserController.getDeviceData(
            this.$store.getters["auth/user"].data.uid,
            (res) => {
              if(res.docs.length > 0) {
                res.docs.forEach((item) => {
                  let objDevice = {
                    itemId : item.id,
                    data : item.data()
                  }
                  this.$data.deviceDatas.push(objDevice)
                })
                let lastItem = res.docs[res.docs.length - 1].data()

                this.$data.dateText = this.splitString(lastItem.start) + " . " + this.splitString(lastItem.end)

                //this.storeData.selectedDeviceId = res.docs[res.docs.length - 1].id

                this.storeData.cardiacAvg = lastItem.cardiacAvg
                this.storeData.temperatureAvg = lastItem.temperatureAvg

              } else {
                console.log('no data found')
              }
            },
            (err) => {
              console.log(err)
            }
        );
    },

    mounted() {
        this.$refs.text.innerText = this.storeData.text;
      gsap.set(this.$refs.dataDevice, {display: 'none'})
    },
    methods: {
        updateTextValue(ev) {
            this.storeData.text = ev.target.innerText;
        },
      clickTrigger() {
          if(this.$data.isOpen) {
            this.closeList()
          } else {
            this.openList()
          }
      },
      openList(e) {
        console.log(this.$refs.dataDevice)
        gsap.to(this.$refs.dataDevice, {display: 'flex'})
        gsap.fromTo(this.$refs.dataDevice.children, {y : -300}, {y : 0, stagger: 0.1, duration: 0.5})
        this.$data.isOpen = true
      },
      closeList(e) {
        this.$data.isOpen = false
        gsap.fromTo(this.$refs.dataDevice.children, {y : 0}, {y : -300, stagger: 0.1, duration: 0.5})
        gsap.to(this.$refs.dataDevice, {display: 'none'})
      },
      pickElementInList(e) {
          let dates = []
        e.target.childNodes.forEach((item) => {
          if(item.textContent !== "") {
            dates.push(item.textContent)
          }
        })

        this.$data.dateText =  this.splitString(dates[0]) + " . " + this.splitString(dates[1])
        //this.storeData.selectedDeviceId = e.target.dataset.deviceid
        let index = e.target.dataset.index
        
        this.storeData.cardiacAvg = this.$data.deviceDatas[index].data.cardiacAvg
        this.storeData.temperatureAvg = this.$data.deviceDatas[index].data.temperatureAvg

        this.closeList()
      },
      splitString(text) {
        let splitText = text.split(" ");
        return splitText[splitText.length - 1]
      }
    },
    watch: {
        storeData: {
            handler(value) {
                this.$store.commit('restitution/setData', value)
            },
            deep: true
        }
    },
    computed: {
        storeData() {
            return this.$store.getters['restitution/data']
        }
    },
}
</script>

<style lang="scss" scoped>
*, *:before, *:after {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
input, input:before, input:after, .story__content__text {
    -webkit-user-select: initial;
    -khtml-user-select: initial;
    -moz-user-select: initial;
    -ms-user-select: initial;
    user-select: initial;
} 

.story {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;

    &__header {
        padding: 0 7.5%;

        &__row {
          display: flex;
          justify-content: space-between;
        }

        &__title {
            width: 100%;
            text-align: left;
            margin-bottom: 2rem;
        }

        &__date {
            font-style: italic;
            font-size: 1.2rem;
            width: 10rem;
            margin-bottom: 2rem;
        }

        &__item {
            margin-bottom: 2rem;
            outline: none;
            border: none;
            border-bottom: solid thin lightgrey;
            padding: 0.5rem 0;
        }
    }

  &__dataDevice {
    flex-direction: column;
    border-top: 1px solid $C-white;
    display: none;
  }

    &__content {
        padding-top: 2rem;
        flex-grow: 1;
        width: 100%;
        background-color: $C-wheat;

        &__text, &__text > div {
            color: $C-black;
            font-family: $F-bellota;
            font-weight: $FW-thin;
            font-size: 1.9rem;
        }

        &__text {
            resize: none;
            line-height: 2rem;
            width: 85%;
            height: 100vh;
            margin: auto;
            display: block;
            border: none;
            border-radius: 0;
            background-color: $C-wheat;
            padding: 0rem .5rem 2rem 0;
            box-sizing: border-box;
            outline: none;
            line-height: 3rem;
            background-size: 1px 3rem;
            background-repeat: repeat;
            background-position: 0 2.1rem;  
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 3rem'%3E%3Crect id='background' height='0' width='1' y='0' x='0' fill='none'/%3E %3Cline id='underline' y2='1' x2='0' y1='1' x1='1' opacity='0.1' stroke='%23001733' fill='none'/%3E %3C/svg%3E");
        }

        &__item {
            margin-bottom: 2rem;
            outline: none;
            border: none;
            border-bottom: solid thin lightgrey;
            padding: 0.5rem 0;
        }
    }
}
.dataDeviceItem {
  width: 100%;
  padding: 2.5rem;
  background-color: $C-extradark;
  box-sizing: border-box;
  &:not(:last-child) {
    border-bottom: 1px solid rgba($C-white, 0.2);
  }
  &__top {
    display: flex;
    align-items: center;
    color: $C-white;
    font-family: $F-bellota;
    font-weight: $FW-thin;
    font-size: 1.4rem;
    &__dateStart {
      pointer-events: none;
    }
    span {
      width: .5rem;
      height: .5rem;
      border-radius: 100%;
      background-color: rgba($C-white, 0.5);
      margin: 0 1rem;
    }
    &__dateEnd {
      pointer-events: none;
    }
  }
  &__middle {
    display: flex;
    align-items: center;
    &__item {
      width: 3rem;
      height: 3rem;
      border-radius: 100%;

      position: relative;
      background-color: rgba($C-regular, 0.5);
      transition: all .3s;
      &:not(:last-child) {
        margin-right: 2rem;
      }
      &__text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        color: $C-white;
        pointer-events: none;
      }
      &--active {
        background-color: $C-white;

        & > * {
          color: $C-regular;
        }
      }
    }
  }
}
</style>