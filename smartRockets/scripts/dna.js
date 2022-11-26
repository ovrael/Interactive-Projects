class DNA {
    constructor(genes) {
        if (genes) {
            this.genes = genes;
            return;
        }

        this.genes = [];
        for (let i = 0; i < ProjectData.Lifespan; i++) {
            this.genes.push(
                p5.Vector.random2D()
            );

            this.genes[i].setMag(ProjectData.MaxForce);
        }
    }
}