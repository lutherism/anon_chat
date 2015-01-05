require.config({
    baseUrl: "http://localhost:8000/src/js",
    paths: {
      "react": "http://localhost:8000/bower_components/react/react-with-addons",
      "backbone": "http://localhost:8000/bower_components/backbone/backbone",
      "underscore": "http://localhost:8000/bower_components/underscore/underscore",
      "env": "../json/env",
      "flux": "http://localhost:8000/bower_components/flux/dist/Flux",
      "jquery": "http://localhost:8000/bower_components/jquery/dist/jquery",
      "markdown": "http://localhost:8000/bower_components/markdown-js/dist/markdown"
    },
    jsx: {
      fileExtension: '.jsx'
    },
    shims: {
      'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      'underscore': {
        exports: '_'
      }
    },
  });

define(['backbone', 'main', 'react', 'views/ViewManager', 'pathStore',
  'collections/Comments', 'collections/Threads', 'stores'], function(
  Backbone, AppRouter, React, ViewManager, PathStore, Comments, Threads, stores
  ) {
  stores.set('pathStore', new PathStore());
  stores.set('commentStore', new Comments());
  stores.set('threadStore', new Threads());
  var myApp = new AppRouter();
  React.render(
    React.createElement(ViewManager, null),
    document.querySelector('body')
  );
  Backbone.history.start({pushState: true});
});
