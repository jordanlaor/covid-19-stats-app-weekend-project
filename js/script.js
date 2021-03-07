const world = {};
const countries = {};
let chart;
let currentGraph;
const urls = {
  countries: 'https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1',
  covid: 'https://corona-api.com/countries',
};

const options = {
  normal: {
    elements: {
      point: {
        backgroundColor: 'transparent',
        borderColor: '#00000040',
        borderWidth: 1,
        radius: 2,
      },
    },
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },

  date: {
    elements: {
      point: {
        backgroundColor: 'transparent',
        borderColor: '#00000040',
        borderWidth: 1,
        radius: 2,
      },
    },
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      xAxes: [
        {
          type: 'time',
          reverse: 'false',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'dd - MM - yy',
            },
          },
        },
      ],
    },
  },
};

// HTML elements
const canvas = document.querySelector('#graph__canvas');
const errorWrapper = document.querySelector('.error__wrapper');

function handleError(error) {
  errorWrapper.textContent = error;
  setTimeout(() => (errorWrapper.textContent = ''), 3000);
  console.error(error);
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
  canvas.classList.add('hidden');
  setTimeout(() => canvas.classList.remove('hidden'), 0);
}

function drawChart(type, labels, datasets, chartOptions) {
  if (!chart) {
    chart = new Chart(canvas, {
      type,
      data: {
        labels,
        datasets,
      },
      chartOptions,
    });
  } else {
    chart.data = {
      labels,
      datasets,
    };
    chart.options = chartOptions;
    chart.update();
  }
}

function resetBtns(type) {
  const wrapper = document.querySelector(`.btns__${type}`);
  wrapper.innerHTML = '';
}

function drawBtns(object, type) {
  const wrapper = document.querySelector(`.btns__${type}`);
  const list = Object.keys(object).filter((key) => object[key].type === type);
  list.forEach((item) => {
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.textContent = item;
    wrapper.append(btn);
  });
  if (type === 'continent') {
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.textContent = 'World';
    wrapper.append(btn);
  }
}

function fromDayTo10(array) {
  const oncePer10 = [];
  for (let i = array.length - 1; i >= 0; i -= 10) {
    oncePer10.unshift(array[i]);
  }
  return oncePer10;
}

async function countryClick(e) {
  if (currentGraph !== e.target.textContent) {
    currentGraph = e.target.textContent;
    try {
      const covidData = await fetchData(
        `${urls.covid}/${world[countries[e.target.textContent]][e.target.textContent].code}`
      );
      const labels = [];
      const dataCritical = [];
      const dataConfirmed = [];
      const dataNewConfirmed = [];
      const dataDeaths = [];
      const dataNewDeaths = [];
      const dataRecovered = [];
      const dataNewRecovered = [];
      covidData.data.timeline.forEach((update) => {
        labels.push(new Date(update.date));
        dataConfirmed.push({ x: new Date(update.date), y: update.confirmed });
        dataNewConfirmed.push({ x: new Date(update.date), y: update.new_confirmed });
        dataDeaths.push({ t: new Date(update.date), y: update.deaths });
        dataNewDeaths.push({ t: new Date(update.date), y: update.new_deaths });
        dataRecovered.push({ t: new Date(update.date), y: update.recovered });
        dataNewRecovered.push({ t: new Date(update.date), y: update.new_recovered });
      });
      dataCritical.push({
        t: new Date(covidData.data.updated_at.match(/\d{4}-\d{2}-\d{2}/g)),
        y: covidData.data.latest_data.critical,
      });

      if (covidData.data.timeline.length === 0) {
        handleError('There is no data available');
      }
      const datasets = [
        {
          label: 'Total Confirmed',
          data: fromDayTo10(dataConfirmed),
          backgroundColor: ['transparent'],
          borderColor: ['rgba(255, 99, 132, 1)'],
          borderWidth: 3,
        },
        {
          label: 'New Confirmed',
          data: fromDayTo10(dataNewConfirmed),
          backgroundColor: ['transparent'],
          borderColor: ['rgba(193, 37, 83)'],
          borderWidth: 3,
        },
        {
          label: 'Total Recovered',
          data: fromDayTo10(dataRecovered),
          backgroundColor: ['transparent'],
          borderColor: ['rgba(54, 162, 235, 1)'],
          borderWidth: 3,
        },
        {
          label: 'New Recovered',
          data: fromDayTo10(dataNewRecovered),
          backgroundColor: ['transparent'],
          borderColor: ['rgba(0, 111, 179, 1)'],
          borderWidth: 3,
        },
        {
          label: 'Total Deaths',
          data: fromDayTo10(dataDeaths),
          backgroundColor: ['transparent'],
          borderColor: ['rgba(75, 192, 192, 1)'],
          borderWidth: 3,
        },
        {
          label: 'New Deaths',
          data: fromDayTo10(dataNewDeaths),
          backgroundColor: ['transparent'],
          borderColor: ['rgba(0, 138, 139, 1)'],
          borderWidth: 3,
        },
        {
          label: 'Total Critical',
          data: dataCritical,
          showLine: false,
          type: 'bar',
          backgroundColor: ['transparent'],
          borderColor: ['rgba(255, 206, 86, 1)'],
          borderWidth: 5,
        },
      ];

      drawChart('line', fromDayTo10(labels), datasets, options.date);
    } catch (error) {
      handleError(error);
    }
  }
}

async function continentClick(e) {
  if (currentGraph !== e.target.textContent) {
    currentGraph = e.target.textContent;
    try {
      const covidData = await fetchData(urls.covid);
      const btnsCountry = document.querySelector('.btns__country');
      const labels = [];
      const dataConfirmed = [];
      const dataDeaths = [];
      const dataRecovered = [];
      const dataCritical = [];
      resetBtns('country');
      if (e.target.textContent === 'World') {
        Object.keys(world).forEach((continent) => {
          labels.push(continent);
          let dataConfirmedContinent;
          let dataDeathsContinent;
          let dataRecoveredContinent;
          let dataCriticalContinent;
          for (const key of Object.keys(world[continent])) {
            dataConfirmedContinent = 0;
            dataDeathsContinent = 0;
            dataRecoveredContinent = 0;
            dataCriticalContinent = 0;
            if (key === 'type') {
              continue;
            }
            const covidCountryData = covidData.data.find((data) => data.name === key);
            if (!covidCountryData) {
              delete world[continent][key];
              continue;
            }
            dataConfirmedContinent += covidCountryData.latest_data.confirmed;
            dataCriticalContinent += covidCountryData.latest_data.critical;
            dataDeathsContinent += covidCountryData.latest_data.deaths;
            dataRecoveredContinent += covidCountryData.latest_data.recovered;
          }
          dataConfirmed.push(dataConfirmedContinent);
          dataCritical.push(dataCriticalContinent);
          dataDeaths.push(dataDeathsContinent);
          dataRecovered.push(dataRecoveredContinent);
          drawBtns(world[continent], 'country');
        });
        btnsCountry.addEventListener('click', countryClick);
      } else {
        for (const key of Object.keys(world[e.target.textContent])) {
          if (key === 'type') {
            continue;
          }
          const covidCountryData = covidData.data.find((data) => data.name === key);
          if (!covidCountryData) {
            delete world[e.target.textContent][key];
            continue;
          }
          labels.push(key);
          dataConfirmed.push(covidCountryData.latest_data.confirmed);
          dataCritical.push(covidCountryData.latest_data.critical);
          dataDeaths.push(covidCountryData.latest_data.deaths);
          dataRecovered.push(covidCountryData.latest_data.recovered);
        }
        drawBtns(world[e.target.textContent], 'country');
        btnsCountry.addEventListener('click', countryClick);
      }

      const datasets = [
        {
          label: 'Total Confirmed',
          data: dataConfirmed,
          backgroundColor: ['transparent'],
          borderColor: ['rgba(255, 99, 132, 1)'],
          borderWidth: 3,
        },
        {
          label: 'Total Recovered',
          data: dataRecovered,
          backgroundColor: ['transparent'],
          borderColor: ['rgba(54, 162, 235, 1)'],
          borderWidth: 3,
        },
        {
          label: 'Total Critical',
          data: dataCritical,
          backgroundColor: ['transparent'],
          borderColor: ['rgba(255, 206, 86, 1)'],
          borderWidth: 3,
        },
        {
          label: 'Total Deaths',
          data: dataDeaths,
          backgroundColor: ['transparent'],
          borderColor: ['rgba(75, 192, 192, 1)'],
          borderWidth: 3,
        },
      ];

      drawChart('line', labels, datasets, options.normal);
    } catch (error) {
      handleError(error);
    }
  }
}

async function handleLoad() {
  handleResize();
  const countriesData = await fetchData(urls.countries);
  countriesData.forEach((country) => {
    if (!world[country.region]) {
      if (country.region) {
        world[country.region] = {
          type: 'continent',
        };
      }
    }
    if (country.region) {
      world[country.region][country.name.common] = {
        code: country.cca2,
        type: 'country',
      };
      countries[country.name.common] = country.region;
    }
  });
  resetBtns('continent');
  drawBtns(world, 'continent');
  const btnsContinent = document.querySelector('.btns__continent');
  btnsContinent.addEventListener('click', continentClick);

  drawChart('line', [], [], options.normal);
}

// Window event listeners
window.addEventListener('load', handleLoad);
window.addEventListener('resize', handleResize);
