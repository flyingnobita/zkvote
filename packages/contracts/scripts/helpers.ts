// Helper Functions
// ========================================================
/**
 *
 * @param hex
 * @returns array of bytes
 */
export const hexToBytes = (hex: string) => {
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    /**
     * @dev parseInt 16 = parsed as a hexadecimal number
     */
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
};

/**
 * @dev Little-Endian: https://learnmeabitcoin.com/technical/little-endian
 * "Little-endian" refers to the order in which bytes of information can be processed by a computer.
 * @param bytes array of numbers for bytes
 * @returns number
 */
export const fromLittleEndian = (bytes: number[]) => {
  const n256 = BigInt(256);
  let result = BigInt(0);
  let base = BigInt(1);
  bytes.forEach((byte) => {
    result += base * BigInt(byte);
    base = base * n256;
  });
  return result;
};


