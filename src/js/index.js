const parts = document.querySelector("#parts");
const partsHolder = document.querySelector("#partsHolder");
const generatePie = document.querySelector("#generatePie");
const downloadPie = document.querySelector("#downloadPie");
const downloadPie2 = document.querySelector("#downloadPie2");

const checkBoxBackground = document.querySelector("#checkBoxBackground");

let nbParts = 0;
let backgroundImage;
let backgroundImage2;
let chart;
let images = [];
let options;
function init() {
  changeNbParts();
}

init();

parts.addEventListener("change", changeNbParts);
checkBoxBackground.addEventListener("change", () => {
  if (
    document.querySelector(`label[for="checkBoxBackground"]`).innerHTML ==
    "Link"
  ) {
    document.querySelector(`label[for="checkBoxBackground"]`).innerHTML =
      "File";
  } else {
    document.querySelector(`label[for="checkBoxBackground"]`).innerHTML =
      "Link";
  }
  document.querySelector(`#linkBackground`).classList.toggle("d-none");
  document.querySelector(`#fileBackground`).classList.toggle("d-none");
});
generatePie.addEventListener("click", cookPie);
downloadPie.addEventListener("click", downloadSVG);
downloadPie2.addEventListener("click", downloadPNG);

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
  <input type="color" id="colorLabel${index}" value="#000000" />
    <label class="form-check-label" for="colorLabel${index}">Text Color</label>
    </div>
  <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" value="" id="checkBox${index}" onchange="toggleInput(${index})">
    <label class="form-check-label" for="checkBox${index}">Link</label>
  </div>
  <div class="form-group">
  <input type="color" id="color${index}" value="#e66465" />
    <label class="form-check-label" for="color${index}">Color</label>
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

async function cookPie() {
  let seriesTab = [];
  let widthCanvas = 500;
  let heightCanvas = 350;
  images = [];
  let labelsVal = [];
  let colorsVal = [];
  let textColorsVal = [];
  for (let index = 0; index < nbParts; index++) {
    const element = parseInt(
      document.querySelector(`#quantityVal${index}`).value
    );
    seriesTab.push(element);
    if (document.querySelector(`#checkBox${index}`).checked) {
      let image = await toBase64(
        document.querySelector(`#formFile${index}`).files[0]
      );
      images.push(image);
    } else {
      // images.push(document.querySelector(`#formLink${index}`).value);
      let image = await imageUrlToBase64(
        document.querySelector(`#formLink${index}`).value
      );
      images.push(image);
    }
    labelsVal.push(
      document.querySelector(`#labelVal${index}`).value != ""
        ? document.querySelector(`#labelVal${index}`).value
        : `series${index}`
    );
    colorsVal.push(
      document.querySelector(`#color${index}`).value != ""
        ? document.querySelector(`#color${index}`).value
        : `color${index}`
    );
    textColorsVal.push(
      document.querySelector(`#colorLabel${index}`).value != ""
        ? document.querySelector(`#colorLabel${index}`).value
        : `color${index}`
    );
  }
  backgroundImage = "";
  if (checkBoxBackground.checked) {
    backgroundImage = await toBase64(
      document.querySelector(`#formFileBackground`).files[0]
    );
  } else {
    backgroundImage = await imageUrlToBase64(
      document.querySelector(`#formLinkBackground`).value
    );
  }
  backgroundImage2 = await imageToDataUri(backgroundImage, widthCanvas);
  console.log(seriesTab);
  document.querySelector("#chart").innerHTML = "";
  options = {
    series: seriesTab,
    labels: labelsVal,
    chart: {
      id: "LineGraph1",
      width: widthCanvas,
      type: "pie",
      background:
        backgroundImage2 == "data:,"
          ? "#fff"
          : `url(
        ${backgroundImage2}
      ) `,
    },
    colors: colorsVal,
    fill: {
      type: "image",
      // opacity: 0.85,
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
    title: {
      text: document.querySelector("#title").value,
      align: "center",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "28px",
        fontWeight: "bold",
        fontFamily: undefined,
        color: document.querySelector("#colortitle").value,
      },
    },
    legend: {
      labels: {
        colors: textColorsVal,
      },
    },
  };
  if (chart != undefined) {
    chart.destroy();
  }
  chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
  document.querySelectorAll("image").forEach((image, index) => {
    image.href.baseVal = images[index];
  });
  // document.querySelector(".apexcharts-canvas").style.background = url();
  // document.querySelector(".apexcharts-canvas").style.background = url();
  document.querySelector(".apexcharts-canvas").style.backgroundSize = "contain";
  downloadPie.removeAttribute("disabled");
  downloadPie2.removeAttribute("disabled");
}

function previewFile(file, position) {
  const fileObject = file.files[0];
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {
      // convert image file to base64 string
      images[position] = reader.result;
    },
    false
  );
  if (file) {
    reader.readAsDataURL(fileObject);
  }
}

async function downloadSVG() {
  const ctx = chart.ctx;
  ctx.exports.exportToSVG(this.ctx);
}
async function downloadPNG() {
  const ctx = chart.ctx;
  ctx.exports.exportToPng(this.ctx);

  // const ctx = chart.ctx;
  // // img.src = svgUrl;
  // // document.getElementById("output").appendChild(img);
  // // ctx.exports.svgURL(this.ctx);
  // const downloadLink = document.createElement("a");
  // downloadLink.href = ctx.exports.svgUrl(this.ctx);
  // downloadLink.download =
  //   ("PieChart" ? "Piechart" : this.w.globals.chartID) + ".png";
  // document.body.appendChild(downloadLink);
  // downloadLink.click();
  // document.body.removeChild(downloadLink);
}
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const imageUrlToBase64 = async (url) => {
  const data = await fetch(
    "https://young-crag-76713-2bf43ee3d874.herokuapp.com/" + url,
    {}
  );
  const blob = await data.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
    reader.onerror = reject;
  });
};

async function imageToDataUri(link, width) {
  // create an off-screen canvas
  let div = document.createElement("div");
  const img = new Image();
  // img.width = width;
  img.src = link;
  div.appendChild(img);
  let stringObj = sleep(1000).then(() => {
    var canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d");
    // set its dimension to target size
    canvas.width = width;
    canvas.height = parseInt((width * img.height) / img.width);
    // document.querySelector("#output").innerHTML = "";

    // draw source image into the off-screen canvas:
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL();
  });
  return stringObj;
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
