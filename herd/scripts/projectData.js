class ProjectData {

    // CANVAS SETTINGS
    // tab: mixed
    // sectionF: Canvas 
    static CanvasWidth = 600;               // slider,   Width,  100, 1000, 600, 10
    static CanvasHeight = 600;              // slider,   Height, 100, 1000, 600, 10
    static BackgroundColor = '#646464';     // color,    Color,  #646464
    static Pause = false;

    // QUADTREE
    // section: Quadtree 
    static QuadtreeAutomateData = true;     // checkbox, Autocompute parameters, true
    static QuadtreeCapacity = 32;           // slider,   Capacity,  2, 64, 32, 2   
    static QuadtreeMaxDepth = 4;            // slider,   Max depth,  0, 16, 4, 1   
    static Accuracy = 16;                   // slider,   Accuracy,  0, 256, 128, 1

    // HERD
    // section: Herd 
    static MaxHerdSize = 2000;
    static HerdSize = 300;                  // slider,   Size,  1, 2000, 300, 10
    static ClickCreateCount = 8;            // slider,   Created units on click,  0, 64, 8, 1

    // UNIT
    // tab: look
    // section: Draft
    static UnitType = 'triangle';              // select,   Type, point, triangle
    static DrawTail = false;                // checkbox, Draw tail, false
    static UnitFill = true;                 // checkbox, Fill, true

    // section: Size
    static UnitRandomSize = true;           // checkbox, Random size, true
    static UnitMinSize = 5;
    static UnitMaxSize = 18;
    static UnitSize = 7;                    // slider,   Size,  4, 32, 7, 1

    // section: Color
    static UnitRandomColor = false;           // checkbox, Random color, false
    static UnitColor = '#4396d1';           // color,    Color,  #4396d1
    static ColorBasedOnSpeed = false;       // checkbox, Color based on speed, false
    static MaxSpeedColor = {
        red: 150,
        green: 75,
        blue: 0
    };
    static MinSpeedColor = {
        red: 20,
        green: 160,
        blue: 70
    };

    // tab: behaviour
    // section: Movement
    static HardBoundary = false;            // checkbox, Bouncy boundaries, false
    static UseMass = true;                  // checkbox, Units have mass, true
    static UnitRandomMove = false;          // checkbox, Add random move, false

    static UnitMinSpeed = 0.1;              // slider,   Min speed,  0, 2, 0.1, 0.1
    static UnitMaxSpeed = 2;                // slider,   Max speed,  2, 8, 2.0, 0.1

    // section: Search distance
    static AlignSearchDistance = 25;        // slider,   Align,  0, 200, 25, 1
    static CohesionSearchDistance = 50;     // slider,   Cohesion,  0, 200, 50, 1
    static SeparationSearchDistance = 24;   // slider,   Separation,  0, 200, 24, 1

    // section: Forces
    static UnitMaxForce = 0.4;              // slider,   Max power,  0.1, 2, 0.4, 0.1
    static UnitAlignForce = 1.5;            // slider,   Align power,  0.1, 3, 1.5, 0.1
    static UnitCohesionForce = 1;           // slider,   Cohesion power,  0.1, 3, 1.0, 0.1
    static UnitSeparationForce = 2;         // slider,   Separation power,  0.1, 3, 2.0, 0.1


    // DEBUG
    // tab: debug
    static ShowDebug = false;                // checkbox, Show debug data, false
    static ShowDebugAlign = false;          // checkbox, Show debug align force, false
    static ShowDebugCohesion = false;       // checkbox, Show debug cohesion force, false
    static ShowDebugSeparation = false;     // checkbox, Show debug separation force, false
}