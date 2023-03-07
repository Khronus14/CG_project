class Circle extends cgIShape {

    constructor(a) {
        super();
        this.makeCircle(a);
    }

    makeCircle(a) {
        a < 3 && (a = 3);
        const t = 360 / a;
        let h, r, n, e;
        let u, v = 360;
        let g, N, T, C;
        for (u = 0; u < a; u++) {
            h = (g = .5 * Math.cos(radians(v))) + .5;
            r = (N = .5 * Math.sin(radians(v))) + .5;
            n = (T = .5 * Math.cos(radians(v - t))) + .5;
            e = (C = .5 * Math.sin(radians(v - t))) + .5;
            this.addTriangle(T, 0, C, 0, 0, 0, g, 0, N);
            this.addNormal(0, 1, 0, 0, 1, 0, 0, 1, 0);
            this.adduv(n, 1 - e, .5, .5, h, 1 - r);
            v -= t;
        }
    }
}

class Square extends cgIShape {

    constructor(a) {
        super();
        this.makeSquare(a)
    }

    makeSquare(a) {
        this.addTriangle(-.5,-.5,0,-.5 + a,-.5,0,-.5 + a,-.5 + a,0);
        this.addNormal(0,0,1,0,0,1,0,0,1);
        this.adduv(0,0,a,0,a,a);

        this.addTriangle(-.5 + a,-.5 + a,0,-.5,-.5 + a,0,-.5,-.5,0);
        this.addNormal(0,0,1,0,0,1,0,0,1);
        this.adduv(a,a,0,a,0,0);
    }
}