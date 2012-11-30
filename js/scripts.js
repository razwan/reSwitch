;(function($) {

	"use strict";

	$(document).ready(function () {

		prettyPrint();

		$('.default [type="radio"]').reswitch({
			textOn: 'I',
			textOff: 'O',
			hasToggle: true,
			theme: 'iphone4 orange'
		});

		$('.default [type="checkbox"]').reswitch({
			textOn: 'I',
			textOff: 'O',
			hasToggle: true,
			theme: 'iphone4'
		});

		$('.icon-reswitch').reswitch({
			textOn: '<i class="icon-ok"></i>',
			textOff: '<i class="icon-remove"></i>',
			hasToggle: true,
			theme: 'iphone4'
		});

		$('.text-reswitch').reswitch({
			textOn: 'Yes',
			textOff: 'No',
			hasToggle: true,
			theme: 'iphone4'
		});

		$('.text-reswitch-no-handle').reswitch({
			textOn: 'On',
			textOff: 'Off',
			hasToggle: false,
			theme: 'iphone4 orange'
		});

		$('.text-reswitch-big').reswitch({
			textOn: 'Very',
			textOff: 'Big',
			hasToggle: true,
			theme: 'iphone4'
		});

		$('.form-actions').on('click', '.btn', function(e){
			e.preventDefault();
			var $form = $(this).closest('form'),
				container = $form.find('.results'),
				results = '';
			$.each($form.serializeArray(), function(i, field) {
				results = results + '<li>' + field.value + '</li>';
			});

			container.html('<h4>Result</h4>');
			results = $('<ul>' + results + '</ul>').hide();
			container.append(results);
			results.fadeIn();
		});

		$('#main-navigation a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
		});
	});

}(jQuery));