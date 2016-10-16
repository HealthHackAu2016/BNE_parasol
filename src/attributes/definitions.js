import { numericValue, booleanValue, stringValue } from './dataTypes';

function Attributes() {
	this._attributes = {};
}

/**
  Returns an attribute definition
 **/
Attributes.prototype.get = function(id) {
	return this._attributes[id];
};

/**
  Defines an attribute definition
 **/
Attributes.prototype.define = function(definition) {
	if (!definition || !definition.id) throw new Error('Invalid attribute definition');
	if (this.get(definition.id)) throw new Error(`A definition already exists for ${definition.id}`);
	this._attributes[definition.id] = definition;
};

let attributes = new Attributes();
attributes.define(numericValue('TIMP'));
attributes.define(numericValue('ELFScore', { header: 'ELF Score'}));
attributes.define(booleanValue('ELFScoreLow', { header: '<7.7'}));
attributes.define(booleanValue('ELFScoreMedium', { header: '7.7-<9.8'}));
attributes.define(booleanValue('ELFScoreHigh', { header: '>9.8'}));
attributes.define(numericValue('APRI'));
attributes.define(booleanValue('APRILow', { header: 'APRI >=0.5' }));
attributes.define(booleanValue('APRIHigh', { header: 'APRI >=1.5' }));
attributes.define(numericValue('FinalFibrosis', { header: 'Final Fibrosis', min: 0, max: 4 }));
attributes.define(numericValue('Height'));
attributes.define(numericValue('LBXWeight', { header: 'Weight at LBx' }));
attributes.define(numericValue('BMI'));
attributes.define(numericValue('BMICategory', { header: 'Under (0), Normal (1), Overwt (2), Obese (3). Ethnic specific.', min: 0, max: 4 }));
attributes.define(numericValue('LBXWaistCircumfernce', { header: 'Waist circ. at LBx' }));
attributes.define(stringValue('Ethnicity', { valid: ['caucasian', 'asian', 'other', 'atsi', 'african']}))
attributes.define(numericValue('EthnicityCode', { header: 'Ethnicity Code' }));
attributes.define(stringValue('CountryOrigin', { header: 'Country of Origin'}));
attributes.define(numericValue('LiverDiagnosis', { header: 'Actual Liver Diagnosis '}));
attributes.define(stringValue('FinalDiagnosis', {
	header: 'FINAL DIAGNOSIS TXT', valid: ['hcv', 'nash', 'hlb', 'ald', 'mtx', 'hbv', 'aih', 'hfe']
}));
attributes.define(numericValue('OtherLiverDiseaseCofactor', { header: 'Other Liver Disease Cofactor'}));


module.exports = attributes;