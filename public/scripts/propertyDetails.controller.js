var app = angular.module('Airbnb');

function propertyDetailsControllerFn($state,$stateParams,$http,$uibModal,loginService) {
	
	var vm = this;
	vm.property = {};
	function getPropertyDetails(property) {
		$http.post("/SearchPropertyById",{property_id:property.property_id}).
		then(function(response) {
			console.log(response);
			if(response.status==200){

				vm.property= response.data;
				console.log("property",vm.property);
			}
			else
			{
				console.log(response);
			}
		},function(err)
		{

					console.log(err);
					//Open the login popup
				
		});

	}

	function goToCheckoutPage() {
		$state.go("checkout",{property:vm.property});
	}

	function openLoginModal() {

		

	 		var modalInstance = $uibModal.open({
	 			 animation : true,
			     templateUrl: 'public/views/loginModal.html',
		      	 size: "md",
		      	 controller:'LoginModalController',
		      	 controllerAs:"vm",
		      	 backdrop : true
		    });

		     modalInstance.result.then(function (userData) {
			     vm.userData = userData;
			     loginService.login(userData).
			     then(function(isLoggedIn) {
			     	if(isLoggedIn){
			     		loginService.getUserProfile().
			     		then(function(user) {
			     			vm.user = user;
			     		});
			     		goToCheckoutPage();
			     		//bookProperty();
			     	}
			     })

			     console.log("userData",vm.userData);
			    }, function () {
			     // $log.info('Modal dismissed at: ' + new Date());
			});
			  
	 	
	}

	vm.authenticateUser = function() {
		$http.get("/isUserLoggedIn").
		then(function(response) {
			console.log("response",response);
			if(response.status==200){
				//vm.bookProperty();
				goToCheckoutPage();
			}
			else if(response.status==401){
				
			}
		},function(err) {
			console.log("err",err);
			openLoginModal();
		})
	}
	/*vm.bookProperty = function(){

		$http.post("/bookProperty",vm.property).
		then(function(response) {
			if(response.status==200){

			}
			else if(response.status==401){
				openLoginModal();
			}
		})
	}*/

	getPropertyDetails($stateParams.property);
	console.log($stateParams);
}

app.controller('PropertyDetailsController',propertyDetailsControllerFn);