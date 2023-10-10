import { extension, Banner } from "@shopify/ui-extensions/checkout";

// Set up the entry point for the extension
export default extension(
  "purchase.checkout.block.render",
  (root, { settings }) => {

    // Use the merchant-defined settings to retrieve the extension's content
    // Set the content of the banner
    const { status, collapsible, description } = settings.current;
	
	console.log('current settings', settings);

    // Set a default status for the banner if a merchant didn't configure the banner in the checkout editor
    const title = settings.current.title ?? "Custom Banner";
	
	console.log('current title', title );


    // Render the banner
    const banner = root.createComponent(
      Banner,
      {
        title,
        status,
        collapsible,
      }[description]
    );

    // When the merchant updates the banner title in the checkout editor, re-render the banner
    settings.subscribe((newSettings) => {
      banner.updateProps({
        title: newSettings.title ?? "Custom Banner",
        status: newSettings.status,
        collapsible: newSettings.collapsible,
      });
	  
	  console.log('realtime updating', newSettings);

    });

    root.appendChild(banner);
  }
);