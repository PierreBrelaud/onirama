<template>
  <div class="dreamTimer">
    <div class="dreamTimer__circle">
      <svg class="dreamTimer__circle__empty" width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"  overflow="visible">
        <circle r="45%" fill="none" cx="500" cy="500" stroke="white" stroke-width="50"/>
      </svg>
    </div>
    <div class="dreamTimer__circle">
      <svg class="dreamTimer__circle__fill" width="100%" ref="svgCircle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"  overflow="visible">
        <circle r="45%"  ref="circleFill" fill="none" cx="500" cy="500" stroke="white" stroke-width="50"/>
      </svg>
    </div>
    <div class="dreamTimer__container">
      <div class="dreamTimer__container__title">
        Visualisation <br/> disponible dans
      </div>
      <div class="dreamTimer__container__timer">
        {{dateLabel}}
      </div>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'
import DrawSVGPlugin from '@/utils/DrawSVGPlugin'
import { timeDiffCalc, dhmsToSeconds, formatDateAsString } from '@/utils/dateHelper.js'

export default {
  props: {
    timeStamp: {
      type: Date,
      required: true
    },
  },
  data() {
    return {
      dateLabel: '00:00:00',
      circleFill: null,
      secondLeft: null,
      maxSecond: null,
      counterInterval: null,
      endInHours: 4
    }
  },
  methods: {
    counterAnimation() {
      this.$data.counterInterval = setInterval(this.intervalAnimation, 1000)
    },
    intervalAnimation() {

      let days        = Math.floor( this.$data.secondLeft/24/60/60);
      let hoursLeft   = Math.floor(( this.$data.secondLeft) - (days*86400));
      let hours       = Math.floor(hoursLeft/3600);
      let minutesLeft = Math.floor((hoursLeft) - (hours*3600));
      let minutes     = Math.floor(minutesLeft/60);
      let remainingSeconds =  this.$data.secondLeft % 60
      function pad(n) {
        return (n < 10 ? "0" + n : n);
      }
      this.$data.dateLabel = pad(hours) + ":" + pad(minutes) + ":" + pad(remainingSeconds)
      if ( this.$data.secondLeft !== 0) {
        this.$data.secondLeft--;
        let progressValue =  (100 * this.$data.secondLeft) / this.$data.maxSecond
        gsap.to(this.$data.circleFill, {
          drawSVG: 100 - Math.round(progressValue)+"%",
          duration: 1.5,
        })

      } else {
        clearInterval(this.$data.counterInterval)
      }
    }
  },
  mounted() {

    gsap.registerPlugin(DrawSVGPlugin)
    this.$data.circleFill = this.$refs.circleFill
    let svgCircle = this.$refs.svgCircle

    gsap.set(svgCircle, {rotation:-90, transformOrigin:"center center"})
    gsap.set(this.$data.circleFill, {drawSVG: "0%"})

    let dateNow = new Date();
    let stringCurrentDate =
        dateNow.getFullYear() + '-'
        + (dateNow.getMonth()+1)+ '-'
        + dateNow.getDate()+ ' '
        + dateNow.getHours() + ':'
        + dateNow.getMinutes() + ':'
        + dateNow.getSeconds()

    let timeStart = this.$props.timeStamp
    let timeEnd = new Date(timeStart);

    timeEnd.setHours(timeEnd.getHours() + this.$data.endInHours);

    let currentDate = new Date(stringCurrentDate)

    console.log(timeEnd - currentDate)
    if(Math.sign(currentDate - timeEnd) < 0) {

      let diffDateStart =  formatDateAsString(timeDiffCalc(timeStart, timeEnd), true)
      let diffDateFromNow = formatDateAsString(timeDiffCalc(currentDate, timeEnd), true)
      this.$data.dateLabel =  '00:00:00'

      let crossProduct = (100 * dhmsToSeconds(diffDateFromNow))/ dhmsToSeconds(diffDateStart)

      gsap.to(this.$data.circleFill, {
        drawSVG: 100 - Math.round(crossProduct)+"%",
        duration: 1.5,
      })

      this.$data.secondLeft = dhmsToSeconds(diffDateFromNow)
      this.$data.maxSecond = dhmsToSeconds(diffDateStart)

      this.counterAnimation()

    } else {
      this.$data.dateLabel = '00:00:00'
      gsap.set(this.$data.circleFill, {drawSVG: "100%"})
    }

  }
}
</script>

<style lang="scss" scoped>

.dreamTimer {
  width: 100%;
  height: 100%;
  position: relative;
  font-family: $F-canela;


  &__circle {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 100%;

    &__fill {
      width: 100%;
      circle {
        width: 100%;
        stroke-dasharray: 0, 999999px;
      }
    }
    &__empty {
      width: 100%;
      circle {
        width: 100%;
        stroke-opacity: 0.5;

      }
    }
  }

  &__container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    &__title {
      font-size: 1.8rem;
      color: #ffffff;
    }
    &__timer {
      font-size: 4rem;
      color: #ffffff;
    }
  }
}
</style>