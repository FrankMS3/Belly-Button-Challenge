const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Read JSON data and print to console
d3.json(url).then(function(data) {
    console.log(data);
});

// Build new graphs on id change
function optionChanged(id) {
    d3.json(url).then(function(data) {
        let index = data.names.indexOf(id)
        demInfo(id)
        barGraph(index)
        bubbleChart(index)
    });
};

// Demographic info
function demInfo(index) {
    d3.json(url).then(function (data) {
        let metadata = data.metadata;
        let id = metadata.filter(sample =>
            sample.id.toString() === index)[0];
        let infoPanel = d3.select("#sample-metadata");
        infoPanel.html("");
        Object.entries(id).forEach(([x, y]) => {
            infoPanel.append("h6").text(`${x}: ${y}`);
        })
    })
};

// Bar Graph plot
function barGraph(index) {
    d3.json(url).then(function(data) {
         x = []
         y = []
         ht = []
         for (let i = 0; i < 10; i++) {
            x.push(data.samples[index].sample_values[i]);
            y.push(`OTU ${data.samples[index].otu_ids[i]}`);
            ht.push(data.samples[index].otu_labels[i]);
         };
         let graphData = [{
            x: x.reverse(),
            y: y.reverse(),
            hovertext: ht.reverse(),
            type: "bar",
            orientation: "h"
         }];
         let layout = {
            title: `Top 10 OTUs for Subject ${index}`,
            xaxis: {title: "Sample Values"},
            yaxis: {title: "OTU ID"},
            margin: {
                l: 100,
                r: 100
            }
         };
         Plotly.newPlot("bar", graphData, layout);
    });
};

// Bubble Chart plot
function bubbleChart(index) {
    d3.json(url).then(function(data) {
        x = []
        y = []
        ht = []
        for (let i = 0; i < data.names.length; i++) {
            x.push(data.samples[index].otu_ids[i]);
            y.push(data.samples[index].sample_values[i]);
            ht.push(data.samples[index].otu_labels[i]);
        };
        let graphData = [{
            x: x,
            y: y,
            hovertext: ht,
            mode: "markers",
            marker: {
                size: y,
                color: x,
                sizeref: 1.5
            }
        }];
        let layout = {
            height: 500,
            title: `OTUs for Subject ${index}`,
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Values"}
        };
        Plotly.newPlot("bubble", graphData, layout);
    });
};

// Dropdown and initial function
function init() {
    let dropDown = d3.select("#selDataset");
    d3.json(url).then(function(data) {
        let names = data.names;
        Object.values(names).forEach(value => {
            dropDown.append("option").text(value);
        })
        optionChanged(names[0]);
        barGraph(names[0]);
        bubbleChart(names[0])
    })
};

init();