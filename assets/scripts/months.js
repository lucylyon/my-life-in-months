$(document).ready(function() {

  var obamadata = [
      { "name": "Hawaii", "value":72},
      { "name": "Jakarta", "value":45},
      { "name": "Hawaii", "value":96},
      { "name": "Occidental College", "value":24},
      { "name": "Columbia University", "value":21},
      { "name": "Business Int. Co.", "value":15},
      { "name": "NYPIRG", "value":5},
      { "name": "Chicago Comm. Org.", "value":38},
      { "name": "Harvard Law", "value":39},
      { "name": "U. Chicago Prof.", "value":60},
      { "name": "Illinois Senator", "value":96},
      { "name": "US Senator", "value":48},
      { "name": "President", "value":96},
      { "name": "Private Citizen", "value":44}
    ];

  var obamarange = ["#1f77b4", "#ff7f0e", "#1f77b4", "#2ca02c", "#d62728",
  "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
  "#d728a0", "#a9b9cb", "#0fffb7"];

  var goadrichdata = [
    { "name": "Northampton", "value":120},
    { "name": "Canvas", "value":96},
    { "name": "Gambier", "value":45},
    { "name": "Milwaukee", "value":3},
    { "name": "Madison", "value":21},
    { "name": "San Antonio", "value":7},
    { "name": "Madison", "value":77},
    { "name": "Shreveport", "value":84},
    { "name": "Conway", "value":75}
  ];
  var goadrichrange = ["#008080", "#002855", "#4B2E84", "#008B2B", "#c5050c", "#0f52ba","#c5050c", "#8a2432", "#E96B10"];

  var isabelladata = [
    { "name": "childhood", "value":160},
    { "name": "high school", "value":46},
    { "name": "college", "value":48},
    { "name": "adulting", "value":30},
    { "name": "moved back to U.S.", "value":9},
    { "name": "time left", "value":559},
  ];

  var isabellarange = ["#EF476F","#FCA311","#FFD166","#0EAD69","#4ECDC4","#118AB2"];

  var originaldata = [
    { "name": "Childhood", "value":184},
    { "name": "High School", "value":45}
  ];
  var originalrange = ["#1f77b4", "#aec7e8"];

  var data = [];
  var range = [];
  var defaultColors = d3.scaleOrdinal(d3.schemeCategory10);
  var chart;

  function calculateData() {
    console.log("Recalculating...");
    data = []
    range = []
    var dataRows = $("#mainTable").find('tbody tr');
    dataRows.each(function () {
      var row = $(this);
      data.push({ "name": row.children().eq(0).text(),
                  "value":row.children().eq(1).text()});
      //console.log(row.find('input')[0].value);
      range.push(row.find('input')[0].value);
    });
    toggleFuture();
    //console.log(range);
  }

  function makeWaffleChart() {
    /* to color elements we use the class name ( slugigy(name) ) */
    var domain = data.map(function(d){ return slugify(d.name.concat(data.indexOf(d))); })
    var palette = d3.scaleOrdinal().domain(domain).range(range);

    chart = d3waffle()
        .title($("#waffle-title-input").val())
        .colorscale(palette);

    d3.select("#waffle")
  			.datum(data)
  			.call(chart);
  }

  function getCurrentNumMonths() {
    var numMonths = 0;
    var dataRows = $("#mainTable").find('tbody tr');
    dataRows.each(function () {
      var row = $(this);
      numMonths += parseInt(row.children().eq(1).text());
    })
    console.log(numMonths);
    return numMonths;
  }

  // Help from https://stackoverflow.com/questions/44494447/generate-and-download-screenshot-of-webpage-without-lossing-the-styles
  $( "#camera" ).click(function() {
    $(this).html("Processing");
    $(this).removeClass("btn-primary");
    $(this).addClass("btn-danger");
    console.log("Testing");
    var cameraClone = $("<div></div>").html($("#capture").html());
    cameraClone.css("width", "800px");
    cameraClone.attr("id", "captureClone");
    cameraClone.addClass("chart-clone-area");
    $("body").append(cameraClone);

    setTimeout(function() {
      domtoimage.toBlob(document.getElementById('captureClone'))
      .then(function (blob) {
          window.saveAs(blob, 'my-life-in-months.png');
      }).finally(function (blob) {
          $("#captureClone").remove();
          $("#camera" ).html("Download <i class='fa fa-camera' aria-hidden='true'></i>");
          $("#camera" ).removeClass("btn-danger");
          $("#camera" ).addClass("btn-primary");
      });
    }, 500);
  });

  /* global $ */
  /* this is an example for validation and change events */
  $.fn.numericInputExample = function () {
  	'use strict';
  	var element = $(this);

    element.find('td').off('change').off('validate');

  	element.find('td').on('change', function (evt) {
      calculateData();
      makeWaffleChart();
  	}).on('validate', function (evt, value) {
  		var cell = $(this),
  			column = cell.index();
  		if (column === 0) {
        if (!value){
  		    $('#showEventAlertHere').html(alertMaker("alert-event-name-length", "Event names must not be empty!"));
        }
        else if (value.trim().length == 0){
  		    $('#showEventAlertHere').html(alertMaker("alert-event-name-length", "Event names must be at least 1 character long!"));
        }
        else if (value.trim().length >= 20){
  		    $('#showEventAlertHere').html(alertMaker("alert-event-name-length", "Event names must be less than 20 characters long!"));
        } else {
          $("#alert-event-name-length").remove();
        }
  			return !!value && value.trim().length > 0 && value.trim().length < 20;
  		} else if (column === 1){
        if (!isNormalPosInteger(value)) {
          $('#showMonthsAlertHere').html(alertMaker("alert-event-month-length", "Events must be an integer greater than 0 and less than 1200 months long!"));
        } else {
          $("#alert-event-month-length").remove();
        }

  			return isNormalPosInteger(value);
  		} else {
        return false;
      }
  	});
  	return this;
  };

  function addNewEventRow(event, months, color) {
    var dataRows = $("#mainTable").find('tbody tr');
    var newRow = $('<tr>' +
          '<td>' + event + '</td>' +
          '<td class="monthsevent">' + months + '</td>' +
          '<td class="colorpick"><input type="color" value="' + color +
          '"></td><td class="remove"><i class="fa fa-trash-o"></i></td></tr>');
    $('#mainTable tr:last').after(newRow);
    calculateData();
    makeWaffleChart();
    newRow.editableTableWidget().numericInputExample()
  }

  function randomEventRow() {
    var eventName = getRandomEventName();
    var m = getRandomIntInclusive(12, 48);
    var c = randomColor();
    addNewEventRow(eventName, m, c);
  }

  $( "#addrow" ).click(function() {
    randomEventRow();
  });

  $( "#togglefuture" ).click(function() {
    calculateData();
    makeWaffleChart();
  });

  function toggleFuture() {
    const lifeExpectancy = 80
    var numMonths = getCurrentNumMonths();
    if ($('#togglefuture').prop('checked') && (lifeExpectancy * 12) > numMonths) {
      futureIndex = data.length;
      data.push({ "name": "Future",
                  "value": (lifeExpectancy * 12) - numMonths});
      range.push("#bfbfbf");
    }
  };

  function getRandomEventName(){
    events = ["Backpacked Andes", "Visited Mars", "Started pickle farm", "Went ghost hunting",
    "Raised dinosaurs", "Learned to unicycle", "Went to Antarctica", "Studied arachnids",
    "Studied French", "Published a book", "Sculpted ice", "Entered the Olympics",
    "Composed an opera", "Busked in subway", "Perfected sourdough", "Shrunk to 1/12 size",
    "Robot uprising", "Created vaccine", "Worked in Moria", "Unemployed", "Netflix binge",
    "Ant army invasion", "Kaiju attacks", "The Long Nap", "Unexplained illness",
    "Worked three jobs", "Worked at Ponderosa", "Delivered mail", "Rescued lemurs"];
    return events[Math.floor(Math.random() * events.length)];
  }

  // https://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
  function isNormalPosInteger(str) {
      str = str.trim();
      if (!str) {
          return false;
      }
      str = str.replace(/^0+/, "") || "0";
      var n = Math.floor(Number(str));
      return n !== Infinity && String(n) === str && n > 0 && n <= 1200;
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

  function alertMaker(id, text) {
    return '<div class="alert alert-danger alert-dismissible show fade" role="alert" id="' + id + '">' +
      '<strong>Warning!</strong> ' + text + ' ' +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
      '  <span aria-hidden="true">&times;</span>' +
      '</button>' +
    '</div>'
  }

  // https://stackoverflow.com/questions/9205164/validate-html-text-input-as-its-typed
  $('#waffle-title-input').bind('input propertychange', function() {
    var text = $(this).val();
    //console.log($("#waffle-title").width());
    if (text.length > 30) {
      text = text.slice(0, -1);
      $(this).val(text);
    }
    console.log($("waffle-title").text());
    $('#waffle-title').html(text.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
  });

  for (var i = 0; i < 3; i++) {
    randomEventRow();
  }
  calculateData();
  makeWaffleChart();

  $( "#reset" ).click(function() {
    //resetChart(originaldata, originalrange);
  });

  function resetChart(data, range) {
    var tablebody = $("#mainTable").find('tbody');
    tablebody.html("");
    generateTable(data, range);
  }

  $( document ).on( "click", ".remove", function(){
    var dataRows = $("#mainTable").find('tbody tr');
    if (dataRows.length > 1) {
      $(this).parent("tr:first").remove();
      calculateData();
      makeWaffleChart();
    }
  });

  $('#mainTable').editableTableWidget().numericInputExample();

  $(".alert").alert();
});
