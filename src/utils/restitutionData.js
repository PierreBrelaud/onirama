export const feeling = {
    title: 'Ressenti du rêve',
    data: [
        { 
            id: 'feeling',
            title: 'Ressenti général du rêve',
            type: 'radio',
            items: [
                { value: 0, label: 'Très négatifs', icon: '' },
                { value: 1, label: 'Négatifs', icon: '' },
                { value: 2, label: 'Normal', icon: '' },
                { value: 3, label: 'Bien', icon: '' },
                { value: 4, label: 'Très bien', icon: '' },
            ]
        },
        { 
            id: 'memory',
            title: 'Comment est le souvenir de ton rêve ?',
            type: 'radio',
            items: [
                { value: 0, label: 'Très flou', icon: null },
                { value: 1, label: 'Flou', icon: null },
                { value: 2, label: 'Normal', icon: null },
                { value: 3, label: 'Clair', icon: null },
                { value: 4, label: 'Limpide', icon: null },
            ]
        },
        { 
            id: 'credibility',
            title: 'Niveau de crédibilité du rêve',
            type: 'radio',
            items: [
                { value: 0, label: 'Très peu crédible', icon: null },
                { value: 1, label: 'Peu crédible', icon: null },
                { value: 2, label: 'Crédible', icon: null },
                { value: 3, label: 'Très crédible', icon: null },
            ]
        },
        {
            id: 'lucidity',
            title: 'Lucidité',
            type: 'checkbox',
        },
        {
            id: 'recurrence',
            title: 'Récurrent',
            type: 'checkbox',
        },
        { 
            id: 'perspective',
            title: 'Perspective',
            type: 'radio',
            items: [
                { value: 0, label: '1ère personne', icon: null },
                { value: 1, label: '3ème personne', icon: null },
                { value: 2, label: 'Les deux', icon: null },
            ]
        },
    ]
}

export const wakeUp = {
    title: 'Au réveil',
    data: [
        { 
            id: 'sleep',
            title: 'As-tu bien dormis ?',
            type: 'radio',
            items: [
                { value: 0, label: 'Pas du tout', icon: '' },
                { value: 1, label: 'Pas vraiment', icon: '' },
                { value: 2, label: 'Oui', icon: '' },
                { value: 3, label: 'Très bien', icon: '' },
                { value: 4, label: 'Très très bien', icon: '' },
            ]
        },
        { 
            id: 'mood',
            title: 'Humeur au réveil',
            type: 'select',
            items: [
                { value: -1, label: 'Choisir', icon: null },
                { value: 0, label: 'Joyeux' },
                { value: 1, label: 'Calme' },
                { value: 2, label: 'Enervé' },
                { value: 3, label: 'Peur' },
            ]
        },
        { 
            id: 'impact',
            title: 'Impact du rêve',
            type: 'radio',
            items: [
                { value: 0, label: 'Aucun', icon: null },
                { value: 0, label: 'Aucun', icon: null },
                { value: 1, label: 'Faible', icon: null },
                { value: 2, label: 'Modéré', icon: null },
                { value: 3, label: 'Fort', icon: null },
                { value: 4, label: 'Intense', icon: null },
            ]
        },
    ]
}
