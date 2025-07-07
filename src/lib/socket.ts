import { io } from "socket.io-client";

const socket = io("https://quizgensocket.onrender.com"); // Replace with your backend URL in production


export default socket;
