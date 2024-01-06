import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthProvider";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const { account } = useContext(AuthContext);
    const INITIAL_STATE = {
        chatID: "",
        user: {}
    }

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatID: account.uid > action.payload.uid ? account.uid + action.payload.uid : action.payload.uid + account.uid,
                }
            case "LOGOUT":
                return {
                    user: action.payload,
                    chatID: ""
                }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (<ChatContext.Provider value={{ data: state, dispatch }}>{children}</ChatContext.Provider>)
}

export default ChatProvider;