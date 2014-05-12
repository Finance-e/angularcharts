'use strict';

/* Filters */

angular.module('myApp.providers', []).provider('chartDataTransform', function() {
  this.$get = [function() {
    console.log("fooo");
  }];
});