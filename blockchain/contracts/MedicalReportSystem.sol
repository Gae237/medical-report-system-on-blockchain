// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedicalReportSystem {
    enum Role { None, Patient, Doctor }
    
    struct User {
        Role role;
        bool isRegistered;
        uint256 registrationTime;
    }
    
    struct Report {
        string ipfsHash;
        uint256 timestamp;
        address patient;
        bool isActive;
    }
    
    mapping(address => User) public users;
    mapping(address => Report[]) public patientReports;
    mapping(address => mapping(address => bool)) public accessPermissions;
    mapping(address => address[]) public patientDoctors;
    mapping(address => address[]) public doctorPatients;
    
    event UserRegistered(address indexed user, Role role);
    event ReportUploaded(address indexed patient, string ipfsHash, uint256 timestamp);
    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);
    
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }
    
    modifier onlyPatient() {
        require(users[msg.sender].role == Role.Patient, "Only patients allowed");
        _;
    }
    
    modifier onlyDoctor() {
        require(users[msg.sender].role == Role.Doctor, "Only doctors allowed");
        _;
    }
    
    function register(Role _role) external {
        require(_role == Role.Patient || _role == Role.Doctor, "Invalid role");
        require(!users[msg.sender].isRegistered, "User already registered");
        
        users[msg.sender] = User({
            role: _role,
            isRegistered: true,
            registrationTime: block.timestamp
        });
        
        emit UserRegistered(msg.sender, _role);
    }
    
    function uploadReport(string memory _ipfsHash) external onlyRegistered onlyPatient {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        patientReports[msg.sender].push(Report({
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            patient: msg.sender,
            isActive: true
        }));
        
        emit ReportUploaded(msg.sender, _ipfsHash, block.timestamp);
    }
    
    function grantAccess(address _doctor) external onlyRegistered onlyPatient {
        require(users[_doctor].role == Role.Doctor, "Address is not a doctor");
        require(!accessPermissions[msg.sender][_doctor], "Access already granted");
        
        accessPermissions[msg.sender][_doctor] = true;
        patientDoctors[msg.sender].push(_doctor);
        doctorPatients[_doctor].push(msg.sender);
        
        emit AccessGranted(msg.sender, _doctor);
    }
    
    function revokeAccess(address _doctor) external onlyRegistered onlyPatient {
        require(accessPermissions[msg.sender][_doctor], "Access not granted");
        
        accessPermissions[msg.sender][_doctor] = false;
        
        // Remove doctor from patient's list
        address[] storage doctors = patientDoctors[msg.sender];
        for (uint i = 0; i < doctors.length; i++) {
            if (doctors[i] == _doctor) {
                doctors[i] = doctors[doctors.length - 1];
                doctors.pop();
                break;
            }
        }
        
        // Remove patient from doctor's list
        address[] storage patients = doctorPatients[_doctor];
        for (uint i = 0; i < patients.length; i++) {
            if (patients[i] == msg.sender) {
                patients[i] = patients[patients.length - 1];
                patients.pop();
                break;
            }
        }
        
        emit AccessRevoked(msg.sender, _doctor);
    }
    
    function getMyReports() external view onlyRegistered onlyPatient returns (Report[] memory) {
        return patientReports[msg.sender];
    }
    
    function getPatientReports(address _patient) external view onlyRegistered onlyDoctor returns (Report[] memory) {
        require(accessPermissions[_patient][msg.sender], "Access not granted");
        return patientReports[_patient];
    }
    
    function checkAccess(address _patient, address _doctor) external view returns (bool) {
        return accessPermissions[_patient][_doctor];
    }
    
    function getUser(address _user) external view returns (Role, bool, uint256) {
        User memory user = users[_user];
        return (user.role, user.isRegistered, user.registrationTime);
    }
    
    function getMyDoctors() external view onlyRegistered onlyPatient returns (address[] memory) {
        return patientDoctors[msg.sender];
    }
    
    function getMyPatients() external view onlyRegistered onlyDoctor returns (address[] memory) {
        return doctorPatients[msg.sender];
    }
}
