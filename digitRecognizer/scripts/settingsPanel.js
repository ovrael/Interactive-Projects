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
            ProjectData.ShouldShuffle = Boolean(checkbox.checked);

            break;

        case 'addOriginalDigit':
            ProjectData.AddOriginalDigit = Boolean(checkbox.checked);

            break;

        default:

            console.warn('Cant find checkbox variable for: ' + checkbox.dataset.variable);

            break;

    }
    saveSettings(ProjectData.SettingsName);
}

// CREATE FUNCTIONS

function randNeuronsNumber() {
    const neurons = [8, 16, 32, 64, 128, 256, 512];
    return neurons[Math.floor(Math.random() * neurons.length)];
}

function addLayerData() {
    ProjectData.LayersData.push(
        Layer.Dense(randNeuronsNumber(), ActivationFunction.leakyRelu(), WeightsRegulizer.L1_L2(0, 0)),
    );

    createLayersTab();
}

function removeLayerData(layerIndex) {
    ProjectData.LayersData.splice(layerIndex, 1);

    createLayersTab();
}

function createLayersTab() {

    const layersDataContainer = document.getElementById("layersDataContainer");
    layersDataContainer.innerHTML = '';

    for (let i = 0; i < ProjectData.LayersData.length; i++) {
        const layerData = ProjectData.LayersData[i];

        let layerDataHTML = `<div id="layer${i}" class="col-12 layerDataContainer" data-index="${i}">`;
        layerDataHTML += createLayerDataDiv(i, layerData);
        layerDataHTML += '</div>';

        layersDataContainer.innerHTML += layerDataHTML;
    }
}

function createLayerDataDiv(layerIndex, layerData) {
    let newLayerDivContent = "";

    switch (layerData.type) {

        case LayerType.Input:
            newLayerDivContent += createTypeSelect(layerIndex, layerData.type);
            newLayerDivContent += createNeruonsInputWithData(layerData.neurons, layerIndex);
            break;

        case LayerType.Dense:
            newLayerDivContent += createTypeSelect(layerIndex, layerData.type);
            newLayerDivContent += createActivationSelectWithData(layerData.getActivationName(), layerIndex);
            newLayerDivContent += createNeruonsInputWithData(layerData.neurons, layerIndex);
            newLayerDivContent += createRegulizerInputWithData(layerData.getRegulizerData(), layerIndex);
            break;

        case LayerType.Dropout:
            newLayerDivContent += createTypeSelect(layerIndex, layerData.type);
            newLayerDivContent += createDropoutInputWithData(layerData.dropoutRate, layerIndex);
            break;

        default:
            console.warn("WRONG LAYER TYPE!:" + layerData.type);
            break;

    }

    return newLayerDivContent;
}

function createTypeSelect(layerIndex, layerType) {
    return '<div class="row" data-layerinfo="type">' +
        '<div class="col-4">' +
        'Type' +
        '</div>' +
        '<div class="col-6">' +
        '<div class="mb-3">' +
        '<select class="form-select form-select-lg"' +
        'onchange="changeLayerType(this)"' +
        `name="" id="" data-layerindex="${layerIndex}">` +
        getLayerTypesOptions(layerType) +
        '</select>' +
        '</div>' +
        '</div>' +
        '<div class="col-2">' +
        '<button type="button" class="removeLayerButton"' +
        'aria-label="Remove"' +
        'onclick="removeLayerData(this.dataset.layerindex)"' +
        `data-layerindex="${layerIndex}">` +
        '<i class="bi bi-x-lg"></i>' +
        '</button>' +
        '</div>' +
        '</div>';
}

function getLayerTypesOptions(selectedType) {
    let options = '';

    for (const [key, value] of Object.entries(LayerType)) {
        options += `<option ${selectedType === value ? 'selected' : ''} value="${value}">${value}</option>`;
    }

    return options;
}

function createNeruonsInputWithData(neurons, layerIndex) {
    return `<div class="row layerDataRow" data-layerinfo="neurons">` +
        ' <div class="col-4">' +
        ' Neurons' +
        ' </div>' +
        ' <div class="col-8">' +
        ' <input class="customInput" type="text"' +
        '     placeholder="Number of neurons" step="1"' +
        `     min="1" max="1024" value="${neurons}" oninput="changeNumericData(this)" data-layerinfo="neurons" data-layerindex="${layerIndex}"/>` +
        ' </div>' +
        ' </div>';
}

function createActivationSelectWithData(activationName, layerIndex) {
    return '<div class="row" data-layerinfo="activation">' +
        '<div class="col-4">' +
        'Activation' +
        '</div>' +
        '<div class="col-8">' +
        '<div class="mb-3">' +
        '<select class="form-select form-select-lg"' +
        `name="" id="" onchange="changeActivationFunction(this)" data-layerindex="${layerIndex}">` +
        getActivationsOptionsWithData(activationName) +
        '</select>' +
        '</div>' +
        '</div>' +
        '</div>';
}

function getActivationsOptionsWithData(selectedActivation) {
    let options = '';

    for (const [key, value] of Object.entries(ActivationFunctionNames)) {
        options += `<option ${selectedActivation == value ? 'selected' : ''} value="${value}">${value}</option>`;
    }

    return options;
}

function createRegulizerInputWithData(regularizationData, layerIndex) {
    return '<div class="row layerDataRow" data-layerinfo="regularization">' +
        ' <div class="col-4">' +
        ' Regularization' +
        ' </div>' +
        ' <div class="col-1">' +
        'L1=' +
        ' </div>' +
        ' <div class="col-3">' +
        ' <input class="customInput" type="text"' +
        '     placeholder="L1" step="0.01"' +
        `     min="0" max="1" value="${regularizationData[0]}" oninput="changeNumericData(this)" data-layerinfo="regularizationL1" data-layerindex="${layerIndex}"/>` +
        ' </div>' +
        ' <div class="col-1">' +
        'L2=' +
        ' </div>' +
        ' <div class="col-3">' +
        ' <input class="customInput" type="text"' +
        '     placeholder="L2" step="0.01"' +
        `     min="0" max="1" value="${regularizationData[1]}" oninput="changeNumericData(this)" data-layerinfo="regularizationL2" data-layerindex="${layerIndex}"/>` +
        ' </div>' +
        ' </div>';
}

function createDropoutInputWithData(chance, layerIndex) {
    return '<div class="row layerDataRow" data-layerinfo="dropoutChance">' +
        ' <div class="col-4">' +
        ' Dropout chance' +
        ' </div>' +
        ' <div class="col-8">' +
        ' <input class="customInput" type="text"' +
        '     placeholder="Chance to dropout neuron" step="0.01"' +
        `     min="0" max="1" value="${chance}" oninput="changeNumericData(this)" data-layerinfo="dropout" data-layerindex="${layerIndex}"/>` +
        ' </div>' +
        ' </div>';
}

// CHANGES FUNCTIONS
function changeLayerType(select) {
    const newValue = select.value;
    const layerIndex = select.dataset.layerindex;

    if (layerIndex < 0 || layerIndex >= ProjectData.LayersData.length)
        return;

    let neurons = 0;
    switch (newValue) {
        case LayerType.Input:
            neurons = ProjectData.LayersData[layerIndex].neurons > 0 ? ProjectData.LayersData[layerIndex].neurons : 28 * 28;
            ProjectData.LayersData[layerIndex] = Layer.Input(neurons);
            break;

        case LayerType.Dense:
            neurons = ProjectData.LayersData[layerIndex].neurons > 0 ? ProjectData.LayersData[layerIndex].neurons : randNeuronsNumber();
            ProjectData.LayersData[layerIndex] = Layer.Dense(neurons, ActivationFunction.leakyRelu(),);
            break;

        case LayerType.Dropout:
            ProjectData.LayersData[layerIndex] = Layer.Dropout(0.5);
            break;

        default:
            break;
    }
    ProjectData.LayersData[layerIndex].type = newValue;
    createLayersTab();
}

function changeActivationFunction(select) {
    const newValue = select.value;
    const layerIndex = select.dataset.layerindex;


    if (layerIndex < 0 || layerIndex >= ProjectData.LayersData.length)
        return;

    const layerData = ProjectData.LayersData[layerIndex];

    const wr = new WeightsRegulizer(layerData.weightsRegulizer.l1, layerData.weightsRegulizer.l2);
    ProjectData.LayersData[layerIndex] = Layer.Dense(layerData.neurons, newValue, wr);
    createLayersTab();
}

function changeNumericData(input) {
    if (input.value.length > 0) {
        input.value = validateNumberInput(input.value, input.dataset.layerinfo);
    }

    if (input.value.length == 0) return;

    if (isNaN(input.value)) {
        console.warn(`Something wrong? ${input.value}`);
        return;
    }

    const layerIndex = input.dataset.layerindex;
    switch (input.dataset.layerinfo) {
        case "neurons":
            ProjectData.LayersData[layerIndex].neurons = input.value;
            break;
        case "dropout":
            ProjectData.LayersData[layerIndex].dropoutRate = input.value;
            break;
        case "regularizationL1":
            ProjectData.LayersData[layerIndex].weightsRegulizer = new WeightsRegulizer(input.value, ProjectData.LayersData[layerIndex].weightsRegulizer.l2);
            break;
        case "regularizationL2":
            ProjectData.LayersData[layerIndex].weightsRegulizer = new WeightsRegulizer(ProjectData.LayersData[layerIndex].weightsRegulizer.l1, input.value);
            break;
    }
    // createLayersTab();
}


function validateNumberInput(value, type) {

    if (type == "neurons") {
        const lastChar = value.at(-1);
        if (isNaN(lastChar))
            value = value.slice(0, value.length - 1);

        if (Number(value) > 1024)
            value = '1024';
        else if (Number(value) <= 0)
            value = '1';

        return value;
    }

    if (type == 'dropout' || type == 'regularizationL1' || type == 'regularizationL2') {
        const lastChar = value.at(-1);
        if (isNaN(lastChar)) {
            value = value.slice(0, value.length - 1);

            if (lastChar == '.' && !value.includes('.')) {
                value += lastChar;
            }

        }

        if (value.at(-1) != '.') {
            if (Number(value) >= 1.0)
                value = '1';
            else if (Number(value) <= 0.0)
                value = '0';
        }

        return value;
    }
}

// COMPILE FUNCTIONS
function createOptimizer() {
    let optimizer = undefined;
    switch (ProjectData.OptimizerName) {
        case 'sgd':
            optimizer = Optimizer.sgd(ProjectData.LearningRate, ProjectData.OptimizerMomentum, ProjectData.OptimizerWeightsDecay);
            break;

        case 'adam':
            optimizer = Optimizer.adam(ProjectData.LearningRate, ProjectData.OptimizerBeta1, ProjectData.OptimizerBeta2, ProjectData.OptimizerEpsilon, ProjectData.OptimizerWeightsDecay);
            break;

        case 'rmsProp':
            optimizer = Optimizer.rmsProp(ProjectData.LearningRate, ProjectData.OptimizerMomentum, ProjectData.OptimizerWeightsDecay, ProjectData.OptimizerEpsilon);
            break;

        default:
            optimizer = Optimizer.sgd(0.001, 0.9, 0.075);
            break;
    }
    return optimizer;
}

function getCostFunction() {
    let costFunction = undefined;
    switch (ProjectData.CostFunctionName) {
        case 'crossentropy':
            costFunction = CostFunction.crossentropy();
            break;

        case 'mse':
            costFunction = CostFunction.meanSquaredError();
            break;

        default:
            costFunction = CostFunction.crossentropy();
            break;
    }
    return costFunction;
}

function compileModel() {

    const optimizer = createOptimizer();
    const costFunction = getCostFunction();
    const neuralNetwork = new NeuralNetwork(costFunction, optimizer);

    for (let i = 0; i < ProjectData.LayersData.length; i++) {
        const layerData = ProjectData.LayersData[i];
        neuralNetwork.addLayer(layerData);
    }

    ProjectData.Model = neuralNetwork;
}