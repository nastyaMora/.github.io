(() => {
  const data = window.MORANOTE_GALLERY || {};
  const groups = [
    { key: "mini", id: "gallery-mini", label: "mini-tattoo" },
    { key: "custom", id: "gallery-custom", label: "custom projects" },
    { key: "academic", id: "gallery-academic", label: "academic drawing background and years of practice in every line on the body" }
  ];

  function makeArrowButton(direction, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `carousel-zone carousel-zone--${direction}`;
    button.setAttribute("aria-label", label);
    button.title = label;
    const path = direction === "prev" ? "m14.5 4.5-7.5 7.5 7.5 7.5" : "m9.5 4.5 7.5 7.5-7.5 7.5";
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
    return button;
  }

  function makeButton(className, label, text) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.setAttribute("aria-label", label);
    button.textContent = text;
    return button;
  }

  function showEmpty(node, category) {
    const empty = document.createElement("p");
    empty.className = "gallery-empty";
    empty.textContent = `No images are available in the ${category} carousel yet.`;
    node.append(empty);
  }

  for (const group of groups) {
    const node = document.getElementById(group.id);
    if (!node) continue;
    const photos = Array.isArray(data[group.key]) ? data[group.key] : [];
    if (photos.length === 0) {
      showEmpty(node, group.label);
      continue;
    }

    node.setAttribute("role", "region");
    node.setAttribute("aria-roledescription", "carousel");
    node.setAttribute("aria-label", `${group.label} carousel`);

    const stage = document.createElement("div");
    stage.className = "carousel-stage";
    stage.tabIndex = 0;
    stage.setAttribute("aria-label", "Use the left and right arrow keys to browse images.");

    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.className = "carousel-image-button";
    openButton.setAttribute("aria-haspopup", "dialog");

    const image = document.createElement("img");
    image.className = "carousel-image";
    image.loading = "lazy";
    image.decoding = "async";
    openButton.append(image);

    const previous = makeArrowButton("prev", `Previous image in ${group.label}`);
    const next = makeArrowButton("next", `Next image in ${group.label}`);
    stage.append(openButton, previous, next);

    const counter = document.createElement("p");
    counter.className = "carousel-count";
    counter.setAttribute("role", "status");
    counter.setAttribute("aria-live", "polite");
    counter.setAttribute("aria-atomic", "true");

    const dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.setAttribute("aria-label", `${group.label} image viewer`);

    const layout = document.createElement("div");
    layout.className = "lightbox-layout";
    const toolbar = document.createElement("div");
    toolbar.className = "lightbox-toolbar";
    const zoomOut = makeButton("lightbox-button lightbox-zoom", "Zoom out", "−");
    const zoomLevel = document.createElement("span");
    zoomLevel.className = "lightbox-zoom-level";
    zoomLevel.setAttribute("role", "status");
    zoomLevel.setAttribute("aria-live", "polite");
    zoomLevel.textContent = "100%";
    const zoomIn = makeButton("lightbox-button lightbox-zoom", "Zoom in", "+");
    const zoomReset = makeButton("lightbox-button lightbox-reset", "Reset zoom to fit", "Fit");
    const close = makeButton("lightbox-button lightbox-close", "Close image viewer", "Close ×");
    toolbar.append(zoomOut, zoomLevel, zoomIn, zoomReset, close);

    const viewport = document.createElement("div");
    viewport.className = "lightbox-viewport";
    viewport.tabIndex = 0;
    viewport.setAttribute("aria-label", "Enlarged image. Scroll to inspect it at higher zoom.");
    const enlargedImage = document.createElement("img");
    enlargedImage.className = "lightbox-image";
    enlargedImage.loading = "eager";
    enlargedImage.decoding = "async";
    viewport.append(enlargedImage);
    layout.append(toolbar, viewport);
    dialog.append(layout);
    document.body.append(dialog);

    let index = 0;
    let zoom = 1;
    function updateZoom(nextZoom, resetScroll = false) {
      zoom = Math.min(4, Math.max(1, nextZoom));
      enlargedImage.style.width = `${zoom * 100}%`;
      zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
      zoomOut.disabled = zoom <= 1;
      zoomIn.disabled = zoom >= 4;
      if (resetScroll) {
        viewport.scrollTop = 0;
        viewport.scrollLeft = 0;
      }
    }
    function openZoom() {
      enlargedImage.src = image.src;
      enlargedImage.alt = image.alt;
      updateZoom(1, true);
      dialog.showModal();
    }
    function showPhoto() {
      const photo = photos[index];
      image.src = photo.src;
      image.alt = photo.alt || `${group.label} — photo ${index + 1}`;
      image.width = photo.width || 900;
      image.height = photo.height || 1125;
      openButton.setAttribute("aria-label", `Open enlarged view: ${image.alt}`);
      counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
    }
    function move(step) {
      index = (index + step + photos.length) % photos.length;
      showPhoto();
    }

    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    openButton.addEventListener("click", openZoom);
    zoomIn.addEventListener("click", () => updateZoom(zoom + .25));
    zoomOut.addEventListener("click", () => updateZoom(zoom - .25));
    zoomReset.addEventListener("click", () => updateZoom(1, true));
    close.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        updateZoom(zoom + .25);
      } else if (event.key === "-") {
        event.preventDefault();
        updateZoom(zoom - .25);
      } else if (event.key === "0") {
        event.preventDefault();
        updateZoom(1, true);
      }
    });
    stage.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
    });

    node.replaceChildren(stage, counter);
    showPhoto();
  }

  const hero = document.getElementById("hero-image");
  const pending = document.getElementById("hero-pending");
  if (data.hero && hero) hero.src = data.hero;
  if (hero && pending) {
    hero.addEventListener("error", () => {
      hero.hidden = true;
      pending.hidden = false;
    }, { once: true });
  }
})();
