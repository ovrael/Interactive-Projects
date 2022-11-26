class ProjectData {
    // TRAFFIC
    static RoadLanes = 5;
    static RoadWidth = 300;
    static TrafficCarsCount = 8;

    static RandomTrafficColor = false;
    static TrafficCarColor = "#30a6d9";
    static AICarColor = "#822b24";
    static EliteAICarColor = "#e08814";

    static TrafficAcceleration = 0.2;
    static TrafficMaxSpeed = 3.5;

    static AIAcceleration = 0.2;
    static AIMaxSpeed = 5;

    static CarFriction = 0.06;
    static SteeringStrength = 0.03;

    // AI CAR
    static SensorRaysCount = 8;
    static SensorRaysLength = 150;
    static SensorRaysSpread = Math.PI / 2;
    static StartingRoadLane = 2;
    static RandomStartingLane = false;

    // GENETIC ALGORITHM
    static SelectionMethod = SelectionMethod.Tournament;
    static CrossoverMethod = CrossoverMethod.Random;
    static MutationMethod = MutationMethod.EveryGene;

    static PopulationSize = 100;
    static ParentsCount = 8;
    static EliteUnits = 4;
    static MutationChance = 0.3;
    static MutationAmount = 0.3;

}