'use strict';

/* Controllers */
angular.module('myApp',['fangucharts']).controller('myCtrl', ['$scope', function($scope) {
    $scope.title  = 'Company Performance2';
    $scope.type   = "BarChart";
    $scope.dados  = [
        ['Year'  , 'Sales' , 'Expenses', 'Lucro'],
        ['number', 'number', 'number'  , 'number'],
        [2004    ,  1000   ,  400      ,  1000-400],
        [2005    ,  1170   ,  460      ,  1170-460],
        [2006    ,  1660   ,  1120     ,  1660-1120],
        [2007    ,  1030   ,  540      ,  1030-540]
    ];
}]);
