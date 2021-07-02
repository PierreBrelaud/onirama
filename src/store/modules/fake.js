export const fake = {
    namespaced: true,
    state: {
        isFake: false,
        fakeText : {
            nightmare: "C'est la guerre. Des cadavres jonchent le sol. Je m'allonge parmi eux dans le sang et la boue verte. Je fais le mort pour qu'ils ne me repèrent pas. J'arrête de respirer. Ils passent au milieu des corps. Mais là, je reprends mon souffle. Ils me voient bouger, m'attrapent et me jettent dans une machine à laver qu'ils font tourner. Et là... je me réveille",
            badDream: "J'étais sur le pont d'un grand voilier avec ma copine. Tout a coup le ciel bleu devient menaçant. Je regarde autour de moi et je vois une vague d'au moins 100 mètres de haut se précipiter vers moi. J’ai très peur. il n'y a nul part où aller pour éviter la vague. Je la sers fort dans mes bras, et tout devient noir.",
            erotic: "J'avance dans un hôpital avec mon téléphone à la main et je vois une fille dans une maison toute rouge. Elle m'invite à rentrer dans la maison avec elle, elle me fait des avances mais je ne sais pas si je peux accepter parce que j'ai une copine. Au moment de conclure, je me réveille en sursaut à côté de ma copine.",
            contemplative: "En longeant un chemin encastré entre deux hautes montagnes, je vois soudainement à ma gauche deux portes en pierre qui sont, je le saurai plus tard, les portes d’une cathédrale. Elle est creusée et construite à l’intérieur de celle-ci. Les portes sont hautes de 10 à 12 mètres, c’est absolument énorme et soudainement je les vois s’ouvrir vers l’intérieur. Je suis surpris parce que la cathédrale, vu sa grandeur, est complètement illuminée, comme s’il y avait un éclairage orangé qui venait je ne saurais dire d’où.",
            unclassifiable: "Je suis un singe rose avec une tête de lama. Je suis dans un zoo et je grimpe en haut d'un arbre.  À chaque fois que quelqu'un passe, je lui crache dessus. J'arrivais pas à m'arrêter de rire"
        },
        currentFake: ''
    },
    getters: {
        isFake(state) {
            return state.isFake
        },
        fakeText(state) {
            return state.fakeText
        },
        currentFake(state) {
            return state.currentFake
        }
    },
    mutations: {
        setIsFake(state, value) {
            state.isFake = value
        },
        setCurrentFake(state, value) {
            state.currentFake = value
        }
    },
}