
export const dreamTypes = [
    { id: 0, value: 'nightmare', display: 'Cauchemar', description: 'Terrifiant, angoissant, réveil en sursaut' },
    { id: 1, value: 'bad', display: 'Mauvais rêve', description: 'Tristesse, mélancolie et mauvais souvenir' },
    { id: 2, value: 'erotic', display: 'Erotique', description: 'Fusionnel, exaltant et plus si affinité' },
    { id: 3, value: 'contemplative', display: 'Contemplatif', description: 'Apaisant, créatif, joyeux ou nostalgique' },
    { id: 4, value: 'daily', display: 'Vie quotidienne', description: 'Rêve qui semble encré dans la réalité' },
    { id: 5, value: 'unclassifiable', display: 'Inclassifiable', description: 'Qui ne ressemble à aucun autre, rêve absurde' },
]

export const dreamEmotions = [
    { id: 0, value: 'fear', display: 'Peur', data: [
        { id: 0, value: 'anguish', display: 'Angoissé', color: '#5E9EA4' },
        { id: 1, value: 'scared', display: 'Effrayé', color: '#0F749A' },
        { id: 2, value: 'terrified', display: 'Craintif', color: '#BAC39B' },
        { id: 3, value: 'fearful', display: 'Terrifié', color: '#033257' },
    ]},
    { id: 1, value: 'anger', display: 'Colère', data: [
        { id: 0, value: 'annoyed', display: 'Agacé', color: '#E05252' },
        { id: 1, value: 'aggressive', display: 'Agressif', color: '#FF0000' },
        { id: 2, value: 'exasperated', display: 'Exaspéré', color: '#C40000' },
        { id: 3, value: 'furious', display: 'Furieux', color: '#882626' },
    ]},
    { id: 2, value: 'surprise', display: 'Surprise', data: [
        { id: 0, value: 'shocked', display: 'Choqué', color: '#CB2614' },
        { id: 1, value: 'perplexed', display: 'Perplexe', color: '#C477B8' },
        { id: 2, value: 'amazed', display: 'Emerveillé', color: '#FFE200' },
        { id: 3, value: 'astonished', display: 'Etonné', color: '#FDEB88' },
    ]},
    { id: 3, value: 'disgust', display: 'Dégout', data: [
        { id: 0, value: 'judged', display: 'Jugé', color: '#A4C364' },
        { id: 1, value: 'ashamed', display: 'Honteux', color: '#CDB95C' },
        { id: 2, value: 'horrified', display: 'Horrifié', color: '#305762' },
        { id: 3, value: 'sicken', display: 'Écoeuré', color: '#56833B' },
    ]},
    { id: 4, value: 'sadness', display: 'Tristesse', data: [
        { id: 0, value: 'grieved', display: 'Chagriné', color: '#C5EBD3' },
        { id: 1, value: 'disappointed', display: 'Déçu', color: '#ACD6BC' },
        { id: 2, value: 'depressed', display: 'Déprimé', color: '#9FACE3' },
        { id: 3, value: 'desperate', display: 'Désespéré', color: '#393F70' },
    ]},
    { id: 5, value: 'joy', display: 'Joie', data: [
        { id: 0, value: 'joyful', display: 'Joyeux', color: '#FAC60A' },
        { id: 1, value: 'excited', display: 'Excité', color: '#C717AC' },
        { id: 2, value: 'lover', display: 'Amoureux', color: '#FC3E44' },
        { id: 3, value: 'euphoric', display: 'Euphorique', color: '#FBDB2B' },
    ]},
    { id: 6, value: 'calm', display: 'Calme', data: [
        { id: 0, value: 'appeased', display: 'Apaisé', color: '#DEC3CF' },
        { id: 1, value: 'contemplative', display: 'Contemplatif', color: '#FFB73C' },
        { id: 2, value: 'nostalgic', display: 'Nostalgique', color: '#F68D25' },
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
