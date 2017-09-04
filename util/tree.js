var _ = require('lodash');

function walkThroughTreeNodes(tree, cb) {

  function _checkChildren(children, parent) {
    if (_.isArray(children)) {
      children.forEach((child, idx) => {
        cb(child, parent, idx + 1);
        _checkChildren(child.children, child);
      })
    }
  }
  cb(tree, null, 0);
  _checkChildren(tree.children, tree);
}

function enhanceTree(tree) {
  walkThroughTreeNodes(tree, (node, parent, idx) => {
    if (idx === 0) {
      node.root = true;
    }
    if (parent) {
      node.parent = parent;
    }
  });
  return tree;
}

function findNodeById(tree, id) {
  var result = null;

  walkThroughTreeNodes(tree, ((node) => {
    if (node.id === id) result = node;
  }));

  return result;

}

function walkUpParents(node, cb) {

  var currentNode = node;

  while (currentNode.parent) {
    cb(currentNode.parent);
    currentNode = currentNode.parent;
  }

}

module.exports = {
  walkThroughTreeNodes,
  enhanceTree,
  walkUpParents,
  findNodeById
}