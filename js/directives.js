'use strict';

google.load('visualization', '1', {packages:['corechart']});
google.setOnLoadCallback(function () {
    angular.bootstrap(document.body, ['myApp']);
});

angular.module('myApp.directives', []).
directive('appVersion', ['version',
  function (version) {
    return function ($scope, elm, attrs) {
      elm.text("Angular seed app:" + version);
    };
  }
])
.directive('gChart',function (){
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
                if(!$scope.$$phase) { $scope.$digest(); }
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
            template: '<div class="charts"><select ng-model="selectedValue" ng-options="c.name for c in chartTypes"></select><div g-chart></div></div>',
            replace: true,
            scope: {
                "localData"   : "=localdata",
                "options"     : "=options",
                "title"       : "@title",
                'animation'   : "@animation"
            },
            link:function(scope,elem,attrs){
                
                scope.chartTypes = [
                    {name:'Linha',value:'LineChart'},
                    {name:'Barra',value:'BarChart'},
                    {name:'Coluna',value:'ColumnChart'},
                    {name:'Pizza',value:'PieChart'},
                    {name:'Área',value:'AreaChart'},
                    {name:'Bolha',value:'BubbleChart'},
                    {name:'Motion',value:'MotionChart'},
                    {name:'Etapas',value:'SteppedAreaChart'},
                    {name:'Tabela',value:'Table'},
                ];
                scope.selectedValue=scope.chartTypes[0]; 
                
                var getOptions = function(){
                    var options = {
                        title: scope.title,
                        page:'enable',
                        pageSize:10,
                        pagingSymbols:{prev: 'Anterior', next: 'Próximo'},
                        pagingButtonsConfiguration:'auto',
                        allowHtml: true
                   };
                   if(typeof(scope.animation === 'undefined') || scope.animation === true){
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
                    chart.typeName = scope.selectedValue.value;
                    scope.chart    = chart;
                    if(!scope.$$phase) { scope.$digest(); }
                };
                
                scope.$watch('localData', function (newValue) {
                    initChart(newValue);
                },true);       
                
                scope.$watch('selectedValue', function () {
                    if(typeof (scope.chart) === 'undefined'){return;}
                    scope.chart.typeName = scope.selectedValue.value;
                },true);       
                
                var w = angular.element($window);
                w.bind('resize',function(){
                    initChart(scope.localData);
                });
            }
      }
});