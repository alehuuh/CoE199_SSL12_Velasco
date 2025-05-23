// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract IotLogs {
    struct Iotlogrec {
        string deviceid;
        string devicename;
        string deviceloc;
        string rfid;
        string classcode;
        string timestamp;
        string transvalue;
    } 
    mapping (uint => Iotlogrec) Alliotlogs;

    function AddIotlogs(uint _transid, string memory _deviceid, string memory _devicename, string memory _deviceloc, string memory _rfid, string memory _classcode, string memory _timestamp, string memory _transvalue) public {
        Alliotlogs[_transid].deviceid = _deviceid;
        Alliotlogs[_transid].devicename = _devicename;
        Alliotlogs[_transid].deviceloc = _deviceloc;
        Alliotlogs[_transid].rfid = _rfid;
        Alliotlogs[_transid].classcode = _classcode;
        Alliotlogs[_transid].timestamp = _timestamp;
        Alliotlogs[_transid].transvalue = _transvalue;

    }

    function getIotlogs(uint _transid) public view returns (string memory, string memory, string memory, string memory, string memory , string memory, string memory) {
        return (Alliotlogs[_transid].deviceid,
                 Alliotlogs[_transid].devicename,
                 Alliotlogs[_transid].deviceloc,
                 Alliotlogs[_transid].rfid,
                 Alliotlogs[_transid].classcode,
                 Alliotlogs[_transid].timestamp,
                 Alliotlogs[_transid].transvalue);
    }

}

