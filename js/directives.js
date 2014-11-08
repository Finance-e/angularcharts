'use strict';

google.load('visualization', '1', {packages:['corechart']});
angular.module('fangucharts', []).
directive('gChart',function (){
   return {
      restrict: 'EA',
      controller: ['$scope', '$attrs', '$element', function ($scope, attrs, elm) {
        
        var toggleSeries=function(col){
            if(typeof $scope.copyData === 'undefined'){$scope.copyData = {};}
            var remove = false;
            if(typeof $scope.copyData[col] === 'undefined'){
                remove = true;
                $scope.copyData[col] = {};
            }
            for(var i in $scope.localData){
                if(i === '0' || i === '1' ||typeof($scope.localData[i][col]) === 'undefined'){continue;}
                if(remove){
                    $scope.copyData[col][i] = $scope.localData[i][col];
                    $scope.localData[i][col] = null;
                }else{
                    $scope.localData[i][col] = $scope.copyData[col][i];
                }
            }
            if(!remove){delete $scope.copyData[col];}
            $scope.$digest();
        };
            
        $scope.$watch('chart', function () {
            if(typeof $scope.chart === 'undefined'){return;}
            var type = $scope.chart.typeName;
            
            var formatter = new google.visualization.NumberFormat({negativeColor: 'red'});
            formatter.format($scope.chart.data, 1);
            
            var wrapper = new google.visualization.ChartWrapper({
                chartType: type,
                dataTable: $scope.chart.data,
                options: $scope.chart.options,
                containerId: elm[0]
            });
            wrapper.draw();
            
            var chart = wrapper.getChart();
            //var view = new google.visualization.DataView($scope.chart.data);
            google.visualization.events.addListener(wrapper, 'select', function() {
                var selection = chart.getSelection();
                if(selection.length === 0 || selection[0].row !== null){return;}
                toggleSeries(selection[0].column);
            });
        },true);
      }]
   };
  }).directive('charts', ['$window', function($window) {
        return {
            restrict: 'EA',
            template: '<div class="charts span12"><div g-chart></div></div>',
            replace: true,
            scope: {
                "localData" : "=localdata",
                "chartType" : "=type",
                "options"   : "=options",
                "title"     : "=title",
                'animation' : "@animation",
            },
            
            controller:['$scope', '$attrs', '$element',function($scope,attrs,elem){
                $scope.chartTypes = [
                    'LineChart', 'BarChart','Coluna', 'ColumnChart','PieChart', 'AreaChart','BubbleChart','MotionChart','SteppedAreaChart','Table'
                ];
                
                var getDefaultOptions = function(){
                    //var title = $scope.title;
                    return {
                        //title: title,
                        page:'enable',
                        pageSize:10,
                        pagingSymbols:{prev: 'Anterior', next: 'Próximo'},
                        pagingButtonsConfiguration:'auto',
                        allowHtml: true,
                        explorer: {
                             actions: ["dragToZoom", "rightClickToReset"]
                        },
                        NumberFormat:{
                            decimalSymbol:".", fractionDigits:","
                        }
                   };
                };
                if(typeof $scope.chartType === 'undefined'){$scope.chartType = "LineChart";}
                var getOptions = function(){
                    var opts = {};
                    if(typeof $scope.options !== 'undefined'){opts = $scope.options;}
                    var defaultoptions = getDefaultOptions();
                    var options = opts;
                    for(var i in defaultoptions){
                        if(typeof options[i] !== 'undefined'){continue;}
                        options[i] = defaultoptions[i];
                    }
                   if(typeof($scope.animation === 'undefined') || $scope.animation === true){
                        options['animation'] = {
                          duration: 1000,
                          easing: 'out'
                        };
                    }
                    return options;
                };
                
                var initChart = function(data){
                    var chart      = {};
                    var titles     = data[0];
                    var types      = data[1];
                    var dt         = data.slice(2);
                    if(dt.length === 0){return;}
                    chart.data     = new google.visualization.DataTable();
                    for (var i in titles){
                        chart.data.addColumn(types[i], titles[i]);
                    }
                    for(var j in dt){
                        var row = [];
                        for(var k in dt[j]){
                            if(types[k] == 'date'){
                                var date = new Date(dt[j][k]);
                                date.setDate(date.getDate() + 1);
                                row.push(date);
                            }
                            else {row.push(dt[j][k]);}
                        }
                        chart.data.addRow(row);
                    }
                    
                    chart.options  = getOptions();
                    chart.typeName = $scope.chartType;
                    $scope.chart   = chart;
                };
                
                $scope.$watch('localData', function (newValue) {
                    initChart(newValue);
                },true);       
                
                $scope.$watch('chartType', function (newval, oldval) {
                    if(typeof ($scope.chart) === 'undefined'){return;}
                    $scope.chart.typeName = $scope.chartType;
                },true);       
                
                var w = angular.element($window);
                w.bind('resize',function(){
                    initChart($scope.localData);
                    $scope.$digest();
                });
            }]
      };
}]);