/**

 -- constantes
CLASSES : classes à appliquer pour mettre en forme le texte

 -- variables
 
text : tout le text brut
textLabeled: objet contenant les mots labellisés (type + value) + spans pour l'affichage

-- fonctions

splitText : split le text
c

 */

import { isSpecialChar } from './textHelper.js'

export default class LabelingHelper {
	_text = null
	_textLabeled = []
	_previoustextLabeled = []

	LABELS = {
		special: { label: "special", canBeLabeled: false },
		default: { label: "default", canBeLabeled: true },
		action: { label: "action", canBeLabeled: true },
		person: { label: "person", canBeLabeled: true },
		place: { label: "place", canBeLabeled: true },
	}

	_finalData = {
		action: { label: "action", words: [], count: 0 },
		person: { label: "person", words: [], count: 0},
		place: { label: "place", words: [], count: 0},
    }

	constructor() {
		this._wordCount = 0
	}

	set text(text) {
		this._text = text
		this._onTextUpdated()
	}

	get textLabeled() {
		return this._textLabeled
	}

	getFinalData() {
		//clear
		this._finalData = {
			action: { label: "action", words: [], count: 0 },
			person: { label: "person", words: [], count: 0 },
			place: { label: "place", words: [], count: 0 },
		};
		
		this._textLabeled.forEach(el => {
            let dataLabel = this._finalData[el.label]
            if (dataLabel) {
				dataLabel.words.push(el.value)
                dataLabel.count = dataLabel.count + 1
			}
        })
		return this._finalData
	}

	labelWord(wordData, label) {
		var wordIndex = this._textLabeled.findIndex((x) => x.id == wordData.id)
		this._textLabeled[wordIndex].label = this.LABELS[label].label
	}

	_onTextUpdated = () => {
		if (!this._text) return
		//split text
		const splittedText = this._text.split(" ")

		//store precious values & clear
		this._previoustextLabeled = this._textLabeled
		this._textLabeled = []

		//store each words and label
		splittedText.forEach((word) => {
			this._manageWord(word)
		})
	}

	_manageWord = (word) => {
		//get first char
		const firstChar = word.charAt(0)
		//get last char
		const lastChar = word.charAt(word.length - 1)

		//check if first char is special char & store
		if (isSpecialChar(firstChar) && firstChar !== "") {
			this._storeWord(firstChar, this.LABELS.special)
			word = word.slice(1, word.length)
		}

		//check if last char is special char & store
		if (isSpecialChar(lastChar) && lastChar !== "") {
			this._storeWord(lastChar, this.LABELS.special)
			word = word.slice(0, word.length - 1)
		}

		//store word
		if (word !== "") {
			this._storeWord(word, this.LABELS.default)
		}
	}

	_storeWord(word, type) {
		let wordData = {
			id: this._wordCount,
			value: word,
			label: type.label,
			canBeLabeled: type.canBeLabeled,
		}
		this._previoustextLabeled.forEach((el) => {
			if (el.value === word && el.label !== "default") {
				wordData.label = el.label
			}
		})
		this._textLabeled.push(wordData)
		this._wordCount++
	}
}