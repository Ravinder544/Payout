
var vendorId = null;

var caseType = null;
var caseObject = {};
caseObject.totalRecordsCount = 0
caseObject.position = 0
caseObject.recordCount = 15
var uploadStatus = "";
var rowIndex1 = 0;
var i = 0;
var onlyFileName = "";
var userRole = "";
var UIName = "";
var applicationid="";

var searchParamsString = "";
var alertFlag = "false";

function Form_InitDone(eventObject) {
    //Revoke button to be hide as functionality isActiveFlag not working on 08-09-2017 by Manas
    //revoke_btn.hide();

    // caseTbl_policyNo.hide();
    hold_btn.hide();
    release_btn.hide();
    btnGroupId.hide();
    uploadDocsGroupBox.hide(); //jyothi
    //downloadBulkButton.hide();
    application.container.maximize();
    //searchPolicyNoId.hide();
    caseTbl.hideColumn(17);
    caseTbl.hideColumn(18);
    var selectOpt = {
        value: "",
        description: "---Select---"
    };
    searchCallTypeId.addOption(selectOpt, false, 0, false);
    searchCallTypeId.setValue("");
    searchSubTypeId.addOption(selectOpt, false, 0, false);
    searchSubTypeId.setValue("");
   // nav_first.hide();
   // nav_previous.hide();
  //  nav_next.hide();
  //  nav_last.hide();
    showAll_caseTbl.disable(); //to disable all checkboxes select option
    var vendorData = application.event.data;
	//added by rakesh to fetch caseType fom vendordata object 13-08-18 R001
	caseType=vendorData.caseType;
    if (vendorData == null || vendorData == undefined) {
        vendorId = null;
    } else {
        if (vendorData.vendorId == null || vendorData.vendorId == undefined) {
            vendorId = null;
        } else {
            vendorId = vendorData.vendorId;

        }
        reset();

    }
    if (vendorData != null)
        UIName = cordys.getNodeText(vendorData, ".//*[local-name()='uiName']");

    cordys.setNodeText(GetPoUserMasterCompleteObjectModel.getMethodRequest(), ".//*[local-name()='USER_NAME']", getUserName());
    GetPoUserMasterCompleteObjectModel.reset();

    if (GetPoUserMasterCompleteObjectModel.soapFaultOccurred) {
        application.notify("Error while fetching the user detail");
        return;
    }
    if (vendorId == null) {
        vendorId = cordys.getNodeText(GetPoUserMasterCompleteObjectModel.getData(), ".//*[local-name()='VENDOR']", "", "");

    }
    userRole = cordys.getNodeText(GetPoUserMasterCompleteObjectModel.getData(), ".//*[local-name()='USER_ROLE']", "", "");


    if (userRole == 'StakeHolderMaker') {
        assign_btn.hide();
        revoke_btn.hide();
        hold_btn.show();
        release_btn.show();
        uploadDocsGroupBox.show();
        hold_btn.disable();
        release_btn.disable();
        accept_btn.hide();
        reject_btn.hide();
        caseTbl.showColumn(10);
        caseTbl.hideColumn(11);
        caseTbl.hideColumn(13);
        caseTbl.hideColumn(14);
        caseTbl.hideColumn(15);
        caseTbl.hideColumn(16);

    } else if (userRole == 'StakeholderChecker') {
        assign_btn.hide();
        revoke_btn.hide();
        hold_btn.hide();
        release_btn.hide();
        uploadDocsGroupBox.hide();
        hold_btn.disable();
        release_btn.disable();
        accept_btn.show();
        reject_btn.show();
        caseTbl.showColumn(11);
        caseTbl.showColumn(10);
        caseTbl.hideColumn(13);
        caseTbl.hideColumn(14);
        caseTbl.hideColumn(15);
        caseTbl.hideColumn(16);
    } else if (userRole == 'VendorManager') {

       // caseType = cordys.getNodeText(vendorData, ".//*[local-name()='caseType']"); R001
        
		if (UIName == "Hold_Release") {
            hold_btn.show();
            release_btn.show();
            uploadDocsGroupBox.show();
            hold_btn.disable();
            release_btn.disable();
            assign_btn.hide();
            revoke_btn.hide();
        } else {
            assign_btn.show();
            revoke_btn.show();
        }
        accept_btn.hide();
        reject_btn.hide();
        caseTbl.hideColumn(11);

    } else if (userRole == 'ADMIN') {
        assign_btn.hide();
        revoke_btn.hide();
        hold_btn.show();
        release_btn.show();
        uploadDocsGroupBox.show();
        hold_btn.disable();
        release_btn.disable();
        accept_btn.hide();
        reject_btn.hide();

        caseTbl.hideColumn(11);
        //vendorId = "";
    } else if (userRole == 'VendorEntry' || userRole == 'VendorDoubleEntry' || userRole == 'VendorManager') {

        //caseType = cordys.getNodeText(vendorData, ".//*[local-name()='caseType']"); R001
        if (caseType == 'Pool') {
            assign_btn.show();
            revoke_btn.hide();
            hold_btn.hide();
            release_btn.hide();
            accept_btn.hide();
            reject_btn.hide();
        } else if (caseType == 'Individual') {
            assign_btn.hide();
            revoke_btn.show();
            hold_btn.hide();
            release_btn.hide();
            accept_btn.hide();
            reject_btn.hide();
        }
    } else {
        accept_btn.hide();
        reject_btn.hide();
        //caseTbl.hideColumn(11);
        //caseTbl.hideColumn(10);
    }

    userRole1 = 'VendorEntry1';
    /*     if(userRole=='ADMIN') // need to change to VendorEntry
         var stageId='1';
         if (userRole=='USER')// need to change to VendorDoubleEntry
          var stageId='2';
          if(userRole=='VendorManager')
          var stageId='3';
     
       
         var caseType= cordys.getNodeText(vendorData,".//*[local-name()='caseType']");
        var request = cordys.cloneXMLDocument(vendorCaseId.XMLDocument);
          cordys.setNodeText(request,".//*[local-name()='vendor_id']", vendorId);
          cordys.setNodeText(request,".//*[local-name()='caseType']",caseType);
        //  cordys.setNodeText(request,".//*[local-name()='assign_to']","Pool");
            */


    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='vendorId']", vendorId);
    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='caseType']", caseType);
    GetVendorAllocatedDataCountModel.reset();
    caseObject.totalRecordsCount = cordys.getNodeText(GetVendorAllocatedDataCountModel.getData(), ".//*[local-name()='getVendorAllocatedDataCount']", "", "");




    /*if (parseInt(caseObject.totalRecordsCount) >= 15) {
        nav_first.disable();
        nav_previous.disable();
        nav_next.enable();
        nav_last.enable();
    } else {
        nav_first.disable();
        nav_previous.disable();
        nav_next.disable();
        nav_last.disable();
    }
    caseObject.position = 0;
    caseObject.recordCount = 15;*/
    genericFunction();
}



function caseTbl_policyNo_BeforeBind(eventObject) {
    eventObject.srcElement.style.cursor = "hand";
    eventObject.srcElement.style.color = "blue";
    eventObject.srcElement.style.textDecorationUnderline = true;
    eventObject.srcElement.onclick = link(eventObject.srcElement.businessObject);
}

function link (obj) {
    return function() {

        if (userRole != 'ADMIN' && userRole != 'StakeholderChecker' && userRole != 'StakeHolderMaker') {
            var ContractNO = cordys.getNodeText(obj, ".//*[local-name()='CHDRNUM']", "");
            var data = new Object();
            data.data1 = ContractNO;
            var methodReq = GetSpoolDetailsModel.getMethodRequest();
            cordys.setNodeText(methodReq, ".//*[local-name()='Contract_No']", ContractNO);
            GetSpoolDetailsModel.setMethodRequest(methodReq);
            GetSpoolDetailsModel.reset();
            var isActFlag = cordys.getNodeText(GetSpoolDetailsModel.getData(), ".//*[local-name()='IS_ACTIVE']");
            var modified_by = cordys.getNodeText(GetSpoolDetailsModel.getData(), ".//*[local-name()='MODIFIED_BY']", "");
            if (alertFlag = "false") {
                if (isActFlag == "N") {
                    //  application.setDialogSize("100%", "100%");
                    //application.select(PayoutForm.XMLDocument.documentElement, data, callBack);
                    application.showDialog(PayoutForm.XMLDocument.documentElement, data, null, callBack, true);


                    //   return;
                } else if (isActFlag == "Y") {
                    if (alertFlag == "false")
                        alert("Case is opened by user " + modified_by + ". Please try after sometime");

                    alertFlag = "true";
                    return false;
                } else {
                    //   application.setDialogSize("100%", "100%");
                    //application.select(PayoutForm.XMLDocument.documentElement, data, callBack);
                    application.showDialog(PayoutForm.XMLDocument.documentElement, data, null, callBack, true);


                    return;
                }
            }
        }
    }
}

function callBack(eventObject) {

    searchResetBtn_Click();
}

function caseTbl_xformsonrowclick(eventObject) {
    var data = new Object();
    var userRole1 = cordys.getNodeText(GetPoUserMasterCompleteObjectModel.getData(), ".//*[local-name()='USER_ROLE']", "", "")
    if (userRole1 == 'ADMIN') {
        data.callId = callId[eventObject.rowIndex].getValue();
        application.showDialog(holdSourceDetails.XMLDocument.documentElement, data, null, null, false);

    } else {
        //added by jyothi
        var methodReq = GetSpoolDetailsModel.getMethodRequest();
        cordys.setNodeText(methodReq, ".//*[local-name()='Contract_No']", contractNo[eventObject.rowIndex].getValue());
        GetSpoolDetailsModel.setMethodRequest(methodReq);
        GetSpoolDetailsModel.reset();

        var isActFlag = cordys.getNodeText(GetSpoolDetailsModel.getData(), ".//*[local-name()='IS_ACTIVE']");
        var modified_by = cordys.getNodeText(GetSpoolDetailsModel.getData(), ".//*[local-name()='MODIFIED_BY']", "");

        if (isActFlag == "N") {
            //Added by sushmita
            data.contractNo = contractNo[eventObject.rowIndex].getValue();
            data.freelook_callId = callId[eventObject.rowIndex].getValue();
            data.caseTbl_policyNo = caseTbl_policyNo[eventObject.rowIndex].getValue();
            data.callType = callType[eventObject.rowIndex].getValue();
            data.subType = subType[eventObject.rowIndex].getValue();
            //application.select(PayoutForm.XMLDocument.documentElement, data, callBack);
            // application.setDialogSize("100%", "100%");
            application.showDialog(PayoutForm.XMLDocument.documentElement, data, null, callBack, true);

        } else if (isActFlag == "Y") {
            alertFlag = "true";
            alert("Case is opened by other user. Please try after sometime");
            return false;
        } else {
            data.contractNo = contractNo[eventObject.rowIndex].getValue();
            data.freelook_callId = callId[eventObject.rowIndex].getValue();
            data.caseTbl_policyNo = caseTbl_policyNo[eventObject.rowIndex].getValue();
            data.callType = callType[eventObject.rowIndex].getValue();
            data.subType = subType[eventObject.rowIndex].getValue();
            //   application.setDialogSize("100%", "100%");
            //application.select(PayoutForm.XMLDocument.documentElement, data, callBack);
            application.showDialog(PayoutForm.XMLDocument.documentElement, data, null, callBack, true);

        }
    }
}


/*var data=new Object();
  
   data.vendorId =vendornameId[eventObject.rowIndex].getValue();
    application.select(AllocatedPolicyDetails.XMLDocument.documentElement, data); */


function contractNo_BeforeBind(eventObject) {
    eventObject.srcElement.style.cursor = "hand";
    eventObject.srcElement.style.color = "blue";
    eventObject.srcElement.style.textDecorationUnderline = true;
    eventObject.srcElement.onclick = link(eventObject.srcElement.businessObject);
}


function genericFunction() {

   
   // var request = cordys.cloneXMLDocument(vendorCaseId.XMLDocument);

    GetVendorAllocatedDataModel.clear();
    if (caseOpenCheck.getValue() == "1" && save_as_draft2.getValue() == "0") {
       cordys.setNodeText(GetVendorAllocatedDataModel.getMethodRequest(), ".//*[local-name()='vendor_id']", vendorId + "#CASE OPEN#");
    } else if (save_as_draft2.getValue() == "1" && caseOpenCheck.getValue() == "0") {
        cordys.setNodeText(GetVendorAllocatedDataModel.getMethodRequest(), ".//*[local-name()='vendor_id']", vendorId + "#" + "#SAVE DRAFT");
    } else if (save_as_draft2.getValue() == "1" && caseOpenCheck.getValue() == "1") {
        cordys.setNodeText(GetVendorAllocatedDataModel.getMethodRequest(), ".//*[local-name()='vendor_id']", vendorId + "#CASE OPEN" + "#SAVE DRAFT");
    } else if (caseOpenCheck.getValue() != "1" && save_as_draft2.getValue() != "1") {
        cordys.setNodeText(GetVendorAllocatedDataModel.getMethodRequest(), ".//*[local-name()='vendor_id']", vendorId);
    }
  cordys.setNodeText(GetVendorAllocatedDataModel.getMethodRequest(), ".//*[local-name()='caseType']", caseType);
  cordys.setNodeText(GetVendorAllocatedDataModel.getMethodRequest(), ".//*[local-name()='callType']",  searchCallTypeId.getValue());
  cordys.setNodeText(GetVendorAllocatedDataModel.getMethodRequest(), ".//*[local-name()='subType']", searchSubTypeId.getValue());
  cordys.setNodeText(GetVendorAllocatedDataModel.getMethodRequest(), ".//*[local-name()='callId']", searchCallId.getValue());
  cordys.setNodeText(GetVendorAllocatedDataModel.getMethodRequest(), ".//*[local-name()='contractNo']", searchContractNoId.getValue());
  
 GetVendorAllocatedDataModel.reset();



}

/*function nav_last_Click(eventObject) {
    //x=parseInt(totalRecordsCount)-parseInt(y);
    caseObject.position = parseInt(caseObject.totalRecordsCount) - parseInt(caseObject.recordCount);
    nav_next.disable();
    nav_last.disable();
    nav_first.enable();
    nav_previous.enable();
    genericFunction();

}*/

function nav_next_Click(eventObject) {
    caseObject.position = parseInt(caseObject.position) + parseInt(caseObject.recordCount);

    if (parseInt(caseObject.position) == caseObject.recordCount) {
        nav_first.enable();
        nav_previous.enable();
    }
    if ((parseInt(caseObject.totalRecordsCount) - parseInt(caseObject.position)) <= caseObject.recordCount) {
        nav_next.disable();
        nav_last.disable();
    }
    genericFunction();

}

function nav_previous_Click(eventObject) {
    if (parseInt(caseObject.position) <= 0) {
        nav_first.disable();
        nav_previous.disable();
        nav_next.enable();
        nav_last.enable();
        caseObject.position = 0;
        genericFunction();
    } else {

        nav_next.enable();
        nav_last.enable();
        /* if(parseInt(caseObject.position)-parseInt(caseObject.recordCount)<=0){
          nav_first.disable();
         nav_previous.disable();
         }*/
        caseObject.position = parseInt(caseObject.position) - parseInt(caseObject.recordCount);
        genericFunction();

    }
}

/*function nav_first_Click(eventObject) {
    nav_first.disable();
    nav_previous.disable();
    nav_next.enable();
    nav_last.enable();
    caseObject.position = 0;
    genericFunction();
}*/

function assign_btn_Click(eventObject) {
    var callIdList = "";
    var rows = caseTbl.getCheckedRows();
    for (var i = 0; i < rows.length; i++) {
        callIdList += callId[rows[i].index].getValue() + ",";
    }
    cordys.setNodeText(UserActionOnCaseModel.getMethodRequest(), ".//*[local-name()='callIdList']", callIdList);
    cordys.setNodeText(UserActionOnCaseModel.getMethodRequest(), ".//*[local-name()='action']", "ASSIGN");
    UserActionOnCaseModel.reset();
    if (!UserActionOnCaseModel.soapFaultOccurred) {
        if (callIdList != "") {
            xo__xElementbarButton__1_Click();
            application.notify("Cases Assigned Successfully");
        } else
            application.notify("Please select the case");
    } else {
        application.notify("Cases Assignment failed");
    }
}

function getUserName() {
    var userDN = system.getUser().authUserDN;
    return userDN.substring(3, userDN.indexOf(','));
}

function revoke_btn_Click(eventObject) {
    var callIdList = "";
    var rows = caseTbl.getCheckedRows();
    for (var i = 0; i < rows.length; i++) {
        callIdList += callId[rows[i].index].getValue() + ",";
    }
    cordys.setNodeText(UserActionOnCaseModel.getMethodRequest(), ".//*[local-name()='callIdList']", callIdList);
    cordys.setNodeText(UserActionOnCaseModel.getMethodRequest(), ".//*[local-name()='action']", "REVOKE");
    UserActionOnCaseModel.reset();
    if (!UserActionOnCaseModel.soapFaultOccurred) {
        if (callIdList != "") {
            xo__xElementbarButton__1_Click();
            application.notify("Cases Revoked Successfully");
        } else
            application.notify("Please select the case");
    } else {
        application.notify("Cases Revoked failed");
    }
}

function reset() {
    searchCallId.setValue("");
    searchCallTypeId.setValue("");
    searchContractNoId.setValue("");
    //searchPolicyNoId.setValue("");
    searchSubTypeId.setValue("");
}

function searchResetBtn_Click(eventObject) {
    reset();

    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='vendorId']", vendorId);
    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='caseType']", caseType);

    //Search Parameters
    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='callType']", searchCallTypeId.getValue());
    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='subType']", searchSubTypeId.getValue());
    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='callId']", searchCallId.getValue());
    //cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='policyNo']", searchPolicyNoId.getValue());
    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='policyNo']", "");
    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='contractNo']", searchContractNoId.getValue());

    GetVendorAllocatedDataCountModel.reset();
    caseObject.totalRecordsCount = cordys.getNodeText(GetVendorAllocatedDataCountModel.getData(), ".//*[local-name()='getVendorAllocatedDataCount']", "", "");


    if (parseInt(caseObject.totalRecordsCount) >= 15) {
     //   nav_first.disable();
      //  nav_previous.disable();
      //  nav_next.enable();
      //  nav_last.enable();
    } else {
      //  nav_first.disable();
     //   nav_previous.disable();
      //  nav_next.disable();
      //  nav_last.disable();
    }
    caseObject.position = 0;
    caseObject.recordCount = 15;
    genericFunction();
}

function searchBtn_Click(eventObject) {

    if (caseOpenCheck.getValue() == "1" && save_as_draft2.getValue() == "0") {
        cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='vendorId']", vendorId + "#" + "CASE OPEN#");
    } else if (save_as_draft2.getValue() == "1" && caseOpenCheck.getValue() == "0") {
        cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='vendorId']", vendorId + "#" + "" + "#" + "SAVE DRAFT");
    } else if (save_as_draft2.getValue() == "1" && caseOpenCheck.getValue() == "1") {
        cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='vendorId']", vendorId + "#" + "CASE OPEN" + "#" + "SAVE DRAFT");
    } else if (caseOpenCheck.getValue() != "1" && save_as_draft2.getValue() != "1") {
        cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='vendorId']", vendorId);
    }
    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='caseType']", caseType);
    //Search Parameters
    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='callType']", searchCallTypeId.getValue());

    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='subType']", searchSubTypeId.getValue());

    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='callId']", searchCallId.getValue());

    // cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='policyNo']", searchPolicyNoId.getValue());
    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='policyNo']", "");

    cordys.setNodeText(GetVendorAllocatedDataCountModel.getMethodRequest(), ".//*[local-name()='contractNo']", searchContractNoId.getValue());



    GetVendorAllocatedDataCountModel.reset();

    caseObject.totalRecordsCount = cordys.getNodeText(GetVendorAllocatedDataCountModel.getData(), ".//*[local-name()='getVendorAllocatedDataCount']", "", "");


    
    caseObject.position = 0;
    caseObject.recordCount = 15;
    genericFunction();
}
//This function isActiveFlag Added By Aakash on 12-09-2017
function caseTbl_OnRowChecked(eventObject) {

    var checkedRows = caseTbl.getCheckedRows();

    var callIdVal = callId[eventObject.rowIndex].getValue();
    var callIdValue = cordys.getNodeText(GetVendorAllocatedDataModel.getData(), ".//*[local-name()='callId']", callIdVal);
    cordys.setNodeText(GetHoldingFlag.getMethodRequest(), ".//*[local-name()='callIdParam']", callIdValue);
    GetHoldingFlag.reset();
    var holdingFlag = cordys.getNodeText(GetHoldingFlag.getData(), ".//*[local-name()='HOLDING_FLAG']");
    //added by sushmita on 22-09-2017 to hide/show buttons based on roles
    var userRole = cordys.getNodeText(GetPoUserMasterCompleteObjectModel.getData(), ".//*[local-name()='USER_ROLE']", "", "");
    if (holdingFlag == "Y" && (userRole == 'StakeHolderMaker' || userRole == 'ADMIN')) {
        release_btn.show();
        release_btn.enable();
        hold_btn.hide();
    } else if (holdingFlag != "Y" && (userRole == 'StakeHolderMaker' || userRole == 'ADMIN')) {
        hold_btn.show();
        hold_btn.enable();
        release_btn.hide();
    } else if (userRole == 'StakeholderChecker') {
        // hold_btn.hide();
        //  release_btn.hide();
        // assign_btn.show();
        reject_btn.show();
    }

    if (checkedRows.length == 0) {
        release_btn.hide();
        hold_btn.hide();
    }
    if (checkedRows.length > 1) {
        for (var i = 0; i < checkedRows.length; i++) {
            var rowIndex2 = checkedRows[i].index;
            var presentRow = eventObject.rowIndex;
            if (rowIndex2 != presentRow) {
                rowIndex1 = rowIndex2;
            }
        }
        if (rowIndex1 > 0) {
            caseTbl.checkRow(rowIndex1, false);
        }
    }

}


//This function isActiveFlag Added By Aakash on 12-09-2017
function hold_btn_Click(eventObject) {
    var userRole = cordys.getNodeText(GetPoUserMasterCompleteObjectModel.getData(), ".//*[local-name()='USER_ROLE']", "", "");
    var callID = "";
    var currentRow = caseTbl.getCheckedRows();
    callID = callId[currentRow[0].index].getValue();
    if (userRole == "StakeHolderMaker") {
        cordys.setNodeText(HoldReleaseDecisionOnCaseModel.getMethodRequest(), ".//*[local-name()='callId']", callID);
        cordys.setNodeText(HoldReleaseDecisionOnCaseModel.getMethodRequest(), ".//*[local-name()='action']", 'HOLD');
        HoldReleaseDecisionOnCaseModel.reset();
        if (!HoldReleaseDecisionOnCaseModel.soapFaultOccurred) {
            if (callID != "") {
                xo__xElementbarButton__1_Click();
                application.notify("The case is held successfully");
                hold_btn.hide();
            } else
                application.notify("Please select the case");
        } else {
            application.notify("Holding failed. Please Contact the admin");
        }
    } else if (userRole == "ADMIN" || userRole == "VendorManager") {
        cordys.setNodeText(HoldReleaseDecisionOnCaseModel.getMethodRequest(), ".//*[local-name()='callId']", callID);
        cordys.setNodeText(HoldReleaseDecisionOnCaseModel.getMethodRequest(), ".//*[local-name()='action']", 'HOLD');
        HoldReleaseDecisionOnCaseModel.reset();
        if (!HoldReleaseDecisionOnCaseModel.soapFaultOccurred) {
            if (callID != "") {
                xo__xElementbarButton__1_Click();
                application.notify("The case is held successfully");
                hold_btn.hide();
            } else
                application.notify("Please select the case");
        } else {
            application.notify("Holding failed. Please Contact the admin");
        }
    }
}
//This function isActiveFlag Added By Aakash on 12-09-2017
function release_btn_Click(eventObject) {
    var callID = "";
    var currentRow = caseTbl.getCheckedRows();
    var userRole = cordys.getNodeText(GetPoUserMasterCompleteObjectModel.getData(), ".//*[local-name()='USER_ROLE']", "", "")
    callID = callId[currentRow[0].index].getValue();
    if (userRole == "StakeHolderMaker") {
        cordys.setNodeText(HoldReleaseDecisionOnCaseModel.getMethodRequest(), ".//*[local-name()='callId']", callID);
        cordys.setNodeText(HoldReleaseDecisionOnCaseModel.getMethodRequest(), ".//*[local-name()='action']", 'RELEASE');
        HoldReleaseDecisionOnCaseModel.reset();
        if (!HoldReleaseDecisionOnCaseModel.soapFaultOccurred) {
            if (callID != "") {
                xo__xElementbarButton__1_Click();
                application.notify("The case is released successfully");
                release_btn.hide();
            } else
                application.notify("Please select the case");
        } else {
            application.notify("Releasing failed. Please Contact the admin");
        }
    } else if (userRole == "ADMIN") {
        cordys.setNodeText(HoldReleaseDecisionOnCaseModel.getMethodRequest(), ".//*[local-name()='callId']", callID);
        cordys.setNodeText(HoldReleaseDecisionOnCaseModel.getMethodRequest(), ".//*[local-name()='action']", 'RELEASE');
        HoldReleaseDecisionOnCaseModel.reset();
        if (!HoldReleaseDecisionOnCaseModel.soapFaultOccurred) {
            if (callID != "") {
                xo__xElementbarButton__1_Click();
                application.notify("The case is released successfully");
                release_btn.hide();
            } else
                application.notify("Please select the case");
        } else {
            application.notify("Releasing failed. Please Contact the admin");
        }
    }
}
//This function isActiveFlag added by Sushmita on 22-09-2017 for StakeholderChecker to accept the decision of StakeholderMaker
function accept_btn_Click(eventObject) {
    var callID = "";
    var makerDecisionFlag = "";
    var currentRow = caseTbl.getCheckedRows();
    /*for(var i=0;i<currentRow.length;i++)
    {
     callID+=callId[currentRow[i].index].getValue() +",";
     makerDecisionFlag= makerDecision[currentRow[i].index].getValue();
    }*/
    if (currentRow.length == 0) {
        alert("Please select the case to accept the decision");
        return;
    }
    callID = callId[currentRow[0].index].getValue();
    makerDecisionFlag = makerDecision[currentRow[0].index].getValue();

    cordys.setNodeText(HoldReleaseDecisionOnCaseModel.getMethodRequest(), ".//*[local-name()='callId']", callID);

    cordys.setNodeText(HoldReleaseDecisionOnCaseModel.getMethodRequest(), ".//*[local-name()='action']", 'ACCEPT');

    //cordys.setNodeText(HoldReleaseDecisionOnCaseModel.getMethodRequest(), ".//*[local-name()='remarks']", rejectRemarks);
    HoldReleaseDecisionOnCaseModel.reset();
    if (!HoldReleaseDecisionOnCaseModel.soapFaultOccurred) {
        if (callID != "") {
            xo__xElementbarButton__1_Click();
            if (makerDecisionFlag == 'Y')
                application.notify("The case is held successfully");
            else
                application.notify("The case is released successfully");
            hold_btn.hide();
        } else
            application.notify("Please select the case");
    } else {
        application.notify("Holding failed. Please Contact the admin");
    }
}

function reject_btn_Click(eventObject) {

    var checkerRemarks = prompt("Please enter your remarks:");


    var callID = "";
    var makerDecisionFlag = "";
    var currentRow = caseTbl.getCheckedRows();
    /*for(var i=0;i<currentRow.length;i++)
        {
       callID+=callId[currentRow[i].index].getValue() +",";
        makerDecisionFlag= makerDecision[currentRow[i].index].getValue();
        }*/

    if (currentRow.length == 0) {
        alert("Please select the case to accept the decision");
        return;
    }
    if (checkerRemarks != "") {
        callID = callId[currentRow[0].index].getValue();
        makerDecisionFlag = makerDecision[currentRow[0].index].getValue();

        cordys.setNodeText(HoldReleaseDecisionOnCaseModel.getMethodRequest(), ".//*[local-name()='callId']", callID);


        cordys.setNodeText(HoldReleaseDecisionOnCaseModel.getMethodRequest(), ".//*[local-name()='action']", 'REJECT');
        cordys.setNodeText(HoldReleaseDecisionOnCaseModel.getMethodRequest(), ".//*[local-name()='remarks']", checkerRemarks);


        HoldReleaseDecisionOnCaseModel.reset();
        var checkerDecision = "";
        if (makerDecisionFlag == "Y")
            checkerDecision = "RELEASE";
        else
            checkerDecision = "HOLD";
        if (!HoldReleaseDecisionOnCaseModel.soapFaultOccurred) {
            if (callID != "") {

                application.notify("Maker decision is rejected");
                hold_btn.hide();

            } else
                application.notify("Please select the case");

        } else {
            application.notify("Holding failed. Please Contact the admin");
        }
    }
}

function uploader_onBeforeUpload(eventObject) {

}

function xo__xElementbarButton__1_Click(eventObject) {
    GetVendorAllocatedDataModel.reset();
    genericFunction();



}

function uploadButton_Click(eventObject) {
    if (onlyFileName != "") {
       

        var req = UploadAndReadBulkFileModel.getMethodRequest();
        cordys.setNodeText(req, ".//*[local-name()='FILE_NAME']", onlyFileName, "");
        cordys.setNodeText(req, ".//*[local-name()='FILE_CONTENT']", "Upload:FileContent1", "");
        cordys.setNodeText(req, ".//*[local-name()='PURPOSE']", "HOLD_RELEASE", "");

        uploader.request = req;
        uploader.setShowStatus(true);
        uploader.uploadFile();
        show_confirm();
    } else {
        application.notify("Please select a file.");
    }
}

function show_confirm() {
    if (fileExt == "xls" || fileExt == "xlsx") {
        var r = confirm("Are you sure you want to upload " + onlyFileName + " ?");
        if (r == true) {
            uploader.uploadFile();
            application.container.close();

        } else {
            return;
        }
    } else {
        application.notify("Please select an excel file.");
        return;
    }
}

function getFileExtension(fileName) {
    return (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined;
}

function getFileName(filePath) {
    if (filePath) {
        var pos = filePath.lastIndexOf("\\") != -1 ? filePath.lastIndexOf("\\") : filePath.lastIndexOf("/");
        if (pos != -1) {
            return filePath.substring(pos + 1);
        } else {
            return filePath;
        }
    }
    return filePath;
}

function uploader_onUpload(eventObject) {
    var errorString = cordys.getNodeText(eventObject.response, ".//*[local-name()='faultstring']", "", "");
    eventObject.showError = false;
    if (eventObject.status) {
        application.notify("File successfully uploaded");
        uploadStatus = cordys.getNodeText(eventObject.response, ".//*[local-name()='status']", "", "");
        //alert(uploadStatus);
    } else {

        application.showError(errorString);

    }

}

function uploader_onChange(eventObject) {
    if (eventObject.type == "Change" && eventObject.fileValue) {
        fileName = eventObject.fileValue;
        fileExt = getFileExtension(fileName);
        onlyFileName = getFileName(fileName);
    }
}

function downloadBtn_Click(eventObject) {
    downloadReq = cordys.cloneXMLDocument(downloadSample.XMLDocument);
    cordys.setNodeText(downloadReq, ".//*[local-name()='PURPOSE']", "HOLD_RELEASE");
    download1.request = downloadReq;
    download1.searchPath = "<downloadSampleFiles>";
    download1.contentType = "application/vnd.ms-excel";
    download1.fileName = "Sample Hold Release File.xls";
    download1.openInNewWindow = "false";
    download1.organization = application.organization.toLowerCase();
    //download1.dispositionType = "attachment";
    download1.downloadFile();
}

function searchParametersForAllocateAll() {
    //String vendorId, String caseType, String callType, String subType, String callId, String policyNo, String contractNo

    searchParamsString = "vendorId:" + vendorId + ",";
    searchParamsString = searchParamsString + "caseType:" + caseType + ",";
    searchParamsString = searchParamsString + "callType:" + searchCallTypeId.getValue() + ",";
    searchParamsString = searchParamsString + "subType:" + searchSubTypeId.getValue() + ",";
    searchParamsString = searchParamsString + "callId:" + searchCallId.getValue() + ",";
    //searchParamsString=searchParamsString+"policyNo:"+searchPolicyNoId.getValue()+",";
    searchParamsString = searchParamsString + "policyNo:,";
    searchParamsString = searchParamsString + "contractNo:" + searchContractNoId.getValue();
    //searchParamsString=searchParamsString+"status:"+laSpoolStatus.getValue();
}

function downloadBulkButton_Click(eventObject) {
    searchParametersForAllocateAll();
    var bulkdownloadreq = WriteBulkXLSFileModel.getMethodRequest();
    //added by rakesh for hold download param
    applicationid=application.applicationId;
    if (applicationid== "stakeholderApprovalId")
        cordys.setNodeText(bulkdownloadreq, ".//*[local-name()='PURPOSE']", "HOLD_RELEASE_DOWNLOAD");
    else
        cordys.setNodeText(bulkdownloadreq, ".//*[local-name()='PURPOSE']", "ALLOCATED_POLICY_DETAILS");
    cordys.setNodeText(bulkdownloadreq, ".//*[local-name()='PARAMLIST']", searchParamsString);

    download1.request = bulkdownloadreq;
    download1.searchPath = "<writeBulkXLSFile>";
    download1.contentType = "application/vnd.ms-excel";
    //added by rakesh for hold download param
    if (applicationid== "stakeholderApprovalId")
        download1.fileName = "Hold Release Details.xls";
    else
        download1.fileName = "Allcoated Policy Details.xls";
    download1.openInNewWindow = "false";
    download1.organization = application.organization.toLowerCase();
    //download1.dispositionType = "attachment";
    download1.downloadFile();

}


function searchCallTypeId_Change(eventObject) {
    if (eventObject.srcElement.getValue() != '') {
        cordys.setNodeText(GetSubTypeForAllocationModel.getMethodRequest(), ".//*[local-name()='callType']", eventObject.srcElement.getValue());
        GetSubTypeForAllocationModel.reset();
        var selectOpt = {
            value: "",
            description: "---Select---"
        };
        searchSubTypeId.addOption(selectOpt, false, 0, false);
        searchSubTypeId.setValue("");
    }
}

function Form_Init(eventObject) {
    var userName = system.getUser().organizations[application.organization].userDN.split(",")[0].substring(3);
    if (userName == "anonymous") {
        alert("Unauthotrized Access");
        window.parent.location.href = "home/payout/";
        return false;
    }
}


function close_Bank_Handler() {
    genericFunction();
}L