class UserManage {
    constructor(text) {
        this.text = text;
        this.active = true;

        this.animateUpDown = true;
        this.animateRotation = false;
        this.animateSize = false;

        this.upDownAnimation = new TextAnimaiton(AnimationType.UpDown);
        this.rotateAnimation = new TextAnimaiton(AnimationType.Rotate);
        this.sizeAnimation = new TextAnimaiton(AnimationType.Size);

        this.reachedMax = false;
    }

    animateText() {
        push();

        textSize(64);
        textAlign(CENTER, CENTER)

        if (this.animateUpDown) {
            this.upDownAnimation.animate(this.text);
            this.animateUpDown = !this.upDownAnimation.reachedMax;
            this.animateRotation = this.upDownAnimation.reachedMax;
        }

        if (this.animateRotation) {
            this.rotateAnimation.animate(this.text);
            this.animateRotation = !this.rotateAnimation.reachedMax;
            this.animateSize = this.rotateAnimation.reachedMax;
        }

        if (this.animateSize) {
            this.sizeAnimation.animate(this.text);
            this.animateSize = !this.sizeAnimation.reachedSecondMax;
        }

        this.reachedMax = this.sizeAnimation.reachedSecondMax;

        pop();
    }
}

const AnimationType =
{
    UpDown: "upDown",
    Rotate: "rotate",
    Size: "size"
}

class TextAnimaiton {
    constructor(type) {

        this.reachedMax = false;

        switch (type) {
            case AnimationType.UpDown:
                this.angle = 0;
                this.angleChange = 0.000;
                this.angleChangeChange = 0.001;
                this.maxAngleChange = 0.6;
                this.animate = this.upDown;
                break;

            case AnimationType.Rotate:
                this.angle = 0;
                this.angleChange = 0.001;
                this.angleChangeChange = 0.002;
                this.maxAngleChange = 0.8;
                this.animate = this.rotate;
                break;

            case AnimationType.Size:
                this.size = 64;
                this.angle = 0;
                this.angleChange = 0.001;
                this.angleChangeChange = 0.001;
                this.maxAngleChange = 0.4;
                this.smalling = false;

                this.sizeChangeSpeed = 0.3;
                this.sizeChangeChangeSpeed = 0.05;
                this.reachedSecondMax = false;

                this.animate = this.sizeAnimation;
                break;

            default:
                break;
        }
    }

    upDown(animateText) {
        const yOffset = Math.sin(this.angle);
        text(animateText, ProjectData.CanvasWidth / 2, ProjectData.CanvasWidth / 2 + yOffset * 20);
        this.#changeAngle();
    }

    rotate(animateText) {

        translate(ProjectData.CanvasWidth / 2, ProjectData.CanvasWidth / 2);
        rotate(-this.angle);

        text(animateText, 0, 0);
        this.#changeAngle();
    }

    sizeAnimation(animateText) {

        push();
        if (!this.reachedMax) {

            const sizeChange = Math.sin(this.angle);

            const newSize = this.size + sizeChange * 15;
            textSize(newSize);

            text(animateText, ProjectData.CanvasWidth / 2, ProjectData.CanvasWidth / 2);

            this.#changeAngle();
            if (this.reachedMax) {
                this.smalling = true;
                this.size = newSize;
            }
        }
        else {

            textSize(this.size);
            text(animateText, ProjectData.CanvasWidth / 2, ProjectData.CanvasWidth / 2);

            if (this.smalling) {
                if (this.size < 0.5)
                    this.smalling = false;
                this.size -= 0.2;
            }
            else {
                this.size += this.sizeChangeSpeed;
                this.sizeChangeSpeed += this.sizeChangeChangeSpeed;

                if (this.size > 8000)
                    this.reachedSecondMax = true;
            }
        }
        pop();
    }

    #changeAngle() {
        this.angle += this.angleChange;

        if (this.angleChange <= this.maxAngleChange)
            this.angleChange += this.angleChangeChange;
        this.reachedMax = this.angleChange >= this.maxAngleChange;
    }
}