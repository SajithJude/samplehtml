document
  .getElementById("jsonInput")
  .addEventListener("change", handleFileUpload, { passive: true });
let mainCanvas = new fabric.Canvas("mainCanvas", {
  fireRightClick: true, // <-- enable firing of right click events
  //   fireMiddleClick: true, // <-- enable firing of middle click events
  stopContextMenu: true, // <--  prevent context menu from showing
});
let slidesData;

// function speakText(text) {
//     const speechSynthesis = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'en-US';
//     utterance.rate = 1;
//     utterance.pitch = 1;
//     speechSynthesis.speak(utterance);
// }

document.addEventListener("DOMContentLoaded", function () {
  // Populate voice selection dropdown
  const voiceSelect = document.getElementById("voice");
  const voices = window.speechSynthesis.getVoices();
  console.log(voices);

  voices.forEach((voice, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.innerHTML = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
});

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance();
  const voices = window.speechSynthesis.getVoices();
  const selectedVoiceIndex = document.getElementById("voice").value;

  utterance.voice = voices[selectedVoiceIndex];
  utterance.volume = document.getElementById("volume").value;
  utterance.rate = document.getElementById("rate").value;
  utterance.pitch = document.getElementById("pitch").value;
  utterance.text = text;

  window.speechSynthesis.speak(utterance);
}

// Existing code...

// Initialize the canvas and other global variables
// ...

document.getElementById("addText").addEventListener("click", function () {
  addTextToCanvas();
});

// Function to add a text box to the canvas
function addTextToCanvas() {
  const textbox = new fabric.IText("New Text", {
    left: 10,
    top: 10,
    fontFamily: "Arial",
    fill: "#000000",
    fontSize: 16,
  });
  mainCanvas.add(textbox);
  mainCanvas.setActiveObject(textbox);
  slidesData.slides[currentSlideIndex].canvas = mainCanvas.toJSON();
  mainCanvas.requestRenderAll();
}

function applyAnimation(object, type, progress) {
  switch (type) {
    case "fadeIn":
      object.set("opacity", progress);
      break;
    case "fadeOut":
      object.set("opacity", 1 - progress);
      break;
    case "slideIn":
      object.set("left", progress * object.canvas.width);
      break;
    case "slideOut":
      object.set("left", object.canvas.width - progress * object.canvas.width);
      break;
    default:
      break;
  }
  slidesData.slides[currentSlideIndex].canvas = mainCanvas.toJSON();

  // Update the canvas
  mainCanvas.renderAll();
}

document
  .getElementById("previewAnimation")
  .addEventListener("click", function () {
    let activeObject = mainCanvas.getActiveObject();
    if (activeObject) {
      const animationType = document.getElementById("animationType").value;
      const duration = parseInt(
        document.getElementById("animationDuration").value,
        10
      );
      activeObject.animation = {
        type: animationType,
        duration: duration,
      };
      updateControls();
      slidesData.slides[currentSlideIndex].canvas = mainCanvas.toJSON();
      // mainCanvas.requestRenderAll();
      mainCanvas.requestRenderAll();

      animateSingleObject(activeObject, animationType, duration); // new function to handle single object animation
    } else {
      console.log("No active object");
    }
  });

// Initialize the canvas and other global variables
// ...

document.getElementById("addImage").addEventListener("click", function () {
  addImageToCanvas();
});

// Function to add an image to the canvas
function addImageToCanvas() {
  const imageUrl = prompt("Please enter the image URL:");
  if (imageUrl) {
    fabric.Image.fromURL(imageUrl, function (image) {
      // set the image's dimensions and position
      image.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornersize: 10,
      });
      // add the image to the canvas
      mainCanvas.add(image);
      slidesData.slides[currentSlideIndex].canvas = mainCanvas.toJSON();
      mainCanvas.requestRenderAll();
    });
  }
}

// Existing code...

function handleFileUpload(event) {
  let file = event.target.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let content = e.target.result;
      slidesData = JSON.parse(content);
      populateMinimap(slidesData);
    };
    reader.readAsText(file);
  }
}

function populateMinimap(data) {
  let minimap = document.getElementById("minimap");
  minimap.innerHTML = "";
  data.slides.forEach((slide, index) => {
    let item = document.createElement("div");
    item.classList.add("minimap-item");
    // // Create Plus Icon
    let plusBtn = document.createElement("button");
    plusBtn.classList.add("add-slide-button"); // New class
    // ... existing code ...
    let plusIcon = document.createElement("i");
    plusIcon.classList.add("far", "fa-plus");
    plusBtn.appendChild(plusIcon);

    // Attach Click Event to Plus Icon
    plusBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering the slide click event
      duplicateSlide(index);
    });

    // Create a thumbnail image element
    let thumbImage = document.createElement("img");
    thumbImage.classList.add("imag"); // New class

    thumbImage.width = 150; // set width to 100 pixels
    thumbImage.height = 100; // set height to 100 pixels
    // Create a temporary Fabric static canvas to generate the thumbnail
    let thumbCanvas = new fabric.Canvas();
    // Inside your populateMinimap function where you're loading the JSON into a StaticCanvas
    thumbCanvas.loadFromJSON(
      slide,
      () => {
        console.log(slide);
        thumbCanvas.setDimensions({ width: 300, height: 200 }); // Set dimensions for thumbnail
        thumbCanvas.renderAll();
        let thumbnail = thumbCanvas.toDataURL({
          format: "png",
          quality: 0.8,
        });
        // Set the Data URL as the src for the thumbnail image
        thumbImage.src = slide.screenshot;
      },
      function (o, object) {
        console.error(
          "A problem occurred while loading the object: ",
          o,
          object
        );
      }
    );

    // Create Play All Button
    let playAllBtn = document.createElement("button");
    plusBtn.classList.add("play-all-button"); // New class

    playicon = document.createElement("i");
    playicon.classList.add("far", "fa-play");
    playAllBtn.appendChild(playicon);
    // playAllBtn.textContent = "Play All";
    playAllBtn.addEventListener("click", () => {
      // playAllAnimations
      console.log("playAllAnimations");
      playAllAnimations(index);
      mainCanvas.renderAll();
      // Function to play all animations
    });

    // Append Play All Button to Minimap Item
    minimap.appendChild(playAllBtn);
    item.addEventListener("click", () => {
      slidesData.slides[currentSlideIndex].canvas = mainCanvas.toJSON();
      renderSlide(slide, index, (animate = false));
    });
    minimap.appendChild(item);

    // Append thumbnail image and Plus Icon to Minimap Item
    item.appendChild(thumbImage);
    minimap.appendChild(plusBtn);
  });
}

// Function to Duplicate Slide
function duplicateSlide(index) {
  if (slidesData && slidesData.slides[index]) {
    // Deep clone the slide data
    const newSlide = JSON.parse(JSON.stringify(slidesData.slides[index]));

    // Insert the new slide after the current one
    slidesData.slides.splice(index + 1, 0, newSlide);

    // Update Minimap and Canvas
    populateMinimap(slidesData);
    renderSlide(newSlide, index + 1);
  }
}

let animationQueue = [];
let animationStartTime;
function animateSingleObject(object, type, duration) {
  let startTime = null;
  function animateFrame(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = (timestamp - startTime) / duration;
    applyAnimation(object, type, Math.min(progress, 1));
    if (progress < 1) {
      requestAnimationFrame(animateFrame);
    }
  }
  requestAnimationFrame(animateFrame);
}

function playAllAnimations(slideIndex) {
  renderSlide(slidesData.slides[slideIndex], slideIndex, true); // Enable animation

  // Play the voice-over script if it exists
  const slide = slidesData.slides[slideIndex];
  if (slide.speech) {
    speakText(slide.speech);
  }
}

function animateObjects(timestamp) {
  // Initialize the start time
  if (!animationStartTime) {
    animationStartTime = timestamp;
  }

  let elapsedTime = timestamp - animationStartTime;

  // Check if the animationQueue is empty or not initialized
  if (!animationQueue || animationQueue.length === 0) {
    console.log("Animation Queue is empty or not initialized");
    return;
  }

  // Loop through each animation in the queue
  animationQueue.forEach((animation) => {
    if (!animation) {
      console.log("Undefined animation found in the queue");
      return;
    }

    if (
      elapsedTime >= animation.startTime &&
      elapsedTime <= animation.endTime
    ) {
      // Calculate progress as a value between 0 and 1
      let progress = (elapsedTime - animation.startTime) / animation.duration;
      applyAnimation(animation.object, animation.type, progress);
    }
  });

  // Continue the animation if there's more to animate
  if (elapsedTime < animationQueue[animationQueue.length - 1].endTime) {
    requestAnimationFrame(animateObjects);
  } else {
    // All animations are complete
    console.log("All animations complete!");
  }
}

let fabricObjects = [];
let currentSlideIndex = 0;

function renderSlide(slide, index, animate = false) {
  if (slidesData && slidesData.slides[currentSlideIndex]) {
    slidesData.slides[currentSlideIndex].canvas = mainCanvas.toJSON();
  }

  const voiceOverScript = document.getElementById("voiceOverScript");
  voiceOverScript.value = slide.speech || ""; // If no speech data is available, set it to an empty string

  currentSlideIndex = index;
  mainCanvas.setWidth(slide.canvas.width || 600);
  mainCanvas.setHeight(slide.canvas.height || 330);
  mainCanvas.setBackgroundColor(slide.canvas.background || "#ffffff", () => {
    mainCanvas.renderAll();
  });

  mainCanvas.clear();
  fabricObjects = [];
  var objects = slide.canvas.objects;
  for (var i = 0; i < (objects && objects.length); i++) {
    var obj = objects[i];
    var fabricObj;

    if (!obj.animation) {
      obj.animation = {
        type: "fadeIn",
        duration: 1000,
      };
    }

    switch (obj.type) {
      case "video":
        var videoEl = document.createElement("video");
        var sourceEl = document.createElement("source");
        sourceEl.src = obj.src;
        videoEl.appendChild(sourceEl);
        var videoObj = new fabric.Image(videoEl, obj);
        mainCanvas.add(videoObj);
        videoObj.getElement().play();
        fabricObj = videoObj;

        break;
      case "rect":
        var rectObj = new fabric.Rect(obj);
        mainCanvas.add(rectObj);
        fabricObj = rectObj;

        break;
      case "i-text":
        var textbox = new fabric.IText(obj.text, obj);
        mainCanvas.add(textbox);
        fabricObj = textbox;

        break;
      case "image":
        delete obj.clipPath;
        var imageElement = document.createElement("img");

        imageElement.setAttribute("src", obj.src);
        // Initiate an Image object
        var image = new fabric.Image(imageElement);
        image.set(obj);
        mainCanvas.add(image);
        fabricObj = image;

        break;
      case "circle":
        var cirObj = new fabric.Circle(obj);
        mainCanvas.add(cirObj);
        fabricObj = cirObj;

        break;
      default:
        console.log("Unknown object type:", obj.type);
        break;
    }

    fabricObjects.push(fabricObj);
    // Here, we only animate if the animate argument is true.
    if (
      animate &&
      obj.animation &&
      obj.animation.type &&
      obj.animation.duration
    ) {
      animateSingleObject(
        fabricObj,
        obj.animation.type,
        obj.animation.duration
      );
    }
  }
  mainCanvas.renderAll();
}

function updateControls() {
  let activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    // Existing controls
    document.getElementById("objectLeft").value = activeObject.left;
    document.getElementById("objectTop").value = activeObject.top;
    document.getElementById("objectWidth").value =
      activeObject.width * activeObject.scaleX;
    document.getElementById("objectHeight").value =
      activeObject.height * activeObject.scaleY;
    document.getElementById("objectAngle").value = activeObject.angle;
    document.getElementById("objectScale").value = activeObject.scaleX;
    document.getElementById("objectOpacity").value = activeObject.opacity || 1;

    // New controls for animation
    if (activeObject.animation) {
      document.getElementById("animationType").value =
        activeObject.animation.type;
      document.getElementById("animationDuration").value =
        activeObject.animation.duration;
    }

    // For text objects
    if (activeObject.type === "textbox") {
      document.getElementById("objectCharSpacing").value =
        activeObject.charSpacing || 0;
      document.getElementById("objectFont").value =
        activeObject.fontFamily || "Arial";
      document.getElementById("objectFontSize").value =
        activeObject.fontSize || 16;
      document.getElementById("objectColor").value =
        activeObject.fill || "#000000";
      document.getElementById("boldText").checked =
        activeObject.fontWeight === "bold";
      document.getElementById("underlineText").checked =
        activeObject.textDecoration === "underline";
      document.getElementById("textAlign").value = activeObject.textAlign;
      document.getElementById("justifyContent").value =
        activeObject.justifyContent || "flex-start"; // Set default as flex-start
    }
  } else {
    // Clear the input fields if no object is selected
    document.getElementById("objectLeft").value = "";
    document.getElementById("objectTop").value = "";
    document.getElementById("objectAngle").value = "";
    document.getElementById("objectScale").value = "";
    document.getElementById("animationType").value = "fadeIn";
    document.getElementById("animationDuration").value = "1000";
    document.getElementById("boldText").checked = false;
    document.getElementById("underlineText").checked = false;
    document.getElementById("textAlign").value = "left";
    document.getElementById("justifyContent").value = "flex-start"; // Reset to default
    document.getElementById("objectCharSpacing").value = "";
    document.getElementById("objectOpacity").value = "";
  }
}

mainCanvas.on({
  "object:modified": updateControls,
});

// mainCanvas.on('selection:created', );
mainCanvas.on("selection:created", updateControls);

mainCanvas.on("selection:cleared", function () {
  document.getElementById("objectLeft").value = "";
  document.getElementById("objectTop").value = "";
  document.getElementById("objectAngle").value = "";
  document.getElementById("objectScale").value = "";
});
// document.getElementById('mainCanvas').addEventListener('click', function(e) {
//     e.preventDefault();
// });

function setAsBackground(imageObj) {
  let imgSrc = imageObj._element.currentSrc; // Get image source URL
  mainCanvas.setBackgroundImage(imgSrc, mainCanvas.renderAll.bind(mainCanvas), {
    scaleX: mainCanvas.width / imageObj.width,
    scaleY: mainCanvas.height / imageObj.height,
    originX: "left",
    originY: "top",
  });

  // Optionally, remove the image object from canvas
  mainCanvas.remove(imageObj);
}

///////////////////save scorm//////////////////

/// A variable to keep track of whether the presentation mode is active
// A variable to keep track of whether the presentation mode is active
let presentationModeActive = false;

let originalCanvasDimensions = { width: 0, height: 0 };

document.addEventListener("keydown", function (event) {
  // check is T is pressed
  if (event.key === "t" || event.key === "T") {
    // Stop the speech
    window.speechSynthesis.cancel();
  }
  // Check if Ctrl and Space are pressed together
  if (event.key === " ") {
    // Toggle presentation mode
    presentationModeActive = !presentationModeActive;

    // Get the elements
    const toolbar = document.getElementById("toolbar");
    const minimap = document.getElementById("minimap");
    const mainCanvasElement = document.getElementById("mainCanvas");
    mainCanvasElement.style.display = "block";
    mainCanvasElement.style.backgroundColor =
      slidesData.slides[currentSlideIndex].canvas.background || "#ffffff";
    mainCanvasElement.style.width = window.innerWidth;
    mainCanvasElement.style.width = window.innerHeight;

    if (presentationModeActive) {
      // Save original canvas dimensions
      originalCanvasDimensions.width = mainCanvas.getWidth();
      originalCanvasDimensions.height = mainCanvas.getHeight();

      // Hide toolbar and minimap
      toolbar.style.display = "none";
      minimap.style.display = "none";

      // Scale canvas to full screen
      mainCanvas.setWidth(window.innerWidth);
      mainCanvas.setHeight(window.innerHeight);
      mainCanvas.calcOffset();
      mainCanvas.renderAll();

      // Request fullscreen
      if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
      } else if (document.body.mozRequestFullScreen) {
        // Firefox
        document.body.mozRequestFullScreen();
      } else if (document.body.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        document.body.webkitRequestFullscreen();
      } else if (document.body.msRequestFullscreen) {
        // IE/Edge
        document.body.msRequestFullscreen();
      }

      // Start the presentation
      startPresentation();
    } else {
      // Show toolbar and minimap
      toolbar.style.display = "block";
      minimap.style.display = "flex";

      window.speechSynthesis.cancel();

      // Restore original canvas dimensions
      mainCanvas.setWidth(originalCanvasDimensions.width);
      mainCanvas.setHeight(originalCanvasDimensions.height);
      mainCanvas.calcOffset();
      mainCanvas.renderAll();

      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
    }
  }
});

document.addEventListener("keydown", function (event) {
  // Check if Ctrl and S are pressed together
  if (event.ctrlKey && event.key === "s") {
    // Prevent default 'Save Page' browser action
    event.preventDefault();

    // Serialize slidesData into JSON
    const slidesDataJson = JSON.stringify(slidesData);

    // Create the HTML content
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Video Editor Scorm</title>
            <link rel="stylesheet" href="styles.css">
            <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v6.0.0-beta3/css/all.css">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.5.0/fabric.min.js"></script>
        </head>
        <body>
            <div id="contextMenu" class="context-menu">
                <ul>
                    <li id="setAsBackground">Set as Background</li>
                </ul>
            </div>
            <div id="minimap"></div>
            <canvas id="mainCanvas"></canvas>
            <textarea id="voiceOverScript" style="width: 600px; height: 70px; margin-top: 10px;"></textarea>
            <div id="toolbar" style="visibility:hidden;">
                <div class="expandable-section">
                    <h4>Add</h4>
                    <div class="expandable-content">
                        <div class="toolbar-row">
                            <div class="toolbar-item"><button id="addText">Add Text</button></div>
                            <div class="toolbar-item"><button id="addImage">Add Image</button></div>
                        </div>
                    </div>
                </div>
                <div class="expandable-section">
                    <h4>Layout</h4>
                    <div class="expandable-content">
                        <div class="toolbar-row">
                            <button id="alignTop"></button>
                            <button id="alignBottom"></button>
                            <button id="alignLeft"></button>
                        </div>
                        <div class="toolbar-row">
                            <button id="alignRight"></button>
                            <button id="alignCenterHorizontal"></button>
                            <button id="alignCenterVertical"></button>
                        </div>
                    </div>
                </div>
                <div class="expandable-section">
                    <h4>Text</h4>
                    <div class="expandable-content">
                        <div class="toolbar-row">
                            <div class="toolbar-item">
                                <select id="objectFont">
                                    <option value="Arial">Arial</option>
                                    <option value="Courier New">Courier New</option>
                                    <option value="Times New Roman">Times New Roman</option>
                                </select>
                            </div>
                            <div class="toolbar-item"><input type="number" id="objectFontSize" min="1" /></div>
                        </div>
                    </div>
                </div>
                <div class="expandable-section">
                    <h4>Animation</h4>
                    <div class="expandable-content">
                        <div class="toolbar-row">
                            <div class="toolbar-item">
                                <select id="animationType">
                                    <option value="none">None</option>
                                    <option value="fadeIn">Fade In</option>
                                    <option value="fadeOut">Fade Out</option>
                                    <option value="slideIn">Slide In</option>
                                    <option value="slideOut">Slide Out</option>
                                </select>
                            </div>
                            <div class="toolbar-item"><input type="number" id="animationDuration" min="10000" max="500000" step="10000" value="1000"></div>
                            <div class="toolbar-item"><button id="previewAnimation">Preview</button></div>
                        </div>
                    </div>
                </div>
            </div>
    <!-- Add your existing body content here -->
    
    <script>
        // Embed slidesData in the HTML file
        const slidesData = ${slidesDataJson};
let mainCanvas=new fabric.Canvas("mainCanvas",{fireRightClick:!0,stopContextMenu:!0}),currentSlideIndex=0;function speakText(e){let t=window.speechSynthesis,a=new SpeechSynthesisUtterance(e);a.lang="en-US",a.rate=1,a.pitch=1,t.speak(a)}function addTextToCanvas(){let e=new fabric.IText("New Text",{left:10,top:10,fontFamily:"Arial",fill:"#000000",fontSize:16});mainCanvas.add(e),mainCanvas.setActiveObject(e),slidesData.slides[currentSlideIndex].canvas=mainCanvas.toJSON(),mainCanvas.requestRenderAll()}function applyAnimation(e,t,a){switch(t){case"fadeIn":e.set("opacity",a);break;case"fadeOut":e.set("opacity",1-a);break;case"slideIn":e.set("left",a*e.canvas.width);break;case"slideOut":e.set("left",e.canvas.width-a*e.canvas.width)}slidesData.slides[currentSlideIndex].canvas=mainCanvas.toJSON(),mainCanvas.renderAll()}function addImageToCanvas(){let e=prompt("Please enter the image URL:");e&&fabric.Image.fromURL(e,function(e){e.set({left:10,top:10,angle:0,padding:10,cornersize:10}),mainCanvas.add(e),slidesData.slides[currentSlideIndex].canvas=mainCanvas.toJSON(),mainCanvas.requestRenderAll()})}function handleFileUpload(e){let t=e.target.files[0];if(t){let a=new FileReader;a.onload=function(e){populateMinimap(slidesData=JSON.parse(e.target.result))},a.readAsText(t)}}function populateMinimap(e){let t=document.getElementById("minimap");t.innerHTML="",e.slides.forEach((e,a)=>{let i=document.createElement("div");i.classList.add("minimap-item");let l=document.createElement("button");l.classList.add("add-slide-button");let s=document.createElement("i");s.classList.add("far","fa-plus"),l.appendChild(s),l.addEventListener("click",e=>{e.stopPropagation(),duplicateSlide(a)});let d=document.createElement("img");d.classList.add("imag"),d.width=150,d.height=100;let c=new fabric.Canvas;c.loadFromJSON(e,()=>{console.log(e),c.setDimensions({width:300,height:200}),c.renderAll(),c.toDataURL({format:"png",quality:.8}),d.src=e.screenshot},function(e,t){console.error("A problem occurred while loading the object: ",e,t)});let o=document.createElement("button");l.classList.add("play-all-button"),(playicon=document.createElement("i")).classList.add("far","fa-play"),o.appendChild(playicon),o.addEventListener("click",()=>{console.log("playAllAnimations"),playAllAnimations(a),mainCanvas.renderAll()}),t.appendChild(o),i.addEventListener("click",()=>{slidesData.slides[currentSlideIndex].canvas=mainCanvas.toJSON(),renderSlide(e,a,animate=!1)}),t.appendChild(i),i.appendChild(d),t.appendChild(l)})}function duplicateSlide(e){if(slidesData&&slidesData.slides[e]){let t=JSON.parse(JSON.stringify(slidesData.slides[e]));slidesData.slides.splice(e+1,0,t),populateMinimap(slidesData),renderSlide(t,e+1)}}document.getElementById("addText").addEventListener("click",function(){addTextToCanvas()}),document.getElementById("previewAnimation").addEventListener("click",function(){let e=mainCanvas.getActiveObject();if(e){let t=document.getElementById("animationType").value,a=parseInt(document.getElementById("animationDuration").value,10);e.animation={type:t,duration:a},updateControls(),slidesData.slides[currentSlideIndex].canvas=mainCanvas.toJSON(),mainCanvas.requestRenderAll(),animateSingleObject(e,t,a)}else console.log("No active object")}),document.getElementById("addImage").addEventListener("click",function(){addImageToCanvas()});let animationQueue=[],animationStartTime;function animateSingleObject(e,t,a){let i=null;function l(s){i||(i=s);let d=(s-i)/a;applyAnimation(e,t,Math.min(d,1)),d<1&&requestAnimationFrame(l)}requestAnimationFrame(l)}function playAllAnimations(e){renderSlide(slidesData.slides[e],e,!0);let t=slidesData.slides[e];t.speech&&speakText(t.speech)}function animateObjects(e){animationStartTime||(animationStartTime=e);let t=e-animationStartTime;if(!animationQueue||0===animationQueue.length){console.log("Animation Queue is empty or not initialized");return}animationQueue.forEach(e=>{if(!e){console.log("Undefined animation found in the queue");return}if(t>=e.startTime&&t<=e.endTime){let a=(t-e.startTime)/e.duration;applyAnimation(e.object,e.type,a)}}),t<animationQueue[animationQueue.length-1].endTime?requestAnimationFrame(animateObjects):console.log("All animations complete!")}let fabricObjects=[];function renderSlide(e,t,a=!1){slidesData&&slidesData.slides[currentSlideIndex]&&(slidesData.slides[currentSlideIndex].canvas=mainCanvas.toJSON());document.getElementById("voiceOverScript").value=e.speech||"",currentSlideIndex=t,mainCanvas.setWidth(e.canvas.width||600),mainCanvas.setHeight(e.canvas.height||330),mainCanvas.setBackgroundColor(e.canvas.background||"#ffffff",()=>{mainCanvas.renderAll()}),mainCanvas.clear(),fabricObjects=[];for(var i=e.canvas.objects,l=0;l<(i&&i.length);l++){var s,d=i[l];switch(d.animation||(d.animation={type:"fadeIn",duration:1e3}),d.type){case"video":var c=document.createElement("video"),o=document.createElement("source");o.src=d.src,c.appendChild(o);var r=new fabric.Image(c,d);mainCanvas.add(r),r.getElement().play(),s=r;break;case"rect":var m=new fabric.Rect(d);mainCanvas.add(m),s=m;break;case"i-text":var v=new fabric.IText(d.text,d);mainCanvas.add(v),s=v;break;case"image":delete d.clipPath;var u=document.createElement("img");u.setAttribute("src",d.src);var g=new fabric.Image(u);g.set(d),mainCanvas.add(g),s=g;break;case"circle":var y=new fabric.Circle(d);mainCanvas.add(y),s=y;break;default:console.log("Unknown object type:",d.type)}fabricObjects.push(s),a&&d.animation&&d.animation.type&&d.animation.duration&&animateSingleObject(s,d.animation.type,d.animation.duration)}mainCanvas.renderAll()}function updateControls(){let e=mainCanvas.getActiveObject();e?(document.getElementById("objectLeft").value=e.left,document.getElementById("objectTop").value=e.top,document.getElementById("objectWidth").value=e.width*e.scaleX,document.getElementById("objectHeight").value=e.height*e.scaleY,document.getElementById("objectAngle").value=e.angle,document.getElementById("objectScale").value=e.scaleX,document.getElementById("objectOpacity").value=e.opacity||1,e.animation&&(document.getElementById("animationType").value=e.animation.type,document.getElementById("animationDuration").value=e.animation.duration),"textbox"===e.type&&(document.getElementById("objectCharSpacing").value=e.charSpacing||0,document.getElementById("objectFont").value=e.fontFamily||"Arial",document.getElementById("objectFontSize").value=e.fontSize||16,document.getElementById("objectColor").value=e.fill||"#000000",document.getElementById("boldText").checked="bold"===e.fontWeight,document.getElementById("underlineText").checked="underline"===e.textDecoration,document.getElementById("textAlign").value=e.textAlign,document.getElementById("justifyContent").value=e.justifyContent||"flex-start")):(document.getElementById("objectLeft").value="",document.getElementById("objectTop").value="",document.getElementById("objectAngle").value="",document.getElementById("objectScale").value="",document.getElementById("animationType").value="fadeIn",document.getElementById("animationDuration").value="1000",document.getElementById("boldText").checked=!1,document.getElementById("underlineText").checked=!1,document.getElementById("textAlign").value="left",document.getElementById("justifyContent").value="flex-start",document.getElementById("objectCharSpacing").value="",document.getElementById("objectOpacity").value="")}function setAsBackground(e){let t=e._element.currentSrc;mainCanvas.setBackgroundImage(t,mainCanvas.renderAll.bind(mainCanvas),{scaleX:mainCanvas.width/e.width,scaleY:mainCanvas.height/e.height,originX:"left",originY:"top"}),mainCanvas.remove(e)}mainCanvas.on({"object:modified":updateControls}),mainCanvas.on("selection:created",updateControls),mainCanvas.on("selection:cleared",function(){document.getElementById("objectLeft").value="",document.getElementById("objectTop").value="",document.getElementById("objectAngle").value="",document.getElementById("objectScale").value=""});let presentationModeActive=!1,originalCanvasDimensions={width:0,height:0};function startPresentation(){let e=0;!function t(){if(e<slidesData.slides.length){renderSlide(slidesData.slides[e],e,!0);let a=new SpeechSynthesisUtterance(slidesData.slides[e].speech);window.speechSynthesis.speak(a),a.onend=function(){e++,t()}}else window.speechSynthesis.cancel(n),document.getElementById("toolbar").style.display="block",document.getElementById("minimap").style.display="flex",presentationModeActive=!1,document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.msExitFullscreen&&document.msExitFullscreen()}()}document.addEventListener("keydown",function(e){if(" "===e.key){presentationModeActive=!presentationModeActive;let t=document.getElementById("toolbar"),a=document.getElementById("minimap"),i=document.getElementById("mainCanvas");i.style.display="block",i.style.backgroundColor=slidesData.slides[currentSlideIndex].canvas.background||"#ffffff",i.style.width=window.innerWidth,i.style.width=window.innerHeight,presentationModeActive?(originalCanvasDimensions.width=mainCanvas.getWidth(),originalCanvasDimensions.height=mainCanvas.getHeight(),t.style.display="none",a.style.display="none",mainCanvas.setWidth(window.innerWidth),mainCanvas.setHeight(window.innerHeight),mainCanvas.calcOffset(),mainCanvas.renderAll(),document.body.requestFullscreen?document.body.requestFullscreen():document.body.mozRequestFullScreen?document.body.mozRequestFullScreen():document.body.webkitRequestFullscreen?document.body.webkitRequestFullscreen():document.body.msRequestFullscreen&&document.body.msRequestFullscreen(),startPresentation()):(t.style.display="block",a.style.display="flex",mainCanvas.setWidth(originalCanvasDimensions.width),mainCanvas.setHeight(originalCanvasDimensions.height),mainCanvas.calcOffset(),mainCanvas.renderAll(),document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.msExitFullscreen&&document.msExitFullscreen())}}),document.addEventListener("keydown",function(e){console.log("Key pressed:",e.key);let t=mainCanvas.getActiveObject();"Alt"===e.key&&"image"===t.type&&setAsBackground(t)}),document.getElementById("alignTop").addEventListener("click",function(){let e=mainCanvas.getActiveObject();e&&(e.set("top",0).setCoords(),mainCanvas.requestRenderAll())}),document.getElementById("alignBottom").addEventListener("click",function(){let e=mainCanvas.getActiveObject();e&&(e.set("top",mainCanvas.height-e.height*e.scaleY).setCoords(),mainCanvas.requestRenderAll())}),document.getElementById("alignLeft").addEventListener("click",function(){let e=mainCanvas.getActiveObject();e&&(e.set("left",0).setCoords(),mainCanvas.requestRenderAll())}),document.getElementById("alignRight").addEventListener("click",function(){let e=mainCanvas.getActiveObject();e&&(e.set("left",mainCanvas.width-e.width*e.scaleX).setCoords(),mainCanvas.requestRenderAll())}),document.getElementById("alignCenterHorizontal").addEventListener("click",function(){let e=mainCanvas.getActiveObject();e&&(e.set("left",(mainCanvas.width-e.width*e.scaleX)/2).setCoords(),mainCanvas.requestRenderAll())}),document.getElementById("alignCenterVertical").addEventListener("click",function(){let e=mainCanvas.getActiveObject();e&&(e.set("top",(mainCanvas.height-e.height*e.scaleY)/2).setCoords(),mainCanvas.requestRenderAll())}),document.getElementById("objectLeft").addEventListener("change",function(){let e=mainCanvas.getActiveObject();e&&(e.set("left",parseFloat(this.value)).setCoords(),mainCanvas.requestRenderAll())}),document.getElementById("objectTop").addEventListener("change",function(){let e=mainCanvas.getActiveObject();e&&(e.set("top",parseFloat(this.value)).setCoords(),mainCanvas.requestRenderAll())}),document.getElementById("objectAngle").addEventListener("change",function(){let e=mainCanvas.getActiveObject();e&&(e.set("angle",parseFloat(this.value)).setCoords(),mainCanvas.requestRenderAll())}),document.getElementById("objectScale").addEventListener("change",function(){let e=mainCanvas.getActiveObject();e&&(e.scale(parseFloat(this.value)).setCoords(),mainCanvas.requestRenderAll())}),document.getElementById("objectFont").addEventListener("change",function(){let e=mainCanvas.getActiveObject();e&&"i-text"===e.type&&(e.set("fontFamily",this.value),mainCanvas.requestRenderAll())}),document.getElementById("objectFontSize").addEventListener("change",function(){let e=mainCanvas.getActiveObject();e&&"i-text"===e.type&&(e.set("fontSize",parseInt(this.value,10)),mainCanvas.requestRenderAll())}),document.getElementById("objectColor").addEventListener("change",function(){let e=mainCanvas.getActiveObject();e&&(e.set("fill",this.value),mainCanvas.requestRenderAll())}),document.getElementById("objectCharSpacing").addEventListener("change",function(){let e=mainCanvas.getActiveObject();e&&"i-text"===e.type&&(e.set({charSpacing:parseInt(this.value,10)}),mainCanvas.renderAll())}),document.getElementById("objectOpacity").addEventListener("change",function(){let e=mainCanvas.getActiveObject();e&&(e.set({opacity:parseFloat(this.value)}),mainCanvas.renderAll())}),document.getElementById("boldText").addEventListener("click",function(){let e=mainCanvas.getActiveObject();if(e&&"i-text"===e.type){let t="bold"===e.fontWeight;e.set({fontWeight:t?"normal":"bold"}),mainCanvas.renderAll()}}),document.getElementById("underlineText").addEventListener("click",function(){let e=mainCanvas.getActiveObject();if(e&&"i-text"===e.type){let t="underline"===e.textDecoration;e.set({textDecoration:t?"":"underline"}),mainCanvas.renderAll()}}),document.getElementById("alignLeft").addEventListener("click",function(){let e=mainCanvas.getActiveObject();e&&"i-text"===e.type&&(e.set({textAlign:"left"}),mainCanvas.renderAll())}),document.getElementById("alignCenter").addEventListener("click",function(){let e=mainCanvas.getActiveObject();e&&"i-text"===e.type&&(e.set({textAlign:"center"}),mainCanvas.renderAll())}),document.getElementById("alignRight").addEventListener("click",function(){let e=mainCanvas.getActiveObject();e&&"i-text"===e.type&&(e.set({textAlign:"right"}),mainCanvas.renderAll())}),mainCanvas.on("object:modified",function(){slidesData.slides[currentSlideIndex].canvas=mainCanvas.toJSON()}),document.querySelectorAll(".expandable-section h4").forEach(function(e){e.addEventListener("click",function(){this.classList.toggle("active");this.parentElement.querySelectorAll(".expandable-content").forEach(function(e){"flex"===e.style.display?e.style.display="none":e.style.display="flex"})})});        
        // Add your existing JavaScript code to load this data and play the presentation
    </script>
</body>
</html>
        `;

    // Create a Blob object and generate a download link
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "presentation.html";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
});

// Your existing startPresentation function can remain as it is.

function startPresentation() {
  // Code to play all animations and voiceover scripts in order

  let i = 0;
  function playSlide() {
    if (i < slidesData.slides.length) {
      // Render slide and play animation
      renderSlide(slidesData.slides[i], i, true);

      // Play voiceover
      const speech = new SpeechSynthesisUtterance(slidesData.slides[i].speech);
      window.speechSynthesis.speak(speech);

      speech.onend = function () {
        // Move to the next slide
        i++;
        playSlide();
      };
    } else {
      // All slides are over, show the minimap and toolbar again
      document.getElementById("toolbar").style.display = "block";
      document.getElementById("minimap").style.display = "flex";
      presentationModeActive = false;

      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
    }
  }

  playSlide();
}

// Hide the context menu when clicked anywhere else in the document
document.addEventListener("keydown", function (event) {
  // Your code here
  console.log("Key pressed:", event.key);

  let objectimg = mainCanvas.getActiveObject();

  if (event.key === "Alt" && objectimg.type === "image") {
    setAsBackground(objectimg);
  }
});

// Align Top
document.getElementById("alignTop").addEventListener("click", function () {
  let activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    activeObject.set("top", 0).setCoords();
    mainCanvas.requestRenderAll();
  }
});

// Align Bottom
document.getElementById("alignBottom").addEventListener("click", function () {
  let activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    activeObject
      .set("top", mainCanvas.height - activeObject.height * activeObject.scaleY)
      .setCoords();
    mainCanvas.requestRenderAll();
  }
});

// Align Left
document.getElementById("alignLeft").addEventListener("click", function () {
  let activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    activeObject.set("left", 0).setCoords();
    mainCanvas.requestRenderAll();
  }
});

// Align Right
document.getElementById("alignRight").addEventListener("click", function () {
  let activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    activeObject
      .set("left", mainCanvas.width - activeObject.width * activeObject.scaleX)
      .setCoords();
    mainCanvas.requestRenderAll();
  }
});

// Center Horizontally
document
  .getElementById("alignCenterHorizontal")
  .addEventListener("click", function () {
    let activeObject = mainCanvas.getActiveObject();
    if (activeObject) {
      activeObject
        .set(
          "left",
          (mainCanvas.width - activeObject.width * activeObject.scaleX) / 2
        )
        .setCoords();
      mainCanvas.requestRenderAll();
    }
  });

// Center Vertically
document
  .getElementById("alignCenterVertical")
  .addEventListener("click", function () {
    let activeObject = mainCanvas.getActiveObject();
    if (activeObject) {
      activeObject
        .set(
          "top",
          (mainCanvas.height - activeObject.height * activeObject.scaleY) / 2
        )
        .setCoords();
      mainCanvas.requestRenderAll();
    }
  });

document.getElementById("objectLeft").addEventListener("change", function () {
  let activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    activeObject.set("left", parseFloat(this.value)).setCoords();
    mainCanvas.requestRenderAll();
  }
});

document.getElementById("objectTop").addEventListener("change", function () {
  let activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    activeObject.set("top", parseFloat(this.value)).setCoords();
    mainCanvas.requestRenderAll();
  }
});

document.getElementById("objectAngle").addEventListener("change", function () {
  let activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    activeObject.set("angle", parseFloat(this.value)).setCoords();
    mainCanvas.requestRenderAll();
  }
});

document.getElementById("objectScale").addEventListener("change", function () {
  let activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    activeObject.scale(parseFloat(this.value)).setCoords();
    mainCanvas.requestRenderAll();
  }
});

document.getElementById("objectFont").addEventListener("change", function () {
  let activeObject = mainCanvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    activeObject.set("fontFamily", this.value);
    mainCanvas.requestRenderAll();
  }
});

document
  .getElementById("objectFontSize")
  .addEventListener("change", function () {
    let activeObject = mainCanvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set("fontSize", parseInt(this.value, 10));
      mainCanvas.requestRenderAll();
    }
  });

document.getElementById("objectColor").addEventListener("change", function () {
  let activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    activeObject.set("fill", this.value);
    mainCanvas.requestRenderAll();
  }
});

document.getElementById("deleteSlide").addEventListener("click", function () {
  // Check if there are slides to delete
  if (slidesData && slidesData.slides.length > 0) {
    // Remove the slide at the current index
    slidesData.slides.splice(currentSlideIndex, 1);

    // Update the minimap and other UI components
    populateMinimap(slidesData);

    // If the deleted slide was the last one, update the currentSlideIndex
    if (currentSlideIndex >= slidesData.slides.length) {
      currentSlideIndex = slidesData.slides.length - 1;
    }

    // Render the new current slide
    if (slidesData.slides.length > 0) {
      renderSlide(slidesData.slides[currentSlideIndex], currentSlideIndex);
    } else {
      // Clear the canvas if there are no more slides
      mainCanvas.clear();
    }
  } else {
    console.log("No slides to delete");
  }
});

document
  .getElementById("objectCharSpacing")
  .addEventListener("change", function () {
    let activeObject = mainCanvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set({ charSpacing: parseInt(this.value, 10) });
      mainCanvas.renderAll();
    }
  });

document
  .getElementById("objectOpacity")
  .addEventListener("change", function () {
    let activeObject = mainCanvas.getActiveObject();
    if (activeObject) {
      activeObject.set({ opacity: parseFloat(this.value) });
      mainCanvas.renderAll();
    }
  });

document.getElementById("boldText").addEventListener("click", function () {
  const activeObject = mainCanvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    const isBold = activeObject.fontWeight === "bold";
    activeObject.set({ fontWeight: isBold ? "normal" : "bold" });
    mainCanvas.renderAll();
  }
});

document.getElementById("underlineText").addEventListener("click", function () {
  const activeObject = mainCanvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    const isUnderlined = activeObject.textDecoration === "underline";
    activeObject.set({ textDecoration: isUnderlined ? "" : "underline" });
    mainCanvas.renderAll();
  }
});

document.getElementById("alignLeft").addEventListener("click", function () {
  const activeObject = mainCanvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    activeObject.set({ textAlign: "left" });
    mainCanvas.renderAll();
  }
});

document.getElementById("alignCenter").addEventListener("click", function () {
  const activeObject = mainCanvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    activeObject.set({ textAlign: "center" });
    mainCanvas.renderAll();
  }
});

document.getElementById("alignRight").addEventListener("click", function () {
  const activeObject = mainCanvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    activeObject.set({ textAlign: "right" });
    mainCanvas.renderAll();
  }
});

mainCanvas.on("object:modified", function () {
  slidesData.slides[currentSlideIndex].canvas = mainCanvas.toJSON();
});

// Make the sections expandable
document.querySelectorAll(".expandable-section h4").forEach(function (header) {
  header.addEventListener("click", function () {
    this.classList.toggle("active");
    const contents = this.parentElement.querySelectorAll(".expandable-content");
    contents.forEach(function (content) {
      if (content.style.display === "flex") {
        content.style.display = "none";
      } else {
        content.style.display = "flex";
      }
    });
  });
});
