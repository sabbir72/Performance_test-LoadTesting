/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.84877126654064, "KoPercent": 0.15122873345935728};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.37970179600135545, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5643564356435643, 500, 1500, "https://api.first.org/v1/get-teams-2"], "isController": false}, {"data": [0.5544554455445545, 500, 1500, "https://api.first.org/v1/get-teams-3"], "isController": false}, {"data": [0.5643564356435643, 500, 1500, "https://api.first.org/v1/get-teams-4"], "isController": false}, {"data": [0.5742574257425742, 500, 1500, "https://api.first.org/v1/get-teams-5"], "isController": false}, {"data": [0.5891089108910891, 500, 1500, "https://api.first.org/v1/get-teams-0"], "isController": false}, {"data": [0.5742574257425742, 500, 1500, "https://api.first.org/v1/get-teams-1"], "isController": false}, {"data": [0.2549019607843137, 500, 1500, "https://api.first.org/v1/get-teams"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.25980392156862747, 500, 1500, "https://api.first.org/data/v1/news"], "isController": false}, {"data": [0.0392156862745098, 500, 1500, "news"], "isController": true}, {"data": [0.0, 500, 1500, "teams"], "isController": true}, {"data": [0.10784313725490197, 500, 1500, "https://api.first.org/-2"], "isController": false}, {"data": [0.004901960784313725, 500, 1500, "https://api.first.org/-1"], "isController": false}, {"data": [0.04411764705882353, 500, 1500, "https://api.first.org/-4"], "isController": false}, {"data": [0.06862745098039216, 500, 1500, "https://api.first.org/-3"], "isController": false}, {"data": [0.03431372549019608, 500, 1500, "https://api.first.org/-6"], "isController": false}, {"data": [0.0, 500, 1500, "https://api.first.org/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://api.first.org/"], "isController": false}, {"data": [0.0784313725490196, 500, 1500, "https://api.first.org/data/v1/teams"], "isController": false}, {"data": [0.5643564356435643, 500, 1500, "https://api.first.org/v1/get-teams-6"], "isController": false}, {"data": [0.4411764705882353, 500, 1500, "https://api.first.org/v1/get-news"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://api.first.org/v1/get-news-5"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://api.first.org/v1/get-news-6"], "isController": false}, {"data": [0.06372549019607843, 500, 1500, "https://api.first.org/-0"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://api.first.org/v1/get-news-3"], "isController": false}, {"data": [0.8284313725490197, 500, 1500, "https://api.first.org/v1/get-news-4"], "isController": false}, {"data": [0.8186274509803921, 500, 1500, "https://api.first.org/v1/get-news-1"], "isController": false}, {"data": [0.8137254901960784, 500, 1500, "https://api.first.org/v1/get-news-2"], "isController": false}, {"data": [0.7107843137254902, 500, 1500, "https://api.first.org/v1/get-news-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2645, 4, 0.15122873345935728, 3247.349716446124, 225, 25302, 1257.0, 9231.800000000001, 16114.999999999998, 18369.219999999954, 70.94766771277594, 1399.5471050937476, 66.73847666203964], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://api.first.org/v1/get-teams-2", 101, 0, 0.0, 902.6138613861388, 230, 7030, 784.0, 1680.8, 1717.3999999999999, 6929.48000000002, 3.6178672493462765, 2.533213689239531, 2.1693071202134897], "isController": false}, {"data": ["https://api.first.org/v1/get-teams-3", 101, 0, 0.0, 853.9603960396038, 229, 2058, 795.0, 1686.4, 1725.3, 2053.7000000000007, 3.6185153339065637, 2.5732729762288624, 2.1350583978217257], "isController": false}, {"data": ["https://api.first.org/v1/get-teams-4", 101, 0, 0.0, 851.4455445544554, 235, 2005, 794.0, 1681.0, 1722.5, 2001.5000000000007, 3.6203312065381033, 2.531403460821564, 2.1460361741881138], "isController": false}, {"data": ["https://api.first.org/v1/get-teams-5", 101, 0, 0.0, 898.6237623762377, 231, 5147, 804.0, 1699.2, 1746.8999999999996, 5084.120000000013, 3.618904296105199, 2.5339398245189724, 2.1451903395857967], "isController": false}, {"data": ["https://api.first.org/v1/get-teams-0", 101, 0, 0.0, 925.1980198019809, 240, 2144, 860.0, 1727.6, 1996.6999999999998, 2142.1600000000003, 3.4758070066763027, 39.774908695539956, 1.7480865316780232], "isController": false}, {"data": ["https://api.first.org/v1/get-teams-1", 101, 0, 0.0, 849.1386138613859, 229, 2020, 796.0, 1673.0, 1715.9, 2016.4000000000008, 3.619812199842305, 2.5381105073113037, 2.17047333076482], "isController": false}, {"data": ["https://api.first.org/v1/get-teams", 102, 1, 0.9803921568627451, 1877.1274509803907, 299, 8517, 1407.0, 3377.5, 3781.2, 8431.259999999997, 3.4784981072877947, 54.06352308767861, 14.054400555877638], "isController": false}, {"data": ["Test", 102, 1, 0.9803921568627451, 15752.431372549023, 4405, 25302, 16275.5, 24735.3, 25106.85, 25299.69, 2.9813228889603365, 461.33662528680617, 10.672969247800543], "isController": true}, {"data": ["https://api.first.org/data/v1/news", 102, 1, 0.9803921568627451, 1655.735294117647, 288, 3783, 1354.0, 2548.7000000000003, 3687.9999999999995, 3782.67, 5.949950417079857, 323.1735438663011, 2.9924067039024673], "isController": false}, {"data": ["news", 102, 1, 0.9803921568627451, 2828.9019607843134, 1107, 6836, 2564.0, 4507.100000000001, 6378.899999999999, 6835.55, 5.053758113263638, 370.31068070901256, 23.13673636228509], "isController": true}, {"data": ["teams", 102, 1, 0.9803921568627451, 5994.254901960781, 1588, 13484, 4993.0, 12189.2, 12612.349999999999, 13469.33, 3.331482509716824, 314.2076527133618, 15.139158800666296], "isController": true}, {"data": ["https://api.first.org/-2", 102, 0, 0.0, 6262.4607843137255, 262, 16322, 6201.5, 16117.4, 16230.1, 16321.85, 3.2580573034784552, 22.32914663653496, 1.6926625834477913], "isController": false}, {"data": ["https://api.first.org/-1", 102, 0, 0.0, 7066.26470588235, 1451, 17379, 6543.5, 11807.100000000002, 16326.899999999976, 17375.04, 3.205027494108405, 211.81037657109192, 1.6619820306362922], "isController": false}, {"data": ["https://api.first.org/-4", 102, 0, 0.0, 7180.56862745098, 296, 16295, 6502.5, 16203.3, 16233.4, 16294.16, 3.2595149074872976, 13.375470352794554, 1.6743211341194517], "isController": false}, {"data": ["https://api.first.org/-3", 102, 1, 0.9803921568627451, 6559.72549019608, 246, 16381, 6219.0, 16197.7, 16245.8, 16378.72, 3.270488649480569, 6.266526538652688, 1.657162811017058], "isController": false}, {"data": ["https://api.first.org/-6", 102, 0, 0.0, 7260.745098039218, 617, 16274, 6546.5, 16193.4, 16243.4, 16273.67, 3.2628514762803493, 26.01040683679345, 1.6887805492466652], "isController": false}, {"data": ["https://api.first.org/-5", 102, 0, 0.0, 10186.049019607846, 2955, 17138, 10407.0, 16968.8, 17012.25, 17137.91, 3.190590884919766, 167.3066095279802, 1.6358009908035909], "isController": false}, {"data": ["https://api.first.org/", 102, 1, 0.9803921568627451, 15752.431372549023, 4405, 25302, 16275.5, 24735.3, 25106.85, 25299.69, 2.992957746478873, 463.13702937023186, 10.71462138717723], "isController": false}, {"data": ["https://api.first.org/data/v1/teams", 102, 0, 0.0, 4117.1274509803925, 1059, 11182, 3420.0, 8873.5, 9839.75, 11147.71, 3.6247334754797444, 285.52917610607676, 1.8265258528784647], "isController": false}, {"data": ["https://api.first.org/v1/get-teams-6", 101, 0, 0.0, 850.7623762376234, 229, 2005, 786.0, 1690.6, 1710.9, 2001.5200000000007, 3.620720559240007, 2.5352115634522314, 2.1639462717332854], "isController": false}, {"data": ["https://api.first.org/v1/get-news", 102, 0, 0.0, 1173.1666666666674, 491, 3064, 1036.5, 2301.6000000000013, 2785.7999999999997, 3063.37, 5.266146935825288, 99.84079747276576, 21.46057730781145], "isController": false}, {"data": ["https://api.first.org/v1/get-news-5", 102, 0, 0.0, 528.8431372549019, 227, 1460, 466.0, 1135.000000000001, 1351.85, 1458.95, 5.7584824705018915, 4.032062432958844, 3.4134754488228984], "isController": false}, {"data": ["https://api.first.org/v1/get-news-6", 102, 0, 0.0, 529.3823529411767, 227, 1460, 462.0, 1142.200000000001, 1346.5, 1458.95, 5.759132742363503, 4.0325177502681955, 3.4419816780531876], "isController": false}, {"data": ["https://api.first.org/-0", 102, 0, 0.0, 5230.803921568626, 1213, 8841, 5872.0, 8205.4, 8633.05, 8838.57, 5.58781636901501, 85.90176296976004, 2.744796517201709], "isController": false}, {"data": ["https://api.first.org/v1/get-news-3", 102, 0, 0.0, 530.0490196078431, 225, 1454, 464.5, 1135.900000000001, 1342.7, 1453.1, 5.7584824705018915, 4.026438914921244, 3.402228412747699], "isController": false}, {"data": ["https://api.first.org/v1/get-news-4", 102, 0, 0.0, 530.8823529411767, 228, 1460, 466.0, 1141.600000000001, 1347.6, 1458.92, 5.751987819319912, 4.0218977330400945, 3.409625592116393], "isController": false}, {"data": ["https://api.first.org/v1/get-news-1", 102, 0, 0.0, 530.9411764705886, 228, 1454, 466.0, 1124.300000000001, 1341.0, 1452.6499999999999, 5.756532535696145, 4.03631871155257, 3.4516708758959305], "isController": false}, {"data": ["https://api.first.org/v1/get-news-2", 102, 0, 0.0, 532.3529411764706, 231, 1455, 467.0, 1136.900000000001, 1349.5, 1453.62, 5.7584824705018915, 4.032062432958844, 3.452840075086095], "isController": false}, {"data": ["https://api.first.org/v1/get-news-0", 102, 0, 0.0, 631.9509803921569, 250, 1637, 521.0, 1352.8, 1428.55, 1636.85, 5.339754999476495, 78.80831768270338, 2.6803067087216], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["429/Too Many Requests", 2, 50.0, 0.07561436672967864], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, 25.0, 0.03780718336483932], "isController": false}, {"data": ["Assertion failed", 1, 25.0, 0.03780718336483932], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2645, 4, "429/Too Many Requests", 2, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "Assertion failed", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://api.first.org/v1/get-teams", 102, 1, "429/Too Many Requests", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://api.first.org/data/v1/news", 102, 1, "429/Too Many Requests", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://api.first.org/-3", 102, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://api.first.org/", 102, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
