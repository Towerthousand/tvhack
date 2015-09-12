//If we are a stb, set the resolution
if (!!navigator.setResolution) {
  navigator.setResolution(1280, 720);
}

//Disable websecutiry to bypass CORS issues if any.
if (!!navigator.setWebSecurityEnabled){
  navigator.setWebSecurityEnabled(false);
}

