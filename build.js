({
    "baseUrl": "./src/js/",
    "name": "config",
    "isBuild": true,
    "paths": {
      "react": "../../bower_components/react/react-with-addons",
      "JSXTransformer": "../../bower_components/jsx-requirejs-plugin/js/JSXTransformer",
      "jsx": "../../bower_components/jsx-requirejs-plugin/js/jsx",
      "backbone": "../../bower_components/backbone/backbone",
      "underscore": "../../bower_components/underscore/underscore",
      "jquery": "../../bower_components/jquery/dist/jquery",
      "text": "../../bower_components/requirejs-text/text",
      "dispatcher": "../../bower_components/PG-Flux/src/dispatcher",
      "invariant": "../../bower_components/PG-Flux/src/invariant",
      "ViewManager": "../jsx/ViewManager",
      "env": "../json/env"
    },
    "shims": {
      "backbone": {
        "deps": ["underscore", "jquery"],
        "exports": "Backbone"
      },
      "underscore": {
        "exports": "_"
      }
    },

    "stubModules": ["jsx"],
    "out": "./build/app.js",
    "jsx": {
      "fileExtension": '.jsx'
    },
  })
