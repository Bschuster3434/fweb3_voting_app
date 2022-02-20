const { expect } = require("chai");
const { poll } = require("ethers/lib/utils");

describe("Voting Contract", function () {

  let Token;
  let schusterToken;
  let Poll;
  let poll;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addr4;

  this.beforeEach(async function () {
    Token = await ethers.getContractFactory('SchusterTestToken');
    [owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();
    schusterToken = await Token.deploy();

    Poll = await ethers.getContractFactory("Poll");
    poll = await Poll.deploy(schusterToken.address);    
    
    const tx0 = await schusterToken.transfer(
        addr1.address,
        ethers.utils.parseEther('100')
      )

    const tx1 = await schusterToken.transfer(
        addr2.address,
        ethers.utils.parseEther('150')
      )

    const tx2 = await schusterToken.transfer(
        addr3.address,
        ethers.utils.parseEther('50')
      )
  });

  it("The number of total voters should increase after voting", async function () {
    const firstVoteCount = await poll.getNumVoters();
    expect(firstVoteCount).to.equal(0);

    await poll.connect(addr1).voteYes();

    const secondVoteCount = await poll.getNumVoters();

    expect(secondVoteCount).to.equal(1);
  });

  it("Does not allow someone to vote twice", async function () {
    await poll.connect(addr1).voteYes();
    await expect(poll.connect(addr1).voteYes()).to.be.revertedWith(
        'You already voted'
    )
    await poll.connect(owner).voteNo();
    await expect(poll.connect(owner).voteNo()).to.be.revertedWith(
        'You already voted'
    )
    await expect(poll.connect(owner).voteYes()).to.be.revertedWith(
        'You already voted'
    )
  });

  it("Does not allow someone without tokens to vote", async function () {
    await expect(poll.connect(addr3).voteYes()).to.be.revertedWith(
        'Need 100 FWEB3 tokens to vote'
    );   
    await expect(poll.connect(addr4).voteYes()).to.be.revertedWith(
        'Need 100 FWEB3 tokens to vote'
    );  
  });

  it("Returns the correct vote percentage", async function () {
    await poll.connect(addr1).voteYes();
    await poll.connect(owner).voteYes();
    await poll.connect(addr2).voteNo();
    const yesPerc = await poll.getYesPercentage();
    expect(yesPerc).to.equal(66);
  })

  it("should allow me to check if I voted", async function () {
    expect(poll.connect(addr1).haveIVoted()).to.be(false);
    await poll.connect(addr1).voteYes();
    expect(poll.connect(addr1).haveIVoted()).to.be(true);
  });
});