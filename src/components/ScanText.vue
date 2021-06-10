<template>
    <div class="scantext">
        <p 
            @click="$refs.inputFile.click()"
            class="scantext__label"
        >
            Scanner le texte
        </p>
        <input 
            ref="inputFile"
            class="scantext__file" 
            type="file" 
            accept="image/*" 
            capture="camera"
            @change="onFileChanged"
        />
    </div>
</template>

<script>

import { imageToBase64, removeBase64Head } from '@/utils/imageHelper.js'
import { functions } from '@/firebase'

export default {
    methods: {
        onFileChanged: async function(event) {
            //init loader
            this.$store.dispatch('loader/pending')
            //get files
            const files = event.target.files || event.dataTransfer.files
            if (!files.length)
                return
            //get first file founded
            const file = files[0]
            //extract base 64
            const base64Image = await imageToBase64(file)
            //clean string
            const base64ImageCleaned = removeBase64Head(base64Image)
            //call api with base 64&
            this.apiCall(base64ImageCleaned)
        },

        apiCall: function(base64Image) {
            const imageToText = functions.httpsCallable('imageToText');

            imageToText({ 
                base64Image: base64Image 
            }).then((response) => {
                this.successCallback(response.data)
            }).catch(function (error) {
                this.errorCallback(error)
            })
        },
    },
    props: {
        successCallback: {
            type: Function,
            required: true,
        },
        errorCallback: {
            type: Function,
            required: true,
        }
    }
};

</script>

<style lang="scss" scoped>
.scantext {
    &__label {
        color: $C-white;
    }
    &__file {
        display: none;
    }
}
</style>