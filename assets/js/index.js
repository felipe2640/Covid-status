let Global = [];
const confirmed = document.getElementById("confirmed");
const death = document.getElementById("death");
const recovered = document.getElementById("recovered");

const apiCovid = axios.create({
  baseURL: "https://api.covid19api.com/",
});

async function getGlobal() {
  let res = await apiCovid.get("/summary");
  return res.data;
}

const init = async () => {
  Global = await getGlobal();
  itemKpi(Global);
};

const itemKpi = (Global) => {
  const confirmedData = Global.Global.TotalConfirmed;
  const deathData = Global.Global.TotalDeaths;
  const recoveredData = Global.Global.TotalRecovered;
  confirmed.innerHTML = confirmedData;
  death.innerHTML = deathData;
  recovered.innerHTML = recoveredData;

  pizza.data.labels.push("Confirmado");
  pizza.data.datasets[0].data.push(confirmedData);
  pizza.data.labels.push("Mortes");
  pizza.data.datasets[0].data.push(deathData);
  pizza.data.labels.push("Recuperados");
  pizza.data.datasets[0].data.push(recoveredData);
  pizza.update();

  const arr = Global.Countries;
  const topN = (arr, n) => {
    if (n > arr.length) {
      return false;
    }
    return arr
      .slice()
      .sort((a, b) => {
        return b.TotalDeaths - a.TotalDeaths;
      })
      .slice(0, n);
  };
  const dataTop = topN(arr, 10);

  dataTop.map((top) => {
    bar.data.labels.push(top.Country);
    bar.data.datasets[0].data.push(top.TotalDeaths);
    bar.update();
  });
};

let pizza = new Chart(document.getElementById("pizza"), {
  type: "pie",
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#3e95cd", "#3c8523", "#42F39f"],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Distribuição de celulares",
      },
    },
  },
});

let bar = new Chart(document.getElementById("barras"), {
  type: "bar",
  data: {
    datasets: [
      {
        data: [],
        backgroundColor: "#b48484",
      },
    ],
  },
  options: {
    reponsive: true,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      title: {
        display: true,
        text: "Total de Morte por pais - Top 10",
      },
    },
  },
});

init();
