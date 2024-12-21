/**
 * @title Shamir's Secret Sharing Implementation
 * @difficulty intermediate
 * @tags cli
 * @run <url>
 * @group Cryptography
 *
 * This example demonstrates Shamir's Secret Sharing, where a secret, split into shares, allows its
 * reconstruction only when a sufficient number of shares are combined.
 */

// Random Number Generation within a range
async function getSecureRandom(min: number, max: number): Promise<number> {
  const range = max - min;
  const buffer = new Uint8Array(4);
  crypto.getRandomValues(buffer);
  const randomValue = new DataView(buffer.buffer).getUint32(0);
  return min + (randomValue % range);
}

// Finding the value of the polynomial at x
function evaluatePolynomial(coefficients: number[], x: number): number {
  return coefficients.reduce(
    (result, coeff, power) => result + coeff * Math.pow(x, power),
    0,
  );
}

// Generates shares based on the secret and threshold
async function generateShares(
  secret: number,
  totalShares: number,
  threshold: number,
) {
  // Generate random coefficients for the polynomial
  const coefficients = [secret];
  for (let i = 1; i < threshold; i++) {
    coefficients.push(await getSecureRandom(1, 1000));
  }

  const usedXValues = new Set<number>();
  const shares = [];

  // Generate unique random x values for shares
  while (shares.length < totalShares) {
    const x = await getSecureRandom(1, 1000);
    if (!usedXValues.has(x)) {
      usedXValues.add(x);
      shares.push({
        x,
        y: evaluatePolynomial(coefficients, x),
      });
    }
  }

  return { shares, coefficients };
}

// Secret Reconstuction from a subset of shares using Lagrange interpolation
function reconstructSecret(shares: Array<{ x: number; y: number }>): number {
  const secret = shares.reduce((sum, share, i) => {
    let product = share.y;
    for (let j = 0; j < shares.length; j++) {
      if (i !== j) {
        product *= shares[j].x / (shares[j].x - share.x);
      }
    }
    return sum + product;
  }, 0);

  return Math.round(secret);
}

const secret = 12345;
const totalShares = 5;
const threshold = 3;

// Generate shares
const { shares, coefficients } = await generateShares(
  secret,
  totalShares,
  threshold,
);
console.log("Generated Shares:", shares);

// Select random subset of shares to reconstruct the secret
const selectedIndices = new Set<number>();
while (selectedIndices.size < threshold) {
  selectedIndices.add(await getSecureRandom(0, totalShares));
}

const selectedShares = Array.from(selectedIndices).map((index) =>
  shares[index]
);
console.log("Selected Shares for Reconstruction:", selectedShares);

// Reconstruct the secret
const reconstructedSecret = reconstructSecret(selectedShares);
console.log("Original Secret:", secret);
console.log("Reconstructed Secret:", reconstructedSecret);
