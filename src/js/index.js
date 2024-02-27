const parts = document.querySelector("#parts");
const partsHolder = document.querySelector("#partsHolder");
const generatePie = document.querySelector("#generatePie");
const downloadPie = document.querySelector("#downloadPie");
let nbParts = 0;
let options;
function init() {
  changeNbParts();
}

init();

parts.addEventListener("change", changeNbParts);
generatePie.addEventListener("click", cookPie);
downloadPie.addEventListener("click", downloadSVG);

function changeNbParts() {
  let partsValue = parseInt(parts.value);
  if (nbParts < partsValue) {
    for (let index = nbParts; index < partsValue; index++) {
      partsHolder.innerHTML += ` 
      <fieldset class="form-group" id="form${index}">
  <legend class="mt-4">Part ${parseInt(index) + 1}</legend>
        <div class="form-group" id="label${index}">
    <label for="labelVal${index}">Label ${parseInt(index) + 1}</label>
<input type="text" id="labelVal${index}" name="labelVal${index}" />
    </div>
  <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" value="" id="checkBox${index}" onchange="toggleInput(${index})">
    <label class="form-check-label" for="checkBox${index}">Link</label>
  </div>
  <div class="form-group" id="link${index}">
    <label for="formLink${index}" class="col-sm-2 col-form-label">Paste link here</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="formLink${index}" value="">
    </div>
  </div>
  <div class="form-group d-none" id="file${index}">
      <label for="formFile${index}" class="form-label mt-4">Choose your image</label>
      <input class="form-control" type="file" id="formFile${index}">
    </div>
    <div class="form-group" id="quantity${index}">
    <label for="quantityVal${index}">Quantity</label>

<input type="number" id="quantityVal${index}" name="quantity${index}" min="1" value="1" />

    </div>
</fieldset>
      `;
    }
  } else {
    for (let index = nbParts; index > partsValue; index--) {
      let element = document.querySelector(`#form${index - 1}`);
      console.log(`#form${index - 1}`);
      element.remove();
    }
  }
  nbParts = partsValue;
}

function toggleInput(index) {
  if (
    document.querySelector(`label[for="checkBox${index}"]`).innerHTML == "Link"
  ) {
    document.querySelector(`label[for="checkBox${index}"]`).innerHTML = "File";
  } else {
    document.querySelector(`label[for="checkBox${index}"]`).innerHTML = "Link";
  }
  document.querySelector(`#link${index}`).classList.toggle("d-none");
  document.querySelector(`#file${index}`).classList.toggle("d-none");
}

function cookPie() {
  let seriesTab = [];
  let images = [];
  let labelsVal = [];
  for (let index = 0; index < nbParts; index++) {
    const element = parseInt(
      document.querySelector(`#quantityVal${index}`).value
    );
    seriesTab.push(element);
    if (document.querySelector(`#checkBox${index}`).checked) {
      images.push(
        URL.createObjectURL(
          document.querySelector(`#formFile${index}`).files[0]
        )
      );
    } else {
      images.push(document.querySelector(`#formLink${index}`).value);
    }
    labelsVal.push(
      document.querySelector(`#labelVal${index}`).value != ""
        ? document.querySelector(`#labelVal${index}`).value
        : `series${index}`
    );
  }
  console.log(seriesTab);
  document.querySelector("#chart").innerHTML = "";
  options = {
    series: seriesTab,
    labels: labelsVal,
    chart: {
      width: 380,
      type: "pie",
      //   toolbar: {
      //     show: true,
      //     offsetX: 0,
      //     offsetY: 0,
      //     tools: {
      //       download: true,
      //       selection: true,
      //       zoom: true,
      //       zoomin: true,
      //       zoomout: true,
      //       pan: true,
      //       reset: true | '<img src="/static/icons/reset.png" width="20">',
      //       customIcons: [],
      //     },
      //   },
    },
    colors: ["#93C3EE", "#E5C6A0", "#669DB5", "#94A74A"],
    fill: {
      type: "image",
      opacity: 0.85,
      image: {
        src: images,
        width: 25,
        imagedHeight: 25,
      },
    },
    stroke: {
      width: 4,
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#111"],
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        borderWidth: 0,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
  downloadPie.removeAttribute("disabled");
}

async function downloadSVG() {
  domtoimage.toPng(document.querySelector("#chart")).then(function (blob) {
    var link = document.createElement("a");
    link.download = "Tierlist.png";
    link.href = blob;
    link.click();
  });
}
