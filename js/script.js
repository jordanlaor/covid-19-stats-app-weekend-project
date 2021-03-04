const world = {};
let countriesData;
let covidData;
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

function drawBtns(object, type) {
  const wrapper = document.querySelector(`.btns__${type}`);
  const list = Object.keys(object).filter((key) => object[key].type === type);
  list.forEach((item) => {
    const btn = document.createElement('button');
    // TODO add to css class of btn
    btn.classList.add('btn');
    btn.textContent = item;
    wrapper.append(btn);
  });
  if (type === 'continent') {
    const btn = document.createElement('button');
    // TODO add to css class of btn
    btn.classList.add('btn');
    btn.textContent = 'World';
    wrapper.append(btn);
  }
}

async function continentClick(e) {
  // TODO add real things
  covidData = await fetchData(urls.covid);
  for (const key of Object.keys(world[e.target.textContent])) {
    const covidCountryData = world[e.target.textContent][key].filter((counryData) => counryData.);
  }
  // .forEach((country) => {
  // });
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
  drawBtns(world, 'continent');
  const btnsContinent = document.querySelector('.btns__continent');
  btnsContinent.addEventListener('click', continentClick);
}

// Window event listeners
window.addEventListener('load', handleLoad);
window.addEventListener('resize', handleResize);
