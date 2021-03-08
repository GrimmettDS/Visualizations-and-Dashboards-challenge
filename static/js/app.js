function optionChanged(id) {
    updatePlotly2(id);
    updateDemoInfo(id)
};

function init() {
    d3.json("samples.json").then((data) => {
        var names = data.samples.map(x=>x.id)
        names.forEach(function(name) {
            d3.select('#selDataset')
                .append('option')
                .text(name)
            });  

    var sample_val = data.samples.map(x=> x.sample_values);
    var otu_label = data.samples.map(x=> x.otu_labels);
    var otu_ids = data.samples.map(x=> x.otu_ids);


    var sort = sample_val.sort(function(a, b) {
        return b-a
    });
    var topten = sort.map(x => x.slice(0,10));
    var sort_labels = otu_label.sort(function(a, b) {
        return b-a
    });
    var top_label = sort_labels.map(x =>x.slice(0,10));
    var sort_ids = otu_ids.sort(function(a, b) {
        return b-a
    });
    var top_id = sort_ids.map(x =>x.slice(0,10));


    var first_data_ID = data.metadata[0]
    var sample_Meta = d3.select("#sample-metadata").selectAll('h1')
    
    var firstMetadata = sample_Meta.data(d3.entries(first_data_ID))
    firstMetadata.enter()
                    .append('h1')
                    .merge(firstMetadata)
                    .text(d => `${d.key} : ${d.value}`)
                    .style('font-size','12px')
  
    firstMetadata.exit().remove()

    // Create trace for bar chart
    var trace1 = {
        x : topten[0],
        y : top_id[0].map(x => "OTU" + x),
        text : top_label[0],
        type : 'bar',
        orientation : 'h',
        transforms: [{
            type: 'sort',
            target: 'y',
            order: 'descending'
        }]
    };
    // Create layout for bar chart
    var layout1 = {
        title : '<b>Top 10 OTU</b><br>Operational Taxonomic Units'
    };

    // Create bar chart
    var data = [trace1];
    var config = {responsive:true}
    Plotly.newPlot('bar', data, layout1,config);

    var trace2 = {
        x : otu_ids[0],
        y : sample_val[0],
        text : otu_label[0],
        mode : 'markers',
        marker : {
            color : otu_ids[0],
            size : sample_val[0]
        }
    };

    var layout2 = {
        title: '<b>Bubble Chart</b>',
        automargin: true,
        autosize: true,
        showlegend: false,
            margin: {
                l: 150,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
              }
    };
    var config = {responsive:true}

    var data2 = [trace2];
    Plotly.newPlot('bubble',data2,layout2,config);

    var WFreq = first_data_ID.wfreq;
 
    var WFreqDeg = WFreq * 20;
    var degrees = 180 - WFreqDeg;
    var radius = 0.5;
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(degrees * Math.PI / 180);
    var y = radius * Math.sin(degrees * Math.PI / 180);

 
    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
    var mainPath = path1,
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);


    var dataGauge = [
        {
          type: "scatter",
          x: [0],
          y: [0],
          marker: { size: 12, color: "850000" },
          showlegend: false,
          name: "Freq",
          text: WFreq,
          hoverinfo: "text+name"
        },
        {
          values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
          rotation: 90,
          text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          textinfo: "text",
          textposition: "inside",
          marker: {
            colors: [
              "rgba(255, 247, 5, .5)",
              "rgba(255, 255, 15, .5)",
              "rgba(255, 255, 36, .5)",
              "rgba(255, 255, 66, .5)",
              "rgba(255, 255, 97, .5)",
              "rgba(255, 255, 127, .5)",
              "rgba(255, 255, 158, .5)",
              "rgba(255, 255, 189, .5)",
              "rgba(255, 255, 219, .5)",
              "rgba(255, 255, 255, 0)"
            ]
          },
          labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          hoverinfo: "label",
          hole: 0.5,
          type: "pie",
          showlegend: false
        }
      ];


    var layoutGauge = {
        shapes: [
          {
            type: "path",
            path: path,
            fillcolor: "850000",
            line: {
              color: "850000"
            }
          }
        ],
        title: "<b>Belly Button Wash Frequency</b> <br> Per Week",
        xaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        },
        yaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        }
      };
      var config = {responsive:true}
     
      Plotly.newPlot('gauge', dataGauge,layoutGauge,config);
    

    });
}; 

init();


function updatePlotly2(id) {
    d3.json("samples.json").then((data) => {
        
        var test = data.samples.filter(x => x.id === id);
       
        var sample_values = test.map(x => x.sample_values)
            .sort(function(a, b) {
                return b-a
            });
        var top_values = sample_values.map(x => x.slice(0,10));
        
        var otu_ids = test.map(x=> x.otu_ids)
            .sort(function(a, b) {
                return b-a
            });
        var top_ids = otu_ids.map(x => x.slice(0,10));
       
        var otu_label = test.map(x=> x.otu_labels)
        .sort(function(a, b) {
            return b-a
        });
        var top_labels = otu_label.map(x => x.slice(0,10));

        var trace = {
            x : top_values[0],
            y : top_ids[0].map(x => "OTU" + x),
            text : top_labels[0],
            type : 'bar',
            orientation : 'h',
            transforms: [{
                type: 'sort',
                target: 'y',
                order: 'descending'
              }]
        };
     
        var layout1 = {
            title: "<b>Top 10 OTU</b><br>Operational Taxonomic Units"
        };
        var data1 = [trace];
        var config = {responsive:true}

        Plotly.newPlot('bar', data1,layout1,config);

        var trace2 = {
            x : test.map(x=> x.otu_ids)[0],
            y : test.map(x => x.sample_values)[0],
            text : test.map(x=> x.otu_labels),
            mode : 'markers',
            marker : {
                color : test.map(x=> x.otu_ids)[0],
                size : test.map(x => x.sample_values)[0]
            }   
        };

        var layout2 = {
            title: '<b>Bubble Chart</b>',
            automargin: true,
            autosize: true,
            showlegend: false,
            margin: {
                l: 150,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
              }
        };

 
        var data2 = [trace2];
        var config = {responsive:true}
        Plotly.newPlot('bubble', data2,layout2,config)
    });
};


function updateDemoInfo(id) {
    d3.json("samples.json").then((data) => {

        var metadataSamples = data.metadata.filter(x => x.id === +id)[0];

        var sampleMetadata1 = d3.select("#sample-metadata").selectAll('h1')
        var sampleMetadata = sampleMetadata1.data(d3.entries(metadataSamples))
        sampleMetadata.enter().append('h1').merge(sampleMetadata).text(d => `${d.key} : ${d.value}`).style('font-size','12px');
          
        var wFreq = metadataSamples.wfreq;
        var wFreqDeg = wFreq * 20;

        var degrees = 180 - wFreqDeg;
        var radius = 0.5;
        var radians = (degrees * Math.PI) / 180;
        var x = radius * Math.cos(degrees * Math.PI / 180);
        var y = radius * Math.sin(degrees * Math.PI / 180);

        var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
        var mainPath = path1,
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var dataGauge = [
            {
            type: "scatter",
            x: [0],
            y: [0],
            marker: { size: 12, color: "850000" },
            showlegend: false,
            name: "Freq",
            text: wFreq,
            hoverinfo: "text+name"
            },
            {
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90,
            text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            textinfo: "text",
            textposition: "inside",
            marker: {
                colors: [
                "rgba(0, 105, 11, .5)",
                "rgba(10, 120, 22, .5)",
                "rgba(14, 127, 0, .5)",
                "rgba(110, 154, 22, .5)",
                "rgba(170, 202, 42, .5)",
                "rgba(202, 209, 95, .5)",
                "rgba(210, 206, 145, .5)",
                "rgba(232, 226, 202, .5)",
                "rgba(240, 230, 215, .5)",
                "rgba(255, 255, 255, 0)"
                ]
            },
            labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            hoverinfo: "label",
            hole: 0.5,
            type: "pie",
            showlegend: false
            }
        ];

        var layoutGauge = {
            shapes: [
            {
                type: "path",
                path: path,
                fillcolor: "850000",
                line: {
                color: "850000"
                }
            }
            ],
            title: "<b>Belly Button Wash Frequency</b> <br> Per Week",
            xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
            },
            yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
            }
        };
        var config = {responsive:true}

 
        Plotly.newPlot('gauge', dataGauge,layoutGauge,config);

    });
};

