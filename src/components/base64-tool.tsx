import { useState } from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

type Mode = "encode" | "decode";

export default function Base64Tool() {
	const [mode, setMode] = useState<Mode>("encode");
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");

	const isEncode = mode === "encode";

	const handleInputChange = (value: string) => {
		setInput(value);
		setError("");
		if (!value) {
			setOutput("");
			return;
		}
		try {
			if (isEncode) {
				setOutput(btoa(unescape(encodeURIComponent(value))));
			} else {
				const bytes = atob(value.replace(/\s/g, ""));
				setOutput(decodeURIComponent(escape(bytes)));
			}
		} catch {
			setOutput("");
			setError(isEncode ? "Failed to encode input." : "Invalid Base64 input.");
		}
	};

	const handleModeChange = (nextMode: Mode) => {
		setMode(nextMode);
		setError("");
		setInput("");
		setOutput("");
	};

	const swap = () => {
		setInput(output);
		setOutput("");
		setError("");
	};

	const clear = () => {
		setInput("");
		setOutput("");
		setError("");
	};

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Base64 Encoder / Decoder</CardTitle>
					<CardDescription>
						Encode text to Base64 or decode Base64 back to text. UTF-8 safe.
					</CardDescription>
					<CardAction>
						<div className="flex gap-2">
							<Button
								variant={isEncode ? "default" : "outline"}
								size="sm"
								onClick={() => handleModeChange("encode")}
							>
								Encode
							</Button>
							<Button
								variant={!isEncode ? "default" : "outline"}
								size="sm"
								onClick={() => handleModeChange("decode")}
							>
								Decode
							</Button>
						</div>
					</CardAction>
				</CardHeader>
				<CardContent className="space-y-4">
					<textarea
						value={input}
						onChange={(e) => handleInputChange(e.target.value)}
						placeholder={isEncode ? "Text to encode" : "Base64 to decode"}
						rows={6}
						className="w-full rounded-lg border border-border bg-muted p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-ring/50"
					/>
					<div className="flex items-center justify-between">
						{error ? (
							<p className="text-sm text-destructive">{error}</p>
						) : (
							<p className="text-sm text-muted-foreground">
								{isEncode ? "Encoded" : "Decoded"} output
							</p>
						)}
						<div className="flex gap-2">
							{output && (
								<Button variant="ghost" size="sm" onClick={swap}>
									Swap
								</Button>
							)}
							<Button variant="outline" size="sm" onClick={clear}>
								Clear
							</Button>
						</div>
					</div>
					<textarea
						value={output}
						readOnly
						placeholder="Output appears here"
						rows={6}
						className="w-full rounded-lg border border-border bg-muted p-4 font-mono text-sm outline-none"
					/>
					<div className="flex justify-end">
						<Button
							onClick={() => navigator.clipboard.writeText(output)}
							disabled={!output}
						>
							Copy
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
