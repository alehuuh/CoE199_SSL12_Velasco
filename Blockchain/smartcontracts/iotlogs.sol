// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract IotLogs {
    struct Iotlogrec {
        uint transid;
        string deviceid;
        string devicename;
        string deviceloc;
        string rfid;
        string classcode;
        string timestamp;
        string transvalue;
    } 
    address owner;

    mapping (uint => Iotlogrec) public Alliotlogs;
    Iotlogrec[] public IotlogrecArray;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function AddIotlog(uint _transid, string memory _deviceid, string memory _devicename, string memory _deviceloc, string memory _rfid, string memory _classcode, string memory _timestamp, string memory _transvalue) public onlyOwner {
        Iotlogrec memory IotLog = Iotlogrec(_transid, _deviceid, _devicename, _deviceloc, _rfid, _classcode, _timestamp, _transvalue);
        Alliotlogs[_transid] = IotLog;
        IotlogrecArray.push(Iotlogrec(_transid, _deviceid, _devicename, _deviceloc, _rfid, _classcode, _timestamp, _transvalue));
    }

    function getIotlog(uint _transid) public view returns (string memory, string memory, string memory, string memory, string memory , string memory, string memory) {
        require(Alliotlogs[_transid].transid != 0, "Iot Logs not available.");
        Iotlogrec memory Iotlog = Alliotlogs[_transid];
        return (Iotlog.deviceid, 
                 Iotlog.devicename,
                 Iotlog.deviceloc,
                 Iotlog.rfid,
                 Iotlog.classcode,
                 Iotlog.timestamp,
                 Iotlog.transvalue);
    }

        function getAllIotlogs() public view returns (Iotlogrec[] memory) {
            return IotlogrecArray;
    }

}

