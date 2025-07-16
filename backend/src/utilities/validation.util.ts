// Phone number validation
export const isValidPhone = (phone: string) =>
  /^(?:\+2)?(010|011|012|015)\d{8}$/.test(phone);

// Behavior score validation
export const isValidScore = (score: number) => score >= 1 && score <= 5;

// check if the value is true by string input
export const isTrue = (val?: string) => val?.toLowerCase() === "true";
