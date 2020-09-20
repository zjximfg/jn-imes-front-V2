export const fullScreen = () => {
  let element = document.documentElement;
  // if (element.requestFullscreen) {
  //   element.requestFullscreen();
  // } else if (element.webkitRequestFullScreen) {
  if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    // IE11
    element.msRequestFullscreen();
  }
};


