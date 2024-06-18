import './style.css'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { fabric } from 'fabric';

var jobDetails = JSON.parse(localStorage.getItem('jobDetails')) || [
  { id: "1", date: '01 January  2024', title: 'Job interview preparations', description: 'Your success in a job interview depends a great deal on how you prepare for it. Interview preparation primarily involves researching the job and the company and thoughtfully considering your answers to the interview question' },

  { id: "2", date: '01 Febuary 2024', title: 'Job interview preparations', description: 'Your success in a job interview depends a great deal on how you prepare for it. Interview preparation primarily involves researching the job and the company and thoughtfully considering your answers to the interview question' },

  { id: "3", date: '01 March 2024', title: 'Job interview preparations', description: 'Your success in a job interview depends a great deal on how you prepare for it. Interview preparation primarily involves researching the job and the company and thoughtfully considering your answers to the interview question' },

  { id: "4", date: '01 April 2024', title: 'Job interview preparations', description: 'Your success in a job interview depends a great deal on how you prepare for it. Interview preparation primarily involves researching the job and the company and thoughtfully considering your answers to the interview question' },

  { id: "5", date: '01 May 2024', title: 'Job interview preparations', description: 'Your success in a job interview depends a great deal on how you prepare for it. Interview preparation primarily involves researching the job and the company and thoughtfully considering your answers to the interview question' },

  { id: "6", date: '01 June 2024', title: 'Job interview preparations', description: 'Your success in a job interview depends a great deal on how you prepare for it. Interview preparation primarily involves researching the job and the company and thoughtfully considering your answers to the interview question' },

  { id: "7", date: '01 July 2024', title: 'Job interview preparations', description: 'Your success in a job interview depends a great deal on how you prepare for it. Interview preparation primarily involves researching the job and the company and thoughtfully considering your answers to the interview question' }

]
var container = document.createElement('div')
container.className = "container"

var leftDiv = document.createElement('div')//leftdiv  
leftDiv.className = "left-div"
container.appendChild(leftDiv)

var centerDiv = document.createElement('div')//centerdiv
centerDiv.className = "center-div"
container.appendChild(centerDiv)

var rightDiv = document.createElement('div')//rightdiv 
rightDiv.className = "right-div"
container.appendChild(rightDiv)

var addButton1 = document.createElement('button')
addButton1.className = "add-btn"
addButton1.innerHTML = '<i class="fa-solid fa-plus"></i>'
leftDiv.appendChild(addButton1)

var taskButton = document.createElement('button')
taskButton.className = "task-btn"
taskButton.innerHTML = '<i class="fa-solid fa-check"></i>'
leftDiv.appendChild(taskButton)

var scribleButton = document.createElement('button')
scribleButton.className = "scrible-btn"
scribleButton.innerHTML = '<i class="fa-solid fa-pencil"></i>'
leftDiv.appendChild(scribleButton)

var shareButton = document.createElement('button')
shareButton.className = "share-btn"
shareButton.innerHTML = '<i class="fa-solid fa-share-nodes"></i>'
leftDiv.appendChild(shareButton)

document.body.appendChild(container)



// renderdata
function renderData() {
  var content = jobDetails.map(function (item) {
    return `<div class= "inner-div" data-id="${item.id}">    
          <button class="inner-div-delete-btn" data-id="${item.id}">X</button>
          <h3>${item.date}</h3>
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          
          </div>`
  }).join("")
  centerDiv.innerHTML = content

  // Add event listeners to inner delete buttons
  var deleteButtons = document.querySelectorAll('.inner-div-delete-btn');
  deleteButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      var id = event.target.getAttribute('data-id');
      deleteItem(id)
    });
  });

  // Add event listeners to innerDivs
  var innerDivs = document.querySelectorAll('.inner-div');
  innerDivs.forEach(function (item) {
    item.addEventListener('click', function () {
      var id = item.getAttribute('data-id')
      document.querySelectorAll('.inner-div').forEach(function (note) {
        note.classList.remove('active');
        note.style.backgroundColor = '';
      });
      item.classList.add('active');
      item.style.backgroundColor = 'red';
      renderDataRightDiv(jobDetails, index); 
    });
  });
}
//function delete innerDiv
function deleteItem(id) {
  jobDetails = jobDetails.filter(function (item) {
    return item.id !== id;
  });
  saveToLocalStorage();
  renderData()
}

//sort by date
jobDetails.sort(function (a, b) {
  return new Date(b.date) - new Date(a.date);
});
renderData()

// render data in rightDiv 
function renderDataRightDiv(jobDetails, index) {
  var dataindex = rightDiv.setAttribute('data-index', index)
  rightDiv.innerHTML = ""

  var headingdiv = document.createElement('h3')
  headingdiv.className = "heading-div"
  var titleDiv = document.createElement('h4')
  var descriptionDiv = document.createElement('p')
  descriptionDiv.id = "content"

  titleDiv.contentEditable = "true"
  descriptionDiv.contentEditable = "true"

  headingdiv.textContent = jobDetails[index].date
  titleDiv.textContent = jobDetails[index].title
  descriptionDiv.innerHTML = jobDetails[index].description

  rightDiv.appendChild(headingdiv)
  rightDiv.appendChild(titleDiv)

  if (jobDetails[index].type === 'drawing') {
    var canvasDiv = document.createElement('div')
    canvasDiv.className = "canvas-div"
    canvasDiv.innerHTML = '<canvas id="canvas"></canvas>'
    rightDiv.appendChild(canvasDiv)

    var canvas = new fabric.Canvas('canvas', {
      isDrawingMode: true
    })
    // canvas autoSave
    if (jobDetails[index].description.includes('<img')) {
      var imgSrc = jobDetails[index].description.match(/src="([^"]+)"/)[1];
      fabric.Image.fromURL(imgSrc, function (img) {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    }
    canvas.on('object:modified', function () {
      autoSaveDrawing(canvas);
    });
    canvas.on('path:created', function () {
      autoSaveDrawing(canvas);
    });
    //canvas autoSave function
    function autoSaveDrawing(canvas) {
      var drawingData = canvas.toDataURL('image/png');
      jobDetails[index].description = `<img src="${drawingData}" />`;
      saveToLocalStorage();
      renderData(jobDetails);
      renderDataRightDiv(jobDetails, index)
    }
    // clear Canvas Button
    var clearButton = document.createElement('button');
    clearButton.textContent = 'Clear Canvas';
    clearButton.classList.add('canvas-clear-btn');
    rightDiv.appendChild(clearButton);
    var index = rightDiv.getAttribute('data-index');

    // add addEventListener to clear canvas button
    clearButton.addEventListener('click', function () {
      canvas.clear();
      jobDetails[index].description = '';
      saveToLocalStorage();
      renderData()
      renderDataRightDiv(jobDetails, index);
    });

  } else {
    //  add quill editor
    var quillContainer = document.createElement('div')
    quillContainer.className = "content"
    rightDiv.appendChild(quillContainer)
    quillContainer.textContent = jobDetails[index].date
    quillContainer.textContent = jobDetails[index].title
    quillContainer.innerHTML = jobDetails[index].description
    var quill = new Quill(".content", {
      theme: "snow"
    })
    quill.on('text-change', function () {
      jobDetails[index].description = quill.root.innerHTML;
      jobDetails[index].date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

      saveToLocalStorage()
      renderData(jobDetails)
    });
  }
  rightDiv.addEventListener('input', changeData)
}
//change data when edit
function changeData() {
  var index = rightDiv.getAttribute('data-index')
  var headingdiv = rightDiv.querySelector('h3')
  var titleDiv = rightDiv.querySelector('h4')
  var descriptionDiv = rightDiv.querySelector('p')

  jobDetails[index].date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  jobDetails[index].title = titleDiv.textContent
  jobDetails[index].description = descriptionDiv.textContent
  saveToLocalStorage()
  renderData()
  var changeDate = document.querySelector('.heading-div')
  changeDate.textContent = jobDetails[index].date
}
// addButton
addButton1.addEventListener('click', function () {
  var date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  var newObject = { date: date, title: 'Title..', description: 'Description...' }
  jobDetails.unshift(newObject)
  saveToLocalStorage()
  renderData()
  renderDataRightDiv(jobDetails, 0)
})

// task button
taskButton.addEventListener('click', function () {
  var date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  var newObject = { date: date, title: 'Title..', description: 'to do: <ul><li></li></ul>' }
  jobDetails.unshift(newObject)
  saveToLocalStorage()
  renderData()
  renderDataRightDiv(jobDetails, 0)
})
renderDataRightDiv(jobDetails, 0)

// scrible button function
function scriblebtn() {
  rightDiv.innerHTML = ""
  var date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  var newObject = { date: date, title: 'Title..', description: 'Description...', type: 'drawing' }
  jobDetails.unshift(newObject)
  saveToLocalStorage()
  renderData()
  renderDataRightDiv(jobDetails, 0)
}
scribleButton.addEventListener('click', scriblebtn)

// localStorage function
function saveToLocalStorage() {
  localStorage.setItem('jobDetails', JSON.stringify(jobDetails));
}
// add addEventListener to shareButton
shareButton.addEventListener('click', async function () {
  try {
    var index = rightDiv.getAttribute('data-index');
    if (navigator.share) {
      await navigator.share({
        title: jobDetails[index].title,
        text: jobDetails[index].description,
        url: window.location.href
      });
    } else {
      console.log('Web Share API not supported.');
    }
  } catch (error) {
    console.error('Error sharing:', error); 
  }
});


