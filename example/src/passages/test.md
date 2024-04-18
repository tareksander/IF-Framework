<meta>
{
    "comment1": "Markdown files get converted to Svelte component files, by a webpack loader.",
    "comment2": "Preceding the actual markdown can be a meta element, which gets extracted by the loader.",
    "comment3": "The content of the meta tag is a JSON object. The tags key (if used) has to be an array of strings.",
    "comment4": "Other than that, the contents are user-defined (like these comments) and can be accessed as passage metadata.",
    "tags": [] 
}
</meta>
# Example Story


It was a *dark* and **stormy** night...
<!-- iff-link is a custom element, made for use in these markdown files. -->
<iff-link passage="test2">Continue</iff-link>


<!-- This shows how escapes in markdown here work, the rendered output shows what you need as input. -->
If you need pointy brackets, use \\< \\> to prevent confusion with HTML elements.
For a backslash before a punctuation character (like the brackets) use \\\\.

