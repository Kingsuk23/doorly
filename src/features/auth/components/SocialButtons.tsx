'use client';

import Facebook from '@/components/svg/social/Facebook';
import Google from '@/components/svg/social/Google';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

const SocialButtons = () => {
    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: 'google',
            callbackURL: '/',
        });
    };
    const handleFacebookLogin = async () => {
        await authClient.signIn.social({
            provider: 'facebook',
            callbackURL: '/',
        });
    };
    return (
        <div className="flex flex-col gap-4">
            <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
            >
                <Google /> Sign in with Google
            </Button>

            <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full"
                onClick={handleFacebookLogin}
            >
                <Facebook /> Sign in with Facebook
            </Button>
        </div>
    );
};

export default SocialButtons;
