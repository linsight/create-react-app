# @linsight/react-scripts

Customised react-scripts to support mutiple entry points.

## Usage

1. Update your CRA to use this version of react-scripts

  `create-react-app your-app --scripts-version @linsight/react-scripts`

2. Create a `.env` to your project root if you don't have one. Add to the `.env` file your entry points. Example:

	```
	ENTRY_POINT_INDEX="index"
	ENTRY_POINT_ADMIN="admin"
	```

3. If your new entry point needs a HTML file (HtmlWebpackPlugin), you can simply add a HTML file named after the entry point in the public directory. e.g. `admin.html`

## Note

1. The default `index` entry point will be working as normal if no custom entry points are defined in the `.env` file.
2. However, if custom entry points are defined in the `.env` file, ONLY custom entry points will be used. This means you need to add `ENTRY_POINT_INDEX="index"` to the `.env` file if you want to keep the default `index` entry point. 


<br>

This package includes scripts and configuration used by [Create React App](https://github.com/facebook/create-react-app).<br>
Please refer to its documentation:

- [Getting Started](https://facebook.github.io/create-react-app/docs/getting-started) – How to create a new app.
- [User Guide](https://facebook.github.io/create-react-app/) – How to develop apps bootstrapped with Create React App.
