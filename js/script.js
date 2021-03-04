const countries = {};
const world = new Map();

// HTML elements
const canvas = document.querySelector('.graph__canvas');
const errorWrapper = document.querySelector('.error__wrapper');

function handleError(error) {
  errorWrapper.textContent = error;
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    handleError(error);
  }
}

function handleResize() {
  canvas.width = window.getComputedStyle(canvas.parentElement).width;
  canvas.height = window.getComputedStyle(canvas.parentElement).height;
}
