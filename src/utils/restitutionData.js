export const memory = {
    title: 'Ressenti du rêve',
    data: [
        { 
            id: 'absurd',
            title: 'Souvenir de votre rêve',
            type: 'slider',
            min: { value: -1, label: 'Absurde' },
            max: { value: 1, label: 'Censé' },
            step: 0.05
        },
        { 
            id: 'perception',
            title: 'Perception du rêve',
            type: 'slider',
            min: { value: -1, label: 'Flou' },
            max: { value: 1, label: 'Net' },
            step: 0.05
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
            step: 0.05
        },
        { 
            id: 'mood',
            title: 'Humeur au réveil',
            type: 'slider',
            min: { value: -1, label: 'Très mauvaise' },
            max: { value: 1, label: 'Très bonne' },
            step: 0.05
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
