const filterCountry = document.getElementById("cmbCountry");
const filterData = document.getElementById("cmbData");
const filterDateStart = document.getElementById("date_start");
const filterDateEnd = document.getElementById("date_end");
const button = document.getElementById("filtro");
const kpiconfirmed = document.getElementById("kpiconfirmed");
const kpideaths = document.getElementById("kpideaths");
const kpirecovered = document.getElementById("kpirecovered");
let qtyByday = [];
const apiCovid = axios.create({
  baseURL: "https://api.covid19api.com/",
});

async function getCountry() {
  let res = await apiCovid.get(`/countries`);
  const countries = res.data;
  loadComboOptions(filterCountry, countries);
}

(async () => {
  getCountry();
})();

button.addEventListener("click", loadFilters);

async function loadFilters() {
  const country = filterCountry.value;
  const DataStart = filterDateStart.value;
  const DataEnd = filterDateEnd.value;
  const cmbData = filterData.value;
  console.log(cmbData);

  let dataFilter = await apiCovid.get(
    `country/${country}?from=${DataStart}T00:00:00Z&to=${DataEnd}T00:00:00Z`
  );

  const data = dataFilter.data;

  kpiconfirmed.innerHTML = _.last(data).Confirmed.toLocaleString("PT");
  kpideaths.innerHTML = _.last(data).Deaths.toLocaleString("PT");
  kpirecovered.innerHTML = _.last(data).Recovered.toLocaleString("PT");

  let values = [];
  let dates = _.map(data, "Date");
  switch (cmbData) {
    case "Deaths":
      for (let i = 1; i < data.length; i++) {
        values.push(data[i].Deaths - data[i - 1].Deaths);
      }

      break;
    case "Confirmed":
      for (let i = 1; i < data.length; i++) {
        values.push(data[i].Confirmed - data[i - 1].Confirmed);
      }

      break;
    case "Recovered":
      for (let i = 1; i < data.length; i++) {
        values.push(data[i].Recovered - data[i - 1].Recovered);
      }

      break;
  }

  let linhas = new Chart(document.getElementById("linhas"), {
    type: "line",
    data: {
      labels: dates.slice(1, data.length),
      datasets: [
        {
          label: data[0].Country,
          data: values,
          label: "Casos Confirmados",
          borderColor: "rgb(60,186,159)",
          backgroundColor: "rgb(60,186,159,0.1)",
        },
        {
          data: [],
          label: "Média de mortes",
          borderColor: "rgb(255,140,13)",
          backgroundColor: "rgb(255,140,13, 0.1)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "left", //top, bottom, left, rigth
        },
        title: {
          display: true,
          text: "Curva de Covid",
        },
        layout: {
          padding: {
            left: 100,
            right: 100,
            top: 50,
            bottom: 10,
          },
        },
      },
    },
  });
  return linhas;
}

function loadComboOptions(combo, data) {
  data = data.sort((a, b) =>
    a.Country > b.Country ? 1 : a.Country < b.Country ? -1 : 0
  );
  data.map((opt) =>
    combo.insertAdjacentHTML("beforeend", `<option>${opt.Country}</option>`)
  );
}
