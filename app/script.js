$(function(){
	$(document).on('mousedown', '.point .items, .connection .transfers', function(event){
		event.stopPropagation();
		var target = $(this).find('.dropdown-list');
		target.slideDown(250);
	});
	$(document).on('mousedown', '.dropdown-list .up', function(event){
		event.stopPropagation();
		var target = $(this).parent();
		target.slideUp(250);
	});
});