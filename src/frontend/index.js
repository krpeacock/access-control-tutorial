import { AnonymousIdentity, SignIdentity } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import {
  backend as default_backend_actor,
  canisterId,
  createActor,
} from "../declarations/backend";
import LoginButton from "@dfinity/ii-login-button/dist/ii-login-button";

const main = async () => {
  const secretInput = document.querySelector("#secret");
  if (!secretInput) throw new Error("Secret input not found");
  secretInput.addEventListener("input", handleChange);
  handleChange({ target: secretInput });
  //register ii login button as a custom element
  if (!customElements.get("ii-login-button")) {
    customElements.define("ii-login-button", LoginButton);
  }
  /**
   * @type {LoginButton}
   */
  const loginButton = document.querySelector("ii-login-button");
  if (!loginButton) throw new Error("Login button not found");

  loginButton.addEventListener("ready", async (event) => {
    if (
      window.location.host.includes("localhost") ||
      window.location.host.includes("127.0.0.1")
    ) {
      loginButton.configure({
        loginOptions: {
          identityProvider: `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`,
        },
      });
    }
  });

  loginButton.addEventListener("login", async (event) => {
    const identity = loginButton?.identity;
    window.identity = identity;
    output.innerHTML = identity.getPrincipal().toString();
  });

  document.querySelector("#increment").addEventListener("click", increment);
};

document.addEventListener("DOMContentLoaded", main);

const handleChange = async (event) => {
  const { value } = event.target;
  try {
    const identity = seedToIdentity(value);
    const output = document.querySelector("#output");
    if (!output) throw new Error("Output element not found");
    if (identity) {
      output.innerHTML = identity.getPrincipal().toString();
      window.identity = identity;
    }
  } catch (error) {
    console.error(error);
  }
};

const form = document.querySelector("#form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  return false;
});

function seedToIdentity(seed) {
  const seedBuf = new Uint8Array(new ArrayBuffer(32));
  if (seed.length && seed.length > 0 && seed.length <= 32) {
    seedBuf.set(new TextEncoder().encode(seed));
    return Ed25519KeyIdentity.generate(seedBuf);
  }
  return null;
}
function getActor(identity) {
  return createActor(canisterId, {
    agentOptions: {
      identity,
    },
  });
}

const renderTable = async (data) => {
  const counts = JSON.parse(await default_backend_actor.getCounts());
  counts.forEach(({ principal, count }) => {
    if (document.querySelector(`#${principal}`)) {
      document.querySelector(`#${principal} td:nth-child(2)`).innerText = count;
      return;
    }
    const row = document.createElement("tr");
    row.id = principal;
    const principalCell = document.createElement("td");
    principalCell.innerText = principal;
    const countCell = document.createElement("td");
    countCell.innerText = count;
    row.appendChild(principalCell);
    row.appendChild(countCell);
    document.querySelector("#table tbody").appendChild(row);
  });
  console.log(counts);
};

renderTable();

function increment() {
  if (!window.identity) return;
  getActor(window.identity)
    .increment()
    .then((count) => {
      document.querySelector("#count").innerHTML = count;
      renderTable();
    });
}
