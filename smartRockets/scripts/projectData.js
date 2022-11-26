class ProjectData {

    static SettingsName = "SmartRocketsSettings";

    // tab: Look
    // section: Canvas
    static CanvasWidth = 600;               // slider,   Width,  200, 1000, 600, 10
    static CanvasHeight = 600;              // slider,   Height,  200, 1000, 600, 10

    // section: Colors
    static BackgroundColor = '#646464';     // color,    Background,  #646464           
    static RocketColor = "#03b1fc";         // color,    Rocket,  #03b1fc
    static EliteRocketColor = "#fc0339";    // color,    Elite rocket,  #fc0339        
    static ObstacleColor = "#611196";       // color,    Obstacles,  #611196    
    static TargetColor = "#12751a";         // color,    Target,  #12751a

    // tab: Genetics
    // section: Population
    static PopulationSize = 120;            // slider,   Size,  10, 1000, 120, 10        
    static EliteUnits = 10;                 // slider,   Elite units,  0, 100, 10, 1
    static MutationChance = 0.01;           // slider,   Mutation chance,  0.0, 1.0, 0.01, 0.01        
    static BestGenesStrength = 100;         // slider,   Stronges influence,  1, 250, 100, 1        

    // section: Unit
    static Lifespan = 250;                   // slider,   Lifespan,  10, 2000, 250, 10        
    static MaxForce = 0.35;                  // slider,   Max force,  0, 5.0, 0.35, 0.01
    static MaxVelocity = 4.0;                // slider,   Max velocity,  2.0, 20.0, 4.0, 0.1    

    // section: Fitness
    static DistanceFactor = 1;              // slider,   Distance factor,  1, 100, 1, 1 
    static SpeedFactor = 10;                // slider,   Time factor,  1, 100, 10, 1 

    // tab: Debug
    static ShowDebug = true;                // checkbox, Time, true     
    static ShowPopulationDebug = true;      // checkbox, Population, true             
    static ShowRocketDebug = false;         // checkbox, All units, false         
    static ShowBestDebug = false;           // checkbox, Best unit, false         

    static Epsilon = 0.000001;
    static FitnessFactor = 100000;
    static RocketWidth = 10;
    static RocketHeight = 20;
    static TargetRange = 15;
}