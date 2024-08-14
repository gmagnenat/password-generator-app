"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Set default values
  UI_ELEMENTS.includeLowercase.checked = true;

  // Set event listeners
  setEventListeners();

  // Set the range style on page load and generate a new password
  updateRange();
});

// UI elements
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

// Character sets
const CHAR_SETS = {
  UPPERCASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  LOWERCASE: "abcdefghijklmnopqrstuvwxyz",
  NUMBERS: "0123456789",
  SYMBOLS: "!@#$%^&*()_+{}|;:,.<>?",
};

// Add event listeners to the checkboxes and input
function setEventListeners() {
  UI_ELEMENTS.includeUppercase.addEventListener(
    "change",
    debounce(updatePassword, 300)
  );
  UI_ELEMENTS.includeLowercase.addEventListener(
    "change",
    debounce(updatePassword, 300)
  );
  UI_ELEMENTS.includeNumbers.addEventListener(
    "change",
    debounce(updatePassword, 300)
  );
  UI_ELEMENTS.includeSymbols.addEventListener(
    "change",
    debounce(updatePassword, 300)
  );
  UI_ELEMENTS.range.addEventListener("input", debounce(updateRange, 50));
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

function displayScale() {
  const strength = evaluatePasswordStrength(
    calculatePasswordEntropy(UI_ELEMENTS.password.value)
  );
  const strengthConfig = [
    { color: "#f64a4a", text: "Too Weak!" },
    { color: "#fb7c58", text: "Weak" },
    { color: "#f8cd65", text: "Medium" },
    { color: "#a4ffaf", text: "Strong" },
  ][strength - 1] || { color: "transparent", text: "" };

  UI_ELEMENTS.scaleItems.forEach((item, index) => {
    item.style.backgroundColor =
      index < strength ? strengthConfig.color : "transparent";
    item.classList.toggle("active", index < strength);
  });

  UI_ELEMENTS.strengthLevelText.textContent = strengthConfig.text;
}

// Calculate password entropy based on character set size and password length
function calculatePasswordEntropy(password) {
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()_+{}|;:,.<>?]/.test(password);

  const characterSetSize =
    (hasLowerCase ? 26 : 0) +
    (hasUpperCase ? 26 : 0) +
    (hasNumbers ? 10 : 0) +
    (hasSymbols ? 32 : 0);

  return characterSetSize ? Math.log2(characterSetSize) * password.length : 0;
}

// Evaluate password strength based on entropy
function evaluatePasswordStrength(entropy) {
  if (entropy < 50) return 1;
  if (entropy < 70) return 2;
  if (entropy < 90) return 3;
  return 4;
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
