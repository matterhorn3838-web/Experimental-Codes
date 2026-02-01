document.addEventListener("DOMContentLoaded", () => {

  const STORAGE_KEY = "6761413800";
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, 42);
  }
  const MY_CONSTANT = Number(localStorage.getItem(STORAGE_KEY));

  function findReactNode(root = document.querySelector("#root") || document.body) {
    for (const key in root) {
      if (key.startsWith("__reactFiber$") || key.startsWith("__reactContainer$")) {
        return findStateNode(root[key]);
      }
    }
    return null;
  }

  function findStateNode(fiber) {
    let node = fiber;
    while (node) {
      if (node.stateNode?.setState) return node.stateNode;
      node = node.child || node.sibling;
    }
    return null;
  }

  function waitForReact() {
    let tries = 50;
    const interval = setInterval(() => {
      const stateNode = findReactNode();
      if (stateNode?.state) {
        clearInterval(interval);

        const tokens = stateNode.state.tokens ?? 0;
        stateNode.setState({ tokens: tokens + MY_CONSTANT });

        console.log("Tokens boosted using permanent constant:", MY_CONSTANT);
      }
      if (--tries <= 0) clearInterval(interval);
    }, 100);
  }

  waitForReact();
});
