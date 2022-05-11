"use strict";

export const bzSelect = function (
	$elm,
	selectOptions = [],
	{ multiSelect = false, maxSelectedToShow = 3, withFilter = false, limitOptions = 0, initialValue } = {}
) {
	const selectGroup = `select${new Date().getTime() + Math.random()}`; // group components for specific select component
	const $dropDown = document.createElement("div");
	const $dropDownSelectOptions = document.createElement("div");
	const $dropDownFilter = document.createElement("input");

	// functions

	const openDropDown = () => ($dropDown.style.display = "block");
	const closeDropDown = () => ($dropDown.style.display = "none");

	const appendSelectOptions = () => {
		let optionsToAppend = [...selectOptions];
		$dropDownSelectOptions.innerHTML = "";
		if (withFilter) {
			optionsToAppend = optionsToAppend.filter(
				(option) =>
					option.value.toString().includes($dropDownFilter.value) ||
					option.name.toLowerCase().includes($dropDownFilter.value.toString().toLowerCase())
			);
		}
		if (limitOptions) optionsToAppend.splice(limitOptions);

		optionsToAppend.forEach((o) => {
			const $selectOption = document.createElement("div");
			$selectOption.classList.add("bzselect-dropdown-option");
			$selectOption.setAttribute("data-select-group", selectGroup);
			$selectOption.innerText = o.name;
			$selectOption.setAttribute("data-value", o.value);
			$selectOption.setAttribute("data-name", o.name);
			$selectOption.addEventListener("click", (e) => onSelect(e.target));
			$dropDownSelectOptions.append($selectOption);
		});
	};

	const setSelectOptions = (newOptions) => {
		selectOptions = newOptions.map((option) => ({ ...option, name: option.name || option.value })); //JSON.parse(JSON.stringify(newOptions));
		appendSelectOptions();
	};

	const onSelectSingle = ($selected) => {
		const $previousSelected = $dropDownSelectOptions.querySelector(".selected");
		if ($previousSelected) $previousSelected.classList.remove("selected");
		$selected.classList.add("selected");
		$elm.value = $selected.getAttribute("data-name");

		closeDropDown();
	};

	const checkParams = () => {
		let error = "";
		if ($elm.tagName !== "INPUT") error = "Element must by an <input>";
		if (error) console.error(error);
		return error;
	};

	const onSelectMulti = ($selected) => {
		if ($selected.classList.contains("selected")) $selected.classList.remove("selected");
		else $selected.classList.add("selected");
		const $selectedOptions = $dropDownSelectOptions.querySelectorAll(".selected");
		const selectedItemsNames = Array.from($selectedOptions).map(($option) => {
			return $option.getAttribute("data-name");
		});

		if (selectedItemsNames.length > maxSelectedToShow) $elm.value = `${selectedItemsNames.length} Items`;
		else $elm.value = selectedItemsNames.join(", ");
	};

	const onSelect = multiSelect ? onSelectMulti : onSelectSingle;

	const setValue = (value) => {
		const $optionToSet = $dropDownSelectOptions.querySelector(`[data-value = '${value}']`);
		$optionToSet && onSelect($optionToSet);
	};

	const setValues = (valuesArray) => {
		valuesArray.forEach((value) => {
			setValue(value);
		});
	};

	const inputClicked = () => {
		openDropDown(); // show DropDown
	};

	const clickOutsideEvent = (e) => {
		if (e.target.getAttribute("data-select-group") !== selectGroup) {
			closeDropDown();
		}
	};

	const destroy = () => {
		window.removeEventListener(clickOutsideEvent);
		$elm.removeEventListener(inputClicked);
	};

	const init = () => {
		const error = checkParams();
		if (error) return;
		$elm.value = "";
		$elm.setAttribute("data-select-group", selectGroup);
		$elm.setAttribute("readOnly", true);
		$elm.classList.add("bzselect-input");

		$dropDown.setAttribute("data-select-group", selectGroup);
		$dropDown.style.display = "none";
		$dropDown.classList.add("bzselect-dropdown");

		if (withFilter) {
			$dropDownFilter.setAttribute("data-select-group", selectGroup);
			$dropDownFilter.classList.add("bzselect-dropdown-filter");
			$dropDown.append($dropDownFilter);
		}

		$dropDownSelectOptions.setAttribute("data-select-group", selectGroup);
		$dropDownSelectOptions.classList.add("bzselect-dropdown-select-options");
		$dropDown.append($dropDownSelectOptions);

		$elm.parentNode.insertBefore($dropDown, $elm.nextSibling); // insert after

		// events

		$elm.addEventListener("click", inputClicked);
		$dropDownFilter.addEventListener("input", appendSelectOptions);
		window.addEventListener("click", clickOutsideEvent);
		setSelectOptions(selectOptions);
	};

	init();

	return { openDropDown, closeDropDown, setSelectOptions, setValue, setValues, destroy };
};
