"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Set default values
  UI_ELEMENTS.includeLowercase.checked = true;

  // Set event listeners
  setEventListeners();

  // Set the range style on page load and generate a new password
  updateRange();
});

const UI_ELEMENTS = {
  password: document.querySelector(".output-password"),
  btnGenerate: document.querySelector(".btn-generate"),
  btnCopy: document.querySelector(".btn-copy"),
  range: document.querySelector(".input-range"),
  scale: document.querySelector(".scale"),
  scaleItems: document.querySelectorAll(".scale-item"),
  strengthLevelText: document.querySelector(".strength-level-text"),
  includeUppercase: document.querySelector(".include-uppercase"),
  includeLowercase: document.querySelector(".include-lowercase"),
  includeNumbers: document.querySelector(".include-numbers"),
  includeSymbols: document.querySelector(".include-symbols"),
  togglePasswordVisibility: document.querySelector(
    ".toggle-password-visibility"
  ),
};

const CHAR_SETS = {
  UPPERCASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  LOWERCASE: "abcdefghijklmnopqrstuvwxyz",
  NUMBERS: "0123456789",
  SYMBOLS: "!@#$%^&*()_+{}|;:,.<>?",
};

// Add event listeners to the checkboxes and input
function setEventListeners() {
  UI_ELEMENTS.includeUppercase.addEventListener("change", updatePassword);
  UI_ELEMENTS.includeLowercase.addEventListener("change", updatePassword);
  UI_ELEMENTS.includeNumbers.addEventListener("change", updatePassword);
  UI_ELEMENTS.includeSymbols.addEventListener("change", updatePassword);
  UI_ELEMENTS.range.addEventListener("input", updateRange);
  UI_ELEMENTS.btnGenerate.addEventListener("click", handleGenerateClick);
  UI_ELEMENTS.btnCopy.addEventListener("click", handleCopyClick);
}

// Update range style based on the value
function updateRange() {
  const min = UI_ELEMENTS.range.min;
  const max = UI_ELEMENTS.range.max;
  const currentValue = UI_ELEMENTS.range.value;

  updatePassword();

  UI_ELEMENTS.range.style.backgroundSize =
    ((currentValue - min) * 100) / (max - min) + "% 100%";
}

// Generate new password and update scale
function updatePassword() {
  UI_ELEMENTS.password.value = generatePassword();

  // refresh password strength scale
  displayScale();
}

// Generate a random password of given length
function generatePassword() {
  const length = UI_ELEMENTS.range.value;
  return generateRandomString(length);
}

// Generate a random new password
UI_ELEMENTS.btnGenerate.addEventListener("click", (e) => {
  e.preventDefault();

  UI_ELEMENTS.password.value = generatePassword();

  displayScale();

  UI_ELEMENTS.btnCopy.focus();
});

// Allow user to copy the password to clipboard
UI_ELEMENTS.btnCopy.addEventListener("click", async (e) => {
  e.preventDefault();

  if (UI_ELEMENTS.password.value === "") {
    alert("There is no password to copy!");
    return;
  }

  try {
    await navigator.clipboard.writeText(UI_ELEMENTS.password.value);
    alert("Password copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
});

// Update strength scale style based on password strength
function displayScale() {
  const strength = evaluatePasswordStrength(
    calculatePasswordEntropy(UI_ELEMENTS.password.value)
  );

  let pwStrength = "";

  let scaleColor = "";

  switch (strength) {
    case 1:
      scaleColor = "#f64a4a";
      pwStrength = "Too Weak!";
      break;
    case 2:
      scaleColor = "#fb7c58";
      pwStrength = "Weak";
      break;
    case 3:
      scaleColor = "#f8cd65";
      pwStrength = "Medium";
      break;
    case 4:
      scaleColor = "#a4ffaf";
      pwStrength = "Strong";
      break;
    default:
      scaleColor = "transparent";
  }

  // clear rating lines
  UI_ELEMENTS.scale.querySelectorAll(".scale-item").forEach((item) => {
    item.style.backgroundColor = "transparent";
    item.classList.remove("active");
  });

  // set rating lines color
  for (let i = 0; i < strength; i++) {
    UI_ELEMENTS.scaleItems[i].style.backgroundColor = scaleColor;
    UI_ELEMENTS.scaleItems[i].classList.add("active");
  }

  UI_ELEMENTS.strengthLevelText.textContent = pwStrength;
}

// Generate a random string based on selected character sets
function generateRandomString(length) {
  let characters = "";

  if (UI_ELEMENTS.includeUppercase.checked) {
    characters += CHAR_SETS.UPPERCASE;
  }
  if (UI_ELEMENTS.includeLowercase.checked) {
    characters += CHAR_SETS.LOWERCASE;
  }
  if (UI_ELEMENTS.includeNumbers.checked) {
    characters += CHAR_SETS.NUMBERS;
  }
  if (UI_ELEMENTS.includeSymbols.checked) {
    characters += CHAR_SETS.SYMBOLS;
  }

  if (characters === "") {
    alert("Please select at least one character set");
    return "";
  }

  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
}

function handleGenerateClick(e) {
  e.preventDefault();
  updatePassword();
  UI_ELEMENTS.btnCopy.focus();
}

async function handleCopyClick(e) {
  e.preventDefault();

  if (UI_ELEMENTS.password.value === "") {
    alert("There is no password to copy!");
    return;
  }

  try {
    await navigator.clipboard.writeText(UI_ELEMENTS.password.value);
    alert("Password copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}

// Calculate password entropy based on character set size and password length
function calculatePasswordEntropy(password) {
  let characterSetSize = 0;

  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()_+{}|;:,.<>?]/.test(password);

  if (hasLowerCase) characterSetSize += 26;
  if (hasUpperCase) characterSetSize += 26;
  if (hasNumbers) characterSetSize += 10;
  if (hasSymbols) characterSetSize += 32; // Assuming 32 commonly used symbols

  if (characterSetSize === 0) return 0; // No valid character types found

  const entropy = Math.log2(characterSetSize) * password.length;
  return entropy;
}

// Evaluate password strength based on entropy
function evaluatePasswordStrength(entropy) {
  let strengthLevel = 0;

  if (entropy < 50) {
    strengthLevel = 1;
  } else if (entropy < 70) {
    strengthLevel = 2;
  } else if (entropy < 90) {
    strengthLevel = 3;
  } else {
    strengthLevel = 4;
  }

  return strengthLevel;
}
