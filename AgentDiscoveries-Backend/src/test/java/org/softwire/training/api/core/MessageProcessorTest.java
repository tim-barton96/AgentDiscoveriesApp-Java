package org.softwire.training.api.core;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;

public class MessageProcessorTest {

    private final MessageProcessor messageProcessor = new MessageProcessor("dev");

    @Test
    public void encodeModifiesMessage() {
        String input = "Some test message! :)";
        String encoded = messageProcessor.encode(input);
        assertNotEquals(input, encoded);
    }

    @Test
    public void decodeModifiesMessage() {
        String input = "Some test message! :)";
        String decode = messageProcessor.decode(input);
        assertNotEquals(input, decode);
    }

    @Test
    public void encodeAndDecodeRoundTrip() {
        String input = "hello";
        String encoded = messageProcessor.encode(input);
        String decoded = messageProcessor.decode(encoded);
        assertEquals(input, decoded);
    }

    @Test
    void givenPassword_whenEncrypt_thenSuccess() 
        throws InvalidKeySpecException, NoSuchAlgorithmException, 
        IllegalBlockSizeException, InvalidKeyException, BadPaddingException, 
        InvalidAlgorithmParameterException, NoSuchPaddingException {
        
        String plainText = "www.baeldung.com";
        String password = "baeldung";
        String cipherText = messageProcessor.encodeM(plainText, password);
        String decryptedCipherText = messageProcessor.decodeM(cipherText, password);
        Assertions.assertEquals(plainText, decryptedCipherText);
    }
}
