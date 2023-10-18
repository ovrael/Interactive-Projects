class ProjectData {

    // UNTOUCHABLE
    static SettingsName = 'DuckGeneratorSettings';
    static CanvasWidth = 1000;
    static CanvasHeight = 700;
    static BackgroundColor = '#646464';

    // tab: Head
    // section: Shape
    static HeadWidth = 50;                 // slider,   Width,  5, 100, 50, 1
    static HeadHeight = 40;                // slider,   Height, 5, 100, 40, 1
    static HeadLength = 60;                // slider,   Length, 5, 100, 60, 1

    // section: Beak
    static BeakColor = '#ffdc46';          // color,    Color,  #ffdc46
    static BeakWidth = 30;                 // slider,   Width,  1, 50, 30, 1
    static BeakHeight = 5;                 // slider,   Height, 1, 50, 5, 1
    static BeakLength = 16;                // slider,   Length, 1, 50, 16, 1

    // tab: Body
    // section: Shape
    static BodyColor = '#e6e6e6';           // color,    Color,  #e6e6e6
    static BodyWidth = 60;                 // slider,   Width,  5, 100, 60, 1
    static BodyHeight = 50;                // slider,   Height, 5, 100, 50, 1
    static BodyLength = 90;                // slider,   Length, 5, 100, 90, 1

    // section: Wings
    static WingWidth = 5;                 // slider,   Width,  5, 100, 5, 1
    static WingHeight = 30;                // slider,   Height, 5, 100, 30, 1
    static WingLength = 60;                // slider,   Length, 5, 100, 60, 1

    // section: Tail
    static TailWidth = 25;                 // slider,   Width,  1, 100, 25, 1
    static TailHeight = 5;                // slider,   Height, 1, 100, 5, 1
    static TailLength = 30;                // slider,   Length, 1, 100, 30, 1
    static TailAngle = 20;                // slider,   Angle, 10, 50, 20, 1

    // tab: Legs
    // section: Shape
    static LegColor = '#fab432';            // color,    Color,  #fab432
    static LegHeight = 30;                 // slider,   Height,  5, 100, 30, 1
    static LegSpacing = 40;                // slider,   Spacing,  5, 100, 40, 1

    // section: Fingers
    static LegFingerColor = '#d28c00';      // color,    Color,  #d28c00
    static LegFingerLength = 20;           // slider,   Length, 10, 50, 20, 1
    static LegFingerAngle = 35;            // slider,   Angle, 20, 60, 35, 1
}