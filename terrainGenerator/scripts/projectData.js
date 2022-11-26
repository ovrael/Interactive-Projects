class ProjectData {

    static SettingsName = 'TerrainGeneratorSettings';

    // tab: appearance
    // sectionF: Canvas
    static CanvasWidth = 600;               // slider,   Width,  100, 1920, 600, 10
    static CanvasHeight = 600;              // slider,   Height,  100, 1080, 600, 10                              
    static BackgroundColor = '#000000';     // color,    Canvas background color,  #000000

    // section: Terrain
    static DrawTerrainLines = true;        // checkbox, Draw terrain line, true   
    static TerrainLineColor = '#ffffff';    // color,    Terrain lines color,  #ffffff

    static FillTerrain = false;              // checkbox, Fill terrain, false                          
    static MainColor = 'none';              // select,   Main color, none, none, red, green, blue
    static RedFill = 150;                   // slider,   Red amount,  0, 255, 150, 1
    static GreenFill = 90;                  // slider,   Green amount,  0, 255, 90, 1
    static BlueFill = 90;                   // slider,   Blue amount,  0, 255, 90, 1

    // tab: generator
    // section: Terrain
    static MaxHeight = 800;                 // slider,   Max height,  500, 2000, 800, 10                            
    static TerrainScale = 70;               // slider,   Terrain scale,  20, 120, 70, 1                                
    static TerrainColumnsOffset = 50;       // slider,   Extra terrain width,  0, 100, 50, 1                                        
    static TerrainRowsOffset = 50;          // slider,   Extra terrain length,  0, 100, 50, 1                                    

    // section: Camera
    static FlyingSpeed = 0.05;              // slider,   Flying speed,  0, 1, 0.05, 0.001
    static CameraHeight = 1000;              // slider,   Camera height,  0, 2000, 1000, 10                              
    static CameraAngle = 85;                // slider,   Camera angle,  0, 110, 85, 1                                

    // section: Noise
    static XNoiseOffset = 0.05;             // slider,   X noise offset,  0.01, 0.1, 0.05, 0.01
    static YNoiseOffset = 0.05;             // slider,   Y noise offset,  0.01, 0.1, 0.05, 0.01
    static NoiseFunction = 'p5Noise'        // select,   Noise function, Simplex, Simplex, Perlin, P5Noise
}