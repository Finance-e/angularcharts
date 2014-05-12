'use strict';

/* Controllers */
angular.module('myApp.controllers', []).
  controller('MyCtrl1', ['$scope',function($scope) {
        $scope.dados = [
          ['Year', 'Sales', 'Expenses', 'Lucro'],
          ['2004',  1000,      400,   1000-400],
          ['2005',  1170,      460,   1170-460],
          ['2006',  1660,      1120,  1660-1120],
          ['2007',  1030,      540 ,  1030-540]
        ];
        $scope.title = 'Company Performance2';
        
        $scope.lastYear = 2007;
        $scope.add = function(){
            var data = [];
            $scope.lastYear++;
            data.push(""+$scope.lastYear+"");
            var sales    = Math.floor((Math.random() * 5000) + 1);
            var expenses = Math.floor((Math.random() * 5000) + 1);
            var profit   = sales-expenses;
            data.push(sales);
            data.push(expenses);
            data.push(profit);
            $scope.dados.push(data);
        };
  }]);
