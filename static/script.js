document
  .getElementById("jsonInput")
  .addEventListener("change", handleFileUpload, { passive: true });
let mainCanvas = new fabric.Canvas("mainCanvas", {
  fireRightClick: true, // <-- enable firing of right click events
  //   fireMiddleClick: true, // <-- enable firing of middle click events
  stopContextMenu: true, // <--  prevent context menu from showing
});
// let slidesData;

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
      // slidesData = JSON.parse(content);
      slidesData = JSON.parse(content);
      console.log("Parsed JSON from uploaded file:", slidesData);  // Debugging Step 1
      populateMinimap(slidesData);
    };
    reader.readAsText(file);
  }
}


function switchSlide(index) {
  if (index >= 0 && index < slidesData.slides.length) {
    // Save the current slide's state
    slidesData.slides[currentSlideIndex].canvas = mainCanvas.toJSON();

    // Update currentSlideIndex
    currentSlideIndex = index;
    // Load the next slide's state
    const slideData = slidesData.slides[currentSlideIndex];
    renderSlide(slideData,currentSlideIndex,mainCanvas)

    // mainCanvas.loadFromJSON(slideData.canvas, mainCanvas.renderAll.bind(mainCanvas));
  }
}


let thumbCanvasArray = [];  // Array to store Fabric canvases for thumbnails
let fabricObjects = [];
let currentSlideIndex = 0;
let slidesData = {
  slides: []  // Your slides array, which should be initialized with your data
};

function renderSlide(slide, index,canvas, animate = false) {
  console.log("Rendering slide with data:", slide);


  



  // if (slidesData.slides[currentSlideIndex]) {
  // }
  if (canvas === mainCanvas) {

    // slidesData.slides[currentSlideIndex].canvas = canvas.toJSON();
    
    const voiceOverScript = document.getElementById("voiceOverScript");
    voiceOverScript.value = slide.speech || "";
    // currentSlideIndex = index;
  canvas.clear();

    canvas.setWidth(slide.canvas.width || 600);
    canvas.setHeight(slide.canvas.height || 337.7);
    canvas.renderAll();

    
  // const fabricObjects = [];
  // const objects = slide.canvas.objects;
    // canvas.clear();
    // for (let i = 0; i < (objects && objects.length); i++) {
    
    //   const obj = objects[i];
    //   console.log("Processing object:", obj); // Debugging inside loop
    //   let fabricObj;
  
  
    //   switch (obj.type) {
    //     case "video":
    //       var videoEl = document.createElement("video");
    //       var sourceEl = document.createElement("source");
    //       sourceEl.src = obj.src;
    //       videoEl.appendChild(sourceEl);
    //       var videoObj = new fabric.Image(videoEl, obj);
    //       canvas.add(videoObj);
    //       videoObj.getElement().play();
    //       fabricObj = videoObj;
  
    //       break;
    //     case "rect":
    //       var rectObj = new fabric.Rect(obj);
    //       canvas.add(rectObj);
    //       fabricObj = rectObj;
  
    //       break;
    //     case "i-text":
    //       var textbox = new fabric.IText(obj.text, obj);
    //       canvas.add(textbox);
    //       fabricObj = textbox;
  
    //       break;
    //     case "image":
    //       delete obj.clipPath;
    //       var imageElement = document.createElement("img");
  
    //       imageElement.setAttribute("src", obj.src);
    //       // Initiate an Image object
    //       var image = new fabric.Image(imageElement);
    //       image.set(obj);
    //       canvas.add(image);
    //       fabricObj = image;
  
    //       break;
    //     case "circle":
    //       var cirObj = new fabric.Circle(obj);
    //       canvas.add(cirObj);
    //       fabricObj = cirObj;
  
    //       break;
    //     default:
    //       console.log("Unknown object type:", obj.type);
    //       break;
    //   }
  
    //   fabricObjects.push(fabricObj);
  
    //   if (canvas === mainCanvas && canvas.getObjects().length > 0) {
    //     const firstObject = canvas.item(0);
    //     canvas.setActiveObject(firstObject);
    //   }
    // canvas.renderAll();
  
  
    // }
    // canvas.setBackgroundColor(slide.canvas.background || "#ffffff", () => {
    //   canvas.renderAll();

    // });
  }

  mainCanvas.clear();
   fabricObjects = [];
  var objects = slide.canvas.objects;

  // console.log("Processings:", objects); 
  for (let i = 0; i < (objects && objects.length); i++) {
    
    var obj = objects[i];
    if (obj.animation && obj.animation.type && obj.animation.duration) {
      console.log(fabricObj);
      animateSingleObject(fabricObj, obj.animation.type, obj.animation.duration);
  }
    console.log("Processing object:", obj); // Debugging inside loop
    var fabricObj;

    if (!obj.animation) {
      obj.animation = {
          type: 'fadeIn',
          duration: 1000
      };
  }



    switch (obj.type) {
      case "video":
        var videoEl = document.createElement("video");
        var sourceEl = document.createElement("source");
        sourceEl.src = obj.src;
        videoEl.appendChild(sourceEl);
        var videoObj = new fabric.Image(videoEl, obj);
        canvas.add(videoObj);
        videoObj.getElement().play();
        fabricObj = videoObj;

        break;
      case "rect":
        var rectObj = new fabric.Rect(obj);
        canvas.add(rectObj);
        fabricObj = rectObj;

        break;
      case "i-text":
        var textbox = new fabric.IText(obj.text, obj);
        canvas.add(textbox);
        fabricObj = textbox;

        break;
      case "image":
        delete obj.clipPath;
        var imageElement = document.createElement("img");

        imageElement.setAttribute("src", obj.src);
        // Initiate an Image object
        var image = new fabric.Image(imageElement);
        image.set(obj);
        canvas.add(image);
        fabricObj = image;

        break;
      case "circle":
        var cirObj = new fabric.Circle(obj);
        canvas.add(cirObj);
        fabricObj = cirObj;

        break;
      default:
        console.log("Unknown object type:", obj.type);
        break;
    }

    fabricObjects.push(fabricObj);

    // if (canvas === mainCanvas && canvas.getObjects().length > 0) {
    //   const firstObject = canvas.item(0);
    //   canvas.setActiveObject(firstObject);
    // }
  if (animate && obj.animation && obj.animation.type && obj.animation.duration) {
    animateSingleObject(fabricObj, obj.animation.type, obj.animation.duration);
}


  }
  mainCanvas.requestRenderAll();

}


function populateMinimap(data) {
  console.log("Populating minimap with data:", data);
  let minimap = document.getElementById("minimap");
  minimap.innerHTML = "";
  data.slides.forEach((slide, index) => {
    let item = document.createElement("div");
    item.classList.add("minimap-item");
    
    // Create Plus Icon
    let plusBtn = document.createElement("button");
    plusBtn.classList.add("add-slide-button");
    let plusIcon = document.createElement("i");
    plusIcon.classList.add("far", "fa-plus");
    plusBtn.appendChild(plusIcon);
    
    // Attach Click Event to Plus Icon
    plusBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      duplicateSlide(index);
    });

    let fabricThumbCanvas = thumbCanvasArray[index];
    
    if (!fabricThumbCanvas) {
      // If not, create a new one and store it in the array
      let thumbCanvas = document.createElement("canvas");
      thumbCanvas.width = 180;  // 0.1 times the main canvas width
      thumbCanvas.height = 101.31;  // 0.1 times the main canvas height
      thumbCanvas.id = `thumbCanvas-${index}`;  // Set the ID attribute based on the index
      fabricThumbCanvas = new fabric.Canvas(thumbCanvas);
      thumbCanvasArray[index] = fabricThumbCanvas;  // Store the new Fabric canvas
    }
    fabricThumbCanvas.clear();
    renderSlide(slide, index, thumbCanvasArray[index]);  // Use the existing or new Fabric canvas

    // Scale down the objects by 0.1
    fabricThumbCanvas.forEachObject(function(obj) {
      obj.scaleX *= 0.3;
      obj.scaleY *= 0.3;
      obj.left *= 0.3;
      obj.top *= 0.3;
      obj.setCoords();
    });
    fabricThumbCanvas.renderAll();

    item.appendChild(fabricThumbCanvas.getElement());  // Append the canvas element to the DOM
    
    // Create Play All Button
    let playAllBtn = document.createElement("button");
    playAllBtn.classList.add("play-all-button");
    let playicon = document.createElement("i");
    playicon.classList.add("far", "fa-play");
    playAllBtn.appendChild(playicon);
    playAllBtn.addEventListener("click", () => {
      if (index !== null) {
        playAllAnimations(Number(index));
        mainCanvas.renderAll();
      }
    });
    
    // Attach click event to render the slide on the main canvas
    item.addEventListener("click", () => {
      if (index !== null) {
        switchSlide(Number(index));
      }
      renderSlide(slide, currentSlideIndex, mainCanvas);
      mainCanvas.renderAll();
    });
    
    // Append elements to Minimap and Minimap item
    minimap.appendChild(playAllBtn);
    minimap.appendChild(item);
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
    renderSlide(newSlide, mainCanvas,index + 1);
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
  renderSlide(slidesData.slides[slideIndex],  slideIndex, mainCanvas,true); // Enable animation

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


// Define SVG Icons
 var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

  var cloneIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 55.699 55.699' width='100px' height='100px' xml:space='preserve'%3E%3Cpath style='fill:%23010002;' d='M51.51,18.001c-0.006-0.085-0.022-0.167-0.05-0.248c-0.012-0.034-0.02-0.067-0.035-0.1 c-0.049-0.106-0.109-0.206-0.194-0.291v-0.001l0,0c0,0-0.001-0.001-0.001-0.002L34.161,0.293c-0.086-0.087-0.188-0.148-0.295-0.197 c-0.027-0.013-0.057-0.02-0.086-0.03c-0.086-0.029-0.174-0.048-0.265-0.053C33.494,0.011,33.475,0,33.453,0H22.177 c-3.678,0-6.669,2.992-6.669,6.67v1.674h-4.663c-3.678,0-6.67,2.992-6.67,6.67V49.03c0,3.678,2.992,6.669,6.67,6.669h22.677 c3.677,0,6.669-2.991,6.669-6.669v-1.675h4.664c3.678,0,6.669-2.991,6.669-6.669V18.069C51.524,18.045,51.512,18.025,51.51,18.001z M34.454,3.414l13.655,13.655h-8.985c-2.575,0-4.67-2.095-4.67-4.67V3.414z M38.191,49.029c0,2.574-2.095,4.669-4.669,4.669H10.845 c-2.575,0-4.67-2.095-4.67-4.669V15.014c0-2.575,2.095-4.67,4.67-4.67h5.663h4.614v10.399c0,3.678,2.991,6.669,6.668,6.669h10.4 v18.942L38.191,49.029L38.191,49.029z M36.777,25.412h-8.986c-2.574,0-4.668-2.094-4.668-4.669v-8.985L36.777,25.412z M44.855,45.355h-4.664V26.412c0-0.023-0.012-0.044-0.014-0.067c-0.006-0.085-0.021-0.167-0.049-0.249 c-0.012-0.033-0.021-0.066-0.036-0.1c-0.048-0.105-0.109-0.205-0.194-0.29l0,0l0,0c0-0.001-0.001-0.002-0.001-0.002L22.829,8.637 c-0.087-0.086-0.188-0.147-0.295-0.196c-0.029-0.013-0.058-0.021-0.088-0.031c-0.086-0.03-0.172-0.048-0.263-0.053 c-0.021-0.002-0.04-0.013-0.062-0.013h-4.614V6.67c0-2.575,2.095-4.67,4.669-4.67h10.277v10.4c0,3.678,2.992,6.67,6.67,6.67h10.399 v21.616C49.524,43.26,47.429,45.355,44.855,45.355z'/%3E%3C/svg%3E%0A"
var deleteImg = document.createElement('img');
deleteImg.src = deleteIcon;

var cloneImg = document.createElement('img');
cloneImg.src = cloneIcon;

// Delete Object Function
function deleteObject(eventData, transform) {
  var target = transform.target;
  var canvas = target.canvas;
  canvas.remove(target);
  canvas.requestRenderAll();
}

// Clone Object Function
function cloneObject(eventData, transform) {
  var target = transform.target;
  var canvas = target.canvas;
  target.clone(function(cloned) {
    cloned.left += 10;
    cloned.top += 10;
    canvas.add(cloned);
  });
}

// Icon Rendering Function
function renderIcon(icon) {
  return function(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
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



    if (activeObject.type === 'image') {
      activeObject.set({
        cornerSize: 10,
        cornerColor: 'blue',
        cornerStyle:'circle',
        transparentCorners: false,
        lockUniScaling: true,
      });
      
      // Add delete control
      activeObject.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -16,
        offsetX: 16,
        cursorStyle: 'pointer',
        mouseUpHandler: deleteObject,
        render: renderIcon(deleteImg),
        cornerSize: 24
      });

      // Add clone control
      activeObject.controls.clone = new fabric.Control({
        x: -0.5,
        y: -0.5,
        offsetY: -16,
        offsetX: -16,
        cursorStyle: 'pointer',
        mouseUpHandler: cloneObject,
        render: renderIcon(cloneImg),
        cornerSize: 24
      });
      
      activeObject.on('scaling', function(event) {
        const obj =activeObject;
        obj.set({
          width: obj.width * obj.scaleX,
          height: obj.height * obj.scaleY,
          scaleX: 1,
          scaleY: 1
        });
      });
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



function updateControls() {
  // Hide all sections by default
  document.getElementById('addSection').style.display = 'none';
  document.getElementById('layoutSection').style.display = 'none';
  document.getElementById('textSection').style.display = 'none';
  document.getElementById('animationSection').style.display = 'none';
  document.getElementById('speechSection').style.display = 'none';

  let activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    // Show common sections for all objects
    document.getElementById('layoutSection').style.display = 'block';

    // For text objects
    // For text objects
if (activeObject.type === 'textbox' || "i-text") {
  document.getElementById('textSection').style.display = 'block';

  // Update controls for text objects
  document.getElementById("objectFont").value = activeObject.fontFamily || "Arial";
  document.getElementById("objectFontSize").value = activeObject.fontSize || 16;
  document.getElementById("objectColor").value = activeObject.fill || "#000000";
  document.getElementById("boldText").checked = activeObject.fontWeight === "bold";
  document.getElementById("underlineText").checked = activeObject.textDecoration === "underline";
  // document.getElementById("textAlign").value = activeObject.textAlign || == 'center';
  document.getElementById("objectCharSpacing").value = activeObject.charSpacing || 0;
  document.getElementById("objectOpacity").value = activeObject.opacity || 1;
}


    // For images
    // For image objects
if (activeObject.type === 'image') {
  document.getElementById('addSection').style.display = 'block';
  
  // Update controls for image objects
  document.getElementById("objectWidth").value = activeObject.width * activeObject.scaleX;
  document.getElementById("objectHeight").value = activeObject.height * activeObject.scaleY;
  document.getElementById("objectAngle").value = activeObject.angle;
  document.getElementById("objectScale").value = activeObject.scaleX;
  document.getElementById("objectOpacity").value = activeObject.opacity || 1;


  activeObject.set({
    cornerSize: 10,
    cornerColor: 'blue',
    cornerStyle:'circle',
    transparentCorners: false,
    lockUniScaling: true,
  });
  
  // Add delete control
  activeObject.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon(deleteImg),
    cornerSize: 24
  });

  // Add clone control
  activeObject.controls.clone = new fabric.Control({
    x: -0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: -16,
    cursorStyle: 'pointer',
    mouseUpHandler: cloneObject,
    render: renderIcon(cloneImg),
    cornerSize: 24
  });
  
  activeObject.on('scaling', function(event) {
    const obj =activeObject;
    obj.set({
      width: obj.width * obj.scaleX,
      height: obj.height * obj.scaleY,
      scaleX: 1,
      scaleY: 1
    });
  });
}


    // For animation (if applicable)
if (activeObject.animation) {
  document.getElementById('animationSection').style.display = 'block';
  
  // Update controls for animation objects
  document.getElementById("animationType").value = activeObject.animation.type || "none";
  document.getElementById("animationDuration").value = activeObject.animation.duration || 1000;
}


    // // For voice-over elements
    // if (activeObject.voiceOver) {
    //   document.getElementById('speechSection').style.display = 'block';
    //   // ... update speech controls here
    // }
  }
  // If no object is selected, you may choose to show or hide specific sections
  else {
    // Example: Show only 'Add' section when no object is selected
    document.getElementById('addSection').style.display = 'block';

  }

  // ... update other controls here
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

  // populateMinimap(slidesData);
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
      renderSlide(slidesData.slides[i], mainCanvas, i, true);

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
      renderSlide(slidesData.slides[currentSlideIndex], mainCanvas, currentSlideIndex);
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

// Align text objects to the left within a group
document.getElementById("alignLeft").addEventListener("click", function () {
  const activeGroup = mainCanvas.getActiveObject();
  if (activeGroup && activeGroup.type === 'activeSelection') {
    const objects = activeGroup.getObjects();
    let leftMost = objects[0].left;
    objects.forEach((obj) => {
      if (obj.type === "i-text") {
        if (obj.left < leftMost) {
          leftMost = obj.left;
        }
      }
    });
    objects.forEach((obj) => {
      if (obj.type === "i-text") {
        obj.set({ left: leftMost });
      }
    });
    activeGroup.setCoords();  // Update the group's bounding box
    mainCanvas.renderAll();
  }
});

// Align text objects to the right within a group
document.getElementById("alignRight").addEventListener("click", function () {
  const activeGroup = mainCanvas.getActiveObject();
  if (activeGroup && activeGroup.type === 'activeSelection') {
    const objects = activeGroup.getObjects();
    let rightMost = objects[0].left + objects[0].width;
    objects.forEach((obj) => {
      if (obj.type === "i-text") {
        let right = obj.left + obj.width;
        if (right > rightMost) {
          rightMost = right;
        }
      }
    });
    objects.forEach((obj) => {
      if (obj.type === "i-text") {
        obj.set({ left: rightMost - obj.width });
      }
    });
    activeGroup.setCoords();  // Update the group's bounding box
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

// document.getElementById("alignRight").addEventListener("click", function () {
//   const activeObject = mainCanvas.getActiveObject();
//   if (activeObject && activeObject.type === "i-text") {
//     activeObject.set({ textAlign: "right" });
//     mainCanvas.renderAll();
//   }
// });

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

document.getElementById('distributeHorizontally').addEventListener('click', function() {
  const activeGroup = mainCanvas.getActiveObject();
  if (activeGroup && activeGroup.type === 'activeSelection') {
    const objects = activeGroup.getObjects();
    objects.sort((a, b) => a.left - b.left);
    const totalWidth = objects.reduce((acc, obj) => acc + obj.width, 0);
    const space = (activeGroup.width - totalWidth) / (objects.length - 1);

    let left = objects[0].left;
    objects.forEach((obj, index) => {
      obj.set({ left });
      left += obj.width + space;
    });

    activeGroup.setCoords();
    mainCanvas.renderAll();
  }
});

// Distribute selected objects vertically
document.getElementById('distributeVertically').addEventListener('click', function() {
  const activeGroup = mainCanvas.getActiveObject();
  if (activeGroup && activeGroup.type === 'activeSelection') {
    const objects = activeGroup.getObjects();
    objects.sort((a, b) => a.top - b.top);
    const totalHeight = objects.reduce((acc, obj) => acc + obj.height, 0);
    const space = (activeGroup.height - totalHeight) / (objects.length - 1);

    let top = objects[0].top;
    objects.forEach((obj, index) => {
      obj.set({ top });
      top += obj.height + space;
    });

    activeGroup.setCoords();
    mainCanvas.renderAll();
  }
});



// Bring the selected object one step forward in the z-index
document.getElementById('bringForward').addEventListener('click', function() {
  const activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    mainCanvas.bringForward(activeObject);
    mainCanvas.renderAll();
  }
});

// Send the selected object one step backward in the z-index
document.getElementById('bringBackward').addEventListener('click', function() {
  const activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    mainCanvas.sendBackwards(activeObject);
    mainCanvas.renderAll();
  }
});

// Bring the selected object to the front (top of the stack)
document.getElementById('toFront').addEventListener('click', function() {
  const activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    mainCanvas.bringToFront(activeObject);
    mainCanvas.renderAll();
  }
});

// Send the selected object to the back (bottom of the stack)
document.getElementById('toBack').addEventListener('click', function() {
  const activeObject = mainCanvas.getActiveObject();
  if (activeObject) {
    mainCanvas.sendToBack(activeObject);
    mainCanvas.renderAll();
  }
});
