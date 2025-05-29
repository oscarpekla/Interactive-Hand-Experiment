class Word {
    constructor(wordString) {

        this.objW;
        this.objH;
        this.word = wordString;
        this.wIMG; // image containing a Word string

        this.wIMG = createGraphics(200, 200); //DISPLAYS THE WORD --- IS USED AS TEXTURE FOR bIMG
       
        this.isNegativeX;
        this.isNegativeY;

        this.isActive = false;

        this.corA = createVector(0, 0, 0, 0);
        this.corB = createVector(0, 0, 0, 0);
        this.corC = createVector(0, 0, 0, 0);
        this.corD = createVector(0, 0, 0, 0);

    }

    calcWordWidth() {
        let H = 200;
        this.wIMG.textAlign(CENTER, CENTER);
        textSize(H);
        this.wIMG.textSize(H);
        textFont(PPTelegrafUltraBold);
        this.wIMG.textFont(PPTelegrafUltraBold);
        this.wIMG.resizeCanvas(this.wIMG.textWidth(this.word) + 30, H * 0.75);
    }
    createWord() {
        this.calcWordWidth();
        this.wIMG.background(bgColor);
        this.wIMG.fill(txtColor);
        this.wIMG.text(this.word, (this.wIMG.width / 2) - 8, (this.wIMG.height / 2) - (this.wIMG.height * 0.2) );
        
    }

    showWord(temp_corA, temp_corB, temp_corC, temp_corD, n) {
       
    }

    meshhere(p1, p2, p3, p4, n) {
        let invN = 1 / n; // Avoid repeated division
        let Ax = p1.x, Ay = p1.y;
        let Bx = p2.x, By = p2.y;
        
        for (let y = 0; y < n; y++) {
            this.bIMG.beginShape(TRIANGLE_STRIP);

            let v = y * invN;
            let vNext = (y + 1) * invN;
            let t = (y + 1) * invN; // Store the (y+1)/n value for reuse

            let Cx = lerp(p2.x, p3.x, t);
            let Cy = lerp(p2.y, p3.y, t);
            let Dx = lerp(p1.x, p4.x, t);
            let Dy = lerp(p1.y, p4.y, t);

            for (let x = 0; x <= n; x++) {
                let u = x * invN;
                let tX = x * invN; // Store x/n for reuse

                let ABx = lerp(Ax, Bx, tX);
                let ABy = lerp(Ay, By, tX);
                let DCx = lerp(Dx, Cx, tX);
                let DCy = lerp(Dy, Cy, tX);

                this.bIMG.vertex(ABx, ABy, u, v);   // Top row
                this.bIMG.vertex(DCx, DCy, u, vNext); // Bottom row
            }

            this.bIMG.endShape();
            // Update points for the next row
            Ax = Dx;
            Ay = Dy;
            Bx = Cx;
            By = Cy;
        }
    }

}



