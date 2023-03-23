function sliderChange(slider) {

document.getElementById(slider.dataset.variable + 'Text').innerHTML = Number(slider.value);

switch (slider.dataset.variable) {

case 'drawDigitStroke':
ProjectData.DrawDigitStroke = Number(slider.value);

break;

case 'trainDataSpeed':
ProjectData.TrainDataSpeed = Number(slider.value);

break;

case 'wrongDataSpeed':
ProjectData.WrongDataSpeed = Number(slider.value);

break;

case 'samplesPerDigit':
ProjectData.SamplesPerDigit = Number(slider.value);

break;

case 'splitFraction':
ProjectData.SplitFraction = Number(slider.value);

break;

case 'oversamplesPerDigit':
ProjectData.OversamplesPerDigit = Number(slider.value);

break;

case 'maxRotateAngle':
ProjectData.MaxRotateAngle = Number(slider.value);

break;

case 'horizontallyShiftChance':
ProjectData.HorizontallyShiftChance = Number(slider.value);

break;

case 'verticallyShiftChance':
ProjectData.VerticallyShiftChance = Number(slider.value);

break;

case 'noiseSize':
ProjectData.NoiseSize = Number(slider.value);

break;

case 'noiseStrength':
ProjectData.NoiseStrength = Number(slider.value);

break;

case 'trainBatchSize':
ProjectData.TrainBatchSize = Number(slider.value);

break;

case 'learningRate':
ProjectData.LearningRate = Number(slider.value);

break;

case 'optimizerMomentum':
ProjectData.OptimizerMomentum = Number(slider.value);

break;

case 'optimizerWeightsDecay':
ProjectData.OptimizerWeightsDecay = Number(slider.value);

break;

case 'optimizerBeta1':
ProjectData.OptimizerBeta1 = Number(slider.value);

break;

case 'optimizerBeta2':
ProjectData.OptimizerBeta2 = Number(slider.value);

break;

case 'optimizerEpsilonPower':
ProjectData.OptimizerEpsilonPower = Number(slider.value);

break;

default:

console.log('Cant find ProjectData.' + slider.dataset.variable);

break;

}
saveSettings(ProjectData.SettingsName);
}

function selectChange(select) {

switch (select.id) {

case 'normalizationMethodSelect':
ProjectData.NormalizationMethod = select.value;

break;

case 'costFunctionNameSelect':
ProjectData.CostFunctionName = select.value;

break;

case 'optimizerNameSelect':
ProjectData.OptimizerName = select.value;

break;

default:

console.warn('Cant find selectChange for: ' + select.id);

break;

}
saveSettings(ProjectData.SettingsName);
}

function checkboxChange(checkbox) {

switch (checkbox.dataset.variable) {

case 'shouldShuffle':
ProjectData.ShouldShuffle =Boolean(checkbox.checked);

break;

case 'addOriginalDigit':
ProjectData.AddOriginalDigit =Boolean(checkbox.checked);

break;

default:

console.warn('Cant find checkbox variable for: ' + checkbox.dataset.variable);

break;

}
saveSettings(ProjectData.SettingsName);
}

