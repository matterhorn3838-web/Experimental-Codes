document.addEventListener("DOMContentLoaded", () => {

  /* =======================
     PERMANENT CONSTANT PART
  ======================== */

  const STORAGE_KEY = "6761413800";

  // Store the number once
  if (!localStorage.getItem(STORAGE_KEY)) {
    const myNumber = 42;
    localStorage.setItem(STORAGE_KEY, myNumber);
  }

  const storedNumber = Number(localStorage.getItem(STORAGE_KEY));
  const MY_CONSTANT = storedNumber;

  console.log("Permanent constant value:", MY_CONSTANT);

  const display = document.getElementById("display");
  if (display) {
    display.textContent = "Permanent constant value: " + MY_CONSTANT;
  }


  /* =======================
     REACT stateNode FINDER
  ======================== */

  const stateNode = (function findReactNode(r = document.querySelector("body > div")) {
    if (!r) return null;

    const values = Object.values(r);

    for (const v of values) {
      if (v?.children?.[0]?._owner?.stateNode) {
        return v.children[0]._owner.stateNode;
      }
    }

    return findReactNode(r.querySelector(":scope > div"));
  })();

  if (!stateNode || !stateNode.state) {
    console.log("React stateNode not found");
    return;
  }

  console.log("React stateNode found:", stateNode);


  /* =======================
     USING BOTH TOGETHER
  ======================== */

  const tokens = stateNode.state.tokens ?? 0;
  const cost = stateNode.state.cost ?? 1;

  const canOpen = Math.floor(tokens / cost);

  console.log("Tokens:", tokens);
  console.log("Cost:", cost);
  console.log("Can open:", canOpen);

  // Example: use permanent constant to boost tokens
  stateNode.setState({
    tokens: tokens + MY_CONSTANT
  });

  console.log("New tokens set!");

});
