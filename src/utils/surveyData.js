
export const dreamTypes = [
    { id: 0, value: 'nightmare', display: 'Cauchemar' },
    { id: 1, value: 'bad', display: 'Mauvais rêve' },
    { id: 2, value: 'erotic', display: 'Erotique' },
    { id: 3, value: 'contemplative', display: 'Contemplatif' },
    { id: 4, value: 'unclassifiable', display: 'Inclassifiable' },
]

export const dreamEmotions = [
    { id: 0, value: 'fear', display: 'Peur', data: [
        { id: 0, value: 'anguish', display: 'Angoissé', color: '#5E9EA4' },
        { id: 1, value: 'scared', display: 'Effrayé', color: '#0F749A' },
        { id: 2, value: 'terrified', display: 'Craintif', color: '#033257' },
        { id: 3, value: 'fearful', display: 'Terrifié', color: '#BAC39B' },
    ]},
    { id: 1, value: 'anger', display: 'Colère', data: [
        { id: 0, value: 'annoyed', display: 'Agacé', color: '#FFC6C6' },
        { id: 1, value: 'aggressive', display: 'Agressif', color: '#C93737' },
        { id: 2, value: 'exasperated', display: 'Exaspéré', color: '#FF7B7B' },
        { id: 3, value: 'furious', display: 'Furieux', color: '#FF0000' },
    ]},
    { id: 2, value: 'surprise', display: 'Surprise', data: [
        { id: 0, value: 'shocked', display: 'Choqué', color: '#FFFFFF' },
        { id: 1, value: 'perplexed', display: 'Perplexe', color: '#FFFFFF' },
        { id: 2, value: 'amazed', display: 'Emerveillé', color: '#FFEE00' },
        { id: 3, value: 'astonished', display: 'Etonné', color: '#FFFFFF' },
    ]},
    { id: 3, value: 'disgust', display: 'Dégout', data: [
        { id: 0, value: 'judged', display: 'Jugé', color: '#C4E67E' },
        { id: 1, value: 'ashamed', display: 'Honteux', color: '#CDB95C' },
        { id: 2, value: 'disgusted', display: 'Dégouté', color: '#8FA554' },
    ]},
    { id: 4, value: 'sadness', display: 'Tristesse', data: [
        { id: 0, value: 'grieved', display: 'Chagriné', color: '#C5EBD3' },
        { id: 1, value: 'disappointed', display: 'Déçu', color: '#ACD6BC' },
        { id: 2, value: 'depressed', display: 'Déprimé', color: '#9FACE3' },
        { id: 3, value: 'desperate', display: 'Désespéré', color: '#393F70' },
    ]},
    { id: 5, value: 'joy', display: 'Joie', data: [
        { id: 0, value: 'joyful', display: 'Joyeux', color: '#F8BA2B' },
        { id: 1, value: 'excited', display: 'Excité', color: '#C903AA' },
        { id: 2, value: 'lover', display: 'Amoureux', color: '#FC3E44' },
        { id: 3, value: 'euphoric', display: 'Euphorique', color: '#F69625' },
    ]},
]

export const getAllEmotions = () => {
    let emotions = [];
    dreamEmotions.forEach(emotion => {
        emotions.push({
            id: emotion.id,
            value: emotion.value,
            display: emotion.display,
        })
    })
    return emotions;
}

export const getAllSubEmotions = (emotionId) => {
    let subEmotions = [];
    dreamEmotions[emotionId].data.forEach(subEmotion => {
        subEmotions.push({
            id: subEmotion.id,
            value: subEmotion.value,
            display: subEmotion.display
        })
    })
    return subEmotions;
}

export const getEmotion = (emotionId) => {
    return dreamEmotions[emotionId];
}

export const getSubEmotion = (emotionId, subEmotionId) => {
    return dreamEmotions[emotionId].data[subEmotionId];
}

export const getColorBySubEmotion = (emotionId, subEmotionId) => {
    return dreamEmotions[emotionId].data[subEmotionId].color;
}
