var ifowner = "";
var bankDetails = "false";
var bankArray = new Array();
var aIndex = 0;
var Flag = 0;
var delFlag = 0;
var data = new Object();
var data1 = new Object();
var Err_Flag = 0;
var M = "";
var callId;
var tempCallId;
var DataEntry;
var custFullName;
var validateFlag = "true";
var dataUI = new Object();
var laseq_no;
var payout_amt_global;
var policyNo = "";
var callType = "";
var subType = "";
var d_callId = "";
var sumAssured = "";
var assigneeId = "";

function markMandatory(control) {
    control.setLabel("" + cordys.getTextContent(control.getLabel()) + "<font color='red'>*</font>")
}

function Form_Init(eventObject) {
    var userName = system.getUser().organizations[application.organization].userDN.split(",")[0].substring(3);
    if (userName == "anonymous") {
        alert("Unauthotrized Access");
        window.parent.location.href = "home/payout/";
        return false;
    }

    markMandatory(chdrnum);
    markMandatory(remarks);
    markMandatory(_suspense_amt);
    markMandatory(death_client_name);
    markMandatory(death_clientid);
    markMandatory(death_health_clientrole);
    markMandatory(death_health_status);
    markMandatory(error_remarks1);

    LA_SPOOLTable.hideColumn(14);
    LA_SPOOLTable.hideColumn(15);
    LA_SPOOLTable.hideColumn(16);
    LA_SPOOLTable.hideColumn(17);
    death_health_group.hide();
    death_calltype.hide();
    death_contractno.hide();
    death_createdon.hide();
    death_createdby.hide()
    callIdOp.hide();
    IFOWNER.hide();
    _status1.hide()
    output1.hide();
    group1.hide();
    LA_SPOOLTable.hideColumn(11);
    _suspense_amt.hide();
    mandate_enquiry_check.hide();
    role.hide();
    spool_seq_no.hide();
    seq_no.hide();
    facthouse.hide();
    group3.hide();
    reset.disable();
    application.container.maximize();
    LA_TRANSACTION_DETAILSGroup.hide();
    mandatecreation_button.hide();
    mandatelink_button.hide();
    paymentauthorization_button.hide();
    paymentcreation_button.hide();
    _remarks.hide();
    //me_clear_button.disable();
    _mode_of_payment.hide();
    acc_no.hide();
    _micr.hide();
    _ifsc.hide();
    _errorremarks.hide();
    error_remarks1.hide();
    micr_code.disable();
    ifsc_code.disable();
    PAYOUT_AUDIT_DETAILSGroup.hide();
    CLIENT_BANK_ENQUIRY_FRAME.hide();
    CLIENT_BANK_ENQUIRY_GROUP.hide();
    add_button.hide();
    dataEntry.hide();
    check2op.hide();
    enquiryRadio.hide();
    _status4.hide();
    save_as_draft1.hide();

    if (application.event.data) {
        // check1.disable();
        chdrnum.setValue(application.event.data.contractNo);
        freelook_callId = application.event.data.freelook_callId;
        policyNo = application.event.data.caseTbl_policyNo;
        callType = application.event.data.callType;
        subType = application.event.data.subType;
        data1.CHDRNUM = chdrnum.getValue();
        // application.select(omni_xml_ID.XMLDocument.documentElement,data1,null);
        //   chdrnum.disable();
    }
    clearAll();
    //  GetSpoolDetailsModel.clear();
    cordys.setNodeText(GetSpoolDetailsModel.getMethodRequest(), ".//*[local-name()='Contract_No']", application.event.data.contractNo);
    GetSpoolDetailsModel.reset();
    var data = GetSpoolDetailsModel.getData();
    var laspool = cordys.selectXMLNode(data, ".//*[local-name()='CHDRNUM']");
    laspoolcallid = cordys.selectXMLNode(data, ".//*[local-name()='CALLID']");
    cordys.setNodeText(GetClearStatusModel.getMethodRequest(), ".//*[local-name()='ContractNo']", application.event.data.contractNo, "");
    var clearSt = cordys.getNodeText(GetClearStatusModel.getData(), ".//*[local-name()='getClearStatus']", "");
    if (!laspool && check1.getValue() != "1") {
        //  application.notify(" Contract number doesn't exist ");
        reset.enable();
        return;
    } else if (clearSt != "0") {
        reset.enable();
        return;
    }

}

function go_Click(eventObject) {
    clearAll();
    GetSpoolDetailsModel.clear();
    cordys.setNodeText(GetSpoolDetailsModel.getMethodRequest(), ".//*[local-name()='Contract_No']", chdrnum.getValue());
    GetSpoolDetailsModel.reset();
    var data = GetSpoolDetailsModel.getData();
    var laspool = cordys.selectXMLNode(data, ".//*[local-name()='CHDRNUM']");
    cordys.setNodeText(GetClearStatusModel.getMethodRequest(), ".//*[local-name()='ContractNo']", chdrnum.getValue(), "");
    var clearSt = cordys.getNodeText(GetClearStatusModel.getData(), ".//*[local-name()='getClearStatus']", "");
    if (!laspool && check1.getValue() != "1") {
        application.notify(" Contract number doesn't exist ");
        reset.enable();
        return;
    } else if (clearSt != "0") {
        reset.enable();
        return;
    }
}

function clear_Click(eventObject) {
    clearAll();
    GetSpoolDetailsModel.clear();
    GetLaSpoolObjectModel.clear();
    death_health_group.enable();
    check1.setValue(0);
}

function clearAll() {
    // GetLaTransactionDetailsObjectModel.clear();
    GetLaTransactionDetailsObjectsModel.clear();
    approve.enable();
    reject.enable();
    reset.disable();
    LA_TRANSACTION_DETAILSGroup.hide();
    LA_TRANSACTION_DETAILSGroupClear();
    remarks.setValue("");
    group1.hide();
    group3.hide();
    _suspense_amt.setValue();
    _suspense_amt.hide();
    mandate_enquiry_check.hide();
    assignee1.setValue("");
    assignee1.enable();
    remarks.setValue("");
    bank_account_no.enable();
    credit_card_no.enable();
    annuity_card_no.enable();
    MandateInquiryBPMModel.clear();
    Err_Flag = 0;
    error_remarks1.hide();
    micr_code.disable();
    ifsc_code.disable();
    CLIENT_BANK_ENQUIRY_GROUP.hide();
    //document.all["CLIENT_BANK_ENQUIRY_FRAME"].hide();
    LA_SPOOLGroup.expand();
    clearImage();

}

function reset_Click(eventObject) {
    cordys.setNodeText(UpdateStatusNewModel.getMethodRequest(), ".//*[local-name()='ContractNo']", chdrnum.getValue(), "");
    UpdateStatusNewModel.reset();

    var status_result = cordys.getNodeText(UpdateStatusNewModel.getData(), ".//*[local-name()='UpdateStatusNew']", "", "");
    if (status_result == "True") {
        application.notify("Contract has been reset !! ")
    } else
        application.notify(status_result);
    reset.disable();
}

function check1_Change(eventObject) {
    if (check1.getValue() == 1) {
        death_health_group.show();
        death_health_group.create();
        reset.disable();
        //go.disable();

    } else {
        death_health_group.hide();
        GetLaSpoolObjectModel.refreshAllViews();
    }
    //check2_Change();
}

/*function check2_Change(eventObject)
{
    if (check2.getValue()=="0" && check1.getValue()=="1")
    {
        paymentcreation_button.hide();
        paymentauthorization_button.hide();
    }
    else
    {
        paymentcreation_button.show();
        paymentauthorization_button.show();
    }
}*/

function save_button_Click(eventObject) {
    var date = new Date();
    death_contractno.setValue(chdrnum.getValue());
    death_calltype.setValue("Death/Health claim");
    death_createdby.setValue(window.parent.userId);
    death_createdon.setValue(date)
    check2op.setValue(check2.getValue());
    GetLaSpoolObjectModel.synchronize();
    GetLaSpoolObjectModel.reset();

    if (death_client_name.getValue() != "" && death_clientid.getValue() != "" && death_health_clientrole.getValue() != "" && death_health_status.getValue() != "") {
        if (!GetLaSpoolObjectModel.soapFaultOccurred) {
            application.notify("Data saved successfully!");
            GetSpoolDetailsModel.reset();
            death_health_group.disable();
        }
    } else
        application.notify("Please fill all the mandatory fields");

}

function LA_SPOOLTable_OnSelectRow(eventObject) {
    clearAll();
    var data = GetSpoolDetailsModel.getData();
    var ano = _assignee_no1[LA_SPOOLTable.getIndex()].getValue();

    if ((ano == null) || (ano == "") || (ano == "null")) {
        assignee1.setValue("owner");
        assignee1.disable();
    } else {
        assignee1.setValue("assignee");
        assignee1.enable();
    }
}

function imageClick_Click(eventObject) {
    /*var flag=0;
  if(flag==0)
  {
 
  //var contractNumber=chdrnum.getValue();
  cordys.setNodeText(ConnectToOmniModel.getMethodRequest(),".//*[local-name()='contractNo']",chdrnum.getValue(),"");
    ConnectToOmniModel.reset();
    
var ImgUrl = cordys.getNodeText(ConnectToOmniModel.getData(),".//*[local-name()='connectToOmni']","");
 // var OmniviewImage=cordys.cloneXMLDocument(Omniview.XMLDocument);
  //cordys.setNodeText(OmniviewImage,".//*[local-name()='url']",ImgUrl);
 // application.select(OmniviewImage.documentElement);
 window.open(ImgUrl,'_blank')
  
  }
  
 else
 {   
    //alert(chdrnum.getValue());
    data.CHDRNUM =chdrnum.getValue();
    //application.select(omni_xml_ID.XMLDocument.documentElement,data,null);
   // validate();
   //alert(frames[0].document.getElementById("imageDiv"));
  

}*/

}

function validate() {
    //Do the validation only if the selected tab is not "myTab2"
    if (event.OMNI_IMAGE_FRAME != "OMNI_IMAGE_FRAME") {
        //Get the tab content. This is possible only from the window.frames collection
        var content = window.frames["OMNI_IMAGE_FRAME"];
        if (content) {
            //Get the handle for the text box from the frame
            var textBox = content.document.all['input1'];
            //Check if the value is empty. If it is, then get into this loop
            if (textBox.value == "") {
                //Alert the error
                application.notify("Text box value cannot be empty");
                //Use select method to select the tab 2 back
                //testTab.getTab("myTab2").select();
                //Set the focus on the textbox
                //textBox.focus();
            }
        }
    }
}

function clearImage() {
    // application.select(omni_xml_ID.XMLDocument.documentElement,null);
}


function approve_Click(eventObject) {
    //added by vikash
    if (drtApproval.getValue() == '' && callType == 'Payouts' &&(subType == 'Freelook Refund' || subType == 'Fraud Refund' || subType == 'Freelook Misselling Refund' || subType == 'Refund of premiums')){

        alert("Please select DRT Approval");
        return;
    }

    LA_SPOOLTable.disable();
    //  add_button.enable(); 
    LA_TRANSACTION_DETAILSTable.hide();
    submit.enable();
    mandatecreation_button.hide();
    mandatelink_button.hide();
    paymentauthorization_button.hide();
    paymentcreation_button.hide();
    CLIENT_BANK_ENQUIRY_GROUP.show();
    CLIENT_BANK_ENQUIRY_FRAME.show();
    sacs_code.show();
    sacs_type.show();
    payout_type.show();

    if (assignee1.getValue() == "") {
        application.notify("Please select client role before proceeding.");
        assignee1[0].setFocus();
        return;
    }

    LA_TRANSACTION_DETAILSGroup.show();
    //LA_TRANSACTION_DETAILSGroup.create(); 

    group3.show();
    _suspense_amt.show();
    mandate_enquiry_check.show();
    mandate_enquiry_check.checked = true;
    mandate_enquiry_check_Change(eventObject);


    var role = cordys.getNodeText(GetRoleModel.getData(), ".//*[local-name()='getRole']", "");
    var laspoolcallid = callIdOp.getValue();

    var methodReq = GetSpoolSeqModel.getMethodRequest();
    cordys.setNodeText(methodReq, ".//*[local-name()='callId']", laspoolcallid);
    cordys.setNodeText(methodReq, ".//*[local-name()='role']", role);
    GetSpoolSeqModel.setMethodRequest(methodReq);
    GetSpoolSeqModel.reset();
    laseq_no = cordys.getNodeText(GetSpoolSeqModel.getData(), ".//*[local-name()='getSpoolSeq']", "");


    if (assignee1.getValue() == 'owner') {

        custFullName = _owner_name[LA_SPOOLTable.getIndex()].getValue();
        name_of_bank_act_holder.setValue(custFullName);
        //custFullName=cordys.getNodeText( GetSpoolDetailsModel.getData(),".//*[local-name()='CUST_FULL_NAME']")
        // name_of_bank_act_holder.setValue(custFullName);
    } else if (assignee1.getValue() == 'assignee') {

        //added by rakesh on 28-2-2018
        //custFullName=cordys.getNodeText( GetSpoolDetailsModel.getData(),".//*[local-name()='CUST_FULL_NAME']")
        //name_of_bank_act_holder.setValue(custFullName);
        custFullName = assignee_name[LA_SPOOLTable.getIndex()].getValue();
        name_of_bank_act_holder.setValue(custFullName);
    }
    if (laseq_no != "") {

        cordys.setNodeText(GetLaTransactionDetailsObjectModel.getMethodRequest(), ".//*[local-name()='SEQ_NO']", laseq_no);
        GetLaTransactionDetailsObjectModel.reset();
    } else {
        LA_TRANSACTION_DETAILSGroup.create();
    }

    payout_amount.setValue(_suspense_amt.getValue());
    name_of_bank_act_holder.setValue(custFullName);
    //Auto Setting SAC Code,SAC Type and Payout Type 
    var SACmethodReq = getActiveSacTypeModel.getMethodRequest();
    cordys.setNodeText(SACmethodReq, ".//*[local-name()='call_type']", call_type.getValue());
    cordys.setNodeText(SACmethodReq, ".//*[local-name()='sub_type']", sub_type.getValue());
    getActiveSacTypeModel.setMethodRequest(SACmethodReq);
    getActiveSacTypeModel.reset();

    var sc = cordys.getNodeText(getActiveSacTypeModel.getData(), ".//*[local-name()='SACSCODE']")
    var st = cordys.getNodeText(getActiveSacTypeModel.getData(), ".//*[local-name()='SACSTYPW']");
    var pt = cordys.getNodeText(getActiveSacTypeModel.getData(), ".//*[local-name()='TYPEOFPAYOUT']");
    sacs_code.setValue(sc);
    sacs_type.setValue(st);
    payout_type.setValue(pt);

    approve.disable();
    reject.disable();
    _suspense_amt.setValue(payment_amount.getValue());
    payout_amount.setValue(payment_amount.getValue());
    payout_amt_global = payout_amount.getValue();
    call_id.setValue(callIdOp.getValue());

    account_type.setValue("Savings");
    LA_SPOOLGroup.collapse();
    
    //added by vikash for free lookup
    if (callType == 'Payouts' && (subType == 'Freelook Refund' || subType == 'Fraud Refund' || subType == 'Freelook Misselling Refund' || subType == 'Refund of premiums')) {
        cordys.setNodeText(FreeLookModel.getMethodRequest(), ".//*[local-name()='ApplicationNo']", policyNo);
        cordys.setNodeText(FreeLookModel.getMethodRequest(), ".//*[local-name()='CallId']", callId);
        FreeLookModel.reset();
        var errorNode = cordys.getNodeText(FreeLookModel.getData(), ".//*[local-name()='message']");
        if (errorNode != "Deatils saved successfully.") {
            alert(errorNode);
            return;
        } else {
            cordys.setNodeText(GetMedicalStampChargesModel.getMethodRequest(), ".//*[local-name()='callId']", freelook_callId);
            cordys.setNodeText(GetMedicalStampChargesModel.getMethodRequest(), ".//*[local-name()='policyNo']", policyNo);
            cordys.setNodeText(GetMedicalStampChargesModel.getMethodRequest(), ".//*[local-name()='drtApproval']", drtApproval.getValue());
            cordys.setNodeText(GetMedicalStampChargesModel.getMethodRequest(), ".//*[local-name()='userId']", system.getUser().organizations[application.organization].userDN.split(",")[0].substring(3));
            GetMedicalStampChargesModel.reset();
            var medicalNode = cordys.selectXMLNode(GetMedicalStampChargesModel.getData(), ".//*[local-name()='MEDICAL_CHARGES']", "");
            freelookDeductedAmt.setValue(cordys.getNodeText(medicalNode, ".//*[local-name()='PAYOUT_AMOUNT']", ""));
            medical.setValue(cordys.getNodeText(medicalNode, ".//*[local-name()='MEDICAL_CHARGES']", ""));
            stamp_duty.setValue(cordys.getNodeText(medicalNode, ".//*[local-name()='STAMP_DUTY']", ""));
            sumAssured = cordys.getNodeText(medicalNode, ".//*[local-name()='SUM_ASSURED']", "");
            assigneeId = cordys.getNodeText(medicalNode, ".//*[local-name()='ASSIGNEE_ID']", "");
        }
    }


}

function reject_Click(eventObject) {
    group1.show();
    LA_TRANSACTION_DETAILSGroup.hide();
    _suspense_amt.hide();
    group3.hide();
    approve.disable();
    reject.disable();
    LA_SPOOLTable.disable();
}

function submit_reject_bttn_Click(eventObject) {
    if (remarks.getValue() == null || remarks.getValue() == "") {
        application.notify("Please fill up Remarks !! ");
        return;
    } else {
        _status1.setValue("D");
        _remarks.setValue(remarks.getValue());
        GetSpoolDetailsModel.synchronize();
        application.notify(" Case is marked as discrepant");
        clearAll();
    }
}

function search_button_Click(eventObject) {

}


function LA_TRANSACTION_DETAILSGroupClear() {
    bank_name.setValue("");
    // branch_name.setValue("");
    bank_account_no.setValue("");
    micr_code.setValue("");
    ifsc_code.setValue("");
    credit_card_no.setValue("");
    annuity_card_no.setValue("");
    creditcard_bank.setValue("");
    creditcard_expdate.setValue("");
    _mandate_number.setValue("");
    //me_clear_button.disable();
    account_type.setValue("");
    name_of_bank_act_holder.setValue("");

    bank_account_no.enable();
    credit_card_no.enable();
    annuity_card_no.enable();
    add_button.setLabel("Add");

    error_remarks1.setValue("");
    error_remarks1.hide();
}

function pay_type_Change(eventObject) {
    //LA_TRANSACTION_DETAILSGroupClear();
}

//disabled by vignesh to allow free entry by D1,D2 and Vendor Manager

function add_button_Click(eventObject) {
    Flag = 0;
    if (pay_type.getValue() == "") {
        application.notify(" Please fill up Payment Type ");
        validateFlag = "false";
        return;
    }


    if (pay_type.getValue() == 1) {
        if (!((bank_name.getValue() == "") && (bank_account_no.getValue() == "") && (account_type.getValue() == "") && (micr_code.getValue() == ""))) {
            Check();
            if (Flag != 0)
                validateFlag = "false";
            return;
        }
    } else {

        Check();
        if (Flag != 0) {
            validateFlag = "false";
            return;
        }
        if (pay_type.getValue() == "B") {
            if (ifsc_code.getValue() == null || ifsc_code.getValue() == "") {
                application.notify(" Please fill up IFSC Code!");
                validateFlag = "false";
                return;
            }
        }
        if (pay_type.getValue() == 5) {
            var bn1 = bank_name.getValue();
            if (bn1.toLowerCase().indexOf("icici") == -1) {
                application.notify(" Bank Name should be ICICI ");
                validateFlag = "false";
                return;
            }
        }
    }

    if (pay_type.getValue() == 8) {
        if (credit_card_no.getValue() == "") {
            application.notify("Credit card no. can not be null!");
            validateFlag = "false";
            return;
        }
        if (creditcard_expdate.getValue() == "") {
            application.notify("Expiry date can not be null!");
            validateFlag = "false";
            return;
        }
    }
    if (pay_type.getValue() == 7) {
        if (annuity_card_no.getValue() == "") {
            application.notify("Annuity card no. can not be null!");
            validateFlag = "false";
            return;
        }
        if (creditcard_expdate.getValue() == "") {
            application.notify("Expiry date can not be null!");
            validateFlag = "false";
            return;
        }
    }

    if (payout_amount.getValue() <= 0) {
        application.notify("Payment amount should be positive!");
        validateFlag = "false";
        return;
    }

    if (sacs_code.getValue() == "") {
        application.notify("Please enter the sacs_code !");
        validateFlag = "false";
        return;
    }
    if (sacs_type.getValue() == "") {
        application.notify("Please enter the sacs_type !");
        validateFlag = "false";
        return;
    }
    if (payout_type.getValue() == "") {
        application.notify("Please enter the payout_type !");
        validateFlag = "false";
        return;
    }


    // Added to comment saccode and sactype
    /*
   //  if(call_type.getValue()== "Cheque Reprocessing")
      if(sub_type.getValue()!= "Surrender" && sub_type.getValue()!="Partial Withdrawal")
     {
         if(sacs_code.getValue()== "")
         {
             application.notify("For call type: Cheque Reprocessing, SACS Code can not be null");
			 validateFlag="false";
             return ;
         }
         if(sacs_type.getValue()== "")
         {
             application.notify("For call type: Cheque Reprocessing, SACS Type can not be null");
			 validateFlag="false";
             return ;
         }
     }
     */
    if (pay_type.getValue() == 1 || pay_type.getValue() == 5 || pay_type.getValue() == 9 || pay_type.getValue() == "B") {
        // alert("1");
        test();
        if (Flag != 0) {
            validateFlag = "false";
            return;
        }
    }
    validateFlag = "true";
    return;
    /*
    if(sub_type.getValue()=="Surrender" || sub_type.getValue()=="Partial Withdrawal" || sub_type.getValue()=="Freelook")
    {
        cordys.setNodeText(GetPaymentTypeModel.getMethodRequest(),".//*[local-name()='PaymentType']", _mode_of_payment.getValue());
        GetPaymentTypeModel.reset();         
        var paymentMode= cordys.getNodeText(GetPaymentTypeModel.getData(),".//*[local-name()='REQN_TYPE']", "");
        
        if(!((pay_type.getValue()==paymentMode) && (bank_account_no.getValue().replace(/\s/g, "")==acc_no.getValue().replace(/\s/g, "")) && (micr_code.getValue().replace(/\s/g, "")==_micr.getValue().replace(/\s/g, "")) && (ifsc_code.getValue().replace(/\s/g, "")==_ifsc.getValue().replace(/\s/g, ""))))
        {
            if(pay_type.getValue()!= paymentMode)
            {
                alert("Mismatch Payment type. \n1. LA SPOOL:" + paymentMode + "\n2. Manual Attach:" + pay_type.getValue());
            }
            if(pay_type.getValue()==7)
            {
                if(annuity_card_no.getValue().replace(/\s/g, "")!=acc_no.getValue().replace(/\s/g, ""))
                {
                    alert("Mismatch Annuity card No. \n1. LA SPOOL:" + acc_no.getValue() + "\n2. Manual Attach:" + annuity_card_no.getValue());
                }
            }
            if(pay_type.getValue()==8)
            {
                if(credit_card_no.getValue().replace(/\s/g, "")!=acc_no.getValue().replace(/\s/g, ""))
                {
                    alert("Mismatch Credit card No. \n1. LA SPOOL:" + acc_no.getValue() + "\n2. Manual Attach:" + credit_card_no.getValue());
                }
            }
            if(pay_type.getValue()==1 || pay_type.getValue()== 5 || pay_type.getValue()== 9 || pay_type.getValue()== "A" || pay_type.getValue()== "B")
            {
                if(bank_account_no.getValue().replace(/\s/g, "")!=acc_no.getValue().replace(/\s/g, ""))
                {
                    alert("Mismatch Account No. \n1. LA SPOOL:" + acc_no.getValue() + "\n2. Manual Attach:" + bank_account_no.getValue());
                }
            }
            if(micr_code.getValue().replace(/\s/g, "")!=_micr.getValue().replace(/\s/g, ""))
            {
                alert("Mismatch MICR Code. \n1. LA SPOOL:" + _micr.getValue() + "\n2. Manual Attach:" + micr_code.getValue());   
            }
            if(ifsc_code.getValue().replace(/\s/g, "")!=_ifsc.getValue().replace(/\s/g, ""))
            {
                alert("Mismatch IFSC Code. \n1. LA SPOOL:" + _ifsc.getValue() + "\n2. Manual Attach:" + ifsc_code.getValue());
            }
            
            error_remarks1.show();
            tranCallConfirm();
        }
        else
        {
            if(Err_Flag==1)
            {
                if(error_remarks1.getValue()=="")
                {
                    application.notify("Remarks field is mandatory, update remarks and procced");
                    return;
                }
            }
            
            updateLA_TRANSACTION_DETAILSTable()
            Err_Flag= 0;
        }
    }
    else
    {
        updateLA_TRANSACTION_DETAILSTable()
    }
    */

}


function delete_Button_Click(eventObject) {
    delFlag = 0;
    var rows = LA_TRANSACTION_DETAILSTable.getCheckedRows()
    LA_TRANSACTION_DETAILSTable.markToRemove(rows);
    LA_TRANSACTION_DETAILSTable.remove();
    add_button.setLabel("Add");
}

function LA_TRANSACTION_DETAILSTable_OnRowChecked(eventObject) {
    if (eventObject.checked) {
        //Make Sure that only one row is checked 

        var rows = LA_TRANSACTION_DETAILSTable.getCheckedRows();
        if (rows.length > 1) {
            var index1 = rows[0].index;
            var index2 = rows[1].index;
            //rows[0].cells[0].firstChild.checked=false; 
            //rows[1].cells[0].firstChild.checked=false; 
            LA_TRANSACTION_DETAILSTable.checkRow(index1, false);
            LA_TRANSACTION_DETAILSTable.checkRow(index2, false);
            LA_TRANSACTION_DETAILSTable.checkRow(eventObject.rowIndex, true);
        }

        var idx = eventObject.rowIndex;
        name_of_bank_act_holder.setValue(_name_of_bank_act_holder[idx].getValue());
        bank_account_no.setValue(_bank_account_no[idx].getValue());
        bank_name.setValue(_bank_name[idx].getValue());
        call_id.setValue(_call_id[idx].getValue());
        ifsc_code.setValue(_ifsc_code[idx].getValue());
        instructions.setValue(_instructions[idx].getValue());
        medical.setValue(_medical[idx].getValue());
        micr_code.setValue(_micr_code[idx].getValue());
        account_type.setValue(type_of_account[idx].getValue());
        payout_amount.setValue(_payout_amount[idx].getValue());
        stamp_duty.setValue(_stamp_duty[idx].getValue());
        bname.setValue(_bname[idx].getValue());
        // branch_name.setValue(_branch_name[idx].getValue()); 
        pay_type.setValue(_pay_type[idx].getValue());
        credit_card_no.setValue(_credit_card_no[idx].getValue());
        annuity_card_no.setValue(_annuity_card_no[idx].getValue());
        creditcard_expdate.setValue(cc_expdate[idx].getValue());
        //annuitycard_expdate.setValue(cc_expdate[idx].getValue());
        add_button.setLabel("Update");
        LA_TRANSACTION_DETAILSTable.setIndex(eventObject.rowIndex);
    } else {
        // GetLaTransactionDetailsObjectModel.clear(); 
        //LA_TRANSACTION_DETAILSGroup.create(); 
        payout_amount.setValue(_suspense_amt.getValue());
        if (assignee1.getValue() == 'owner') {
            name_of_bank_act_holder.setValue(cordys.getNodeText(GetSpoolDetailsModel.getData(), ".//*[local-name()='OWNER_NAME']", ""));
        } else if (assignee1.getValue() == 'assignee') {
            name_of_bank_act_holder.setValue(cordys.getNodeText(GetSpoolDetailsModel.getData(), ".//*[local-name()='ASSIGNEE_NAME']", ""));

        }

        add_button.setLabel("Add");
    }
}

function submit_Click(eventObject) {

    //added by vikash for saving details in medical cherge history table
            if(callType == 'Payouts' && (subType == 'Freelook Refund' || subType == 'Fraud Refund' || subType == 'Freelook Misselling Refund' || subType == 'Refund of premiums')){
            var date = new Date();
            UpdateCaseModel.clear();
            var medicalStampChargesHist = cordys.cloneXMLDocument(medicalStampChargeHist.XMLDocument);
            cordys.setNodeText(medicalStampChargesHist, ".//*[local-name()='CALLID']", freelook_callId);
            cordys.setNodeText(medicalStampChargesHist, ".//*[local-name()='POLICY_NO']", policyNo);
	    cordys.setNodeText(medicalStampChargesHist, ".//*[local-name()='MEDICAL_CHARGES']", medical.getValue());
	    cordys.setNodeText(medicalStampChargesHist, ".//*[local-name()='STAMP_DUTY']", stamp_duty.getValue());
	    cordys.setNodeText(medicalStampChargesHist, ".//*[local-name()='DRT_APPROVAL']", drtApproval.getValue());
            cordys.setNodeText(medicalStampChargesHist, ".//*[local-name()='SUM_ASSURED']", sumAssured);
	    cordys.setNodeText(medicalStampChargesHist, ".//*[local-name()='ASSIGNEE_ID']", assigneeId);
	    cordys.setNodeText(medicalStampChargesHist, ".//*[local-name()='PAYOUT_AMOUNT']", payout_amount.getValue());
	    cordys.setNodeText(medicalStampChargesHist, ".//*[local-name()='SUSPENSE_AMOUNT']", _suspense_amt.getValue());
            cordys.setNodeText(medicalStampChargesHist, ".//*[local-name()='MODIFIED_BY']", system.getUser().organizations[application.organization].userDN.split(",")[0].substring(3));
	    //cordys.setNodeText(medicalStampChargesHist, ".//*[local-name()='MODIFIED_ON']", date);
	    UpdateCaseModel.setMethodRequest(medicalStampChargesHist);
            UpdateCaseModel.reset();
            
            UpdateCaseModel.clear();
            var medicalStampCharges = cordys.cloneXMLDocument(medicalStampCharge.XMLDocument);
            cordys.setNodeText(medicalStampCharges, ".//*[local-name()='old']/*[local-name()='MEDICAL_STAMP_CHARGES']/*[local-name()='CALLID']", freelook_callId);
            cordys.setNodeText(medicalStampCharges, ".//*[local-name()='new']/*[local-name()='MEDICAL_STAMP_CHARGES']/*[local-name()='CALLID']", freelook_callId);
            cordys.setNodeText(medicalStampCharges, ".//*[local-name()='new']/*[local-name()='MEDICAL_STAMP_CHARGES']/*[local-name()='MEDICAL_CHARGES']", medical.getValue());
            cordys.setNodeText(medicalStampCharges, ".//*[local-name()='new']/*[local-name()='MEDICAL_STAMP_CHARGES']/*[local-name()='STAMP_DUTY']", stamp_duty.getValue());
            cordys.setNodeText(medicalStampCharges, ".//*[local-name()='new']/*[local-name()='MEDICAL_STAMP_CHARGES']/*[local-name()='PAYOUT_AMOUNT']", payout_amount.getValue());
            cordys.setNodeText(medicalStampCharges, ".//*[local-name()='new']/*[local-name()='MEDICAL_STAMP_CHARGES']/*[local-name()='MODIFIED_BY']", system.getUser().organizations[application.organization].userDN.split(",")[0].substring(3));
            //cordys.setNodeText(medicalStampCharges, ".//*[local-name()='new']/*[local-name()='MEDICAL_STAMP_CHARGES']/*[local-name()='MODIFIED_ON']", date);
            UpdateCaseModel.setMethodRequest(medicalStampCharges);
            UpdateCaseModel.reset();
            UpdateCaseModel.clear();
            }
    add_button.click();
    if (validateFlag == "false") {
        return;
    }
    delete_Button.disable();
    dataEntry.hide();
    // GetObjectByCallIdModel
    cordys.setNodeText(GetObjectByCallIdModel.getMethodRequest(), ".//*[local-name()='callId']", call_id.getValue());
    GetObjectByCallIdModel.reset();
    var stageId = cordys.getNodeText(GetObjectByCallIdModel.getData(), ".//*[local-name()='STAGE_ID']", "");
    //   var stageId=cordys.getNodeText(GetSpoolDetailsModel.getData(),".//*[local-name()='STAGE_ID']",""); 
    if (stageId === '1') {
        dataEntry.setValue("ENTRY1");
    } else if (stageId === '2') {
        dataEntry.setValue("ENTRY2");
    } else if (stageId === '3') {
        dataEntry.setValue("ENTRY3");
    }
    tempCallId = call_id.getValue();
    updateLA_TRANSACTION_DETAILSTable();
    var count = LA_TRANSACTION_DETAILSTable.getRows().length;
    var amount = 0;
    //Commented on 23-04-2018 as a fix for Suspense and Payout Amount comparison
    /*for(i=1;i<=count;i++) 
    { 
        if (_payout_amount[i].getValue() != "") 
        amount += parseFloat(_payout_amount[i].getValue()); 
        if (_medical[i].getValue()!= "") 
        amount -= parseFloat(_medical[i].getValue()); 
        if (_stamp_duty[i].getValue()!= "") 
        amount -= parseFloat(_stamp_duty[i].getValue());   
    }*/
    //added by vikash for free lookup
    if (callType != 'Payouts' && (subType != 'Freelook Refund' || subType != 'Fraud Refund' || subType != 'Freelook Misselling Refund' || subType != 'Refund of premiums')) {
        if (payout_amount.getValue() != "")
            amount += parseFloat(payout_amount.getValue());
        if (medical.getValue() != "")
            amount -= parseFloat(medical.getValue());
        if (stamp_duty.getValue() != "")
            amount -= parseFloat(stamp_duty.getValue());

        if (parseFloat(amount) > parseFloat(_suspense_amt.getValue())) {
            application.notify(" Total amount should be less than or equal to Suspense amount !!");
            return;
        }
    }

    if (Flag == 0) {
        output1.setValue(system.getUser().name);
        //added by Sushmita to update the value if ifowner in LA_SPOOL
        if (assignee1.getValue() == 'owner') {
            IFOWNER.setValue("YES");
        } else if (assignee1.getValue() == 'assignee') {
            IFOWNER.setValue("NO");
        }
        _status1.setValue("S")
        _errorremarks.setValue(error_remarks1.getValue());
        GetSpoolDetailsModel.synchronize();
        error_remarks1.setValue("");
        error_remarks1.hide();
        GetPayoutAuditDetailsObjectModel.synchronize();

        for (var b = 1; b <= count; b++) {
            //   _status2[b].setValue("S");
            if (DataEntry == 'ENTRY1')
                _status2[b].setValue("ENTRY1 DONE");
            else if (DataEntry == 'ENTRY2')
                _status2[b].setValue("ENTRY2 DONE");
            else if (DataEntry == 'ENTRY3')
                _status2[b].setValue("ENTRY3 DONE");
        }

        // commented by vignesh
        /*
       
        if(_pay_type[LA_TRANSACTION_DETAILSTable.getIndex()].getValue()=="")
        {
            application.notify("Payment Type can not be null");
            return;
        }
        else
        {
           created_by[LA_TRANSACTION_DETAILSTable.getIndex()].setValue(output1.getValue());
           GetLaTransactionDetailsObjectsModel.synchronize(); 
        }
       
        */
        created_by[LA_TRANSACTION_DETAILSTable.getIndex()].setValue(output1.getValue());
        Data_Entry[LA_TRANSACTION_DETAILSTable.getIndex()].setValue(DataEntry);
        // callId  =  cordys.getNodeText(GetSpoolDetailsModel.getData(),".//*[local-name()='CALLID']","");   
        // _call_id[LA_TRANSACTION_DETAILSTable.getIndex()].setValue(callId);
        callId = tempCallId;
        _call_id[LA_TRANSACTION_DETAILSTable.getIndex()].setValue(tempCallId);

        //GetSpoolDetailsModel.clear();
        
        //added by rakesh to update client_id/assignee_no in la_transaction_details
			if (assignee1.getValue() == 'owner') {
				la_trans_client_id.setValue (client_id.getValue());
				} 
			else if (assignee1.getValue() == 'assignee') {
				la_trans_client_id.setValue (assignee_no.getValue());
				}
			

        GetLaTransactionDetailsObjectsModel.synchronize();

        if (!GetLaTransactionDetailsObjectsModel.soapFaultOccurred) {
            alert("Data Saved successfully!");

            checkStatus();
            add_button.disable();
            submit.disable();

            callId = cordys.getNodeText(GetSpoolDetailsModel.getData(), ".//*[local-name()='CALLID']", "");

            /* added by vignesh for first level of mandate cretion
	if (!WebForm.validateForm(application.container.applicationId)) return;
	cordys.setNodeText(CreateClientBank_BPMModel.getMethodRequest(), ".//*[local-name()='CBANKSEL']", client_id.getValue());
	cordys.setNodeText(CreateClientBank_BPMModel.getMethodRequest(), ".//*[local-name()='BANKACCDSC']", account_holder_name.getValue());
	cordys.setNodeText(CreateClientBank_BPMModel.getMethodRequest(), ".//*[local-name()='BANKACCOUNT']", account_number.getValue());
	cordys.setNodeText(CreateClientBank_BPMModel.getMethodRequest(), ".//*[local-name()='BANKKEY']", micr_code.getValue());
	cordys.setNodeText(CreateClientBank_BPMModel.getMethodRequest(), ".//*[local-name()='FACTHOUS']", facthouse1.getValue());
	CreateClientBank_BPMModel.reset();
	ClientBankEnquiryModel.reset();   
	*/

            cordys.setNodeText(CompareAndCreateMandateModel.getMethodRequest(), ".//*[local-name()='callId']", tempCallId, "");
            CompareAndCreateMandateModel.reset();
            /* var responseMsg=cordys.getNodeText(CompareAndCreateMandateModel.getData(),".//*[local-name()='compareAndCreateMandate']","");
             if(responseMsg!="")
             alert(responseMsg);
             */
            application.notify("Case Processed Successfuly");

            // GetSpoolDetailsModel.clear();

            
            
            application.container.close();
            parent.closeBankHandler();
            
			
			
			/*  
            var result = cordys.getNodeText(CompareAndCreateMandateModel.getData(),".//*[local-name()='compareAndCreateMandate']","");
            //  var result = 'true';
              if(result=='true')
              {
                  mandatecreation_button.show();
            //      mandatelink_button.show();
             //     paymentcreation_button.show();
              //    paymentauthorization_button.show();
              }else{
                  mandatecreation_button.hide();
                  mandatelink_button.hide();
                  paymentcreation_button.hide();
                  paymentauthorization_button.hide();
              }
              
              /*
              
               // call compare and check mandate
               /*
               if true then enable mandate buttons , 
               
               
               */
            /*
         
         
         
         
               if(mandate_no[LA_TRANSACTION_DETAILSTable.getIndex()].getValue()=="")
               {
                   if( _pay_type[LA_TRANSACTION_DETAILSTable.getIndex()].getValue()== 1) 
                   { 
                       if(!((_bank_name[LA_TRANSACTION_DETAILSTable.getIndex()].getValue()=="")&&(_bank_account_no[LA_TRANSACTION_DETAILSTable.getIndex()].getValue()=="")&&(type_of_account[LA_TRANSACTION_DETAILSTable.getIndex()].getValue()=="")&&(_micr_code[LA_TRANSACTION_DETAILSTable.getIndex()].getValue()==""))) 
                       { 
                           mandatecreation_button.show();
                       } 
                       else  
                       { 
                           if(!(check2.getValue()=="0" && check1.getValue()=="1"))
                           { 
                           paymentcreation_button.show();
                           }         
                       } 
                   } 
                    else 
                    { 
                       mandatecreation_button.show();
                    } 
               }
               else
               {
                   paymentcreation_button.show();
               }
                */
        }
    }
    
}

function mandatecreation_button_Click(eventObject) {
    CheckIFOwner();
    cordys.setNodeText(MandateCreationBPMModel.getMethodRequest(), ".//*[local-name()='SEQ_NO']", _spool_seq_no[LA_TRANSACTION_DETAILSTable.getIndex()].getValue(), "");
    cordys.setNodeText(MandateCreationBPMModel.getMethodRequest(), ".//*[local-name()='IFOWNER']", ifowner, "");
    cordys.setNodeText(MandateCreationBPMModel.getMethodRequest(), ".//*[local-name()='LA_TRAN_SEQ_NO']", _seq_no[LA_TRANSACTION_DETAILSTable.getIndex()].getValue(), "");
    cordys.setNodeText(MandateCreationBPMModel.getMethodRequest(), ".//*[local-name()='BANK_ACCOUNT_NO']", _bank_account_no[LA_TRANSACTION_DETAILSTable.getIndex()].getValue(), "");

    MandateCreationBPMModel.reset();
    if (!MandateCreationBPMModel.soapFaultOccurred) {
        application.notify(" Mandate creation has been done successfully !");
        var mandRef = cordys.getNodeText(MandateCreationBPMModel.getData(), ".//*[local-name()='BGEN-SJ5AF-MNDREF']", "");
        mandate_no[LA_TRANSACTION_DETAILSTable.getIndex()].setValue(mandRef);
        GetLaTransactionDetailsObjectsModel.synchronize();
        mandatelink_button.show();
        mandatecreation_button.disable();
    }
}

function CheckIFOwner() {
    if (assignee1.getValue() == 'owner') {
        ifowner = "Yes";
    } else if (assignee1.getValue() == 'assignee') {
        ifowner = "No";
    }
}

function mandatelink_button_Click(eventObject) {
    CheckIFOwner();
    cordys.setNodeText(PayoutAttachmentBPMModel.getMethodRequest(), ".//*[local-name()='SEQ_NO']", _spool_seq_no[LA_TRANSACTION_DETAILSTable.getIndex()].getValue(), "");
    cordys.setNodeText(PayoutAttachmentBPMModel.getMethodRequest(), ".//*[local-name()='IFOWNER']", ifowner, "");
    cordys.setNodeText(PayoutAttachmentBPMModel.getMethodRequest(), ".//*[local-name()='MANREFNO']", death_health_clientrole.getValue(), "");
    cordys.setNodeText(PayoutAttachmentBPMModel.getMethodRequest(), ".//*[local-name()='LA_TRAN_SEQ_NO']", _seq_no[LA_TRANSACTION_DETAILSTable.getIndex()].getValue(), "");

    PayoutAttachmentBPMModel.reset();
    if (!PayoutAttachmentBPMModel.soapFaultOccurred) {
        application.notify(" Payout Attachment has been done successfully !");
        if (!(check2.getValue() == "0" && check1.getValue() == "1")) {
            paymentcreation_button.show();
        }
        mandatelink_button.disable();
    } else {
        application.notify("Error occured in Mandate Attachment!");
    }
}

function paymentcreation_button_Click(eventObject) {
    CheckIFOwner();
    cordys.setNodeText(PaymentCreation_BPMModel.getMethodRequest(), ".//*[local-name()='SEQ_NO']", _spool_seq_no[LA_TRANSACTION_DETAILSTable.getIndex()].getValue(), "");
    cordys.setNodeText(PaymentCreation_BPMModel.getMethodRequest(), ".//*[local-name()='IFOWNER']", ifowner, "");
    cordys.setNodeText(PaymentCreation_BPMModel.getMethodRequest(), ".//*[local-name()='LA_TRAN_SEQ_NO']", _seq_no[LA_TRANSACTION_DETAILSTable.getIndex()].getValue(), "");
    cordys.setNodeText(PaymentCreation_BPMModel.getMethodRequest(), ".//*[local-name()='CODE']", sacs_code.getValue());
    cordys.setNodeText(PaymentCreation_BPMModel.getMethodRequest(), ".//*[local-name()='TYPE']", sacs_type.getValue());
    cordys.setNodeText(PaymentCreation_BPMModel.getMethodRequest(), ".//*[local-name()='DHPAYOUT']", check2.getValue());
    cordys.setNodeText(PaymentCreation_BPMModel.getMethodRequest(), ".//*[local-name()='PAYOUT_TYPE']", payout_type.getValue());

    PaymentCreation_BPMModel.reset();

    if (!PaymentCreation_BPMModel.soapFaultOccurred) {
        application.notify(" Payment creation has been done successfully !");
        var prnno = cordys.getNodeText(PaymentCreation_BPMModel.getData(), ".//*[local-name()='BGEN-S2200-REQNO']", "");
        alert("PRN NO is  " + prnno);
        prn_no[LA_TRANSACTION_DETAILSTable.getIndex()].setValue(prnno);
        GetLaTransactionDetailsObjectsModel.synchronize();
        if (!(check2.getValue() == "0" && check1.getValue() == "1")) {
            paymentauthorization_button.show();
        }
        paymentcreation_button.disable();
    }
}

function paymentauthorization_button_Click(eventObject) {
    CheckIFOwner();
    var prnno = cordys.getNodeText(PaymentCreation_BPMModel.getData(), ".//*[local-name()='BGEN-S2200-REQNO']", "");
    cordys.setNodeText(PaymentAuthorization_BPMModel.getMethodRequest(), ".//*[local-name()='SEQ_NO']", _spool_seq_no[LA_TRANSACTION_DETAILSTable.getIndex()].getValue(), "");
    cordys.setNodeText(PaymentAuthorization_BPMModel.getMethodRequest(), ".//*[local-name()='IFOWNER']", ifowner, "");
    cordys.setNodeText(PaymentAuthorization_BPMModel.getMethodRequest(), ".//*[local-name()='PRN_NO']", prnno, "");
    cordys.setNodeText(PaymentAuthorization_BPMModel.getMethodRequest(), ".//*[local-name()='LA_TRAN_SEQ_NO']", _seq_no[LA_TRANSACTION_DETAILSTable.getIndex()].getValue(), "");


    PaymentAuthorization_BPMModel.reset();

    if (!PaymentAuthorization_BPMModel.soapFaultOccurred) {
        application.notify(" Payment Authorization has been done successfully !");
        LA_TRANSACTION_DETAILSTable.checkRow(LA_TRANSACTION_DETAILSTable.getIndex(), true);
        var checkedRows = LA_TRANSACTION_DETAILSTable.getCheckedRows();
        LA_TRANSACTION_DETAILSTable.markToRemove(checkedRows);
        delFlag = 1;
        LA_TRANSACTION_DETAILSTable.remove();
        LA_TRANSACTION_DETAILSTable.refresh();


        if (LA_TRANSACTION_DETAILSTable.getRows().length == 0) {
            clearAll();
        } else {
            checkStatus();
            if (_pay_type[LA_TRANSACTION_DETAILSTable.getIndex()].getValue() == 1) {
                if (!((_bank_name[LA_TRANSACTION_DETAILSTable.getIndex()].getValue() == "") && (_bank_account_no[LA_TRANSACTION_DETAILSTable.getIndex()].getValue() == "") && (type_of_account[LA_TRANSACTION_DETAILSTable.getIndex()].getValue() == "") && (_micr_code[LA_TRANSACTION_DETAILSTable.getIndex()].getValue() == ""))) {
                    mandatecreation_button.show();
                } else {
                    if (!(check2.getValue() == "0" && check1.getValue() == "1")) {
                        paymentcreation_button.show();
                    }
                }
            } else {

                mandatecreation_button.show();
            }

        }
    }
}

function restart_Click(eventObject) {
    mandatecreation_button.hide();
    mandatelink_button.hide();
    paymentcreation_button.hide();

    mandatecreation_button.enable();
    mandatelink_button.enable();
    paymentcreation_button.enable();

    submit.enable();
    // add_button.enable(); 
    _suspense_amt.hide();

    bank_account_no.enable();
    micr_code.enable();
    credit_card_no.enable();
    annuity_card_no.enable();
}

function GetLaTransactionDetailsObjectsModel_BeforeDelete(eventObject) {
    if (delFlag != "1") {
        return;
    }
    eventObject.returnValue = false;
    eventObject.srcElement.parentNode.removeChild(eventObject.srcElement);
    // eventObject.srcElement.style.display="none";
}

function checkStatus() {
    mandatecreation_button.hide();
    mandatelink_button.hide();
    paymentauthorization_button.hide();
    paymentcreation_button.hide();

    mandatecreation_button.enable();
    mandatelink_button.enable();
    paymentauthorization_button.enable();
    paymentcreation_button.enable();

}

function openCreditCardDetails(eventObject) {
    var cno = "";
    var cname = "";
    if (assignee1.getValue() == 'owner') {
        cno = client_id.getValue();
    } else if (assignee1.getValue() == 'assignee') {
        cno = assignee_no.getValue();
    }
    cname = name_of_bank_act_holder.getValue();
    var data = new Object();
    data.ClientID = cno;
    data.ClientName = cname;
    application.select(Credit_Card_Details_XMLID.XMLDocument.documentElement, data, null);


}

function closeCreditCardDetails(busObj) {
    var cc_bo = busObj;
    credit_card_no.setValue(cc_bo.CRDTCARD);
    creditcard_bank.setValue(cc_bo.BABRDC);
    creditcard_expdate.setValue(cc_bo.EXPDATE);
    credit_card_no.disable();
    bankDetails = "true";
    bank_account_no.disable();
    annuity_card_no.disable();
    restoreSplitter();
}

function openAnnuityCardDetails(eventObject) {
    var cno = "";
    var cname = "";
    if (assignee1.getValue() == 'owner') {
        cno = client_id.getValue();
    } else if (assignee1.getValue() == 'assignee') {
        cno = assignee_no.getValue();
    }
    cname = name_of_bank_act_holder.getValue();
    var data = new Object();
    data.ClientID = cno;
    data.ClientName = cname;
    application.select(Annuity_Card_Details_XMLID.XMLDocument.documentElement, data, null);

}

function closeAnnuityCardDetails(busObj) {
    var ac_bo = busObj;
    annuity_card_no.setValue(ac_bo.ANNCARDNO);
    creditcard_bank.setValue(ac_bo.BABRDC);
    creditcard_expdate.setValue(ac_bo.EXPDATE);
    annuity_card_no.disable();
    bankDetails = "true";
    bank_account_no.disable();
    credit_card_no.disable();
    restoreSplitter();
}

function Check() {
    if (pay_type.getValue() == 1 || pay_type.getValue() == 5 || pay_type.getValue() == 9 || pay_type.getValue() == "B") {
        if (name_of_bank_act_holder.getValue() == "") {
            Flag = 1;
            application.notify(" Please fill up Name of Bank account holder ");
            return;
        } else if (bank_name.getValue() == "") {
            Flag = 1;
            application.notify(" Please fill up Bank Name!");
            return;
        } else if (bank_account_no.getValue() == "") {
            Flag = 1;
            application.notify(" Please fill up Bank Account Number!");
            return;
        } else if (account_type.getValue() == "") {
            Flag = 1;
            application.notify(" Please fill up Account Type!");
            return;
        } else if (micr_code.getValue() == "") {
            Flag = 1;
            application.notify(" Please fill up MICR code!");
        }
        //commented by sushmita to make branch name a non-compulsory field
        /*  else if(branch_name.getValue()=="") 
          {     
              Flag = 1; 
              application.notify(" Please fill up Branch name!" ); 
              return;             
          } */
        else {

            Flag = 0;
        }
    } else {

        Flag = 0;
    }
}

function test() {
    var val = document.getElementById("bank_account_no").value;
    var reg = new RegExp("[^A-z0-9 ]");
    /* if(reg.test(val))
    {
         alert("Bank account no contains special characters!!");
         Flag=1;
         return;
    }
    */

}

function death_client_name_BeforeZoom(eventObject) {
    //var frameTag = cordys.selectXMLNode(eventObject.applicationDefinition, ".//*[local-name()='frame']"); 
    // cordys.setTextContent(frameTag, "_model"); 
    //frameTag.setAttribute("width", "1200px"); 
    //frameTag.setAttribute("height", "650px");
    var frameNode = cordys.selectXMLNode(eventObject.applicationDefinition, ".//*[local-name()='frame']");
    frameNode.setAttribute("features", "dialogWidth:85%;dialogHeight:50%;dialogTop:0px;dialogLeft:0px");
    var cno = "";
    cno = chdrnum.getValue();
    var data = new Object();
    data.policyNum = cno;
    eventObject.data = data;
}

function death_client_name_AfterZoom(eventObject) {
    if (eventObject.businessObject) {
        var cdetails = eventObject.businessObject;
        death_client_name.setValue(cordys.getNodeText(cdetails, ".//*[local-name()='NAME']", ""));
        death_clientid.setValue(cordys.getNodeText(cdetails, ".//*[local-name()='CLIENTID']", ""));
        death_health_status.setValue(cordys.getNodeText(cdetails, ".//*[local-name()='STATUS']", ""));
        death_health_clientrole.setValue(cordys.getNodeText(cdetails, ".//*[local-name()='ROLE']", ""));
    }
}

function PayoutAttachmentBPMModel_OnSOAPFault(eventObject) {
    eventObject.showError = false;
    var str = eventObject.faultString;
    // alert(str);
    application.showError(eventObject.faultString + " Please contact Admin");
    if (str.match("0042000001")) {
        paymentcreation_button.show();
        mandatelink_button.disable();
    }
}

function tranCallConfirm() {
    application.confirm("User Account details mismatch, Do you want to modify data ?", true, TranCloseHandler, false, "Confirm Message");
}

function TranCloseHandler(confirmReturnValue) {
    if (confirmReturnValue == 1) {
        Err_Flag = 1;
        ifsc_code.enable();
        micr_code.enable();
        bank_account_no.enable();
        ifsc_code.enable();
        micr_code.enable();
        credit_card_no.enable();
        annuity_card_no.enable();
        application.notify("Update Account details and Remarks before processing!");
        return;
    } else if (confirmReturnValue == 0) {
        Err_Flag = 0;
        error_remarks1.setFocus();
    } else {
        return;
    }
}

function updateLA_TRANSACTION_DETAILSTable() {
    if (Flag == 0) {
        if (cordys.getTextContent(add_button.getLabel()) == "Add")
            LA_TRANSACTION_DETAILSTable.create();

        var idx = LA_TRANSACTION_DETAILSTable.getIndex();

        _name_of_bank_act_holder[idx].setValue(name_of_bank_act_holder.getValue());
        _bank_account_no[idx].setValue(bank_account_no.getValue());
        _bank_name[idx].setValue(bank_name.getValue());
        //_branch_name[idx].setValue(branch_name.getValue()); 
        _call_id[idx].setValue(call_id.getValue());
        _ifsc_code[idx].setValue(ifsc_code.getValue());
        _instructions[idx].setValue(instructions.getValue());
        //_medical[idx].setValue(medical.getValue()); 
        _micr_code[idx].setValue(micr_code.getValue());
        _pay_type[idx].setValue(pay_type.getValue());
        _payout_amount[idx].setValue(payout_amount.getValue());
        _medical[idx].setValue(medical.getValue());
        _stamp_duty[idx].setValue(stamp_duty.getValue());
        _bname[idx].setValue(bname.getValue());
        type_of_account[idx].setValue(account_type.getValue());
        _spool_seq_no[idx].setValue(_seq_no1[LA_SPOOLTable.getIndex()].getValue());
        created_by[LA_TRANSACTION_DETAILSTable.getIndex()].setValue(window.parent.userId);
        _credit_card_no[idx].setValue(credit_card_no.getValue());
        _annuity_card_no[idx].setValue(annuity_card_no.getValue());
        cc_expdate[idx].setValue(creditcard_expdate.getValue());
        ac_expdate[idx].setValue(creditcard_expdate.getValue());
        mandate_no[idx].setValue(_mandate_number.getValue());
        Data_Entry[idx].setValue(dataEntry.getValue());
        DataEntry = Data_Entry[idx].getValue(dataEntry.getValue());
        Sacs_code[idx].setValue(sacs_code.getValue());
        Sacs_type[idx].setValue(sacs_type.getValue());
        Payout_type[idx].setValue(payout_type.getValue());

        if (sub_type.getValue() == "Surrender" || sub_type.getValue() == "Partial Withdrawal" || sub_type.getValue() == "Freelook") {
            if (!((pay_type.getValue().replace(/\s/g, "") == _mode_of_payment.getValue().replace(/\s/g, "")) && (bank_account_no.getValue().replace(/\s/g, "") == acc_no.getValue().replace(/\s/g, "")) && (micr_code.getValue().replace(/\s/g, "") == _micr.getValue().replace(/\s/g, "")) && (ifsc_code.getValue().replace(/\s/g, "") == _ifsc.getValue().replace(/\s/g, "")))) {
                PAYOUT_AUDIT_DETAILSGroup.create();
                contract_no.setValue(chdrnum.getValue());
                _account_no.setValue(acc_no.getValue());
                _mode_of_payment1.setValue(_mode_of_payment.getValue());
                _micr_code2.setValue(_micr.getValue());
                _ifsc_code2.setValue(_ifsc.getValue());
                _remarks1.setValue(error_remarks1.getValue());
                new_mode_of_payment.setValue(pay_type.getValue());
                new_mice_code.setValue(micr_code.getValue());
                new_ifsc_code.setValue(ifsc_code.getValue());
                _spool_seq_no1.setValue(_seq_no1[LA_SPOOLTable.getIndex()].getValue());
                _call_type1.setValue(call_type.getValue());
                _sub_type1.setValue(sub_type.getValue());
                new_account_no.setValue(bank_account_no.getValue());
            }
        }

        if (bankDetails == "true") {
            bankArray[aIndex] = idx;
            aIndex++;
        }
        var payoutAmt = payout_amount.getValue();
        //  GetLaTransactionDetailsObjectModel.clear(); 
        LA_TRANSACTION_DETAILSGroup.create();
        credit_card_no.setValue("");
        creditcard_expdate.setValue("");
        annuity_card_no.setValue("");

        //Commented on 23-04-2018 as a fix for Suspense and Payout Amount comparison
        //payout_amount.setValue(_suspense_amt.getValue());
        payout_amount.setValue(payoutAmt);

        bankDetails = "false";
        bank_account_no.enable();
        micr_code.enable();
        credit_card_no.enable();
        annuity_card_no.enable();
        if (assignee1.getValue() == 'owner') {

            name_of_bank_act_holder.setValue(cordys.getNodeText(GetSpoolDetailsModel.getData(), ".//*[local-name()='OWNER_NAME']", ""));
        } else if (assignee1.getValue() == 'assignee') {
            name_of_bank_act_holder.setValue(cordys.getNodeText(GetSpoolDetailsModel.getData(), ".//*[local-name()='ASSIGNEE_NAME']", ""));

        }

        if (cordys.getTextContent(add_button.getLabel()) == "Update") {
            add_button.setLabel("Add");
            LA_TRANSACTION_DETAILSTable.checkRow(idx, false);
        }

    }
    delete_Button.enable();
}

function error_remarks1_OutFocus(eventObject) {
    if (Err_Flag == 0) {
        if (error_remarks1.getValue() == "") {
            application.notify("Please update Remarks field!");
            error_remarks1.setFocus();
            return;
        } else {
            updateLA_TRANSACTION_DETAILSTable()
            error_remarks1.hide();
        }
    }
}

function GetLaTransactionDetailsObjectModel_BeforeDelete(eventObject) {
    eventObject.returnValue = false;
    eventObject.srcElement.parentNode.removeChild(eventObject.srcElement)
}

function Models_OnSOAPFault(eventObject) {
    eventObject.showError = false;
    if (eventObject.faultString.lastIndexOf("ORA-00001") != -1 || eventObject.faultString.lastIndexOf("Duplicate") != -1) {
        application.showError("Duplicate record exists!");
        return;
    }
    if (eventObject.faultString.lastIndexOf("ORA-02292") != -1)
        application.showError("Not able to modify/delete as Child Records Exists");
    else
        //application.showError("Error Occured.Please contact Admin");
        application.showError(eventObject.faultString + " Please contact Admin");
}

function chdrnum_Change(eventObject) {
    if (!eventObject.valid)
        go.disable();
}

function chdrnum_Validate(eventObject) {
    go.enable();
}


function openBankDetails(eventObject) {

    var cno = "";
    var cname = "";
    if (assignee1.getValue() == 'owner') {
        cno = client_id.getValue();
    } else if (assignee1.getValue() == 'assignee') {
        cno = assignee_no.getValue();
    }
    cname = name_of_bank_act_holder.getValue();
    //cname=custFullName;
    var data = new Object();
    data.ClientID = cno;
    data.ClientName = cname;
    data.callIdParam = callIdOp.getValue();
    //eventObject.data = data;    
    application.select(CLIENT_Bank_Enquiry_xml_ID.XMLDocument.documentElement, data, null);

}

function closeBankDetails(busObj) {
    var role = cordys.getNodeText(GetRoleModel.getData(), ".//*[local-name()='getRole']", "");
    var bo = busObj;
    var amt = payout_amount.getValue();
    // name_of_bank_act_holder.setValue(bo.CLTNAME) 
    name_of_bank_act_holder.setValue(custFullName);
    bank_name.setValue(bo.BANKDESC);
    micr_code.setValue(bo.BANKKEY);
    //branch_name.setValue(bo.BRANCHDESC); 
    bank_account_no.setValue(bo.BANKACOUNT);
    ifsc_code.setValue(bo.IFSCCODE);
    pay_type.setValue(bo.PAYMENTTYPE);
    account_type.setValue(bo.ACCOUNTTYPE);
    //  payout_amount.setValue(bo.PAYMENTAMOUNT);
    if (role == "VendorManager") {
        sacs_code.setValue(bo.SACSCODE);
        sacs_type.setValue(bo.SACSTYPE);
        payout_type.setValue(bo.PAYOUTTYPE);
        payout_amount.setValue(bo.PAYMENTAMOUNT);
    }
    credit_card_no.setValue(bo.CREDITNO);
    annuity_card_no.setValue(bo.ANNUITYCARDNO);
    creditcard_expdate.setValue(bo.CCEXPIRYDATE);
    //	 bname.setValue(bo.BNAME);
    //	 instructions.setValue(bo.INSTRUCTIONS);
    if (bo.CALLID == "" || bo.CALLID == null || bo.CALLID == " ")
        call_id.setValue(callIdOp.getValue());
    else
        call_id.setValue(bo.CALLID);
    if (bo.PAYOUTAMOUNT == "" || bo.PAYOUTAMOUNT == null || bo.PAYOUTAMOUNT == " "){
        payout_amount.setValue(amt);
        }
    else{
        payout_amount.setValue(bo.PAYOUTAMOUNT);
        medical.setValue(bo.MEDICAL);
        stamp_duty.setValue(bo.STAMPDUTY);
        }


    //	 medical.setValue(bo.MEDICAL);
    //	 stamp_duty.setValue(bo.STAMPDUTY);
    //	 _mandate_number.setValue(bo.MANDATE);



    bank_account_no.disable();
    micr_code.disable();
    ifsc_code.disable();
    bankDetails = "true";

    credit_card_no.disable();
    annuity_card_no.disable();
    restoreSplitter();

    if(role=="VendorEntry" || role=="VendorDoubleEntry")

{
    var codeIFSC = bo.IFSCCODE;
    codeIFSC = codeIFSC.substr(0, 4);
    if (codeIFSC == "ICIC" || bank_name.getValue().toUpperCase().substr(0, 4) == "ICIC") {
        pay_type.setValue("5");
    } else {
        pay_type.setValue("B");
    }
}
    account_type.setValue("Savings");
    pay_type.setFocus();

}

function mandateClearClick() {
    //GetLaTransactionDetailsObjectModel.clear();
    //LA_TRANSACTION_DETAILSGroupClear();
    //pay_type.setValue("");


    //call_id.setValue(callIdVal);
    //payout_amount.setValue(payoutAmtVal);   



    if (assignee1.getValue() == 'owner') {
        //   name_of_bank_act_holder.setValue(_owner_name[LA_SPOOLTable.getIndex()].getValue());
        // var custFullName=cordys.getNodeText(data,".//*[local-name()='CUST_FULL_NAME']");
        // name_of_bank_act_holder.setValue(custFullName);

        custFullName = _owner_name[LA_SPOOLTable.getIndex()].getValue();
        name_of_bank_act_holder.setValue(custFullName);

    } else if (assignee1.getValue() == 'assignee') {
        //  name_of_bank_act_holder.setValue(assignee_name[LA_SPOOLTable.getIndex()].getValue());

        custFullName = assignee_name[LA_SPOOLTable.getIndex()].getValue();
        name_of_bank_act_holder.setValue(custFullName);

    }
    Err_Flag = 0;
}

function restoreSplitter() {
    splitter2.setOffset("33%");
    splitter2.restore();
}

function bank_lookup_Click(eventObject) {
    mandateClearClick();
    splitter2.minimize();
    //document.all["CLIENT_BANK_ENQUIRY_FRAME"].show(); 
    openBankDetails(eventObject);
    mandate_enquiry_check.enable();
    mandate_enquiry_check.checked = false;




}

function credit_card_lookup_Click(eventObject) {
    mandateClearClick();
    splitter2.minimize();
    //document.all["CLIENT_BANK_ENQUIRY_FRAME"].show();
    openCreditCardDetails(eventObject);
    mandate_enquiry_check.enable();
    mandate_enquiry_check.checked = false;


}

function annuity_card_lookup_Click(eventObject) {
    mandateClearClick();
    splitter2.minimize();
    //document.all["CLIENT_BANK_ENQUIRY_FRAME"].show();
    openAnnuityCardDetails(eventObject);
    mandate_enquiry_check.enable();
    mandate_enquiry_check.checked = false;
}

function mandate_enquiry_check_Change(eventObject) {
    //alert(mandate_enquiry_check.getValue());
    if (mandate_enquiry_check.getValue() == 1) {
        mandateClearClick();
        application.select(Mandate_Enquiry_xml_ID.XMLDocument.documentElement, null);
        mandate_enquiry_check.disable();

    }
}



function Form_InitDone(eventObject) {

    Save_as_draft_remark.hide();
    creditcard_bank.hide();
    drtApproval.hide();
    freelookDeductedAmt.hide();
    if (callType == 'Payouts' && (subType == 'Freelook Refund' || subType == 'Fraud Refund' || subType == 'Freelook Misselling Refund' || subType == 'Refund of premiums')) {
        drtApproval.show();
        freelookDeductedAmt.show();
      //  payout_amount.disable();
    }
    // go.hide();
    clear.hide();
    reset.hide();
    restart.hide();
    la_trans_client_id.hide();

    branch_name.hide();
    go.click();
    //account_type.setValue("Savings");
    /*    var methodReq=UpdateLASpoolWithStatusModel.getMethodRequest();
       cordys.setNodeText(methodReq,".//*[local-name()='seqNo']",cordys.getNodeText(GetSpoolDetailsModel.getData(),".//*[local-name()='SEQ_NO']"));
       cordys.setNodeText(methodReq,".//*[local-name()='callID']","");
       cordys.setNodeText(methodReq,".//*[local-name()='status']","ISACTIVE_Y");
       cordys.setNodeText(methodReq,".//*[local-name()='stage_id']","");
       UpdateLASpoolWithStatusModel.setMethodRequest(methodReq);
       UpdateLASpoolWithStatusModel.reset();*/
    /*
     var role = cordys.getNodeText(GetRoleModel.getData(),".//*[local-name()='getRole']","");
    //alert(role);
    if(role=="StakeHolderMaker" || role=="StakeholderChecker" || role=="ADMIN HEAD"){
        cordys.setNodeText(ChangeLoggedStatusModel.getMethodRequest(),".//*[local-name()='userName']",window.parent.userId);
    ChangeLoggedStatusModel.reset();
    CordysRoot.sso.logout();
    application.container.close();
    window.location.href = "/cordys/payout/default.htm";
  //  window.parent.parent.location.href = "/cordys/CAPSLIFE/Login.html";
    alert("logout successfully");
    //window.parent.parent.location.href = "/cordys/payout3/default.htm";
     window.parent.parent.location.href = "/home/payout/";

}
   */




    var ZoningFrmDef = cordys.cloneXMLDocument(ZoningForm.XMLDocument);

    var imageReq = GetImageDetailsByAppNoModel.getMethodRequest();
    cordys.setNodeText(imageReq, ".//*[local-name()='ContractNumber']", "02935042");
    // cordys.setNodeText(imageReq,".//*[local-name()='ContractNumber']",chdrnum.getValue());
    GetImageDetailsByAppNoModel.setMethodRequest(imageReq);
    GetImageDetailsByAppNoModel.reset();
    var respData = GetImageDetailsByAppNoModel.getData();
    var image_name = cordys.getNodeText(respData, ".//*[local-name()='IMAGE_NAME']");
    var image_path = cordys.getNodeText(respData, ".//*[local-name()='DESTINATION_PATH']");
    var ImageFolder = image_path.split("\\");
    // var orgImgPath="E"+image_path.substr(1,image_path.length);       
    var ImgUrl = "http://10.50.75.147:8181/DefaultApp.aspx?param=79%" + ImageFolder[3] + "\\" + ImageFolder[4] + "\\" + ImageFolder[5] + "\\" + ImageFolder[6] + "\\" + ImageFolder[7] + "%AppForm";

    cordys.setNodeText(ZoningFrmDef, ".//*[local-name()='url']", ImgUrl);
    application.select(ZoningFrmDef.documentElement);




    var N = navigator.appName,
        ua = navigator.userAgent,
        tem;
    M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
    M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];



    /*
    if(M[0] != "Firefox") 
    { 
    //alert("You are using an Unsupported Browser. Kindly switch to Mozilla Firefox [version 7-16.0.02]"); 
    //parent.application.container.close(); 
    } 
    else if(parseInt(M[1]) < 7 || parseInt(M[1]) > 16 )
    { 
    //alert("You are using an unsupported version of Mozilla Firefox. Kindly switch to version 7-16.0.02");
    }    
    */

    //var bodyHeight = document.body.clientHeight;
    var bodyHeight = document.documentElement.clientHeight;
    //alert(parseInt(bodyHeight/2));
    splitter1.setOffset(parseInt(bodyHeight / 2));
    splitter2.setOffset("33%");

    //frames[0].document.body.focus();


    shortcut.add("Ctrl+Right", function() {
        ImageScroll("Right");
        //image move right 
    });

    shortcut.add("Ctrl+Left", function() {
        ImageScroll("Left");
        //image move left
    });

    shortcut.add("Ctrl+Up", function() {
        ImageScroll("Up");
        //image move up
    });

    shortcut.add("Ctrl+Down", function() {
        ImageScroll("Down");
        //image move down
    });

    shortcut.add("Shift+Right", function() {
        ImageScroll("NextImage");
        //image move right 
    });

    shortcut.add("Shift+Left", function() {
        ImageScroll("PrevImage");
        //image move left
    });

    shortcut.add("Alt+Q", function() {
        ImageScroll("BankEnquiry");
        //image move left
    });




    /**var methodReq=UpdateLASpoolWithStatusModel.getMethodRequest();
    			cordys.setNodeText(methodReq,".//*[local-name()='seqNo']",cordys.getNodeText(GetSpoolDetailsModel.getData(),".//*[local-name()='SEQ_NO']"));
    			cordys.setNodeText(methodReq,".//*[local-name()='callID']","");
    			cordys.setNodeText(methodReq,".//*[local-name()='status']","ISACTIVE_N");
    			cordys.setNodeText(methodReq,".//*[local-name()='stage_id']","");
    			UpdateLASpoolWithStatusModel.setMethodRequest(methodReq);
    			UpdateLASpoolWithStatusModel.reset();
        */

}

function ImageScroll(action) // CallBack Function on KeyPress Events
{
    switch (action) {
        //frames[0].document.getElementById("xfe7").focus();    


        case "Left":

            if (M[0] == "Firefox") {
                window.frames[0].document.getElementById("imageDiv").parentNode.parentNode.parentNode.parentNode.scrollLeft -= 20;
            } else {
                window.frames[0].document.getElementById("imageDiv").parentElement.parentElement.parentElement.parentElement.scrollLeft -= 20;
            }
            break;

        case "Up":

            if (M[0] == "Firefox") {
                window.frames[0].document.getElementById("imageDiv").parentNode.parentNode.parentNode.parentNode.scrollTop -= 50;
            } else {
                window.frames[0].document.getElementById("imageDiv").parentElement.parentElement.parentElement.parentElement.scrollTop -= 50;
            }
            break;

        case "Down":
            if (M[0] == "Firefox") {
                window.frames[0].document.getElementById("imageDiv").parentNode.parentNode.parentNode.parentNode.scrollTop += 50;
            } else {
                window.frames[0].document.getElementById("imageDiv").parentElement.parentElement.parentElement.parentElement.scrollTop += 50;
            }
            break;

        case "Right":
            if (M[0] == "Firefox") {
                window.frames[0].document.getElementById("imageDiv").parentNode.parentNode.parentNode.parentNode.scrollLeft += 20;
            } else {
                window.frames[0].document.getElementById("imageDiv").parentElement.parentElement.parentElement.parentElement.scrollLeft += 20;
            }

            break;

        case "NextImage":
            window.frames[0].imagePanRight_Click();
            break;

        case "PrevImage":
            window.frames[0].imagePanLeft_Click();
            break;

        case "BankEnquiry":
            bank_lookup_Click();
            break;



    }
}

/* Script To Captutre Keyboard Key press Event with multiple special Keys */

shortcut = {
    'all_shortcuts': {}, //All the shortcuts are stored in this array
    'add': function(shortcut_combination, callback, opt) {
        //Provide a set of default options
        var default_options = {
            'type': 'keydown',
            'propagate': false,
            'disable_in_input': false,
            'target': document,
            'keycode': false
        }
        if (!opt) opt = default_options;
        else {
            for (var dfo in default_options) {
                if (typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
            }
        }

        var ele = opt.target;
        if (typeof opt.target == 'string') ele = document.getElementById(opt.target);
        var ths = this;
        shortcut_combination = shortcut_combination.toLowerCase();

        //The function to be called at keypress
        var func = function(e) {
            e = e || window.event;

            if (opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
                var element;
                if (e.target) element = e.target;
                else if (e.srcElement) element = e.srcElement;
                if (element.nodeType == 3) element = element.parentNode;

                if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
            }

            //Find Which key is pressed
            if (e.keyCode) code = e.keyCode;
            else if (e.which) code = e.which;
            var character = String.fromCharCode(code).toLowerCase();

            if (code == 188) character = ","; //If the user presses , when the type is onkeydown
            if (code == 190) character = "."; //If the user presses , when the type is onkeydown

            var keys = shortcut_combination.split("+");
            //Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
            var kp = 0;

            //Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
            var shift_nums = {
                "`": "~",
                "1": "!",
                "2": "@",
                "3": "#",
                "4": "$",
                "5": "%",
                "6": "^",
                "7": "&",
                "8": "*",
                "9": "(",
                "0": ")",
                "-": "_",
                "=": "+",
                ";": ":",
                "'": "\"",
                ",": "<",
                ".": ">",
                "/": "?",
                "\\": "|"
            }
            //Special Keys - and their codes
            var special_keys = {
                'esc': 27,
                'escape': 27,
                'tab': 9,
                'space': 32,
                'return': 13,
                'enter': 13,
                'backspace': 8,

                'scrolllock': 145,
                'scroll_lock': 145,
                'scroll': 145,
                'capslock': 20,
                'caps_lock': 20,
                'caps': 20,
                'numlock': 144,
                'num_lock': 144,
                'num': 144,

                'pause': 19,
                'break': 19,

                'insert': 45,
                'home': 36,
                'delete': 46,
                'end': 35,

                'pageup': 33,
                'page_up': 33,
                'pu': 33,

                'pagedown': 34,
                'page_down': 34,
                'pd': 34,

                'left': 37,
                'up': 38,
                'right': 39,
                'down': 40,

                'f1': 112,
                'f2': 113,
                'f3': 114,
                'f4': 115,
                'f5': 116,
                'f6': 117,
                'f7': 118,
                'f8': 119,
                'f9': 120,
                'f10': 121,
                'f11': 122,
                'f12': 123
            }

            var modifiers = {
                shift: {
                    wanted: false,
                    pressed: false
                },
                ctrl: {
                    wanted: false,
                    pressed: false
                },
                alt: {
                    wanted: false,
                    pressed: false
                },
                meta: {
                    wanted: false,
                    pressed: false
                } //Meta is Mac specific
            };

            if (e.ctrlKey) modifiers.ctrl.pressed = true;
            if (e.shiftKey) modifiers.shift.pressed = true;
            if (e.altKey) modifiers.alt.pressed = true;
            if (e.metaKey) modifiers.meta.pressed = true;

            for (var i = 0; k = keys[i], i < keys.length; i++) {
                //Modifiers
                if (k == 'ctrl' || k == 'control') {
                    kp++;
                    modifiers.ctrl.wanted = true;

                } else if (k == 'shift') {
                    kp++;
                    modifiers.shift.wanted = true;

                } else if (k == 'alt') {
                    kp++;
                    modifiers.alt.wanted = true;
                } else if (k == 'meta') {
                    kp++;
                    modifiers.meta.wanted = true;
                } else if (k.length > 1) { //If it is a special key
                    if (special_keys[k] == code) kp++;

                } else if (opt['keycode']) {
                    if (opt['keycode'] == code) kp++;

                } else { //The special keys did not match
                    if (character == k) kp++;
                    else {
                        if (shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
                            character = shift_nums[character];
                            if (character == k) kp++;
                        }
                    }
                }
            }

            if (kp == keys.length &&
                modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
                modifiers.shift.pressed == modifiers.shift.wanted &&
                modifiers.alt.pressed == modifiers.alt.wanted &&
                modifiers.meta.pressed == modifiers.meta.wanted) {
                callback(e);

                if (!opt['propagate']) { //Stop the event
                    //e.cancelBubble is supported by IE - this will kill the bubbling process.
                    e.cancelBubble = true;
                    e.returnValue = false;

                    //e.stopPropagation works in Firefox.
                    if (e.stopPropagation) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    return false;
                }
            }
        }
        this.all_shortcuts[shortcut_combination] = {
            'callback': func,
            'target': ele,
            'event': opt['type']
        };
        //Attach the function with the event
        if (ele.addEventListener) ele.addEventListener(opt['type'], func, false);
        else if (ele.attachEvent) ele.attachEvent('on' + opt['type'], func);
        else ele['on' + opt['type']] = func;
    },

    //Remove the shortcut - just specify the shortcut and I will remove the binding
    'remove': function(shortcut_combination) {
        shortcut_combination = shortcut_combination.toLowerCase();
        var binding = this.all_shortcuts[shortcut_combination];
        delete(this.all_shortcuts[shortcut_combination])
        if (!binding) return;
        var type = binding['event'];
        var ele = binding['target'];
        var callback = binding['callback'];

        if (ele.detachEvent) ele.detachEvent('on' + type, callback);
        else if (ele.removeEventListener) ele.removeEventListener(type, callback, false);
        else ele['on' + type] = false;
    }
}

function assign_btn_Click(eventObject) {

    callId = cordys.getNodeText(GetSpoolDetailsModel.getData(), ".//*[local-name()='CALLID']", "");
    var callIdList = callId + ",";
    alert(callIdList)
    cordys.setNodeText(UserActionOnCaseModel.getMethodRequest(), ".//*[local-name()='callIdList']", callIdList);
    cordys.setNodeText(UserActionOnCaseModel.getMethodRequest(), ".//*[local-name()='action']", "ASSIGN");
    UserActionOnCaseModel.reset();
    var response = cordys.getNodeText(UserActionOnCaseModel.getData(), ".//*[local-name()='userActionOnCase']", "");
    alert(response)
}
/* End of script to capture Key press Events */
function reject_btn_Click(eventObject) {
    callId = cordys.getNodeText(GetSpoolDetailsModel.getData(), ".//*[local-name()='CALLID']", "");
    var callIdList = callId + ",";
    alert(callIdList);
    cordys.setNodeText(UserActionOnCaseModel.getMethodRequest(), ".//*[local-name()='callIdList']", callId);
    cordys.setNodeText(UserActionOnCaseModel.getMethodRequest(), ".//*[local-name()='action']", "REVOKE");
    UserActionOnCaseModel.reset();
    var response = cordys.getNodeText(UserActionOnCaseModel.getData(), ".//*[local-name()='userActionOnCase']", "");
    alert(response);
}
/*function automateMandate_btn_Click(eventObject)
{
    cordys.setNodeText(AutomateMandateModel.getMethodRequest(),".//*[local-name()='callId']",callId);
    AutomateMandateModel.reset();
    if(!AutomateMandateModel.soapFaultOccurred) 
    { 
    application.notify(" Case started for automate Mandate!"); 
   
    mandatecreation_button.hide();
    automateMandate_btn.disable();
    }
}
*/
function CompareAndCreateMandateModel_OnSOAPFault(eventObject) {
    alert(eventObject.showError);
}

function assignBack_Click(eventObject) {

    callId = cordys.getNodeText(GetSpoolDetailsModel.getData(), ".//*[local-name()='CALLID']", "");
    data.callId = callId;
    // application.select(spaarcAssignment.XMLDocument.documentElement,data);
    cordys.preventDefault(eventObject);

    application.showDialog(spaarcAssignment.XMLDocument.documentElement, data, null, null, false);
}

function callBackHandler(dialogReturnValue) {

}

function omniImagesBtn_Click(eventObject) {
    OLURL = "http://10.16.1.157:4501/viewer.aspx?url=";
    /*  var xGetImageURLtoken = cordys.cloneXMLDocument(xmlGetImageURLtoken.XMLDocument);
      cordys.setNodeText(xGetImageURLtoken, ".//*[local-name()='contractNo']", chdrnum.getValue());
    //  cordys.setNodeText(xGetImageURLtoken, ".//*[local-name()='contractNo']", "OS08195806"); 
      GenericModel.setMethodRequest(xGetImageURLtoken);
      GenericModel.reset();

      if(!GenericModel.soapFaultOccurred)
      {
          Insta_Url = OLURL + cordys.getNodeText(GenericModel.getData(), ".//*[local-name()='return']");
          window.open(Insta_Url);
      }
      */
    var methodReq = SETAuthKEYModel.getMethodRequest();
    cordys.setNodeText(methodReq, ".//*[local-name()='SystemName']", "Payouts");
    cordys.setNodeText(methodReq, ".//*[local-name()='UserName']", system.getUser().organizations[application.organization].userDN.split(",")[0].substring(3));
    //cordys.setNodeText(methodReq,".//*[local-name()='Query']","OS08195806");
    cordys.setNodeText(methodReq, ".//*[local-name()='Query']", chdrnum.getValue());
    SETAuthKEYModel.setMethodRequest(methodReq);
    SETAuthKEYModel.reset();
    var responseMsg = cordys.getNodeText(SETAuthKEYModel.getData(), ".//*[local-name()='SETAuthKEYResult']");
    Insta_Url = OLURL + responseMsg;
    window.open(Insta_Url);
}

function enquiryBtn_Click(eventObject) {
    enquiryRadio.show();
}

function spaarcURLBtn_Click(eventObject) {
    window.open("http://10.16.58.183:100/", '_blank');
}

function enquiryRadio_Change(eventObject) {
    dataUI.policyNum = chdrnum.getValue();
    if (enquiryRadio.getValue() == 'SuspenseBalance')
        application.showDialog(SuspenseBalance.XMLDocument.documentElement, dataUI, null, null, false);
    else if (enquiryRadio.getValue() == 'TransactionHistory')
        application.showDialog(TransactionHistory.XMLDocument.documentElement, dataUI, null, null, false);
    else if (enquiryRadio.getValue() == 'ContractFullEnquiry')
        application.showDialog(ContractFullEnquiry.XMLDocument.documentElement, dataUI, null, null, false);
    else
        application.showDialog(PaymentEnquiry.XMLDocument.documentElement, dataUI, null, null, false);
}

function spaarcCloseBackDetails() {
    application.container.close();

}

function Form_BeforeClose(eventObject) {
    var methodReq = UpdateLASpoolWithStatusModel.getMethodRequest();
    cordys.setNodeText(GetSpoolDetailsModel.getMethodRequest(), ".//*[local-name()='Contract_No']", chdrnum.getValue());
    GetSpoolDetailsModel.reset();
    cordys.setNodeText(methodReq, ".//*[local-name()='seqNo']", cordys.getNodeText(GetSpoolDetailsModel.getData(), ".//*[local-name()='SEQ_NO']"));
    cordys.setNodeText(methodReq, ".//*[local-name()='callID']", "");
    cordys.setNodeText(methodReq, ".//*[local-name()='status']", "ISACTIVE_N");
    cordys.setNodeText(methodReq, ".//*[local-name()='stage_id']", "");
    UpdateLASpoolWithStatusModel.setMethodRequest(methodReq);
    UpdateLASpoolWithStatusModel.reset();
}

function omniURLBtn_Click(eventObject) {
    window.open("http://10.16.167.70/omnidocs/login.jsp", '_blank');
}

//added by rakesh on 28mar18 for save as draft
var click=0;
function save_as_D_draft_Click(eventObject) {
    if(click==0)
    {
    Save_as_draft_remark.show();
    click++;
    }
    else
    {
    cordys.setNodeText(GetObjectByCallIdModel.getMethodRequest(), ".//*[local-name()='callId']", call_id.getValue());
    GetObjectByCallIdModel.reset();
    var stageId = cordys.getNodeText(GetObjectByCallIdModel.getData(), ".//*[local-name()='STAGE_ID']", "");
    var seq_no = cordys.getNodeText(GetSpoolDetailsModel.getData(), ".//*[local-name()='SEQ_NO']");
    save_as_draft1.setValue("1");
    //UpdateLaSpoolModel.synchronize();
    GetSpoolDetailsModel.synchronize();
    if (stageId === '1') {
        _status4.setValue("SAVE_AS_DRAFT_D1");
    } else if (stageId === '2') {
        _status4.setValue("SAVE_AS_DRAFT_D2");
    } else if (stageId === '3') {
        _status4.setValue("SAVE_AS_DRAFT_MANAGER");
    }
    GetLaTransactionDetailsObjectModel.synchronize();
    alert("SAVED AS DRAFT");
    }
}

function reset_entry_Click(eventObject) {

    bank_name.setValue("");
    micr_code.setValue("");
    ifsc_code.setValue("");
    bank_account_no.setValue("");
    pay_type.setValue("");
    credit_card_no.setValue("");
    annuity_card_no.setValue("");
    creditcard_expdate.setValue("");
    bname.setValue("");
    instructions.setValue("");
    medical.setValue("");
    stamp_duty.setValue("");
    _mandate_number.setValue("");

    if (payout_amt_global != payout_amount.getValue()) {
        payout_amount.setValue(payout_amt_global);
    }
}

function medical_Change(eventObject) {
    if (callType == 'Payouts' && (subType == 'Freelook Refund' || subType == 'Fraud Refund' || subType == 'Freelook Misselling Refund' || subType == 'Refund of premiums')) {
        var payoutAmount = _suspense_amt.getValue() - medical.getValue() - stamp_duty.getValue();
        freelookDeductedAmt.setValue(payoutAmount);
    }
}

function stamp_duty_Change(eventObject) {
    if (callType == 'Payouts' && (subType == 'Freelook Refund' || subType == 'Fraud Refund' || subType == 'Freelook Misselling Refund' || subType == 'Refund of premiums')) {
        var payoutAmount = _suspense_amt.getValue() - medical.getValue() - stamp_duty.getValue();
        freelookDeductedAmt.setValue(payoutAmount);
    }
}