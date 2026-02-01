document.addEventListener("DOMContentLoaded", () => {
  // 1. Storage Configuration
  const STORAGE_KEY = "6761413800";
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, "42");
  }
  
  const MY_CONSTANT = Number(localStorage.getItem(STORAGE_KEY));

  // 2. Fiber Scraper: Locates the React internal data structure
  function findReactNode(root = document.querySelector("#root") || document.body) {
    if (!root) return null;

    // Search for the internal React key on the DOM element
    const reactKey = Object.keys(root).find(key => 
      key.startsWith("__reactFiber$") || key.startsWith("__reactContainer$")
    );

    if (!reactKey) {
      console.warn("React internal key not found on root element.");
      return null;
    }

    return findStateNode(root[reactKey]);
  }

  // 3. Recursive search for a Class Component instance with setState
  function findStateNode(fiber) {
    let node = fiber;
    while (node) {
      // Check if this fiber belongs to a Class Component
      if (node.stateNode && typeof node.stateNode.setState === "function") {
        return node.stateNode;
      }
      // Traverse down or sideways in the Fiber tree
      node = node.child || node.sibling;
    }
    return null;
  }

  // 4. Injection Logic
  function waitForReact() {
    let tries = 50;
    const interval = setInterval(() => {
      const stateNode = findReactNode();

      if (stateNode && stateNode.state) {
        clearInterval(interval);

        // Access the current tokens, default to 0 if undefined
        const currentTokens = stateNode.state.tokens ?? 0;
        
        // Execute the state update
        stateNode.setState({ 
          tokens: currentTokens + MY_CONSTANT 
        }, () => {
          console.log(`%c Success: Tokens boosted by ${MY_CONSTANT}!`, "color: #00ff00; font-weight: bold;");
        });

      } else {
        tries--;
        if (tries <= 0) {
          clearInterval(interval);
          console.error("Failed to find a React Class Component with state after 50 attempts.");
        }
      }
    }, 100);
  }

  // Execution
  console.log("Searching for React state...");
  waitForReact();
});
