const preventTextSelection = (e: Event) => {
  e.preventDefault();
};

export const enableTextSelectionPrevention = () => {
  if (!document.getElementById('disable-selection-listener')) {
    document.addEventListener('selectstart', preventTextSelection);
    const marker = document.createElement('div');
    marker.id = 'disable-selection-listener';
    marker.style.display = 'none';
    document.body.appendChild(marker);
  }
};

export const disableTextSelectionPrevention = () => {
  document.removeEventListener('selectstart', preventTextSelection);
  const marker = document.getElementById('disable-selection-listener');
  if (marker) {
    marker.remove();
  }
};
