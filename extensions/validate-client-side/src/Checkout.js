import {
	extension,
	TextField,
  } from "@shopify/ui-extensions/checkout";


  // Set the entry point for the extension
  export default extension("purchase.checkout.contact.render-after", (root, { extension, buyerJourney }) => { 


	// Set the target age that a buyer must be to complete an order
	const ageTarget = 18;

	// Set up the app state
	const state = {
	  age: "",
	  canBlockProgress: extension.capabilities.current.includes("block_progress"),
	};

	// Set up the text component so that its props can be updated without re-rendering the whole extension
	const textField = root.createComponent(TextField, {
	  label: "Your age",
	  type: "number",
	  value: state.age,
	  onChange: setAge,
	  onInput: clearValidationErrors,
	  required: state.canBlockProgress,
	});
	
	console.log('exte', extension);


	// Merchants can toggle the `block_progress` capability behavior within the checkout editor
	extension.capabilities.subscribe((capabilities) => {
	  state.canBlockProgress = capabilities.includes("block_progress");
	  textField.updateProps({
		label: state.canBlockProgress ? "Your age" : "Your age (optional)",
		required: state.canBlockProgress,
	  });
	});

	// Use the `buyerJourney` intercept to conditionally block checkout progress
	buyerJourney.intercept(({ canBlockProgress }) => {

	  // Validate that the age of the buyer is known, and that they're old enough to complete the purchase
	  if (canBlockProgress && !isAgeSet()) {
		return {
		  behavior: "block",
		  reason: "Age is required",
		  perform: (result) => {

			// If progress can be blocked, then set a validation error on the custom field
			if (result.behavior === "block") {
			  textField.updateProps({ error: "Enter your age" });
			}
		  },
		};
	  }
	  
	  console.log('canBlock', canBlockProgress);


	  if (canBlockProgress && !isAgeValid()) {
		return {
		  behavior: "block",
		  reason: `Age is less than ${ageTarget}.`,
		  errors: [
			{
			  // Show a validation error on the page
			  message:
				"You're not legally old enough to buy some of the items in your cart.",
			},
		  ],
		};
	  }
	  return {
		behavior: "allow",
		perform: () => {

		  // Ensure any errors are hidden
		  clearValidationErrors();
		},
	  };
	});


	function setAge(value) {
	  state.age = value;
	  textField.updateProps({ value: state.age });
	  clearValidationErrors();
	}

	function isAgeSet() {
	  return state.age !== "";
	}
	
	console.log('isAGeSet', isAgeSet());

	function isAgeValid() {
	  return Number(state.age) >= ageTarget;
	}
  
	function clearValidationErrors() {
	  textField.updateProps({ error: undefined });
	}
  
	// Render the extension
	root.appendChild(textField);
})