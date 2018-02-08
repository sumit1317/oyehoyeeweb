'use strict';
var myApp = angular.module("myModule",["ngRoute", "ngStorage"]);
myApp.config(function($routeProvider){
  $routeProvider
  .when("/",{
    templateUrl:"logins.html",
    controller:"loginCtrl"
  })
  .when("/dashboard",{
// resolve: {
//     check: function($location, user){
//       if (!user.isUserLoggedIn()) {
//         $location.path('/')
//       }
//
//     },
//   },
    templateUrl:"dashboard.html",
    controller:"DashboardCtrl"
  })
  .when("/properties",{
// resolve: {
//     check: function($location, user){
//       if (!user.isUserLoggedIn()) {
//         $location.path('/')
//       }
//
//     },
//   },
    templateUrl:"properties.html",
    controller:"propertiesCtrl"
  })
  .when("/species",{
// resolve: {
//     check: function($location, user){
//       if (!user.isUserLoggedIn()) {
//         $location.path('/')
//       }
//
//     },
//   },
    templateUrl:"species.html",
    controller:"speciesCtrl"
  })
  .when("/maplocation",{
// resolve: {
//     check: function($location, user){
//       if (!user.isUserLoggedIn()) {
//         $location.path('/')
//       }
//
//     },
//   },
    templateUrl:"properties-location.html",
    controller:"MapCtrl"
  })
  .when("/breeds",{
// resolve: {
//     check: function($location, user){
//       if (!user.isUserLoggedIn()) {
//         $location.path('/')
//       }
//
//     },
//   },
    templateUrl:"breeds.html",
    controller:"breedsCtrl"
  })
  .when("/dlcs",{
// resolve: {
//     check: function($location, user){
//       if (!user.isUserLoggedIn()) {
//         $location.path('/')
//       }
//
//     },
//   },
    templateUrl:"dlcs.html",
    controller:"dlcsCtrl"
  })
  .otherwise({
    redirectTo:'/'
  });
});



myApp.service('user', function($localStorage){
var username ;
var loggedin = false;
this.setName = function(name){
  username =name;
};
this.getName = function(){
  return username;
};
this.isUserLoggedIn = function(){
  return loggedin;
};
this.userLoggedIn = function(){
  loggedin = true;
};
});

 myApp.factory('sessionServices', function($http){
  return {
    set : function(key, value){
      return sessionStorage.setItem(key, value);
      //console.log(sessionStorage);
    },
    get : function(key){
      return sessionStorage.getItem(key);
    }
    // destroy : function(key){
    //   return
    // }
  };

 });
myApp.factory('loginServices', function($http, user, $location, sessionServices, $localStorage){
return{

login : function(email, password){

  $http({
    url: '/api/adminLogin',
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'email='+email+'&password='+password
  }).then(function(response){
  //  console.log(response.data.token);

if(response.data.alertMessage == "Login Successful"){
  user.userLoggedIn();
  $localStorage.usertoken = response.data.token;
  user.setName($localStorage.usertoken);
  var data = response.data.token;
  if(data !=''){
    //console.log(data);
//sessionServices.set('user',data);
  $location.path('/dashboard');
}
else{
  $location.path('/');
}
}
  })
},

islogged : function(){
  if(sessionServices.get('user')) return true;
}

}

});
myApp.controller("myController", function($scope){
  $scope.title = "AgLive";
});
myApp.controller("loginCtrl", function($scope,$location, $http, user, loginServices, $localStorage){
  $scope.submit = function(){
    var email = $scope.email;
    var password = $scope.password;
loginServices.login(email, password);

  }
});
myApp.controller("DashboardCtrl", function($scope,$location, $http, user, loginServices, $localStorage){
  $scope.user = user.getName();

  $http({
    url: '/api/getDashboard',
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'token='+ user.getName()
  }).then(function(response){
  //  console.log(response.data.token);
//console.log(response);
if(response.data.data.numberofBobbyCalvesAvailable == null){
  response.data.data.numberofBobbyCalvesAvailable = 0;
}
if(response.data.data.numberodBobbyCalvesinTransit == null){
  response.data.data.numberodBobbyCalvesinTransit = 0;
}
if(response.data.data.numberodBobbyCalvesDelivered == null){
  response.data.data.numberodBobbyCalvesDelivered = 0;
}
$scope.numberofBobbyCalvesAvailable = response.data.data.numberofBobbyCalvesAvailable;
$scope.numberodBobbyCalvesinTransit = response.data.data.numberodBobbyCalvesinTransit;
$scope.numberodBobbyCalvesDelivered = response.data.data.numberodBobbyCalvesDelivered;
  })

});
myApp.controller("propertiesCtrl", function ($scope, $location, $http, user , $localStorage){
  $scope.user = user.getName();

  $http({
    url: '/api/getProperties',
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'token='+ user.getName()+'&pagenumber='+1
  }).then(function(response){

$scope.property = response.data.data;


$scope.picid = response.data.data.picID;
//$scope.noofmobileusers = response.data.data.numberofMobileUsers;
//$scope.noregpro = response.data.data.numberofRegisteredProperties;

  })
$scope.showmap= function(){

  // var lat = $scope.prop.latitude;
  // var long = $scope.prop.longitude;
  // alert(lat+' '+long);
    $location.path('/maplocation');
}
  $scope.submit = function(prop){
  //  alert(prop.picID);
  var morebobbyCalves = prop.bobbynumber;
  var picid = prop.picID;
   //alert(morebobbyCalves+','+ picid);
  $http({
    url: '/api/adminAddBobbyCalves',
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'token='+ user.getName()+'&picid='+picid+'&morebobbyCalves='+morebobbyCalves
  }).then(function(response){
    if(response.data.alert == "ON"){
    alert(response.data.alertMessage)
      $location.path('/properties');
    }

  })
  }
});

myApp.controller("speciesCtrl", function($scope, $http, user, $localStorage){
  $scope.user = user.getName();
  $http({
    url: '/api/getSpecies',
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'token='+ user.getName()
  }).then(function(response){
  //  console.log(response.data.token);
$scope.species = response.data.data;
//$scope.totalbobbycalves = response.data.data.numberofBobbyCalvesAvailable;
//$scope.noofmobileusers = response.data.data.numberofMobileUsers;
//$scope.noregpro = response.data.data.numberofRegisteredProperties;
  })
});

myApp.controller("MapCtrl", function($scope, $http, user, $localStorage){

  $scope.initialize = function() {
      var map = new google.maps.Map(document.getElementById('map_div'), {
         center: {lat: -34.397, lng: 150.644},
         zoom: 8
      });
   }

   google.maps.event.addDomListener(window, 'load', $scope.initialize);
});

myApp.controller("breedsCtrl", function($scope, $http, user){
  $scope.user = user.getName();
  $http({
    url: '/api/getBreeds',
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'token='+ user.getName()
  }).then(function(response){
$scope.breeds = response.data.data;
  })
});

myApp.controller("dlcsCtrl", function($scope,$rootScope, $location, $http, user, $route, $timeout, $localStorage){

  $scope.user = user.getName();
  $http({
    url: '/api/getAllDLCs',
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'token='+ user.getName()+'&pagenumber='+1
  }).then(function(response){
    //console.log(response);
$rootScope.dlsc = response.data.data;
  })

  $http({
    url: '/api/getBreeds',
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'token='+ user.getName()
  }).then(function(responses){
$scope.breeds = responses.data.data;
console.log($scope.breeds);
  })

  $scope.submit = function(dls){
  //$scope.dlsc = {};

  var searchby  = $scope.dlcs.searchby;
  var fromdate = $scope.dlcs.from_date;
  var todate = $scope.dlcs.to_date;
  var sourcepicnumber  = $scope.dlcs.sourcepicnumber;
var destinationpic = $scope.dlcs.destinationpic;
var drivername = $scope.dlcs.drivername;
var breedid = $scope.dlcs.breedid;
var referencenumber = $scope.dlcs.referencenumber;
var refnum = $scope.dlcs.refnumber;
if(searchby == 'date'){
  $http({
    url: '/api/searchDLC',
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'token='+ user.getName()+'&searchType='+searchby+'&sourcePICNumber='+sourcepicnumber
  }).then(function(response){


    $rootScope.dlsc = response.data.data;

  })

}
else if (searchby == 'sourcePIC') {
  $http({
    url: '/api/searchDLC',
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'token='+ user.getName()+'&searchType='+searchby+'&sourcePICNumber='+sourcepicnumber
  }).then(function(response){


    $rootScope.dlsc = response.data.data;

  })
}
else if (searchby == 'destinationPIC') {
  $http({
    url: '/api/searchDLC',
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'token='+ user.getName()+'&searchType='+searchby+'&destinationPICNumber='+destinationpic
  }).then(function(response){


    $rootScope.dlsc = response.data.data;

  })
}

else if (searchby == 'driverName') {
  $http({
    url: '/api/searchDLC',
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'token='+ user.getName()+'&searchType='+searchby+'&driverName='+drivername
  }).then(function(response){


    $rootScope.dlsc = response.data.data;

  })
}

else if (searchby == 'breedID') {
  $http({
    url: '/api/searchDLC',
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'token='+ user.getName()+'&searchType='+searchby+'&breedid='+breedid
  }).then(function(response){


    $rootScope.dlsc = response.data.data;

  })
}

else if (searchby == 'referenceNumber') {
  $http({
    url: '/api/searchDLC',
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'token='+ user.getName()+'&searchType='+searchby+'&refNumberType='+referencenumber+'&refNumberValue='+refnum
  }).then(function(response){


    $rootScope.dlsc = response.data.data;

  })
}
  }


});


//myApp.factory('dataService',['$http', 'serviceBasePath', function($http, serviceBasePath){

//}])
