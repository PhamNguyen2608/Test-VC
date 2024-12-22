class HexagonImage {
  constructor(containerSelector, imageUrl, props = {}) {
    this.container = document.querySelector(containerSelector);
    this.imageUrl = imageUrl;
    this.defaultImage = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809";
    
    this.props = {
      backgroundColor: props.backgroundColor || '#3B82F6',
      showBorder: props.showBorder || false,
      borderColor: props.borderColor || '#FFFFFF',
      borderWidth: parseInt(props.borderWidth) || 2
    };
    
    this.init();
  }

  handleImageError(event) {
    event.target.src = this.defaultImage;
  }

  createSVGFilter() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("style", "visibility: hidden; position: absolute");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("version", "1.1");

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", "goo");

    const blur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    blur.setAttribute("in", "SourceGraphic");
    blur.setAttribute("stdDeviation", "15");
    blur.setAttribute("result", "blur");

    const colorMatrix = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
    colorMatrix.setAttribute("in", "blur");
    colorMatrix.setAttribute("mode", "matrix");
    colorMatrix.setAttribute("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9");
    colorMatrix.setAttribute("result", "goo");

    const composite = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
    composite.setAttribute("in", "SourceGraphic");
    composite.setAttribute("in2", "goo");
    composite.setAttribute("operator", "atop");

    filter.appendChild(blur);
    filter.appendChild(colorMatrix);
    filter.appendChild(composite);
    defs.appendChild(filter);
    svg.appendChild(defs);

    return svg;
  }

  init() {
    const mainDiv = document.createElement('div');
    mainDiv.className = "relative mx-auto";
    mainDiv.style.filter = "url(#goo)";
    
    mainDiv.style.width = "100%";
    mainDiv.style.height = "100%";

    const bgHexagon = document.createElement('div');
    bgHexagon.className = "absolute inset-0";
    
    if (this.props.showBorder) {
      bgHexagon.style.cssText = `
        background-color: ${this.props.borderColor};
        clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
        position: absolute;
        inset: 0;
      `;

      const innerHexagon = document.createElement('div');
      innerHexagon.style.cssText = `
        background-color: ${this.props.backgroundColor};
        clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
        position: absolute;
        inset: ${this.props.borderWidth}px;
      `;
      bgHexagon.appendChild(innerHexagon);
    } else {
      bgHexagon.style.backgroundColor = this.props.backgroundColor;
      bgHexagon.style.clipPath = "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)";
    }

    const imageContainer = document.createElement('div');
    imageContainer.className = "absolute inset-2";

    const innerContainer = document.createElement('div');
    innerContainer.className = "relative w-full h-full";
    innerContainer.style.filter = "url(#goo)";

    const imageWrapper = document.createElement('div');
    imageWrapper.className = "absolute inset-0 overflow-hidden";
    imageWrapper.style.clipPath = "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)";
    imageWrapper.style.backgroundColor = "#f3f4f6";

    const img = document.createElement('img');
    img.src = this.imageUrl || this.defaultImage;
    img.alt = "Hexagon Content";
    img.className = "w-full h-full object-cover";
    img.loading = "lazy";
    img.onerror = this.handleImageError.bind(this);

    const gradient = document.createElement('div');
    gradient.className = "absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20";
    gradient.style.clipPath = "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)";

    imageWrapper.appendChild(img);
    innerContainer.appendChild(imageWrapper);
    imageContainer.appendChild(innerContainer);
    mainDiv.appendChild(bgHexagon);
    mainDiv.appendChild(imageContainer);

    const svg = this.createSVGFilter();

    this.container.appendChild(mainDiv);
    this.container.appendChild(svg);
  }
}

export default HexagonImage; 