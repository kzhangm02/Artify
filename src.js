const NUM_STYLES = 6;
const model = new mi.ArbitraryStyleTransferNetwork();
const uploadFile = document.getElementById("upload-file");
const downloadContainer = $("download-container");
const downloadButton = $("download-btn");
const contentImg = $("content-img");
const contentImgContainer = $("crop-content-container");
const stylizedCanvas = $("stylized-canvas");
const sliderBar = $("slider-bar");
const sliderDot = $("slider-dot");
const text = $("text");
const styleContainer = $("style-container");
const selectedStyleImg = $("selected-style-img");
deactivate_download();
deactivate_slider();

for (let k = 1; k <= NUM_STYLES; k++) {
	styleContainer.appendChild(createStyle(k));
}

contentImg.onload = function() {
	var height = this.height;
	var width = this.width;
	if (height <= width) {
		this.style.height = "360px";
		this.style.width = "initial";
	}
	else {
		this.style.height = "initial";
		this.style.width = "360px";
	}
}

downloadButton.addEventListener("click", function() {
	downloadContainer.href = stylizedCanvas.toDataURL();
	downloadContainer.download = "styledImage.jpg";   
});

uploadFile.addEventListener("change", function() {
  changeContentImage(this);
  deactivate_download();
  deactivate_slider();
  deselect_styles();
});

function $(x) {
	return document.getElementById(x);
}

function createStyle(x) {
	var cropStyleContainer = document.createElement("div");
	cropStyleContainer.className = "crop-style-container";
	cropStyleContainer.id = `crop-style-container-${x}`;
	var styleImg = document.createElement("img");
	styleImg.className = "style-img";
	styleImg.id = `style-img${x}`;
	styleImg.src = `styles/style${x}.jpg`;
	styleImg.onclick = function() {select(x)};
	cropStyleContainer.appendChild(styleImg);
	return cropStyleContainer;
}

function changeContentImage(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			contentImg.setAttribute('src', e.target.result);
		}
		reader.readAsDataURL(input.files[0]);
	}
}

function stylize() {
	model.stylize(contentImg, selectedStyleImg).then((imageData) => {
		stylizedCanvas.getContext("2d").putImageData(imageData, 0, 0);
	});
	text.innerHTML = "";
}

function init_stylize() {
	text.innerHTML = "Processing Image...";
	model.initialize().then(stylize).then(activate_download).then(activate_slider);
}

function select(x) {
	selectedStyleImg.src = `styles/style${x}.jpg`;
	for (let k = 1; k <= NUM_STYLES; k++) {
		if (k != x) {
			$(`crop-style-container-${k}`).className = "crop-style-container";
		}
	}
	$(`crop-style-container-${x}`).className = "crop-style-container-selected";
	init_stylize();
}

function deselect_styles() {
	for (let k = 1; k <= NUM_STYLES; k++) {
		$(`crop-style-container-${k}`).className = "crop-style-container";
	}
}

function activate_download() {
	downloadButton.className = "enabled-btn";
	downloadButton.disabled = false;
}

function deactivate_download() {
	downloadButton.className = "disabled-btn";
	downloadButton.disabled = true;
}

function activate_slider() {
	sliderBar.style.display = "initial";
	sliderDot.style.display = "initial";
	sliderBar.value = 250;
	sliderDot.value = 250;
	contentImgContainer.setAttribute("style", "width: 50%");
}

function deactivate_slider() {
	sliderBar.style.display = "none";
	sliderDot.style.display = "none";
	contentImgContainer.setAttribute("style", "width: 100%");
}

function slide_img(width, type) {
	if (type === "bar") {
		sliderDot.value = sliderBar.value;
	}
	else if (type == "dot") {
		sliderBar.value = sliderDot.value;
	}
	contentImgContainer.setAttribute("style", `width: ${width}%`);
}