<template>
    <div class="scantext">
        <input 
            class="scantext__file" 
            type="file" 
            accept="image/*" 
            capture="camera"
            @change="onFileChanged"
        />
    </div>
</template>

<script>

import axios from 'axios'
import { imageToBase64, removeBase64Head } from '@/utils/imageHelper.js'

export default {
    methods: {
        onFileChanged: async function(event) {
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
            axios
                .post(`${this.$api}/imageTotext`, {
                    base64Image: base64Image
                })
                .then((response) => {
                    this.successCallback(response.data)
                })
                .catch(function (error) {
                    this.successCallback(error)
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
</style>