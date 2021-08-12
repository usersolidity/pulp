pragma solidity >=0.4.25 <0.7.0;

contract pnlp {
    struct Publication {
        string ipnsHash;
        address publisher;
        uint256 timestamp;
    }

    struct Article {
        address publisher;
        uint256 timestamp;
    }

    struct Review {
        bool approved;
        uint8 rating;
    }

    mapping(string => Publication) public publications;
    mapping(string => Article) public articles;

    // reviewerAddress, ipfsHash, requesterAddress
    mapping(address => mapping(string => address)) public reviewRequests;

    // ipfsHash, reviewerAddress
    mapping(string => mapping(address => Review)) public reviews;

    // serverAddress, requiredReviewer
    // mapping(string => string[]) public requiredReviewers;

    function requestReview(string memory ipfsHash, address memory reviewer)
        public
    {
        emit RequestedReview(ipfsHash, reviewer, msg.sender, block.timestamp);
        reviewRequests[reviewer][ipfsHash] = true;
    }

    function reviewArticle(
        string memory ipfsHash,
        bool memory approved,
        uint8 memory rating
    ) public {
        emit ReviewedArticle(
            ipfsHash,
            msg.sender,
            approved,
            rating,
            block.timestamp
        );

        Review memory review = Review(approved, rating);
        reviews[ipfsHash][msg.sender] = review;

        if (
            reviewRequests[msg.sender] && reviewRequests[msg.sender][ipfsHash]
        ) {
            delete reviewRequests[msg.sender][ipfsHash];
        }
    }

    event CreatedPublication(
        string publicationName,
        string ipnsHash,
        address publisher,
        uint256 timestamp
    );

    event PublishedArticle(
        string publicationName,
        address publisher,
        uint256 timestamp
    );

    event ReviewedArticle(
        string ipfsHash,
        address reviewer,
        bool approved,
        uint8 rating,
        uint256 timestamp
    );

    event RequestedReview(
        string ipfsHash,
        address reviewer,
        address requester,
        uint256 timestamp
    );

    function createPublication(
        string memory publicationName,
        string memory ipnsHash
    ) public {
        // Using ipns
        // No collisions allowed!
        // record callers address
        // v3 Require a stake
        require(
            publications[publicationName].publisher == address(0),
            "publicationName is already in use"
        );
        emit CreatedPublication(
            publicationName,
            ipnsHash,
            msg.sender,
            block.timestamp
        );
        Publication memory publication = Publication(
            ipnsHash,
            msg.sender,
            block.timestamp
        );
        publications[publicationName] = publication;
    }

    function publishArticle(
        string memory publicationName,
        string memory ipfsHash
    ) public {
        require(
            publications[publicationName].publisher == msg.sender,
            "articles can only be added to a publication by the publication creator"
        );

        // Unsure about this following line. If we add it in, we need to make sure that we support it.
        // We may want to require that the hash and the publication not be reused? Need to talk to team to figure out what we want to do...
        // require(articles[ipfsHash].publisher == address(0), "ipfsHash is already in use");

        emit PublishedArticle(publicationName, msg.sender, block.timestamp);
        Article memory article = Article(msg.sender, block.timestamp);
        articles[ipfsHash] = article;
    }

    // - Get all of the publications? - Not now (check out The Graph)
    // - You know the publication, list all of the articles?
    // - Get ipns hash of pulbication from name of pulbication
    // - v3 Keep track of ipFs addresses of publications so that when ipns points to something else, history is kept.
}
