const colorObject = { dateString: undefined, colorHex: undefined };

function dateStringToColor(dateStr) {
  //TODO Make hash more unique - to be completely from one day to the next

  //Create hash from dateStr value
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }

  //Calculate color value based on hash value
  let color = "";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }
  return "#" + color.toUpperCase();
}

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

function updatePageDetails() {
  //Set Background Color
  document.body.style.backgroundColor = colorObject.colorHex;

  //Set Color-Hex text
  const color_hex = document.getElementById("color-hex");
  color_hex.innerText = colorObject.colorHex;

  //   Set URL window.location.hash based on colorObject.dateString
  if (window.location.hash !== "#" + colorObject.dateString) {
    window.history.pushState(null, null, "#" + colorObject.dateString);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  colorObject.dateString = getURLDate();
  colorObject.colorHex = dateStringToColor(colorObject.dateString);

  updatePageDetails();

  //TODO   Generate and display the complementary palette and/or color fun facts
  //TODO   Add handling for archived days
});
