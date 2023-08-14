// import {
// 	extension,
// 	BlockStack,
// 	View,
// 	InlineLayout,
// 	Image,
// 	Text,
// 	Form,
// 	Button,
// 	Disclosure,
// 	Checkbox,
// 	Select,
// 	Banner,
// } from '@shopify/ui-extensions/checkout';


// export default extension('Checkout::Dynamic::Render', (root, { lines, applyCartLinesChange, query, i18n }) => {

// 	// Subscribe to changes to cart lines. When donations added, remove old donations
// 	lines.subscribe(async(value) => {
// 		if(value) {
// 			let filteredArray = [];

// 			// Grab line objects only if titles match donation
// 			lines.current.forEach(lineObj => {
// 				if(lineObj.merchandise.title == 'Carry On Foundation Donation') {
// 					filteredArray.push(lineObj);
// 				}
// 			})

// 			if(filteredArray[0].quantity > 2 && selector.props.value != filteredArray[0].quantity && selector.props.value != 0) {

// 				// Remove added donations/cart lines
// 				const result2 = await applyCartLinesChange({
// 					type: "removeCartLine",
// 					id: filteredArray[0].id, // Needs reliable line item id number
// 					quantity: filteredArray[0].quantity - selector.props.value,
// 				});
// 			}
// 		}
// 	});

// 	const checkDrop = root.createComponent(
// 		InlineLayout,
// 		{
// 			blockAlignment: 'center',
// 			spacing: 'base',
// 			columns: ['auto', 'fill'],
// 			padding: 'loose',
// 			border: ['none', 'none', 'none', 'none'],
// 		},
// 		[
// 			root.createComponent(BlockStack, {},
// 			[

// 				root.createComponent(Image, {
// 					source: "https://cdn.shopify.com/s/files/1/1030/4291/files/logo-donations.svg?v=1690579195",
// 				}),

// 				root.createComponent(InlineLayout, 
// 					{
// 						blockAlignment: 'center',
// 						spacing: 'base',
// 						columns: ['auto', 'fill'],
// 						padding: 'none',
// 						border: ['none', 'none', 'none', 'none'],
// 					},
// 					[

// 						root.createComponent(Checkbox, {
// 							toggles: "one",
// 							checked: "",
// 							onChange: async () => {
							
// 							// If checkbox is checked, add a bottom border & update props
// 							if( checkDrop.children[0].children[1].children[0].props.checked == "") {
// 								checkDrop.updateProps({ border: ['none', 'none', 'base', 'none']});
// 								checkDrop.children[0].children[1].children[0].updateProps( {checked: "false"});

// 								// Auto add to cart $2 donation
// 								const result = await applyCartLinesChange({
// 									type: "addCartLine",
// 									merchandiseId: 'gid://shopify/ProductVariant/45393245176115',
// 									quantity: 2,
// 								});

// 								if (result.type === "error") {
// 								// An error occurred adding the cart line
// 								// Verify that you're using a valid product variant ID
// 								// For example, 'gid://shopify/ProductVariant/123'
// 								console.error('error', result.message);
// 								const errorComponent = root.createComponent(
// 									Banner,
// 									{ status: "critical" },
// 									["There was an issue adding this product. Please try again."]
// 								);
// 								// Render an error Banner as a child of the top-level app component for three seconds, then remove it
// 								const topLevelComponent = root.children[0];
// 								topLevelComponent.appendChild(errorComponent);
// 								setTimeout(
// 									() => topLevelComponent.removeChild(errorComponent),
// 									3000
// 								);
// 								}
// 							} else if(checkDrop.children[0].children[1].children[0].props.checked == 'false') {
// 								checkDrop.updateProps({ border: ['none', 'none', 'none', 'none']});
// 								checkDrop.children[0].children[1].children[0].updateProps( {checked: ""})

// 								let filteredArrayOne = [];

// 								// Grab lines objects only if title matches
// 								lines.current.forEach(lineObj => {
// 									if(lineObj.merchandise.title == 'Carry On Foundation Donation') {
// 										filteredArrayOne.push(lineObj);
// 									}
// 								})

// 								//Remove added donations/cart lines
// 								filteredArrayOne.forEach(async donation => {
// 									const removeLines = await applyCartLinesChange({
// 										type: "removeCartLine",
// 										id: donation.id, // Needs reliable line item id number
// 										quantity: donation.quantity,
// 									});
// 								})
// 							}
// 							}
// 						}),
// 						'Show your support for the Carry On Foundation.',
// 					]
// 				),
// 			])
// 		],
// 	);

// 	const selector = 	root.createComponent(Select, {
// 		label: 'Donation amount',
// 		value: 0,
// 		id: 'donate-select',
// 		options: 
// 		[
// 			{
// 				value: 1,
// 				label: '$1',
// 			},
// 			{
// 				value: 2,
// 				label: '$2',
// 			},
// 			{
// 				value: 3,
// 				label: '$3',
// 			},
// 			{
// 				value: 4,
// 				label: '$4',
// 			},
// 			{
// 				value: 5,
// 				label: '$5',
// 			},
// 			{
// 				value: 6,
// 				label: '$6',
// 			},
// 			{
// 				value: 7,
// 				label: '$7',
// 			},
// 			{
// 				value: 8,
// 				label: '$8',
// 			},
// 			{
// 				value: 9,
// 				label: '$9',
// 			},
// 			{
// 				value: 10,
// 				label: '$10',
// 			},
// 		],
// 		onChange: (value) => { selector.updateProps({value: parseInt(value)}); }
// 	})

// 	// Form inner
// 	const disclosureView = root.createComponent(
// 	View,
// 	{
// 		id: "one",
// 		padding: ['base', 'base', 'base', 'base'],
// 	},
// 	[
// 		root.createComponent(
// 		Form,
// 		{
// 			onSubmit: () => console.log('onSubmit event'),
// 		},
// 		[

// 			root.createComponent(BlockStack, {}, [
// 				root.createComponent(
// 					InlineLayout,
// 					{
// 					columns: ['fill', 'fill'],
// 					spacing: 'base',
// 					},
// 					[
// 						root.createComponent(Button, {
// 							kind: 'primary',
// 							id: 'Button2',
// 							// appearance: Style.when({hover: true}, 'accent'),
// 							onPress: () => {
// 								selector.updateProps({ value: 2 });
// 								disclosureView.children[0].children[0].children[0].children[0].updateProps({kind: 'primary'})
// 								disclosureView.children[0].children[0].children[0].children[1].updateProps({kind: 'secondary'})
// 								disclosureView.children[0].children[0].children[0].children[2].updateProps({kind: 'secondary'})
// 							}
// 						}, '$2'),

// 						root.createComponent(Button, {
// 							kind: 'secondary',
// 							id: 'Button5',
// 							onPress: () => {
// 								selector.updateProps({ value: 5 });
// 								disclosureView.children[0].children[0].children[0].children[0].updateProps({kind: 'secondary'})
// 								disclosureView.children[0].children[0].children[0].children[1].updateProps({kind: 'primary'})
// 								disclosureView.children[0].children[0].children[0].children[2].updateProps({kind: 'secondary'})
// 							}
// 						}, '$5'),

// 						root.createComponent(Button, {
// 							kind: 'secondary',
// 							id: 'Button10',
// 							onPress: () => {
// 								selector.updateProps({ value: 10 });
// 								disclosureView.children[0].children[0].children[0].children[0].updateProps({kind: 'secondary'})
// 								disclosureView.children[0].children[0].children[0].children[1].updateProps({kind: 'secondary'})
// 								disclosureView.children[0].children[0].children[0].children[2].updateProps({kind: 'primary'})
// 							}
// 						}, '$10'),
// 					],
// 				),

// 				root.createComponent(
// 					InlineLayout,
// 					{
// 					columns: ['fill', 'auto'],
// 					spacing: 'base',
// 					},
// 					[
// 						selector,

// 						root.createComponent(View, {}, [
// 							root.createComponent(
// 							Button,
// 							{
// 								accessibilityRole: 'submit',
// 								kind: 'primary',
// 								onPress: async () => {

// 										// Apply the cart lines change
// 										const result = await applyCartLinesChange({
// 											type: "addCartLine",
// 											merchandiseId: 'gid://shopify/ProductVariant/45393245176115',
// 											quantity: parseInt(selector.props.value),
// 										});

// 										if (result.type === "error") {
// 											// An error occurred adding the cart line
// 											// Verify that you're using a valid product variant ID
// 											// For example, 'gid://shopify/ProductVariant/123'
// 											console.error('error', result.message);
// 											const errorComponent = root.createComponent(
// 												Banner,
// 												{ status: "critical" },
// 												["There was an issue adding this product. Please try again."]
// 											);
// 											// Render an error Banner as a child of the top-level app component for three seconds, then remove it
// 											const topLevelComponent = root.children[0];
// 											topLevelComponent.appendChild(errorComponent);
// 											setTimeout(
// 												() => topLevelComponent.removeChild(errorComponent),
// 												3000
// 											);
// 										}
// 								},
// 							},
// 							'Update',
// 							),
// 						]),
// 					],
// 				),

// 				root.createComponent(
// 					Text,
// 					{
// 						size: 'base'
// 					},
// 					'Our Mission: Teach youth resilience skills and promote mental health through action sports and outdoor recreation.'
// 				)
// 			]),
// 		],
// 		),
// 	],
// 	);

// 	// Disclosure is a drop-down container
// 	// Checkbox container & disclosureView are rendered on toggle
// 	const donationWidget = root.createComponent(
// 	Disclosure,
// 	{
// 		open: 'false',
// 		onToggle: (open) => {
// 			if (donationWidget.props.open == "false") {
// 				donationWidget.updateProps({open: 'one'})
// 			} else {
// 				donationWidget.updateProps({open: 'false'})
// 			}
// 		}
// 	},
// 	[checkDrop, disclosureView],
// 	);


// 	// Main app that contains the donation widget
// 	const donationsContainer = root.createComponent(
// 	View,
// 	{
// 		maxInlineSize: 'fill',
// 		cornerRadius: 'large',
// 		border: 'base',
// 	},
// 	[
// 		root.createComponent(
// 		BlockStack,
// 		{
// 			spacing: 'none',
// 		},
// 		[
// 			donationWidget,
// 		],
// 		),
// 	],
// 	);

// 	root.appendChild(donationsContainer);
// });


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
    Checkbox,
    Select,
    Banner,
    Pressable,
	Icon,
} from '@shopify/ui-extensions/checkout';


export default extension('Checkout::Dynamic::Render', (root, { lines, applyCartLinesChange, query, i18n }) => {

    // Subscribe to changes to cart lines. When donations added, remove old donations
    lines.subscribe(async(value) => {
        
		if(value) {
			
			console.log('lines running', lines);
            let filteredArray = [];


            // Grab line objects only if titles match donation
            lines.current.forEach(lineObj => {
                if(lineObj.merchandise.title == 'Carry On Foundation Donation') {
                    filteredArray.push(lineObj);
                }
            })
			
			console.log('filteredARray', filteredArray[0]);
			console.log('selector.props.value', selector.props.value);


            if(filteredArray[0].quantity > 2 && selector.props.value != filteredArray[0].quantity && selector.props.value != 0) {


                // Remove added donations/cart lines
                const result2 = await applyCartLinesChange({
                    type: "removeCartLine",
                    id: filteredArray[0].id, // Needs reliable line item id number
                    quantity: filteredArray[0].quantity - selector.props.value,
                });
				
				console.log('res2', result2);
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

						console.log('pressable', Pressable);
						console.log('checkdrop', checkDrop);
						console.log('disclosure', donationWidget);


						
						// console.log('pressdrop checkbox status', checkDrop.children[0].children[0].children[1].children[0].props);

                       
                            // If checkbox is checked, add a bottom border & update props
                            if( checkDrop.children[0].children[0].children[1].children[0].props.checked == '') {
								
								console.log('yes the if statement is firing')
								
                                checkDrop.updateProps({ border: ['none', 'none', 'base', 'none']});
                                checkDrop.children[0].children[0].children[1].children[0].updateProps( {checked: "false"});


                                // Auto add to cart $2 donation
                                const result = await applyCartLinesChange({
                                    type: "addCartLine",
                                    merchandiseId: 'gid://shopify/ProductVariant/45393245176115',
                                    quantity: 2,
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
                            } else if(checkDrop.children[0].children[0].children[1].children[0].props.checked == 'false') {
                                checkDrop.updateProps({ border: ['none', 'none', 'none', 'none']});
                                checkDrop.children[0].children[0].children[1].children[0].updateProps( {checked: ""})


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
   
    console.log('checkDrop', checkDrop.children[0].children[0].children[1].children[0].props);


    const selector =    root.createComponent(Select, {
        label: 'Donation amount',
        value: 2,
        id: 'donate-select',
        options:
        [
            {
                value: 1,
                label: '$1',
            },
            {
                value: 2,
                label: '$2',
            },
            {
                value: 3,
                label: '$3',
            },
            {
                value: 4,
                label: '$4',
            },
            {
                value: 5,
                label: '$5',
            },
            {
                value: 6,
                label: '$6',
            },
            {
                value: 7,
                label: '$7',
            },
            {
                value: 8,
                label: '$8',
            },
            {
                value: 9,
                label: '$9',
            },
            {
                value: 10,
                label: '$10',
            },
        ],
        onChange: (value) => { selector.updateProps({value: parseInt(value)}); }
    })


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
            onSubmit: () => console.log('onSubmit event'),
        },
        [


            root.createComponent(BlockStack, {}, [
                root.createComponent(
                    InlineLayout,
                    {
                    columns: ['fill', 'fill'],
                    spacing: 'none',
                    },
                    [
                        root.createComponent(Button, {
                            kind: 'primary',
                            id: 'Button2',
                            // appearance: Style.when({hover: true}, 'accent'),
                            onPress: () => {
                                selector.updateProps({ value: 2 });
                                disclosureView.children[0].children[0].children[0].children[0].updateProps({kind: 'primary'})
                                disclosureView.children[0].children[0].children[0].children[1].updateProps({kind: 'secondary'})
                                disclosureView.children[0].children[0].children[0].children[2].updateProps({kind: 'secondary'})
                            }
                        }, '$2'),


                        root.createComponent(Button, {
                            kind: 'secondary',
                            id: 'Button5',
                            onPress: () => {
                                selector.updateProps({ value: 5 });
                                disclosureView.children[0].children[0].children[0].children[0].updateProps({kind: 'secondary'})
                                disclosureView.children[0].children[0].children[0].children[1].updateProps({kind: 'primary'})
                                disclosureView.children[0].children[0].children[0].children[2].updateProps({kind: 'secondary'})
                            }
                        }, '$5'),


                        root.createComponent(Button, {
                            kind: 'secondary',
                            id: 'Button10',
                            onPress: () => {
                                selector.updateProps({ value: 10 });
                                disclosureView.children[0].children[0].children[0].children[0].updateProps({kind: 'secondary'})
                                disclosureView.children[0].children[0].children[0].children[1].updateProps({kind: 'secondary'})
                                disclosureView.children[0].children[0].children[0].children[2].updateProps({kind: 'primary'})
                            }
                        }, '$10'),
                    ],
                ),


                root.createComponent(
                    InlineLayout,
                    {
                    columns: ['fill', 'auto'],
                    spacing: 'base',
                    },
                    [
                        selector,


                        root.createComponent(View, {}, [
                            root.createComponent(
                            Button,
                            {
                                accessibilityRole: 'submit',
                                kind: 'primary',
                                onPress: async () => {


                                        // Apply the cart lines change
                                        const result = await applyCartLinesChange({
                                            type: "addCartLine",
                                            merchandiseId: 'gid://shopify/ProductVariant/45393245176115',
                                            quantity: parseInt(selector.props.value),
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
                                },
                            },
                            'Update',
                            ),
                        ]),
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
    // Checkbox container & disclosureView are rendered on toggle
    const donationWidget = root.createComponent(
    Disclosure,
    {
        open: 'false',
        onToggle: (open) => {
            if (donationWidget.props.open == "false") {
                donationWidget.updateProps({open: 'one'})
            } else {
                donationWidget.updateProps({open: 'false'})
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