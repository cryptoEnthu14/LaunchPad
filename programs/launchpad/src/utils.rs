use anchor_lang::prelude::*;

/// Utility functions for the launchpad program

/// Calculate square root using Newton's method
pub fn sqrt(y: u128) -> u128 {
    if y == 0 {
        return 0;
    }

    let mut z = y;
    let mut x = y / 2 + 1;

    while x < z {
        z = x;
        x = (y / x + x) / 2;
    }

    z
}

/// Calculate natural logarithm approximation
pub fn ln_approx(x: u128) -> u128 {
    if x <= 1 {
        return 0;
    }

    // Simple approximation: ln(x) ≈ (x - 1) for values close to 1
    // For larger values, use iterative approach
    let mut result = 0u128;
    let mut temp = x;

    while temp > 2 {
        temp /= 2;
        result += 693147; // ln(2) * 1e6
    }

    result
}

/// Calculate exponential approximation
pub fn exp_approx(x: u128) -> u128 {
    if x == 0 {
        return 1_000_000;
    }

    // Using Taylor series: e^x = 1 + x + x^2/2! + x^3/3! + ...
    // Simplified for small values
    let x_scaled = x as u128;
    let term1 = 1_000_000u128;
    let term2 = x_scaled;
    let term3 = x_scaled.saturating_mul(x_scaled) / 2_000_000;
    let term4 = x_scaled.saturating_mul(x_scaled).saturating_mul(x_scaled) / 6_000_000_000_000;

    term1
        .saturating_add(term2)
        .saturating_add(term3)
        .saturating_add(term4)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sqrt() {
        assert_eq!(sqrt(0), 0);
        assert_eq!(sqrt(1), 1);
        assert_eq!(sqrt(4), 2);
        assert_eq!(sqrt(9), 3);
        assert_eq!(sqrt(16), 4);
        assert_eq!(sqrt(100), 10);
    }

    #[test]
    fn test_ln_approx() {
        assert_eq!(ln_approx(1), 0);
        assert!(ln_approx(2) > 0);
        assert!(ln_approx(10) > ln_approx(2));
    }

    #[test]
    fn test_exp_approx() {
        assert_eq!(exp_approx(0), 1_000_000);
        assert!(exp_approx(1_000_000) > 1_000_000);
    }
}
