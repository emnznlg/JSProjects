const showModalBtn = document.querySelector(".show-modal");
const bottomSheet = document.querySelector(".bottom-sheet");
const sheetOverlay = document.querySelector(".sheet-overlay");
const dragIcon = document.querySelector(".drag-icon");
const sheetContent = document.querySelector(".content");

let isDragging = false,
  startY,
  startHeight;

showModalBtn.addEventListener("click", showBottomSheet);
sheetOverlay.addEventListener("click", hideBottomSheet);
dragIcon.addEventListener("mousemove", dragging);
document.addEventListener("mousedown", dragStart);
document.addEventListener("mouseup", dragStop);

function showBottomSheet(e) {
  bottomSheet.classList.add("show");
  updateSheetHeight(50);
}

function hideBottomSheet(e) {
  bottomSheet.classList.remove("show");
}

function dragging(e) {
  if (!isDragging) return;
  sheetContent.style.height = `${e.pageY}vh`;
  const delta = startY - e.pageY;
  const newHeight = startHeight + (delta / window.innerHeight) * 100;
  updateSheetHeight(newHeight);
}

function dragStart(e) {
  isDragging = true;
  startY = e.pageY;
  startHeight = parseInt(sheetContent.style.height);
  bottomSheet.classList.add("dragging");
}

function dragStop(e) {
  isDragging = false;
  bottomSheet.classList.remove("dragging");
  const sheetHeight = parseInt(sheetContent.style.height);
  sheetHeight < 25 ? hideBottomSheet() : sheetHeight > 75 ? updateSheetHeight(100) : updateSheetHeight(50);
}

function updateSheetHeight(height) {
  sheetContent.style.height = `${height}vh`;
  bottomSheet.classList.toggle("fullscreen", height === 100);
}
