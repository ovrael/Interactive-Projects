class Layer2 {

	// Create the layer
	constructor(inputNeurons, outputNeurons, activationFunction) {
		this.inputNeurons = inputNeurons;
		this.outputNeurons = outputNeurons;
		this.activation = activationFunction;

		this.weights = new Array(this.inputNeurons * this.outputNeurons);
		this.biases = new Array(this.outputNeurons);

		this.costGradientW = new Array(this.weights.Length);
		this.costGradientB = new Array(this.biases.Length)

		this.weightVelocities = new Array(this.weights.Length);
		this.biasVelocities = new Array(this.biases.Length);

		randomizeWeights(rng);
	}

	// Calculate layer output activations
	calculateOutputs(inputs) {
		double[] weightedInputs = new double[outputNeurons];

		for (int nodeOut = 0; nodeOut < outputNeurons; nodeOut++)
		{
			double weightedInput = biases[nodeOut];

			for (int nodeIn = 0; nodeIn < inputNeurons; nodeIn++)
			{
				weightedInput += inputs[nodeIn] * getWeight(nodeIn, nodeOut);
			}
			weightedInputs[nodeOut] = weightedInput;
		}

		// Apply activation function
		double[] activations = new double[outputNeurons];
		for (int outputNode = 0; outputNode < outputNeurons; outputNode++)
		{
			activations[outputNode] = activation.Activate(weightedInputs, outputNode);
		}

		return activations;
	}

	// Calculate layer output activations and store inputs/weightedInputs/activations in the given learnData object
	public double[] CalculateOutputs(double[] inputs, LayerLearnData learnData) {
		learnData.inputs = inputs;

		for (int nodeOut = 0; nodeOut < outputNeurons; nodeOut++)
		{
			double weightedInput = biases[nodeOut];
			for (int nodeIn = 0; nodeIn < inputNeurons; nodeIn++)
			{
				weightedInput += inputs[nodeIn] * getWeight(nodeIn, nodeOut);
			}
			learnData.weightedInputs[nodeOut] = weightedInput;
		}

		// Apply activation function
		for (int i = 0; i < learnData.activations.Length; i++)
		{
			learnData.activations[i] = activation.Activate(learnData.weightedInputs, i);
		}

		return learnData.activations;
	}

	// Update weights and biases based on previously calculated gradients.
	// Also resets the gradients to zero.
	public void ApplyGradients(double learnRate, double regularization, double momentum) {
		double weightDecay = (1 - regularization * learnRate);

		for (int i = 0; i < weights.Length; i++)
		{
			double weight = weights[i];
			double velocity = weightVelocities[i] * momentum - costGradientW[i] * learnRate;
			weightVelocities[i] = velocity;
			weights[i] = weight * weightDecay + velocity;
			costGradientW[i] = 0;
		}


		for (int i = 0; i < biases.Length; i++)
		{
			double velocity = biasVelocities[i] * momentum - costGradientB[i] * learnRate;
			biasVelocities[i] = velocity;
			biases[i] += velocity;
			costGradientB[i] = 0;
		}
	}

	// Calculate the "node values" for the output layer. This is an array containing for each node:
	// the partial derivative of the cost with respect to the weighted input
	public void CalculateOutputLayerNodeValues(LayerLearnData layerLearnData, double[] expectedOutputs, ICost cost) {
		for (int i = 0; i < layerLearnData.nodeValues.Length; i++)
		{
			// Evaluate partial derivatives for current node: cost/activation & activation/weightedInput
			double costDerivative = cost.CostDerivative(layerLearnData.activations[i], expectedOutputs[i]);
			double activationDerivative = activation.Derivative(layerLearnData.weightedInputs, i);
			layerLearnData.nodeValues[i] = costDerivative * activationDerivative;
		}
	}

	// Calculate the "node values" for a hidden layer. This is an array containing for each node:
	// the partial derivative of the cost with respect to the weighted input
	public void CalculateHiddenLayerNodeValues(LayerLearnData layerLearnData, Layer oldLayer, double[] oldNodeValues) {
		for (int newNodeIndex = 0; newNodeIndex < outputNeurons; newNodeIndex++)
		{
			double newNodeValue = 0;
			for (int oldNodeIndex = 0; oldNodeIndex < oldNodeValues.Length; oldNodeIndex++)
			{
				// Partial derivative of the weighted input with respect to the input
				double weightedInputDerivative = oldLayer.getWeight(newNodeIndex, oldNodeIndex);
				newNodeValue += weightedInputDerivative * oldNodeValues[oldNodeIndex];
			}
			newNodeValue *= activation.Derivative(layerLearnData.weightedInputs, newNodeIndex);
			layerLearnData.nodeValues[newNodeIndex] = newNodeValue;
		}

	}

	public void UpdateGradients(LayerLearnData layerLearnData) {
		// Update cost gradient with respect to weights (lock for multithreading)
		lock(costGradientW)
		{
			for (int nodeOut = 0; nodeOut < outputNeurons; nodeOut++)
			{
				double nodeValue = layerLearnData.nodeValues[nodeOut];
				for (int nodeIn = 0; nodeIn < inputNeurons; nodeIn++)
				{
					// Evaluate the partial derivative: cost / weight of current connection
					double derivativeCostWrtWeight = layerLearnData.inputs[nodeIn] * nodeValue;
					// The costGradientW array stores these partial derivatives for each weight.
					// Note: the derivative is being added to the array here because ultimately we want
					// to calculate the average gradient across all the data in the training batch
					costGradientW[getFlatWeightIndex(nodeIn, nodeOut)] += derivativeCostWrtWeight;
				}
			}
		}

		// Update cost gradient with respect to biases (lock for multithreading)
		lock(costGradientB)
		{
			for (int nodeOut = 0; nodeOut < outputNeurons; nodeOut++)
			{
				// Evaluate partial derivative: cost / bias
				double derivativeCostWrtBias = 1 * layerLearnData.nodeValues[nodeOut];
				costGradientB[nodeOut] += derivativeCostWrtBias;
			}
		}
	}

	getWeight(nodeIn, nodeOut) {
		const flatIndex = nodeOut * this.inputNeurons + nodeIn;
		return weights[flatIndex];
	}

	getFlatWeightIndex(inputNeuronIndex, outputNeuronIndex) {
		return outputNeuronIndex * this.inputNeurons + inputNeuronIndex;
	}

	randomizeWeights() {

		for (let i = 0; i < this.weights.Length; i++) {
			this.weights[i] = randomInNormalDistribution(0, 1) / Math.sqrt(inputNeurons);
		}

		function randomInNormalDistribution(mean, standardDeviation) {
			const x1 = 1 - Math.random();
			const x2 = 1 - Math.random();

			const y1 = Math.sqrt(-2.0 * Math.log(x1)) * Math.cos(2.0 * Math.PI * x2);

			return y1 * standardDeviation + mean;
		}
	}
}

