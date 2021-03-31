var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
            await this.contract.mint(account_one, 1);
            await this.contract.mint(account_two, 2);
            // TODO: mint multiple tokens
        })

        it('should return total supply', async function () { 
            const totalSupply = await this.contract.totalSupply.call();
            assert.equal(totalSupply, 2, "total supply of tokens should be 2")
        });

        it('should get token balance', async function () {
            const balance1 = await this.contract.balanceOf(account_one);
            const balance2 = await this.contract.balanceOf(account_two);
            assert.equal(balance1, 1, "token balance of account_one should be 1");
            assert.equal(balance2, 1, "token balance of account_one should be 1");
  
        });

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const tokenURI = await this.contract.tokenURI.call(1);
            const expectedURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1";
            assert.equal(tokenURI, expectedURI, "token uri is not correct")
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one, account_two, 1);
            const currentOwner = await this.contract.ownerOf.call(1);
            assert.equal(currentOwner, account_two, "token was transfered");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let revert = false;
            try{
                await this.contract.mint(account_two, 3, {from:account_two});
            } 
            catch(err) {
                revert=true;
            }
            assert.equal(revert,true, "the contract should fail when not called by contract owner");
        })

        it('should return contract owner', async function () { 
            const owner = await this.contract.owner.call();
            assert.equal(owner, account_one, "Incorrect owner")
        })

    });
})