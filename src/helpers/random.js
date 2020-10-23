
import Seed from "seed-random";



export const polarRandom = (scale = 1, offset = 0.25) => {
    const random = (0.5 - Math.random()) * 2 * scale;
    return Math.sign(random) * offset + random;
  };
  