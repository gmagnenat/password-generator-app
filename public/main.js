"use strict";

const password = document.querySelector(".input-password");
const btnGenerate = document.querySelector(".btn-generate");
const range = document.querySelector(".input-range");

range.addEventListener("change", () => {
  password.value = range.value;
});

btnGenerate.addEventListener("click", (e) => {
  e.preventDefault();

  console.log(range.value);
});
