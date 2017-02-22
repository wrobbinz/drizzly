function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

function loadCloud(response){
  var myArray = JSON.parse(response)
  var fillColor = d3.scale.linear()
            .domain([0,1,2,3,4,5,6,10,15,20,100])
            .range(["#00C8FA", "#3dd8ff", "#6de1ff", "#6de1ff", "#8ce8ff", "#444", "#555", "#666", "#777", "#888", "#999", "#aaa"]);
  var w = 1000, // if you modify this also modify .append("g") .attr -- as half of this
      h = 500;

  d3.layout.cloud().size([w, h])
      .words(myArray) // from list.js
      .padding(5)
      .rotate(0)      
      .font("Roboto")
      .fontSize(function(d) { return d.size; })
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
        .style("font-size", function(d) { return (d.size) + "px"; })
        .style("font-family", "Roboto")
        .style("fill", function(d, i) { return fillColor(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d,i) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            }
        )
      .text(function(d) { return d.text; })
      .on("click", function (d, i){
          window.open(d.url, "_blank");
      });
  }
}