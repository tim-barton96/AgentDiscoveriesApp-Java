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
    void givenString_whenEncrypt_thenSuccess()
        throws NoSuchAlgorithmException, IllegalBlockSizeException, InvalidKeyException,
        BadPaddingException, InvalidAlgorithmParameterException, NoSuchPaddingException { 
        
        String input = "baeldung";
        SecretKey key = messageProcessor.generateKey(128);
        IvParameterSpec ivParameterSpec = messageProcessor.generateIv();
        String algorithm = "AES/CBC/PKCS5Padding";
        String cipherText = messageProcessor.encrypt(algorithm, input, key, ivParameterSpec);
        String plainText = messageProcessor.decrypt(algorithm, cipherText, key, ivParameterSpec);
        Assertions.assertEquals(input, plainText);
    }

    @Test
    void givenPassword_whenEncrypt_thenSuccess() 
        throws InvalidKeySpecException, NoSuchAlgorithmException, 
        IllegalBlockSizeException, InvalidKeyException, BadPaddingException, 
        InvalidAlgorithmParameterException, NoSuchPaddingException {
        
        String plainText = "www.baeldung.commmmmm";
        String password = "baeldung";
        String salt = "12345678";
        String algorithm = "AES/CBC/PKCS5Padding";
        IvParameterSpec ivParameterSpec = messageProcessor.generateIv();
        SecretKey key = messageProcessor.getKeyFromPassword(password,salt);
        String cipherText = messageProcessor.encrypt(algorithm, plainText, key, ivParameterSpec);
        String decryptedCipherText = messageProcessor.decrypt(algorithm, cipherText, key, ivParameterSpec);
        Assertions.assertEquals(plainText, decryptedCipherText);
    }

    // @Test
    // void again_givenPassword_whenEncrypt_thenSuccess() 
    //     throws InvalidKeySpecException, NoSuchAlgorithmException, 
    //     IllegalBlockSizeException, InvalidKeyException, BadPaddingException, 
    //     InvalidAlgorithmParameterException, NoSuchPaddingException {
        
    //     String plainText = "www.baeldung.com";
    //     String password = "baeldung";
    //     IvParameterSpec ivParameterSpec = messageProcessor.generateIv();
    //     String cipherText = messageProcessor.encodeM(plainText, password, ivParameterSpec);
    //     String decryptedCipherText = messageProcessor.decodeM(cipherText, password, ivParameterSpec);
    //     Assertions.assertEquals(plainText, decryptedCipherText);
    // }
}
