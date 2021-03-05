// TODO clean debugger, console.log
const world = {};
const countries = {};
let countriesData;
let covidData;
let chart;
let currentGraph;
const urls = {
  countries: 'https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1',
  covid: 'https://corona-api.com/countries',
};

// HTML elements
const canvas = document.querySelector('#graph__canvas');
const errorWrapper = document.querySelector('.error__wrapper');

function handleError(error) {
  errorWrapper.textContent = error;
  setTimeout(() => (errorWrapper.textContent = ''), 1000);
  console.log(error);
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

function drawChart(type, labels, datasets, options) {
  if (!chart) {
    chart = new Chart(canvas, {
      type,
      data: {
        labels,
        datasets,
      },
      options,
    });
  } else {
    chart.data = {
      labels,
      datasets,
    };
    chart.options = options;
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

async function countryClick(e) {
  // TODO convert to const
  if (currentGraph !== e.target.textContent) {
    currentGraph = e.target.textContent;
    console.log(world[countries[e.target.textContent]][e.target.textContent].code);
    try {
      covidData = await fetchData(`${urls.covid}/${world[countries[e.target.textContent]][e.target.textContent].code}`);
      const labels = [];
      const dataConfirmed = [];
      const dataNewConfirmed = [];
      const dataDeaths = [];
      const dataNewDeaths = [];
      const dataRecovered = [];
      const dataNewRecovered = [];
      covidData.data.timeline.forEach((update) => {
        labels.push(
          new Date(update.date)
          // .toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' })
        );
        // console.log(update);
        dataConfirmed.push({ x: new Date(update.date), y: update.confirmed });
        dataNewConfirmed.push({ x: new Date(update.date), y: update.new_confirmed });
        // dataCritical.push(update.critical);
        dataDeaths.push({ t: new Date(update.date), y: update.deaths });
        dataNewDeaths.push({ t: new Date(update.date), y: update.new_deaths });
        dataRecovered.push({ t: new Date(update.date), y: update.recovered });
        dataNewRecovered.push({ t: new Date(update.date), y: update.new_recovered });
      });
      if (covidData.data.timeline.length === 0) {
        handleError('There is no data available');
      }
      const datasets = [
        {
          label: 'Total Confirmed',
          data: dataConfirmed,
          backgroundColor: [
            'transparent',
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 3,
        },
        {
          label: 'New Confirmed',
          data: dataNewConfirmed,
          backgroundColor: [
            'transparent',
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(193, 37, 83)',
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 3,
        },
        {
          label: 'Total Recovered',
          data: dataRecovered,
          backgroundColor: [
            'transparent',
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            // 'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 3,
        },
        {
          label: 'New Recovered',
          data: dataNewRecovered,
          backgroundColor: [
            'transparent',
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            // 'rgba(255, 99, 132, 1)',
            'rgba(0, 111, 179, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 3,
        },
        // {
        //   label: 'Total Critical',
        //   data: dataCritical,
        //   backgroundColor: [
        //     'transparent',
        //     // 'rgba(255, 99, 132, 0.2)',
        //     // 'rgba(54, 162, 235, 0.2)',
        //     // 'rgba(255, 206, 86, 0.2)',
        //     // 'rgba(75, 192, 192, 0.2)',
        //     // 'rgba(153, 102, 255, 0.2)',
        //     // 'rgba(255, 159, 64, 0.2)',
        //   ],
        //   borderColor: [
        //     // 'rgba(255, 99, 132, 1)',
        //     // 'rgba(54, 162, 235, 1)',
        //     'rgba(255, 206, 86, 1)',
        //     // 'rgba(75, 192, 192, 1)',
        //     // 'rgba(153, 102, 255, 1)',
        //     // 'rgba(255, 159, 64, 1)',
        //   ],
        //   borderWidth: 3,
        // },
        {
          label: 'Total Deaths',
          data: dataDeaths,
          backgroundColor: [
            'transparent',
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            // 'rgba(255, 99, 132, 1)',
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 3,
        },
        {
          label: 'New Deaths',
          data: dataNewDeaths,
          backgroundColor: [
            'transparent',
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            // 'rgba(255, 99, 132, 1)',
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            'rgba(0, 138, 139, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 3,
        },
      ];
      const options = {
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
                // round: 'true',
                displayFormats: {
                  day: 'dd - MM - yy',
                },
              },
              suggestedMax: Date.now(),
            },
          ],
        },
      };
      drawChart('line', labels, datasets, options);
      // chart.options.scales.xAxes[0].type = 'time';
      // chart.options.scales.xAxes[0].time.round = 'true';
      // chart.options.scales.xAxes[0].time.unit = 'day';
      // chart.options.scales.xAxes[0].time.displayFormats.day = 'DD-MM-YYYY';
      // chart.update();
    } catch (error) {
      handleError(error);
    }
  }
}

async function continentClick(e) {
  // TODO add real things
  // TODO convert to const
  if (currentGraph !== e.target.textContent) {
    currentGraph = e.target.textContent;
    try {
      covidData = await fetchData(urls.covid);
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
          backgroundColor: [
            'transparent',
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 3,
        },
        {
          label: 'Total Recovered',
          data: dataRecovered,
          backgroundColor: [
            'transparent',
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            // 'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 3,
        },
        {
          label: 'Total Critical',
          data: dataCritical,
          backgroundColor: [
            'transparent',
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            // 'rgba(255, 99, 132, 1)',
            // 'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 3,
        },
        {
          label: 'Total Deaths',
          data: dataDeaths,
          backgroundColor: [
            'transparent',
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            // 'rgba(255, 99, 132, 1)',
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 3,
        },
      ];
      const options = {
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
      };
      drawChart('line', labels, datasets, options);
    } catch (error) {
      handleError(error);
    }
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
        total: {},
        new: {},
      };
      countries[country.name.common] = country.region;
    }
  });
  resetBtns('continent');
  drawBtns(world, 'continent');
  const btnsContinent = document.querySelector('.btns__continent');
  btnsContinent.addEventListener('click', continentClick);
}

// Window event listeners
window.addEventListener('load', handleLoad);
window.addEventListener('resize', handleResize);
