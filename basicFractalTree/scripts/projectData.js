class ProjectData {

    static SettingsName = 'FractalTreesSettings';

    // tab: Appereance
    // section: Canvas
    static CanvasWidth = 600;               // slider,   Width,  200, 1920, 600, 10
    static CanvasHeight = 600;              // slider,   Height,  200, 1080, 600, 10
    static BackgroundColor = '#646464';     // color,    Background,  #646464


    // section: Tree colors
    static RealColors = true;               // checkbox, Real colors, true        
    static TreeColor = '#0390fc';           // color,    Tree color,  #0390fc            

    // section: Tree fruit
    static ShowFruit = true;                // checkbox, Show, true                
    static FruitSize = 8;                  // slider,   Size,  2, 32, 8, 1    
    static FruitColor = '#ff9029';          // color,    Color,  #ff9029

    static CurrentLevel = 5;
    static MaxLevel = 16;
    static MinLevel = 1;

    // section: Tree growth
    static GrowthAngle = 45;                // slider,   Angle,  0, 360, 45, 1
    static GrowthChange = 0.75;             // slider,   Size change,  0.2, 2.0, 0.75, 0.01
    static StartBranchLength = 150;         // slider,   Start branch length,  50, 500, 150, 10    
    static TrunkLength = 180;               // slider,   Trunk height,  10, 500, 180, 10


    // tab: Forces
    // section: Wind
    static ApplyWind = false;               // checkbox, Apply, false
    static WindDirection = 'right';          // select,   Direction, right, left
    static WindPowerX = 2.1;                // slider,   X power,  0, 5.0, 2.1, 0.1
    static WindPowerY = 2.5;                // slider,   Y power,  0, 5.0, 2.5, 0.1
    static WindNoiseChangeX = 0.2;          // slider,   Noise change X,  0, 5.0, 0.2, 0.1
    static WindNoiseChangeY = 0.0;          // slider,   Noise change Y,  0, 5.0, 0.0, 0.1
    static LooseFruit = true;

    // section: Jitter
    static ApplyJitter = false;             // checkbox, Apply, false
    static JitterPowerX = 3;              // slider,   X power,  0, 5.0, 3, 0.01
    static JitterPowerY = 1;              // slider,   Y power,  0, 5.0, 1, 0.01

    static MaxTreeBackVelocity = 2.5;
    static MaxTreeVelocity = 2.5;

    // tab: Animation
    static Animate = false;                 // checkbox, Animate, false
    static MaxAnimateLevel = 9;             // slider,   Max level,  4, 12, 8, 1
    static RecreateTree = true;             // checkbox, Recreate tree, true
    static GrowthRateInMs = 500;            // slider,   Growth time in miliseconds,  100, 1000, 500, 10    
    static NewRandom = true;                // checkbox, Random new tree, true
    static RandomAngle = 0;
    static RandomGrowthChange = 0;
    static RandomStartBranchLength = 0;
    static RandomFruitColor = '#000000';
    static RandomFruitSize = 0;
}