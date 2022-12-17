var fileInput = document.querySelector(".file-input"),
  filterOptions = document.querySelectorAll(".filter button"),
  filterName = document.querySelector(".filter-info .name"),
  filterValue = document.querySelector(".filter-info .value"),
  filterSlider = document.querySelector(".slider input"),
  rotateOptions = document.querySelectorAll(".rotate button"),
  previewImg = document.querySelector(".preview-img img"),
  resetFilterBtn = document.querySelector(".reset-filter"),
  chooseImageBtn = document.querySelector(".choose-img"),
  saveImageBtn = document.querySelector(".save-img");

var brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0;

var rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

function applyFilters() {
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
}

function loadImage() {
  var file = fileInput.files[0]; // getting user's selected file
  if (!file) return; // return if user hasn't selected a file
  previewImg.src = URL.createObjectURL(file); // passing file url as preview img src
  previewImg.addEventListener("load", function () {
    resetFilterBtn.click(); // reset filter values if the user selects a new image
    document.querySelector(".container").classList.remove("disable");
  });
}

filterOptions.forEach(function (option) {
  option.addEventListener("click", function () {
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerHTML = option.innerText;

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

function updateFilter() {
  filterValue.innerText = `${filterSlider.value}%`;
  var selectedFilter = document.querySelector(".filter .active"); // get selected filter button

  if (selectedFilter.id == "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id == "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id == "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }

  applyFilters();
}

rotateOptions.forEach(function (option) {
  option.addEventListener("click", function () {
    // adding click event listener to all rotate/flip buttons
    if (option.id === "left") {
      rotate -= 90; // if left rotate button is clicked, decrement rotate value by 90
    } else if (option.id === "right") {
      rotate += 90; // if right rotate button is clicked, incremebt rotate value by 90
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1; // if flipHorizontal value is 1, set this value to -1 else set it to 1
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1; // if flipVertical value is 1, set this value to -1 else set it to 1
    }

    applyFilters();
  });
});

function resetFilter() {
  // reset all variables to their default values
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;

  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;

  filterOptions[0].click(); // clicking the brightness button, so the brightness is selected by default

  applyFilters();
}

function saveImage() {
  var canvas = document.createElement("canvas"); // creating canvas element
  var ctx = canvas.getContext("2d"); // creating a CanvasRenderingContext2D object representing a two-dimensional rendering context
  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2); // translate canvas from center
  if (rotate !== 0) {
    // if rotate value is not 0, rotate the canvas
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical); // flip canvas horizontally / vertically
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  var link = document.createElement("a"); // creating <a> element
  link.download = "image.jpg"; // passing <a> tag to download value to "image.jpg"
  link.href = canvas.toDataURL(); // passing <a> tag href value to canvas data url (toDataURL returns a data URL containing a representation of the image)
  link.click(); // clicking <a> tag to download the image
}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImageBtn.addEventListener("click", saveImage);
chooseImageBtn.addEventListener("click", function () {
  fileInput.click();
});
