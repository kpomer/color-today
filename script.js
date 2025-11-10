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

// --- DOM MANIPULATION & EVENT HANDLERS ---

function updatePageDetails() {
  //Set Background Color
  document.body.style.backgroundColor = colorObject.colorHex;

  //Set Main Header text
  const main_header = document.getElementById("main-header");
  main_header.innerText = formatDateTime(colorObject.dateString);

  //Set Color-Hex text
  const color_hex = document.getElementById("color-hex");
  color_hex.innerText = colorObject.colorHex;

  //TODO Set other details like displaying the complementary palette and/or color fun facts

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
  const dateForm = document.getElementById("date-form");
  dateForm.addEventListener("change", (event) => {
    event.preventDefault();
    const dateInput = document.getElementById("specificDate");
    const dateString = dateInput.value;
    if (dateString) {
      navigateToDate(new Date(dateString));
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
