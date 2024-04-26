


const bitmask32 = BigInt(0b11111111111111111111111111111111);

function rotateLeft32(n: bigint, bits: number): bigint {
    let shifted = n << BigInt(bits);
    let overhang = (shifted & (~bitmask32)) >> 32n;
    return shifted + overhang;
}

function wrappingAdd32(a: bigint, b: bigint): bigint {
    return (a + b) % BigInt(2**32);
}

/**
 * Adaptation of the xoshiro128++ rng in the rust rand crate.
 */
export class RNG {
    private state: bigint;
    
    /**
     * Expects a 128 bit (preferably random) number as the seed. If undefined, creates a seed with Math.random.
     * Don't use 0 as a seed.
     */
    constructor(seed?: bigint) {
        if (! seed) {
            const bit32 = 2 ** 32;
            seed = 0n;
            for (let i = 0; i<32*4; i++) {
                if (Math.random() < 0.5) {
                    seed |= 1n;
                }
                seed <<= 1n;
            }
        }
        if (seed < 0n) {
            seed = -seed;
        }
        this.state = seed;
    }
    
    private s(i: number): bigint {
        return (this.state >> BigInt(32 * i)) & bitmask32;
    }
    
    /**
     * Returns a random 32bit integer.
     */
    public nextU32(): number {
        let res = wrappingAdd32(rotateLeft32(wrappingAdd32(this.s(0), this.s(3)), 7), this.s(0));
        let t = this.s(1) << 9n;
        let s2 = (this.s(2) ^ this.s(0)) % BigInt(2**32);
        let s3 = (this.s(3) ^ this.s(1)) % BigInt(2**32);
        let s1 = (this.s(1) ^ s2) % BigInt(2**32);
        let s0 = (this.s(0) ^ s3) % BigInt(2**32);
        
        s2 = (s2 ^ t) % BigInt(2**32);
        s3 = rotateLeft32(s3, 11);
        this.state = s0 + (s1 << 32n) + (s2 << 64n) + (s3 << 96n);
        
        return Number(BigInt.asUintN(32, res));
    }
    
    /**
     * Returns a float in the range min (inclusive) to max (exclusive).
     * Min and max default to 0 and 1 respectively.
     */
    public nextFloat(min?: number, max?: number): number {
        if (! min) {
            min = 0;
        }
        if (! max) {
            max = 1;
        }
        return (this.nextU32() / (2 ** 32)) * (max - min) + min;
    }
    
    /**
     * Returns an integer in the range of ceil(min) (inclusive) to floor(max) (exclusive).
     */
    public nextInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(this.nextU32() % (max - min) + min);
    }
    
    /**
     * Returns a boolean with a 1:1 chance.
     */
    public nextBool(): boolean {
        return this.nextInt(0, 2) == 1;
    }
    
    /**
     * Chooses and index from a normalized list of weighted probabilities (All entries are in the range 0-1 and add up to 1).
     * 
     * @example choose([0.25, 0.25, 0.5]) // chooses 0 or 1 with a probability of 25% each or 2 with a probability of 50%.
     * 
     */
    public choose(weights: number[]): number {
        let r = this.nextFloat();
        for (let i = 0; i<weights.length; i++) {
            if (r < weights[i]) {
                return i;
            }
            r -= weights[i];
        }
        return 0;
    }
    
    
    /**
     * Serializes the RNG state into a hexadecimal BigInt string.
     */
    public serialize(): string {
        return "0x" + this.state.toString(16);
    }
    
    /**
     * Deserializes an RGN from a BigInt string.
     */
    public static deserialize(state: string): RNG {
        return new RNG(BigInt(state));
    }
    
}

