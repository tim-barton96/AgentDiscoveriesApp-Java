package org.softwire.training.api.core;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.configuration2.Configuration;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import javax.inject.Inject;
import javax.xml.bind.DatatypeConverter;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.List;

/**
 * The MessageProcessor selects a word from a list and applies a shift cipher.
 *
 * This rotates the set of printable characters based on the letters in the codeword.
 * Non-ASCII and non-printable characters (including spaces) are unchanged.
 */
public class MessageProcessor {

    // Printable ASCII characters, not including space
    private static final char FIRST_PRINTABLE = 0x21;
    private static final char LAST_PRINTABLE = 0x7E;

    private static final List<String> WORD_LIST;

    //private SecretKey key;
    private String password;

    static {
        try {
            WORD_LIST = Resources.readLines(
                    Resources.getResource("codewords.txt"),
                    Charsets.UTF_8);
        } catch (IOException e) {
            // Should never fail!
            throw new RuntimeException(e);
        }
    }

    public String encodeM(String message, String password) throws NoSuchAlgorithmException, InvalidKeySpecException, 
    InvalidKeyException, NoSuchPaddingException, InvalidAlgorithmParameterException, BadPaddingException, IllegalBlockSizeException {
        String algorithm = "AES/CBC/PKCS5Padding";
        IvParameterSpec ivParameterSpec = generateIv(); // need to add IV to start of the cipher text 
        String hexString = ivToHexString(ivParameterSpec); 
        String salt = saltCreator(hexString);
        SecretKey key = getKeyFromPassword(password, salt);
        String cipherText = hexString + encrypt(algorithm, message, key, ivParameterSpec);
        return cipherText;
    }

    public String decodeM(String cipherText, String password) throws NoSuchAlgorithmException, InvalidKeySpecException, 
    InvalidKeyException, NoSuchPaddingException, InvalidAlgorithmParameterException, BadPaddingException, IllegalBlockSizeException {
        String algorithm = "AES/CBC/PKCS5Padding";
        String hexIv = cipherText.substring(0, 32);
        String cipherMinusHex = cipherText.substring(32);
        IvParameterSpec ivParameterSpec = hexStringToIv(hexIv);
        String salt = saltCreator(hexIv);
        SecretKey key = getKeyFromPassword(password, salt);
        String decryptedCipherText = decrypt(algorithm, cipherMinusHex, key, ivParameterSpec);
        return decryptedCipherText;
    }
    
    public static SecretKey getKeyFromPassword(String password, String salt)
    throws NoSuchAlgorithmException, InvalidKeySpecException {//speed affected by iteration count
    SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
    KeySpec spec = new PBEKeySpec(password.toCharArray(), salt.getBytes(), 5000, 256);
     SecretKey secret = new SecretKeySpec(factory.generateSecret(spec)
        .getEncoded(), "AES");
    return secret;
    }

    public static IvParameterSpec generateIv() {
        byte[] iv = new byte[16];
        new SecureRandom().nextBytes(iv);
        return new IvParameterSpec(iv);
    }

    public String ivToHexString(IvParameterSpec ivParameterSpec) {
        byte[] tempBytes = ivParameterSpec.getIV();
        StringBuilder hexIVAsStringTemp = new StringBuilder();
        for (byte b : tempBytes) {
            hexIVAsStringTemp.append(String.format("%02X ", b));
        }
        String hexIVAsString = hexIVAsStringTemp.toString().replaceAll(" ", "");
        return hexIVAsString.toString();
    }

    public IvParameterSpec hexStringToIv(String hexString) {
        byte[] bytes = DatatypeConverter.parseHexBinary(hexString);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(bytes);
        return ivParameterSpec;
    }

    public static String encrypt(String algorithm, String input, SecretKey key,
    IvParameterSpec iv) throws NoSuchPaddingException, NoSuchAlgorithmException,
    InvalidAlgorithmParameterException, InvalidKeyException,
    BadPaddingException, IllegalBlockSizeException {
    
        Cipher cipher = Cipher.getInstance(algorithm);
        cipher.init(Cipher.ENCRYPT_MODE, key, iv);
        byte[] cipherText = cipher.doFinal(input.getBytes());
        return Base64.getEncoder()
            .encodeToString(cipherText);
    }

    public static String decrypt(String algorithm, String cipherText, SecretKey key,
    IvParameterSpec iv) throws NoSuchPaddingException, NoSuchAlgorithmException,
    InvalidAlgorithmParameterException, InvalidKeyException,
    BadPaddingException, IllegalBlockSizeException {
    
        Cipher cipher = Cipher.getInstance(algorithm);
        cipher.init(Cipher.DECRYPT_MODE, key, iv);
        byte[] plainText = cipher.doFinal(Base64.getDecoder()
            .decode(cipherText));
        return new String(plainText);
    } 

    public String saltCreator(String hexString) {
        String salt = java.time.LocalDate.now().toString().substring(0, 5) + hexString.substring(0, 3)
         + java.time.LocalDate.now().toString().substring(6) + hexString.substring(4, 8);
        return salt;
    }


    private final String seed;

    public MessageProcessor(String seed) {
        this.seed = seed;
    }

    @Inject
    public MessageProcessor(Configuration configuration) {
        this(configuration.getString("message.encoding.seed"));
    }

    public String encode(String input){
        return applyShiftCipher(input, getCodeWord(), false);
    }

    public String decode(String input){
        return applyShiftCipher(input, getCodeWord(), true);
    }

    private String applyShiftCipher(String input, String codeWord, boolean invert) {
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < input.length(); i++) {
            char ch = input.charAt(i);
            if (isAsciiPrintable(ch)) {
                int shift = codeWord.charAt(i % codeWord.length()) - FIRST_PRINTABLE;
                result.append(shiftPrintableChar(ch, invert ? -shift : shift));
            } else {
                result.append(ch);
            }
        }

        return result.toString();
    }

    /**
     * Use a combination of the secret seed and the date to generate a hash.
     * This is used to select a word from the list.
     *
     * It should be cryptographically difficult to deduce the seed,
     * the date or the next word given any of the others.
     */
    private String getCodeWord() {
        // Input bytes from the seed and current date
        byte[] input = ByteBuffer.allocate(8)
                .putInt(LocalDate.now(ZoneOffset.UTC).hashCode())
                .put(seed.getBytes(StandardCharsets.UTF_8))
                .array();

        // Hash the input
        byte[] hash = DigestUtils.md5(input);

        // Extract the first 4 bytes as an int
        int result = ByteBuffer.wrap(hash).getInt();

        // Select a word using the result
        return WORD_LIST.get(Math.floorMod(result, WORD_LIST.size()));
    }

    private boolean isAsciiPrintable(char ch) {
        return ch >= FIRST_PRINTABLE && ch <= LAST_PRINTABLE;
    }

    private char shiftPrintableChar(char ch, int shift) {
        int offset = FIRST_PRINTABLE; // the start of printable characters
        int limit = LAST_PRINTABLE - FIRST_PRINTABLE;

        // floorMod is like '%' but always returns a positive integer
        return (char) (Math.floorMod(ch + shift - offset, limit) + offset);
    }
}
