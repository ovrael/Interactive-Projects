class DataManage {

    static split(data, targets, ratio) {
        const splitData = { trainX: [], trainY: [], testX: [], testY: [] };
        const testMax = data.length * (1 - ratio);

        const dataCopy = [...data];
        const targetsCopy = [...targets];


        while (dataCopy.length > 0) {

            const i = Math.floor(Math.random() * dataCopy.length);
            const x = dataCopy.splice(i, 1)[0];
            const y = targetsCopy.splice(i, 1)[0];

            if (splitData.testX.length < testMax) {
                if (Math.random() > 0.5) {
                    splitData.trainX.push(x);
                    splitData.trainY.push(y);
                }
                else {
                    splitData.testX.push(x);
                    splitData.testY.push(y);
                }
            }
            else {
                splitData.trainX.push(x);
                splitData.trainY.push(y);
            }
        }

        return splitData;
    }

    static shuffle(data, targets) {
        const shuffledData = { data: [], targets: [] };
        const dataCopy = [...data];
        const targetsCopy = [...targets];

        while (dataCopy.length > 0) {

            const i = Math.floor(Math.random() * dataCopy.length);
            const x = dataCopy.splice(i, 1)[0];
            const y = targetsCopy.splice(i, 1)[0];

            shuffledData.data.push(x);
            shuffledData.targets.push(y);
        }

        return shuffledData;
    }

    static #deepCopy(data, targets) {
        const deepCopy = { data: [], targets: [] };

        for (let i = 0; i < data.length; i++) {
            deepCopy.data.push(data[i]);
            deepCopy.targets.push(targets[i]);
        }
    }
}