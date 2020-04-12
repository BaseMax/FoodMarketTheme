// tab
function moveIndicator(pnIndicator, pnProductNavContents, item, color) {
	// if(item && item.getBoundingClientRect)
	{
		var textPosition = item.getBoundingClientRect();
		var container = pnProductNavContents.getBoundingClientRect().left;
		var distance = textPosition.left - container;
		pnIndicator.style.transform = "translateX(" + (distance + pnProductNavContents.scrollLeft) + "px) scaleX(" + textPosition.width * 0.01 + ")";
		if(color) {
			pnIndicator.style.backgroundColor = colour;
		}
	}
}
function determineOverflow(content, container) {
	var containerMetrics = container.getBoundingClientRect();
	var containerMetricsRight = Math.floor(containerMetrics.right);
	var containerMetricsLeft = Math.floor(containerMetrics.left);
	var contentMetrics = content.getBoundingClientRect();
	var contentMetricsRight = Math.floor(contentMetrics.right);
	var contentMetricsLeft = Math.floor(contentMetrics.left);
	if(containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
		return "both";
	}
	else if(contentMetricsLeft < containerMetricsLeft) {
		return "left";
	}
	else if(contentMetricsRight > containerMetricsRight) {
		return "right";
	}
	else {
		return "none";
	}
}
var SETTINGS = {
	navBarTravelling: false,
	navBarTravelDirection: "",
	navBarTravelDistance: 200,
};
function loadPage() {
	var ulFoods=document.querySelector("section .section-content ul.food");
	var restaurants=document.querySelectorAll("section .section-content .restaurants li");
	restaurants.forEach(function(restaurant) {
		// console.log(restaurants);
		restaurant.addEventListener("click", function() {
			restaurants.forEach(function(_restaurant) {
				_restaurant.classList.remove("active");
			});
			this.classList.add("active");
			for(var i = ulFoods.children.length; i >= 0; i--) {
				ulFoods.appendChild(ulFoods.children[Math.random() * i | 0]);
			}
		});
	});
	var basketNumber=document.querySelector(".basket-number");
	var asideContent=document.querySelector("content");
	var asideRight=document.querySelector("content aside.right");
	var asideLeft=document.querySelector("content aside.left");
	basketNumber.addEventListener("click", function() {
		asideRight.classList.toggle("active");
		// asideLeft.classList.toggle("single");
		asideContent.classList.toggle("single");
	});
	// other
	document.documentElement.classList.remove("no-js");
	document.documentElement.classList.add("js");
	var scrolls=document.querySelectorAll(".horizontal-scroll");
	scrolls.forEach(function(scroll){
		var pnAdvancerLeft = scroll.querySelector(".pnAdvancerLeft");
		var pnAdvancerRight = scroll.querySelector(".pnAdvancerRight");
		var pnIndicator = scroll.querySelector(".pnIndicator");
		var pnProductNav = scroll.querySelector(".pnProductNav");
		var pnProductNavContents = scroll.querySelector(".pnProductNavContents");
		pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
		moveIndicator(pnIndicator, pnProductNavContents, pnProductNav.querySelector("[aria-selected=\"true\"]"));
		var last_known_scroll_position = 0;
		var ticking = false;
		function doSomething(scroll_pos) {
			pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
		}
		pnProductNav.addEventListener("scroll", function() {
			last_known_scroll_position = window.scrollY;
			if(!ticking) {
				window.requestAnimationFrame(function() {
					doSomething(last_known_scroll_position);
					ticking = false;
				});
			}
			ticking = true;
		});
		pnAdvancerLeft.addEventListener("click", function() {
			if(SETTINGS.navBarTravelling === true) {
				return;
			}
			if(determineOverflow(pnProductNavContents, pnProductNav) === "left" || determineOverflow(pnProductNavContents, pnProductNav) === "both") {
				var availableScrollLeft = pnProductNav.scrollLeft;
				if(availableScrollLeft < SETTINGS.navBarTravelDistance * 2) {
					pnProductNavContents.style.transform = "translateX(" + availableScrollLeft + "px)";
				}
				else {
					pnProductNavContents.style.transform = "translateX(" + SETTINGS.navBarTravelDistance + "px)";
				}
				pnProductNavContents.classList.remove("pn-ProductNav_Contents-no-transition");
				SETTINGS.navBarTravelDirection = "left";
				SETTINGS.navBarTravelling = true;
			}
			pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
		});
		pnAdvancerRight.addEventListener("click", function() {
			if(SETTINGS.navBarTravelling === true) {
				return;
			}
			if(determineOverflow(pnProductNavContents, pnProductNav) === "right" || determineOverflow(pnProductNavContents, pnProductNav) === "both") {
				var navBarRightEdge = pnProductNavContents.getBoundingClientRect().right;
				var navBarScrollerRightEdge = pnProductNav.getBoundingClientRect().right;
				var availableScrollRight = Math.floor(navBarRightEdge - navBarScrollerRightEdge);
				if(availableScrollRight < SETTINGS.navBarTravelDistance * 2) {
					pnProductNavContents.style.transform = "translateX(-" + availableScrollRight + "px)";
				}
				else {
					pnProductNavContents.style.transform = "translateX(-" + SETTINGS.navBarTravelDistance + "px)";
				}
				pnProductNavContents.classList.remove("pn-ProductNav_Contents-no-transition");
				SETTINGS.navBarTravelDirection = "right";
				SETTINGS.navBarTravelling = true;
			}
			pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
		});
		pnProductNavContents.addEventListener(
			"transitionend",
			function() {
				var styleOfTransform = window.getComputedStyle(pnProductNavContents, null);
				var tr = styleOfTransform.getPropertyValue("-webkit-transform") || styleOfTransform.getPropertyValue("transform");
				var amount = Math.abs(parseInt(tr.split(",")[4]) || 0);
				pnProductNavContents.style.transform = "none";
				pnProductNavContents.classList.add("pn-ProductNav_Contents-no-transition");
				if(SETTINGS.navBarTravelDirection === "left") {
					pnProductNav.scrollLeft = pnProductNav.scrollLeft - amount;
				}
				else {
					pnProductNav.scrollLeft = pnProductNav.scrollLeft + amount;
				}
				SETTINGS.navBarTravelling = false;
			},
			false
		);
		pnProductNavContents.addEventListener("click", function(e) {
			if(!e.target.classList.contains("pn-ProductNav_Link")) {
				return;
			}
			var links = [].slice.call(document.querySelectorAll(".pn-ProductNav_Link"));
			links.forEach(function(item) {
				item.setAttribute("aria-selected", "false");
			})
			e.target.setAttribute("aria-selected", "true");
			moveIndicator(pnIndicator, pnProductNavContents, e.target);
		});
	});
}
loadPage();

