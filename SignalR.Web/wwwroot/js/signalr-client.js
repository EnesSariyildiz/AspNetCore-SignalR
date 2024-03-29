$(document).ready(function () {

    const connection = new signalR.HubConnectionBuilder().withUrl("/exampleTypeSafeHub").configureLogging(signalR.LogLevel.Information).build();

    const broadCastMessageToAllClientHubMethodCall = "BroadCastMessageToAllClient";
    const receiveMessageForAllClientClientMethodCall = "ReceiveMessageForAllClient";

    const broadCastMessageToCallerClient = "BroadCastMessageToCallerClient";
    const receiveMessageForCallerClient = "ReceiveMessageForCallerClient";

    const broadCastMessageToOthersClient = "BroadCastMessageToOthersClient";
    const receiveMessageForOthersClient = "ReceiveMessageForOthersClient";

    const broadcastMessageToIndividualClient = "BroadcastMessageToIndividualClient";
    const receiveMessageForIndividualClient = "ReceiveMessageForIndividualClient";

    const receiveConnectedClientCountAllClient = "ReceiveConnectedClientCountAllClient";

    const broadcastTypedMessageToAllClient = "BroadcastTypedMessageToAllClient";
    const receiveTypedMessageForAllClient = "ReceiveTypedMessageForAllClient";

    const groupA = "GroupA";
    const groupB = "GroupB";
    let currentGroupList = [];

    function refreshGroupList() {
        $("#groupList").empty();
        currentGroupList.forEach(x => {
            $("#groupList").append(`<p>${x}<p>`)
        })
    }

    $("#btn-groupA-add").click(function () {
        if (currentGroupList.includes(groupA)) return;

        connection.invoke("AddGroup", groupA).then(() => {
            currentGroupList.push(groupA);
            refreshGroupList();
        })
    })

    $("#btn-groupB-add").click(function () {
        if (currentGroupList.includes(groupB)) return;

        connection.invoke("AddGroup", groupB).then(() => {
            currentGroupList.push(groupB);
            refreshGroupList();
        })
    })

    $("#btn-groupA-remove").click(function () {
        if (!currentGroupList.includes(groupA)) return;

        connection.invoke("RemoveGroup", groupA).then(() => {
            currentGroupList = currentGroupList.filter(x => x !== groupA);
            refreshGroupList();
        })
    })

    $("#btn-groupB-remove").click(function () {
        if (!currentGroupList.includes(groupB)) return;

        connection.invoke("RemoveGroup", groupB).then(() => {
            currentGroupList = currentGroupList.filter(x => x !== groupB);
            refreshGroupList();
        })
    })

    $("#btn-groupA-send-message").click(function () {
        const message = "Hello Group A!";
        connection.invoke("BroadcastMessageToGroupClient", groupA, message).catch(err => console.error("error", err));
        console.log("Message sended!");
    })

    $("#btn-groupB-send-message").click(function () {
        const message = "Hello Group B!";
        connection.invoke("BroadcastMessageToGroupClient", groupB, message).catch(err => console.error("error", err));
        console.log("Message sended!");
    })

    connection.on("ReceiveMessageForGroupClients", (message) => {
        console.log("Incomming message: ", message);
    })

    function start() {
        connection.start().then(() => {
            console.log("Connected to Hub.");
            $("#connectionId").html(`Connection Id : ${connection.connectionId}`);
        });
    }

    try {
        start();
    }
    catch {
        setTimeout(() => start(), 5000);
    }

    const span_client_count = $("#span-connected-client-count");
    connection.on(receiveConnectedClientCountAllClient, (count) => {
        span_client_count.text(count);
        console.log("Connected client count: ", count);
    })

    //subscribe
    connection.on(receiveMessageForAllClientClientMethodCall, (message) => {
        console.log("Incomming message: ", message);
    })

    connection.on(receiveTypedMessageForAllClient, (product) => {
        console.log("Incomming product: ", product);
    })

    connection.on(receiveMessageForCallerClient, (message) => {
        console.log("(Caller) Incomming message: ", message);
    })

    connection.on(receiveMessageForOthersClient, (message) => {
        console.log("(Others) Incomming message: ", message);
    })

    connection.on(receiveMessageForIndividualClient, (message) => {
        console.log("(Individual) Incomming message: ", message);
    })

    $("#btn-send-message-all-client").click(function () {
        const message = "hello world";
        connection.invoke(broadCastMessageToAllClientHubMethodCall, message).catch(err => console.error("error", err));
        console.log("Message sended!");

    })

    $("#btn-send-message-caller-client").click(function () {
        const message = "hello world";
        connection.invoke(broadCastMessageToCallerClient, message).catch(err => console.error("error", err));
        console.log("Message sended!");
    })

    $("#btn-send-message-others-client").click(function () {
        const message = "hello world";
        connection.invoke(broadCastMessageToOthersClient, message).catch(err => console.error("error", err));
        console.log("Message sended!");
    })

    $("#btn-send-message-individual-client").click(function () {
        const message = "Hello world";
        const connectionId = $("#text-connectionId").val();
        connection.invoke(broadcastMessageToIndividualClient, connectionId, message).catch(err => console.error("error", err))
        console.log("Message sended!");
    })
    $("#btn-send-typed-message-all-client").click(function () {
        const product = { id: 1, name: "pen 1", price: 200 };

        connection.invoke(broadcastTypedMessageToAllClient, product).catch(err => console.error("error", err))
        console.log("Product sended!");

    })
})