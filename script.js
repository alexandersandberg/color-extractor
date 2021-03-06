const form = document.querySelector("#form");
const input = document.querySelector("#input");
const output = document.querySelector("#output");
const extract = document.querySelector("#extract");
const example = document.querySelector("#example");

function extractColors(code) {
  const filterHex = /#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{3})/g;
  const allColors = code.toLowerCase().match(filterHex);

  if (!allColors) return false;

  const parsedColors = [];
  allColors.map(color => {
    // Converts shorthand formats (like #rgba to #rrggbbaa) for the calculations
    if (color.length < 7) {
      color = color.replace("#", "")
        .split("")
        .map(v => v + v)
        .join("");

      color = "#" + color;
    }

    parsedColors.push(color);
  });

  return [...new Set(parsedColors)];
}

function generateColorBlocks(uniqueColors) {
  uniqueColors.map((color) => {
    let colorBlock = document.createElement("div");
    let colorText = document.createElement("span");

    colorBlock.style.backgroundColor = color;
    colorText.textContent = color;
    colorText.style.color = getAccessibleTextColor(color);

    colorBlock.appendChild(colorText);
    output.appendChild(colorBlock);
  });
}

function getAccessibleTextColor(backgroundColor) {
  const hexRed = parseInt(backgroundColor.substring(1,3), 16);
  const hexGreen = parseInt(backgroundColor.substring(3,5), 16);
  const hexBlue = parseInt(backgroundColor.substring(5,7), 16);
  const brightness = ((hexRed * 299) + (hexGreen * 587) + (hexBlue * 114)) / 1000;
  const contrastThreshold = 128;

  if (brightness > contrastThreshold) {
    return "#000";
  } else {
    return "#fff";
  }
}

function generateColors() {
  output.textContent = "";
  const extracted = extractColors(input.value);
  if (extracted !== false) {
    generateColorBlocks(extracted);
  } else {
    input.setAttribute("placeholder", "Fill me in first!");
  }
}

form.addEventListener("submit", e => {
  e.preventDefault();
  generateColors();
});

document.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    generateColors();
  }
});

example.addEventListener("click", e => {
  e.preventDefault();
  input.value = `"colors": [ "#333a", "#fff", "#44475Aff", #FFF, #6272A4", "#8BE9FD", "#1E3A" ]\n\n.more { background: #FFB86C; color: #FF79C6; }\n\n/* This #BD93F9ff will also get extracted */`;
  generateColors();
});

// File upload
document.addEventListener("dragover", e => {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
});

document.addEventListener("drop", e => {
  e.stopPropagation();
  e.preventDefault();

  const files = Array.from(e.dataTransfer.files);

  files.map(file => {
    const reader = new FileReader();

    reader.onloadend = (function(file) {
      return function(e) {
        input.value += e.target.result;
      }
    })(file);

    reader.readAsText(file);
  });
});
