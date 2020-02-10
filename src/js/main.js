const changeActiveElement = (list, active) => {
	[...list].forEach(item => {
		if (item === active) {
			item.classList.add('active');
		} else {
			item.classList.remove('active');
		}
	});
};

const expandButtons = document.querySelectorAll('.expand-js');
[...expandButtons].forEach(button => {
	button.addEventListener('click', () => {
		if (button.classList.contains('active')) {
			button.classList.remove('active');
		} else {
			changeActiveElement(expandButtons, button);	
		}
	});
});
