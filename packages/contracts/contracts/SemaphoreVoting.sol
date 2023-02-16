//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphoreVoting.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";

import "./verifiers/ZKPVerifier.sol";
import "./lib/GenesisUtils.sol";

/// @title Semaphore voting contract.
/// @notice It allows users to vote anonymously in a poll.
/// @dev The following code allows you to create polls, add voters and allow them to vote anonymously.
contract SemaphoreVoting is ISemaphoreVoting, SemaphoreGroups, ZKPVerifier {
    ISemaphoreVerifier public verifier;

    /// @dev Gets a poll id and returns the poll data.
    mapping(uint256 => Poll) internal polls;
    /// @dev Poll ID -> Choice -> Vote count
    mapping(uint256 => mapping(uint256 => uint256)) internal votes;

    uint64 public constant TRANSFER_REQUEST_ID = 1;
    mapping(uint256 => address) public idToAddress;
    mapping(address => uint256) public addressToId;

    /// @dev Checks if the poll coordinator is the transaction sender.
    /// @param pollId: Id of the poll.
    modifier onlyCoordinator(uint256 pollId) {
        if (polls[pollId].coordinator != _msgSender()) {
            revert Semaphore__CallerIsNotThePollCoordinator();
        }

        _;
    }

    /// @dev Initializes the Semaphore verifier used to verify the user's ZK proofs.
    /// @param _verifier: Semaphore verifier address.
    constructor(ISemaphoreVerifier _verifier) {
        verifier = _verifier;
    }

    /// @dev See {ISemaphoreVoting-createPoll}.
    function createPoll(
        uint256 pollId,
        address coordinator,
        uint256 merkleTreeDepth
    ) public override {
        if (merkleTreeDepth < 16 || merkleTreeDepth > 32) {
            revert Semaphore__MerkleTreeDepthIsNotSupported();
        }

        _createGroup(pollId, merkleTreeDepth);

        polls[pollId].coordinator = coordinator;

        emit PollCreated(pollId, coordinator);
    }

    /// @dev See {ISemaphoreVoting-addVoter}.
    function addVoter(uint256 pollId, uint256 identityCommitment) public override {
        revert();
    }

    /// @dev See {ISemaphoreVoting-startPoll}.
    function startPoll(uint256 pollId, uint256 encryptionKey) public override onlyCoordinator(pollId) {
        if (polls[pollId].state != PollState.Created) {
            revert Semaphore__PollHasAlreadyBeenStarted();
        }

        polls[pollId].state = PollState.Ongoing;

        emit PollStarted(pollId, _msgSender(), encryptionKey);
    }

    /// @dev See {ISemaphoreVoting-castVote}.
    // TODO: Change vote, only valid choices
    function castVote(
        uint256 vote,
        uint256 nullifierHash,
        uint256 pollId,
        uint256[8] calldata proof
    ) public override {
        if (polls[pollId].state != PollState.Ongoing) {
            revert Semaphore__PollIsNotOngoing();
        }

        if (polls[pollId].nullifierHashes[nullifierHash]) {
            revert Semaphore__YouAreUsingTheSameNillifierTwice();
        }

        uint256 merkleTreeDepth = getMerkleTreeDepth(pollId);
        uint256 merkleTreeRoot = getMerkleTreeRoot(pollId);

        verifier.verifyProof(merkleTreeRoot, nullifierHash, vote, pollId, proof, merkleTreeDepth);

        polls[pollId].nullifierHashes[nullifierHash] = true;
        votes[pollId][vote] += 1;

        emit VoteAdded(pollId, vote);
    }

    /// @dev See {ISemaphoreVoting-publishDecryptionKey}.
    function endPoll(uint256 pollId, uint256 decryptionKey) public override onlyCoordinator(pollId) {
        if (polls[pollId].state != PollState.Ongoing) {
            revert Semaphore__PollIsNotOngoing();
        }

        polls[pollId].state = PollState.Ended;

        emit PollEnded(pollId, _msgSender(), decryptionKey);
    }

    // --------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------

    function _addVoter(uint256 pollId, uint256 identityCommitment) internal {
        if (polls[pollId].state != PollState.Created) {
            revert Semaphore__PollHasAlreadyBeenStarted();
        }

        _addMember(pollId, identityCommitment);
    }

    function getVoteCount(
        uint256 pollId,
        uint256 vote
    ) public view returns (uint256) {
        return votes[pollId][vote];
    }

    /**
     * @dev _beforeProofSubmit
     */
    function _beforeProofSubmit(
        uint64, /* requestId */
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal view override {
        // check that challenge input of the proof is equal to the msg.sender
        address addr = GenesisUtils.int256ToAddress(
            inputs[validator.getChallengeInputIndex()]
        );
        require(
            _msgSender() == addr,
            "address in proof is not a sender address"
        );
    }

    /**
     * @dev _afterProofSubmit
     */
    function _afterProofSubmit(
        uint64 requestId,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal override {
        require(
            requestId == TRANSFER_REQUEST_ID && addressToId[_msgSender()] == 0,
            "proof can not be submitted more than once"
        );

        uint256 id = inputs[validator.getChallengeInputIndex()];
        // execute the airdrop
        if (idToAddress[id] == address(0)) {
            _addVoter(1, 11784763969337111784082690226747794823040885507524961134688098949087024400110);
            addressToId[_msgSender()] = id;
            idToAddress[id] = _msgSender();
        }
    }
}