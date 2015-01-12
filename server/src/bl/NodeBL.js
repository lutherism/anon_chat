var NodeDAO = require('../dao/NodeDAO'),
  EdgesDAO = require('../dao/EdgesDAO');

var NodeBL = {
  nodeWithEdgeTypes: function(id, callback) {
    var foundEdges = null,
        foundNode = null,
        errs = [];
      function foundBoth() {
        foundNode.edges = foundEdges;
        callback(errs, foundNode);
      };
      NodeDAO.find({_id:req.id}, function(err, models) {
        if (err) errs.push(err);
        foundNode = models[0];
        if (foundEdges) {
          foundBoth();
        }
      });
      EdgeDAO.getEdgesForNode(req.id, function(err, edges) {
        if (err) errs.push(err);
        foundEdges = edges;
        if (foundNode) {
          foundBoth();
        }
    });
  },
  /**
  * Take in a root node, edge type, max size, layer factor, and a callback,
  * build graph with max size prioritizing by weight factor * layer factor
  *
  * callback with errors and graph (callback(err, graph))
  *
  * graph spec: {
  *   root: <root node id string>
  *   <nodeId>: <node> //every node in graph is on graph keyed by id
  * }
  *
    node spec: {
      id: <node id string>,
      weight: <weight of node in graph>,
      targets: Array of nodes this node has edges towards
    }
  *
  */
  buildWeightedGraph: function(root, type, z, layerDim, callback) {
    var nodeStack = [{
        _id: root,
        weight: 1
      }],
      graph = {
        size: 0,
        root: root
      };
    (function chewStack() {
      var newNode = nodeStack.pop();
      graph.size++;
      graph[newNode._id] = newNode;
      //Find it's kids
      console.log('query for ', [newNode._id, type].join('/'));
      EdgesDAO.targetNodes([newNode._id, type].join('/'),
        function(parent, err, models) {
          //factor weights down by parent weight
          models = models.map(function(x) {
            console.log('found', x.id);
            x.weight = x.weight || 1;
            x._id = x.id;
            x.weight *= (graph[parent].weight * layerDim);
            return x;
          });
            graph[parent].targets = models;
            //add found kids to node stack and sort by weights
            nodeStack = nodeStack.concat(models)
              .sort(function(a,b) {
                return (a.weight > b.weight ? 1 : (a.weight < b.weight ? -1 : 0));
              });
          if (nodeStack.length === 0 || graph.size >= z) {
            callback(err, graph);
          } else {
            chewStack();
          }
        }.bind(this, newNode._id));
    })();
  }
};

module.exports = NodeBL;
