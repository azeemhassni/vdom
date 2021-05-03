export function zip(y, x) {
    const zipped = [];
    for (let i = 0; i < Math.min(y.length,x.length); i++) {
        zipped.push([y[i], x[i]]);
    }

    return zipped;
}