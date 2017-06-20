$(".button-collapse").sideNav()
get('http://localhost:8000/api/news')
.then(function(response) {
  // document.getElementById("spinner").className = document.getElementById("spinner").className.replace( /(?:^|\s)active(?!\S)/g , '' )
  loadCloud(recreateArr(response))
}, function(error) {
  console.error("Failed!", error)
})

function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest()
    req.open('GET', url)

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response)
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText))
      }
    }

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"))
    }

    // Make the request
    req.send()
  })
}

let recreateArr = (response) => {
  let words = [], size = [], obj = []
  response = JSON.parse(response)
  response = response.data
  for (var i = 0; i < response.length; i++){
    words.push(response[i].word)
    size.push(response[i].size)
  }
  for (var i = 0; i < words.length; i++){
    var element = {}
    element.text = words[i]
    element.size = size[i]
    obj.push(element)
  }
  return obj
}

function loadCloud(obj){
  var myArray = obj
  var fillColor = d3.scale.linear()
            .domain([0,1,2,3,4,5,6,10,15,20,100])
            .range(["#bf4240", "#122336", "#14243D", "#1B3650", "#1B3E50", "#265073", "#2E638A", "#337599", "#397EAC", "#4B95C3", "#579AC7", "#6AA1CD"])


  var w = window.innerWidth // if you modify this also modify .append("g") .attr -- as half of this
  var h = window.innerHeight - 122
  console.log("window width: ", w, "window height: ", h)

  d3.layout.cloud().size([w, h])
      .words(myArray) // from list.js
      .padding(5)
      .rotate(0)
      .font("Yantramanav")
      .fontSize(function(d) { return d.size })
      .on("end", drawCloud)
      .start()

  function drawCloud(words) {
    d3.select(".cloud").append("svg")
        .attr("width", w)
        .attr("height", h)
      .append("g")
      .attr("transform", "translate(" + w/2 + "," + h/2 + ")")
      .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return (d.size) + "px" })
        .style("font-family", "Yantramanav")
        .style("fill", function(d, i) { return fillColor(i) })
        .attr("text-anchor", "middle")
        .attr("transform", function(d,i) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"
            }
        )
      .text(function(d) { return d.text })
      .on("click", function (d, i){
          window.open(d.url, "_blank")
      })
  }
}
