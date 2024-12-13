import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

export async function generateSignedUrl() {
    console.log('generating url...')
    try {
        const time = Math.floor(Date.now() / 1000); // Current Unix timestamp
        const expirationTime = time + Math.min(parseInt(process.env.SESSION_LENGTH) || 3600, 2592000);

        const token = jwt.sign({
            sub: process.env.EMAIL,
            iss: process.env.CLIENT_ID,
            jti: uuid(),
            iat: time,
            exp: expirationTime,
            account_type: process.env.ACCOUNT_TYPE,
            team: process.env.TEAM,
        }, process.env.SECRET, {
            algorithm: 'HS256',
            keyid: process.env.CLIENT_ID
        });

        const signedEmbedUrl = `${process.env.BASE_URL}?:jwt=${token}&:embed=true&:menu_position=none`;
        // Log important configuration details to ensure they are correctly set
        console.log('BASE_URL:', process.env.BASE_URL);
        console.log('CLIENT_ID:', process.env.CLIENT_ID); // Verify the client ID
        console.log('SESSION_LENGTH:', process.env.SESSION_LENGTH);
        console.log('TEAMS:', process.env.TEAM);
        console.log('ACCOUNT_TYPE:', process.env.ACCOUNT_TYPE);
        console.log('Signed Embed URL:', signedEmbedUrl);

        return signedEmbedUrl;
    } catch (error) {
        console.error("Failed to generate JWT:", error);
        throw new Error("JWT generation failed");
    }
}

