const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;
const Assets = {
  ctx: ctx,
  data: [],
  loaded: 0,
  loadImage: function (path) {
    if (!path) console.error("Path is null");
    const img = new Image();
    img.src = path;
    img.onerror = () => {
      console.error( "Failed to load Image");
    };
    Assets.pushData(path);
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0);
      img.pixels = this.ctx.getImageData(0, 0, img.width, img.height).data;
      Assets.handleLoaded();
    };
    return img;
  },
  pushData: function (path) {
    this.data.push("path");
  },
  handleLoaded: function () {
    this.loaded++;
    if (this.data.length === this.loaded) {
      main();
    }
  },
};
