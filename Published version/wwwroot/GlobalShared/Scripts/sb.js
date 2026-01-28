import { GameController } from "../objects/GameController.js";

// create controller instance
const controller = new GameController();

// WebSocket to SOS
const socket = new WebSocket("ws://localhost:49122");

socket.onopen = () => console.log("Connected to SOS");

socket.onmessage = (msg) => {
    try {
        const json = JSON.parse(msg.data);
        controller.handle(json);
    } catch (e) {
        console.error("Invalid JSON", e);
    }
};

export function getData() {
    return controller;
}