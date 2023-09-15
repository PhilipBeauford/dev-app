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

            // Update buttons status step, stuff
            if(filteredArray.length == 1) {
                if(filteredArray[0].merchandise.subtitle == '$1') {
                    disclosureView.children[0].children[0].children[0].children[0].updateProps({kind: 'primary'})
                    disclosureView.children[0].children[0].children[0].children[1].updateProps({kind: 'secondary'})
                    disclosureView.children[0].children[0].children[0].children[2].updateProps({kind: 'secondary'})
                } else if(filteredArray[0].merchandise.subtitle == '$5') {
                    disclosureView.children[0].children[0].children[0].children[0].updateProps({kind: 'secondary'})
                    disclosureView.children[0].children[0].children[0].children[1].updateProps({kind: 'primary'})
                    disclosureView.children[0].children[0].children[0].children[2].updateProps({kind: 'secondary'})
                } else if(filteredArray[0].merchandise.subtitle == '$10') {
                    disclosureView.children[0].children[0].children[0].children[0].updateProps({kind: 'secondary'})
                    disclosureView.children[0].children[0].children[0].children[1].updateProps({kind: 'secondary'})
                    disclosureView.children[0].children[0].children[0].children[2].updateProps({kind: 'primary'})
                }
            }
        }
    });

    async function updateDropValue(key) {
        try {
          const storedValue = storage.read(key);
          const value = await storedValue;

          donationWidget.updateProps({open: value});

          return value; // Output: "false"
        } catch (error) {
          console.error(error);
        }
    }

    updateDropValue('dropValue');


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

                            return;

                        } else if(donationWidget.props.open == 'one') {
                            disclosureView.children[0].children[0].children[0].children[0].updateProps({kind: 'secondary'})
                            disclosureView.children[0].children[0].children[0].children[1].updateProps({kind: 'secondary'})
                            disclosureView.children[0].children[0].children[0].children[2].updateProps({kind: 'secondary'})

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
                                const result = await applyCartLinesChange({
                                    type: "removeCartLine",
                                    id: donation.id, // Needs reliable line item id number
                                    quantity: donation.quantity,
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

                                    root.createComponent(Text, {size:'base'}, "Support Carry On’s mission to teach resilience skills to youth through action sports and outdoor recreation."),
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
                            kind: 'secondary',
                            accessibilityRole: 'submit',
                            id: 'Button1',
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

                                if(filteredArray.length == 0 ) {
                                    // Apply the cart lines change
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
                                } else {

                                    if(filteredArray[0].merchandise.subtitle == '$1' ) {
                                        return
                                    } else {
                                        // Apply the cart lines change
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
                                    }
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

                                if(filteredArray.length == 0){
                                    // Apply the cart lines change
                                    const result = await applyCartLinesChange({
                                        type: "addCartLine",
                                        merchandiseId: 'gid://shopify/ProductVariant/46322811961651',
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
                                } else {

                                    if(filteredArray[0].merchandise.subtitle == '$5' ) {
                                        return
                                    } else {
                                        // Apply the cart lines change
                                        const result = await applyCartLinesChange({
                                            type: "addCartLine",
                                            merchandiseId: 'gid://shopify/ProductVariant/46322811961651',
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
                                
                                if(filteredArray.length == 0) {
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
                                } else {
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
                            }
                        }, '$10'),
                    ],
                ),

                root.createComponent(Button, {
                    kind: 'secondary',
                    id: 'RemoveDonation',
                    onPress: async () => {
                        
                        disclosureView.children[0].children[0].children[0].children[0].updateProps({kind: 'secondary'})
                        disclosureView.children[0].children[0].children[0].children[1].updateProps({kind: 'secondary'})
                        disclosureView.children[0].children[0].children[0].children[2].updateProps({kind: 'secondary'})
                        
                        
                        if(donationWidget.props.open == 'one') {
                            
                            donationWidget.updateProps({open: 'false'});

                            storage.delete('dropValue')
                            let removalArray = [];

                            // Grab lines objects only if title matches
                            lines.current.forEach(lineObj => {
                                if(lineObj.merchandise.title == 'Carry On Foundation Donation') {
                                    removalArray.push(lineObj);
                                }
                            })

                            //Remove added donations/cart lines
                            removalArray.forEach(async donation => {
                                const result = await applyCartLinesChange({
                                    type: "removeCartLine",
                                    id: donation.id, // Needs reliable line item id number
                                    quantity: donation.quantity,
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
                            })
                        }
                    }
                }, 'Remove Donation'),

                root.createComponent(
                    Text,
                    {
                        size: 'base'
                    },
                    'Thank you for your contribution, every dollar counts! Carry On is a 501(C)(3) Nonprofit. EIN: 87-2350234'
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
                updateDropValue('dropValue')

            } else {
                storage.write('dropValue', 'false');
                updateDropValue('dropValue')
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