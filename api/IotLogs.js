class iotlogs{
    constructor(TransID, DeviceID, DeviceName, DeviceLoc, rfid, classcode, TimeStamp, TransValue){
      this.TransID = TransID;
      this.DeviceID = DeviceID;
      this.DeviceName = DeviceName;
      this.DeviceLoc = DeviceLoc;
      this.rfid = rfid;
      this.classcode = classcode;
      this.TimeStamp = TimeStamp;
      this.TransValue = TransValue;
    }
}

module.exports = iotlogs;