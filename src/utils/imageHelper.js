/**
 * Get base 64 of a file
 * @param {*} file 
 * @returns 
 */
const imageToBase64 = async (file) => {
    
    return new Promise((resolve, reject) => {

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.onerror = error => reject(error)
    })
}

/**
 * Remove head of a base64 string
 * head example : 'data:image/png;base64,'
 * @param {string} base64 
 * @returns 
 */
const removeBase64Head = (base64) => {
    return base64.replace(/^data:image.+;base64,/, '')
}

export { imageToBase64, removeBase64Head}