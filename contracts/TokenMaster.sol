// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenMaster is ERC721 {
    uint256 public totalSupply;

    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
        string description;
        bool isActive;
    }     
    struct TicketSale {
        address seller;
        uint256 price;
        bool isListed;
    }               
    mapping(address => Occasion[]) public occasions;  
    mapping(address => mapping(uint256 => mapping(address => bool)))
        public hasBought;
    mapping(address => mapping(uint256 => mapping(uint256 => address)))
        public seatsTaken;
    mapping(address => mapping(uint256 => uint256[])) private seatsBooked;

    mapping(uint256 => TicketSale) public ticketsForSale;
    address[] public allOccasionsAddresses; 
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {}

    function list(
        string memory _name,
        uint256 _cost,
        uint32 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location,
        string memory _description
    ) public {
        Occasion memory newOccasion = Occasion({
            id: occasions[msg.sender].length,
            name: _name,
            cost: _cost,
            tickets: _maxTickets,
            maxTickets: _maxTickets,
            date: _date,
            time: _time,
            location: _location,
            description: _description,
            isActive: true
        });

        occasions[msg.sender].push(newOccasion);
        bool exists = false;
        for (uint256 i = 0; i < allOccasionsAddresses.length; i++) {
            if (allOccasionsAddresses[i] == msg.sender) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            allOccasionsAddresses.push(msg.sender);
        }
    }
    

    function createTicket(
    address _creator,
    uint256 _id,
    uint256 _seat,
    address _recipient
) public payable {
    require(_id < occasions[_creator].length, "Invalid occasion ID");
    Occasion storage occ = occasions[_creator][_id];

    require(
        seatsTaken[_creator][_id][_seat] == address(0),
        "Seat already taken"     
    );
    require(_seat < occ.maxTickets, "Invalid seat number");
    require(occ.tickets > 0, "No tickets left");
    require(msg.value >= occ.cost, "Insufficient ETH sent");
     
    occ.tickets -= 1;
    hasBought[_creator][_id][_recipient] = true;
    seatsTaken[_creator][_id][_seat] = _recipient;
    seatsBooked[_creator][_id].push(_seat);

    totalSupply++;
    _safeMint(_recipient, totalSupply);
}
    function getOccasionsOf(address _of) public view returns (Occasion[] memory) {
        return occasions[_of];
    }

    function cancelTicket(
        address _creator,
        uint256 _ticketId,
        address payable _cancelor,
        Occasion memory _occasion
    ) public {
        require(ownerOf(_ticketId) == _cancelor, "You do not own this ticket");
        _burn(_ticketId);
        uint256[] storage bookedSeats = seatsBooked[_creator][_occasion.id];
        for (uint256 i = 0; i < bookedSeats.length; i++) {
            uint256 seat = bookedSeats[i];
            if (seatsTaken[_creator][_occasion.id][seat] == _cancelor) {
                seatsTaken[_creator][_occasion.id][seat] = address(0);

                bookedSeats[i] = bookedSeats[bookedSeats.length - 1];
                bookedSeats.pop();
                break;
            }
        }

        uint256 refundAmount = (_occasion.cost * 90) / 100;
        uint256 feeAmount = _occasion.cost - refundAmount;

        require(
            address(this).balance >= _occasion.cost,
            "Contract has insufficient funds"
        );

        (bool refundSuccess, ) = _cancelor.call{value: refundAmount}("");
        require(refundSuccess, "Refund to user failed");

        (bool feeSuccess, ) = payable(_creator).call{value: feeAmount}("");
        require(feeSuccess, "Transfer to creator failed");
        occasions[_creator][_occasion.id].tickets += 1;
        hasBought[_creator][_occasion.id][_cancelor] = false;
    }

    function sellTicket(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not ticket owner");
        require(price > 0, "Price must be greater than 0");

        ticketsForSale[tokenId] = TicketSale({
            seller: msg.sender,
            price: price,
            isListed: true
        });
    }

    function buyTicket(uint256 tokenId) public payable {
        TicketSale memory sale = ticketsForSale[tokenId];

        require(sale.isListed, "Ticket not listed for sale");
        require(msg.value >= sale.price, "Insufficient payment");

        delete ticketsForSale[tokenId];

        payable(sale.seller).transfer(sale.price);

        _transfer(sale.seller, msg.sender, tokenId);
    }

    function getOccasion(
        address _creator,
        uint256 _id
    ) public view returns (Occasion memory) {
        require(_id < occasions[_creator].length, "Invalid ID");
        return occasions[_creator][_id];
    }

    function getSeatsTaken(
        address _creator,
        uint256 _id
    ) public view returns (uint256[] memory) {
        return seatsBooked[_creator][_id];
    }

    receive() external payable {}

    function withdraw(address payable _to, uint256 _amount) public {
        require(_to != address(0), "Invalid address");
        require(_amount > 0, "Amount must be greater than zero");
        require(
            address(this).balance >= _amount,
            "Insufficient contract balance"
        );

        (bool success, ) = _to.call{value: _amount}("");
    }
}