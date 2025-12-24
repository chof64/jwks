import  { useState, useEffect } from 'react';
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export default function GenerateKeys() {
  const [privateKey, setPrivateKey] = useState('');
  const [jwks, setJwks] = useState('');

  useEffect(() => {
    const generateKeys = async () => {
      const keys = await generateKeyPair("RS256", {
        extractable: true,
      });
      const privKey = (await exportPKCS8(keys.privateKey))
        .replace(/\s/g, "")
        .trim();
      const pubKey = await exportJWK(keys.publicKey);
      const jwksData = JSON.stringify({ keys: [{ use: "sig", ...pubKey }] })
        .replace(/\s/g, "")
        .trim();
      setPrivateKey(privKey);
      setJwks(jwksData);
    };
    generateKeys();
  }, []);

  const copyPrivate = () => {
    navigator.clipboard.writeText(privateKey);
  };

  const copyJwks = () => {
    navigator.clipboard.writeText(jwks);
  };

  return (
    <>
      {/* Private Key Section */}
      <Card>
        <CardHeader>
          <CardTitle>JWT Private Key</CardTitle>
          <CardDescription>
            This private key is used to sign your JWTs. Keep it secure and never
            share it.
          </CardDescription>
          <CardAction>
            <Button onClick={copyPrivate}>Copy</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto p-4 max-h-64 rounded-lg bg-muted font-mono text-sm leading-none wrap-break-word whitespace-pre-wrap">
            <code>{privateKey}</code>
          </pre>
        </CardContent>
      </Card>

      {/* JWKS Section */}
      <Card>
        <CardHeader>
          <CardTitle>JWKS (JSON Web Key Set)</CardTitle>
          <CardDescription>
            This JWKS contains your public key for verifying JWT signatures. Share
            it with clients.
          </CardDescription>
          <CardAction>
            <Button onClick={copyJwks}>Copy</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto p-4 max-h-64 rounded-lg bg-muted font-mono text-sm leading-none wrap-break-word whitespace-pre-wrap">
            <code>{jwks}</code>
          </pre>
        </CardContent>
      </Card>
    </>
  );
}
