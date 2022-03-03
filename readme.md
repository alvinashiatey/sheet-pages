# Sheet-Pages

A simple cli to generate html pages from a shared google spreadsheet.

## Installation

npm install sheet-pages

Recommend : npx sheet-pages -i [spreadsheetId]

-   v 0.1.2

New ignore flag for google sheet columns and creates a stylesheet document rather than inline the css.

-   v 0.1.3

You can now add a class from the your sheetcoulm which would be appended to the element when generated.

-   v 0.1.4

You can now use the nunjucks template engine to render your sheets. Config can now be set with a config.yml files instead of flags.

-   v 0.1.5

There is an included image shortcode for downloading images and now the images are cached after downloaded.
