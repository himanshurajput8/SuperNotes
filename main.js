import './style.css'

var jobDetails = JSON.parse(localStorage.getItem('jobDetails')) || [
  { id: "1", date: '01 January  2024', title: 'Job interview preparations', description: 'Your success in a job interview depends a great deal on how you prepare for it. Interview preparation primarily involves researching the job and the company and thoughtfully considering your answers to the interview question' },

  { id: "2", date: '01 Febuary 2024', title: 'Job interview preparations', description: 'Your success in a job interview depends a great deal on how you prepare for it. Interview preparation primarily involves researching the job and the company and thoughtfully considering your answers to the interview question' },

  { id: "3", date: '01 March 2024', title: 'Job interview preparations', description: 'Your success in a job interview depends a great deal on how you prepare for it. Interview preparation primarily involves researching the job and the company and thoughtfully considering your answers to the interview question' },

  { id: "4", date: '01 April', title: 'Job interview preparations', description: 'Your success in a job interview depends a great deal on how you prepare for it. Interview preparation primarily involves researching the job and the company and thoughtfully considering your answers to the interview question' },

  { id: "5", date: '01 May', title: 'Job interview preparations', description: 'Your success in a job interview depends a great deal on how you prepare for it. Interview preparation primarily involves researching the job and the company and thoughtfully considering your answers to the interview question' },

  { id: "6", date: '01 June', title: 'Job interview preparations', description: 'Your success in a job interview depends a great deal on how you prepare for it. Interview preparation primarily involves researching the job and the company and thoughtfully considering your answers to the interview question' },

  { id: "7", date: '01 July', title: 'Job interview preparations', description: 'Your success in a job interview depends a great deal on how you prepare for it. Interview preparation primarily involves researching the job and the company and thoughtfully considering your answers to the interview question' }

]
var container = document.createElement('div')  
container.className = "container"  

var leftDiv = document.createElement('div')//leftdiv 
leftDiv.className = "left-div" 
container.appendChild(leftDiv) 

// var darkThemebtn = document.querySelector('#darkbutton')//append themebutton 
// leftDiv.appendChild(darkThemebtn)

var centerDiv = document.createElement('div')//centerdiv
centerDiv.className = "center-div"
container.appendChild(centerDiv)

var rightDiv = document.createElement('div')//rightdiv
rightDiv.className = "right-div"
// rightDiv.contentEditable = true
container.appendChild(rightDiv)

var addButton1 = document.createElement('button')
addButton1.className = "add-btn"
addButton1.innerHTML = '<i class="fa-solid fa-plus"></i>'
leftDiv.appendChild(addButton1)

var button2 = document.createElement('button')
button2.className = "btn2"
button2.innerHTML = '<i class="fa-solid fa-check"></i>'
leftDiv.appendChild(button2)

var button3 = document.createElement('button')
button3.className = "btn3"
button3.innerHTML = '<i class="fa-solid fa-pencil"></i>'
leftDiv.appendChild(button3)

var button4 = document.createElement('button')
button4.className = "btn4"
button4.innerHTML = '<i class="fa-regular fa-note-sticky"></i>'
leftDiv.appendChild(button4)

var shareButton = document.createElement('button')
shareButton.className = "btn5"
shareButton.innerHTML = '<i class="fa-solid fa-share-nodes"></i>'
leftDiv.appendChild(shareButton)

document.body.appendChild(container)

// renderdata
function renderData() {
  var content = jobDetails.map(function (item) {
      return `<div class= "inner-div" ${item.id}> 
          <h3>${item.date}</h3>
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          </div>`
  }).join("")
  centerDiv.innerHTML = content

  //add addEventlistner to innerDivs
  var innerDivs = document.querySelectorAll('.inner-div')
  innerDivs.forEach(function (item, index) {
      item.addEventListener('click', function () { 
          renderDataRightDiv(jobDetails, index)  
      })
  })
}
renderData()

// render data in rightDiv 
function renderDataRightDiv(jobDetails, index) {
  var dataindex = rightDiv.setAttribute('data-index', index)
  rightDiv.innerHTML = ""

  var headingdiv = document.createElement('h3')
  var titleDiv = document.createElement('h4')
  var descriptionDiv = document.createElement('p')
  descriptionDiv.id = "content"

  // headingdiv.contentEditable = "false"
  titleDiv.contentEditable = "true"
  descriptionDiv.contentEditable = "true"

  headingdiv.textContent = jobDetails[index].date
  titleDiv.textContent = jobDetails[index].title
  descriptionDiv.innerHTML = jobDetails[index].description

  rightDiv.appendChild(headingdiv)
  rightDiv.appendChild(titleDiv)
  // rightDiv.appendChild(descriptionDiv)

  if (jobDetails[index].type === 'drawing' ) {
      // var saveButton = document.createElement('button')
      // saveButton.textContent = "Save"
      // saveButton.id = "save-btn"
      // rightDiv.appendChild(saveButton)

      var canvasDiv = document.createElement('div')
      canvasDiv.className = "canvas-div"
      canvasDiv.innerHTML = '<canvas id="canvas"></canvas>'
      rightDiv.appendChild(canvasDiv)

      var canvas = new fabric.Canvas('canvas', {
          isDrawingMode: true
      })
      // 
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
      function autoSaveDrawing(canvas) {
  var drawingData = canvas.toDataURL('image/png');
  jobDetails[index].description = `<img src="${drawingData}" />`;
  saveToLocalStorage();
  renderData(jobDetails);
  renderDataRightDiv(jobDetails, index) 
}
var clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Canvas';
        clearButton.classList.add('clear-btn');
        rightDiv.appendChild(clearButton);

        clearButton.addEventListener('click', function () {
            canvas.clear();
            currentNote.content = '';
            for (let i = 0; i < jobDetails.length; i++) {
                if (jobDetails[i].id === jobDetails[index].id) {
                    jobDetails[i].content = '';                 
                }}
                        saveToLocalStorage();
                        renderNotes(jobDetails);
                    });
      //
      // saveButton.addEventListener('click', function () {
      //     var dataUrl = canvas.toDataURL('image/png')
      //     var index = rightDiv.getAttribute('data-index')
      //     jobDetails[index].description = `<img src="${dataUrl}"/>`
      //     saveToLocalStorage()
      //     renderData()
      //     renderDataRightDiv(jobDetails, index)
      // })

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
          saveToLocalStorage()
          renderData(jobDetails)
      });
  }
  rightDiv.addEventListener('input', changeData)
}

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
button2.addEventListener('click', function () {
  var date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  var newObject = { date: date, title: 'Title..', description: 'to do: <ul><li></li></ul> ' }
  jobDetails.unshift(newObject)
  saveToLocalStorage()
  renderData()
  renderDataRightDiv(jobDetails, 0)
})
renderDataRightDiv(jobDetails, 0)

function scriblebtn() {
  rightDiv.innerHTML = ""      
  var date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  var newObject = { date: date, title: 'Title..', description: 'Description...', type: 'drawing' }
  jobDetails.unshift(newObject)
  saveToLocalStorage()
  renderData()
  renderDataRightDiv(jobDetails, 0)
}
button3.addEventListener('click', scriblebtn)
// localStorage
function saveToLocalStorage(){
  localStorage.setItem  ('jobDetails', JSON.stringify(jobDetails)); 
}





// // theme
// var darkbtn = document.querySelector('#darkbutton')
// darkbtn.addEventListener('click', function () {
//     document.body.style.backgroundColor = "gray"

//     centerDiv.style.color = "white"
//     centerDiv.id = "darkk"
//     leftDiv.id = "theme-left-div"
//     rightDiv.style.backgroundColor = "black"
//     darkbtn.style.backgroundColor = "lightgray"
//     darkbtn.style.color = "black"
//     darkbtn.textContent = "light"
// })
