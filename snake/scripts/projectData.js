class ProjectData {
    static BoardColor = "#3f9139";
    static SnakeColor = "#faed37";
    static SnakeHeadColor = shadeColor(ProjectData.SnakeColor, 60);
    static SnakeTailColor = shadeColor(ProjectData.SnakeColor, -20);
    static FoodColor = "#eb4e15";

    static BoardFieldsWidth = 15;
    static BoardFieldsHeight = 15;
    static BoardFieldSize = 25;
    static MaxFood = 5;
    static Speed = 8;

    static PlayerName = 'Player 1';

    static Pause = false;
    static GameOver = false;
}