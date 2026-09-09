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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET /posts/57/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/63/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/69/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/54/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/45/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/51/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/33/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/30/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/91/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/21/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/29/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/79/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/94/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/70/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/41/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/82/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/2/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/64/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/87/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/11/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/46/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/52/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/3/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /users"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/39/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/8/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/16/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/75/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/40/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/34/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/98/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/81/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/4/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/28/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/86/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/80/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/31/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/1/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/13/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/74/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/92/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/49/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/83/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/10/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/68/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/62/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/58/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/65/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/56/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/71/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/44/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/67/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/50/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/61/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/59/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/6/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/96/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/36/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/84/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/43/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/5/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/20/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/19/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/90/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/72/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/100/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/66/comments"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 300, 0, 0.0, 67.74333333333331, 18, 317, 33.0, 223.90000000000003, 268.95, 312.8800000000001, 7.910975159537999, 98.24249137209273, 1.2977656027503826], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET /posts/57/comments", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 11.451309647302905, 0.7131742738589212], "isController": false}, {"data": ["GET /posts/63/comments", 2, 0, 0.0, 306.5, 296, 317, 306.5, 317.0, 317.0, 317.0, 0.4093327875562833, 1.1116742990176012, 0.07035407286123618], "isController": false}, {"data": ["GET /posts/69/comments", 2, 0, 0.0, 74.5, 31, 118, 74.5, 118.0, 118.0, 118.0, 0.1552072016141549, 0.40794939760204874, 0.026676237777432873], "isController": false}, {"data": ["GET /posts/54/comments", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 30.0, 33.333333333333336, 89.2578125, 5.729166666666667], "isController": false}, {"data": ["GET /posts/45/comments", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 28.0, 35.714285714285715, 95.947265625, 6.138392857142857], "isController": false}, {"data": ["GET /posts/51/comments", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 8.670879777070065, 0.5473726114649682], "isController": false}, {"data": ["GET /posts/33/comments", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 35.0, 28.57142857142857, 76.50669642857142, 4.910714285714286], "isController": false}, {"data": ["GET /posts/30/comments", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 30.0, 33.333333333333336, 85.51432291666667, 5.729166666666667], "isController": false}, {"data": ["GET /posts/91/comments", 2, 0, 0.0, 168.5, 113, 224, 168.5, 224.0, 224.0, 224.0, 0.23263929277654996, 0.6307841761661045, 0.03998487844596953], "isController": false}, {"data": ["GET /posts/21/comments", 1, 0, 0.0, 43.0, 43, 43, 43.0, 43.0, 43.0, 43.0, 23.25581395348837, 64.79378633720931, 3.997093023255814], "isController": false}, {"data": ["GET /posts/29/comments", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 105.3936298076923, 6.610576923076923], "isController": false}, {"data": ["GET /posts/79/comments", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 36.0, 27.777777777777775, 75.1953125, 4.774305555555556], "isController": false}, {"data": ["GET /posts/94/comments", 4, 0, 0.0, 57.5, 29, 138, 31.5, 138.0, 138.0, 138.0, 0.1453435558300934, 0.3873462537698485, 0.0249809236582973], "isController": false}, {"data": ["GET /posts/70/comments", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 31.0, 32.25806451612903, 85.62247983870968, 5.544354838709677], "isController": false}, {"data": ["GET /posts/41/comments", 2, 0, 0.0, 64.5, 32, 97, 64.5, 97.0, 97.0, 97.0, 0.1321091221348834, 0.3490441698593038, 0.022706255366933086], "isController": false}, {"data": ["GET /posts", 100, 0, 0.0, 48.04000000000003, 20, 278, 32.0, 78.9, 128.7999999999995, 276.8799999999994, 2.8175363462188665, 78.8446549134312, 0.45124605544911534], "isController": false}, {"data": ["GET /posts/82/comments", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 11.922940340909092, 0.78125], "isController": false}, {"data": ["GET /posts/2/comments", 1, 0, 0.0, 34.0, 34, 34, 34.0, 34.0, 34.0, 34.0, 29.41176470588235, 75.4250919117647, 5.055147058823529], "isController": false}, {"data": ["GET /posts/64/comments", 2, 0, 0.0, 28.0, 25, 31, 28.0, 31.0, 31.0, 31.0, 0.23046784973496195, 0.6161188853998617, 0.03961166167319659], "isController": false}, {"data": ["GET /posts/87/comments", 2, 0, 0.0, 258.5, 248, 269, 258.5, 269.0, 269.0, 269.0, 0.23883448770002388, 0.6138792691664676, 0.0410496775734416], "isController": false}, {"data": ["GET /posts/11/comments", 1, 0, 0.0, 34.0, 34, 34, 34.0, 34.0, 34.0, 34.0, 29.41176470588235, 76.22931985294117, 5.055147058823529], "isController": false}, {"data": ["GET /posts/46/comments", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 9.59674577067669, 0.6461466165413533], "isController": false}, {"data": ["GET /posts/52/comments", 2, 0, 0.0, 233.5, 223, 244, 233.5, 244.0, 244.0, 244.0, 0.15864202427222973, 0.4213928769731102, 0.027266597921789485], "isController": false}, {"data": ["GET /posts/3/comments", 1, 0, 0.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 144.0, 6.944444444444444, 18.242730034722225, 1.193576388888889], "isController": false}, {"data": ["GET /users", 100, 0, 0.0, 32.150000000000006, 18, 58, 27.0, 53.400000000000034, 56.0, 57.989999999999995, 2.839860278874279, 18.80727975996081, 0.4548213727884588], "isController": false}, {"data": ["GET /posts/39/comments", 1, 0, 0.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 33.0, 30.303030303030305, 85.9670928030303, 5.208333333333333], "isController": false}, {"data": ["GET /posts/8/comments", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 9.107582885304659, 0.6195396505376344], "isController": false}, {"data": ["GET /posts/16/comments", 2, 0, 0.0, 180.5, 120, 241, 180.5, 241.0, 241.0, 241.0, 0.156128024980484, 0.4138002537080406, 0.026834504293520686], "isController": false}, {"data": ["GET /posts/75/comments", 3, 0, 0.0, 60.66666666666667, 28, 118, 36.0, 118.0, 118.0, 118.0, 0.214638334406525, 0.5727182379981398, 0.03689096372612148], "isController": false}, {"data": ["GET /posts/40/comments", 3, 0, 0.0, 172.66666666666666, 32, 263, 223.0, 263.0, 263.0, 263.0, 0.12509382036527394, 0.332036136477358, 0.02150050037528146], "isController": false}, {"data": ["GET /posts/34/comments", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 22.59448450854701, 1.469017094017094], "isController": false}, {"data": ["GET /posts/98/comments", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 30.0, 33.333333333333336, 92.54557291666667, 5.729166666666667], "isController": false}, {"data": ["GET /posts/81/comments", 2, 0, 0.0, 155.0, 44, 266, 155.0, 266.0, 266.0, 266.0, 0.4579803068468056, 1.1489759846576597, 0.07849174204259217], "isController": false}, {"data": ["GET /posts/4/comments", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 8.7890625, 0.5710132890365449], "isController": false}, {"data": ["GET /posts/28/comments", 2, 0, 0.0, 155.5, 35, 276, 155.5, 276.0, 276.0, 276.0, 0.09155832265152902, 0.24512416166910822, 0.01573658670573155], "isController": false}, {"data": ["GET /posts/86/comments", 1, 0, 0.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 21.894695378151262, 1.444327731092437], "isController": false}, {"data": ["GET /posts/80/comments", 1, 0, 0.0, 116.0, 116, 116, 116.0, 116.0, 116.0, 116.0, 8.620689655172413, 23.765827047413794, 1.4816810344827585], "isController": false}, {"data": ["GET /posts/31/comments", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 29.0, 34.48275862068965, 91.86422413793103, 5.926724137931034], "isController": false}, {"data": ["GET /posts/1/comments", 2, 0, 0.0, 31.0, 28, 34, 31.0, 34.0, 34.0, 34.0, 0.1158278797706608, 0.2998064407540395, 0.019851360253663058], "isController": false}, {"data": ["GET /posts/13/comments", 3, 0, 0.0, 33.666666666666664, 31, 35, 35.0, 35.0, 35.0, 35.0, 0.25108804820890523, 0.6762703485939069, 0.043155758285905586], "isController": false}, {"data": ["GET /posts/74/comments", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 30.0, 33.333333333333336, 87.40234375, 5.729166666666667], "isController": false}, {"data": ["GET /posts/92/comments", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 30.0, 33.333333333333336, 85.83984375, 5.729166666666667], "isController": false}, {"data": ["GET /posts/49/comments", 3, 0, 0.0, 109.33333333333334, 34, 253, 41.0, 253.0, 253.0, 253.0, 0.2849273435274005, 0.7792837045303448, 0.04887913738246747], "isController": false}, {"data": ["GET /posts/83/comments", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 41.55115927419355, 2.7721774193548385], "isController": false}, {"data": ["GET /posts/10/comments", 2, 0, 0.0, 228.5, 221, 236, 228.5, 236.0, 236.0, 236.0, 0.06370847004109197, 0.16480833704966075, 0.010981000939699934], "isController": false}, {"data": ["GET /posts/68/comments", 2, 0, 0.0, 169.5, 26, 313, 169.5, 313.0, 313.0, 313.0, 0.11911142874158775, 0.32086804314811507, 0.020414116937645166], "isController": false}, {"data": ["GET /posts/62/comments", 1, 0, 0.0, 34.0, 34, 34, 34.0, 34.0, 34.0, 34.0, 29.41176470588235, 81.97380514705881, 5.055147058823529], "isController": false}, {"data": ["GET /posts/58/comments", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 10.191494360902254, 0.6461466165413533], "isController": false}, {"data": ["GET /posts/65/comments", 2, 0, 0.0, 152.0, 30, 274, 152.0, 274.0, 274.0, 274.0, 3.0257186081694405, 7.899666698184569, 0.5200453857791225], "isController": false}, {"data": ["GET /posts/56/comments", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 11.850717905405405, 0.7742117117117117], "isController": false}, {"data": ["GET /posts/71/comments", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 75.3272804054054, 4.64527027027027], "isController": false}, {"data": ["GET /posts/44/comments", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 48.68607954545455, 3.125], "isController": false}, {"data": ["GET /posts/67/comments", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 9.096697573260073, 0.6295787545787546], "isController": false}, {"data": ["GET /posts/50/comments", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 11.62997159090909, 0.744047619047619], "isController": false}, {"data": ["GET /posts/61/comments", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 50.349308894230774, 3.3052884615384617], "isController": false}, {"data": ["GET /posts/59/comments", 2, 0, 0.0, 32.0, 30, 34, 32.0, 34.0, 34.0, 34.0, 0.5246589716684156, 1.3308610145592865, 0.09017576075550893], "isController": false}, {"data": ["GET /posts/6/comments", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 9.51531475631769, 0.6204873646209386], "isController": false}, {"data": ["GET /posts/96/comments", 2, 0, 0.0, 150.5, 33, 268, 150.5, 268.0, 268.0, 268.0, 0.13247665099026296, 0.3431585124528052, 0.022769424388951447], "isController": false}, {"data": ["GET /posts/36/comments", 2, 0, 0.0, 81.0, 43, 119, 81.0, 119.0, 119.0, 119.0, 0.21528525296017223, 0.5737436087190528, 0.037002152852529606], "isController": false}, {"data": ["GET /posts/84/comments", 3, 0, 0.0, 113.66666666666666, 27, 287, 27.0, 287.0, 287.0, 287.0, 0.5079580088046055, 1.33603538774128, 0.08713993184896715], "isController": false}, {"data": ["GET /posts/43/comments", 3, 0, 0.0, 197.33333333333331, 37, 292, 263.0, 292.0, 292.0, 292.0, 0.26574541589157585, 0.7034641022234034, 0.0456749933563646], "isController": false}, {"data": ["GET /posts/5/comments", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 35.0, 28.57142857142857, 74.63727678571428, 4.910714285714286], "isController": false}, {"data": ["GET /posts/20/comments", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 36.0, 27.777777777777775, 74.38151041666667, 4.774305555555556], "isController": false}, {"data": ["GET /posts/19/comments", 2, 0, 0.0, 159.0, 42, 276, 159.0, 276.0, 276.0, 276.0, 0.11860285832888573, 0.30530970171381133, 0.020326954723358832], "isController": false}, {"data": ["GET /posts/90/comments", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 22.07698985042735, 1.469017094017094], "isController": false}, {"data": ["GET /posts/72/comments", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 42.0, 23.809523809523807, 62.12797619047619, 4.092261904761904], "isController": false}, {"data": ["GET /posts/100/comments", 1, 0, 0.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 33.0, 30.303030303030305, 79.30871212121211, 5.17874053030303], "isController": false}, {"data": ["GET /posts/66/comments", 2, 0, 0.0, 193.5, 161, 226, 193.5, 226.0, 226.0, 226.0, 0.9496676163342831, 2.5327561134852803, 0.1632241215574549], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 300, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
