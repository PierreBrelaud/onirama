
export const dreamTypes = [
    { id: 0, value: 'nightmare', display: 'Cauchemar' },
    { id: 1, value: 'bad', display: 'Mauvais rêve' },
    { id: 2, value: 'erotic', display: 'Erotique' },
    { id: 3, value: 'contemplative', display: 'Contemplatif' },
    { id: 4, value: 'unclassifiable', display: 'Inclassifiable' },
]

export const dreamEmotions = [
    { id: 0, value: 'fear', display: 'Peur', data: [
        { id: 0, value: 'anguish', display: 'Angoissé' },
        { id: 1, value: 'scared', display: 'Effrayé' },
        { id: 2, value: 'terrified', display: 'Craintif' },
        { id: 3, value: 'fearful', display: 'Terrifié' },
    ]},
    { id: 1, value: 'anger', display: 'Colère', data: [
        { id: 0, value: 'annoyed', display: 'Agacé' },
        { id: 1, value: 'aggressive', display: 'Agressif' },
        { id: 2, value: 'exasperated', display: 'Exaspéré' },
        { id: 3, value: 'furious', display: 'Furieux' },
    ]},
    { id: 2, value: 'surprise', display: 'Surprise', data: [
        { id: 0, value: 'shocked', display: 'Choqué' },
        { id: 1, value: 'perplexed', display: 'Perplexe' },
        { id: 2, value: 'amazed', display: 'Emerveillé' },
        { id: 3, value: 'astonished', display: 'Etonné' },
    ]},
    { id: 3, value: 'disgust', display: 'Dégout', data: [
        { id: 0, value: 'judged', display: 'Jugé' },
        { id: 1, value: 'ashamed', display: 'Honteux' },
        { id: 2, value: 'disgusted', display: 'Dégouté' },
    ]},
    { id: 4, value: 'sadness', display: 'Tristesse', data: [
        { id: 0, value: 'grieved', display: 'Chagriné' },
        { id: 1, value: 'disappointed', display: 'Déçu' },
        { id: 2, value: 'depressed', display: 'Déprimé' },
        { id: 3, value: 'desperate', display: 'Désespéré' },
    ]},
    { id: 5, value: 'joy', display: 'Joie', data: [
        { id: 0, value: 'joyful', display: 'Joyeux' },
        { id: 1, value: 'excited', display: 'Excité' },
        { id: 2, value: 'lover', display: 'Amoureux' },
        { id: 3, value: 'euphoric', display: 'Euphorique' },
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
