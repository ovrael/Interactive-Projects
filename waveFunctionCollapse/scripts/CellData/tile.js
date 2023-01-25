class Tile {
    constructor(sides, image) {
        this.sides = sides;
        this.image = image;
    }

    rotate(rotation) {

        const imgWidth = this.image.width;
        const imgHeight = this.image.height;

        const newImage = createGraphics(imgWidth, imgHeight);
        newImage.imageMode(CENTER);
        newImage.translate(imgWidth / 2, imgHeight / 2);
        newImage.rotate(HALF_PI * rotation);
        newImage.image(this.image, 0, 0);

        const newSides = [];
        const sidesLength = this.sides.length;
        for (let i = 0; i < sidesLength; i++) {
            const sideData = this.sides[(i - rotation + sidesLength) % sidesLength];
            newSides[i] = [];
            for (let j = 0; j < sideData.length; j++) {
                newSides[i][j] = sideData[j];
            }
        }

        return new Tile(newSides, newImage);
    }
}