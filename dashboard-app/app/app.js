'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.version',
  'ui.bootstrap',
  'ngAnimate'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}])
.directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select: function() {
                    $timeout(function() {
                      iElement.trigger('input');
                    }, 0);
                }
            });
    };
})
.controller('DashboardCtrl', function($scope,$interval, $http,DashboardService) {
   $scope.selectedInterval = '';
   var refreshat = 5 ;

   $scope.refreshTimings = [
        {time : "5 Secs", sec : 5},
        {time : "10 Secs", sec : 10},
        {time : "120 Secs", sec : 120},
        {time : "1 hour", sec : 3600},
        {time : "2 hours", sec : 7200},
        {time : "24 hours", sec : 86400},
        {time : "1 Week", sec : 604800}
    ];
   
   $scope.onChange = function(seletedValue) {

        refreshat = seletedValue;
        
        init();
    };

    $scope.$on('$destroy', function() {    
        $interval.cancel(stop);
    });
    
    //lookup values
    $scope.countries = {};
    $scope.Linechart = {};
    $scope.BarChart = {};   

      
     var refresh = function(){
       
       $interval(function () {
                $scope.relativeTime = $scope.relativeTime - 1;
            }, 1000,$scope.relativeTime).then(function(){
              init();
            });
          
           
            
    } 
    
    var init = function () {
      $scope.relativeTime = refreshat;
      refresh();


        DashboardService.getChartDetails().success(function(response){
        
        $scope.Linechart = response;
        $scope.BarChart = response;
        var arrLength = $scope.Linechart.data.length;

        for (var i = 0; i < arrLength; i++) {
            // Find Maximum X Axis Value
            if ($scope.Linechart.data[i].value > $scope.Linechart.max)
            $scope.Linechart.max = $scope.Linechart.data[i].value;
        }

        var arrLength2 = $scope.BarChart.data.length;
        for (var i = 0; i < arrLength2; i++) {
            // Find Maximum X Axis Value
            if ($scope.BarChart.data[i].value > $scope.BarChart.max)
            $scope.BarChart.max = $scope.BarChart.data[i].value;
        }

    	});
      };

     DashboardService.getChartDetails().success(function(response){
        
        $scope.Linechart = response;
        $scope.BarChart = response;
        var arrLength = $scope.Linechart.data.length;

        for (var i = 0; i < arrLength; i++) {
            // Find Maximum X Axis Value
            if ($scope.Linechart.data[i].value > $scope.Linechart.max)
            $scope.Linechart.max = $scope.Linechart.data[i].value;
        }

        var arrLength2 = $scope.BarChart.data.length;
        for (var i = 0; i < arrLength2; i++) {
            // Find Maximum X Axis Value
            if ($scope.BarChart.data[i].value > $scope.BarChart.max)
            $scope.BarChart.max = $scope.BarChart.data[i].value;
        }

    	});

    DashboardService.getCountryDetails().success(function(response){
        
        $scope.countries = response;
    });
 
    		
   

    $scope.data = [
        ['Task', 'Hours per Day'],
        ['Work', 11],
        ['Eat', 2],
        ['Commute', 2],
        ['Watch TV', 2],
        ['Sleep', 7]
    ];

    $scope.options = {
        title: "My daily activities"
    };

    function initialize() {
   

    var myOptions = {
        zoom: 4,
        center: new google.maps.LatLng(12.9257571, 77.5482546),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    $scope.map = new google.maps.Map(document.getElementById("map"),
            myOptions);
    }
    google.maps.event.addDomListener(window, "load", initialize);
    

})
.directive('lineChart', function() {
   
   var directive = {};
   
   
   directive.restrict = 'E';
   
  
   directive.templateUrl = 'view1/lineChart-details.html';
   
   
   directive.scope = {
      lineChartData : "=data"
   }
   
   return directive;
})
.directive('barChart', function() {
   
   var directive = {};
   
 
   directive.restrict = 'E';
   
   
   directive.templateUrl = 'view1/bar-chart-details.html';
   
   
   directive.scope = {
      barChartData : "=data"
   }
   
   
   return directive;
})
.directive('piechart', function () {
    return {
        restrict: 'C',
        replace: true,
        template: '<div id="piechart_div" style="width: 500px; height: 250px;"></div>',
        link: function (scope, element, attrs) {
            google.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = google.visualization.arrayToDataTable(
                scope.data);

                var options = scope.options;

                var chart = new google.visualization.PieChart(document.getElementById('piechart_div'));
                chart.draw(data, options);
            }
        }
    };
})
.factory('DashboardService', function ($http) {

     var service = {};

    service.getChartDetails = function(){ 
        return $http.get('https://api.myjson.com/bins/oy675');
    }

    service.getCountryDetails = function(){ 
        return $http.get('https://api.myjson.com/bins/gdj35');
    }
    
    
    
    return service;
    

  
});





