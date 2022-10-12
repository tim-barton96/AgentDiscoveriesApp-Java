package org.softwire.training.api.routes.v1;

import org.softwire.training.api.core.JsonRequestUtils;
import org.softwire.training.api.core.MessageProcessor;
import org.softwire.training.models.Message;
import spark.Request;
import spark.Response;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.inject.Inject;

public class MessageProcessorRoutes {

    private MessageProcessor messageProcessor;

    @Inject
    public MessageProcessorRoutes(MessageProcessor messageProcessor) {
        this.messageProcessor = messageProcessor;
    }

    // public Message encodeMessage(Request req, Response res) {
    //     Message message = JsonRequestUtils.readBodyAsType(req, Message.class);
    //     String encoded = messageProcessor.encode(message.getMessage());
    //     return new Message(encoded);
    // }

    // public Message decodeMessage(Request req, Response res) {
    //     Message message = JsonRequestUtils.readBodyAsType(req, Message.class);
    //     String decoded = messageProcessor.decode(message.getMessage());
    //     return new Message(decoded);
    // }

    public String encodeMessage(Request req, Response res) throws InvalidKeyException, NoSuchAlgorithmException, InvalidKeySpecException, 
    NoSuchPaddingException, InvalidAlgorithmParameterException, BadPaddingException, IllegalBlockSizeException { //needs to take password from form
        Message message = JsonRequestUtils.readBodyAsType(req, Message.class);
        String encoded = messageProcessor.encodeM(message.getMessage(), message.getPassword());
        return encoded;
    }

    public String decodeMessage(Request req, Response res) throws InvalidKeyException, NoSuchAlgorithmException, InvalidKeySpecException, 
    NoSuchPaddingException, InvalidAlgorithmParameterException, BadPaddingException, IllegalBlockSizeException {
        Message message = JsonRequestUtils.readBodyAsType(req, Message.class);
        String decoded = messageProcessor.decodeM(message.getMessage(), message.getPassword());
        return decoded;
    }

}
