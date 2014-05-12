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
           //type var type = $scope.chart.type;
            var type = $scope.chart.typeName;
            var wrapper = new google.visualization.ChartWrapper({
                chartType: type,
                dataTable: $scope.chart.data,
                options: $scope.chart.options,
                containerId: elm[0]
            });
            wrapper.draw();
        },true);
      }
   }
  }).directive('charts', function($window) {
      return {
            restrict: 'EA',
            template: '<div class="charts"><div g-chart></div><select ng-model="selectedValue" ng-options="c.name for c in chartTypes"></select>{{myselection.name}}</div>',
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
                    var chart = {};
                    chart.data     = google.visualization.arrayToDataTable(data);
                    chart.options  = getOptions();
                    chart.typeName = scope.selectedValue.value;
                    scope.chart    = chart;
                }
                
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