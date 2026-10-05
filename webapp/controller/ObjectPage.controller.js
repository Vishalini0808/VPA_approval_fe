sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (
    Controller,
    MessageToast,
    MessageBox
) {
    "use strict";

    return Controller.extend("vpaapproval.controller.ObjectPage", {

        /* ===================================================== */
        /* INIT */
        /* ===================================================== */

        onInit: function () {

            console.log(
                "===== OBJECT PAGE CONTROLLER LOADED ====="
            );

            var oRouter =
                this.getOwnerComponent().getRouter();

            oRouter
                .getRoute("RouteObjectPage")
                .attachPatternMatched(
                    this._onObjectMatched,
                    this
                );
        },


        /* ===================================================== */
        /* LOAD SELECTED SUBMISSION */
        /* ===================================================== */

        _onObjectMatched: function (oEvent) {

            var sID = oEvent
                .getParameter("arguments")
                .ID;

            console.log(
                "===== OBJECT PAGE MATCHED ====="
            );

            console.log(
                "Selected ID:",
                sID
            );


            if (!sID) {

                MessageToast.show(
                    "Submission ID not found"
                );

                return;
            }


            /*
             * OData V4 UUID
             */

            var sPath =
                "/Submissions(" + sID + ")";


            console.log(
                "Binding path:",
                sPath
            );


            this.getView().bindElement({

                path: sPath,

                events: {

                    dataRequested: function () {

                        console.log(
                            "Submission data requested"
                        );

                    },


                    dataReceived: function (oDataEvent) {

                        console.log(
                            "Submission data received"
                        );


                        if (
                            oDataEvent.getParameter(
                                "error"
                            )
                        ) {

                            console.error(
                                "Error loading submission:",
                                oDataEvent.getParameter(
                                    "error"
                                )
                            );

                            MessageToast.show(
                                "Unable to load submission"
                            );

                        }

                    }

                }

            });

        },


        /* ===================================================== */
        /* APPROVE */
        /* ===================================================== */

        onApprove: function () {

            console.log(
                "===== APPROVE BUTTON CLICKED ====="
            );


            var oContext =
                this.getView().getBindingContext();


            if (!oContext) {

                MessageBox.error(
                    "Submission data is not available."
                );

                return;
            }


            var oData =
                oContext.getObject();


            console.log(
                "Current submission:",
                oData
            );


            /* Only SUBMITTED can be approved */

            if (oData.status !== "SUBMITTED") {

                MessageToast.show(
                    "Only submitted requests can be approved."
                );

                return;
            }


            var sReferenceNumber =
                oData.referenceNumber;


            MessageBox.confirm(

                "Do you want to approve " +
                sReferenceNumber +
                "?",

                {

                    title: "Approve Submission",

                    actions: [
                        MessageBox.Action.YES,
                        MessageBox.Action.NO
                    ],

                    emphasizedAction:
                        MessageBox.Action.YES,


                    onClose: function (sAction) {

                        if (
                            sAction !==
                            MessageBox.Action.YES
                        ) {
                            return;
                        }


                        console.log(
                            "===== UPDATING STATUS TO APPROVED ====="
                        );


                        /*
                         * OData V4 PATCH
                         *
                         * SUBMITTED → APPROVED
                         */

                        oContext
                            .setProperty(
                                "status",
                                "APPROVED"
                            )
                            .then(function () {

                                console.log(
                                    "===== APPROVED SUCCESSFULLY ====="
                                );


                                MessageToast.show(
                                    "Submission approved successfully"
                                );


                                /*
                                 * Refresh the binding
                                 * so UI immediately reflects
                                 * the new status.
                                 */

                                oContext
                                    .requestRefresh();

                            })
                            .catch(function (oError) {

                                console.error(
                                    "Approve failed:",
                                    oError
                                );


                                MessageBox.error(
                                    "Unable to approve submission."
                                );

                            });

                    }

                }

            );

        },


        /* ===================================================== */
        /* REJECT */
        /* ===================================================== */

        onReject: function () {

            console.log(
                "===== REJECT BUTTON CLICKED ====="
            );


            var oContext =
                this.getView().getBindingContext();


            if (!oContext) {

                MessageBox.error(
                    "Submission data is not available."
                );

                return;
            }


            var oData =
                oContext.getObject();


            console.log(
                "Current submission:",
                oData
            );


            /* Only SUBMITTED can be rejected */

            if (oData.status !== "SUBMITTED") {

                MessageToast.show(
                    "Only submitted requests can be rejected."
                );

                return;
            }


            var sReferenceNumber =
                oData.referenceNumber;


            MessageBox.confirm(

                "Do you want to reject " +
                sReferenceNumber +
                "?",

                {

                    title: "Reject Submission",

                    actions: [
                        MessageBox.Action.YES,
                        MessageBox.Action.NO
                    ],

                    emphasizedAction:
                        MessageBox.Action.YES,


                    onClose: function (sAction) {

                        if (
                            sAction !==
                            MessageBox.Action.YES
                        ) {
                            return;
                        }


                        console.log(
                            "===== UPDATING STATUS TO REJECTED ====="
                        );


                        /*
                         * OData V4 PATCH
                         *
                         * SUBMITTED → REJECTED
                         */

                        oContext
                            .setProperty(
                                "status",
                                "REJECTED"
                            )
                            .then(function () {

                                console.log(
                                    "===== REJECTED SUCCESSFULLY ====="
                                );


                                MessageToast.show(
                                    "Submission rejected successfully"
                                );


                                /*
                                 * Refresh UI
                                 */

                                oContext
                                    .requestRefresh();

                            })
                            .catch(function (oError) {

                                console.error(
                                    "Reject failed:",
                                    oError
                                );


                                MessageBox.error(
                                    "Unable to reject submission."
                                );

                            });

                    }

                }

            );

        },


        /* ===================================================== */
        /* BACK */
        /* ===================================================== */

        onNavBack: function () {

            console.log(
                "===== OBJECT PAGE BACK ====="
            );


            this.getOwnerComponent()
                .getRouter()
                .navTo("RouteView1");

        }

    });

});