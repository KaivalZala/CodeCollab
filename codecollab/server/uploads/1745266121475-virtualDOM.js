function render(node) {
  if (node.children) {
    node.children.forEach(render);
  }
  // Creates DOM element but doesn’t clean up
  document.body.appendChild(document.createElement(node.tag));
}