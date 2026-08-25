import { useRef, useState } from "react";
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
type InputType = "text" | "file";

const TEXTAREA_CLASS =
	"w-full rounded-lg border border-border bg-muted p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-ring/50";
const INPUT_CLASS =
	"w-full rounded-lg border border-border bg-muted px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring/50";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	const chunkSize = 0x8000;
	let binary = "";
	for (let i = 0; i < bytes.length; i += chunkSize) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
	}
	return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
	const binary = atob(base64.replace(/\s/g, ""));
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function detectFileSignature(
	bytes: Uint8Array
): { mimeType: string; ext: string } | null {
	const at = (offset: number, ...signature: number[]) =>
		signature.every((b, i) => bytes[offset + i] === b);

	if (bytes.length >= 8 && at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))
		return { mimeType: "image/png", ext: "png" };
	if (bytes.length >= 3 && at(0, 0xff, 0xd8, 0xff))
		return { mimeType: "image/jpeg", ext: "jpg" };
	if (bytes.length >= 6 && at(0, 0x47, 0x49, 0x46, 0x38))
		return { mimeType: "image/gif", ext: "gif" };
	if (bytes.length >= 4 && at(0, 0x50, 0x4b, 0x03, 0x04))
		return { mimeType: "application/zip", ext: "zip" };
	if (bytes.length >= 5 && at(0, 0x25, 0x50, 0x44, 0x46))
		return { mimeType: "application/pdf", ext: "pdf" };
	if (bytes.length >= 2 && at(0, 0x1f, 0x8b))
		return { mimeType: "application/gzip", ext: "gz" };
	if (bytes.length >= 2 && at(0, 0x42, 0x4d))
		return { mimeType: "image/bmp", ext: "bmp" };
	if (bytes.length >= 3 && at(0, 0x49, 0x44, 0x33))
		return { mimeType: "audio/mpeg", ext: "mp3" };
	if (bytes.length >= 4 && at(0, 0x00, 0x00, 0x01, 0x00))
		return { mimeType: "image/x-icon", ext: "ico" };
	if (
		bytes.length >= 12 &&
		at(0, 0x52, 0x49, 0x46, 0x46) &&
		at(8, 0x57, 0x41, 0x56, 0x45)
	)
		return { mimeType: "audio/wav", ext: "wav" };
	if (bytes.length >= 12 && at(4, 0x66, 0x74, 0x79, 0x70)) {
		if (at(8, 0x6d, 0x70, 0x34)) return { mimeType: "video/mp4", ext: "mp4" };
		if (at(8, 0x4d, 0x34, 0x56)) return { mimeType: "video/mp4", ext: "m4v" };
		if (at(8, 0x71, 0x74, 0x20)) return { mimeType: "video/quicktime", ext: "mov" };
	}
	if (bytes.length >= 4 && at(0, 0x4f, 0x67, 0x67, 0x53))
		return { mimeType: "audio/ogg", ext: "ogg" };
	if (bytes.length >= 4 && at(0, 0x1a, 0x45, 0xdf, 0xa3))
		return { mimeType: "video/webm", ext: "webm" };
	if (bytes.length >= 3 && at(0, 0xef, 0xbb, 0xbf))
		return { mimeType: "text/plain", ext: "txt" };
	if (bytes.length >= 1 && bytes[0] === 0x7b)
		return { mimeType: "application/json", ext: "json" };
	return null;
}

function FileEncodePanel() {
	const [file, setFile] = useState<File | null>(null);
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFile = (selected: File | null) => {
		setOutput("");
		setError("");
		if (!selected) return;
		setFile(selected);
		setLoading(true);
		const reader = new FileReader();
		reader.onload = () => {
			try {
				setOutput(arrayBufferToBase64(reader.result as ArrayBuffer));
			} catch {
				setError("Failed to encode file.");
			} finally {
				setLoading(false);
			}
		};
		reader.onerror = () => {
			setError("Could not read file.");
			setLoading(false);
		};
		reader.readAsArrayBuffer(selected);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<input
					ref={inputRef}
					type="file"
					hidden
					onChange={(e) => {
						handleFile(e.target.files?.[0] ?? null);
						e.target.value = "";
					}}
				/>
				<Button
					variant="outline"
					onClick={() => inputRef.current?.click()}
				>
					{file ? "Choose another file" : "Choose a file"}
				</Button>
				{file && (
					<div className="min-w-0">
						<p className="truncate text-sm font-medium">{file.name}</p>
						<p className="text-xs text-muted-foreground">
							{formatBytes(file.size)}
						</p>
					</div>
				)}
			</div>
			{loading && <p className="text-sm text-muted-foreground">Encoding…</p>}
			{error && <p className="text-sm text-destructive">{error}</p>}
			{output && (
				<>
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">Base64 output</p>
						<div className="flex gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => navigator.clipboard.writeText(output)}
							>
								Copy
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									downloadBlob(
										new Blob([output], { type: "text/plain;charset=utf-8" }),
										`${file?.name ?? "file"}.b64`
									)
								}
							>
								Download .b64
							</Button>
						</div>
					</div>
					<textarea
						value={output}
						readOnly
						rows={8}
						placeholder="Base64 output appears here"
						className={TEXTAREA_CLASS}
					/>
				</>
			)}
		</div>
	);
}

function FileDecodePanel() {
	const [base64, setBase64] = useState("");
	const [fileName, setFileName] = useState("decoded");
	const [error, setError] = useState("");
	const [saved, setSaved] = useState<{ name: string; size: number } | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const detected = (() => {
		try {
			return detectFileSignature(base64ToBytes(base64));
		} catch {
			return null;
		}
	})();

	const handleLoadFile = (selected: File | null) => {
		setError("");
		setSaved(null);
		if (!selected) return;
		setFileName(selected.name.replace(/\.[a-zA-Z0-9]+$/, ""));
		const reader = new FileReader();
		reader.onload = () => {
			setBase64(String(reader.result));
		};
		reader.onerror = () => {
			setError("Could not read file.");
		};
		reader.readAsText(selected);
	};

	const handleDownload = () => {
		setError("");
		setSaved(null);
		const trimmed = base64.replace(/\s/g, "");
		if (!trimmed) return;
		try {
			const bytes = base64ToBytes(trimmed);
			const detectedType = detectFileSignature(bytes);
			let name = fileName.trim() || "decoded";
			if (!/\.[a-zA-Z0-9]{1,8}$/.test(name) && detectedType) {
				name = `${name}.${detectedType.ext}`;
			}
			downloadBlob(
				new Blob([bytes], detectedType ? { type: detectedType.mimeType } : {}),
				name
			);
			setSaved({ name, size: bytes.byteLength });
		} catch {
			setError("Invalid Base64 input.");
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<input
					ref={inputRef}
					type="file"
					hidden
					onChange={(e) => {
						handleLoadFile(e.target.files?.[0] ?? null);
						e.target.value = "";
					}}
				/>
				<Button
					variant="outline"
					onClick={() => inputRef.current?.click()}
				>
					Load base64 from file
				</Button>
			</div>
			<textarea
				value={base64}
				onChange={(e) => {
					setBase64(e.target.value);
					setError("");
					setSaved(null);
				}}
				placeholder="Paste Base64 here, or load a .b64 / .txt file above"
				rows={6}
				className={TEXTAREA_CLASS}
			/>
			{error && <p className="text-sm text-destructive">{error}</p>}
			{detected && (
				<p className="text-xs text-muted-foreground">
					Detected file type: {detected.mimeType} (.{detected.ext})
				</p>
			)}
			<div className="flex items-end gap-3">
				<div className="min-w-0 flex-1 space-y-1">
					<label
						htmlFor="output-name"
						className="block text-sm text-muted-foreground"
					>
						Output file name
					</label>
					<input
						id="output-name"
						value={fileName}
						onChange={(e) => setFileName(e.target.value)}
						className={INPUT_CLASS}
					/>
				</div>
				<Button
					onClick={handleDownload}
					disabled={!base64.replace(/\s/g, "")}
				>
					Download file
				</Button>
			</div>
			{saved && (
				<p className="text-sm text-muted-foreground">
					Downloaded {saved.name} ({formatBytes(saved.size)})
				</p>
			)}
		</div>
	);
}

export default function Base64Tool() {
	const [mode, setMode] = useState<Mode>("encode");
	const [inputType, setInputType] = useState<InputType>("text");
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

	const handleTypeChange = (nextType: InputType) => {
		setInputType(nextType);
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
						Encode text or files to Base64, or decode Base64 back to text or
						downloadable files. Everything runs locally in your browser.
					</CardDescription>
					<CardAction>
						<div className="flex flex-col items-end gap-2">
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
							<div className="flex gap-2">
								<Button
									variant={inputType === "text" ? "default" : "outline"}
									size="sm"
									onClick={() => handleTypeChange("text")}
								>
									Text
								</Button>
								<Button
									variant={inputType === "file" ? "default" : "outline"}
									size="sm"
									onClick={() => handleTypeChange("file")}
								>
									File
								</Button>
							</div>
						</div>
					</CardAction>
				</CardHeader>
				<CardContent className="space-y-4">
					{inputType === "file" ? (
						isEncode ? (
							<FileEncodePanel />
						) : (
							<FileDecodePanel />
						)
					) : (
						<>
							<textarea
								value={input}
								onChange={(e) => handleInputChange(e.target.value)}
								placeholder={isEncode ? "Text to encode" : "Base64 to decode"}
								rows={6}
								className={TEXTAREA_CLASS}
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
								className={TEXTAREA_CLASS}
							/>
							<div className="flex justify-end">
								<Button
									onClick={() => navigator.clipboard.writeText(output)}
									disabled={!output}
								>
									Copy
								</Button>
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
