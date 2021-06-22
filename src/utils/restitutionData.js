export const memory = {
    title: 'Ressenti du rêve',
    data: [
        { 
            id: 'perception',
            title: 'Perception du rêve',
            type: 'slider',
            min: { value: -1, label: 'Absurde' },
            max: { value: 1, label: 'Censé' },
            step: 0.05,
            needInfo: false,
        },
        { 
            id: 'absurd',
            title: 'Souvenir de votre rêve',
            type: 'slider',
            min: { value: -1, label: 'Flou' },
            max: { value: 1, label: 'Net' },
            step: 0.05,
            needInfo: false
        },
        {
            id: 'lucidity',
            title: 'Lucidité',
            type: 'checkbox',
            needInfo: true,
            info: 'Un rêve lucide est un rêve durant lequel vous êtes conscient d’être entrain de rêver.'
        },
        {
            id: 'recurrence',
            title: 'Récurrent',
            type: 'checkbox',
            needInfo: false
        },
    ]
}

export const wakeUp = {
    title: 'Au réveil',
    data: [
        { 
            id: 'impact',
            title: 'Impact du rêve',
            type: 'slider',
            min: { value: -1, label: 'Nul' },
            max: { value: 1, label: 'Très fort' },
            step: 0.05,
            needInfo: true,
            info: 'Est-ce que le rêve vous a beaucoup impacter à votre réveil ?'
        },
        { 
            id: 'mood',
            title: 'Humeur au réveil',
            type: 'slider',
            min: { value: -1, label: 'Très mauvaise' },
            max: { value: 1, label: 'Très bonne' },
            step: 0.05,
            needInfo: false,
        },
        { 
            id: 'sleep',
            title: 'Qualité du sommeil',
            type: 'radio',
            items: [
                { value: 0, label: 'Mauvais' },
                { value: 1, label: 'Faible' },
                { value: 2, label: 'Modéré' },
                { value: 3, label: 'Reposant' },
                { value: 4, label: 'Très reposant' },
            ]
        },
    ]
}
