"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther, parseEther, parseUnits } from "viem";
import { contractAddress, contractABI } from "@/lib/contracts/contracts";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { Wallet, TrendingDown, DollarSign, PiggyBank, Settings, Coins, BarChart3, Shield, RefreshCw, AlertTriangle } from "lucide-react";
import ParticlesBackground from "@/components/particles-background";

export default function LendFiDashboard() {
    const { address, isConnected } = useAccount();
    const { data: hash, writeContractAsync } = useWriteContract();

    // --- AÑADIDO: Constantes del Protocolo ---
    const LIQUIDATION_THRESHOLD = 110;
    const LIQUIDATION_BONUS = 5;
    
    // --- Estados para los Formularios ---
    const [lendAmount, setLendAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [collateralAmount, setCollateralAmount] = useState("");
    const [borrowLoanAmount, setBorrowLoanAmount] = useState("");
    const [liquidateAddress, setLiquidateAddress] = useState("");
    const [mintAddress, setMintAddress] = useState("");
    const [mintAmount, setMintAmount] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [checkAddress, setCheckAddress] = useState("");

    // --- Lectura de Datos del Contrato ---
    const { data: totalLiquidity, refetch: refetchTotalLiquidity } = useReadContract({ address: contractAddress, abi: contractABI, functionName: "totalLiquidity" });
    const { data: totalBorrows, refetch: refetchTotalBorrows } = useReadContract({ address: contractAddress, abi: contractABI, functionName: "totalBorrows" });
    const { data: collateralPrice, refetch: refetchCollateralPrice } = useReadContract({ address: contractAddress, abi: contractABI, functionName: "collateralPrice" });
    const { data: protocolFees, refetch: refetchProtocolFees } = useReadContract({ address: contractAddress, abi: contractABI, functionName: "protocolFees" });
    const { data: owner } = useReadContract({ address: contractAddress, abi: contractABI, functionName: "owner" });
    
    const { data: myStkBalance, refetch: refetchMyStkBalance } = useReadContract({ address: contractAddress, abi: contractABI, functionName: "stkBalances", args: [address] });
    const { data: myLiquidity, refetch: refetchMyLiquidity } = useReadContract({ address: contractAddress, abi: contractABI, functionName: "liquidityProvided", args: [address] });
    const { data: myLoan, refetch: refetchMyLoan } = useReadContract({ address: contractAddress, abi: contractABI, functionName: "loans", args: [address] });
    const { data: myHealthFactor, refetch: refetchMyHealthFactor } = useReadContract({ address: contractAddress, abi: contractABI, functionName: "checkLoanHealth", args: [address] });
    const { data: checkedHealthFactor, refetch: refetchCheckedHealthFactor } = useReadContract({ address: contractAddress, abi: contractABI, functionName: "checkLoanHealth", args: [checkAddress] });

    // --- Lógica de Transacciones y Refresco Automático ---
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isConfirmed) {
            refetchAllData();
        }
    }, [isConfirmed]);

    const refetchAllData = () => {
        refetchTotalLiquidity(); refetchTotalBorrows(); refetchCollateralPrice();
        refetchProtocolFees(); refetchMyStkBalance(); refetchMyLiquidity();
        refetchMyLoan(); refetchMyHealthFactor(); refetchCheckedHealthFactor();
    };

    const handleTx = async (functionName: string, args?: any[], value?: bigint) => {
        if (!isConnected) { alert("Please connect your wallet"); return; }
        try {
            await writeContractAsync({ address: contractAddress, abi: contractABI, functionName, args, value });
        } catch (err) { console.error(err); alert("Transaction failed: " + (err as any).shortMessage); }
    };
    
    // --- Renderizado y Formateo ---
    const format = (value: unknown): string => {
        if (typeof value === 'bigint') {
            return parseFloat(formatEther(value)).toFixed(2);
        }
        return "0.00";
    };
    
    const myLoanData = myLoan as [bigint, bigint, boolean] | undefined;
    const loanExists = myLoanData && myLoanData[2];

    return (
        <div className="min-h-screen gradient-bg text-gray-100 relative overflow-hidden">
            <ParticlesBackground />
            <header className="relative z-10 border-b border-gray-800 bg-gray-900/60 backdrop-blur-strong">
                <div className="container mx-auto px-4 py-4"><div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-2">
                            <div className="w-9 h-9 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center glow-blue"><Coins className="h-5 w-5 text-white" /></div>
                            <h1 className="text-2xl font-bold gradient-text pulse-slow">Block Bank</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 ml-auto"><ConnectWalletButton /></div>
                </div></div>
            </header>
            
            <div className="relative z-10 bg-gray-800/40 backdrop-blur-strong border-b border-gray-700">
                <div className="container mx-auto px-4 py-2"><div className="flex items-center justify-between">
                    <div className="text-sm text-gray-300">Status: {isConfirming ? "Processing..." : isConfirmed ? "Success!" : "Ready"}</div>
                    <Button variant="ghost" size="sm" onClick={refetchAllData} className="text-gray-400 hover:text-gray-100 hover:bg-gray-800/60 transition-smooth hover:scale-105"><RefreshCw className="h-4 w-4 mr-1" />Refresh</Button>
                </div></div>
            </div>

            <main className="relative z-10 container mx-auto px-4 py-8">
                <Tabs defaultValue="dashboard" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 bg-gray-800/60 backdrop-blur-strong border border-gray-700">
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="lend">Lend</TabsTrigger>
                        <TabsTrigger value="borrow">Borrow</TabsTrigger>
                        <TabsTrigger value="liquidate">Liquidate</TabsTrigger>
                        {isConnected && address === owner && <TabsTrigger value="admin">Admin</TabsTrigger>}
                    </TabsList>

                    {/* Dashboard Tab */}
                    <TabsContent value="dashboard" className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="bg-gray-800/70 backdrop-blur-strong border-gray-700 card-hover"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Liquidity</CardTitle><PiggyBank className="h-4 w-4 text-green-400" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-400">{format(totalLiquidity)} STK</div><p className="text-xs text-gray-400">Available for lending</p></CardContent></Card>
                            <Card className="bg-gray-800/70 backdrop-blur-strong border-gray-700 card-hover"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Borrows</CardTitle><TrendingDown className="h-4 w-4 text-red-400" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-400">{format(totalBorrows)} STK</div><p className="text-xs text-gray-400">Currently borrowed</p></CardContent></Card>
                            <Card className="bg-gray-800/70 backdrop-blur-strong border-gray-700 card-hover"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">ETH Price (in STK)</CardTitle><BarChart3 className="h-4 w-4 text-cyan-400" /></CardHeader><CardContent><div className="text-2xl font-bold text-cyan-400">{collateralPrice?.toString()} STK</div><p className="text-xs text-gray-400">Current collateral rate</p></CardContent></Card>
                            <Card className="bg-gray-800/70 backdrop-blur-strong border-gray-700 card-hover"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Protocol Fees</CardTitle><DollarSign className="h-4 w-4 text-yellow-400" /></CardHeader><CardContent><div className="text-2xl font-bold text-yellow-400">{format(protocolFees)} STK</div><p className="text-xs text-gray-400">Accumulated for owner</p></CardContent></Card>
                        </div>
                        {isConnected && (
                            <Card className="bg-gray-800/70 backdrop-blur-strong border-gray-700 card-hover"><CardHeader><CardTitle>Your Position</CardTitle></CardHeader><CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div><Label>Your STK Balance</Label><p className="font-mono text-green-400">{format(myStkBalance)}</p></div>
                                <div><Label>Your Liquidity</Label><p className="font-mono text-cyan-400">{format(myLiquidity)}</p></div>
                                <div><Label>Your Debt</Label><p className="font-mono text-red-400">{loanExists ? format(myLoanData?.[0]) : "0.00"}</p></div>
                                <div><Label>Health Factor</Label><p className="font-mono text-yellow-400">{loanExists ? myHealthFactor?.toString() : "N/A"}</p></div>
                            </CardContent></Card>
                        )}
                    </TabsContent>

                    {/* Lend Tab */}
                    <TabsContent value="lend" className="mt-6">
                        <Card className="max-w-2xl mx-auto bg-gray-800/70 backdrop-blur-strong border-gray-700 card-hover">
                            <CardHeader><CardTitle>Lend & Withdraw Liquidity</CardTitle><CardDescription>Provide STK to the pool to earn interest from borrowers.</CardDescription></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><Label className="text-gray-400">Your STK Balance</Label><p className="font-semibold text-green-400">{format(myStkBalance)} STK</p></div>
                                    <div><Label className="text-gray-400">Your Liquidity Provided</Label><p className="font-semibold text-cyan-400">{format(myLiquidity)} STK</p></div>
                                </div>
                                <form onSubmit={(e) => { e.preventDefault(); handleTx("depositLiquidity", [parseEther(lendAmount)]); }} className="flex gap-3 items-end">
                                    <div className="flex-1 space-y-2"><Label htmlFor="lendAmount">Amount to Lend (STK)</Label><Input id="lendAmount" value={lendAmount} onChange={e => setLendAmount(e.target.value)} placeholder="1000" type="number" className="bg-gray-700 border-gray-600 focus-enhanced" /></div>
                                    <Button type="submit" className="bg-green-600 hover:bg-green-700 glow-green transition-smooth hover:scale-105">Lend</Button>
                                </form>
                                <form onSubmit={(e) => { e.preventDefault(); handleTx("withdrawLiquidity", [parseEther(withdrawAmount)]); }} className="flex gap-3 items-end">
                                    <div className="flex-1 space-y-2"><Label htmlFor="withdrawAmount">Amount to Withdraw (STK)</Label><Input id="withdrawAmount" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="500" type="number" className="bg-gray-700 border-gray-600 focus-enhanced" /></div>
                                    <Button type="submit" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 glow-cyan transition-smooth hover:scale-105">Withdraw</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Borrow Tab */}
                    <TabsContent value="borrow" className="mt-6">
                         <Card className="max-w-2xl mx-auto bg-gray-800/70 backdrop-blur-strong border-gray-700 card-hover">
                            <CardHeader><CardTitle>{loanExists ? "Manage Your Loan" : "Take a Loan"}</CardTitle><CardDescription>{loanExists ? "You have an active loan. You must repay it to withdraw your collateral." : "Deposit ETH as collateral to borrow STK."}</CardDescription></CardHeader>
                            <CardContent>
                                {loanExists ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div><Label className="text-gray-400">Your Current Debt</Label><p className="font-semibold text-red-400">{format(myLoanData?.[0])} STK</p></div>
                                            <div><Label className="text-gray-400">Your ETH Collateral</Label><p className="font-semibold text-purple-400">{format(myLoanData?.[1])} ETH</p></div>
                                        </div>
                                        <div><Label className="text-gray-400">Health Factor</Label><p className={`font-semibold ${Number(myHealthFactor || 0) < LIQUIDATION_THRESHOLD ? "text-red-500 animate-pulse" : "text-green-400"}`}>{myHealthFactor?.toString()}</p></div>
                                        <Button onClick={() => handleTx("repay")} className="w-full bg-blue-600 hover:bg-blue-700 glow-blue transition-smooth hover:scale-105">Repay Full Loan & Withdraw Collateral</Button>
                                    </div>
                                ) : (
                                    <form onSubmit={(e) => { e.preventDefault(); handleTx("borrow", undefined, parseEther(collateralAmount)); }} className="space-y-4">
                                        <div className="space-y-2"><Label htmlFor="collateralAmount">Amount to Deposit (ETH)</Label><Input id="collateralAmount" value={collateralAmount} onChange={e => setCollateralAmount(e.target.value)} placeholder="0.5" type="number" className="bg-gray-700 border-gray-600 focus-enhanced" /></div>
                                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 glow-red transition-smooth hover:scale-105">Borrow Max STK</Button>
                                    </form>
                                )}
                            </CardContent>
                         </Card>
                    </TabsContent>
                    
                    {/* Liquidate Tab */}
                     <TabsContent value="liquidate" className="mt-6">
                        <Card className="max-w-2xl mx-auto bg-gray-800/70 backdrop-blur-strong border-gray-700 card-hover">
                            <CardHeader><CardTitle>Liquidate Risky Loans</CardTitle><CardDescription>Repay a risky loan (Health Factor {'<'} {LIQUIDATION_THRESHOLD}) to receive its collateral at a {LIQUIDATION_BONUS}% bonus.</CardDescription></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1 space-y-2"><Label htmlFor="checkAddress">Borrower Address</Label><Input id="checkAddress" value={checkAddress} onChange={e => setCheckAddress(e.target.value)} placeholder="0x..."/></div>
                                    <Button onClick={() => refetchCheckedHealthFactor()}>Check Health</Button>
                                </div>
                                {checkAddress && <div className="text-sm"><Label>Health Factor:</Label> <p className="font-mono">{checkedHealthFactor?.toString() ?? "N/A"}</p></div>}
                                <Button onClick={() => handleTx("liquidate", [checkAddress])} className="w-full" variant="destructive" disabled={!checkAddress || (checkedHealthFactor ? Number(checkedHealthFactor) : 1000) >= LIQUIDATION_THRESHOLD}>Liquidate</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Admin Tab */}
                    {isConnected && address === owner && (
                        <TabsContent value="admin" className="mt-6">
                            <Card className="bg-gray-800/70 backdrop-blur-strong border-gray-700 card-hover">
                                <CardHeader><CardTitle className="flex items-center space-x-2"><Shield className="text-yellow-400"/><span>Admin Panel</span></CardTitle><CardDescription>Owner-only functions. Use with caution.</CardDescription></CardHeader>
                                <CardContent className="grid md:grid-cols-3 gap-6">
                                    <form onSubmit={(e) => { e.preventDefault(); handleTx("mintMockSTK", [mintAddress, parseUnits(mintAmount, 18)]); }} className="space-y-2 p-4 border border-gray-700 rounded-lg">
                                        <Label>Mint STK</Label>
                                        <Input value={mintAddress} onChange={e => setMintAddress(e.target.value)} placeholder="Address to receive"/>
                                        <Input value={mintAmount} onChange={e => setMintAmount(e.target.value)} placeholder="Amount (e.g., 10000)"/>
                                        <Button type="submit" className="w-full">Mint</Button>
                                    </form>
                                    <form onSubmit={(e) => { e.preventDefault(); handleTx("updateCollateralPrice", [BigInt(newPrice)]); }} className="space-y-2 p-4 border border-gray-700 rounded-lg">
                                        <Label>Update ETH Price</Label>
                                        <Input value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="New ETH Price in STK"/>
                                        <p className="text-xs text-gray-400">Current: {collateralPrice?.toString()}</p>
                                        <Button type="submit" className="w-full">Update</Button>
                                    </form>
                                    <div className="space-y-2 p-4 border border-gray-700 rounded-lg">
                                        <Label>Withdraw Fees</Label>
                                        <p className="font-mono text-yellow-400 text-lg">{format(protocolFees)} STK</p>
                                        <Button onClick={() => handleTx("withdrawFees")} className="w-full">Withdraw</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}
                </Tabs>
                {isConfirming && <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-lg animate-pulse">Processing transaction...</div>}
                {isConfirmed && <div className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-lg">Transaction successful!</div>}
            </main>
        </div>
    );
}
