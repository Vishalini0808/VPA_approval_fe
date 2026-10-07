sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, Filter, FilterOperator, MessageToast) {

    "use strict";

    return Controller.extend("vpaapproval.controller.View1", {

        onInit: function () {
            console.log(" VIEW1 CONTROLLER LOADED ");
        },

        onSearch: function () {

            var oView = this.getView();

            console.log('oView..........', oView)

            var sReferenceNumber = oView.byId("referenceNumberInput").getValue().trim();

            console.log('referencenumber value', sReferenceNumber)

            var sSubmitterEmail = oView.byId("submitterInput").getValue().trim();

            console.log("submitteremail", sSubmitterEmail);

            var sStatus = oView.byId("statusSelect").getSelectedKey();

            console.log('selected key value', sStatus)

            var aFilters = [];

            if (sReferenceNumber) {
                aFilters.push(new Filter("referenceNumber", FilterOperator.Contains, sReferenceNumber));
            }


            if (sSubmitterEmail) {

                aFilters.push(new Filter("submitterEmail", FilterOperator.Contains, sSubmitterEmail));
            }


            if (sStatus && sStatus !== "ALL") {

                aFilters.push(new Filter("status", FilterOperator.EQ, sStatus));
            }

            var oTable = oView.byId("submissionTable");
            var oBinding = oTable.getBinding("items");

            if (!oBinding) {
                MessageToast.show("Table binding not available");
                console.error("Submission table binding not found");
                return;
            }


            oBinding.filter(aFilters);

            console.log("Reference Number:", sReferenceNumber);
            console.log("Submitter Email:", sSubmitterEmail);
            console.log("Status:", sStatus);
            console.log("Filters:", aFilters);

            if (aFilters.length > 0) {
                MessageToast.show("Filter applied");
            } else {
                MessageToast.show("Showing all submissions");
            }
        },

        onClear: function () {

            var oView = this.getView();


            oView.byId("referenceNumberInput").setValue("");


            oView.byId("submitterInput").setValue("");


            oView.byId("statusSelect").setSelectedKey("ALL");


            var oTable = oView.byId("submissionTable");
            var oBinding = oTable.getBinding("items");

            console.log('oBinding values', oBinding)

            if (oBinding) {
                oBinding.filter([]);
            }

            console.log(" FILTERS CLEARED ");

            MessageToast.show("Filters cleared");
        },

        onRefresh: function () {

            var oTable = this.getView().byId("submissionTable");
            var oBinding = oTable.getBinding("items");

            if (!oBinding) {
                MessageToast.show("Table binding not available");
                return;
            }

            oBinding.refresh();

            console.log(" TABLE REFRESHED ");

            MessageToast.show("Submissions refreshed");
        },


        onItemPress: function (oEvent) {

            var oSource = oEvent.getSource();
            console.log('getsource value', oSource)
            var oContext = oSource.getBindingContext();

            console.log('bindingcontext value', oContext);

            if (!oContext) {
                console.error("Binding context not found");
                MessageToast.show("Unable to get submission data");
                return;
            }

            var oData = oContext.getObject();

            console.log("Selected submission:", oData);

            var sID = oData.ID;

            console.log("Selected ID:", sID);

            if (!sID) {
                MessageToast.show("Submission ID not found");
                return;
            }

            this.getOwnerComponent().getRouter().navTo("RouteObjectPage", { ID: sID });
        }
        ,
        onSelectionChange: function (oEvent) {

            var oTable = this.getView().byId("submissionTable");

            var aSelectedItems = oTable.getSelectedItems();

            console.log(" SELECTION CHANGED");

            console.log("Selected item count:", aSelectedItems.length);

            aSelectedItems.forEach(function (oItem) {

                var oContext = oItem.getBindingContext();

                if (oContext) {

                    var oData = oContext.getObject();

                    console.log("Selected submission:", oData);
                }

            });

            if (aSelectedItems.length > 0) {
                MessageToast.show(aSelectedItems.length + " submission(s) selected");
            }
        },

        onNavBack: function () {

            console.log(" BACK BUTTON CLICKED ");

            this.getOwnerComponent().getRouter().navTo("RouteView1");
        }

    });
});