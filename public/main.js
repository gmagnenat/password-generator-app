"use strict";

const password = document.querySelector(".input-password");
const btnGenerate = document.querySelector(".btn-generate");
const btnCopy = document.querySelector(".btn-copy");
const range = document.querySelector(".input-range");
const scale = document.querySelector(".scale");
const scaleItems = document.querySelectorAll(".scale-item");
const strengthLevelText = document.querySelector(".strength-level-text");

const includeUppercase = document.querySelector(".include-uppercase");
const includeLowercase = document.querySelector(".include-lowercase");
const includeNumbers = document.querySelector(".include-numbers");
const includeSymbols = document.querySelector(".include-symbols");
const togglePasswordVisibility = document.querySelector(
  ".toggle-password-visibility"
);

range.addEventListener("input", rangeValue);

function rangeValue() {
  const value = range.value;
  const target = document.querySelector(".range-value");
  target.innerHTML = value;
}

btnGenerate.addEventListener("click", (e) => {
  e.preventDefault();

  const length = range.value;
  password.value = generateRandomString(length);
  let passwordEntropy = calculatePasswordEntropy(password.value);
  let passwordStrengh = evaluatePasswordStrength(passwordEntropy);

  displayScale();

  console.log(`Generated password of length ${length}: ${password.value}`);
  console.log(`Entropy level is: ${passwordEntropy}`);
  console.log(`Password strength is: ${passwordStrengh}`);
  password.focus();
});

btnCopy.addEventListener("click", async (e) => {
  e.preventDefault();

  if (password.value === "") {
    alert("There is no password to copy!");
    return;
  }

  try {
    await navigator.clipboard.writeText(password.value);
    alert("Password copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
});

password.addEventListener("focus", () => {
  password.type = "text";
});

password.addEventListener("blur", () => {
  password.type = "password";
});

function displayScale() {
  const strength = evaluatePasswordStrength(
    calculatePasswordEntropy(password.value)
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
  scale.querySelectorAll(".scale-item").forEach((item) => {
    item.style.backgroundColor = "transparent";
  });

  // set rating lines color
  for (let i = 0; i < strength; i++) {
    scaleItems[i].style.backgroundColor = scaleColor;
  }

  strengthLevelText.textContent = pwStrength;
}

function generateRandomString(length) {
  let characters = "";

  if (includeUppercase.checked) {
    characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  if (includeLowercase.checked) {
    characters += "abcdefghijklmnopqrstuvwxyz";
  }
  if (includeNumbers.checked) {
    characters += "0123456789";
  }
  if (includeSymbols.checked) {
    characters += "!@#$%^&*()_+{}|;:,.<>?";
  }

  if (characters === "") {
    alert("Please select at least one character set");
    return "";
  }

  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  return randomString;
}

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
