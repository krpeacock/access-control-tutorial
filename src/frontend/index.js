import { AnonymousIdentity } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";

const main = async () => {
  const secretInput = document.querySelector("#secret");
  if (!secretInput) throw new Error("Secret input not found");
  secretInput.addEventListener("input", handleChange);
  handleChange({ target: secretInput });
};

document.addEventListener("DOMContentLoaded", main);

const handleChange = async (event) => {
  const { value } = event.target;
  try {
    const identity = seedToIdentity(value);
    const output = document.querySelector("#output");
    if (!output) throw new Error("Output element not found");
    output.innerHTML = identity.getPrincipal().toString();
  } catch (error) {
    console.error(error);
  }
};

function seedToIdentity(seed) {
  const seedBuf = new Uint8Array(new ArrayBuffer(32));
  if (seed.length && seed.length > 0 && seed.length <= 32) {
    seedBuf.set(new TextEncoder().encode(seed));
    return Ed25519KeyIdentity.generate(seedBuf);
  }
  return new AnonymousIdentity();
}

setInterval(() => {
    