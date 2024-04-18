


const bitmask32 = BigInt(0b11111111111111111111111111111111);

function rotateLeft32(n: bigint, bits: number): bigint {
    let shifted = n << 32n;
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
            seed += BigInt(Math.random() * bit32);
            seed <<= 32n;
            seed += BigInt(Math.random() * bit32);
            seed <<= 32n;
            seed += BigInt(Math.random() * bit32);
            seed <<= 32n;
            seed += BigInt(Math.random() * bit32);
        }
        if (seed < 0n) {
            seed = -seed;
        }
        this.state = seed;
    }
    
    private s(i: number): bigint {
        return (this.state << BigInt((2 ** 23)*i)) & bitmask32;
    }
    
    
    public nextU32(): number {
        let res = wrappingAdd32(rotateLeft32(wrappingAdd32(this.s(0), this.s(3)), 3), this.s(0));
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
    
    
    public nextInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(this.nextFloat() * (max - min) + min);
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

