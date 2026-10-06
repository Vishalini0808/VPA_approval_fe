sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("vpaapproval.controller.ObjectPage", {

        onInit: function () {

            console.log("OBJECT PAGE CONTROLLER LOADED");

            var oRouter = this.getOwnerComponent().getRouter();

            oRouter.getRoute("RouteObjectPage").attachPatternMatched(this._onObjectMatched, this);
        },


        _onObjectMatched: function (oEvent) {

            var sID = oEvent.getParameter("arguments").ID;

            console.log("OBJECT PAGE MATCHED");
            console.log("Selected ID:", sID);

            if (!sID) {

                MessageToast.show("Submission ID not found");

                return;
            }

            var sPath = "/Submissions(" + sID + ")";

            console.log("Binding path:", sPath);

            this.getView().bindElement({
                path: sPath,

                events: {

                    dataRequested: function () {

                        console.log("Submission data requested");

                    },

                    dataReceived: function (oDataEvent) {

                        console.log("Submission data received");

                        if (oDataEvent.getParameter("error")) {

                            console.error(
                                "Error loading submission:",
                                oDataEvent.getParameter("error")
                            );

                            MessageToast.show(
                                "Unable to load submission"
                            );
                        }
                    }
                }
            });
        },


        onApprove: function () {

            console.log("APPROVE BUTTON CLICKED");

            var oContext = this.getView().getBindingContext();

            console.log('selected object',oContext)

            if (!oContext) {

                MessageBox.error( "Submission data is not available.");

                return;
            }

            var oData = oContext.getObject();

            console.log("Current submission:",oData);

            if (oData.status !== "SUBMITTED") {

                MessageBox.confirm("Only submitted requests can be approved.");

                return;
            }

            var sReferenceNumber = oData.referenceNumber;

            MessageBox.confirm("Do you want to approve " + sReferenceNumber + "?",
                {
                    title: "Approve Submission",

                    actions: [ MessageBox.Action.YES,MessageBox.Action.NO],

                    emphasizedAction:MessageBox.Action.YES,

                    onClose: function (sAction) {

                        if (sAction !== MessageBox.Action.YES) 
                        {
                            return;
                        }

                        console.log( "CALLING approvePricing ACTION");

                        var oModel = this.getView().getModel();
                        
                        var oOperation = oModel.bindContext("/approvePricing(...)");

                        oOperation.setParameter("referenceNumber", sReferenceNumber);

                        oOperation.execute() .then(function (oResult) {

                        console.log("approvePricing response:",  oResult);

                        MessageBox.confirm("Submission approved successfully");

                        this.byId("approveButton").setVisible(false);
                        this.byId("rejectButton").setVisible(false);

                        oContext.requestRefresh();

                        }).catch(function (oError) {

                                console.error("approvePricing failed:",oError);

                                MessageBox.error("Unable to approve submission.");
                      });

                    }.bind(this)
                }
            );
        },


  

        onReject: function () {

            console.log("REJECT BUTTON CLICKED");

            var oContext =this.getView().getBindingContext();

            if (!oContext) {

                MessageBox.error( "Submission data is not available.");

                return;
            }

            var oData = oContext.getObject();

            console.log("Current submission:",oData);

            if (oData.status !== "SUBMITTED") {

                MessageBox.confirm( "Only submitted requests can be rejected.");

                return;
            }

            var sReferenceNumber = oData.referenceNumber;
            
            var sComments = oData.comments ||"Rejected by approver";


            MessageBox.confirm("Do you want to reject " +sReferenceNumber +"?",{

                    title: "Reject Submission",

                    actions: [ MessageBox.Action.YES,MessageBox.Action.NO],

                    emphasizedAction:MessageBox.Action.YES,

                    onClose: function (sAction) {

                        if ( sAction !==MessageBox.Action.YES  ) 
                        {
                            return;
                        }

                        console.log("CALLING rejectPricing ACTION");

                        var oModel = this.getView().getModel();
                        
                        var oOperation = oModel.bindContext("/rejectPricing(...)");

                        oOperation.setParameter( "referenceNumber",sReferenceNumber );

                        oOperation.setParameter("comments",sComments);

                        oOperation.execute().then(function (oResult) {

                                console.log("rejectPricing response:", oResult );

                                MessageToast.show("Submission rejected successfully" );


                                this.byId("approveButton").setVisible(false);
                                this.byId("rejectButton").setVisible(false);

                            
                                oContext.requestRefresh();

                            }) .catch(function (oError) {

                                console.error("rejectPricing failed:",oError);

                                MessageBox.error("Unable to reject submission.");
                            });

                    }.bind(this)
                }
            );
        },



        onNavBack: function () {

            console.log("OBJECT PAGE BACK");

            this.getOwnerComponent().getRouter().navTo("RouteView1");
        }

    });
});