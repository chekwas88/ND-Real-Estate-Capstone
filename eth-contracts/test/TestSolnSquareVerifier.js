// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const SquareVerifier = artifacts.require('Verifier');
const truffleAssert = require("truffle-assertions");
let proofJson = {
    "proof": {
        "a": [
          "0x2cd48df38ce223360240752652b8021422d844cd16a34f2e4da780e59fe5a662",
          "0x173e9141f0ff32b1838193409067b69d321a251483795815a78a40ccabbdd844"
        ],
        "b": [
          [
            "0x1e4ecf4c0ecc9fadd86835e116badbf4c2953019de3943e81482842cafd8fccb",
            "0x2ceb19c103dd2a1a639468ed9e42259f589d563f98239f20af9bffa34da3a082"
          ],
          [
            "0x030410b4d3509ae26ff30480163a06f4b3581d62f8d874bb0c1c6bdc121420ef",
            "0x0af1efcbcd6eb1abc3ef047e5706feb40f7cf4cc36b7694a612ef43d29264606"
          ]
        ],
        "c": [
          "0x27de7f9c3c3ba5d34702cdc2611661396b8a8a0797ff7dde94e6fc0be2f542d0",
          "0x08d0bc622044f0dc16a1225a7b2922ef164bd8522289d933b03a6323f0cc5a42"
        ]
      },
      "inputs": [
        "0x0000000000000000000000000000000000000000000000000000000000000004",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      ]
}

contract('TestSolnSquareVerifier', accounts => {
  describe('test to verify soultion and mint token', () => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    let verifier;
    let solnSquareVerifier;

    beforeEach(async () => {
      verifier = await SquareVerifier.new({ from: account_one });
      solnSquareVerifier = await SolnSquareVerifier.new(verifier.address, {from: account_one});
    });
    it('can add a new solution', async () => {
      const tx = await solnSquareVerifier.addSolution(5, account_two, web3.utils.fromUtf8("1122334455"), {from: account_two});
      truffleAssert.eventEmitted(tx, "SolutionAdded", null, "Invalid event emitted"); 
    });
    it("can mint ERC721 token", async() => {

      let result = await solnSquareVerifier.verifiedMint.call(account_two, 1,
        proofJson.proof.a, proofJson.proof.b, proofJson.proof.c,
        proofJson.inputs,
        {from: account_one}
      );
      assert.equal(result, true, 'cannot mint ERC721 token');
    });
  });
});