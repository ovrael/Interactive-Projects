class ProjectData {

    static SettingsName = 'MarchingSquaresSettings';

    // tab: appearance
    // sectionF: Canvas size
    static CanvasWidth = 600;           // slider,   Width,  100, 1920, 600, 10
    static CanvasHeight = 600;          // slider,   Height,  100, 1080, 600, 10

    // section: Colors
    static MainColor = 'none';          // select,   Main color, none, none, red, green, blue
    static RedFill = 255;               // slider,   Red amount,  0, 255, 255, 1
    static GreenFill = 90;              // slider,   Green amount,  0, 255, 90, 1
    static BlueFill = 90;               // slider,   Blue amount,  0, 255, 90, 1

    static BackgroundColor = '#000000'; // color,    Canvas background color,  #000000
    static LineColor = '#ffffff';       // color,    Squares line color,  #ffffff

    // section: Field
    static SquareSize = 10;             // slider,   Squares size,  3, 50, 10, 1
    static DrawLines = true;            // checkbox, Draw lines, true
    static DrawFields = true;           // checkbox, Draw fields, true
    static SmoothSquares = false;       // checkbox, Apply smoothness, false
    static HardBoundaries = false;      // checkbox, Hard boundaries, false

    // tab: noise function
    // section: Base
    static NoiseFunction = 'simplex'    // select,   Noise function, Simplex, Simplex, Perlin, Worley - Euclidean, Worley - Manhattan
    static IsFractalNoise = false;      // checkbox, Apply fractal noise, false
    static FractalOctaves = 2;          // slider,   Fractal octaves,  1, 8, 2, 1
    static XNoiseOffset = 0.1;          // slider,   X noise offset,  0.01, 1, 0.1, 0.01
    static YNoiseOffset = 0.1;          // slider,   Y noise offset,  0.01, 1, 0.1, 0.01
    static ZNoiseChange = 0.02;         // slider,   Z noise offset (speed),  0, 1, 0.02, 0.001

    // section: Worley equation
    static Worley0 = '+';               // select,   First value, +, none, +, -
    static WorleyOperator0 = '-';       // select,   First operator, -, -, +, *
    static Worley1 = 'none';            // select,   Second value, none, none, +, -
    static WorleyOperator1 = '-';       // select,   Second operator, -, -, +, *
    static Worley2 = 'none';            // select,   Third value, none, none, +, -

    static Worley0Sign = 1;
    static Worley1Sign = 0;
    static Worley2Sign = 0;

    static Worley0Function = Mathematics.subtract;
    static Worley1Function = Mathematics.subtract;
}