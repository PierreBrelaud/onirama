import { getTypeDisplay, getEmotion, getSubEmotion } from "@/utils/surveyData";

export default class RestitutionSummary {
    constructor(dreamData){
        this.dreamData = dreamData;
    }
    buildSummary(){
        const type = this.dreamData.type;
        let summary = '';
        
        // SLEEP QUALITY
        if(this.getSleepSentence(this.dreamData.sleep) !== 0) {
            summary += `Cette nuit j'ai ${this.getSleepSentence(this.dreamData.sleep)} dormi.`;
        }

        summary += ` J'ai fait `;
        // TYPE
        const typeDisplay = getTypeDisplay(type);
        if(['Cauchemar', 'Mauvais rêve'].includes(typeDisplay)) {
            summary += `un ${typeDisplay.toLowerCase()}`
        } else  {
            summary += 'un rêve ';
            if(typeDisplay === 'Vie quotidienne'){
                summary += 'ressemblant à mon quotidien'
            } else if(typeDisplay === 'Inclassifiable') {
                summary += `dont je n'arrive pas à définir la nature`
            } else {
                summary += typeDisplay.toLowerCase();
            }
        }

        // EMOTION
        const emotionsSentence = this.getEmotionsSentence(this.dreamData.emotions);
        const subEmotionsSentence = this.getSubEmotionsSentence(this.dreamData.emotions);
        if(emotionsSentence !== ''){
            summary += `, dans lequel j'ai ressenti ${emotionsSentence}. J'ai été également ${subEmotionsSentence}`
        }
        summary += '. ';

        // MEMORY
        const absurd = this.dreamData.absurd;
        const absurdSentence = this.getQuantitativeWord(absurd, 'absurde', 'censé');
        const perception = this.dreamData.perception;
        const perceptionSentence = this.getQuantitativeWord(perception, 'flou', 'net');
        summary += `Le souvenir de mon rêve était ${absurdSentence} et ${perceptionSentence}. `;

        const lucid = this.dreamData.lucidity;
        const recurrence = this.dreamData.recurrence;
        summary += this.getLucidRecurrenceSentence(lucid, recurrence);
        
        const mood = this.dreamData.mood;
        const moodSentence = this.getQuantitativeWord(mood, 'mauvaise', 'bonne');
        summary += ` Mon humeur au réveil fut ${moodSentence} `;

        const impact = this.dreamData.impact;
        const impactSentence = this.getQuantitativeWord(impact, 'faible', 'fort');
        summary += `et je crois que ce rêve a eu sur moi un impact ${impactSentence}.`;

        return summary;
    }
    getSleepSentence(sleepValue){
        if(sleepValue === -1) return 0; 
        const words = ['très mal', 'mal', 0, 'bien', 'très bien'];
        return words[sleepValue];
    }
    getQuantitativeWord(value, minWord, maxWord){
        // absurd - perception - mood - impact
        if(value >= -1 && value <= -0.5 || value >= 0.5 && value <= 1){
            if(value >= 0) {
                return `très ${maxWord}`;
            } else {
                return `très ${minWord}`;
            }
        } else {
            if(value >= 0) {
                return `plutôt ${maxWord}`;
            } else {
                return `plutôt ${minWord}`;
            } 
        }
    }
    getEmotionsSentence(emotions) {
        const listEmotions = [];
        emotions.forEach(emotion => {
            if(Object.entries(emotion).length === 0) return;
            const emoDisplay = getEmotion(emotion.emotionId).display.toLowerCase();
            const prefix = emoDisplay === 'dégout' ? 'du' : 'de la';
            const emoWithPrefix = `${prefix} ${emoDisplay}`;
            if(!listEmotions.includes(emoWithPrefix)){
                listEmotions.push(emoWithPrefix);
            }     
        });
        switch (listEmotions.length) {
            case 0 : return '';
            case 1 : return listEmotions[0];
            case 2 : return `${listEmotions[0]} et ${listEmotions[1]}`;
            case 3 : return `${listEmotions[0]}, ${listEmotions[1]} et ${listEmotions[2]}`
        }
    }
    getSubEmotionsSentence(emotions) {
        const listSubEmotions = [];
        emotions.forEach(emotion => {
            if(Object.entries(emotion).length === 0) return;
            const subEmoDisplay = getSubEmotion(emotion.emotionId, emotion.subEmotionId).display.toLowerCase();
            listSubEmotions.push(subEmoDisplay);
        });
        switch (listSubEmotions.length) {
            case 0 : return '';
            case 1 : return listSubEmotions[0];
            case 2 : return `${listSubEmotions[0]} et ${listSubEmotions[1]}`;
            case 3 : return `${listSubEmotions[0]}, ${listSubEmotions[1]} et ${listSubEmotions[2]}`;
        }
    }
    getLucidRecurrenceSentence(lucid, recurrence){
        if(lucid && recurrence){
            return 'Je me rappelle aussi que ce rêve était lucide et récurrent.';
        } else if(lucid && !recurrence){
            return 'Je me rappelle aussi que ce rêve était lucide.';
        } else if(!lucid && recurrence){
            return 'Je me rappelle aussi que ce rêve était récurrent.';
        } else {
            return '';
        }
    }
}