// script.js

// --- GLOBALS ---
const colorObject = { dateString: undefined, colorHex: undefined };

// --- CORE UTILITIES ---

async function dateStringToColor(dateString) {
  //Use first 6 digits of SHA-256 Hash to get unique color hex code
  const encoder = new TextEncoder();
  const data = encoder.encode(dateString);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Truncate the full hash (64 characters) to the first 6 characters
  return "#" + hexHash.substring(0, 6).toUpperCase();
}

function formatDateTime(dateString) {
  const date = new Date(dateString + "T00:00:00");

  const options = {
    weekday: "long", // e.g., "Saturday"
    year: "numeric", // e.g., "1996"
    month: "long", // e.g., "July"
    day: "numeric", // e.g., "13"
  };

  const longFormDate = date.toLocaleDateString(undefined, options);
  return longFormDate;
}

// --- Color Manipulation Functions ---
function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r, g, b;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, "0");
  g = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, "0");
  b = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, "0");

  return ("#" + r + g + b).toUpperCase();
}

function generatePalette(hexColor) {
  const hsl = hexToHSL(hexColor);
  const complement = (hsl.h + 180) % 360;
  const boostSat = Math.min(hsl.s + 30, 85);

  return [
    hslToHex(hsl.h - 30, boostSat, Math.min(hsl.l + 15, 80)),
    hslToHex(hsl.h + 30, boostSat, Math.max(hsl.l - 15, 20)),
    hslToHex(complement, boostSat, hsl.l),
    hslToHex(complement + 30, boostSat, Math.max(hsl.l - 15, 20)),
  ];
}

// --- URL/Navigation Functions ---

function getURLDate() {
  //Try to retrieve date from window.location.hash
  let urlDate = "";
  try {
    urlDate = new Date(window.location.hash.substring(1))
      .toISOString()
      .slice(0, 10);
  } catch {
    //Return today if value is missing or invalid
    urlDate = new Date().toISOString().slice(0, 10);
  } finally {
    return urlDate;
  }
}

function navigateToDate(newDate) {
  // Change webpage based on newDate parameter
  newWindowHash = newDate.toISOString().slice(0, 10);
  window.location.href = window.location.pathname + "#" + newWindowHash;
  window.location.reload(true);
}

function setFavicon(color) {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 32, 32);

  const link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement("link");
  link.type = "image/x-icon";
  link.rel = "shortcut icon";
  link.href = canvas.toDataURL();
  document.head.appendChild(link);
}

// --- DOM MANIPULATION & EVENT HANDLERS ---

function updatePageDetails() {
  //Set Favicon
  setFavicon(colorObject.colorHex);

  //Set Main Header text
  const main_header = document.getElementById("main-header");
  main_header.innerText = formatDateTime(colorObject.dateString);
  const main_card = document.getElementById("main-color-card");
  main_card.dataset.copy = colorObject.colorHex;

  //Set Color-Hex text
  const color_hex = document.getElementById("main-hex");
  color_hex.innerText = colorObject.colorHex;

  const mainColor = document.getElementById("main-color");
  mainColor.style.backgroundColor = colorObject.colorHex;

  //Set Palette Colors
  const paletteColors = generatePalette(colorObject.colorHex);
  paletteColors.forEach((colorHex, index) => {
    const palette_element = document.getElementById(`palette-${index + 1}`);
    const palette_text_element = document.getElementById(
      `palette-text-${index + 1}`
    );
    palette_element.style.backgroundColor = colorHex;
    palette_text_element.innerText = colorHex;
    palette_element.dataset.copy = colorHex;
  });

  //TODO Set other details like color fun facts or name

  //   Set URL window.location.hash based on colorObject.dateString
  if (window.location.hash !== "#" + colorObject.dateString) {
    window.history.pushState(null, null, "#" + colorObject.dateString);
  }

  addEventHandlers();
}

function addEventHandlers() {
  // Navigate to other dates (Presets)
  const navBarButtons = {
    "nav-today": [0, "days"],
    "nav-yesterday": [-1, "days"],
    "nav-1-year": [-1, "years"],
    "nav-10-years": [-10, "years"],
  };
  Object.keys(navBarButtons).forEach((btn) => {
    const [offset, interval] = navBarButtons[btn];
    document.getElementById(btn).addEventListener("click", () => {
      newDate = new Date();

      if (interval === "days") {
        newDate.setDate(newDate.getDate() + offset);
      } else if (interval === "years") {
        newDate.setFullYear(newDate.getFullYear() + offset);
      }
      navigateToDate(newDate);
    });
  });

  // Navigate to other dates (Date Input)
  // TODO: there may be a better option than "blur" which is more mobile-friendly and allows the user to click 'enter' on web
  const dateInput = document.getElementById("specificDate");
  dateInput.addEventListener("blur", () => {
    const dateString = dateInput.value;
    if (dateString) {
      navigateToDate(new Date(dateString));
    }
  });

  // Generic copy handler
  document.addEventListener("click", (e) => {
    const copyData = e.target.closest("[data-copy]")?.dataset.copy;
    if (copyData) {
      navigator.clipboard.writeText(copyData);

      // Show toast notification
      const copy_toast = document.getElementById("copyToast");
      const toast = new bootstrap.Toast(copy_toast, {
        autohide: true,
        delay: 2000,
      });
      toast.show();

      const element = e.target.closest("[data-copy]");
      element.style.opacity = "0.7";

      setTimeout(() => {
        element.style.opacity = "1";
      }, 150);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  // Set Global Values
  colorObject.dateString = getURLDate();
  try {
    colorObject.colorHex = await dateStringToColor(colorObject.dateString);
  } catch (e) {
    console.error("Failed to generate color hash:", e);
    // Fallback color if the crypto API fails for some reason
    colorObject.colorHex = "#808080";
  }

  updatePageDetails();
});
