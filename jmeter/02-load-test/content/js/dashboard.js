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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET /posts/57/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/63/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/45/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/14/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/97/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/30/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/91/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/21/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/85/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/29/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/79/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/94/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/76/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/15/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/35/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/93/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/82/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/27/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/9/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/2/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/64/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/23/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/11/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/46/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/52/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/3/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /users"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/39/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/16/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/75/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/34/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/98/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/40/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/4/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/7/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/28/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/95/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/22/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/1/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/77/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/74/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/83/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/10/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/58/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/65/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/53/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/56/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/71/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/73/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/18/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/67/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/50/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/59/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/6/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/96/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/36/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/84/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/43/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/78/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/5/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/20/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/19/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/90/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/48/comments"], "isController": false}, {"data": [1.0, 500, 1500, "GET /posts/66/comments"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 300, 0, 0.0, 3.556666666666667, 2, 27, 3.0, 4.0, 4.0, 6.0, 8.12281699293315, 45.92620103464382, 1.221410434096878], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET /posts/57/comments", 2, 0, 0.0, 3.5, 3, 4, 3.5, 4.0, 4.0, 4.0, 1.1730205278592376, 1.4078537390029324, 0.18557551319648094], "isController": false}, {"data": ["GET /posts/63/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 300.048828125, 39.55078125], "isController": false}, {"data": ["GET /posts/45/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 398.4375, 52.734375], "isController": false}, {"data": ["GET /posts/14/comments", 2, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 5.830903790087463, 6.941280976676384, 0.919620080174927], "isController": false}, {"data": ["GET /posts/97/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 298.828125, 39.55078125], "isController": false}, {"data": ["GET /posts/30/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 295.166015625, 39.306640625], "isController": false}, {"data": ["GET /posts/91/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 400.0651041666667, 52.734375], "isController": false}, {"data": ["GET /posts/21/comments", 2, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 0.24310198128114743, 0.2917698583930959, 0.03845949313236903], "isController": false}, {"data": ["GET /posts/85/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 400.0651041666667, 52.734375], "isController": false}, {"data": ["GET /posts/29/comments", 3, 0, 0.0, 3.6666666666666665, 3, 4, 4.0, 4.0, 4.0, 4.0, 0.26591029959227086, 0.31914429511611414, 0.042067840365183476], "isController": false}, {"data": ["GET /posts/79/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 295.166015625, 39.306640625], "isController": false}, {"data": ["GET /posts/94/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 298.828125, 39.55078125], "isController": false}, {"data": ["GET /posts/76/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 400.0651041666667, 52.734375], "isController": false}, {"data": ["GET /posts", 100, 0, 0.0, 3.8700000000000023, 2, 27, 4.0, 4.0, 5.0, 26.829999999999913, 2.9054564472078566, 41.39140493346505, 0.42560397175896336], "isController": false}, {"data": ["GET /posts/15/comments", 2, 0, 0.0, 3.0, 2, 4, 3.0, 4.0, 4.0, 4.0, 0.7990411506192568, 0.9590054434678386, 0.12641080703156213], "isController": false}, {"data": ["GET /posts/35/comments", 2, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 0.43696744592527853, 0.5244462803146166, 0.06912961546864758], "isController": false}, {"data": ["GET /posts/93/comments", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 597.65625, 79.1015625], "isController": false}, {"data": ["GET /posts/82/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 298.828125, 39.55078125], "isController": false}, {"data": ["GET /posts/27/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 300.048828125, 39.55078125], "isController": false}, {"data": ["GET /posts/9/comments", 3, 0, 0.0, 4.333333333333333, 4, 5, 4.0, 5.0, 5.0, 5.0, 0.24964633435965716, 0.2996243602812682, 0.039494830240492634], "isController": false}, {"data": ["GET /posts/2/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 300.048828125, 39.55078125], "isController": false}, {"data": ["GET /posts/64/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 298.828125, 39.55078125], "isController": false}, {"data": ["GET /posts/23/comments", 2, 0, 0.0, 4.5, 3, 6, 4.5, 6.0, 6.0, 6.0, 0.11884247430031494, 0.1426341805811397, 0.01880125081704201], "isController": false}, {"data": ["GET /posts/11/comments", 2, 0, 0.0, 3.5, 3, 4, 3.5, 4.0, 4.0, 4.0, 0.1409046075806679, 0.16911304952796954, 0.02229154924616035], "isController": false}, {"data": ["GET /posts/46/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 300.048828125, 39.55078125], "isController": false}, {"data": ["GET /posts/52/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 400.0651041666667, 52.734375], "isController": false}, {"data": ["GET /posts/3/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 400.0651041666667, 52.734375], "isController": false}, {"data": ["GET /users", 100, 0, 0.0, 3.309999999999999, 3, 6, 3.0, 4.0, 4.0, 5.989999999999995, 2.9547334830398295, 4.484038899066304, 0.43282228755466257], "isController": false}, {"data": ["GET /posts/39/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 393.5546875, 52.408854166666664], "isController": false}, {"data": ["GET /posts/16/comments", 2, 0, 0.0, 3.5, 3, 4, 3.5, 4.0, 4.0, 4.0, 0.36081544290095613, 0.43304900324733897, 0.05708213061519033], "isController": false}, {"data": ["GET /posts/75/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 300.048828125, 39.55078125], "isController": false}, {"data": ["GET /posts/34/comments", 2, 0, 0.0, 5.0, 4, 6, 5.0, 6.0, 6.0, 6.0, 0.1557026080186843, 0.1868735402880498, 0.024632639159205917], "isController": false}, {"data": ["GET /posts/98/comments", 3, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 0.1606081696022271, 0.19276117230579798, 0.025408714331602335], "isController": false}, {"data": ["GET /posts/40/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 300.048828125, 39.55078125], "isController": false}, {"data": ["GET /posts/4/comments", 3, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 0.19234468166955182, 0.2308511853241008, 0.03042952971725332], "isController": false}, {"data": ["GET /posts/7/comments", 3, 0, 0.0, 3.6666666666666665, 3, 4, 4.0, 4.0, 4.0, 4.0, 0.23322708543885565, 0.27657756258260124, 0.03674541320065304], "isController": false}, {"data": ["GET /posts/28/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 393.5546875, 52.408854166666664], "isController": false}, {"data": ["GET /posts/95/comments", 3, 0, 0.0, 3.6666666666666665, 3, 4, 4.0, 4.0, 4.0, 4.0, 0.21061499578770007, 0.2527791306866049, 0.03331995050547599], "isController": false}, {"data": ["GET /posts/22/comments", 2, 0, 0.0, 3.5, 3, 4, 3.5, 4.0, 4.0, 4.0, 0.23228803716608595, 0.27822390389082463, 0.03674869337979094], "isController": false}, {"data": ["GET /posts/1/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 300.048828125, 39.55078125], "isController": false}, {"data": ["GET /posts/77/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 300.048828125, 39.55078125], "isController": false}, {"data": ["GET /posts/74/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 300.048828125, 39.55078125], "isController": false}, {"data": ["GET /posts/83/comments", 2, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 0.17176228100309174, 0.2061482845242185, 0.027173329611817246], "isController": false}, {"data": ["GET /posts/10/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 400.0651041666667, 52.734375], "isController": false}, {"data": ["GET /posts/58/comments", 4, 0, 0.0, 3.5, 3, 4, 3.5, 4.0, 4.0, 4.0, 0.4924289055767574, 0.5904097547088515, 0.07790379170257294], "isController": false}, {"data": ["GET /posts/65/comments", 3, 0, 0.0, 3.3333333333333335, 3, 4, 3.0, 4.0, 4.0, 4.0, 0.3024193548387097, 0.36296229208669356, 0.04784368699596774], "isController": false}, {"data": ["GET /posts/53/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 400.0651041666667, 52.734375], "isController": false}, {"data": ["GET /posts/56/comments", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 600.09765625, 79.1015625], "isController": false}, {"data": ["GET /posts/71/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 400.0651041666667, 52.734375], "isController": false}, {"data": ["GET /posts/73/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 300.048828125, 39.55078125], "isController": false}, {"data": ["GET /posts/18/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 400.0651041666667, 52.734375], "isController": false}, {"data": ["GET /posts/67/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 300.048828125, 39.55078125], "isController": false}, {"data": ["GET /posts/50/comments", 2, 0, 0.0, 5.0, 4, 6, 5.0, 6.0, 6.0, 6.0, 0.2080515967960054, 0.2497025512327057, 0.032914412774368046], "isController": false}, {"data": ["GET /posts/59/comments", 2, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 0.20034057898427327, 0.24044782380046076, 0.031694505659621355], "isController": false}, {"data": ["GET /posts/6/comments", 3, 0, 0.0, 3.6666666666666665, 3, 4, 4.0, 4.0, 4.0, 4.0, 0.19940179461615154, 0.23932109920239283, 0.03154598703888335], "isController": false}, {"data": ["GET /posts/96/comments", 3, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 0.19514733623886032, 0.23421491820074156, 0.030872918428413453], "isController": false}, {"data": ["GET /posts/36/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 393.5546875, 52.408854166666664], "isController": false}, {"data": ["GET /posts/84/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 398.4375, 52.734375], "isController": false}, {"data": ["GET /posts/43/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 400.0651041666667, 52.734375], "isController": false}, {"data": ["GET /posts/78/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 400.0651041666667, 52.734375], "isController": false}, {"data": ["GET /posts/5/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 303.7109375, 39.794921875], "isController": false}, {"data": ["GET /posts/20/comments", 2, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 0.6736274840013472, 0.8068399503199731, 0.10656997305490064], "isController": false}, {"data": ["GET /posts/19/comments", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 300.048828125, 39.55078125], "isController": false}, {"data": ["GET /posts/90/comments", 2, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 0.1759014951627089, 0.21111614995602465, 0.02782816622691293], "isController": false}, {"data": ["GET /posts/48/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 400.0651041666667, 52.734375], "isController": false}, {"data": ["GET /posts/66/comments", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 400.0651041666667, 52.734375], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 300, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
