function stringToColor(str) {
  //TODO Create more complex hash
  let hash = 0;
  str = str.replaceAll("-", "");
  const strArr = str.split("");
  strArr.forEach((c) => {
    hash = Number.parseInt(c) + ((hash << 5) - hash);
    console.log(c);
  });
  console.log("Hash:", hash);
  return hash;
}

function getURLDate() {
  //Try to get date from window.location.hash
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
