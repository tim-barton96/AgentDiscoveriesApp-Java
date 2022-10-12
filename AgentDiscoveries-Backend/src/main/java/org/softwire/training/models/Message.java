package org.softwire.training.models;

public class Message {
    private String message;
    private String password;

    public Message(String message, String password) {
        this.message = message;
        this.password = password;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

}

