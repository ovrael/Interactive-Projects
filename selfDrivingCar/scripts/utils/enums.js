const ControlType = {
    User: 0,
    Traffic: 1,
    AI: 2,
}

const SelectionMethod = {
    Tournament: 'tournament',
    Roulette: 'roulette',
    TopBest: 'topBest',
    Random: 'random',
}

const CrossoverMethod = {
    Random: 'random',
    Average: 'average',
    SinglePoint: 'singlePoint',
    TwoPoint: 'twoPoint',
    RandomMultiPoint: 'randomMultiPoint',
}

const MutationMethod = {
    EveryGene: 'everyGene',
    RandomSingleLayer: 'randomSingleLayer',
    RandomMultiLayer: 'randomMultiLayer',
}