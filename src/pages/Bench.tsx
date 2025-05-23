import React, { useState, useCallback } from 'react';
import { Clock, Play, AlertCircle, CheckCircle } from 'lucide-react';
import { BSGSLibrary, libraries, libResults } from '../lib/libraries.ts'; // Assuming libraries is an array of BSGSLibrary objects

// Core interfaces and types
type BenchmarkResult = {
	library: string;
	threads?: number;
} & {
	[K in BitSize]?: number;
};

type BenchmarkResults = { [key: string]: BenchmarkResult }

interface BenchmarkRunnerProps {
	library: BSGSLibrary | null;
	nBitNumber: string;
	bitSize: BitSize;
	onResult?: (result: BenchmarkResult) => void;
}

type BitSize = 32 | 40 | 48;

// Benchmark timing component
const BenchmarkRunner: React.FC<BenchmarkRunnerProps> = ({
	library,
	nBitNumber,
	bitSize,
	onResult
}) => {
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [result, setResult] = useState<BenchmarkResult | null>();
	const [output, setOutput] = useState<string | null>();
	const [error, setError] = useState<string | null>(null);

	const runBenchmark = useCallback(async (): Promise<void> => {
		if (!library || !nBitNumber) {
			setError("Library/number not provided");
			return;
		}

		setIsRunning(true);
		setError(null);
		setResult(null);

		try {
			const startTime: number = performance.now();
			const output: bigint = await library.compute(BigInt(nBitNumber), bitSize);
			const endTime: number = performance.now();

			setOutput(output.toString(16));

			const benchmarkResult: BenchmarkResult = {
				library: library.name,
				[bitSize]: endTime - startTime
			};

			setResult(result ? { ...result, ...benchmarkResult } : benchmarkResult);
			if (onResult) {
				onResult(benchmarkResult);
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
			setError(errorMessage);
		} finally {
			setIsRunning(false);
		}
	}, [bitSize, library, nBitNumber, onResult, result]);

	const formatTime = (ms: number): string => {
		if (ms < 1000) return `${ms.toFixed(2)}ms`;
		return `${(ms / 1000).toFixed(2)}s`;
	};

	const isBitSizeSupported: boolean = Boolean(
		library && library.supportedBits.includes(bitSize)
	);

	return (
		<div className="border rounded-lg p-4 bg-white shadow-sm">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h3 className="text-lg font-semibold text-gray-800">
						{library?.name || 'No Library'}
					</h3>
					<p className="text-sm text-gray-600">
						Supported bits: {library?.supportedBits.join(', ') || 'None'}
					</p>
				</div>
				<button
					onClick={runBenchmark}
					disabled={isRunning || !library || !nBitNumber || !isBitSizeSupported}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
				>
					{isRunning ? (
						<>
							<div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
							Running...
						</>
					) : (
						<>
							<Play size={16} />
							Run Benchmark
						</>
					)}
				</button>
			</div>

			{!isBitSizeSupported && nBitNumber && (
				<div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
					<AlertCircle size={16} className="text-yellow-600" />
					<span className="text-sm text-yellow-700">
						This library doesn't support {bitSize}-bit numbers
					</span>
				</div>
			)}

			{error && (
				<div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md mb-4">
					<AlertCircle size={16} className="text-red-600" />
					<span className="text-sm text-red-700">Error: {error}</span>
				</div>
			)}

			{result && (
				<div className="bg-green-50 border border-green-200 rounded-md p-4">
					<div className="flex items-center gap-2 mb-3">
						{isRunning ? <>
							<Clock size={16} className="text-yellow-600" />
							<span className="text-sm font-medium text-yellow-700">Running Benchmark</span>
						</> : <>
							<CheckCircle size={16} className="text-green-600" />
							<span className="text-sm font-medium text-green-700">Benchmark Complete</span>
						</>}
					</div>

					<div className="grid grid-cols-3 gap-4 text-sm">
						{Object.keys(result).filter(k => k != 'library').map((key) => {
							return <div key={key}>
								<span className="text-gray-600">{key} Bits Time:</span>
								<div className="font-mono text-lg text-green-700">
									<Clock size={16} className="inline mr-1" />
									{formatTime(result[key as unknown as BitSize] as number)}
								</div>
							</div>
						})}

						<div className="col-span-2">
							<span className="text-gray-600">Output:</span>
							<div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
								{output}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

// Main benchmark interface
const WASMBenchmarkInterface: React.FC = () => {
	const [selectedBits, setSelectedBits] = useState<BitSize>(32);
	const [customNumber, setCustomNumber] = useState<string>('');
	const [results, setResults] = useState<BenchmarkResults>(libResults);

	// Generate random n-bit number
	const generateRandomNumber = (bits: number): string => {
		const hexChars = bits / 4;
		let result = '';
		result += Math.floor(8 + Math.random() * 8).toString(16);
		for (let i = 1; i < hexChars; i++) {
			result += Math.floor(Math.random() * 16).toString(16);
		}
		return '0x' + result;
	};

	const [currentNumber, setCurrentNumber] = useState<string>(() => generateRandomNumber(selectedBits));

	const handleBitChange = (bits: BitSize): void => {
		setSelectedBits(bits);
		if (!customNumber) {
			setCurrentNumber(generateRandomNumber(bits));
		}
	};

	const handleCustomNumberChange = (value: string): void => {
		setCustomNumber(value);
		setCurrentNumber(value);
	};

	const handleBenchmarkResult = (result: BenchmarkResult): void => {
		setResults(prev => {
			const lib = result.library;
			prev[lib] = prev[lib] || {};

			return { ...prev, [lib]: { ...prev[lib], ...result } };
		}); // Keep last 10 results
	};

	const handleRandomGenerate = (): void => {
		const newNumber = generateRandomNumber(selectedBits);
		setCurrentNumber(newNumber);
		setCustomNumber('');
	};

	const bitOptions: readonly BitSize[] = [32, 40, 48] as const;

	return (
		<div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
			<h1 className="text-3xl font-bold text-gray-800 mb-8">
				WASM Baby Step Giant Step Benchmark
			</h1>

			{/* Input Configuration */}
			<div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
				<h2 className="text-xl font-semibold mb-4">Input Configuration</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Bit Size
						</label>
						<select
							value={selectedBits}
							onChange={(e) => handleBitChange(parseInt(e.target.value) as BitSize)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{bitOptions.map(bits => (
								<option key={bits} value={bits}>{bits} bits</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Current Number
						</label>
						<div className="flex gap-2">
							<input
								type="text"
								value={currentNumber}
								onChange={(e) => handleCustomNumberChange(e.target.value)}
								placeholder="Enter hex number or use generated"
								className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
							/>
							<button
								onClick={handleRandomGenerate}
								className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
								type="button"
							>
								Random
							</button>
						</div>
						<p className="text-xs text-gray-500 mt-1">
							Current: {selectedBits} bits ({currentNumber})
						</p>
					</div>
				</div>
			</div>

			{/* Benchmark Runners */}
			<div className="space-y-4 mb-6">
				<h2 className="text-xl font-semibold">Library Benchmarks</h2>
				{libraries.map((library, index) => (
					<BenchmarkRunner
						key={`${library.name}-${index}`}
						library={library}
						bitSize={selectedBits}
						nBitNumber={currentNumber}
						onResult={handleBenchmarkResult}
					/>
				))}
			</div>

			{/* Results History */}
			{Object.keys(results).length > 0 && (
				<div className="bg-white rounded-lg p-6 shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Recent Results</h2>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b">
									<th className="text-left py-2">Library</th>
									<th className="text-left py-2">Threads</th>
									{bitOptions.map(bits => (
										<th key={bits} className="text-left py-2">{bits} Bits</th>
									))}
								</tr>
							</thead>
							<tbody>
								{Object.keys(results).map((lib) => {
									const result = { [32]: 0, [40]: 0, [48]: 0, ...results[lib] };
									return <tr key={lib} className="border-b">
										<td className="py-2">{result.library}</td>
										<td className="py-2 pl-6">{result.threads || 1}</td>
										{bitOptions.map(bits => <td key={bits} className="py-2">
											{result[bits] == 0
												? <p className='opacity-50'>No support</p>
												: result[bits] < 1000 ?
													`${result[bits].toFixed(2)}ms`
													: `${(result[bits] / 1000).toFixed(2)}s`}</td>
										)}
									</tr>
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};

export default WASMBenchmarkInterface;

// Export types for use in other modules
export type {
	BenchmarkResult,
	BenchmarkRunnerProps,
	BitSize
};