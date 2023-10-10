import { 
	extension, 
	Banner,
	Text,
	InlineLayout,
	BlockStack,
	Image,
	Button,
	SkeletonImage,
	SkeletonText,
} from "@shopify/ui-extensions/checkout";

export default extension("purchase.checkout.block.render", (root, { lines, applyCartLinesChange, query, settings, i18n }) => {

	// Set up the states
	let product = [];
	let loading = true;
	let appRendered = false;
	let buttonPressed = false;

	// When the merchant updates the product variant ID in the checkout editor, update that ID
	settings.subscribe((newSettings) => {

	});

	const productId = settings.current.product_id ?? "8127737168179";

	// Use the `query` API method to send graphql queries to the Storefront API
	query(
		`query getProductById($id: ID!) {
			product(id: $id) {
			title
			id
			images(first:1){
				nodes {
				url
				}
			}
			variants(first:1){
				nodes {
				id
				price {
					amount
				}
				}
			}
			}
		}`,
		{
		variables: {id: "gid://shopify/Product/" + productId}, // Needs to be product ID
		},
	)
		.then(({data}) => {
			// Set the product variants
			product = data.product;
		})
		.catch((err) => console.error(err))
		.finally(() => {
			loading = false;
			// Call the `renderApp()` helper to filter, data-bind, and render the products on offer
			renderApp();
		});


	// Manually subscribe to changes to cart lines. This calls the `renderApp` helper function when the cart lines have changed
	lines.subscribe(() => renderApp());


	// Show a loading UI if you're waiting for product variant data
	// Use Skeleton components to keep placement from shifting when content loads
	const loadingState = root.createComponent(
		BlockStack,
		{ spacing: "loose" },
		[
		root.createComponent(BlockStack, { spacing: "loose" }, [
			root.createComponent(
			InlineLayout,
			{
				spacing: "base",
				columns: [64, "fill", 75],
				blockAlignment: "center",
				cornerRadius: "large",
				padding: "base"
			},
			[
				root.createComponent(SkeletonImage, { aspectRatio: 1 }),
				root.createComponent(BlockStack, { spacing: "none" }, [
				root.createComponent(SkeletonText, { inlineSize: "large" }),
				root.createComponent(SkeletonText, { inlineSize: "small" }),
				]),
				root.createComponent(
				Button,
					{ kind: "secondary", disabled: true },
					[root.createText("Add")]
				),
			]
			),
		]),
		]
	);


	// Render the loading state
	if (loading) {
		root.appendChild(loadingState);
	}


	// Initialize the components to render for the product offer
	// You'll need to manually bind data to them, this happens within the `renderApp` helper
	const imageComponent = root.createComponent(Image, {
		border: "base",
		borderWidth: "base",
		borderRadius: 'loose',
		aspectRatio: 1,
		source: "",
	});
	const titleMarkup = root.createText("");
	const priceMarkup = root.createText("");


	// Defines the "Add" Button component used in the app
	const addButtonComponent = root.createComponent(
		Button,
		//@ts-ignore
		{
		kind: "primary",
		loading: false,
		onPress: async () => {
			addButtonComponent.updateProps({ loading: true });
			buttonPressed = true;

			// Apply the cart lines change
			const result = await applyCartLinesChange({
				type: "addCartLine",
				merchandiseId: product.variants.nodes[0].id ?? "gid://shopify/ProductVariant/44462991606067", // Needs to be product variant ID
				quantity: 1,
			});

			addButtonComponent.updateProps({ loading: false });

			if (result.type === "error") {
				// An error occurred adding the cart line
				// Verify that you're using a valid product variant ID
				// For example, 'gid://shopify/ProductVariant/123'
				console.error(result.message);
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
		["Add"]
	);


	// Defines the main app responsible for rendering a product offer
	const app = root.createComponent(BlockStack, { spacing: "loose" }, [
		root.createComponent(BlockStack, { spacing: "loose" }, [
		root.createComponent(
			InlineLayout,
			{
				spacing: "base",
				// Use the `columns` property to set the width of the columns
				// Image: column should be 64px wide
				// BlockStack: column, which contains the title and price, should "fill" all available space
				// Button: column should "auto" size based on the intrinsic width of the elements
				columns: [64, "fill", 75],
				blockAlignment: "center",
				border: "base",
				cornerRadius: "large",
				padding: "base",
			},
			[
			imageComponent,
			root.createComponent(BlockStack, { spacing: "none" }, [
				root.createComponent(
				Text,
					{ size: "small", emphasis: "bold" },
					[titleMarkup]
				),
				root.createComponent(Text, { size:"small", appearance: "subdued" }, [
					priceMarkup,
				]),
			]),
			addButtonComponent,
			]
		),
		]),
	]);

	// This function will be called once the product variants are initially loaded or the cart lines have changed
	function renderApp() {
		if (loading) {
			// If still loading, then do nothing
			return;
		}

		// If loading is complete, and upsell has been added, remove loading state and app
		if (!loading && buttonPressed === true ) {
			root.removeChild(loadingState);
			root.removeChild(app);
			return;
		} else {
			root.appendChild(app);
		}

		// Localize the currency for international merchants and customers
		const renderPrice = i18n.formatCurrency(product.variants.nodes[0].price.amount);
		const imageUrl = product.images.nodes[0].url;
		const title = product.title;

		// Bind data to the components
		imageComponent.updateProps({ source: imageUrl });
		titleMarkup.updateText(title);
		addButtonComponent.updateProps({
		accessibilityLabel: `Add ${title} to cart`,
		});
		priceMarkup.updateText(renderPrice);

		// Prevent against unnecessary re-renders
		if (!appRendered) {
			root.removeChild(loadingState);// Remove the loading state
			root.appendChild(app);// Render the product offer app with the product data
			appRendered = true;
		}
	}
});