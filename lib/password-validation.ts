/**
 * Password strength validation utilities
 */

export interface PasswordStrength {
  score: number; // 0-4 (weak to very strong)
  feedback: string[];
  isValid: boolean;
}

/**
 * Validates password strength according to industry best practices
 */
export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  // Check minimum length
  if (password.length < 12) {
    feedback.push('Password should be at least 12 characters long');
  } else {
    score += 1;
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    feedback.push('Add lowercase letters');
  } else {
    score += 1;
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add uppercase letters');
  } else {
    score += 1;
  }

  // Check for numbers
  if (!/[0-9]/.test(password)) {
    feedback.push('Add numbers');
  } else {
    score += 1;
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Add special characters (!@#$%^&*...)');
  } else {
    score += 1;
  }

  // Check for common patterns
  const commonPasswords = [
    'password', '12345678', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome'
  ];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    feedback.push('Avoid common words and patterns');
    score = Math.max(0, score - 2);
  }

  // Check for sequential characters
  if (/(?:abc|bcd|cde|012|123|234|345)/i.test(password)) {
    feedback.push('Avoid sequential characters');
    score = Math.max(0, score - 1);
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Avoid repeated characters');
    score = Math.max(0, score - 1);
  }

  // Minimum score required is 3 (out of 5 possible points)
  const isValid = score >= 3 && password.length >= 12;

  return {
    score: Math.min(4, score), // Cap at 4
    feedback: feedback.length > 0 ? feedback : ['Strong password!'],
    isValid,
  };
}

/**
 * Gets a user-friendly strength label
 */
export function getStrengthLabel(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return 'Unknown';
  }
}

/**
 * Gets color for strength indicator
 */
export function getStrengthColor(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-blue-500';
    case 4:
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
}
