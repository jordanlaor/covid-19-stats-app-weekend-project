const world = {
  buildWorld(data) {
    console.log(data);
  },
};
let countriesData;
const urls = {
  // FIXME fix cors problem
  countries: 'https://restcountries.herokuapp.com/api/v1',
  covid: 'https://corona-api.com/countries',
};

// HTML elements
const canvas = document.querySelector('#graph__canvas');
const canvasWrapper = document.querySelector('.graph__wrapper');
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
  // FIXME Why the canvas re-size doesnt work??
  canvas.width = parseInt(window.getComputedStyle(canvasWrapper).width);
  canvas.height = parseInt(window.getComputedStyle(canvasWrapper).height);
}

async function handleLoad() {
  handleResize();
  // TODO change to const
  countriesData = await fetchData(urls.countries);
  countriesData.forEach((country) => {
    if (!world[country.region]) {
      world[country.region] = {
        type: 'continent',
      };
    }
    world[country.region][country.name.common] = {
      code: country.cca2,
      type: 'country',
      total: {},
      new: {},
    };
  });
}

// Window event listeners
window.addEventListener('load', handleLoad);
window.addEventListener('resize', handleResize);
