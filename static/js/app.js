function init() {
    d3.json("samples.json").then ((data) => {
        var names = data.samples.map(x => x.sample_values);
        names.forEach(function(name) {
            d3.select('#selDataset')
                .append('option')
                .text(name);
        });
    
    var sample_val = data.samples.map(x => x.sample_values);
    var otu_label = data.samples.map(x => x.otu_labels);
    var otu_ids = data.samples.map(x => x.otu_ids);

    var sort = sample_vales.sort(function(a, b) {
        return b-a
    });
    var topten = sort.map(x => x.slice(0,10));
    var sort_label = otu_label.sort(function(a, b) {
        return b-a
    });
    var top_label = sort_label.map(x => x.slice(0,10));
    var sort_id = otu_ids.sort(function(a, b) {
        return b-a
    });
    var top_id = sort_id.map(x => x.slice(0,10));

    var first_data_ID = data.metadata[0]

