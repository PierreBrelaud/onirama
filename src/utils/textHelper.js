/**
 * Check if char is special char
 * @param {String} char 
 * @returns boolean
 */
const isSpecialChar = (char) => {
    return SPECIAL_CHAR.includes(char)
}

const SPECIAL_CHAR = '`!@#$%^&*()_+-=[]{};\\\'/:"|,.<>?~]«»'

export { isSpecialChar }