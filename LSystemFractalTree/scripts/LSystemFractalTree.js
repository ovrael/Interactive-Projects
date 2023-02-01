class LSystemFractalTree {
    constructor() {
        this.level = 0;
    }

    draw(systemLInstructions) {

        if (systemLInstructions.length == 0) {
            console.warn("No instructions!")
            return;
        }

        background(90);
        resetMatrix();
        translate(width / 2, height);

        for (let i = 0; i < systemLInstructions.length; i++) {
            const letter = systemLInstructions.charAt(i);

            switch (letter) {
                case 'F':
                    line(0, 0, 0, -ProjectData.CurrentBranchLength);
                    translate(0, -ProjectData.CurrentBranchLength);
                    break;
                case '+':
                    rotate(ProjectData.RotateAngle);
                    break;
                case '-':
                    rotate(-ProjectData.RotateAngle);
                    break;
                case '[':
                    push();
                    break;
                case ']':
                    pop();
                    break;
            }
        }
    }
}