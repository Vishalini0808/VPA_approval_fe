sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (
    Controller,
    Filter,
    FilterOperator,
    MessageToast
) {
    "use strict";

    return Controller.extend("vpaapproval.controller.View1", {

        // =========================================================
        // INIT
        // =========================================================
        onInit: function () {
            console.log("===== VIEW1 CONTROLLER LOADED =====");
        },


        // =========================================================
        // SEARCH
        // =========================================================
        onSearch: function () {

            var oView = this.getView();

            var sReferenceNumber = oView
                .byId("referenceNumberInput")
                .getValue()
                .trim();

            var sSubmitterEmail = oView
                .byId("submitterInput")
                .getValue()
                .trim();

            var sStatus = oView
                .byId("statusSelect")
                .getSelectedKey();

            var aFilters = [];

            // Reference Number filter
            if (sReferenceNumber) {
                aFilters.push(
                    new Filter(
                        "referenceNumber",
                        FilterOperator.Contains,
                        sReferenceNumber
                    )
                );
            }

            // Submitter Email filter
            if (sSubmitterEmail) {
                aFilters.push(
                    new Filter(
                        "submitterEmail",
                        FilterOperator.Contains,
                        sSubmitterEmail
                    )
                );
            }

            // Status filter
            if (sStatus && sStatus !== "ALL") {
                aFilters.push(
                    new Filter(
                        "status",
                        FilterOperator.EQ,
                        sStatus
                    )
                );
            }

            // Get table binding
            var oTable = oView.byId("submissionTable");
            var oBinding = oTable.getBinding("items");

            if (!oBinding) {
                MessageToast.show("Table binding not available");
                console.error("Submission table binding not found");
                return;
            }

            // Apply filters
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


        // =========================================================
        // CLEAR FILTERS
        // =========================================================
        onClear: function () {

            var oView = this.getView();

            // Clear Reference Number
            oView
                .byId("referenceNumberInput")
                .setValue("");

            // Clear Submitter Email
            oView
                .byId("submitterInput")
                .setValue("");

            // Reset Status
            oView
                .byId("statusSelect")
                .setSelectedKey("ALL");

            // Clear table filters
            var oTable = oView.byId("submissionTable");
            var oBinding = oTable.getBinding("items");

            if (oBinding) {
                oBinding.filter([]);
            }

            console.log("===== FILTERS CLEARED =====");

            MessageToast.show("Filters cleared");
        },


        // =========================================================
        // REFRESH
        // =========================================================
        onRefresh: function () {

            var oTable = this.getView().byId("submissionTable");
            var oBinding = oTable.getBinding("items");

            if (!oBinding) {
                MessageToast.show("Table binding not available");
                return;
            }

            oBinding.refresh();

            console.log("===== TABLE REFRESHED =====");

            MessageToast.show("Submissions refreshed");
        },


        // =========================================================
        // ROW CLICK / NAVIGATION
        // =========================================================
  onItemPress: function (oEvent) {

    var oSource = oEvent.getSource();
    var oContext = oSource.getBindingContext();

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

    this.getOwnerComponent()
        .getRouter()
        .navTo("RouteObjectPage", {
            ID: sID
        });
}
,

        // =========================================================
        // MULTI SELECT
        // =========================================================
        onSelectionChange: function (oEvent) {

            var oTable = this.getView().byId("submissionTable");

            var aSelectedItems = oTable.getSelectedItems();

            console.log(
                "===== SELECTION CHANGED ====="
            );

            console.log(
                "Selected item count:",
                aSelectedItems.length
            );

            aSelectedItems.forEach(function (oItem) {

                var oContext = oItem.getBindingContext();

                if (oContext) {

                    var oData = oContext.getObject();

                    console.log(
                        "Selected submission:",
                        oData
                    );
                }

            });

            if (aSelectedItems.length > 0) {
                MessageToast.show(
                    aSelectedItems.length +
                    " submission(s) selected"
                );
            }
        },


        // =========================================================
        // BACK BUTTON
        // =========================================================
        onNavBack: function () {

            console.log("===== BACK BUTTON CLICKED =====");

            this.getOwnerComponent()
                .getRouter()
                .navTo("RouteView1");
        }

    });
});