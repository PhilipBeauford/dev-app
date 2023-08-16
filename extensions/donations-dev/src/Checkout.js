import {
    extension,
    BlockStack,
    View,
    InlineLayout,
    Image,
    Text,
    Form,
    Button,
    Disclosure,
    Banner,
    Pressable,
	Icon,
} from '@shopify/ui-extensions/checkout';


export default extension('Checkout::Dynamic::Render', (root, { lines, applyCartLinesChange, storage }) => {

	async function getValueFromStoredValue() {
		try {
		  const storedValue = storage.read('dropValue');
		  const value = await storedValue;
		  return value; // Return the resolved value
		} catch (error) {
		  throw error; // Re-throw the error if the Promise is rejected
		}
	}

	const getValue = async function someAsyncFunction() {
		try {
		  const value = await getValueFromStoredValue();
		  donationWidget.updateProps({open: value});

		  return value; // Output: "false"
		} catch (error) {
		  console.error(error);
		}
	}

	getValue()

    // Subscribe to changes to cart lines. When donations added, remove old donations
    lines.subscribe(async(value) => {

		if(value) {
            let filteredArray = [];

            // Grab line objects only if titles match donation
            lines.current.forEach(lineObj => {
                if(lineObj.merchandise.title == 'Carry On Foundation Donation') {
                    filteredArray.push(lineObj);
                }
            })

            if(filteredArray.length > 1 && filteredArray[0] != filteredArray.lastItem) {

					// Remove added donations/cart lines
					const result2 = await applyCartLinesChange({
						type: "removeCartLine",
						id: filteredArray[0].id, // Needs reliable line item id number
						quantity: 1,
					});
            } 
		}
    });


    const checkDrop = root.createComponent(
        InlineLayout,
        {
            blockAlignment: 'center',
            spacing: 'base',
            columns: [],
            padding: 'loose',
            border: ['none', 'none', 'none', 'none'],
        },
        [

            root.createComponent(Pressable,
                {
                    toggles: 'one',
                    onPress: async () => {

						// If dropdown is not open, activate dropdown & auto-add $1 to cart
						if( donationWidget.props.open == "false" || donationWidget.props.open == null ) {

							// Auto add to cart $1 donation
							const result = await applyCartLinesChange({
								type: "addCartLine",
								merchandiseId: 'gid://shopify/ProductVariant/46322811928883',
								quantity: 1,
							});

							if (result.type === "error") {
							// An error occurred adding the cart line
							// Verify that you're using a valid product variant ID
							// For example, 'gid://shopify/ProductVariant/123'
							console.error('error', result.message);
							const errorComponent = root.createComponent(
								Banner,
								{ status: "critical" },
								["There was an issue adding this product. Please try again."]
							);
							// Render an error Banner as a child of the top-level app component for three seconds, then remove it
							const topLevelComponent = root.children[0];
							topLevelComponent.appendChild(errorComponent);
							setTimeout(
								() => topLevelComponent.removeChild(errorComponent),
								3000
							);
							}

						} else if(donationWidget.props.open == 'one') {

							storage.delete('dropValue')
							let filteredArrayOne = [];

							// Grab lines objects only if title matches
							lines.current.forEach(lineObj => {
								if(lineObj.merchandise.title == 'Carry On Foundation Donation') {
									filteredArrayOne.push(lineObj);
								}
							})

							//Remove added donations/cart lines
							filteredArrayOne.forEach(async donation => {
								const removeLines = await applyCartLinesChange({
									type: "removeCartLine",
									id: donation.id, // Needs reliable line item id number
									quantity: donation.quantity,
								});

								if (removeLines.type === "error") {
									// An error occurred adding the cart line
									// Verify that you're using a valid product variant ID
									// For example, 'gid://shopify/ProductVariant/123'
									console.error('error', result.message);
									const errorComponent = root.createComponent(
										Banner,
										{ status: "critical" },
										["There was an issue adding this product. Please try again."]
									);
									// Render an error Banner as a child of the top-level app component for three seconds, then remove it
									const topLevelComponent = root.children[0];
									topLevelComponent.appendChild(errorComponent);
									setTimeout(
										() => topLevelComponent.removeChild(errorComponent),
										3000
									);
									}
							})
						}
                    }
                },
                [
                    root.createComponent(BlockStack, {},
                        [
                            root.createComponent(Image, {
                                source: "https://cdn.shopify.com/s/files/1/0728/3494/1235/files/logo_3.svg?v=1690579006",
                            }),

                            root.createComponent(InlineLayout,
                                {
                                    blockAlignment: 'center',
                                    spacing: 'base',
                                    columns: ['fill', 'auto'],
                                    padding: 'none',
                                    border: ['none', 'none', 'none', 'none'],
                                },
                                [

                                    root.createComponent(Text, {size:'base'}, 'Show your support for the Carry On Foundation'),
									root.createComponent(Icon, {source: 'chevronDown', size: 'small'}),

                                ]
                            ),
                        ])
                ]
            )
        ],
    );


    // Form inner
    const disclosureView = root.createComponent(
    View,
    {
        id: "one",
        padding: ['base', 'base', 'base', 'base'],
    },
    [
        root.createComponent(
        Form,
        {
            onSubmit: () => {},
        },
        [

            root.createComponent(BlockStack, {}, [
                root.createComponent(
                    InlineLayout,
                    {
                    columns: ['fill', 'fill'],
                    spacing: 'base',
                    },
                    [
                        root.createComponent(Button, {
                            kind: 'primary',
							accessibilityRole: 'submit',

                            id: 'Button1',
                            // appearance: Style.when({hover: true}, 'accent'),
                            onPress: async () => {
                                disclosureView.children[0].children[0].children[0].children[0].updateProps({kind: 'primary'})
                                disclosureView.children[0].children[0].children[0].children[1].updateProps({kind: 'secondary'})
                                disclosureView.children[0].children[0].children[0].children[2].updateProps({kind: 'secondary'})

								let filteredArray = [];

								// Grab line objects only if titles match donation
								lines.current.forEach(lineObj => {
									if(lineObj.merchandise.title == 'Carry On Foundation Donation') {
										filteredArray.push(lineObj);
									}
								})

								if(filteredArray[0].merchandise.subtitle == '$1' ) {
									return
								} else {

									// Apply the cart lines change
									const result = await applyCartLinesChange({
										type: "addCartLine",
										merchandiseId: 'gid://shopify/ProductVariant/46322811928883',
										quantity: 1,
									});
								}
                            }
                        }, '$1'),

                        root.createComponent(Button, {
                            kind: 'secondary',
							accessibilityRole: 'submit',

                            id: 'Button5',
                            onPress: async () => {
                                disclosureView.children[0].children[0].children[0].children[0].updateProps({kind: 'secondary'})
                                disclosureView.children[0].children[0].children[0].children[1].updateProps({kind: 'primary'})
                                disclosureView.children[0].children[0].children[0].children[2].updateProps({kind: 'secondary'})

								let filteredArray = [];

								// Grab line objects only if titles match donation
								lines.current.forEach(lineObj => {
									if(lineObj.merchandise.title == 'Carry On Foundation Donation') {
										filteredArray.push(lineObj);
									}
								})

								if(filteredArray[0].merchandise.subtitle == '$5' ) {
									return
								} else {

									// Apply the cart lines change
									const result = await applyCartLinesChange({
										type: "addCartLine",
										merchandiseId: 'gid://shopify/ProductVariant/46322811961651',
										quantity: 1,
									});
								}
                            }
                        }, '$5'),

                        root.createComponent(Button, {
                            kind: 'secondary',
							accessibilityRole: 'submit',

                            id: 'Button10',
                            onPress: async () => {
                                disclosureView.children[0].children[0].children[0].children[0].updateProps({kind: 'secondary'})
                                disclosureView.children[0].children[0].children[0].children[1].updateProps({kind: 'secondary'})
                                disclosureView.children[0].children[0].children[0].children[2].updateProps({kind: 'primary'})

								let filteredArray = [];

								// Grab line objects only if titles match donation
								lines.current.forEach(lineObj => {
									if(lineObj.merchandise.title == 'Carry On Foundation Donation') {
										filteredArray.push(lineObj);
									}
								})

								if(filteredArray[0].merchandise.subtitle == '$10' ) {
									return
								} else {

									// Apply the cart lines change
									const result = await applyCartLinesChange({
										type: "addCartLine",
										merchandiseId: 'gid://shopify/ProductVariant/46322811994419',
										quantity: 1,
									});

									if (result.type === "error") {

										// An error occurred adding the cart line
										// Verify that you're using a valid product variant ID
										// For example, 'gid://shopify/ProductVariant/123'
										console.error('error', result.message);
										const errorComponent = root.createComponent(
											Banner,
											{ status: "critical" },
											["There was an issue adding this product. Please try again."]
										);
										// Render an error Banner as a child of the top-level app component for three seconds, then remove it
										const topLevelComponent = root.children[0];
										topLevelComponent.appendChild(errorComponent);
										setTimeout(
											() => topLevelComponent.removeChild(errorComponent),
											3000
										);
									}
								}
                            }
                        }, '$10'),
                    ],
                ),

                root.createComponent(
                    Text,
                    {
                        size: 'base'
                    },
                    'Our Mission: Teach youth resilience skills and promote mental health through action sports and outdoor recreation.'
                )
            ]),
        ],
        ),
    ],
    );


    // Disclosure is a drop-down container
    // Drodown container & disclosureView are rendered on toggle
    const donationWidget = root.createComponent(
    Disclosure,
    {
        open: 'false',
        onToggle: (open) => {
            if (donationWidget.props.open == 'false' || donationWidget.props.open == null) {

				storage.write('dropValue', 'one');

				async function getValueFromStoredValue() {
					try {
					  const storedValue = storage.read('dropValue');
					  const value = await storedValue;
					  return value; // Return the resolved value
					} catch (error) {
					  throw error; // Re-throw the error if the Promise is rejected
					}
				}

				const grabValue =  async function someAsyncFunction() {
					try {
					  const value = await getValueFromStoredValue();
					  donationWidget.updateProps({open: value});

					  return value; // Output: "one"
					} catch (error) {
					  console.error(error);
					}
				}

				grabValue()

            } else {
				storage.write('dropValue', 'false');
			
				async function getValueFromStoredValue() {
					try {
					  const storedValue = storage.read('dropValue');
					  const value = await storedValue;
					  return value; // Return the resolved value
					} catch (error) {
					  throw error; // Re-throw the error if the Promise is rejected
					}
				}

				const grabbedValue =  async function someAsyncFunction() {
					try {
						const value = await getValueFromStoredValue();
						donationWidget.updateProps({open: value});

						return value; // Output: "false"
					} catch (error) {
						console.error(error);
					}
				}

				grabbedValue()
            }
        }
    },
    [checkDrop, disclosureView],
    );


    // Main app that contains the donation widget
    const donationsContainer = root.createComponent(
    View,
    {
        maxInlineSize: 'fill',
        cornerRadius: 'large',
        border: 'base',
    },
    [
        root.createComponent(
        BlockStack,
        {
            spacing: 'none',
        },
        [
            donationWidget,
        ],
        ),
    ],
    );


    root.appendChild(donationsContainer);
});