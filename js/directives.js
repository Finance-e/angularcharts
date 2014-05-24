'use strict';

google.load('visualization', '1', {packages:['corechart']});
google.setOnLoadCallback(function () {
    angular.bootstrap(document.body, ['myApp']);
});

angular.module('fangucharts', []).
directive('gChart',function (){
   return {
      restrict: 'EA',
      link: function ($scope, elm, attrs) {
        $scope.$watch('chart', function () {
            
            if(typeof $scope.chart === 'undefined'){return;}
            var type = $scope.chart.typeName;
            var wrapper = new google.visualization.ChartWrapper({
                chartType: type,
                dataTable: $scope.chart.data,
                options: $scope.chart.options,
                containerId: elm[0]
            });
            wrapper.draw();
            
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
            
            var chart = wrapper.getChart();
            var view = new google.visualization.DataView($scope.chart.data);
            google.visualization.events.addListener(wrapper, 'select', function() {
                var selection = chart.getSelection();
                if(selection.length === 0 || selection[0].row !== null){return;}
                toggleSeries(selection[0].column);
            });
        },true);
      }
   };
  }).directive('charts', function($window) {
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
            link:function($scope,elem,attrs){
                $scope.chartTypes = [
                    'LineChart', 'BarChart','Coluna', 'ColumnChart','PieChart', 'AreaChart','BubbleChart','MotionChart','SteppedAreaChart','Table'
                ];
                if(typeof $scope.chartType === 'undefined'){$scope.chartType = "LineChart";}
                var getOptions = function(){
                    var options = {
                        title: $scope.title,
                        page:'enable',
                        pageSize:10,
                        pagingSymbols:{prev: 'Anterior', next: 'Próximo'},
                        pagingButtonsConfiguration:'auto',
                        allowHtml: true,
                        explorer: {
                            axis: 'horizontal',
                            keepInBounds: true,
                            maxZoomIn: 0.25,
                            maxZoomOut: 1
                        }
                   };
                   if(typeof($scope.animation === 'undefined') || $scope.animation === true){
                        options.animation = {
                          duration: 1000,
                          easing: 'out',
                        };
                    }
                    return options;
                };
                
                var initChart = function(data){
                    var chart      = {};
                    var titles     = data[0];
                    var types      = data[1];
                    
                    chart.data     = new google.visualization.DataTable();
                    for (var i in titles){
                        chart.data.addColumn(types[i], titles[i]);
                    }
                    chart.data.addRows(data.slice(2));
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
            }
      };
});