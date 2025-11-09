function stringToColor(dateStr) {
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

document.addEventListener("DOMContentLoaded", () => {
  const targetDateString = getURLDate();
  console.log("Target Date", targetDateString);

  const primaryHex = stringToColor(targetDateString);
  console.log("Primary Hex", primaryHex);

  //   // 3. Update the page background and display the hex code
  //   updatePageColor(primaryHex);

  //   // 4. (Advanced step) Generate the complementary palette
  //   const complementaryPalette = generatePalette(primaryHex);

  //   // 5. Display the full color palette and other info
  //   displayPaletteAndInfo(targetDateString, primaryHex, complementaryPalette);

  //   // Optional: Update the URL hash for history/sharing
  //   if (window.location.hash !== "#" + targetDateString) {
  //     window.history.pushState(null, null, "#" + targetDateString);
  //   }
});
